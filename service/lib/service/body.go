package service

import (
	"encoding/json"
	"net/http"
)

func JSONBody(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}
