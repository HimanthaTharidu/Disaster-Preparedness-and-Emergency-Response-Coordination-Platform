import { getCurrentUser } from '../api/auth.js';
import { Bell, Menu, Search, ChevronDown } from "lucide-react";

function getInitials(name)
{
    const words = (name || '').trim().split(/\s+/).filter(Boolean);

    if (words.length === 0)
    {
        return 'U';
    }

    if (words.length === 1)
    {
        return Array.from(words[0])[0].toUpperCase();
    }

    const first = Array.from(words[0])[0];
    const last = Array.from(words[words.length - 1])[0];

    return `${first}${last}`.toUpperCase();
}
export default function Navbar({ onMenuClick, actions }) {

const user = getCurrentUser();
const userName = user?.name?.trim() || 'User';
const initials = getInitials(userName);
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

        <button
    type="button"
    title={userName}
    aria-label={`Profile: ${userName}`}
    className="flex items-center gap-2 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#293d64]"
>
    <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#293d64] text-xs font-bold text-white"
    >
        {initials}
    </span>

    <span className="hidden text-sm font-medium text-slate-700 md:block">
        {userName}
    </span>

    <ChevronDown
        size={14}
        className="hidden text-slate-500 sm:block"
        aria-hidden="true"
    />
</button>

        {actions}
      </div>
    </header>
  );
}

        
