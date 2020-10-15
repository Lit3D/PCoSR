package service

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/net/websocket"
)

type Service struct {
	router      *Router
	server      *http.Server
	middlewares []Middleware
}

func New(root string, middlewares ...Middleware) *Service {
	service := &Service{
		router:      NewRouter(root),
		middlewares: middlewares,
	}
	service.server = &http.Server{Handler: service.router}
	return service
}

func (service *Service) WITH(middlewares ...Middleware) *Service {
	return &Service{
		router: service.router,
		server: service.server,

		middlewares: append(append([]Middleware{}, service.middlewares...), middlewares...),
	}
}

// Shortcut for service.router.Handle(method, path, handle)
func (service *Service) Handle(method, path string, handle http.HandlerFunc) {
	service.router.Handle(method, path, handle, service.middlewares...)
}

// GET is a shortcut for service.router.Handle("GET", path, handle)
func (service *Service) GET(path string, handle http.HandlerFunc) {
	service.router.Handle("GET", path, handle, service.middlewares...)
}

// HEAD is a shortcut for service.router.Handle("HEAD", path, handle)
func (service *Service) HEAD(path string, handle http.HandlerFunc) {
	service.router.Handle("HEAD", path, handle, service.middlewares...)
}

// OPTIONS is a shortcut for service.router.Handle("OPTIONS", path, handle)
func (service *Service) OPTIONS(path string, handle http.HandlerFunc) {
	service.router.Handle("OPTIONS", path, handle, service.middlewares...)
}

// POST is a shortcut for service.router.Handle("POST", path, handle)
func (service *Service) POST(path string, handle http.HandlerFunc) {
	service.router.Handle("POST", path, handle, service.middlewares...)
}

// PUT is a shortcut for service.router.Handle("PUT", path, handle)
func (service *Service) PUT(path string, handle http.HandlerFunc) {
	service.router.Handle("PUT", path, handle, service.middlewares...)
}

// PATCH is a shortcut for service.router.Handle("PATCH", path, handle)
func (service *Service) PATCH(path string, handle http.HandlerFunc) {
	service.router.Handle("PATCH", path, handle, service.middlewares...)
}

// DELETE is a shortcut for service.router.Handle("DELETE", path, handle)
func (service *Service) DELETE(path string, handle http.HandlerFunc) {
	service.router.Handle("DELETE", path, handle, service.middlewares...)
}

//WS is a shortcut for service.router.Handle("GET", path, websocker.Handler(handle).ServeHTTP)
func (service *Service) WS(path string, handle func(*websocket.Conn)) {
	service.router.Handle("GET", path, websocket.Handler(handle).ServeHTTP, service.middlewares...)
}

// Start service
func (service *Service) ListenAndServe(crt, key string) {
	go func() {
		if (crt == "" || key == "") {
			log.Println("[Service] Listening on http://0.0.0.0")
			if err := service.server.ListenAndServe(); err != http.ErrServerClosed {
				log.Printf("[Service] Init error: %v\n", err)
			}
			return
		}

		log.Println("[Service] Listening on https://0.0.0.0")
		if err := service.server.ListenAndServeTLS(crt, key); err != http.ErrServerClosed {
			log.Printf("[Service] Init error: %v\n", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	err := service.server.Shutdown(context.Background())
	if err != nil {
		log.Printf("[Service] Shutdown error: %v\n", err)
	}

	log.Println("[Service] stopped")
}