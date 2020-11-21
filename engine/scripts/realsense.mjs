
const RECONNECT_TIMEOUT = 1 * 1000 // 1s

export class RealSenseClient extends EventTarget {
  #url = undefined
  #id = 0
  #ws = undefined

  #ended = false

  constructor(url, id = 0) {
    super()
    this.#url = url
    this.#id = String(id)
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
    this.dispatchEvent(new CustomEvent("depth", { detail: data }))
  }

  release() {
    this.#ended = true
    this.#ws.close()
  }
}
