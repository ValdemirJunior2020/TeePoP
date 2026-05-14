// client/src/pages/Investimentos.jsx
import { useState } from 'react';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import { SOCIOS, FORMAS_PAGAMENTO } from '../utils/constants';
import { formatCurrency, formatDate, todayISO } from '../utils/formatters';

const initialForm = { socio: 'Pastora Priscila', valor: '', data: todayISO(), formaPagamento: 'Cash', observacao: '', comprovanteUrl: '' };

export default function Investimentos({ records, onSave, onUpdate, onDelete }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function submit(e) {
    e.preventDefault();
    if (!form.valor || Number(form.valor) <= 0) return alert('Digite um valor válido.');
    const done = editingId ? onUpdate('Investimentos', editingId, form) : onSave('addInvestimento', form);
    Promise.resolve(done).then(() => { setForm(initialForm); setEditingId(null); });
  }

  return (
    <div>
      <FormCard title={editingId ? 'Editar investimento' : 'Lançamento de investimento'} subtitle="Registre dinheiro colocado na TeePoP pelos sócios." emoji="💰">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Select label="Sócio" value={form.socio} onChange={(v) => setValue('socio', v)} options={SOCIOS} />
          <Input label="Valor" type="number" step="0.01" value={form.valor} onChange={(v) => setValue('valor', v)} />
          <Input label="Data" type="date" value={form.data} onChange={(v) => setValue('data', v)} />
          <Select label="Forma de pagamento" value={form.formaPagamento} onChange={(v) => setValue('formaPagamento', v)} options={FORMAS_PAGAMENTO} />
          <Input label="Comprovante URL (opcional)" value={form.comprovanteUrl} onChange={(v) => setValue('comprovanteUrl', v)} />
          <TextArea label="Observação" value={form.observacao} onChange={(v) => setValue('observacao', v)} />
          <div className="md:col-span-2 flex gap-3">
            <button className="btn-pop bg-teepopPink text-white" type="submit">{editingId ? 'Salvar edição' : 'Salvar investimento'}</button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="btn-pop bg-teepopYellow text-teepopInk">Cancelar</button> : null}
          </div>
        </form>
      </FormCard>
      <DataTable title="Histórico de investimentos" records={records} columns={columns} onEdit={(r) => { setEditingId(r.id); setForm({ ...initialForm, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(r) => onDelete('Investimentos', r.id, r.socio)} />
    </div>
  );
}

const columns = [
  { key: 'data', label: 'Data', render: formatDate },
  { key: 'socio', label: 'Sócio' },
  { key: 'valor', label: 'Valor', render: formatCurrency },
  { key: 'formaPagamento', label: 'Pagamento' },
  { key: 'observacao', label: 'Observação' },
];

function Input({ label, value, onChange, ...props }) { return <label className="font-black text-teepopInk">{label}<input className="input-pop mt-1" value={value || ''} onChange={(e) => onChange(e.target.value)} {...props} /></label>; }
function TextArea({ label, value, onChange }) { return <label className="font-black text-teepopInk md:col-span-2">{label}<textarea className="input-pop mt-1 min-h-28" value={value || ''} onChange={(e) => onChange(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="font-black text-teepopInk">{label}<select className="input-pop mt-1" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>; }
