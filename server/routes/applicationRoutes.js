const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

router.get('/', auth, applicationController.getApplications);

router.post('/', auth, applicationController.createApplication);

router.put('/:id', auth, applicationController.updateApplication);

router.delete('/:id', auth, applicationController.deleteApplication);

router.get('/stats/dashboard', auth, applicationController.getStats);

module.exports = router;