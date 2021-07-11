const express = require('express')
const router = express.Router();
const {getBookings, getBookingsByID, postBooking, updateBooking, deleteBooking} = require('../controllers/bookings.controller')

// Get all bookings
router
.route('/bookings')
.get(getBookings)

// Get booking by ID
router
.route('/booking/:id')
.get(getBookingsByID)


// POST a booking
router
.route('/book')
.post(postBooking)

// PATCH a booking
router
.route('/book/:id')
.patch(updateBooking)
.delete(deleteBooking)


module.exports = router;