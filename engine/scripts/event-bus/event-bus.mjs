
import { Message } from "./message.mjs"
import { ERROR, REGISTRATION } from "./types.mjs"

const INSTANCE = Symbol("INSTANCE")

const EVENT_BUS_URL = "/bus"

const RECONNECT_TIMEOUT = 1 * 1000 // 1s
const MESSAGE_RESPONSE_TIMEOUT = 5 * 1000 // 5s

export class EventBus extends EventTarget {
  static ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
  static [INSTANCE] = undefined

  #url = `${window.location.origin.replace(/^http/,"ws")}${EVENT_BUS_URL}`
  #ws = undefined
  #id = EventBus.ID

  constructor() {
    return EventBus[INSTANCE]
      = EventBus[INSTANCE]
     ?? new Promise(resolve => {
          super()
          this.#connect(() => resolve(this))
        })
  }

  #connect = callback => {
    console.debug(`EventBus [${this.#url}] connecting...`)

    this.#ws = new WebSocket(this.#url)

    this.#ws.addEventListener("open", async () => {
      console.debug(`EventBus [${this.#url}] connected`)
      await this.send({ type: REGISTRATION, waitResponse: true }).response
      callback && callback()
    }, { once: true })

    this.#ws.addEventListener("close", event => {
      console.debug(`EventBus [${this.#url}] connection is closed`)
      setTimeout(this.#connect, RECONNECT_TIMEOUT)
    }, { once: true })

    this.#ws.addEventListener("error", err => {
      console.error(`EventBus [${this.#url}] connection encountered error: ${err.message}`)
      this.#ws.close()
    }, { once: true })

    this.#ws.addEventListener("message", this.#wsMessageCallback)
  }

  #wsMessageCallback = ({data}) => {
    try {
      data = JSON.parse(data)
    } catch (err) {
      console.error(`EventBus [${this.#url}] incorrect message: ${data}`)
      return
    }
    this.#message(data)
  }

  #message = data => {
    const message = new Message(data)
    this.dispatchEvent(message)
  }

  send({
    id = undefined,
    to = null,
    type = ERROR,
    detail = {},
    waitResponse = false,
    responseTimeout = MESSAGE_RESPONSE_TIMEOUT,
  }) {
    const message = new Message({Id: id, From: this.#id, To: to, Type: type, Detail: detail})

    try {
      this.#ws.send(JSON.stringify(message))
    } catch (err) {
      message.response = Promise.reject(err)
      return message
    }

    if (!waitResponse) {
      message.response = Promise.resolve()
      return message
    }

    message.response = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Message response timeout`)), responseTimeout)

      this.addEventListener(message.type, (function onMessage(response){
        if (response.id !== message.id) return

        clearTimeout(timeout)
        this.removeEventListener(message.type, onMessage)

        resolve(response)
      }).bind(this))
    })
    return message
  }
}
