const express = require('express')
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

var User = require('./models/user')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginapp',{ useNewUrlParser: true }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

app.use(express.urlencoded({extended:true}))

app.set('view engine','hbs')
app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    res.render('main')
})

app.get('/login' , (req,res)=> {
  res.render('login')
})


app.post('/sign_up',(req,res)=> {
  var username = req.body.username; 
  var email =req.body.email; 
  var password = req.body.password; 
  {
    User.findOne({username: username})
    .then(currentUser => {
      if (currentUser){
        console.log('user is already registered:',currentUser);
        res.redirect('/signup.html')
      }
      else {
        var newUser = new User({
          username: username,
          email: email,
          password: password
        })
        newUser.save(function(err,user) {
          if (err) throw err
          console.log(user)
        })
        res.redirect('/success.html')
      }

    })
  }

})

/*app.post('/sign_up', function(req,res){ 
    var name = req.body.name; 
    var email =req.body.email; 
    var password = req.body.password;   
    var data = { 
        "name": name, 
        "email":email, 
        "password":password,        
    } 
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"  ); 
              
    }); 
      res.send('Welcome ' )   
           
    //return res.redirect('/login?name'); 
}) */




passport.use(new LocalStrategy(
    function(username,password, done) {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'User does not exist' });
      }

      if (user.password != password) {

        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    }); 
    }
  ));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))  

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.id)
})
//mongoose.set('useCreateIndex', true);
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user)
  })
})

app.post('/login',passport.authenticate('local', {
  successRedirect: '/basic.html',
  failureRedirect: '/signup.html'
}))

/*app.post('/login',(req,res)=> {
    db.collection('details').findOne({name : req.body.name}, function(err,detail) {
        if (err){
            res.send('Invalid user name')
        }
        else{
            if (detail == null){
                res.redirect('/signup')
            }
            else{
                console.log( typeof(detail))
                res.send('Welcome' + detail.name )
            }
           
            
        }
    })  
}) */

app.get('/logout', function(req, res){
  req.logout();
  console.log("Logged out successfully")
  res.redirect('/');
});
   
app.listen(3000,()=> {
    console.log('running on 3000')
})