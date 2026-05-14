// client/src/components/BottomNav.jsx
import { NAV_ITEMS } from '../utils/constants';

export default function BottomNav({ activePage, setActivePage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/70 bg-white/90 px-2 py-2 shadow-[0_-12px_40px_rgba(107,56,255,0.16)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`rounded-2xl px-1 py-2 text-[11px] font-black transition ${activePage === item.id ? 'bg-teepopPink text-white' : 'text-teepopInk'}`}
          >
            <div className="text-lg leading-none">{item.icon}</div>
            <div className="truncate">{item.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
