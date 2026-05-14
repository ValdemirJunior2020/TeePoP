// client/src/pages/Oracoes.jsx
import { useState } from 'react';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import { SOCIOS } from '../utils/constants';
import { formatDate, todayISO } from '../utils/formatters';

const initialForm = { socio: 'Pastora Priscila', data: todayISO(), orou: 'Sim', pedidoOracao: '', versiculo: '', observacao: '' };

export default function Oracoes({ records, onSave, onUpdate, onDelete }) {
  const [form, setForm] = useState(initialForm); const [editingId, setEditingId] = useState(null); const setValue = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function submit(e) { e.preventDefault(); const done = editingId ? onUpdate('Oracoes', editingId, form) : onSave('addOracao', form); Promise.resolve(done).then(() => { setForm(initialForm); setEditingId(null); }); }
  return <div><FormCard title={editingId ? 'Editar oração' : 'Oração pela empresa'} subtitle="Registre o compromisso espiritual pela TeePoP." emoji="🙏"><form onSubmit={submit} className="grid gap-4 md:grid-cols-2"><Select label="Sócio" value={form.socio} onChange={(v) => setValue('socio', v)} options={SOCIOS} /><Input label="Data" type="date" value={form.data} onChange={(v) => setValue('data', v)} /><Select label="Orou pela empresa hoje?" value={form.orou} onChange={(v) => setValue('orou', v)} options={['Sim', 'Não']} /><Input label="Palavra/versículo (opcional)" value={form.versiculo} onChange={(v) => setValue('versiculo', v)} /><TextArea label="Pedido de oração" value={form.pedidoOracao} onChange={(v) => setValue('pedidoOracao', v)} /><TextArea label="Observação" value={form.observacao} onChange={(v) => setValue('observacao', v)} /><div className="md:col-span-2 flex gap-3"><button className="btn-pop bg-teepopPink text-white">{editingId ? 'Salvar edição' : 'Salvar oração'}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="btn-pop bg-teepopYellow text-teepopInk">Cancelar</button> : null}</div></form></FormCard><DataTable title="Histórico de orações" records={records} columns={columns} onEdit={(r) => { setEditingId(r.id); setForm({ ...initialForm, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(r) => onDelete('Oracoes', r.id, r.socio)} /></div>;
}
const columns = [{ key: 'data', label: 'Data', render: formatDate }, { key: 'socio', label: 'Sócio' }, { key: 'orou', label: 'Orou?' }, { key: 'pedidoOracao', label: 'Pedido' }, { key: 'versiculo', label: 'Versículo' }, { key: 'observacao', label: 'Observação' }];
function Input({ label, value, onChange, ...props }) { return <label className="font-black text-teepopInk">{label}<input className="input-pop mt-1" value={value || ''} onChange={(e) => onChange(e.target.value)} {...props} /></label>; }
function TextArea({ label, value, onChange }) { return <label className="font-black text-teepopInk md:col-span-2">{label}<textarea className="input-pop mt-1 min-h-28" value={value || ''} onChange={(e) => onChange(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="font-black text-teepopInk">{label}<select className="input-pop mt-1" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>; }
