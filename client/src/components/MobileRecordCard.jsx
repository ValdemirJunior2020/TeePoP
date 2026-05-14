// client/src/components/MobileRecordCard.jsx
import { formatDate } from '../utils/formatters';

export default function MobileRecordCard({ record, columns, onEdit, onDelete }) {
  return (
    <article className="rounded-3xl bg-white p-4 shadow-pop">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-teepopPink">{record.socio || record.cliente || record.produto || 'Registro'}</p>
          <h4 className="text-lg font-black text-teepopInk">{record.descricao || record.produto || record.atividade || record.produtoVendido || record.categoria || record.status || 'Detalhes'}</h4>
          {record.data ? <p className="text-sm font-bold text-purple-500">{formatDate(record.data)}</p> : null}
        </div>
        <span className="rounded-full bg-teepopCream px-3 py-1 text-xs font-black text-teepopPurple">#{String(record.id || '').slice(-5)}</span>
      </div>
      <div className="space-y-2">
        {columns.map((col) => (
          <div key={col.key} className="flex justify-between gap-3 rounded-2xl bg-purple-50/70 px-3 py-2 text-sm">
            <span className="font-extrabold text-purple-500">{col.label}</span>
            <span className="text-right font-bold text-teepopInk">{col.render ? col.render(record[col.key], record) : record[col.key] || '-'}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onEdit(record)} className="btn-pop flex-1 bg-teepopYellow text-teepopInk">Editar</button>
        <button onClick={() => onDelete(record)} className="btn-pop flex-1 bg-pink-500 text-white">Excluir</button>
      </div>
    </article>
  );
}
