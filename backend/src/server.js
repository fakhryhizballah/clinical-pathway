import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cpRoutes from './routes/cpRoutes.js';
import CpTemplate from './models/CpTemplate.js';
import { cpPersalinanMacet } from './seeds/cpPersalinanMacet.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/clinical-pathway', cpRoutes);

async function seedDemo() {
  const seeds = [
    {
      kode_template_cp: 'CP-SEPSIS-MATERNAL',
      nama_template: 'Clinical Pathway Sepsis Maternal',
      diagnosis: 'Sepsis Maternal',
      jumlah_hari: 3,
      version: 1,
      status: 'active',
      catatan_khusus: '',
      categories: [
        { nama: 'Penilaian Medis', items: [
          { kode: 'PM001', nama: 'Assessment kondisi umum', hari: [1,2,3], biaya: 0 },
          { kode: 'PM002', nama: 'Monitoring tanda vital', hari: [1,2,3], biaya: 0 }
        ]},
        { nama: 'Pemeriksaan Penunjang', items: [
          { kode: 'LAB001', nama: 'Darah lengkap', hari: [1,3], biaya: 75000 },
          { kode: 'LAB002', nama: 'Kultur darah', hari: [1], biaya: 150000 }
        ]},
        { nama: 'Medikasi', items: [
          { kode: 'MED001', nama: 'Antibiotik sesuai protokol', hari: [1,2,3], biaya: 250000 },
          { kode: 'MED002', nama: 'Terapi cairan', hari: [1,2], biaya: 50000 }
        ]}
      ],
      discharge_criteria: [
        { code: 'DC001', name: 'Hemodinamik stabil' },
        { code: 'DC002', name: 'Hasil laboratorium membaik' }
      ]
    },
    cpPersalinanMacet
  ];

  for (const seed of seeds) {
    const exists = await CpTemplate.findOne({ kode_template_cp: seed.kode_template_cp });
    if (!exists) await CpTemplate.create(seed);
  }
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinical_pathway')
  .then(async () => {
    // await seedDemo();
    app.listen(port, () => console.log(`Clinical Pathway API running on http://localhost:${port}`));
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
