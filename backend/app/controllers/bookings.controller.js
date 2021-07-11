const db = require("../config/db.config");

// NODEMAILER Config
const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'safuelandpetroleum@gmail.com',
    pass: 'Petroleum_Logistics2021'
  }
});

exports.getBookings = async (req, res, next) => {
  try {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
      if (err) {
        return res.status(400).json({ "error": err.message })
      }
      return res.status(200).json({ rows })
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    })
  }
}

exports.getBookingsByID = async (req, res, next) => {
  try {
    var reqBody = req.body;
    const id = req.params
    var sql = `SELECT * FROM bookings WHERE bookings.clientid = ${id.id}`
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      return res.status(200).json({ rows })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    })
  }
}

exports.deleteBooking = async (req, res, next) => {
  try {
    var reqBody = req.body;
    const id = req.params
    var sql = `DELETE FROM bookings WHERE bookings.id = ${id.id}`
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      return res.status(200).json({ "updated": this.changes })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    })
  }
}

exports.postBooking = async (req, res, next) => {
  try {
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

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    })
  }
}

exports.updateBooking = async (req, res, next) => {
  try {
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

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    })
  }
}
