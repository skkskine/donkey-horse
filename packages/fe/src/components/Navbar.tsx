import { NavLink } from "react-router-dom";

export default function Navbar() {
  function highlightCurrentPage(isActive: boolean) {
    return isActive ? "underline" : "";
  }

  return (
    <nav className="flex justify-center w-full gap-3 p-2 text-sm">
      <NavLink
        to="/"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        homepage
      </NavLink>
      <NavLink
        to="/add-event"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        add-event
      </NavLink>
      <NavLink
        to="/invite"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        invite
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        account
      </NavLink>
    </nav>
  );
}
