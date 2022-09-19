package main

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/pascaldekloe/jwt"
	"go.uber.org/zap"
)

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		next.ServeHTTP(w, r)
	})
}

func (app *application) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			// could set an anonymous user
			app.logger.Error("empty token")
			app.errorJson(w, errors.New("unathorized"))
			return
		}

		headerParts := strings.Split(authHeader, " ")

		if len(headerParts) != 2 {
			app.logger.Error("invalid auth token. Got: ", zap.Error(errors.New(authHeader)))
			app.errorJson(w, errors.New("unathorized"))
			return
		}

		if headerParts[0] != "Bearer" {
			app.logger.Error("invalid auth token. Got: ", zap.Error(errors.New(authHeader)))
			app.errorJson(w, errors.New("unathorized"))
			return
		}

		token := headerParts[1]

		claims, err := jwt.HMACCheck([]byte(token), []byte(app.config.jwt.secret))

		if err != nil {
			app.logger.Error("invalid auth token: ", zap.Error(err))
			app.errorJson(w, errors.New("unathorized"), http.StatusForbidden)
			return
		}

		if !claims.Valid(time.Now()) {
			app.logger.Error("expired auth token: ", zap.Error(err))
			app.errorJson(w, errors.New("unathorized"), http.StatusForbidden)
			return
		}

		if !claims.AcceptAudience("mydomain.com") {
			app.logger.Error("invalid audience: ", zap.Error(err))
			app.errorJson(w, errors.New("unathorized"), http.StatusForbidden)
			return
		}

		if claims.Issuer != "mydomain.com" {
			app.logger.Error("invalid issuer: ", zap.Error(err))
			app.errorJson(w, errors.New("unathorized"), http.StatusForbidden)
			return
		}

		userID, err := strconv.ParseInt(claims.Subject, 10, 64)
		if err != nil {
			app.logger.Error("couldnt extract userid: ", zap.Error(err))
			app.errorJson(w, errors.New("unathorized"), http.StatusForbidden)
			return
		}

		app.logger.Info("valid user: ", userID)

		next.ServeHTTP(w, r)
	})
}
