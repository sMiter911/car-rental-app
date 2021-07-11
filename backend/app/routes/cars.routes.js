const express = require('express')
const router = express.Router();
const {getCars} = require('../controllers/cars.controller');

//  Get all available cars
router
  .route('/')
  .get(getCars)


module.exports = router;
