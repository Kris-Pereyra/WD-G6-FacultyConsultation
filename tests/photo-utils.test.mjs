import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getInitials,
  prepareProfilePhoto,
  MAX_ORIGINAL_PHOTO_BYTES,
} from "../src/photo-utils.js";

test("avatars derive initials from actual names without needing a database initials field", () => {
  assert.equal(getInitials("Novie Jozane Tamparong"), "NJ");
  assert.equal(getInitials("Prof. Kris Pereyra"), "KP");
  assert.equal(getInitials("  Dr.  Ana   Cruz  "), "AC");
  assert.equal(getInitials("Liza"), "L");
  assert.equal(getInitials(""), "?");
});

test("unsupported or excessive original files are rejected before browser image decoding", async () => {
  await assert.rejects(
    prepareProfilePhoto({ type: "image/svg+xml", size: 100 }),
    /JPG, PNG or WebP/,
  );
  await assert.rejects(
    prepareProfilePhoto({
      type: "image/jpeg",
      size: MAX_ORIGINAL_PHOTO_BYTES + 1,
    }),
    /smaller than 8 MB/,
  );
});

test("photo preparation produces a square preview and releases the temporary device-file URL", async (t) => {
  const oldImage = globalThis.Image,
    oldDocument = globalThis.document;
  t.after(() => {
    if (oldImage === undefined) delete globalThis.Image;
    else globalThis.Image = oldImage;
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
  });
  const drawn = [];
  const revoked = [];
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({
      fillRect() {},
      drawImage(...args) {
        drawn.push(args);
      },
    }),
    toDataURL: () => "data:image/jpeg;base64,/9j/2Q==",
  };
  globalThis.document = { createElement: () => canvas };
  globalThis.Image = class {
    naturalWidth = 1200;
    naturalHeight = 800;
    set src(value) {
      queueMicrotask(() => this.onload());
    }
  };
  t.mock.method(URL, "createObjectURL", () => "blob:device-photo");
  t.mock.method(URL, "revokeObjectURL", (value) => revoked.push(value));
  const result = await prepareProfilePhoto({ type: "image/png", size: 1000 });
  assert.ok(result.startsWith("data:image/jpeg;base64,"));
  assert.equal(canvas.width, 480);
  assert.equal(canvas.height, 480);
  assert.deepEqual(drawn[0].slice(1), [200, 0, 800, 800, 0, 0, 480, 480]);
  assert.deepEqual(revoked, ["blob:device-photo"]);
});

test("undecodable device images show an error and release the temporary URL", async (t) => {
  const oldImage = globalThis.Image;
  t.after(() => {
    if (oldImage === undefined) delete globalThis.Image;
    else globalThis.Image = oldImage;
  });
  const revoked = [];
  globalThis.Image = class {
    set src(value) {
      queueMicrotask(() => this.onerror());
    }
  };
  t.mock.method(URL, "createObjectURL", () => "blob:broken-photo");
  t.mock.method(URL, "revokeObjectURL", (value) => revoked.push(value));
  await assert.rejects(
    prepareProfilePhoto({ type: "image/jpeg", size: 100 }),
    /could not be opened/,
  );
  assert.deepEqual(revoked, ["blob:broken-photo"]);
});
