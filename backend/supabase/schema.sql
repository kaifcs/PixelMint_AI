create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  plan text not null default 'FREE' check (plan in ('FREE', 'PRO')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.processed_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  original_image_url text not null,
  original_public_id text,
  processed_image_url text not null,
  processed_public_id text,
  source_filename text not null,
  status text not null default 'completed',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists processed_images_user_created_at_idx
  on public.processed_images (user_id, created_at desc);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('PRO')),
  amount integer not null,
  currency text not null,
  status text not null default 'created',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists payment_orders_user_created_at_idx
  on public.payment_orders (user_id, created_at desc);
