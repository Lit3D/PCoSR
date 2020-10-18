
const HOST = "ws://wb.pcosr.local:18883/mqtt"
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

export class QClient {
  static _instance = undefined

  #client = undefined
  #listeners = {}
  #decoder = new TextDecoder("utf-8")

  constructor() {
    return QClient._instance = QClient._instance ?? new Promise(this.#connect)
  }

  #connect = resolve => {
    this.#client = mqtt.connect(HOST, OPTIONS)
    this.#client.on("error", err => {
      console.error(err)
      this.#client.end(this.#connect)
    })
    this.#client.on("message", this.#onMessage)
    resolve && resolve(this)
  }

  #onMessage = (topic, message) => {
    const msg = this.#decoder.decode(message)
    let data = undefined
    try {
      data = JSON.parse(msg)
    } catch (err) {
      console.error(err)
      return
    }

    (this.#listeners[topic] ?? []).forEach(cb => cb(data))
  }

  publish(topic, message) {
    return new Promise((resolve, reject) =>
      this.#client.publish(topic, message, { qos: 0, retain: false}, err =>
        err ? reject(err) : resolve()
      )
    )
  }

  subscribe(topic, callback) {
    return new Promise((resolve, reject) => {
      this.#listeners[topic] = [...(this.#listeners[topic] ?? []), callback]
      if (this.#listeners[topic].length !== 1) resolve()
      this.#client.subscribe(topic, { qos: 0 }, err => err ? reject(err) : resolve())
    })
  }

  unsubscribe(topic, callback) {
    return new Promise((resolve, reject) => {
      this.#listeners[topic] = (this.#listeners[topic] ?? []).filter(cb => cb !== callback)
      if (this.#listeners[topic].length > 0) resolve()
      this.#client.unsubscribe(topic, err => err ? reject(err) : resolve())
    })
  }
}