var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use('/', require('./routes/login'));
app.use('/', require('./routes/signup'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "my session value", resave: true, saveUninitialized: true}));

var Users = [];

    app.get('/signup', function(req, res){
        res.render('signup');
}); 

    app.post('/signup', function(req, res){
    if(!req.body.email || !req.body.name || !req.body.password){
        res.status("400");
        res.send("Invalid details");
    }else{
    Users.filter(function(user){
    if(user.email === req.body.email){
        res.send("User already exists! Login or choose another user email");
            }
                });
                var newUser = {email: req.body.email, name: req.body.name, password: req.body.password};
                Users.push(newUser);
                req.session.user = newUser;
                res.redirect('/afterSignup_page');
            }
        });
        function checkSignIn(req, res, next){
            if(req.session.user){
                next(); //if session exists, proceed to page
            } else {
                var err = new Error("Not logged in!");
                console.log(req.session.user);
               res.send(next(err)); //Error, trying to access unauthorized page
            }
            }
        app.get('/afterSignup_page', checkSignIn, function(req, res){
            res.render('afterSignup_page', {name: req.session.user.name})
        });
        app.get('/logindetail_page', checkSignIn, function(req, res){
            res.render('loginDetail_page', {email: req.session.user.email, name: req.session.user.name, password: req.session.user.password})
        });
        app.get('/login', function(req, res){
            res.render('login');
        }); 
        app.post('/login', function(req, res){
           console.log(Users);
            if(!req.body.email || !req.body.name || !req.body.password){
                res.send("Please enter both email, name and password");
            } else {
             Users.filter(function(user){
            if(user.email === req.body.email && user.name === req.body.name && user.password === req.body.password){
                req.session.user = user;
                res.redirect('/loginDetail_page');
            }
        });
                res.send("Invalid credentials! If you have not registered yet please visit http://localhost:3000/signup and do register");
                res.redirect("/signup");
            }
       });

        app.get('/logout', function(req, res){
            req.session.destroy(function(){
                console.log("user logged out.");
            });
            res.redirect('/login');
        });

        app.use('/afterSignup_page', function(err, req, res, next){
            console.log(err);
            //User should be authenticated! Redirect him/her to log in.
            res.redirect('/login');
        });

        app.use('/loginDetail_page', function(err, req, res, next){
            console.log(err);
            //User should be authenticated! Redirect him/her to log in.
            res.redirect('/login');
        });

// catch 404 and forward to error handler
        app.use(function(req, res, next) {
            next(createError(404));
  });
  
// error handler
        app.use(function(err, req, res, next) {
// set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
  
// render the error page
            res.status(err.status || 500);
            res.render('error');
  });
module.exports = app;