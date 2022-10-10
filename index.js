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

//READ:get full movie list
app.get('/movies',(req,res)=>{
    res.json(movies);
});

//READ: get data of a single movie
app.get('/movies/:title', (req, res)=> {
    const movie = movies.find(movie => movie.Title === req.params.title);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found.');
    }
    
})

//READ: get data about a genre by name
app.get('/movies/genres/:genreName', (req, res)=>{
    const movie = movies.find(movie => movie.Genre.Name === req.params.genreName);
    if (movie) {
        const genre=movie.Genre;
        res.status(200).json(genre);
    } else {
        res.status(404).send('Genre not found.');
    }
});

//READ: get data about a director by name
app.get('/movies/directors/:name', (req, res)=>{
    const movie = movies.find(movie => movie.Director.Name === req.params.name);
    if (movie) {
        const director=movie.Director;
        res.status(200).json(director);
    } else {
        res.status(404).send('Director not found.');
    }
});

//UPDATE: update a user's name
app.put('/users/:id', (req, res)=>{
    const {id} = req.params;
    const updatedUser =req.body;
    let user=users.find(user => user.id == id);
    if (user) {
        user.name=updatedUser.name;
        res.status(200).send(`Username has been updated as ${user.name}.`);
    } else {
        res.status(404).send(`ID: ${id}  is not found.`);
    }
});

//CREAT: creat new user
app.post('/users', (req,res)=>{
    const newUser=req.body;
    if(newUser.name) {
        newUser.id=uuid.v4();
        users.push(newUser);
        res.status(201).send(`User ${newUser.name} has registered successfully with ID No. ${newUser.id}.`);
    } else {
        res.status(400).send('Users need names.');
    }
});

//Update: update a user's favorite movie list
app.post('/users/:id/favmovies', (req, res)=>{
    const {id} = req.params;
    let user=users.find(user => user.id == id);
    const newFavMovie=req.body;
    if (user) {
        if (newFavMovie.Title){
            user.favoriteMovies.push(newFavMovie);
            res.status(200).send(`${newFavMovie.Title} has been added to your favorite movie list.`);
            res.status(200).json(user.favoriteMovies);// here it does not send the json.
        } else {
            res.status(400).send('Favorite movie need a title.');
        }
        
    } else {
        res.status(404).send(`User with ID-No. ${id} not found.`);
    }

});

//Delete a movie from the favorite movie list
app.delete('/users/:id/favmovies/:title', (req, res)=>{
    const { id, title } = req.params;
    let user=users.find(user => user.id == id);
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(favMovie => favMovie.Title !== title);
        res.status(200).send(`${title} has been removed from your favorite movie list.`);
        }
        
    else {
        res.status(404).send(`User with ID-No. ${id} not found.`);
    }
});

//Delete an user account
app.delete('/users/:id', (req, res)=>{
    const { id } = req.params;
    let user=users.find(user => user.id == id);
    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User with ID-No. ${id} has been deregistered.`);
        }
    else {
        res.status(404).send(`User with ID-No. ${id} not found.`);
    }
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


/*
let users=[
    {
        id: 1,
        name: 'Paul Smith',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Ann Schneider',
        favoriteMovies: ['Iron Man']
    }
]

let movies= [
    {
        "Title":"The Fellowship of the Ring",
        "Description": "Teleplay based on the of J.R.R. Tolkien's novel 'The Fellowship of the Ring'.",
        "Genre":
            {
                "Name": "Fantasy",
                "Description": "Description1"
            },
        "Director":
            {
                "Name": "Peter Jackson",
                "Bio": "Bio PJ",
                "Birth": "Birth PJ",
                "Death": ""
            },
        "imageURL":"https://m.media-amazon.com/images/M/MV5BZTQ4YTA1YmEtNWY1Yy00ODA2LWI2MGYtZGY2ZTgzYjEzMDZjXkEyXkFqcGdeQXVyNTE1MDE2MzY@._V1_SX300.jpg"
    },
    {
        "Title":"Iron Man",
        "Description":"After being heldcaptive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
        "Genre":
            {
                "Name": "Sci-Fi",
                "Description": "Descpription sci-fi"
            },
        "Director":
            {
                "Name": "Jon Favreau",
                "Bio" : "Bio JF",
                "Birth": "Birth JF",
                "Death": ""
            },
        "imageURL":"https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
    }    
];
*/