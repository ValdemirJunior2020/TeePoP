// client/src/components/DataTable.jsx
import { useMemo, useState } from 'react';
import MobileRecordCard from './MobileRecordCard';
import EmptyState from './EmptyState';
import { SOCIOS } from '../utils/constants';
import { normalizeText } from '../utils/formatters';

export default function DataTable({ title, records = [], columns = [], onEdit, onDelete, partnerFilter = true }) {
  const [search, setSearch] = useState('');
  const [socio, setSocio] = useState('');
  const [date, setDate] = useState('');

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const textMatch = normalizeText(JSON.stringify(record)).includes(normalizeText(search));
      const socioMatch = !socio || record.socio === socio;
      const dateMatch = !date || String(record.data || '').slice(0, 10) === date;
      return textMatch && socioMatch && dateMatch;
    });
  }, [records, search, socio, date]);

  return (
    <section className="mt-6 rounded-[2rem] bg-white/90 p-4 shadow-pop sm:p-6">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-black text-teepopInk">{title}</h3>
          <p className="text-sm font-bold text-purple-500">{filtered.length} registro(s) encontrado(s)</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="input-pop" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {partnerFilter ? (
            <select className="input-pop" value={socio} onChange={(e) => setSocio(e.target.value)}>
              <option value="">Todos os sócios</option>
              {SOCIOS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          ) : <div />}
          <input className="input-pop" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState titulo="Nenhum registro encontrado" texto="Tente limpar os filtros ou adicionar um novo registro." />
      ) : (
        <>
          <div className="desktop-table overflow-x-auto rounded-3xl border border-purple-100">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gradient-to-r from-pink-100 via-yellow-100 to-cyan-100 text-teepopInk">
                <tr>
                  {columns.map((col) => <th key={col.key} className="px-4 py-3 font-black">{col.label}</th>)}
                  <th className="px-4 py-3 font-black">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {filtered.map((record) => (
                  <tr key={record.id} className="bg-white hover:bg-purple-50/70">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 font-semibold text-teepopInk">
                        {col.render ? col.render(record[col.key], record) : record[col.key] || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(record)} className="rounded-xl bg-teepopYellow px-3 py-2 text-xs font-black text-teepopInk">Editar</button>
                        <button onClick={() => onDelete(record)} className="rounded-xl bg-pink-500 px-3 py-2 text-xs font-black text-white">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-cards space-y-4">
            {filtered.map((record) => <MobileRecordCard key={record.id} record={record} columns={columns} onEdit={onEdit} onDelete={onDelete} />)}
          </div>
        </>
      )}
    </section>
  );
}
