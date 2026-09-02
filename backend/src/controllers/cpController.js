import {
  getCreateRecord,
  getDataRecord,
  getOrCreateRecord,
  updateChecklist,
  updatePatientInfo,
  updateStatus,
  addVariance,
  deleteVariance,
  getTemplates
} from '../services/cpService.js';
const host = process.env.HOST || 'http://localhost:3000';
export async function findOrCreateRecord(req, res) {
  try {
    console.log(req.params);
    const result = await getCreateRecord({ ...req.params });
    const text = result.record + '#' + req.params.nip;
    const encoded = Buffer.from(text, 'utf-8').toString('base64');
    res.json({ ok: true, url: host + '/clinical-pathway/' + encoded });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
  
}
export async function getOrCreate(req, res) {
  try {
    const result = await getOrCreateRecord({ ...req.params});
    res.json({ ok: true, generated: result.generated, data: result.record });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}
export async function getRecord(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({ ok: false, message: 'id is required' });
    }
    let encoded = req.params.id;
    const text = Buffer.from(encoded, 'base64').toString('utf-8');
    const [record, nip] = text.split('#');
    req.params.id = record;
    req.params.nip = nip;
    const data = await getDataRecord({ id: req.params.id });
    res.json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}

export async function patchChecklist(req, res) {
  try {
    const { item_code, hari, status, actor } = req.body;
    const data = await updateChecklist({
      id: req.params.id,
      item_code,
      hari,
      status,
      actor
    });
    res.json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}

export async function patchPatientInfo(req, res) {
  try {
    const data = await updatePatientInfo({
      id: req.params.id,
      actor: req.body.actor,
      data: req.body
    });
    res.json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}
export async function patchUpdateStatus(req, res) {
  try {
    const { id } = req.params;

    const data = {
      ...req.body,
      actor: req.body.actor
    };

    const record = await updateStatus({
      id,
      data
    });

    return res.json({
      ok: true,
      message: 'Status Clinical Pathway berhasil diperbarui',
      data: record
    });
  } catch (error) {
    console.error('updateStatus error:', error);

    return res.status(500).json({
      ok: false,
      message: error.message || 'Gagal memperbarui status Clinical Pathway'
    });
  }
}

export async function postVariance(req, res) {
  try {
    const data = await addVariance({
      id: req.params.id,
      actor: req.body.actor,
      variance: req.body
    });
    res.status(201).json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}

export async function removeVariance(req, res) {
  try {
    const data = await deleteVariance({ id: req.params.id, varianceId: req.params.varianceId });
    res.json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
}

export async function getListTemplates(req, res) {
  try {
    const data = await getTemplates();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }

}
