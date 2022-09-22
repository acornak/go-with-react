package main

import (
	"encoding/json"
	"errors"
	"go-backend/models"
	"io"
	"net/http"
	"strings"

	"github.com/graphql-go/graphql"
	"go.uber.org/zap"
)

var movies []*models.Movie
var movieType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Movie",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"year": &graphql.Field{
				Type: graphql.Int,
			},
			"release_date": &graphql.Field{
				Type: graphql.DateTime,
			},
			"runtime": &graphql.Field{
				Type: graphql.Int,
			},
			"rating": &graphql.Field{
				Type: graphql.Int,
			},
			"mpaa_rating": &graphql.Field{
				Type: graphql.String,
			},
			"created_at": &graphql.Field{
				Type: graphql.DateTime,
			},
			"updated_at": &graphql.Field{
				Type: graphql.DateTime,
			},
			"poster": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

// GraphQL schema definition
var fields = graphql.Fields{
	"movie": &graphql.Field{
		Type:        movieType,
		Description: "Get movie by ID",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (any, error) {
			id, ok := p.Args["id"].(int)
			if ok {
				for _, movie := range movies {
					if movie.ID == id {
						return movie, nil
					}
				}
			}
			return nil, nil
		},
	},
	"list": &graphql.Field{
		Type:        graphql.NewList(movieType),
		Description: "Get all movies",
		Resolve: func(p graphql.ResolveParams) (any, error) {
			return movies, nil
		},
	},
	"search": &graphql.Field{
		Type:        graphql.NewList(movieType),
		Description: "Search movies by title",
		Args: graphql.FieldConfigArgument{
			"titleContains": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (any, error) {
			var res []*models.Movie
			search, ok := p.Args["titleContains"].(string)
			if ok {
				for _, currentMovie := range movies {
					if strings.Contains(strings.ToLower(currentMovie.Title), strings.ToLower(search)) {
						res = append(res, currentMovie)
					}
				}
			}
			return res, nil
		},
	},
}

func (app *application) moviesGraphQL(w http.ResponseWriter, r *http.Request) {
	var err error
	movies, err = app.models.DB.GetAllMovies()
	if err != nil {
		app.logger.Error("failed to get all movies: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to get all movies"))
		return
	}

	q, err := io.ReadAll(r.Body)
	if err != nil {
		app.logger.Error("failed to read request: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to read request"))
		return
	}

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		app.logger.Error("failed to create schema: ", zap.Error(err))
		app.errorJson(w, errors.New("failed to create schema"))
		return
	}

	params := graphql.Params{Schema: schema, RequestString: string(q)}
	resp := graphql.Do(params)

	if len(resp.Errors) > 0 {
		app.logger.Error("failed: ", zap.Error(err))
		app.errorJson(w, errors.New("failed"))
		return
	}

	j, _ := json.MarshalIndent(resp, "", "  ")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
