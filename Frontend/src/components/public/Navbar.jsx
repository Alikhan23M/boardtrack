import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block py-2 transition ${
      isActive ? "text-teal-600" : "text-slate-600"
    } hover:text-teal-600`;

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-teal-600">
          BoardTrack
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/boards" className={linkClass}>
            Boards
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* CTA (desktop) */}
        <div className="flex justify-center items-center gap-4 ">
          <Link
          to="/contact"
          className="hidden md:inline-block bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
        >
          Get Quote
        </Link>
         <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="hidden md:inline-block block text-center bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-700"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 space-y-3">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/boards" onClick={() => setOpen(false)} className={linkClass}>
            Boards
          </NavLink>

          <NavLink to="/contact" onClick={() => setOpen(false)} className={linkClass}>
            Contact
          </NavLink>

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            Get Quote
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;