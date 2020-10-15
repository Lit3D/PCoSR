package eventbus

import (
	"golang.org/x/net/websocket"
)

type MessageType string
const (
	RegistrationEvent MessageType = "registration"
	ClientsListEvent  MessageType = "clients_list"
)

type Message struct {
	Id		 string
	From   string
	To     *string
	Type   MessageType
	Detail interface{}

	ws *websocket.Conn
}

