import { connect } from "mqtt"

const HOST = "ws://wb.pcosr.local:18883/mqtt"
const GLOBAL_Q = new URLSearchParams(window.location.search).has("debug")

const OPTIONS = {
  keepalive: 30,
  clientId: "Admin-" + Math.random().toString(16).substr(2, 8),
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
    return QClient._instance = QClient._instance ?? this.#connect()
  }

  #connect = () => {
    console.debug(`QClient [${HOST}] connecting...`)
    this.#client = connect(HOST, OPTIONS)

    this.#client.on("error", err => {
      console.error(`QClient [${HOST}] connection error: ${err.message}`)
      this.#client.end(this.#connect)
    })

    this.#client.on("connect", () => {
      console.debug(`QClient [${HOST}] connected`)
    })

    this.#client.on("message", this.#onMessage)

    if (GLOBAL_Q) window.Q = this.publish
    return this
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
//set
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
