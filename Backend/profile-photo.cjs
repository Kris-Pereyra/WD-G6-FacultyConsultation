"use strict";
const MAX_PHOTO_BYTES = 128 * 1024;
const JPEG_PREFIX = "data:image/jpeg;base64,";

// Only bounded, raster JPEG uploads are stored. SVG/HTML and remote URLs are rejected.
function validProfilePhoto(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith(JPEG_PREFIX) ||
    value.length > JPEG_PREFIX.length + Math.ceil(MAX_PHOTO_BYTES / 3) * 4
  )
    return false;
  const encoded = value.slice(JPEG_PREFIX.length);
  if (!encoded || encoded.length % 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))
    return false;
  const bytes = Buffer.from(encoded, "base64");
  if (
    bytes.length > MAX_PHOTO_BYTES ||
    bytes.length < 12 ||
    bytes.toString("base64") !== encoded ||
    bytes[0] !== 0xff ||
    bytes[1] !== 0xd8 ||
    bytes[bytes.length - 2] !== 0xff ||
    bytes[bytes.length - 1] !== 0xd9
  )
    return false;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset++] !== 0xff) return false;
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9 || offset + 2 > bytes.length)
      return false;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) return false;
    if (marker === 0xc0 || marker === 0xc2) {
      if (length < 8 || bytes[offset + 2] !== 8) return false;
      const height = bytes.readUInt16BE(offset + 3),
        width = bytes.readUInt16BE(offset + 5);
      const components = bytes[offset + 7];
      return (
        width > 0 &&
        height > 0 &&
        width <= 512 &&
        height <= 512 &&
        [1, 3].includes(components) &&
        length >= 8 + components * 3
      );
    }
    offset += length;
  }
  return false;
}

function registerPhotoRoutes(app, pool, requireAuth) {
  async function save(req, res, photo) {
    try {
      const result =
        req.user.role === "student"
          ? await pool.query(
              "UPDATE students SET profile_photo = $1 WHERE id = $2 AND role = 'student' RETURNING id",
              [photo, req.user.id],
            )
          : await pool.query(
              `UPDATE faculty f SET profile_photo = $1 FROM faculty_accounts a
            WHERE f.id = $2 AND a.id = $3 AND a.faculty_id = f.id AND a.role = 'faculty' RETURNING f.id`,
              [photo, req.user.facultyId, req.user.id],
            );
      if (!result.rows.length)
        return res
          .status(401)
          .json({ message: "Account not found. Please log in again." });
      res.set("Cache-Control", "no-store");
      res.json({
        message: photo ? "Profile photo saved." : "Profile photo removed.",
        profile_photo: photo,
      });
    } catch (error) {
      console.error("Profile photo save failed:", error.code || error.message);
      res
        .status(500)
        .json({ message: "Unable to save your photo. Please try again." });
    }
  }
  app.put("/api/me/photo", requireAuth, (req, res) => {
    if (!validProfilePhoto(req.body?.photo))
      return res
        .status(400)
        .json({
          message:
            "Choose a valid photo. Saved photos must be JPEG, at most 512 × 512 pixels and 128 KB.",
        });
    return save(req, res, req.body.photo);
  });
  app.delete("/api/me/photo", requireAuth, (req, res) => save(req, res, null));
}
module.exports = { registerPhotoRoutes, validProfilePhoto, MAX_PHOTO_BYTES };
