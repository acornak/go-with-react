package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"go-backend/models"
	"net/http"
	"time"

	"github.com/pascaldekloe/jwt"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

var validUser = models.User{
	ID:       10,
	Email:    "me@here.com",
	Password: mockPassword("password"),
}

func mockPassword(password string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(hashed)
}

func generateSecret(secret, data string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}

func (app *application) Signin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		app.logger.Error("failed to decode credentials: ", zap.Error(err))
		app.errorJson(w, errors.New("unauthorized"))
		return
	}

	hashedPassword := validUser.Password

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password)); err != nil {
		app.logger.Error("unmatched passwords: ", zap.Error(err))
		app.errorJson(w, errors.New("unauthorized"))
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "mydomain.com"
	claims.Audiences = []string{"mydomain.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(app.config.jwt.secret))
	if err != nil {
		app.logger.Error("invalid jwt token: ", zap.Error(err))
		app.errorJson(w, errors.New("error signing"))
		return
	}

	app.writeJson(w, http.StatusOK, jwtBytes, "response")

}
