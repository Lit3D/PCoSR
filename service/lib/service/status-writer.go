package service

import (
	"net/http"
)

type StatusWriter struct {
	http.ResponseWriter
	status int
}

func (w *StatusWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func (w *StatusWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	return w.ResponseWriter.Write(b)
}
