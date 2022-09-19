package main

import (
	"encoding/json"
	"errors"
	"go-backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
)

type jsonResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Error("invalid id parameter", zap.Error(err))
		app.errorJson(w, errors.New("invalid movie id"))
		return
	}

	movie, err := app.models.DB.GetMovie(id)

	if err != nil {
		app.logger.Error("failed to get movie by ID: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to ged movie by id"))
		return
	}

	if err = app.writeJson(w, http.StatusOK, movie, "movie"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.GetAllMovies()
	if err != nil {
		app.logger.Error("failed to get all movies: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to get all movies"))
		return
	}

	if err = app.writeJson(w, http.StatusOK, movies, "movies"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GetAllGenres()
	if err != nil {
		app.logger.Error("failed to get all genres: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to get all genres"))
		return
	}

	if err = app.writeJson(w, http.StatusOK, genres, "genres"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}

func (app *application) getMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	genreID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.logger.Error("invalid id parameter", zap.Error(err))
		app.errorJson(w, errors.New("invalid id parameter"))
		return
	}

	movies, err := app.models.DB.GetAllMovies(genreID)
	if err != nil {
		app.logger.Error("failed to get all genres: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to get all genres"))
		return
	}

	if err = app.writeJson(w, http.StatusOK, movies, "movies"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}

type MoviePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Year        string `json:"year"`
	ReleaseDate string `json:"release_date"`
	Runtime     string `json:"runtime"`
	Rating      string `json:"rating"`
	MPAARating  string `json:"mpaa_rating"`
}

func (app *application) editMovie(w http.ResponseWriter, r *http.Request) {
	var payload MoviePayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		app.logger.Error("unable to decode movie: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to decode movie"))
		return
	}

	var movie models.Movie

	if payload.ID != "" {
		id, err := strconv.Atoi(payload.ID)
		if err != nil {
			app.logger.Error("unable to decode movie: ", zap.Error(err))
			app.errorJson(w, errors.New("failed to decode movie id"))
			return
		}
		m, err := app.models.DB.GetMovie(id)
		if err != nil {
			app.logger.Error("failed to get movie by ID: ", zap.Error(err))
			app.errorJson(w, errors.New("failed to get movie by id"))
			return
		}

		movie = *m
	} else {
		movie.CreatedAt = time.Now()
	}

	movie.Title = payload.Title
	movie.Description = payload.Description
	movie.MPAARating = payload.MPAARating
	movie.UpdatedAt = time.Now()

	movie.ReleaseDate, err = time.Parse("2006-01-02", payload.ReleaseDate)
	if err != nil {
		app.logger.Error("unable to decode movie: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to decode release date"))
		return
	}
	movie.Year = movie.ReleaseDate.Year()

	movie.Runtime, err = strconv.Atoi(payload.Runtime)
	if err != nil {
		app.logger.Error("unable to decode movie: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to decode runtime"))
		return
	}

	movie.Rating, err = strconv.Atoi(payload.Rating)
	if err != nil {
		app.logger.Error("unable to decode movie: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to decode rating"))
		return
	}

	if movie.ID == 0 {
		err = app.models.DB.InsertMovie(movie)
		if err != nil {
			app.logger.Error("failed to insert movie into database: ", zap.Error(err))
			app.errorJson(w, errors.New("failed to insert movie into database"))
			return
		}
	} else {
		err = app.models.DB.UpdateMovie(movie)
		if err != nil {
			app.logger.Error("failed to update movie: ", zap.Error(err))
			app.errorJson(w, errors.New("failed to update movie"))
			return
		}
	}

	ok := jsonResp{
		OK: true,
	}

	if err = app.writeJson(w, http.StatusOK, ok, "response"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}

func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Error("unable to decode movie ID: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to decode movie id"))
		return
	}

	if err = app.models.DB.DeleteMovie(id); err != nil {
		app.logger.Error("unable to delete movie: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to delete movie"))
		return
	}

	ok := jsonResp{
		OK: true,
	}

	if err = app.writeJson(w, http.StatusOK, ok, "response"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to marshal json"))
		return
	}
}
