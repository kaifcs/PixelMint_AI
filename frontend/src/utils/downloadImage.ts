import { toast } from "sonner";

/**
 * Extracts or infers the file extension from the URL or Blob MIME type.
 * Defaults to "png" for transparent cutouts.
 */
const getExtension = (url: string, blobType?: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (match && match[1]) {
      const ext = match[1].toLowerCase();
      if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) {
        return ext;
      }
    }
  } catch {
    // Ignore URL parsing errors for data URLs or relative paths
  }

  if (blobType) {
    if (blobType.includes("png")) return "png";
    if (blobType.includes("jpeg") || blobType.includes("jpg")) return "png"; // preserve transparent cutout format if ambiguous
    if (blobType.includes("webp")) return "webp";
    if (blobType.includes("gif")) return "gif";
  }

  return "png";
};

/**
 * Generates a timestamped default filename when one is not supplied.
 */
const generateFilename = (ext: string): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const HH = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `pixelmint-ai-removed-bg-${yyyy}-${MM}-${dd}-${HH}-${mm}-${ss}.${ext}`;
};

/**
 * Robust download utility that fetches an image from Cloudinary, Supabase Storage,
 * or public URLs, converts it to a Blob, and triggers a direct local filesystem download
 * without opening a new browser tab or navigating away.
 */
export async function downloadImage(imageUrl: string, filename?: string): Promise<void> {
  try {
    // 1. Fetch the image from Cloudinary, Supabase Storage, or Public URLs
    let response: Response;
    try {
      response = await fetch(imageUrl, { mode: "cors", credentials: "omit" });
    } catch {
      // Fallback if strict CORS mode fails in certain environments
      response = await fetch(imageUrl);
    }

    if (!response.ok) {
      throw new Error(`Server responded with HTTP status ${response.status}`);
    }

    // 2. Convert the response to a Blob
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error("Received empty image data from server.");
    }

    const ext = getExtension(imageUrl, blob.type);
    let targetFilename = filename;
    if (!targetFilename) {
      targetFilename = generateFilename(ext);
    } else if (!/\.[a-zA-Z0-9]+$/.test(targetFilename)) {
      targetFilename = `${targetFilename}.${ext}`;
    }

    // 3. Create an object URL from the Blob
    const objectUrl = URL.createObjectURL(blob);

    // 4. Create a temporary <a> element
    const a = document.createElement("a");

    // 5. Set href and download attributes
    a.href = objectUrl;
    a.download = targetFilename;
    a.style.display = "none";

    // 6. Append to document
    document.body.appendChild(a);

    // 7. Trigger click to start local download
    a.click();

    // 8. Remove the element
    document.body.removeChild(a);

    // 9. Revoke the object URL
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);

    toast.success("HD cutout downloaded successfully!");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    toast.error(`Download failed: ${message}`);
    throw err;
  }
}
