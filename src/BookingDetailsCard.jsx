import { useId, useRef, useState } from "react";
import "./BookingDetailsCard.css";

function BookingIcon({ type }) {
  const paths = {
    calendar:
      "M8 3v4M16 3v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
    book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5ZM4 5.5v16",
    location:
      "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    arrow: "m9 6 6 6-6 6",
  };
  return (
    <svg className="ct-booking-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[type] || paths.arrow} />
    </svg>
  );
}

export default function BookingDetailsCard({
  booking,
  dateLabel,
  canCancel = false,
  onCancel,
}) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState("");
  const trigger = useRef(null);
  const id = useId();
  const name = booking.faculty_name || booking.faculty || "Faculty Member";
  const status = String(booking.status || "Pending");
  const location =
    booking.location || booking.room || "Location to be confirmed";
  const subject = booking.subject || "Consultation purpose not provided";

  async function cancel() {
    if (cancelling || !canCancel || typeof onCancel !== "function") return;
    setCancelling(true);
    setActionError("");
    try {
      await onCancel(booking.id);
    } catch (error) {
      setActionError(
        error.message || "Unable to cancel this booking. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <article
      className={`booking-card ct-booking-card ${expanded ? "is-expanded" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded && !cancelling) {
          event.preventDefault();
          trigger.current?.focus({ preventScroll: true });
          setExpanded(false);
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="ct-booking-summary"
        id={`${id}-summary`}
        aria-label={`${expanded ? "Hide" : "Show"} booking details with ${name}, ${status}, ${dateLabel}, ${booking.time_slot || booking.time || "time not set"}`}
        aria-expanded={expanded}
        aria-controls={`${id}-details`}
        disabled={cancelling}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="booking-date-block">
          <BookingIcon type="calendar" />
          <span>Consultation</span>
          <strong>
            {String(
              booking.date_key || booking.dateKey || booking.date || "",
            ).slice(8, 10) || "—"}
          </strong>
          <small>Manila time</small>
        </span>
        <span className="booking-card-main">
          <span className="ct-booking-title-row">
            <span className="ct-booking-faculty">
              <strong>{name}</strong>
              <span>{booking.department || "Faculty consultation"}</span>
            </span>
            <span
              className={`booking-status status-${status.toLowerCase().replace(/[^a-z]/g, "")}`}
            >
              {status}
            </span>
          </span>
          <span className="ct-booking-topic">
            <BookingIcon type="book" />
            <span>{subject}</span>
          </span>
          <span className="ct-booking-meta">
            <span>
              <BookingIcon type="calendar" />
              {dateLabel}
            </span>
            <span>
              <BookingIcon type="clock" />
              {booking.time_slot || booking.time || "Time to be confirmed"}
            </span>
          </span>
          <span className="ct-booking-disclosure">
            {expanded ? "Hide details" : "View details"}
            <BookingIcon type="arrow" />
          </span>
        </span>
      </button>
      <div
        id={`${id}-details`}
        className="ct-booking-expansion"
        role="region"
        aria-labelledby={`${id}-summary`}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="ct-booking-clip">
          <div className="ct-booking-expanded-content">
            <dl className="ct-booking-expanded-grid">
              <div className="ct-booking-purpose">
                <dt>Consultation purpose</dt>
                <dd>{subject}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{location}</dd>
              </div>
              <div>
                <dt>Booking reference</dt>
                <dd>
                  {booking.id == null ? "Not provided" : `#${booking.id}`}
                </dd>
              </div>
            </dl>
            {actionError && (
              <p className="ct-booking-action-error" role="alert">
                {actionError}
              </p>
            )}
            <div className="ct-booking-actions">
              <p>
                {canCancel
                  ? "You can cancel before the consultation starts."
                  : status === "Cancelled"
                    ? "This booking has been cancelled."
                    : "Cancellation is unavailable for this booking."}
              </p>
              {canCancel && (
                <button
                  type="button"
                  className="ct-booking-cancel"
                  disabled={cancelling || typeof onCancel !== "function"}
                  onClick={cancel}
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
