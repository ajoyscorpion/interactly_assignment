const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'contacts_db'
})

connection.connect( err => {
    if(err){
        console.log(`Failed to connect to MySQL : ${err}`)
    }
    else{
        console.log("MySQL Connected")
        connection.query(`SHOW DATABASES`,
            function (err, result) {
                if (err)
                    console.log(`Error executing the query - ${err}`)
                else
                    console.log("Result: ", result)
            })
    }
})


module.exports = connection