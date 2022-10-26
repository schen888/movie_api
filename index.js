const express=require('express'),
    morgan=require('morgan'),
    fs=require('fs'),
    path=require('path'),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    Models=require('./models.js');

    const { check, validationResult } = require('express-validator');

const app=express();

//CORS
const cors = require('cors');
app.use(cors()); // all origins allowed

//Only certain origins allowed:
/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', '#'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));*/

//Bodyparser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//Authentication
require('./auth')(app);
const passport = require('passport');
require('./passport');


//Log
const accessLogStream=fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'}) 
app.use(morgan('combined', {stream: accessLogStream}));

const movies=Models.Movie;
const users=Models.User;

//Connect to local database
//mongoose.connect('mongodb://localhost:27017/favMovieDB', { useNewUrlParser: true, useUnifiedTopology: true });

//connect to online database. CONNECTION_URI is the name of the env. var. on heroku. 
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });



//CURD
app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/index.html');  
});


//READ:get full movie list
//passport.authenticate('jwt', {session: false}), for the React app take out the authentication temporarily. 
app.get('/movies', (req,res)=>{
    movies.find()
    .then((movies)=>{
        res.status(200).json(movies);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ: get data of a single movie
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res)=> {
    movies.findOne({Title: req.params.title})
    .then((movie)=>{
        if(movie){
            res.status(200).json(movie);    
        } else {
            res.status(404).send(`Movie "${req.params.title}" not found.`);
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
})

//READ: get data about a genre by name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session: false}), (req, res)=>{
    movies.findOne({"Genre.Name": req.params.genreName})
    .then((movie)=>{
        if (movie) {
            const genre=movie.Genre;
            res.status(200).json(genre);
        } else {
            res.status(404).send(`Genre "${req.params.generName}" not found.`);
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
})

//READ: get data about a director by name
 app.get('/movies/directors/:name', passport.authenticate('jwt', {session: false}), (req, res)=>{
    movies.findOne({"Director.Name": req.params.name})
    .then((movie)=>{
        if (movie) {
            const director=movie.Director;
            res.status(200).json(director);
        } else {
            res.status(404).send(`Director "${req.params.name}" not found.`);
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ:get full user list
app.get('/users',passport.authenticate('jwt', {session: false}), (req,res)=>{
  users.find()
  .then((users)=>{
      res.status(200).json(users);
  })
  .catch((err)=>{
      console.log(err);
      res.status(500).send('Error: ' + err);
  });
});


//READ: get data of a single user
app.get('/users/:username', passport.authenticate('jwt', {session: false}), (req, res)=> {
    users.findOne({Username: req.params.username})
    .then((user)=>{
        if(user){
            res.status(200).json(user);    
        } else {
            res.status(404).send(`Username "${req.params.username}" not found.`);
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Error: ' + err);
    });
});

//creat a new user
app.post('/users',[
  check('Username', 'Username is required with at least 5 alphanumeric characters.').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.Password);
    users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists.');
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//UPDATE: update a user's info
app.put('/users/:username', passport.authenticate('jwt', {session: false}), [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.Password);
    users.findOneAndUpdate({ Username: req.params.username }, { $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true },
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
  });

// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    users.findOneAndUpdate({ Username: req.params.username }, {
       $addToSet: { FavoriteMovies: req.params.movieid }
     },
     { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
  });

// Delete a movie from a user's list of favorites
app.delete('/users/:username/movies/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    users.findOneAndUpdate({ Username: req.params.username }, {
       $pull: { FavoriteMovies: req.params.movieid }
     },
     { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
  });

//Delete an user account
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res)=>{
    users.findOneAndRemove({Username: req.params.username})
    .then((user)=>{
        if(!user){
            res.status(404).send(`Username "${req.params.username}" not found.`);
        } else {
            res.status(200).send(`User "${req.params.username}" is deleted.`);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

//serve files in public ordner
app.use(express.static('public'));

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Upps, something went wrong...'); 
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {                       
 console.log('Listening on Port ' + port);
});

//localhost port
/* app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
}); */