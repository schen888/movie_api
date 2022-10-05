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

let topMovies= [
    {
        "Title":"The Fellowship of the Ring",
        "Year":"1991",
        "Released":"13 Apr 1991",
        "Runtime":"115 min",
        "Genre":"Adventure, Fantasy",
        "Director":"N/A",
        "Writer":"N/A",
        "Actors":"Georgiy Shtil, Viktor Kostetskiy, Valeriy Dyachenko",
        "Plot":"Teleplay based on the of J.R.R. Tolkien's novel 'The Fellowship of the Ring'.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BZTQ4YTA1YmEtNWY1Yy00ODA2LWI2MGYtZGY2ZTgzYjEzMDZjXkEyXkFqcGdeQXVyNTE1MDE2MzY@._V1_SX300.jpg"
    },
    {
        "Title":"The Lord of the Rings: The Two Towers",
        "Year":"2002",
        "Released":"18 Dec 2002",
        "Runtime":"179 min",
        "Genre":"Action, Adventure, Drama",
        "Director":"Peter Jackson",
        "Writer":"J.R.R. Tolkien, Fran Walsh, Philippa Boyens",
        "Actors":"Elijah Wood, Ian McKellen, Viggo Mortensen",
        "Plot":"While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
        "Title":"The Lord of the Rings: The Return of the King",
        "Year":"2003",
        "Released":"17 Dec 2003",
        "Runtime":"201 min",
        "Genre":"Action, Adventure, Drama",
        "Director":"Peter Jackson",
        "Writer":"J.R.R. Tolkien, Fran Walsh, Philippa Boyens",
        "Actors":"Elijah Wood, Viggo Mortensen, Ian McKellen",
        "Plot":"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
        "Title":"Iron Man",
        "Year":"2008",
        "Released":"02 May 2008",
        "Runtime":"126 min",
        "Genre":"Action, Adventure, Sci-Fi",
        "Director":"Jon Favreau",
        "Actors":"Robert Downey Jr., Gwyneth Paltrow, Terrence Howard",
        "Plot":"After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
    },
    {
        "Title":"Iron Man 2",
        "Year":"2010",
        "Released":"07 May 2010",
        "Runtime":"2 min",
        "Genre":"Action, Adventure, Sci-Fi",
        "Director":"Jon Favreau",
        "Actors":"Robert Downey Jr., Mickey Rourke, Gwyneth Paltrow",
        "Plot":"With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father's legacy.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMTM0MDgwNjMyMl5BMl5BanBnXkFtZTcwNTg3NzAzMw@@._V1_SX300.jpg"
    },
    {
        "Title":"Iron Man 3",
        "Year":"2013",
        "Released":"03 May 2013",
        "Runtime":"130 min",
        "Genre":"Action, Adventure, Sci-Fi",
        "Director":"Shane Black",
        "Actors":"Robert Downey Jr., Guy Pearce, Gwyneth Paltrow",
        "Plot":"When Tony Stark's world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMjE5MzcyNjk1M15BMl5BanBnXkFtZTcwMjQ4MjcxOQ@@._V1_SX300.jpg"
    },
    {
        "Title":"Harry Potter and the Chamber of Secrets",
        "Year":"2002",
        "Released":"15 Nov 2002",
        "Runtime":"161 min",
        "Genre":"Adventure, Family, Fantasy",
        "Director":"Chris Columbus",
        "Writer":"J.K. Rowling, Steve Kloves",
        "Actors":"Daniel Radcliffe, Rupert Grint, Emma Watson",
        "Plot":"An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMjE0YjUzNDUtMjc5OS00MTU3LTgxMmUtODhkOThkMzdjNWI4XkEyXkFqcGdeQXVyMTA3MzQ4MTc0._V1_SX300.jpg"
    },
    {
        "Title":"Harry Potter and the Chamber of Secrets",
        "Year":"2002",
        "Released":"15 Nov 2002",
        "Runtime":"161 min",
        "Genre":"Adventure, Family, Fantasy",
        "Director":"Chris Columbus",
        "Writer":"J.K. Rowling, Steve Kloves",
        "Actors":"Daniel Radcliffe, Rupert Grint, Emma Watson",
        "Plot":"An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMjE0YjUzNDUtMjc5OS00MTU3LTgxMmUtODhkOThkMzdjNWI4XkEyXkFqcGdeQXVyMTA3MzQ4MTc0._V1_SX300.jpg"  
    },
    {
        "Title":"Harry Potter and the Prisoner of Azkaban",
        "Year":"2004",
        "Released":"04 Jun 2004",
        "Runtime":"142 min",
        "Genre":"Adventure, Family, Fantasy",
        "Director":"Alfonso Cuarón",
        "Writer":"J.K. Rowling, Steve Kloves",
        "Actors":"Daniel Radcliffe, Emma Watson, Rupert Grint",
        "Plot":"Harry Potter, Ron and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the mystery surrounding an escaped prisoner who poses a dangerous threat to the young wizard.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BMTY4NTIwODg0N15BMl5BanBnXkFtZTcwOTc0MjEzMw@@._V1_SX300.jpg"
    },
    {
        "Title":"The Devil Wears Prada",
        "Year":"2006",
        "Released":"30 Jun 2006",
        "Runtime":"109 min",
        "Genre":"Comedy, Drama",
        "Director":"David Frankel",
        "Writer":"Aline Brosh McKenna, Lauren Weisberger",
        "Actors":"Anne Hathaway, Meryl Streep, Adrian Grenier",
        "Plot":"A smart but sensible new graduate lands a job as an assistant to Miranda Priestly, the demanding editor-in-chief of a high fashion magazine.",
        "Poster":"https://m.media-amazon.com/images/M/MV5BZjQ3ZTIzOTItMGNjNC00MWRmLWJlMGEtMjJmMDM5ZDIzZGM3XkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_SX300.jpg"
    }    
];

app.get('/movies',(req,res)=>{
    res.json(topMovies);
});

app.get('/',(req,res)=>{
    res.send('Welcome to my movie api!');
});

app.use(express.static('public'));

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Upps, something went wrong...');
});

app.listen(8080,()=>{
    console.log('The App is listening on port 8080.');
});