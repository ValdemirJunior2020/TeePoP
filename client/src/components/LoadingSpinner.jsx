// client/src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ texto = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl bg-white/80 p-6 text-teepopInk shadow-pop">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-pink-200 border-t-teepopPink" />
      <span className="font-bold">{texto}</span>
    </div>
  );
}
