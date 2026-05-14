// client/src/components/StatCard.jsx
export default function StatCard({ title, value, icon = '✨', subtitle, gradient = 'from-pink-400 to-purple-500' }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-pop">
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-purple-400">{title}</p>
            <h3 className="mt-2 text-2xl font-black text-teepopInk sm:text-3xl">{value}</h3>
            {subtitle ? <p className="mt-2 text-sm font-bold text-purple-500">{subtitle}</p> : null}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teepopCream text-3xl shadow-inner">{icon}</div>
        </div>
      </div>
    </div>
  );
}
