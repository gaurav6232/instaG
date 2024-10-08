  var express = require('express');
  var router = express.Router();
  const passport = require('passport');
  var userModel = require('./users')
  var postModel = require("./posts")
  const mongoose = require('mongoose')
  const upload = require("./multer")
  const fs = require('fs')
  const path = require("path")


  var localStrategy = require('passport-local');
  passport.use(new localStrategy(userModel.authenticate()))



  

  /* GET home page. */
  router.get('/', isloggedIn,async function(req, res, next) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    .populate("posts")
    console.log(user);
    res.render('index',{user})

  })
  
  router.post('/upload', isloggedIn, upload.single("image"), async function(req, res, next) {
    if (!req.file) {
        return res.status(404).send("No file was given");
    }

    const user = await userModel.findOne({ username: req.session.passport.user });

    // Update the user's profile image
    user.dp = req.file.filename;
    await user.save();

    return res.redirect('/profile');
  });
  
  

  router.post("/register", function(req, res){
    const {username, email, fullname} = req.body;
    const userData = new userModel({username, email, fullname});
    userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/")
      })
    })
  })

  router.get('/auth',(req, res, next) =>{
    res.render('register')
  })

  router.get('/profile', isloggedIn,(req, res, next) =>{
    userModel.findOne({username:req.session.passport.user})
    .then(function(user){
      res.render('profile', { user: user })
    })
  })


  router.get('/create',(req, res, next) =>{
    res.render('create')
  })

  router.post('/create-post', upload.single("image"), isloggedIn, async (req, res) => {
    try {
      // Get the logged in user's ID from the session
      const userId = req.session.passport.user.id;
      const user = await userModel.findById(userId);
  
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Find the user by userId
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const { imageText, image } = req.body;
  
      // Create a new post
      const post = new postModel({
        imageText,
        image,
        user: user._id
      });
  
      // Save the post
      await post.save();
  
      // Update user's posts array
      user.posts.push(post._id);
      await user.save();
  
      res.status(200).json({ message: 'Post created successfully', post });
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  






  


  
  router.get('/login',(req, res, next) =>{
    
    res.render('login',{error: req.flash('error')})
  })
  router.post('/login', passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }), function(req, res){ 
    req.session.userId = req.user._id;
    res.redirect('/');
  })


  router.get('/logout', (req, res, next) =>{
    if(req.isAuthenticated())
    req.logout((err) =>{
    if(err) res.send(err);
    else res.redirect('/')
  })
  else{
    res.redirect('/')
  }
  });

  function isloggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    else res.redirect('/login')
  }

  

  module.exports = router;
