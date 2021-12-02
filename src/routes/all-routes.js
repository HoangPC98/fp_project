const express = require('express')
const router = express.Router()
const app = express()
// const auth = require("../config/passport-setup");

const passport = require("passport");

var RequestIp = require('@supercharge/request-ip')


const Authenticate = require('../controller/AuthController')
const AdminController = require('../controller/AdminController')
const ApiController = require('../controller/ApiController')
const CheckIoController = require('../controller/CheckIoController')

let GGAuthSetUp = require('../config/passport-setup');
let Statistic = require('../controller/Statistic')

const { response } = require('express');


function AllRoute(router) {

  GGAuthSetUp()
  router.get("/", (req, res) => {
    console.log('haha.... HOME')
    res.send('<a href="auth/google">Login with google</a>')
  })

  router.get('/io', (req, res) => {
    res.render('socketio')
  })

  router.post('/io', (req, res) => {
    req.ip = RequestIp.getClientIp(req)
    var ip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
    console.log('hereere...IP Address:', ip, 'req.body', req.body)
    res.send(`User ${req.body.username} with IP Adrr${ip} is sent a message: ${req.body.message}`)
  })


  router.get('/api/all-user', ApiController.GetAllUser)


  // Handle when request 'LOgin with Google' => Hiển thị trang Login by GG, chọn accc, => middleware: authen bằng passport
  router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }), (err, data) => {
  });  

  // Handle when Logged In 
  router.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/auth/failure' }),
    Authenticate.AuthenSuccess
  );

  router.get('/iot', (req,res)=>{
    res.json({message: 'hello guys...'})
  })


  // Site router

  router.get('/home', Authenticate.IsLoggedIn, (req,res)=>{
    console.log('home...', req.user.displayName )
    let data_home = req.user
    res.render('home' , {data_home});
  })

  router.get('/remote', Authenticate.IsLoggedIn, (req,res)=>{
    res.render('remote' );
  })

  router.get('/statistics', Authenticate.IsLoggedIn, (req,res)=>{
    res.render('statistic')
  })

  router.get('/export', (req, res)=>{
    res.render('export-file-modal')
  })

  const exportFile = require('../controller/ExportExcel')

  router.post('/export', exportFile)

  router.post('/statistic', ApiController.FetchStatistic)

  // CRUD
  router.post('/reg-new-user', Authenticate.SaveToDB)
  router.get('/management-user/:json', AdminController.ManagementUser)
  router.get('/management-user/', AdminController.ManagementUser)

  router.post('/management-user/export', exportFile)

  router.get('/user/:uid/edit', AdminController.EditUser)
  router.post('/user/post-edit', AdminController.PostEditUser)
  router.post('/user/delete/:uid', AdminController.DeleteUser)

  // Remote

  router.post('/remote', ApiController.RemoteIO)
  
  function check_Logged_In(req, res, next){
    if(!req.user) return res.send('You are not logged in yet')
    next()
  }

  // Checkin _ CheckOut

  router.post('/cico/forget', CheckIoController.ForgetCheck)

  router.get("/protected", check_Logged_In ,(req, res)=>{
      res.json({userrr:req.user})
  })

  router.get('/logout', (req,res)=>{
    req.logout()
    req.session.destroy()
    res.send('Logged Out...')
  })
  router.get('/auth/failure',(req, res)=>{
    res.send('Something went wrong...')


  // ================================= APIs ====================================
  router.get('/dt/payroll', Statistic)

})

 
}

module.exports = AllRoute