// client/src/components/FormCard.jsx
export default function FormCard({ title, subtitle, children, emoji = '📝' }) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
      <div className="rainbow-line" />
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teepopYellow to-teepopPink text-2xl shadow-lg">{emoji}</div>
          <div>
            <h2 className="text-2xl font-black text-teepopInk">{title}</h2>
            {subtitle ? <p className="text-sm font-semibold text-purple-500">{subtitle}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
