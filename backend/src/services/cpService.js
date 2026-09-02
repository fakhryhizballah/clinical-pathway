import CpTemplate from '../models/CpTemplate.js';
import CpRecord from '../models/CpRecord.js';
import { findpx, covertUsia } from './pxService.js'

function buildChecklist(template) {
  return template.categories.map(category => ({
    nama: category.nama,
    items: category.items.map(item => ({
      kode: item.kode,
      nama: item.nama,
      biaya: item.biaya ?? 0,
      hari: Array.from({ length: template.jumlah_hari }, (_, idx) => {
        const hari = idx + 1;
        return {
          hari,
          status: item.hari.includes(hari) ? 'pending' : 'not_applicable',
          checked_at: null,
          checked_by: null,
          variance: undefined
        };
      })
    }))
  }));
}

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function getCreateRecord({ no_reg, no_rm, kode_template_cp }) {
  const existing = await CpRecord.findOne({ no_reg, no_rm, kode_template_cp });
  if (existing) {
    return { record: existing._id, generated: false };
  }

  const template = await CpTemplate.findOne({ kode_template_cp, status: 'active' });
  if (!template) {
    const error = new Error('Template CP tidak ditemukan');
    error.status = 404;
    throw error;
  }
  let datapx = await findpx(no_rm);
  console.log(datapx)
  if (datapx == null){
    const error = new Error('Pasien tidak ditemukan');
    error.status = 404;
    throw error;
  }

  try {
    const record = await CpRecord.create({
      no_reg,
      no_rm,
      nama_pasien: datapx.data.nm_pasien,
      umur_tgl_lahir: datapx.data.tgl_lahir + ' (' + covertUsia(datapx.data.tgl_lahir) + ')',
      kode_template_cp: template.kode_template_cp,
      nama_template: template.nama_template,
      diagnosis: template.diagnosis,
      template_version: template.version,
      jumlah_hari: template.jumlah_hari,
      catatan_khusus: template.catatan_khusus || '',
      status: 'in_progress',
      checklist: buildChecklist(template),
      variances: [],
      discharge_planning: {
        criteria: template.discharge_criteria.map(c => ({ ...c.toObject?.() ?? c, done: false })),
        ready_for_discharge: false
      }
    });
    return { record: record._id, generated: true };
  } catch (error) {
    if (error?.code === 11000) {
      const record = await CpRecord.findOne({ no_reg, no_rm, kode_template_cp });
      return { record, generated: false };
    }
    throw error;
  }
}
export async function getDataRecord({ id }) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }
  return record;
}
export async function getOrCreateRecord({ no_reg, no_rm, kode_template_cp}) {
  const existing = await CpRecord.findOne({ no_reg, no_rm, kode_template_cp });
  if (existing) {
    return { record: existing, generated: false };
  }

  const template = await CpTemplate.findOne({ kode_template_cp, status: 'active' });
  if (!template) {
    const error = new Error('Template CP tidak ditemukan');
    error.status = 404;
    throw error;
  }

  try {
    const record = await CpRecord.create({
      no_reg,
      no_rm,
      kode_template_cp: template.kode_template_cp,
      actor,
      nama_template: template.nama_template,
      diagnosis: template.diagnosis,
      template_version: template.version,
      jumlah_hari: template.jumlah_hari,
      catatan_khusus: template.catatan_khusus || '',
      status: 'in_progress',
      checklist: buildChecklist(template),
      variances: [],
      discharge_planning: {
        criteria: template.discharge_criteria.map(c => ({ ...c.toObject?.() ?? c, done: false })),
        ready_for_discharge: false
      }
    });
    return { record, generated: true };
  } catch (error) {
    if (error?.code === 11000) {
      const record = await CpRecord.findOne({ no_reg, no_rm, kode_template_cp });
      return { record, generated: false };
    }
    throw error;
  }
}

export async function updatePatientInfo({ id, actor, data }) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }

  const allowed = ['nama_pasien', 'diagnosa_Awal', 'berat_badan', 'tinggi_badan', 'umur_tgl_lahir'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      record[key] = key === 'berat_badan' || key === 'tinggi_badan' ? normalizeNumber(data[key]) : (data[key] ?? '');
    }
  }
  if (actor) record.actor = actor;
  await record.save();
  return record;
}


export async function updateStatus({
  id,
  data
}) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }

  const fields = [
    'tanggal_masuk',
    'tanggal_keluar',
    'diagnosa_utama',
    'diagnosa_penyerta',
    'komplikasi',
    'tindakan_utama',
    'tindakan_lain'
  ];

  for (const key of fields) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      record[key] = data[key] ?? '';
    }
  }

  await record.save();

  return record;
}

export async function updateChecklist({ id, item_code, hari, status, actor = 'system' }) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }

  const allowedStatus = ['pending', 'done', 'not_done', 'variance'];
  if (!allowedStatus.includes(status)) {
    const error = new Error('Status checklist tidak valid');
    error.status = 400;
    throw error;
  }

  let found = false;
  for (const category of record.checklist) {
    for (const item of category.items) {
      if (item.kode !== item_code) continue;
      const day = item.hari.find(d => d.hari === Number(hari));
      if (!day || day.status === 'not_applicable') continue;
      day.status = status;
      day.checked_at = new Date();
      day.checked_by = actor;
      found = true;
    }
  }

  if (!found) {
    const error = new Error('Item checklist/hari tidak valid');
    error.status = 400;
    throw error;
  }

  await record.save();
  return record;
}

export async function addVariance({ id, actor = '', variance }) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }

  const types = ['not_performed', 'additional_action', 'delayed', 'substituted'];
  if (!types.includes(variance?.type)) {
    const error = new Error('Tipe varians tidak valid');
    error.status = 400;
    throw error;
  }
  if (!String(variance?.alasan || '').trim()) {
    const error = new Error('Alasan varians wajib diisi');
    error.status = 400;
    throw error;
  }

  record.variances.push({
    item_code: variance.item_code || '',
    hari: variance.hari === '' || variance.hari == null ? null : Number(variance.hari),
    tanggal: variance.tanggal ? new Date(variance.tanggal) : null,
    type: variance.type,
    alasan: variance.alasan,
    catatan: variance.catatan || '',
    created_by: actor,
    created_at: new Date()
  });

  await record.save();
  return record;
}

export async function deleteVariance({ id, varianceId }) {
  const record = await CpRecord.findById(id);
  if (!record) {
    const error = new Error('CP record tidak ditemukan');
    error.status = 404;
    throw error;
  }
  const target = record.variances.id(varianceId);
  if (!target) {
    const error = new Error('Catatan varians tidak ditemukan');
    error.status = 404;
    throw error;
  }
  target.deleteOne();
  await record.save();
  return record;
}
