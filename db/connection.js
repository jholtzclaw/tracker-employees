const mysql = require('mysql2');

// database connection created
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Bella249',
    database: 'employees'
  });

  connection.connect(err => {
      if (err) throw err;
      console.log('Connection successful')
  })

  module.exports = connection;