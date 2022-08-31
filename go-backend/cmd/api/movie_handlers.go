package main

import (
	"go-backend/models"
	"net/http"
	"strconv"
	"time"

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

	movie := models.Movie{
		ID:          id,
		Title:       "The Shawshank Redemption",
		Description: "Great movie",
		Year:        1995,
		ReleaseDate: time.Date(1995, 01, 01, 01, 0, 0, 0, time.Local),
		Runtime:     150,
		Rating:      5,
		MPAARating:  "PG-13",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err = app.writeJson(w, http.StatusOK, movie, "movie"); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {

}
