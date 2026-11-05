import { Bell, Menu, Search, ChevronDown } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-700">
          District operations
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 sm:flex">
          <Search size={14} />
          <span>Search</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Online
        </div>

        <button type="button" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#293d64] text-xs font-bold text-white">
            OP
          </span>
          <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
        </button>
      </div>
    </header>
  );
}
