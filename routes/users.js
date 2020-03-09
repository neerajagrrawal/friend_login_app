const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
var connection = require('../config/keys');
const { forwardAuthenticated } = require('../config/auth');
var Request = require("request");
const upload = require('../config/image') ;


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', upload,(req, res) => {
  const { firstName, lastName, id,password, password2 } = req.body;
  const avatar = req.file.filename ;
  let errors = [];

  if (!firstName || !lastName || !id || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      id,
      password,
      password2
    });
  } else {

    connection.query('SELECT id from users where id= ?',[id],(err,rows,fields)=> {
      if (rows.length>0) {

        errors.push({ msg: 'Id already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          id,
          password,
          password2
        });
      } else {
        console.log(err);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            passoword = hash;

            connection.query('insert into users (id,first_name,last_name,avatar,password) VALUES(?,?,?,?,?)',[id,firstName,lastName,avatar,password],(err,result)=>{
              if(err)
                console.log(err);
                else{
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );}
                res.redirect('/users/login');
              }) ;
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});








//Get All Users -
router.get('/viewAllUsers',(req,res)=>{
  var friends = [] ;
  var rows=[]  ;
  Request.get(`http://localhost:${global.PORT}/API/viewAllFriendsAPI/`+req.user[0].id, (error, response, body) => {
      if(error) {
          console.log(error);
      }

      friends =JSON.parse(body) ;
      Request.get(`http://localhost:${global.PORT}/API/viewAllUsersAPI`, (error, response, body) => {
          if(error) {
              console.log(error);
          }
          //console.log(response);
           rows = JSON.parse(body) ;
           //console.log(typeof rows);
           res.render('allUsers',{
             users:rows,
             friends:friends,
             req:req
           }) ;
      });
  });



}) ;





//Follow a friend
router.get('/follow/:friend_id',(req,res)=>{
  connection.query('insert into friends(self_id,friend_id) VALUES(?,?)',[req.user[0].id,req.params.friend_id],(err,rows,fields)=>{
    if(err){
      throw err ;
    }
    //console.log(req.user[0].id);
    req.flash('success_msg', 'Followed');
    res.redirect('/users/viewAllUsers');
  }) ;

}) ;




// Friends of a User-
router.post('/viewFriends',(req,res)=>{
 const { id } = req.body;
 let errors = [];
 var allFriends = [] ;
 var users = [] ;
 if (!id) {
   errors.push({ msg: 'Please enter UserId' });
 }

 if (errors.length > 0) {
   res.render('dashboard', {
     errors:errors,
     id:id,
     user: req.user
   });
 }
  else {
    Request.get(`http://localhost:${global.PORT}/API/viewAllFriendsDetailsAPI/`+id, (error, response, body) => {
        if(error) {
            console.log(error);
        }
        //console.log(body);
        users = JSON.parse(body) ;
        res.render('allFriends',{
          users:users
        }) ;
      }) ;
 }
}) ;




//Friends of Friends-
router.post('/viewFOF1',(req,res)=>{
 const { id } = req.body;
 let errors = [];
 var allFriends = [] ;
   var temp = [] ;
 if (!id) {
   errors.push({ msg: 'Please enter UserId' });
 }

 if (errors.length > 0) {
   res.render('dashboard', {
     errors:errors,
     id:id,
     user: req.user
   });
 }
  else {
    Request.get(`http://localhost:${global.PORT}/API/viewFriendsOfFriendsAPI/`+id, (error, response, body) => {
        if(error) {
            console.log(error);
        }
        users = JSON.parse(body) ;
        res.render('allFriendsOfFriends',{
          users:users
        }) ;
      }) ;
 }
}) ;








//Friends of Friends-
router.post('/viewFOF',(req,res)=>{
 const { id } = req.body;
 let errors = [];
 var allFriends = [] ;
   var temp = [] ;
 if (!id) {
   errors.push({ msg: 'Please enter UserId' });
 }

 if (errors.length > 0) {
   res.render('dashboard', {
     errors:errors,
     id:id,
     user: req.user
   });
 }
  else {
    connection.query('select friend_id from friends where self_id = ?',[id],(err,rows,fields)=>{
       if(err){
        throw err ;
      }
      if(rows.length == 0){
        res.render('allFriendsOfFriends',{
          users:[],
          req:req
        }) ;
      }
      var friends = [] ;
      friends = rows.map(v => v.friend_id) ;
      //console.log(friends);

      var friendsOfriends = [] ;
      //console.log('231');

      friends.forEach((item, i) => {
        connection.query('select friend_id from friends where self_id = ?',[item],(err,rows,fields)=>{
          if(err){
            throw err ;
          }
          //console.log('above if');
          //console.log(rows);
          if(rows.length >0){
            //console.log('inside if');
            temp = temp.concat(rows) ;
          }
          //console.log('outside if');
          //console.log(temp);
          if(i == friends.length-1){
            //console.log('last loop');
            friendsOfriends = temp.map(v => v.friend_id) ;
            friendsOfriends = friendsOfriends.filter( ( el ) => !friends.includes( el ) );
            friendsOfriends = friendsOfriends.filter(e => e !== id)
            //console.log(friendsOfriends);
            friendsOfriends.forEach((item, i) => {
               connection.query('select * from users where id= ?',item,(err,rows,fields)=>{
                allFriends= allFriends.concat(rows) ;
                if(i == friendsOfriends.length-1){
                  //console.log(allFriends);
                  res.render('allFriendsOfFriends',{
                    users:allFriends,
                    req:req
                  }) ;
                }
                }) ;

            });


          }


        }) ;
      });





     }) ;
 }
}) ;

module.exports = router;
