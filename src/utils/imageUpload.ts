/**
 * Client-side image compression and upload helper for KUKU Admin Portal.
 * Handles resizing, JPEG encoding, API upload with fallback to base64 data URLs.
 */

export const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const rawUrl = (e.target?.result as string) || "";
          resolve({ blob: file, dataUrl: rawUrl });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: file, dataUrl });
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.src = (e.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  });
};

export const uploadImageToServer = async (file: File): Promise<string> => {
  const { blob, dataUrl } = await compressImageFile(file);

  try {
    const body = new FormData();
    body.append("file", blob, file.name || "category-image.jpg");

    const res = await fetch("/api/upload", {
      method: "POST",
      body,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("Server filesystem upload failed, falling back to data URL:", err);
  }

  return dataUrl;
};
