### favMovie API ###
This is a movie API, which contains information about movie's title, description, genre, director, imageURL and whether it is featured or not. For genre, the genre's name and a short description about the genre are included. For director, his or her name, bio, birth year and death year are included.
It also allows users to register with an username, password and Email address and to log in with username and password. Users can add/delete movies to their favorite movies list. They can also delete their user information.

###### Key Features ######
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister
- Hash user's password
- Authenticate user by log in
- Authenticate user, when user make requests to API

###### Technical Dependencies ######
- HTML, ES6, Node.js, Express, MongoDB
- Application is hosted on Heroku and database is hosted on MongoDB Atlas.
###### [favMovie API](https://favmovie-schen.herokuapp.com/) ######