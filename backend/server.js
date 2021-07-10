const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("./app/config/db.config");
const nodemailer = require('nodemailer');

const app = express();
// Will move to .env file
const secret = "secretkey23456";
var corsOption = {
  origin: 'http://localhost:5000'
};


// Nodemailer setup
let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'safuelandpetroleum@gmail.com',
    pass: 'Petroleum_Logistics2021'
  }
});


// Middleware
app.use(cors(corsOption))
// parse the request of content type - application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method creation -- find user by email
const findUserByEmail = (email, cb) => {
  return db.get(`SELECT * FROM appusers WHERE email = ?`, [email], (err, row) => {
    cb(err, row)
  });
}

// Routing

// Test route -- gotta check them routes 🤣
app.get('/', (req, res) => {
  res.json({ Message: "Test Endpoint Reached..." })
});


//  Get all available cars
app.get('/cars', (req, res, next) => {
  db.all("SELECT * FROM available_cars", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
    }
    res.status(200).json({ rows })
  });
});

//  Get all bookings
app.get('/bookings', (req, res, next) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
    }
    res.status(200).json({ rows })
  });
});

//  Get bookings by ID
app.get('/booking/:id', (req, res, next) => {
  var reqBody = req.body;
  const id = req.params
  var sql = `SELECT * FROM bookings WHERE bookings.clientid = ${id.id}`
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }
    res.status(200).json({ rows })
  });
});

// POST a booking
app.post('/book', (req, res, next) => {
  var reqBody = req.body;
  db.run(`INSERT INTO bookings (idNum, clientID, name, surname, email, phone, address1, address2, city, province, country, postal_code, manufacturer, vehicle_name, booking_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [reqBody.idNum, reqBody.clientID, reqBody.name, reqBody.surname, reqBody.email, reqBody.phone, reqBody.address1, reqBody.address2, reqBody.city, reqBody.province, reqBody.country, reqBody.postal_code, reqBody.manufacturer, reqBody.vehicle_name, reqBody.booking_date],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(201).json({
        "id": this.lastId
      })
      // nodemailer sending
      let mailDetails = {
        from: 'auto@bookiit.com',
        to: reqBody.email,
        subject: 'Booking mail',
        text: `Hello, ${reqBody.name}. Your test drive has been booked for ${reqBody.booking_date}. Your vehicle is the ${reqBody.manufacturer} ${reqBody.vehicle_name}`
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log('Error Occurs');
        } else {
          console.log('Email sent successfully');
        }
      });
    });
});

// PATCH a booking
app.patch("/book/:id", (req, res, next) => {
  var reqBody = req.body
  const id = req.params

  db.run(`UPDATE bookings set idNum =  COALESCE(?,idNum), clientID =  COALESCE(?,clientID), name =  COALESCE(?,name), surname =  COALESCE(?,surname), email =  COALESCE(?,email), phone =  COALESCE(?,phone), address1 =  COALESCE(?,address1), address2 = COALESCE(?,address2), city = COALESCE(?,city), province = COALESCE(?,province), country = COALESCE(?,country), postal_code = COALESCE(?,postal_code), manufacturer = COALESCE(?,manufacturer), vehicle_name = COALESCE(?,vehicle_name), booking_date = COALESCE(?,booking_date) WHERE id = ${id.id}`,
    [reqBody.idNum, reqBody.clientID, reqBody.name, reqBody.surname, reqBody.email, reqBody.phone, reqBody.address1, reqBody.address2, reqBody.city, reqBody.province, reqBody.country, reqBody.postal_code, reqBody.manufacturer, reqBody.vehicle_name, reqBody.booking_date],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(200).json({
        "updated": this.changes
      })
      // nodemailer sending
      let mailDetails = {
        from: 'auto@bookiit.com',
        to: reqBody.email,
        subject: 'Update mail',
        text: `Hello, ${reqBody.name}. Your test drive has been updated for ${reqBody.booking_date}. Your vehicle is the ${reqBody.manufacturer} ${reqBody.vehicle_name}`
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log('Error Occurs');
        } else {
          console.log('Email sent successfully');
        }
      });
    });
});








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

