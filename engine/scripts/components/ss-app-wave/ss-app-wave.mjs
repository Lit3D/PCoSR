import { QClient, Q_PATH_LINE } from "../../q-client.mjs"
import { Cache } from "../../cache.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

const Q_PATH = Q_PATH_LINE
const currentWindow = require("electron").remote.getCurrentWindow()

export class SSAppWaveComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-wave"
  #root = this.attachShadow({ mode: "open" })

  #qClient = undefined
  #wave = document.createElement("video")

  #cache = new Cache()

  constructor() {
    super()
    this.#root.innerHTML = TEMPLATE

    this.#wave.classList.add("wave")
    this.#wave.muted = true
    this.#wave.loop = false
    this.#root.appendChild(this.#wave)
  }

  #ssWave = ({ src }) => {
    if (!src) {
      currentWindow.hide()
      this.#wave.pause()
      return
    }
    this.#wave.src = this.#cache.get(src)
    this.#wave.currentTime = 0
    currentWindow.show()
    setTimeout(() => this.#wave.play(),0)
  }

  #ended = () => {
    currentWindow.hide()
    this.#qClient
        .publish(`${Q_PATH}/wave/ended`, "1")
        .catch(err => console.error(`SSAppWaveComponent [SS] error: ${err.message}`))
  }

  async connectedCallback() {
    try {
      this.#qClient = await new QClient()
      await this.#qClient.subscribe(`${Q_PATH}/wave`, this.#ssWave)
      await this.#qClient.publish(`${Q_PATH}/wave`, {})
    } catch (err) {
      console.error(`SSAppWaveComponent [connectedCallback] error: ${err.message}`)
      return
    }

    this.#wave.addEventListener("ended", this.#ended, { passive: true })
  }

  async disconnectedCallback() {
    this.#wave.removeEventListener("ended", this.#ended)
    await this.#qClient.unsubscribe(`${Q_PATH}/wave`, {})
  }
}

customElements.define(SSAppWaveComponent.TAG_NAME, SSAppWaveComponent)