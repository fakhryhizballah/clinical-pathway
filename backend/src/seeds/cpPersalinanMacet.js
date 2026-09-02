export const cpPersalinanMacet = {
  kode_template_cp: 'CP-PERSALINAN-MACET-DISTOSIA',
  nama_template: 'Clinical Pathway PERSALINAN MACET (DISTOSIA)',
  diagnosis: 'PERSALINAN MACET (DISTOSIA)',
  jumlah_hari: 3,
  version: 1,
  status: 'active',
  catatan_khusus: `Diagnosis persalinan macet ditegakkan berdasarkan durasi dan evaluasi kemajuan persalinan:\n• Fase Laten Memanjang: Persalinan tahap awal (pembukaan serviks belum mencapai 4 cm) yang berlangsung lebih dari 20 jam untuk ibu yang baru pertama kali melahirkan, atau lebih dari 14 jam untuk ibu yang sudah pernah melahirkan sebelumnya.\n• Fase Aktif Memanjang: Pembukaan serviks lambat dan tidak mencapai kemajuan yang diharapkan (kurang dari 1,2 cm per jam untuk anak pertama atau kurang dari 1,5 cm per jam untuk anak berikutnya).\n• Henti Turunnya Janin: Kepala atau bagian tubuh janin tidak kunjung turun ke panggul meskipun ibu sudah mengejan dalam periode waktu tertentu.`,
  categories: [
    {
      nama: '1. Penilaian dan Pemantauan Medis',
      items: [
        { kode: 'PMS-001', nama: 'Pencatatan data awal pasien', hari: [1], biaya: 0 },
        { kode: 'PMS-002', nama: 'Pemeriksaan awal – Anamnesis: Power (His/Tenaga Ibu); Passage (Jalan Lahir): riwayat operasi panggul atau tulang punggung; Passenger (Janin): taksiran berat janin, riwayat melahirkan bayi besar > 4 kg, gerakan janin; Status Ketuban: kapan ketuban pecah, warna dan bau cairan; Tanda Infeksi', hari: [1, 2], biaya: 0 },
        { kode: 'PMS-003', nama: 'Pemeriksaan Fisik: tanda vital (hemodinamik) dan keadaan umum; pemeriksaan abdomen; palpasi Leopold; His (Kontraksi); Denyut Jantung Janin (DJJ); Pemeriksaan Dalam (VT); penilaian jalan lahir (Passage)', hari: [1, 2], biaya: 0 }
      ]
    },
    {
      nama: '2. Penilaian dan Pemantauan Kebidanan',
      items: [
        { kode: 'KEB-001', nama: 'Pemantauan kondisi ibu dan janin sesuai partograf', hari: [1, 2], biaya: 0 }
      ]
    },
    {
      nama: '3. Penilaian dan Pemantauan Farmasi',
      items: [
        { kode: 'FAR-001', nama: 'Rekonsiliasi awal (obat rutin sebelumnya, riwayat alergi dan efek samping obat)', hari: [1], biaya: 0 }
      ]
    },
    {
      nama: '4. Penilaian dan Pemantauan Gizi',
      items: [
        { kode: 'GIZ-001', nama: 'Pengkajian awal asuhan gizi', hari: [1], biaya: 0 },
        { kode: 'GIZ-002', nama: 'Intervensi Gizi', hari: [1], biaya: 0 },
        { kode: 'GIZ-003', nama: 'Monitoring dan evaluasi asuhan gizi', hari: [2, 3], biaya: 0 }
      ]
    },
    {
      nama: '5. Pemeriksaan Penunjang Medik (Laboratorium, radiologi, dsb.)',
      items: [
        { kode: 'LAB-001', nama: 'Darah Lengkap', hari: [1], biaya: 0 },
        { kode: 'LAB-002', nama: 'USG', hari: [1], biaya: 0 }
      ]
    },
    {
      nama: '6. Tindakan Medis',
      items: [
        { kode: 'TIN-001', nama: 'Pemasangan IV Line', hari: [1, 2], biaya: 0 },
        { kode: 'TIN-002', nama: 'Oksigenisasi', hari: [1, 2], biaya: 0 },
        { kode: 'TIN-003', nama: 'Pemasangan kateter urine', hari: [1, 2], biaya: 0 },
        { kode: 'TIN-004', nama: 'Untuk distosia bahu, melakukan perubahan posisi ibu (seperti menekuk paha ke arah perut/manuver Mc Roberts) dan manuver rotasi di dalam jalan lahir', hari: [1, 2], biaya: 0 },
        { kode: 'TIN-005', nama: 'Tindakan Operasi Caesar (jika ada indikasi)', hari: [3], biaya: 0 }
      ]
    },
    {
      nama: '7. Tatalaksana Kebidanan',
      items: [
        { kode: 'KEB-002', nama: 'Monitoring: tanda-tanda vital (MEOWS); kontraksi uterus; lochea; kandung kemih', hari: [1, 2, 3], biaya: 0 },
        { kode: 'KEB-003', nama: 'Perawatan Luka Perineum', hari: [1, 2, 3], biaya: 0 }
      ]
    },
    {
      nama: '8. Tatalaksana Farmasi',
      items: [
        { kode: 'FAR-002', nama: 'Telaah Resep', hari: [1, 2, 3], biaya: 0 }
      ]
    },
    {
      nama: '9. Nutrisi (Enteral, Parenteral, Diet, Pembatasan Cairan, Makanan Tambahan, dsb.)',
      items: [
        { kode: 'NUT-001', nama: 'Diet TKTP', hari: [1, 2, 3], biaya: 0 },
        { kode: 'NUT-002', nama: 'Bentuk makanan lunak/Biasa', hari: [1, 2, 3], biaya: 0 }
      ]
    },
    {
      nama: '10. Medikasi (Obat-Obatan, Cairan, IV, Tranfusi)',
      items: [
        { kode: 'MED-001', nama: 'Infus NaCl 0,9% atau infus D5%', hari: [1, 2, 3], biaya: 0 },
        { kode: 'MED-002', nama: 'Pemberian Oksitosin – Dosis Rendah: dosis awal 0,5–1 mU/menit, peningkatan 1 mU setiap 30–40 menit; 1–2 mU/menit, peningkatan 2 mU setiap 15 menit. Dosis Tinggi: dosis awal 4,5 mU/menit, peningkatan 4,5 mU setiap 15–30 menit; 6 mU/menit, peningkatan 6 mU setiap 15 menit; 7 mU/menit, peningkatan 7 mU setiap 15 menit', hari: [1, 2], biaya: 0 }
      ]
    },
    {
      nama: '11. Pendidikan dan Komunikasi dengan Pasien/Keluarga (Obat, Diet, Penggunaan Alat, Rehabilitasi, dsb.)',
      items: [
        { kode: 'EDU-001', nama: 'Menjelaskan mengenai keadaan pasien, diagnosa, penyebab dan cara pencegahannya', hari: [1], biaya: 0 },
        { kode: 'EDU-002', nama: 'Menjelaskan tentang rencana tindakan medis', hari: [1], biaya: 0 },
        { kode: 'EDU-003', nama: 'Menjelaskan tentang persiapan tindakan lanjutan (emergency) seperti tindakan vakum, forsep, atau operasi Caesar', hari: [2], biaya: 0 }
      ]
    },
    {
      nama: '12. Rencana Discharge (Penilaian Outcome pasien yang harus dicapai sebelum pemulangan)',
      items: [
        { kode: 'DC-001', nama: 'Hemodinamik Stabil', hari: [3], biaya: 0 },
        { kode: 'DC-002', nama: 'Tidak ada komplikasi', hari: [3], biaya: 0 },
        { kode: 'DC-003', nama: 'Aktifitas fisik dilakukan secara mandiri', hari: [3], biaya: 0 },
        { kode: 'DC-004', nama: 'Luka bekas sayatan operasi (jika persalinan berakhir dengan sectio caesarea) atau luka jalan lahir kering, bersih, dan tidak ada tanda kemerahan atau nanah', hari: [3], biaya: 0 },
        { kode: 'DC-005', nama: 'Ibu dan keluarga telah memahami instruksi perawatan di rumah dan mengenali tanda-tanda bahaya pada masa nifas maupun bayi baru lahir', hari: [3], biaya: 0 },
        { kode: 'DC-006', nama: 'Pasien dan keluarga sudah mengerti jadwal untuk kontrol ulang dan surat kontrol sudah ada', hari: [3], biaya: 0 }
      ]
    }
  ],
  discharge_criteria: [
    { code: 'OUT-001', name: 'Hemodinamik Stabil' },
    { code: 'OUT-002', name: 'Tidak ada komplikasi' },
    { code: 'OUT-003', name: 'Aktifitas fisik dilakukan secara mandiri' },
    { code: 'OUT-004', name: 'Luka bekas sayatan operasi atau luka jalan lahir kering, bersih, dan tidak ada tanda kemerahan atau nanah' },
    { code: 'OUT-005', name: 'Ibu dan keluarga memahami instruksi perawatan di rumah serta tanda bahaya pada masa nifas maupun bayi baru lahir' },
    { code: 'OUT-006', name: 'Pasien dan keluarga mengerti jadwal kontrol ulang dan surat kontrol sudah ada' }
  ]
};
