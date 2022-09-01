package main

import (
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
)

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Error("invalid id parameter", zap.Error(err))
		app.errorJson(w, err)
		return
	}

	movie, err := app.models.DB.GetMovie(id)

	if err != nil {
		app.logger.Error("failed to get movie by ID: ", zap.Error(err))
	}

	if err = app.writeJson(w, http.StatusOK, movie, "movie"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.GetAllMovies()
	if err != nil {
		app.logger.Error("failed to get all movies: ", zap.Error(err))
	}

	if err = app.writeJson(w, http.StatusOK, movies, "movies"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GetAllGenres()
	if err != nil {
		app.logger.Error("failed to get all genres: ", zap.Error(err))
	}

	if err = app.writeJson(w, http.StatusOK, genres, "genres"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}

func (app *application) getMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	genreID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.logger.Error("invalid id parameter", zap.Error(err))
		app.errorJson(w, err)
		return
	}

	movies, err := app.models.DB.GetAllMovies(genreID)
	if err != nil {
		app.logger.Error("failed to get all genres: ", zap.Error(err))
	}

	if err = app.writeJson(w, http.StatusOK, movies, "movies"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}

// TODO:
func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {

}

// TODO:
func (app *application) insertMovie(w http.ResponseWriter, r *http.Request) {

}

// TODO:
func (app *application) updateMovie(w http.ResponseWriter, r *http.Request) {

}

// TODO:
func (app *application) searchMovies(w http.ResponseWriter, r *http.Request) {

}