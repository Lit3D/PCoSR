
const RECONNECT_TIMEOUT = 2 * 1000 // 2s

export class RealSenseClient {
  #url = undefined
  #ws = undefined

  #ended = false

  #listeners = []
  on = (listener) => this.#listeners = [...this.#listeners, listener]
  off = (listener) => this.#listeners = this.#listeners.filter(item => item !== listener)

  constructor(url) {
    this.#url = url
    this.#connect()
  }

  #connect = () => {
    if (this.#ended) return
    console.debug(`RealSenseClient [${this.#url}] connecting...`)
    this.#ws = new WebSocket(this.#url)

    this.#ws.addEventListener("open", () => {
      console.debug(`RealSenseClient [${this.#url}] connected`)
    }, { once: true })

    this.#ws.addEventListener("close", () => {
      console.debug(`RealSenseClient [${this.#url}] connection is closed`)
      setTimeout(this.#connect, RECONNECT_TIMEOUT)
    }, { once: true })

    this.#ws.addEventListener("error", err => {
      console.error(`RealSenseClient [${this.#url}] connection encountered error: ${err.message}`)
      this.#ws.close()
    }, { once: true })

    this.#ws.addEventListener("message", this.#wsMessageCallback)
  }

  #wsMessageCallback = ({data}) => {
    try {
      data = JSON.parse(data)
    } catch (err) {
      console.error(`RealSenseClient [${this.#url}] incorrect message: ${err}`)
      return
    }
    this.#listeners.forEach(listener => listener(data))
  }

  release() {
    this.#ended = true
    this.#ws.close()
  }
}
