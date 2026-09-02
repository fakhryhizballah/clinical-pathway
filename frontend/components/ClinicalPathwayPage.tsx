'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';

type Day = { hari: number; status: string; checked_at?: string; checked_by?: string };
type Item = { kode: string; nama: string; biaya: number; hari: Day[] };
type Category = { nama: string; items: Item[] };
type Variance = {
  _id: string;
  item_code?: string;
  hari?: number | null;
  tanggal?: string | null;
  type: string;
  alasan: string;
  catatan?: string;
  created_at?: string;
  created_by?: string;
};
type RecordData = {
  _id: string;
  no_reg: string;
  no_rm: string;
  kode_template_cp: string;
  nama_template: string;
  diagnosis: string;
  template_version: number;
  jumlah_hari: number;
  actor: string;
  nama_pasien: string;
  diagnosa_Awal: string;
  berat_badan: number | null;
  tinggi_badan: number | null;
  umur_tgl_lahir: string;
  catatan_khusus: string;
  status: string;
  tanggal_masuk: string | null;
  tanggal_keluar: string | null;
  diagnosa_utama: string;
  diagnosa_penyerta: string;
  komplikasi: string;
  tindakan_utama: string;
  tindakan_lain: string;
  checklist: Category[];
  variances: Variance[];
};

type VarianceDraft = {
  item_code: string;
  hari: string;
  tanggal: string;
  type: string;
  alasan: string;
  catatan: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const money = (n: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n || 0);

const emptyVariance = (): VarianceDraft => ({
  item_code: '', hari: '', tanggal: new Date().toISOString().slice(0, 10),
  type: 'not_performed', alasan: '', catatan: ''
});

function findDay(item: Item, day: number) {
  return item.hari.find(x => x.hari === day);
}

const varianceLabel: Record<string, string> = {
  not_performed: 'Tidak dilakukan',
  additional_action: 'Tindakan tambahan',
  delayed: 'Terlambat',
  substituted: 'Substitusi'
};

export default function ClinicalPathwayPage({
id
}: {
  id: string;
}) {
  const [data, setData] = useState<RecordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string>('');
  const [savingPatient, setSavingPatient] = useState(false);
  const [patient, setPatient] = useState({
    nama_pasien: '', diagnosa_Awal: '', berat_badan: '', tinggi_badan: '', umur_tgl_lahir: '', nip: ''
  });
  const [varianceDrafts, setVarianceDrafts] = useState<VarianceDraft[]>([emptyVariance()]);
  const [savingVariance, setSavingVariance] = useState(false);
  const [statusForm, setStatusForm] = useState({
    tanggal_masuk: '',
    tanggal_keluar: '',
    diagnosa_utama: '',
    diagnosa_penyerta: '',
    komplikasi: '',
    tindakan_utama: '',
    tindakan_lain: ''
  });

  const [savingStatus, setSavingStatus] = useState(false);

  async function loadRecord() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API}/api/clinical-pathway/record/${id}`,
        { cache: 'no-store' }
      );
      const body = await res.json();
      const [_id, nip] = Buffer.from(id, 'base64').toString('utf-8').split('#');

      if (!res.ok) throw new Error(body.message || 'Gagal mengambil Clinical Pathway');
      setData(body.data as RecordData);
      setPatient({
        nama_pasien: body.data.nama_pasien || '',
        diagnosa_Awal: body.data.diagnosa_Awal || '',
        berat_badan: body.data.berat_badan ?? '',
        tinggi_badan: body.data.tinggi_badan ?? '',
        umur_tgl_lahir: body.data.umur_tgl_lahir || '',
        nip: nip
      });
      setStatusForm({
        tanggal_masuk: body.data.tanggal_masuk
          ? body.data.tanggal_masuk.slice(0, 10)
          : '',
        tanggal_keluar: body.data.tanggal_keluar
          ? body.data.tanggal_keluar.slice(0, 10)
          : '',
        diagnosa_utama: body.data.diagnosa_utama || '',
        diagnosa_penyerta: body.data.diagnosa_penyerta || '',
        komplikasi: body.data.komplikasi || '',
        tindakan_utama: body.data.tindakan_utama || '',
        tindakan_lain: body.data.tindakan_lain || ''
      });
    } catch (e: any) {
      setError(e.message || 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    void loadRecord();
  }, [id]);
  const nip = useMemo(() => {
    if (!id) return '';
    try {
      const decoded = atob(decodeURIComponent(id));
      console.log(decoded);
      return decoded.split('#')[1];
    } catch {
      return '';
    }
  }, [id]);

  const totals = useMemo(() => {
    if (!data) return { perDay: [], total: 0 };
    const perDay = Array.from({ length: data.jumlah_hari }, (_, i) => {
      const day = i + 1;
      return data.checklist.reduce((sum, cat) => sum + cat.items.reduce((s, item) => {
        const d = findDay(item, day);
        return s + (d?.status === 'done' ? item.biaya : 0);
      }, 0), 0);
    });
    return { perDay, total: perDay.reduce((a, b) => a + b, 0) };
  }, [data]);

  async function savePatientInfo() {
    if (!data) return;
    setSavingPatient(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/clinical-pathway/record/${data._id}/patient-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patient, actor: nip })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Gagal menyimpan data pasien');
      setData(body.data);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan data pasien');
    } finally {
      setSavingPatient(false);
    }
  }
  async function saveStatusInfo() {
    if (!data) return;

    setSavingStatus(true);
    setError('');

    try {
      const res = await fetch(
        `${API}/api/clinical-pathway/record/${data._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...statusForm,
            actor: nip
          })
        }
      );

      const body = await res.json();

      if (!res.ok) {
        throw new Error(
          body.message || 'Gagal menyimpan data status'
        );
      }

      setData(body.data);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan data status');
    } finally {
      setSavingStatus(false);
    }
  }

  async function toggle(itemCode: string, hari: number, current: string) {
    if (!data || current === 'not_applicable') return;
    const next = current === 'done' ? 'pending' : 'done';
    const key = `${itemCode}-${hari}`;
    setSaving(key);
    setError('');
    try {
      const res = await fetch(`${API}/api/clinical-pathway/record/${data._id}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_code: itemCode, hari, status: next, actor: nip })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Gagal menyimpan checklist');
      setData(body.data);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan checklist');
    } finally {
      setSaving('');
    }
  }

  function addVarianceRow() {
    setVarianceDrafts(prev => [...prev, emptyVariance()]);
  }

  function removeVarianceRow(index: number) {
    setVarianceDrafts(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== index));
  }

  function updateVarianceRow(index: number, field: keyof VarianceDraft, value: string) {
    setVarianceDrafts(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  }

  async function saveVariances() {
    if (!data) return;
    const rows = varianceDrafts.filter(row => row.alasan.trim());
    if (!rows.length) {
      setError('Isi minimal satu alasan varians sebelum menyimpan.');
      return;
    }
    setSavingVariance(true);
    setError('');
    try {
      let latest = data;
      for (const row of rows) {
        const res = await fetch(`${API}/api/clinical-pathway/record/${data._id}/variances`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...row, actor: nip })
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || 'Gagal menyimpan catatan varians');
        latest = body.data;
      }
      setData(latest);
      setVarianceDrafts([emptyVariance()]);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan catatan varians');
    } finally {
      setSavingVariance(false);
    }
  }

  async function deleteVariance(varianceId: string) {
    if (!data) return;
    setError('');
    try {
      const res = await fetch(`${API}/api/clinical-pathway/record/${data._id}/variances/${varianceId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Gagal menghapus catatan varians');
      setData(body.data);
    } catch (e: any) {
      setError(e.message || 'Gagal menghapus catatan varians');
    }
  }

  if (loading) return <main className="page"><div className="shell"><div className="card loading">Memuat Clinical Pathway...</div></div></main>;
  if (error && !data) return <main className="page"><div className="shell"><div className="card error">{error}</div></div></main>;
  if (!data) return null;

  return (
    <main className="page">
      <div className="shell">
        <section className="card header">
          <div>
            <h1 className="title">Clinical Pathway</h1>
            <div className="muted" style={{ marginTop: 5 }}>
              {data.nama_template} · {data.diagnosis} · Template v{data.template_version}
            </div>
          </div>
          <div className="toolbar">
            <span className="badge">{data.status.replace('_', ' ').toUpperCase()}</span>
            <button className="btn" onClick={() => void loadRecord()}>Refresh</button>
          </div>
        </section>

        {error && <div className="alert" role="alert">{error}</div>}

        <section className="card sectionCard">
          <div className="meta">
            <div className="metaBox"><div className="metaLabel">No. Registrasi</div><div className="metaValue">{data.no_reg}</div></div>
            <div className="metaBox"><div className="metaLabel">No. Rekam Medis</div><div className="metaValue">{data.no_rm}</div></div>
            <div className="metaBox"><div className="metaLabel">Kode Template</div><div className="metaValue">{data.kode_template_cp}</div></div>
            <div className="metaBox"><div className="metaLabel">NIP Actor</div><div className="metaValue">{nip}</div></div>
          </div>

          <div className="formSection">
            <div className="sectionTitle">Data Pasien</div>
            <div className="patientGrid">
              <label>Nama Pasien<input className="input" value={patient.nama_pasien} onChange={e => setPatient(p => ({ ...p, nama_pasien: e.target.value }))} /></label>
              <label>Diagnosa Awal<input className="input" value={patient.diagnosa_Awal} onChange={e => setPatient(p => ({ ...p, diagnosa_Awal: e.target.value }))} /></label>
              <label>Berat Badan (kg)<input className="input" type="number" step="0.01" value={patient.berat_badan} onChange={e => setPatient(p => ({ ...p, berat_badan: e.target.value }))} /></label>
              <label>Tinggi Badan (cm)<input className="input" type="number" step="0.01" value={patient.tinggi_badan} onChange={e => setPatient(p => ({ ...p, tinggi_badan: e.target.value }))} /></label>
              <label>Umur / Tgl Lahir<input className="input" value={patient.umur_tgl_lahir} onChange={e => setPatient(p => ({ ...p, umur_tgl_lahir: e.target.value }))} placeholder="Contoh: 32 th / 12-05-1994" /></label>
            </div>
            <div className="formActions">
              <button className="btn btnPrimary" disabled={savingPatient} onClick={() => void savePatientInfo()}>{savingPatient ? 'Menyimpan...' : 'Simpan Data Pasien'}</button>
            </div>
          </div>

          {data.catatan_khusus && (
            <div className="specialNote">
              <div className="sectionTitle">Catatan Khusus</div>
              <div className="specialText">{data.catatan_khusus}</div>
            </div>
          )}

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Aspek Pelayanan</th>
                  {Array.from({ length: data.jumlah_hari }, (_, i) => <th key={i}>Hari {i + 1}</th>)}
                  <th>Biaya</th>
                </tr>
              </thead>
              <tbody>
                {data.checklist.map(category => (
                  <Fragment key={category.nama}>
                    <tr><td className="category" colSpan={data.jumlah_hari + 2}>{category.nama}</td></tr>
                    {category.items.map(item => (
                      <tr key={item.kode}>
                        <td><div style={{ fontWeight: 600 }}>{item.nama}</div><div className="muted">{item.kode}</div></td>
                        {Array.from({ length: data.jumlah_hari }, (_, i) => {
                          const day = i + 1; const d = findDay(item, day);
                          if (!d || d.status === 'not_applicable') return <td key={day} className="center na">—</td>;
                          const id = `${item.kode}-${day}`;
                          return <td key={day} className="center">
                            <input className="check" type="checkbox" checked={d.status === 'done'} disabled={saving === id} onChange={() => void toggle(item.kode, day, d.status)} aria-label={`${item.nama} hari ${day}`} />
                            {d.status === 'variance' && <div className="varianceMini">Varians</div>}
                          </td>;
                        })}
                        <td className="money">{money(item.biaya)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="footer">
            {totals.perDay.map((total, i) => <div className="totalBox" key={i}><div className="metaLabel">Total Hari {i + 1}</div><div className="totalValue">{money(total)}</div></div>)}
            <div className="totalBox"><div className="metaLabel">Total Biaya</div><div className="totalValue">{money(totals.total)}</div></div>
          </div>

          <div className="variance">
            <div className="varianceHeader">
              <div>
                <h3 style={{ margin: 0 }}>Catatan Varians</h3>
                <div className="muted" style={{ marginTop: 4 }}>Setiap baris disimpan ke `cp_records.variances` dan dapat ditambahkan lebih dari satu.</div>
              </div>
              <button className="btn" onClick={addVarianceRow}>+ Tambah Catatan Varians</button>
            </div>

            <div className="varianceDraftList">
              {varianceDrafts.map((row, index) => (
                <div className="varianceCard" key={index}>
                  <div className="varianceCardTop">
                    <strong>Varians #{index + 1}</strong>
                    {varianceDrafts.length > 1 && <button className="btn btnDanger" type="button" onClick={() => removeVarianceRow(index)}>Hapus Baris</button>}
                  </div>
                  <div className="varGrid">
                    <label>Kode Item<input className="input" value={row.item_code} onChange={e => updateVarianceRow(index, 'item_code', e.target.value)} placeholder="Contoh: LAB-001" /></label>
                    <label>Hari<select className="select" value={row.hari} onChange={e => updateVarianceRow(index, 'hari', e.target.value)}><option value="">Pilih</option>{Array.from({ length: data.jumlah_hari }, (_, i) => <option key={i + 1} value={i + 1}>Hari {i + 1}</option>)}</select></label>
                    <label>Tanggal<input className="input" type="date" value={row.tanggal} onChange={e => updateVarianceRow(index, 'tanggal', e.target.value)} /></label>
                    <label>Jenis Varians<select className="select" value={row.type} onChange={e => updateVarianceRow(index, 'type', e.target.value)}>{Object.entries(varianceLabel).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                    <label className="span2">Alasan <span className="required">*</span><input className="input" value={row.alasan} onChange={e => updateVarianceRow(index, 'alasan', e.target.value)} placeholder="Alasan penyimpangan dari pathway" /></label>
                    <label className="span2">Catatan<input className="input" value={row.catatan} onChange={e => updateVarianceRow(index, 'catatan', e.target.value)} placeholder="Catatan klinis tambahan" /></label>
                  </div>
                </div>
              ))}
            </div>

            <div className="formActions">
              <button className="btn btnPrimary" disabled={savingVariance} onClick={() => void saveVariances()}>{savingVariance ? 'Menyimpan Varians...' : 'Simpan Semua Catatan Varians'}</button>
            </div>

            {data.variances.length > 0 && (
              <div className="savedVariance">
                <div className="sectionTitle">Varians Tersimpan ({data.variances.length})</div>
                <div className="savedList">
                  {data.variances.map((v, i) => (
                    <div className="savedRow" key={v._id}>
                      <div><strong>#{i + 1} · {varianceLabel[v.type] || v.type}</strong><div className="muted">{v.item_code || '-'} · {v.hari ? `Hari ${v.hari}` : 'Hari -'} · {v.tanggal ? new Date(v.tanggal).toLocaleDateString('id-ID') : '-'}</div></div>
                      <div className="savedReason"><strong>Alasan:</strong> {v.alasan}{v.catatan ? <><br /><strong>Catatan:</strong> {v.catatan}</> : null}</div>
                      <button className="btn btnDanger" onClick={() => void deleteVariance(v._id)}>Hapus</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="formSection">
          <div className="sectionTitle">
            Status Perawatan / Resume Clinical Pathway
          </div>

          <div className="patientGrid">

            <label>
              Tanggal Masuk
              <input
                className="input"
                type="date"
                value={statusForm.tanggal_masuk}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    tanggal_masuk: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Tanggal Keluar
              <input
                className="input"
                type="date"
                value={statusForm.tanggal_keluar}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    tanggal_keluar: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Diagnosa Utama
              <input
                className="input"
                value={statusForm.diagnosa_utama}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    diagnosa_utama: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Diagnosa Penyerta
              <input
                className="input"
                value={statusForm.diagnosa_penyerta}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    diagnosa_penyerta: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Komplikasi
              <input
                className="input"
                value={statusForm.komplikasi}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    komplikasi: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Tindakan Utama
              <input
                className="input"
                value={statusForm.tindakan_utama}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    tindakan_utama: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Tindakan Lain
              <input
                className="input"
                value={statusForm.tindakan_lain}
                onChange={e =>
                  setStatusForm(p => ({
                    ...p,
                    tindakan_lain: e.target.value
                  }))
                }
              />
            </label>

          </div>

          <div className="formActions">
            <button
              className="btn btnPrimary"
              disabled={savingStatus}
              onClick={() => void saveStatusInfo()}
            >
              {savingStatus
                ? 'Menyimpan...'
                : 'Simpan Status Perawatan'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
