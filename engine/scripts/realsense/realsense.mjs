
import { RealSenseClient } from "./client.mjs"
import { CONFIG_PATH, SETUP_PROCESSOR_SYMBOL } from "./env.mjs"

export class RealSense {
  static _instance = undefined

  #config = {}
  get config() { return {...this.#config} }

  #servers = []
  #devices = []
  #clients = []
  #depthData = {}

  #processors = []
  attachProcessor = (processor) => {
    processor[SETUP_PROCESSOR_SYMBOL]({...this.#config})
    this.#processors = [...this.#processors, processor]
  }
  detachProcessor = (processor) => this.#processors = this.#processors.filter(item => item !== processor)

  constructor() {
    return RealSense._instance = RealSense._instance ?? this.#init()
  }

  #init = async () => {
    const response = await fetch(CONFIG_PATH)
    const {servers, devices, ...config} = await response.json()

    this.#servers = servers
    this.#devices = devices
    this.#config = {...config, height: config.height * this.#devices.length}

    this.#initClients()
    return this
  }

  #initClients = () => {
    this.#clients = this.#servers.map(url => {
      const client = new RealSenseClient(url)
      client.on(this.#onDepthData)
      return client
    })
  }

  #onDepthData = ({detail}) => {
    this.#depthData = {...this.#depthData, ...detail}
    console.dir(this.#depthData)
    this.#processData()
  }

  #processData = () => {
    const depthFrame = this.#devices.map(device => this.#depthData[device]).flat()
    this.#processors.forEach(processor => processor.process(depthFrame))
  }

  release = () => {
    this.#releaseClients()
  }

  #releaseClients = () => {
    this.#clients = this.#clients.reduce((_, client) => {
      client.off(this.#onDepthData)
      client.release()
      return []
    })
  }

}