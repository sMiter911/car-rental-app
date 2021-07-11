const express = require('express')
const router = express.Router();
const { simplePath } = require('../controllers/simple.controller');

router
  .route('/')
  .get(simplePath)


module.exports = router;