const express = require("express");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const fs = require("fs");
const path = require("path");
let app = express();
const session = require("express-session")
const bodyParser = require("body-parser")
require('dotenv').config()
// const {Client} = require('pg')
const PORT = process.env.PORT;


const RequestIp = require('@supercharge/request-ip')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

let Router = require('./src/routes/all-routes.js')
// test Pg api

// var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');

// config middleware session cho app 
app.use(session({secret: process.env.SECRET_SESSION }))

app.use(passport.initialize())  // tất cả các route của app đều đc use passport
app.use(passport.session())  // use session đc config bởi passport, mình ko phải config manual, 

 // tự động encode các data nhận đc từ GG Auth vào session passport
 passport.serializeUser((data, done) => {
  console.log('serializeUser...')
  return done(null, data)
})

// tự động decode các data nhận đc từ các request mỗi khi gửi lên server 
passport.deserializeUser((data, done) => {
  console.log('deserializeUser...')
  done(null, data)
})

Router(app)

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/src/views'))

let Users = require('./src/model/Users')

// socketIO

// server socket
app = require('http').createServer(app)
let io = require('socket.io')(app, {
  path: '/socket'
})

io.listen(app)

io.sockets.on( 'connection', (socket) => {
  console.log('co ng ket noi kia...')
  socket.on('join', function(user_name) {

    console.log(user_name +" : has joined the chat "  )

    socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ")
  })


  socket.on('change_username', data=>{
    socket.username = data.user.name
  })
  socket.on('disconnect', function() {
    console.log( 'user has left ')
    socket.broadcast.emit( "userdisconnect" ,' user has left')
  })

  //handle the new message event
  socket.on('new_message', data => {
    console.log("new message")
    io.sockets.emit('receive_message', {message: data.message, username: socket.username})
  })

})



===================== CRUD ++++++++++++++++++++
UserInfo.create({
  name: 'Jahj',
  gmail: 'anhgog1198@gmail.com',
}).then(result=>{
  console.log("Jane's auto-generated", result.id, result.name, result.age);
})

UserInfo.findOne({ where: {gmail: 'anhgog1198@gmail.com'} })
.then(function(user) {
  console.log('user Fined...', user)
})

UserInfo.findAll({attributes: ['id', 'gmail', 'name']})
.then(data=>{
  console.log('find all...', data)
})

// Delete everyone named "Jane"
User.destroy({
  where: {
    firstName: "Jane"
  }
}).then(() => {
  console.log("Delete : Done!");
});

// Change everyone without a last name to "Doe"
User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
}).then(() => {
  console.log("Update: Done!");
});


// ============== APIs ========================
app.get('/api/create', (req,res)=>{
  
})




app.get("/protected", (req, res)=>{
    res.send('This is protectted...')
})

app.listen(PORT, () => {
  console.log("app listening at: http://localhost:" + PORT);
});
