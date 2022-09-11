package main

import (
	"net/http"

	"go.uber.org/zap"
)

func (app *application) statusHandler(w http.ResponseWriter, r *http.Request) {
	currentStatus := AppStatus{
		Status:      "available",
		Environment: app.config.env,
		Version:     version,
	}

	if err := app.writeJson(w, http.StatusOK, currentStatus, ""); err != nil {
		app.logger.Error("failed to marshal json: ", zap.Error(err))
	}
}
