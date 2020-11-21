
export class RealSenseClient {
  #socket = undefined

  constructor() {
    this.#socket = new WebSocket("ws://depth-1.pcosr.local:8080")
    this.#socket.addEventListener('open', () => {
      console.log("Connected")
        //this.#socket.send('Hello Server!');
    });

    // Listen for messages
    this.#socket.addEventListener('message', event => {
        console.log('Message from server ', event.data)
    })
  }
}
