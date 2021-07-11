const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("./app/config/db.config");


const app = express();

// Will move to .env file
const secret = "secretkey23456";

var corsOption = {
  origin: 'http://localhost:5000'
};



// Middleware
app.use(cors(corsOption))
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded());



// Method creation -- find user by email
const findUserByEmail = (email, cb) => {
  return db.get(`SELECT * FROM appusers WHERE email = ?`, [email], (err, row) => {
    cb(err, row)
  });
}

// Routing import
const simpleRoute = require('./app/routes/simple.routes')
const carRoute = require('./app/routes/cars.routes')
const bookingsRoute = require('./app/routes/bookings.routes')

// Test route -- gotta check them routes 🤣
app.use('/api', simpleRoute)
app.use('/api/cars', carRoute)
app.use('/api', bookingsRoute)



/* The following routes are for auth purposes 🔒 */
// Login and register routes
app.post('/register', (req, res, next) => {

  var errors = []
  if (!req.body.password) {
    errors.push("Password not specified");
  }
  if (!req.body.email) {
    errors.push("Email not specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join });
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  }

  var sql = 'INSERT INTO appusers (name, email, password) VALUES (?,?,?)'
  var params = [data.name, data.email, data.password]

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
    }
    findUserByEmail(data.email, (err, user) => {
      if (err) {
        return res.status(400).send({ "error": err.message })
      }
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: user.id }, secret, {
        expiresIn: expiresIn
      });
      res.status(200).send({
        "status": "success",
        "data": data,
        "access_token": accessToken,
        "id": this.lastId
      })
    })
  });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  findUserByEmail(email, (err, user) => {
    if (err) return res.status(500).send('Server error!');
    if (!user) return res.status(404).send('User not found!');
    const result = bcrypt.compareSync(password, user.password);
    if (!result) return res.status(401).send('Password not valid!');

    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ id: user.id }, secret, {
      expiresIn: expiresIn
    });
    res.status(200).send(
      {
        "user": {
          ...user,
          "access_token": accessToken,
          "expires_in": expiresIn
        },
      });
  });
});


// Set port and list for requests
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

