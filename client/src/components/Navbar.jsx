// client/src/components/Navbar.jsx
import logo from '../assets/teepop-logo.png';
import { NAV_ITEMS } from '../utils/constants';

export default function Navbar({ activePage, setActivePage }) {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-white/70 bg-white/80 backdrop-blur-xl lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-3">
          <img src={logo} alt="TeePoP" className="h-14 w-14 rounded-2xl object-cover shadow-lg" />
          <div className="text-left">
            <p className="text-2xl font-black text-teepopInk">TeePoP</p>
            <p className="text-xs font-extrabold uppercase tracking-wider text-teepopPink">Caixa & Gestão</p>
          </div>
        </button>
        <nav className="flex flex-wrap justify-end gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${activePage === item.id ? 'bg-teepopPink text-white shadow-pop' : 'bg-white text-teepopInk hover:bg-teepopCream'}`}
            >
              <span className="mr-1">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
