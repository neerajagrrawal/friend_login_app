const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
var connection = require('../config/keys');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'id' }, (id, password, done) => {

      connection.query('SELECT * from users where id=?',[id],(err,rows,fields)=>{
        if (rows.length == 0) {
          return done(null, false, { message: 'That Id is not registered' });
        }

      //  console.log(rows[0].password+'----'+password);
        // Match password
        var check = password.localeCompare(rows[0].password) ;


          if (check==0) {
            return done(null, rows);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }

      });
    })
  );

  passport.serializeUser(function(rows, done) {
    done(null, rows[0].id);
  });

  passport.deserializeUser(function(id, done) {

    connection.query('SELECT * from users where id=?',[id],(err,rows,fields)=>{
      done(err, rows);
    });
  });
};
