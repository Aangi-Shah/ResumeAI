const express = require('express');
const router = express.Router();
const multer = require('multer');

const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  '/analyze',
  auth,
  upload.single('resume'),
  resumeController.analyzeResume
);

router.post(
  '/cover-letter',
  auth,
  upload.single('resume'),
  resumeController.generateCoverLetter
);

module.exports = router;