package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"go-backend/models"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
	// db   *sql.DB
	db struct {
		dsn string
	}
}

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type application struct {
	config config
	logger *zap.SugaredLogger
	models models.Models
}

func main() {
	loggerInit, _ := zap.NewProduction()
	defer loggerInit.Sync()

	logger := loggerInit.Sugar()

	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "Server port to listen on")
	flag.StringVar(&cfg.env, "env", "develop", "Application environment (develop | prod)")
	flag.StringVar(&cfg.db.dsn, "dsn", "postgres://admin:password@localhost:5432/movies?sslmode=disable", "Postgres connection")
	flag.Parse()

	db, err := openDB(cfg)
	if err != nil {
		logger.Fatal("unable to connect to postgres ", err)
	}
	defer db.Close()

	app := &application{
		config: cfg,
		logger: logger,
		models: models.NewModels(db),
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Info("Starting server on ", cfg.port)

	err = srv.ListenAndServe()

	if err != nil {
		log.Println(err)
	}
}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.Ping()

	if err != nil {
		return nil, err
	}

	return db, nil
}
