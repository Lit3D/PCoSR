
const HOST = `${window.location.origin.replace(/^http/,"ws")}/mqtt`

const OPTIONS = {
  keepalive: 30,
  clientId: "QClient-" + Math.random().toString(16).substr(2, 8),
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 10 * 1000,
  rejectUnauthorized: false,
}

export const Q_PATH_MASTER = "/lit3d/master"
export const Q_PATH_LED = "/lit3d/slave/led"
export const Q_PATH_LINE = "/lit3d/slave/line"

export class QClient {
  static _instance = undefined

  #client = undefined
  #listeners = {}
  #decoder = new TextDecoder("utf-8")

  constructor() {
    return QClient._instance = QClient._instance ?? new Promise(this.#connect)
  }

  #connect = callback => {
    console.debug(`QClient [${HOST}] connecting...`)
    this.#client = mqtt.connect(HOST, OPTIONS)
    
    this.#client.on("error", err => {
      console.error(`QClient [${HOST}] connection error: ${err.message}`)
      this.#client.end(this.#connect)
    })
    
    this.#client.on("connect", () => {
      console.debug(`QClient [${HOST}] connected`)
      callback && callback(this)
    })
    
    this.#client.on("message", this.#onMessage)
  }

  #onMessage = (topic, message) => {
    const msg = this.#decoder.decode(message)
    let data = undefined
    try {
      data = JSON.parse(msg)
    } catch (err) {
      console.error(`QClient [${HOST}] massage parse error: ${err.message}`)
      return
    }

    (this.#listeners[topic] ?? []).forEach(cb => cb(data))
  }

  publish = (topic, message) => new Promise((resolve, reject) => {
    message = JSON.stringify(message)
    this.#client.publish(topic, message, { qos: 0, retain: false }, err => err ? reject(err) : resolve())
  })

  subscribe = (topic, callback) => new Promise((resolve, reject) => {
    this.#listeners[topic] = [...(this.#listeners[topic] ?? []), callback]
    if (this.#listeners[topic].length !== 1) return resolve()
    this.#client.subscribe(topic, { qos: 0 }, err => err ? reject(err) : resolve())
  })

  unsubscribe = (topic, callback) => new Promise((resolve, reject) => {
    this.#listeners[topic] = (this.#listeners[topic] ?? []).filter(cb => cb !== callback)
    if (this.#listeners[topic].length > 0) return resolve()
    this.#client.unsubscribe(topic, err => err ? reject(err) : resolve())
  })
}