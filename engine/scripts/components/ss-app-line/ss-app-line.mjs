import { QClient } from "../../q-client.mjs"
import { SSViewportComponent } from "../ss-viewport/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

const Q_PATH = "/lit3d/slave/line"
const SS_DATA_URL = "/content/ss-data.json"
const SELECTORS_CONFIG_URL = "/config/selectors.json"

export class SSAppLineComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-line"

  #root = this.attachShadow({ mode: "open" })

  #qClient = undefined
  #ssData = []

  #viewports = [
    new SSViewportComponent(`${Q_PATH}/1`),
    new SSViewportComponent(`${Q_PATH}/2`),
    new SSViewportComponent(`${Q_PATH}/3`),
    new SSViewportComponent(`${Q_PATH}/4`),
    new SSViewportComponent(`${Q_PATH}/5`),
    new SSViewportComponent(`${Q_PATH}/6`),
    new SSViewportComponent(`${Q_PATH}/7`),
    new SSViewportComponent(`${Q_PATH}/8`),
    new SSViewportComponent(`${Q_PATH}/9`),
    new SSViewportComponent(`${Q_PATH}/10`),
    new SSViewportComponent(`${Q_PATH}/11`),
    new SSViewportComponent(`${Q_PATH}/12`),
  ]

  #selectors = []

  constructor() {
    super()
  }

  #wave = document.createElement("video")

  #waveStop = () => {
    this.#wave.pause()
    requestAnimationFrame(() => this.#wave.classList.remove("active"))
  }

  #waveCmd = ({ src } = {}) => {
    console.debug(`SSAppLineComponent [WAVE]: ${JSON.stringify({src})}`)
    if (src === undefined || src === null) return

    this.#wave.src = src
    this.#wave.currentTime = 0
    setTimeout(() => this.#wave.play(), 0)
  }

  async connectedCallback() {
    try {
      this.#root.innerHTML = TEMPLATE

      let response = await fetch(SS_DATA_URL)
      this.#ssData = await response.json()

      response = await fetch(SELECTORS_CONFIG_URL)
      this.#selectors = (await response.json()).map(id => {
        const videoNode = document.createElement("video")
        videoNode.classList.add("selector")
        videoNode.muted = true
        videoNode.loop = true

        const { selector } = this.#ssData.find(item => item.id === id)
        if (!selector) {
          console.error(`SSAppLineComponent [selectors] incorrect ID: ${id}`)
          return
        }

        videoNode.src = ssData["webm"]
        this.#root.appendChild(videoNode)
        setTimeout(() => videoNode.play(),0)
        return videoNode
      })

      this.#viewports.forEach(viewport => this.#root.appendChild(viewport))

      this.#wave.classList.add("wave")
      this.#wave.muted = true
      this.#wave.loop = false
      this.#wave.addEventListener("ended", () => this.#waveStop, { passive: true })

      this.#root.appendChild(this.#wave)

      this.#qClient = await new QClient()
      await this.#qClient.subscribe(`${this.#qPath}/wave`, this.#waveCmd)
      await this.#qClient.publish(`${this.#qPath}/wave`, {})
    } catch (err) {
      console.error(`SSAppLineComponent [connectedCallback] error: ${err.message}`)
    }
  }

  async disconnectedCallback() {
    await this.#qClient.unsubscribe(`${this.#qPath}/wave`, this.#waveCmd)
  }
}

customElements.define(SSAppLineComponent.TAG_NAME, SSAppLineComponent)