import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  kode: { type: String, required: true },
  nama: { type: String, required: true },
  hari: { type: [Number], required: true },
  biaya: { type: Number, default: 0 }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  nama: { type: String, required: true },
  items: { type: [itemSchema], default: [] }
}, { _id: false });

const dischargeCriteriaSchema = new mongoose.Schema({
  code: String,
  name: String
}, { _id: false });

const cpTemplateSchema = new mongoose.Schema({
  kode_template_cp: { type: String, required: true, unique: true, index: true },
  nama_template: { type: String, required: true },
  diagnosis: { type: String, required: true },
  jumlah_hari: { type: Number, required: true, min: 1 },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active' },
  catatan_khusus: { type: String, default: '' },
  categories: { type: [categorySchema], default: [] },
  discharge_criteria: { type: [dischargeCriteriaSchema], default: [] }
}, { timestamps: true, collection: 'cp_templates', strict: false });

export default mongoose.model('CpTemplate', cpTemplateSchema);
