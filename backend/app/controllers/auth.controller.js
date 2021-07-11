const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../config/db.config");

// Will move to .env file
const secret = "secretkey23456";

// Method creation -- find user by email
const findUserByEmail = (email, cb) => {
  return db.get(`SELECT * FROM appusers WHERE email = ?`, [email], (err, row) => {
    cb(err, row)
  });
}


exports.registerUser = async (req, res, next) => {
  try {
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
        return res.status(400).json({ "error": err.message })
      }
      findUserByEmail(data.email, (err, user) => {
        if (err) {
          return res.status(400).send({ "error": err.message })
        }
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, secret, {
          expiresIn: expiresIn
        });
        return res.status(200).send({
          "status": "success",
          "data": data,
          "access_token": accessToken,
          "id": this.lastId
        })
      })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

exports.loginUser = async (req, res, next) => {
  try {
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

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
