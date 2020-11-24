
import { RealSenseClient } from "./client.mjs"
import { RealSenseProcessor } from "./processor.mjs"
import { CONFIG_PATH } from "./env.mjs"

import { SSDepthComponent } from "../components/ss-depth/index.mjs"

const DEBUG_MODE = new URLSearchParams(window.location.search).has("debug")

export class RealSense {
  static _instance = undefined

  #servers = []
  #devices = []

  #depthData = {}

  #clients = []

  #processor = undefined

  constructor() {
    return RealSense._instance = RealSense._instance ?? this.#init()
  }

  #init = async () => {
    const response = await fetch(CONFIG_PATH)
    const {minDepth, maxDepth, width, height, servers, devices, frames} = await response.json()

    this.#servers = servers
    this.#devices = devices
    
    this.#depthData = this.#devices.reduce((acc, device) => 
      ({...acc, [device]: Array.from(new Array(height), () => new Array(width).fill(0)) }),
      {}
    )

    this.#processor = new RealSenseProcessor({ minDepth, maxDepth, width, height: height * this.#devices.length, frames })
    this.#initClients()
    this.#processor.start()

    if (DEBUG_MODE) { window.addEventListener("keydown", this.#keydown) }
    return this
  }

  #initClients = () => {
    this.#clients = this.#servers.map(url => {
      const client = new RealSenseClient(url)
      client.on(this.#onDepthData)
      return client
    })
  }

  #onDepthData = (data) => {
    this.#depthData = {...this.#depthData, ...data}
    this.#processData()
  }

  #processData = () => {
    const depthFrame = this.#devices.map(device => this.#depthData[device]).flat()
    if (this.#processor) this.#processor.process(depthFrame)
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

  toJSON() {
    const { height, ...data } = this.#processor.toJSON()
    return {...data, height: height / this.#devices.length}
  }

  saveConfig = () => {
    const a = document.createElement("a")
    const file = new Blob([JSON.stringify(this.toJSON())], {type: "text/plain"})
    a.href = URL.createObjectURL(file)
    a.download = "realsense.json";
    a.click()
  }


  #renderer = undefined
  get isVisualMode() { return !!this.#renderer }
  set isVisualMode(value) {
    if (value === this.isVisualMode) return

    if (value) {
      this.#renderer = new SSDepthComponent()
      this.#processor.attachRenderer(this.#renderer)
      document.body.appendChild(this.#renderer)
      return
    }

    this.#processor.detachRenderer(this.#renderer)
    this.#renderer.remove()
  }

  #keydown = event => {
    let {key, shiftKey} = event
    key = key.toUpperCase()

    if (this.isVisualMode && this.#processor.keydown(key, shiftKey)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    switch(key) {
      case "S":
        this.saveConfig()
        break

      case "R":
        this.isVisualMode = !this.isVisualMode
        break

      default:
        return
    }

    event.preventDefault()
    event.stopPropagation()
  }

}