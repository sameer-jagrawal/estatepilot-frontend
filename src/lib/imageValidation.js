export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) {
    return "Please select an image file";
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 5MB or smaller";
  }

  return "";
}

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
