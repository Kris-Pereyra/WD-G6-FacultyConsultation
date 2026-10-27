import { useState } from "react";
import { getInitials } from "./photo-utils";
import "./ProfilePhoto.css";

export default function ProfileAvatar({ name, photo, className = "" }) {
  const [failedPhoto, setFailedPhoto] = useState(null);
  const usablePhoto =
    typeof photo === "string" &&
    photo.startsWith("data:image/jpeg;base64,") &&
    photo !== failedPhoto;
  return (
    <span
      className={`ct-profile-avatar ${className}`}
      role="img"
      aria-label={`${name || "Account"} profile picture`}
    >
      {usablePhoto ? (
        <img src={photo} alt="" onError={() => setFailedPhoto(photo)} />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
