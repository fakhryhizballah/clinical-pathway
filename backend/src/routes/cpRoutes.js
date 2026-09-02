import { Router } from 'express';
import {
  findOrCreateRecord,
  getRecord,
  getOrCreate,
  patchChecklist,
  patchPatientInfo,
  patchUpdateStatus,
  postVariance,
  removeVariance
} from '../controllers/cpController.js';

const router = Router();

router.get('/generate/:no_reg/:no_rm/:kode_template_cp/:nip', findOrCreateRecord);
router.get('/record/:id', getRecord);
router.get('/:no_reg/:no_rm/:kode_template_cp/:nip', getOrCreate);
router.patch('/record/:id/checklist', patchChecklist);
router.patch('/record/:id/patient-info', patchPatientInfo);
router.patch('/record/:id/status', patchUpdateStatus);
router.post('/record/:id/variances', postVariance);
router.delete('/record/:id/variances/:varianceId', removeVariance);

export default router;
