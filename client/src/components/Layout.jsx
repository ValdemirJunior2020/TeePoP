// client/src/components/Layout.jsx
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import logo from '../assets/teepop-logo.png';

export default function Layout({ activePage, setActivePage, children, toast }) {
  return (
    <div className="rainbow-bg min-h-screen pb-28 lg:pb-10">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-8">
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <img src={logo} alt="TeePoP" className="h-16 w-16 rounded-3xl object-cover shadow-pop" />
          <div>
            <h1 className="text-3xl font-black text-teepopInk">TeePoP</h1>
            <p className="font-extrabold text-teepopPink">Caixa & Gestão</p>
          </div>
        </div>
        {toast ? (
          <div className={`fixed right-4 top-4 z-50 rounded-3xl px-5 py-4 text-sm font-black shadow-pop ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {toast.message}
          </div>
        ) : null}
        {children}
      </div>
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
