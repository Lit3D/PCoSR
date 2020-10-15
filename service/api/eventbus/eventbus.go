package eventbus

import (
	"io"
	"log"

	"golang.org/x/net/websocket"
)

const zeroUUID = "00000000-0000-0000-0000-000000000000"

type EventBus struct {
	clients map[string]*websocket.Conn
	messages chan *Message
}

func New() *EventBus {
	bus := &EventBus{
		clients:  make(map[string]*websocket.Conn),
		messages: make(chan *Message),
	}
	go bus.loop()
	return bus
}

func (bus *EventBus) loop() {
	for msg := range bus.messages {
		//log.Printf("[EventBus] Message: %+v", msg)
		if (msg.Type == RegistrationEvent && msg.From != zeroUUID) {
			bus.clients[msg.From] = msg.ws
			resp := &Message{
				Id:     msg.Id,
				From:   zeroUUID,
				To:     &msg.From,
				Type:   RegistrationEvent,
			}
			if err := websocket.JSON.Send(msg.ws, resp); err != nil {
				log.Printf("[EventBus] Registration message send error: %v", err)
				msg.ws.Close()
				delete(bus.clients, *msg.To)
			}
			continue
		}

		if (msg.Type == ClientsListEvent && msg.From != zeroUUID) {
			keys := make([]string, 0, len(bus.clients))
    	for k := range bus.clients {
        keys = append(keys, k)
    	}
			resp := &Message{
				Id:     msg.Id,
				From:   zeroUUID,
				To:     &msg.From,
				Type:   ClientsListEvent,
				Detail: keys,
			}
			if err := websocket.JSON.Send(msg.ws, resp); err != nil {
				log.Printf("[EventBus] ClientsList message send error: %v", err)
				msg.ws.Close()
				delete(bus.clients, *msg.To)
			}
			continue
		}

		if (msg.To != nil) {
			if ws := bus.clients[*msg.To]; ws != nil {
				if err := websocket.JSON.Send(ws, msg); err != nil {
					log.Printf("[EventBus] Message send error: %v", err)
					ws.Close()
					delete(bus.clients, *msg.To)
				}
			}
			continue
		}

		for id, ws := range bus.clients {
			if (id == msg.From) {
				continue
			}
			if err := websocket.JSON.Send(ws, msg); err != nil {
				log.Printf("[EventBus] Message send error: %v", err)
				ws.Close()
				delete(bus.clients, *msg.To)
			}
		}
	}
}

func (bus *EventBus) Handler(ws *websocket.Conn) {
	msg := &Message{ws: ws}
	for {
		err := websocket.JSON.Receive(ws, msg)
		if err == io.EOF {
			continue
		}

		if err != nil {
			log.Printf("[EventBus] Message parse error: %v", err)
			ws.Close()
			return
		}

		bus.messages <- msg
	}
}