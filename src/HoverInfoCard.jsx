import { useEffect, useId, useRef, useState } from "react";
import "./HoverInfoCard.css";

// Desktop hover opens transiently; keyboard focus and touch have equivalent controls.
export default function HoverInfoCard({ summary, children, label, className = "" }) {
  const root = useRef(null);
  const trigger = useRef(null);
  const pointer = useRef("");
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [tappedOpen, setTappedOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (hovered || keyboardOpen || tappedOpen);

  useEffect(() => {
    if (!tappedOpen) return;
    function outside(event) {
      if (!root.current?.contains(event.target)) {
        setTappedOpen(false);
        setDismissed(false);
      }
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [tappedOpen]);

  return (
    <article ref={root} className={`ct-hover-card ${open ? "is-expanded" : ""} ${className}`}
      onPointerDownCapture={(event) => { pointer.current = event.pointerType; }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") { setHovered(true); setTappedOpen(false); setDismissed(false); }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") { setHovered(false); setDismissed(false); }
      }}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) { setKeyboardOpen(true); setDismissed(false); }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setKeyboardOpen(false); setTappedOpen(false); }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault(); event.stopPropagation();
          trigger.current?.focus({ preventScroll: true });
          setKeyboardOpen(false); setTappedOpen(false); setDismissed(true);
        }
      }}>
      <button ref={trigger} type="button" id={`${id}-summary`} className="ct-hover-summary"
        aria-label={label} aria-expanded={open} aria-controls={`${id}-details`}
        onClick={(event) => {
          if (event.detail === 0) { setKeyboardOpen(!open); setTappedOpen(false); setDismissed(open); }
          else if (pointer.current === "touch") { setKeyboardOpen(false); setHovered(false); setTappedOpen(!open); setDismissed(false); }
        }}>
        {summary}
      </button>
      <div id={`${id}-details`} className="ct-hover-details" role="region"
        aria-labelledby={`${id}-summary`} aria-hidden={!open} inert={!open}>
        <div className="ct-hover-clip"><div className="ct-hover-content">{children}</div></div>
      </div>
    </article>
  );
}
