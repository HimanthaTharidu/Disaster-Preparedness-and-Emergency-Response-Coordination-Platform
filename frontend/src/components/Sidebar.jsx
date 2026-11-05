import { NavLink } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";

export default function Sidebar({ navigationItems, open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#293d64] text-white">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1 className="text-sm font-extrabold tracking-wide text-[#293d64]">
              DPERCP
            </h1>
            <p className="text-xs text-slate-500">District operations</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                    isActive
                      ? "bg-[#293d64] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={17} strokeWidth={1.9} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        
      </aside>
    </>
  );
}
