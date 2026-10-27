export const MAX_ORIGINAL_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_SAVED_PHOTO_BYTES = 128 * 1024;

export function getInitials(name) {
  const words = String(name || "")
    .trim()
    .replace(/^(?:(?:prof(?:essor)?|dr|mr|mrs|ms)\.?\s+)+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return (
    words.length
      ? words
          .slice(0, 2)
          .map((word) => Array.from(word)[0])
          .join("")
      : "?"
  ).toUpperCase();
}

export async function prepareProfilePhoto(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPG, PNG or WebP image.");
  if (file.size > MAX_ORIGINAL_PHOTO_BYTES)
    throw new Error("Choose a photo smaller than 8 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const loaded = new Image();
      loaded.onload = () => resolve(loaded);
      loaded.onerror = () =>
        reject(
          new Error("This image could not be opened. Try another JPG or PNG."),
        );
      loaded.src = url;
    });
    const width = image.naturalWidth,
      height = image.naturalHeight;
    if (!width || !height || width * height > 40000000)
      throw new Error("Choose an image with dimensions below 40 megapixels.");
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser cannot prepare this photo.");
    context.fillStyle = "#fffdf9";
    context.fillRect(0, 0, 480, 480);
    const side = Math.min(width, height);
    context.drawImage(
      image,
      (width - side) / 2,
      (height - side) / 2,
      side,
      side,
      0,
      0,
      480,
      480,
    );
    for (const quality of [0.82, 0.7, 0.58, 0.46, 0.34]) {
      const photo = canvas.toDataURL("image/jpeg", quality);
      const encoded = photo.slice(photo.indexOf(",") + 1);
      const bytes =
        (encoded.length * 3) / 4 -
        (encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0);
      if (
        photo.startsWith("data:image/jpeg;base64,") &&
        bytes <= MAX_SAVED_PHOTO_BYTES
      )
        return photo;
    }
    throw new Error("The prepared photo is too large. Try another image.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
