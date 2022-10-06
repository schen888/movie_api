const express=require('express'),
    morgan=require('morgan'),
    fs=require('fs'),
    path=require('path'),
    bodyParser=require('body-parser'),
    uuid=require('uuid');

const app=express();

app.use(bodyParser.json());

const accessLogStream=fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'})
app.use(morgan('combined', {stream: accessLogStream}));

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
                "Birth": "Birth PJ"
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
                "Birth": "Birth JF"
            },
        "imageURL":"https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
    }    
];

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

//serve files in public ordner
app.use(express.static('public'));

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Upps, something went wrong...');
});

app.listen(8080,()=>{
    console.log('The App is listening on port 8080.');
});