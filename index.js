const express=require('express'),
    morgan=require('morgan'),
    fs=require('fs'),
    path=require('path'),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    Models=require('./models.js');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream=fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'})
app.use(morgan('combined', {stream: accessLogStream}));

const movies=Models.Movie;
const users=Models.User;

mongoose.connect('mongodb://localhost:27017/favMovieDB', { useNewUrlParser: true, useUnifiedTopology: true });

//READ:get full movie list
app.get('/movies',(req,res)=>{
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
app.get('/movies/:title', (req, res)=> {
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
app.get('/movies/genres/:genreName', (req, res)=>{
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
 app.get('/movies/directors/:name', (req, res)=>{
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
app.get('/users',(req,res)=>{
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
app.get('/users/:username', (req, res)=> {
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
})

//creat a new user
app.post('/users', (req, res) => {
    users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists.');
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
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
app.post('/users/:username', (req, res) => {
    users.findOneAndUpdate({ Username: req.params.username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
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
app.put('/users/:username/movies/:movieid', (req, res) => {
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
app.delete('/users/:username/movies/:movieid', (req, res) => {
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
app.delete('/users/:username', (req, res)=>{
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

app.listen(8080,()=>{
    console.log('The App is listening on port 8080.');
});