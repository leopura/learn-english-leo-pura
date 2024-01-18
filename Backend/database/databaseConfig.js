const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool(config);

function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { pool, queryAsync };
