const db = require("../config/db.config");

exports.getCars = async (req, res, next) => {
  try {
    db.all("SELECT * FROM available_cars", [], (err, rows) => {
      if (err) {
        return res.status(400).json({ "error": err.message })
      }
      return res.status(200).json({ rows })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
}
