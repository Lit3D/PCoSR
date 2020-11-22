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

  #viewports = Array.from(new Array(12), (_,i) => new SSViewportComponent(`${Q_PATH}/${i+1}`))
  #selectors = Array.from(new Array(24), () => document.createElement("video"))
  #wave = document.createElement("video")

  constructor() {
    super()
    this.#root.innerHTML = TEMPLATE

    this.#selectors.forEach(videoNode => {
      videoNode.classList.add("selector")
      videoNode.muted = true
      videoNode.loop = true
      this.#root.appendChild(videoNode)
    })

    this.#viewports.forEach(viewport => this.#root.appendChild(viewport))

    this.#wave.classList.add("wave")
    this.#wave.muted = true
    this.#wave.loop = false
    this.#root.appendChild(this.#wave)
  }

  #waveCmd = ({ src } = {}) => {
    console.debug(`SSAppLineComponent [WAVE]: ${JSON.stringify({src})}`)
    if (src === undefined || src === null) {
      this.#wave.pause()
      requestAnimationFrame(() => this.#wave.classList.remove("active"))
      return
    }

    this.#wave.src = src
    this.#wave.currentTime = 0
    setTimeout(() => this.#wave.play(), 0)
  }

  async connectedCallback() {
    try {
      let response = await fetch(SS_DATA_URL)
      const ssData = await response.json()

      response = await fetch(SELECTORS_CONFIG_URL)
      const selectorsConfig = await response.json()

      this.#selectors.forEach((videoNode, i) => {
        const id = selectorsConfig[i]
        const { selector } = ssData.find(item => item.id === id)
        videoNode.src = selector["webm"] ?? selector["mp4"]
        setTimeout(() => videoNode.play(),0)
      })

      this.#wave.addEventListener("ended", this.#waveCmd, { passive: true })

      this.#qClient = await new QClient()
      await this.#qClient.subscribe(`${Q_PATH}/wave`, this.#waveCmd)
      await this.#qClient.publish(`${Q_PATH}/wave`, {})
    } catch (err) {
      console.error(`SSAppLineComponent [connectedCallback] error: ${err.message}`)
    }
  }

  async disconnectedCallback() {
    this.#wave.removeEventListener("ended", this.#waveCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/wave`, this.#waveCmd)
  }
}

customElements.define(SSAppLineComponent.TAG_NAME, SSAppLineComponent)