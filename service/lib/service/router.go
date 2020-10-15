// Named parameters are dynamic path segments.
//  Path: /blog/:category/:post
//
//  Requests:
//   /blog/go/request-routers            match: category="go", post="request-routers"
//   /blog/go/request-routers/           match: category="go", post="request-routers"
//   /blog/go/                           no match
//   /blog/go/request-routers/comments   no match
//

package service

import (
	"context"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime/debug"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

type ctxParamsKey int

const ParamsKey ctxParamsKey = 0

// Router is a http.Handler which can be used to dispatch requests to different
// handler functions via configurable routes
type Router struct {
	http.Handler
	trees    map[string]*Node
	static string
}

// New returns a new initialized Router.
func NewRouter(root string) *Router {
	root, err := filepath.Abs(root)
	if err != nil {
		log.Fatalf(`[Service] Invalid static content path "%s": %v\n`, root, err)
	}

	dirInfo, err := os.Stat(root)
	if err != nil {
		log.Fatalf(`[Service] Invalid static content directory "%s" access: %v\n`, root, err)
	}
	
	if !dirInfo.IsDir() {
		log.Fatalf(`[Service] Static content path "%s" is not a directory\n`, root)
	}

	log.Printf(`[Service] Static content path: %s`, root)

	return &Router{
		trees: make(map[string]*Node),
		static: root,
	}
}

// Handle registers a new request handle with the given path and method.
func (router *Router) Handle(method, path string, handle http.HandlerFunc, middlewares ...Middleware) {
	if path[0] != '/' {
		log.Fatalf("[Service] Path must begin with '/' in path \"%s\"\n", path)
	}

	root := router.trees[method]
	if root == nil {
		root = new(Node)
		router.trees[method] = root
	}

	if (handle == nil) {
		handle = func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNoContent)
		}
	}

	middlewaresLength := len(middlewares)

	if middlewaresLength == 0 {
		root.addRoute(path, handle)
		return
	}

	// Wrap the end handler with the middleware chain
	h := middlewares[middlewaresLength-1](handle)
	for i := middlewaresLength - 2; i >= 0; i-- {
		h = middlewares[i](h)
	}

	root.addRoute(path, h)
}

// ServeHTTP makes the router implement the http.Handler interface.
func (router *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Catch panic
	defer func() {
		if rvr := recover(); rvr != nil {
			log.Printf("[Service] Panic: %+v\n", rvr)
			debug.PrintStack()
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
	}()

	path := r.URL.Path

	// Remove path final slashes
	for i := len(path) - 1; i > 1; i-- {
		if path[i] != '/' {
			path = path[:i+1]
			break
		}
	}

	// Handle exist route
	if root := router.trees[r.Method]; root != nil {
		if handle, params := root.getValue(path); handle != nil {
			if params != nil {
				ctx := r.Context()
				ctx = context.WithValue(ctx, ParamsKey, params)
				r = r.WithContext(ctx)
			}
			handle(w, r)
			return
		}
	}

	// Search allowed methods for current request
	var allow string
	for method := range router.trees {
		if handle, _ := router.trees[method].getValue(path); handle != nil {
			if len(allow) == 0 {
				allow = method
			} else {
				allow += ", " + method
			}
		}
	}

	// Handle OPTIONS or 405
	if len(allow) > 0 {
		w.Header().Set("Allow", allow)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	// FileSystem fallback
	if r.Method == "GET" || r.Method == "HEAD" {
		http.ServeFile(w, r, filepath.Join(router.static, path))
		return
	}

	// Handle 404
	http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
}
