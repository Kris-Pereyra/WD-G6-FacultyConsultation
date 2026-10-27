import { useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { prepareProfilePhoto } from "./photo-utils";
import { uploadProfilePhoto, removeProfilePhoto } from "./api";

export default function ProfilePhotoEditor({
  name,
  photo,
  disabled = false,
  onSaved,
  onBusyChange,
  onDraftChange,
}) {
  const input = useRef(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const locked = disabled || busy || preparing;
  async function choose(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || locked) return;
    setError("");
    setNotice("");
    setPreparing(true);
    onBusyChange?.(true);
    try {
      setDraft(await prepareProfilePhoto(file));
      onDraftChange?.(true);
    } catch (reason) {
      setError(reason.message || "Unable to prepare your image.");
    } finally {
      setPreparing(false);
      onBusyChange?.(false);
    }
  }
  async function save(removing = false) {
    if (locked || (!removing && !draft)) return;
    if (
      removing &&
      !window.confirm(
        "Remove your profile photo? Your initials will be shown instead.",
      )
    )
      return;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    setNotice("");
    try {
      const result = removing
        ? await removeProfilePhoto()
        : await uploadProfilePhoto(draft);
      onSaved?.(result.profile_photo);
      setDraft(null);
      onDraftChange?.(false);
      setNotice(result.message);
    } catch (reason) {
      setError(reason.message || "Unable to save your photo.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }
  return (
    <div className="ct-photo-editor" aria-busy={busy || preparing}>
      <ProfileAvatar
        name={name}
        photo={draft ?? photo}
        className="ct-photo-preview"
      />
      <div className="ct-photo-editor-content">
        <h3>Profile photo</h3>
        <p>JPG, PNG or WebP · up to 8 MB. Photos are cropped to a square.</p>
        <p className="ct-photo-save-note">
          Save Photo updates your picture separately from your personal details.
        </p>
        <input
          ref={input}
          className="ct-photo-file"
          tabIndex={-1}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Choose a profile photo from your device"
          disabled={locked}
          onChange={choose}
        />
        <div className="ct-photo-actions">
          <button
            type="button"
            className="ct-photo-button"
            disabled={locked}
            onClick={() => input.current?.click()}
          >
            {preparing
              ? "Preparing..."
              : photo || draft
                ? "Change photo"
                : "Choose photo"}
          </button>
          {draft !== null && (
            <>
              <button
                type="button"
                className="ct-photo-button is-primary"
                disabled={locked}
                onClick={() => save(false)}
              >
                {busy ? "Saving..." : "Save Photo"}
              </button>
              <button
                type="button"
                className="ct-photo-button"
                disabled={locked}
                onClick={() => {
                  setDraft(null);
                  onDraftChange?.(false);
                  setError("");
                }}
              >
                Cancel preview
              </button>
            </>
          )}
          {photo && draft === null && (
            <button
              type="button"
              className="ct-photo-button is-remove"
              disabled={locked}
              onClick={() => save(true)}
            >
              {busy ? "Removing..." : "Remove Photo"}
            </button>
          )}
        </div>
        {draft !== null && (
          <p className="ct-photo-hint">
            Preview only. Click Save Photo to keep this image.
          </p>
        )}
        {disabled && (
          <p className="ct-photo-hint">
            Please wait for your profile changes to finish saving.
          </p>
        )}
        {error && (
          <p className="ct-photo-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="ct-photo-success" role="status">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
