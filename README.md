# Movie database

This is simple application to demonstrate working with Go (backend), React (front-end) and PostgreSQL as database.

You can browse movies, login to admin part using `me@here.com` as user name and `password` as password, manage movie collection (add movie, edit movie, delete movie). That's it, nothing special... :)

## How to run backend?

**Docker must be running!**

Firstly, get to the correct folder:
`cd go-backend`

Type following command:
`docker-compose up -d`

After that, build backend in Go by running following command:
`make`

Use Beekeeper or other database tool and create databases using SQL query in `movies.sql` file.

## How to run frontend?

Firstly, get to the correct folder:
`cd react-frontend`

Then run following command:
`npm start`
