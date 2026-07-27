-- Migration: Production Security, RLS, Webhook Idempotency, and Atomic RPCs

-- =====================================================
-- 1. Create processed_webhooks table for payment idempotency
-- =====================================================

CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  event_id TEXT PRIMARY KEY,
  payment_id TEXT UNIQUE,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'processed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =====================================================
-- 2. Add Cloudinary public_id columns if missing
-- =====================================================

ALTER TABLE public.processed_images
ADD COLUMN IF NOT EXISTS original_public_id TEXT;

ALTER TABLE public.processed_images
ADD COLUMN IF NOT EXISTS processed_public_id TEXT;

-- =====================================================
-- 3. Enable Row Level Security
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Profiles Policies
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own profile"
ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile"
ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile"
ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile"
ON public.profiles;

CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- =====================================================
-- 5. Processed Images Policies
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own processed images"
ON public.processed_images;

CREATE POLICY "Users can view their own processed images"
ON public.processed_images
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own processed images"
ON public.processed_images;

CREATE POLICY "Users can insert their own processed images"
ON public.processed_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own processed images"
ON public.processed_images;

CREATE POLICY "Users can delete their own processed images"
ON public.processed_images
FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 6. Payment Orders Policies
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own payment orders"
ON public.payment_orders;

CREATE POLICY "Users can view their own payment orders"
ON public.payment_orders
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment orders"
ON public.payment_orders;

CREATE POLICY "Users can insert their own payment orders"
ON public.payment_orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 7. Atomic RPC: Process Razorpay Webhook Idempotently
-- =====================================================

CREATE OR REPLACE FUNCTION public.process_payment_webhook_atomic(
  p_order_id TEXT,
  p_payment_id TEXT,
  p_event_id TEXT,
  p_user_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_event TEXT;
  v_existing_payment TEXT;
BEGIN

  SELECT event_id
  INTO v_existing_event
  FROM public.processed_webhooks
  WHERE event_id = p_event_id;

  IF FOUND THEN
    RETURN 'DUPLICATE_EVENT_IGNORED';
  END IF;

  IF p_payment_id IS NOT NULL THEN

    SELECT payment_id
    INTO v_existing_payment
    FROM public.processed_webhooks
    WHERE payment_id = p_payment_id;

    IF FOUND THEN
      RETURN 'DUPLICATE_PAYMENT_IGNORED';
    END IF;

  END IF;

  INSERT INTO public.processed_webhooks (
    event_id,
    payment_id,
    order_id,
    status
  )
  VALUES (
    p_event_id,
    p_payment_id,
    p_order_id,
    'processed'
  );

  UPDATE public.payment_orders
  SET
    status = 'paid',
    razorpay_payment_id = COALESCE(p_payment_id, razorpay_payment_id),
    updated_at = timezone('utc', now())
  WHERE razorpay_order_id = p_order_id;

  IF p_user_id IS NOT NULL THEN

    UPDATE public.profiles
    SET
      plan = 'PRO',
      updated_at = timezone('utc', now())
    WHERE id = p_user_id;

  END IF;

  RETURN 'SUCCESS';

END;
$$;

-- =====================================================
-- 8. Atomic RPC: Quota Check & Record Image Processing
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_and_record_image_processing_atomic(
  p_user_id UUID,
  p_limit INTEGER,
  p_original_url TEXT,
  p_original_public_id TEXT,
  p_processed_url TEXT,
  p_processed_public_id TEXT,
  p_filename TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today_count INTEGER;
BEGIN

  SELECT COUNT(*)
  INTO v_today_count
  FROM public.processed_images
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('day', timezone('utc', now()));

  IF v_today_count >= p_limit THEN
    RETURN 'QUOTA_EXCEEDED';
  END IF;

  INSERT INTO public.processed_images (
    user_id,
    original_image_url,
    original_public_id,
    processed_image_url,
    processed_public_id,
    source_filename,
    status
  )
  VALUES (
    p_user_id,
    p_original_url,
    p_original_public_id,
    p_processed_url,
    p_processed_public_id,
    p_filename,
    'completed'
  );

  RETURN 'SUCCESS';

END;
$$;

-- =====================================================
-- 9. Atomic RPC: Delete User Account
-- =====================================================

CREATE OR REPLACE FUNCTION public.delete_user_account_atomic(
  p_user_id UUID
)
RETURNS TABLE(
  original_url TEXT,
  original_pub_id TEXT,
  processed_url TEXT,
  processed_pub_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

  RETURN QUERY
  SELECT
    original_image_url,
    original_public_id,
    processed_image_url,
    processed_public_id
  FROM public.processed_images
  WHERE user_id = p_user_id;

  DELETE FROM public.processed_images
  WHERE user_id = p_user_id;

  DELETE FROM public.payment_orders
  WHERE user_id = p_user_id;

  DELETE FROM public.profiles
  WHERE id = p_user_id;

END;
$$;

-- =====================================================
-- 10. Performance Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_processed_images_user_created_at
ON public.processed_images(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_payment_id
ON public.processed_webhooks(payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id
ON public.payment_orders(razorpay_order_id);