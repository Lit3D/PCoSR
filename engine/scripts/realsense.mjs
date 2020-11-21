
const RECONNECT_TIMEOUT = 1 * 1000 // 1s
const MESSAGE_RESPONSE_TIMEOUT = 1 * 1000 // 1s

export class RealSenseClient extends EventTarget {
  #url = undefined
  #id = 0
  #ws = undefined

  constructor(url, id = 0) {
    super()
    this.#url = url
    this.#id = String(id)
    return new Promise(resolve => this.#connect(() => resolve(this)))
  }

  #connect = async callback => {
    console.debug(`RealSenseClient [${this.#url}] connecting...`)
    this.#ws = new WebSocket(this.#url)

    this.#ws.addEventListener("open", () => {
      console.debug(`RealSenseClient [${this.#url}] connected`)
      callback && callback()
    }, { once: true })

    this.#ws.addEventListener("close", () => {
      console.debug(`RealSenseClient [${this.#url}] connection is closed`)
      setTimeout(this.#connect, RECONNECT_TIMEOUT)
    }, { once: true })

    this.#ws.addEventListener("error", err => {
      console.error(`RealSenseClient [${this.#url}] connection encountered error: ${err.message}`)
      this.#ws.close()
    }, { once: true })
  }

  #waitMessage = () => new Promise((resolve, reject) => {
    // const timeout = setTimeout(() => reject(new Error(`Message response timeout`)), MESSAGE_RESPONSE_TIMEOUT)
    this.#ws.addEventListener("message", ({data}) => {
      // clearTimeout(timeout)
      try {
        data = JSON.parse(data)
      } catch (err) {
        return reject(new Error(`Incorrect message: ${err.message}`))
      }
      resolve(data)
    }, { once: true })
  })

  request = async () => {
    const response = this.#waitMessage()
    try {
      this.#ws.send(this.#id)
    } catch (err) {
      console.error(`RealSenseClient [${this.#url}] send request error: ${err.message}`)
      return null
    }
    let data = null
    try {
      data = await response
    } catch (err) {
      console.error(`RealSenseClient [${this.#url}] response error: ${err.message}`)
      return null
    }
    return data
  }
}
