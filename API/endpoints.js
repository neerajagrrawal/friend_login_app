  const express = require('express');
  const router = express.Router();
  var connection = require('../config/keys');





  //Get All Friends API -
  router.get('/viewAllFriendsAPI/:id',(req,res)=> {
    var friends = [] ;
    connection.query('select friend_id from friends where self_id=?',[req.params.id],(err,rows,fields)=>{
      if(rows.length > 0){
          friends = rows.map(v => v.friend_id) ;
        }
        res.send(friends) ;
      }) ;
  }) ;





  // Get All users API-
  router.get('/viewAllUsersAPI',(req,res)=>{
    connection.query('select * from users',(err,rows,fields)=>{
      if(err){
        throw err ;
      }
      if(rows.length == 0){
        res.send([]) ;
        }
      res.send(rows) ;
      }) ;
  }) ;



  //Get ALl Friends Details API-
  router.get('/viewAllFriendsDetailsAPI/:id',(req,res)=> {
    var friends = [] ;
    var allFriends = [] ;
    connection.query('select friend_id from friends where self_id=?',[req.params.id],(err,rows,fields)=>{
      if(rows.length > 0){
          friends = rows.map(v => v.friend_id) ;
          friends.forEach((item, i) => {
          connection.query('select * from users where id= ?',item,(err,rows,fields)=>{
          allFriends= allFriends.concat(rows) ;
          if(i == friends.length-1){
            res.send(allFriends) ;
          }
          }) ;
        });
      }else{
    res.send(allFriends) ;
  }
  }) ;
  }) ;




  //Get ALl Friends Of Friends API-
  router.get('/viewFriendsOfFriendsAPI/:id',(req,res)=> {
        var allFriendsOfFriends = [],temp = [],allFriends = [] ;
        connection.query('select friend_id from friends where self_id = ?',[req.params.id],(err,rows,fields)=>{
        if(err){
          throw err ;
         }
         if(rows.length == 0){
           res.send(allFriendsOfFriends) ;
         }
         var friends = [] ;
         friends = rows.map(v => v.friend_id) ;
         var friendsOfriends = [] ;
         friends.forEach((item, i) => {
          connection.query('select friend_id from friends where self_id = ?',[item],(err,rows,fields)=>{
             if(err){
               throw err ;
              }
             if(rows.length >0){
               temp = temp.concat(rows) ;
             }
             if(i == friends.length-1){
               friendsOfriends = temp.map(v => v.friend_id) ;
               friendsOfriends = friendsOfriends.filter( ( el ) => !friends.includes( el ) );
               friendsOfriends = friendsOfriends.filter(e => e !== req.params.id) ;
               if(friendsOfriends.length>0){
                 friendsOfriends.forEach((item, i) => {
                    connection.query('select * from users where id= ?',item,(err,rows,fields)=>{
                     allFriends= allFriends.concat(rows) ;
                     if(i == friendsOfriends.length-1){
                       res.send(allFriends) ;
                     }
                     }) ;
                   });
               }else{
                 res.send(allFriends) ;
               }

              }
            }) ;
         });
       }) ;
    }) ;


  module.exports = router ;
