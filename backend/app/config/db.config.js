const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "booking.db";
const bcrypt = require('bcryptjs');

// Create DB 
let db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log('Connected to the booking database.');
    db.run('CREATE TABLE bookings ( \
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
      idNum NVARCHAR(13), \
      name NVARCHAR(20), \
      surname NVARCHAR(20), \
      email NVARCHAR(20), \
      address1 NVARCHAR(20), \
      address2 NVARCHAR(20), \
      city NVARCHAR(20), \
      province NVARCHAR(20), \
      country NVARCHAR(20), \
      postal NVARCHAR(20), \
      manufacturer NVARCHAR(20), \
      vehicle_name NVARCHAR(20), \
      booking_date DATETIME, \
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP \
      )', (err) => {
      if (err) {
        console.log('bookings table already exists')
      } else {
        let sql = 'INSERT INTO bookings (idNum, name, surname, email, address1, address2, city, province, country, postal, manufacturer, vehicle_name, booking_date, created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        db.run(sql, ['1234567890123', 'John', 'Doe', 'john@gmail.com', '123 avenue', 'Melville', 'Johannesburg', 'Gauteng', 'South Africa', '2092', 'BMW', '3 Series', '2021/07/09', '2021/07/09'])
      }

    });
    db.run(`CREATE TABLE available_cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manufacturer NVARCHAR(20),
      vehicle_name NVARCHAR(20),
      vehicle_reg NVARCHAR(20),
      vehicle_pic NVARCHAR(250)
        )`,
          (err) => {
            if (err) {
              console.log('available_cars table already exists')
            } else {
              var insert = 'INSERT INTO available_cars (manufacturer, vehicle_name, vehicle_reg,vehicle_pic) VALUES (?,?,?,?)'
              db.run(insert, ["BMW", "8 Series", "2021", "https://smartcdn.prod.postmedia.digital/driving/wp-content/uploads/2021/05/chrome-image-414927.png"])
          db.run(insert, ["BMW", "M4 Coupe", "2021", "https://autocanadaprod-com.cdn-convertus.com/uploads/sites/86/2021/02/BMW-M4-Competition-Coupe_v2.png"])
          db.run(insert, ["BMW", "M2 Coupe", "2021", "https://images.carprices.com/pricebooks_data/usa/colorized/2021/BMW/View2/M2_Competition_Coupe/3.0L/212S_C33.png"])
            }
          }); 
    db.run(`CREATE TABLE appusers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text, 
      email text UNIQUE, 
      password text,
      CONSTRAINT email_unique UNIQUE (email)
    )`,
      (err) => {
        if (err) {
          console.log('appusers table already exists')
        } else {
          var insert = 'INSERT INTO appusers (name, email, password) VALUES (?,?,?)'
          db.run(insert, ["admin", "admin@example.com", bcrypt.hashSync("password123")])
        }
      });
  }
});

module.exports = db;