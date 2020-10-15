package main

import (
	"flag"

	"github.com/Lit3D/pcosr/service/api/eventbus"
	"github.com/Lit3D/pcosr/service/lib/service"
)

type API struct{
	eventBus *eventbus.EventBus
}

func main() {
	staticDir := flag.String("static", "./static", "Static files")
	sslCrt := flag.String("ssl-crt", "", "SSL Certificate file")
	sslKey := flag.String("ssl-key", "", "SSL Private key file")
	flag.Parse()

	api := &API{
		eventBus: eventbus.New(),
	}

	srv := service.New(*staticDir)

	srv.WS("/bus", api.eventBus.Handler)

	srv.ListenAndServe(*sslCrt, *sslKey)
}
