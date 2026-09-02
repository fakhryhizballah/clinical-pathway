import mongoose from 'mongoose';

const varianceSchema = new mongoose.Schema({
  item_code: { type: String, default: '' },
  hari: { type: Number, default: null },
  tanggal: { type: Date, default: null },
  type: {
    type: String,
    enum: ['not_performed', 'additional_action', 'delayed', 'substituted']
  },
  alasan: { type: String, default: '' },
  catatan: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  created_by: { type: String, default: '' }
});

const daySchema = new mongoose.Schema({
  hari: Number,
  status: {
    type: String,
    enum: ['pending', 'done', 'not_done', 'variance', 'not_applicable']
  },
  checked_at: Date,
  checked_by: String,
  variance: {
    type: new mongoose.Schema({
      type: { type: String, enum: ['not_performed', 'additional_action', 'delayed', 'substituted'] },
      reason: String,
      note: String,
      created_at: Date,
      created_by: String
    }, { _id: false }),
    default: undefined
  }
}, { _id: false });

const itemSchema = new mongoose.Schema({
  kode: String,
  nama: String,
  biaya: { type: Number, default: 0 },
  hari: { type: [daySchema], default: [] }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  nama: String,
  items: { type: [itemSchema], default: [] }
}, { _id: false });

const dischargeCriteriaSchema = new mongoose.Schema({
  code: String,
  name: String,
  done: { type: Boolean, default: false }
}, { _id: false });

const cpRecordSchema = new mongoose.Schema({
  no_reg: { type: String, required: true, index: true },
  no_rm: { type: String, required: true, index: true },
  kode_template_cp: { type: String, required: true, index: true },
  nama_template: String,
  diagnosis: String,
  template_version: Number,
  jumlah_hari: Number,

  nama_pasien: { type: String, default: '' },
  diagnosa_Awal: { type: String, default: '' },
  berat_badan: { type: Number, default: null },
  tinggi_badan: { type: Number, default: null },
  umur_tgl_lahir: { type: String, default: '' },
  catatan_khusus: { type: String, default: '' },

  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'discharged'],
    default: 'in_progress'
  },
  tanggal_masuk: { type: Date, default: '' },
  tanggal_keluar: { type: Date, default: '' },

  diagnosa_utama: String,
  diagnosa_penyerta: String,
  komplikasi: String,

  tindakan_utama: String,
  tindakan_lain: String,
  checklist: { type: [categorySchema], default: [] },
  variances: { type: [varianceSchema], default: [] },
  discharge_planning: {
    criteria: { type: [dischargeCriteriaSchema], default: [] },
    ready_for_discharge: { type: Boolean, default: false }
  }
}, { timestamps: true, collection: 'cp_records', strict: false });

cpRecordSchema.index({ no_reg: 1, no_rm: 1, kode_template_cp: 1 }, { unique: true });

export default mongoose.model('CpRecord', cpRecordSchema);
