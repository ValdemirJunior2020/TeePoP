// client/src/pages/Despesas.jsx
import { useState } from 'react';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import { SOCIOS, CATEGORIAS_DESPESA } from '../utils/constants';
import { formatCurrency, formatDate, todayISO } from '../utils/formatters';

const initialForm = { socio: 'Pastora Priscila', data: todayISO(), categoria: 'Camisetas', descricao: '', valor: '', fornecedor: '', linkProduto: '', observacao: '', comprovanteUrl: '' };

export default function Despesas({ records, onSave, onUpdate, onDelete }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  function submit(e) {
    e.preventDefault();
    if (!form.descricao || !form.valor) return alert('Preencha a descrição e o valor.');
    const done = editingId ? onUpdate('Despesas', editingId, form) : onSave('addDespesa', form);
    Promise.resolve(done).then(() => { setForm(initialForm); setEditingId(null); });
  }
  return <div>
    <FormCard title={editingId ? 'Editar despesa' : 'Compras / Despesas'} subtitle="Registre tudo que foi comprado para a empresa." emoji="🛒">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Select label="Sócio que comprou" value={form.socio} onChange={(v) => setValue('socio', v)} options={SOCIOS} />
        <Input label="Data" type="date" value={form.data} onChange={(v) => setValue('data', v)} />
        <Select label="Categoria" value={form.categoria} onChange={(v) => setValue('categoria', v)} options={CATEGORIAS_DESPESA} />
        <Input label="Valor" type="number" step="0.01" value={form.valor} onChange={(v) => setValue('valor', v)} />
        <Input label="Descrição" value={form.descricao} onChange={(v) => setValue('descricao', v)} />
        <Input label="Onde comprou" value={form.fornecedor} onChange={(v) => setValue('fornecedor', v)} />
        <Input label="Link do produto (opcional)" value={form.linkProduto} onChange={(v) => setValue('linkProduto', v)} />
        <Input label="Comprovante URL (opcional)" value={form.comprovanteUrl} onChange={(v) => setValue('comprovanteUrl', v)} />
        <TextArea label="Observação" value={form.observacao} onChange={(v) => setValue('observacao', v)} />
        <div className="md:col-span-2 flex gap-3"><button className="btn-pop bg-teepopPink text-white">{editingId ? 'Salvar edição' : 'Salvar despesa'}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="btn-pop bg-teepopYellow text-teepopInk">Cancelar</button> : null}</div>
      </form>
    </FormCard>
    <DataTable title="Histórico de despesas" records={records} columns={columns} onEdit={(r) => { setEditingId(r.id); setForm({ ...initialForm, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(r) => onDelete('Despesas', r.id, r.socio)} />
  </div>;
}
const columns = [
  { key: 'data', label: 'Data', render: formatDate }, { key: 'socio', label: 'Sócio' }, { key: 'categoria', label: 'Categoria' }, { key: 'descricao', label: 'Descrição' }, { key: 'valor', label: 'Valor', render: formatCurrency }, { key: 'fornecedor', label: 'Fornecedor' }
];
function Input({ label, value, onChange, ...props }) { return <label className="font-black text-teepopInk">{label}<input className="input-pop mt-1" value={value || ''} onChange={(e) => onChange(e.target.value)} {...props} /></label>; }
function TextArea({ label, value, onChange }) { return <label className="font-black text-teepopInk md:col-span-2">{label}<textarea className="input-pop mt-1 min-h-28" value={value || ''} onChange={(e) => onChange(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="font-black text-teepopInk">{label}<select className="input-pop mt-1" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>; }
