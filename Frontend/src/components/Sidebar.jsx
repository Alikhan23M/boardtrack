import { NavLink } from "react-router-dom";
import { BadgeDollarSign, LayoutDashboard, LayoutGrid, Printer, ReceiptText, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/boards", label: "Boards", icon: LayoutGrid },
  { to: "/deals", label: "Deals", icon: BadgeDollarSign },
  { to: "/installments", label: "Installments", icon: ReceiptText },
  { to: "/printing-services", label: "Printing Services", icon: Printer },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/45 transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white px-5 py-6 shadow-xl transition-transform duration-300 md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">BoardTrack</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Workspace</h2>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onClose} end={item.to === "/"}>
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <span
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-teal-600 text-white shadow-[0_10px_24px_rgba(13,148,136,0.28)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                );
              }}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
