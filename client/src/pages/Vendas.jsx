// client/src/pages/Vendas.jsx
import { useState } from 'react';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import { SOCIOS, FORMAS_PAGAMENTO, STATUS_VENDA } from '../utils/constants';
import { formatCurrency, formatDate, todayISO } from '../utils/formatters';

const initialForm = { data: todayISO(), cliente: '', produto: '', quantidade: 1, valorTotal: '', formaPagamento: 'Cash', socio: 'Pastora Priscila', status: 'Pago', observacao: '' };

export default function Vendas({ records, onSave, onUpdate, onDelete }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  function submit(e) {
    e.preventDefault();
    if (!form.cliente || !form.produto || !form.valorTotal) return alert('Preencha cliente, produto e valor total.');
    const done = editingId ? onUpdate('Vendas', editingId, form) : onSave('addVenda', form);
    Promise.resolve(done).then(() => { setForm(initialForm); setEditingId(null); });
  }
  return <div><FormCard title={editingId ? 'Editar venda' : 'Vendas'} subtitle="Registre as vendas pagas, pendentes ou canceladas." emoji="🧾"><form onSubmit={submit} className="grid gap-4 md:grid-cols-2"><Input label="Data" type="date" value={form.data} onChange={(v) => setValue('data', v)} /><Input label="Cliente" value={form.cliente} onChange={(v) => setValue('cliente', v)} /><Input label="Produto vendido" value={form.produto} onChange={(v) => setValue('produto', v)} /><Input label="Quantidade" type="number" value={form.quantidade} onChange={(v) => setValue('quantidade', v)} /><Input label="Valor total" type="number" step="0.01" value={form.valorTotal} onChange={(v) => setValue('valorTotal', v)} /><Select label="Forma de pagamento" value={form.formaPagamento} onChange={(v) => setValue('formaPagamento', v)} options={FORMAS_PAGAMENTO} /><Select label="Quem vendeu" value={form.socio} onChange={(v) => setValue('socio', v)} options={SOCIOS} /><Select label="Status" value={form.status} onChange={(v) => setValue('status', v)} options={STATUS_VENDA} /><TextArea label="Observação" value={form.observacao} onChange={(v) => setValue('observacao', v)} /><div className="md:col-span-2 flex gap-3"><button className="btn-pop bg-teepopPink text-white">{editingId ? 'Salvar edição' : 'Salvar venda'}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="btn-pop bg-teepopYellow text-teepopInk">Cancelar</button> : null}</div></form></FormCard><DataTable title="Histórico de vendas" records={records} columns={columns} onEdit={(r) => { setEditingId(r.id); setForm({ ...initialForm, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(r) => onDelete('Vendas', r.id, r.socio)} /></div>;
}
const columns = [{ key: 'data', label: 'Data', render: formatDate }, { key: 'cliente', label: 'Cliente' }, { key: 'produto', label: 'Produto' }, { key: 'quantidade', label: 'Qtd' }, { key: 'valorTotal', label: 'Valor', render: formatCurrency }, { key: 'socio', label: 'Sócio' }, { key: 'status', label: 'Status' }];
function Input({ label, value, onChange, ...props }) { return <label className="font-black text-teepopInk">{label}<input className="input-pop mt-1" value={value || ''} onChange={(e) => onChange(e.target.value)} {...props} /></label>; }
function TextArea({ label, value, onChange }) { return <label className="font-black text-teepopInk md:col-span-2">{label}<textarea className="input-pop mt-1 min-h-28" value={value || ''} onChange={(e) => onChange(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="font-black text-teepopInk">{label}<select className="input-pop mt-1" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>; }
