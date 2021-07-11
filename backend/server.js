const express = require('express');
const cors = require('cors');

const app = express();

var corsOption = {
  origin: 'http://localhost:5000'
};

// Middleware
app.use(cors(corsOption))
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded());


// Routing import
const simpleRoute = require('./app/routes/simple.routes')
const carRoute = require('./app/routes/cars.routes')
const bookingsRoute = require('./app/routes/bookings.routes')
const authRoutes = require('./app/routes/auth.routes')

// Test route -- gotta check them routes, they can be pesky 🤣
app.use('/api', simpleRoute)
// Route for getting cars available
app.use('/api/cars', carRoute)
// Routes for bookings, update of bookings and deletions
app.use('/api', bookingsRoute)
/* The following routes are for auth purposes 🔒 */
app.use('/api/auth', authRoutes)


// Set port and list for requests
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});