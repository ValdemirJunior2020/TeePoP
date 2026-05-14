// client/src/components/EmptyState.jsx
export default function EmptyState({ titulo = 'Nada registrado ainda', texto = 'Adicione o primeiro registro para começar.' }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white/70 p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teepopYellow to-teepopPink text-3xl">✨</div>
      <h3 className="text-xl font-extrabold text-teepopInk">{titulo}</h3>
      <p className="mt-2 text-sm font-semibold text-purple-500">{texto}</p>
    </div>
  );
}
