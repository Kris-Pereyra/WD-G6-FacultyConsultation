import { useEffect, useId, useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import wmsuLogo from "./assets/wmsuLogo.png";
import weblogo from "./assets/weblogo.jpg";

export function DashboardIcon({ name }) {
  const paths = {
    home: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-7h6v7",
    search: "M16.5 16.5 21 21",
    calendar: "M16 3v4M8 3v4M3 10h18",
    user: "M4 21c0-4 3.5-7 8-7s8 3 8 7",
    requests: "M14 21H5V3h14v11M8 7h8M8 11h8M8 15h4M17 16v6M14 19h6",
    clock: "M12 7v5l3 2",
    arrow: "m8 10 4 4 4-4",
    logout: "M9 4H4v16h5M10 12h11m-4-4 4 4-4 4",
  };
  return <svg className="ct-shell-icon" viewBox="0 0 24 24" aria-hidden="true">
    {name === "search" && <circle cx="11" cy="11" r="7" />}
    {name === "clock" && <circle cx="12" cy="12" r="9" />}
    {name === "user" && <circle cx="12" cy="8" r="4" />}
    {name === "calendar" && <rect x="3" y="5" width="18" height="16" rx="2" />}
    <path d={paths[name] || paths.arrow} />
  </svg>;
}

export function DashboardHeader({ name, role, photo, onDashboard, onProfile, onLogout, logoutDisabled = false, actions }) {
  const [open, setOpen] = useState(false);
  const account = useRef(null);
  const trigger = useRef(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    function outside(event) { if (!account.current?.contains(event.target)) setOpen(false); }
    function escape(event) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus({ preventScroll: true }); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <header className="ct-dashboard-header">
    <button type="button" className="ct-shell-brand" aria-label="ConsultTime dashboard" onClick={onDashboard}>
      <span className="ct-shell-logos"><img src={wmsuLogo} alt="WMSU" /><img src={weblogo} alt="" /></span>
      <span>ConsultTime</span>
    </button>
    <div className="ct-header-actions">
      {actions}
      <div className="ct-account" ref={account} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <button type="button" ref={trigger} className="ct-account-trigger"
          aria-label={`${open ? "Close" : "Open"} account menu`} aria-expanded={open} aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}>
          <ProfileAvatar className="ct-account-avatar" name={name} photo={photo} />
          <span className="ct-account-copy"><strong>{name || role}</strong><small>{role}</small></span>
          <span className={`ct-account-arrow ${open ? "is-open" : ""}`}><DashboardIcon name="arrow" /></span>
        </button>
        {open && <div id={menuId} className="ct-account-dropdown" role="group" aria-label="Account actions">
          <button type="button" onClick={() => { setOpen(false); onProfile?.(); }}><DashboardIcon name="user" />My Profile</button>
          <button type="button" disabled={logoutDisabled} onClick={() => { setOpen(false); onLogout?.(); }}><DashboardIcon name="logout" />Log Out</button>
        </div>}
      </div>
    </div>
  </header>;
}

export function DashboardSidebar({ items, activePage, onNavigate, label }) {
  return <aside className="ct-dashboard-sidebar" style={{ "--ct-nav-count": items.length }}>
    <nav className="ct-sidebar-nav" aria-label={label}>
      {items.map(([key, icon, text]) => <button type="button" key={key}
        className={`ct-sidebar-link ${activePage === key ? "is-active" : ""}`}
        aria-current={activePage === key ? "page" : undefined} onClick={() => onNavigate(key)}>
        <DashboardIcon name={icon} /><span>{text}</span>
      </button>)}
    </nav>
  </aside>;
}
