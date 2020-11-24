import { Q_PATH_LINE } from "../../q-client.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

const Q_PATH = Q_PATH_LINE

export class SSAppWaveComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-wave"
  #root = this.attachShadow({ mode: "open" })

  #qClient = undefined
  #wave = document.createElement("video")

  constructor() {
    super()
    this.#root.innerHTML = TEMPLATE

    this.#wave.classList.add("wave")
    this.#wave.muted = true
    this.#wave.loop = false
    this.#root.appendChild(this.#wave)
  }

  #ssWave = (src) => {
    this.#wave.src = src
    setTimeout(() => this.#wave.play(),0)
  }

  #ended = () => {
    this.#qClient
        .publish(`${Q_PATH}/wave/ended`, "1")
        .catch(err => console.error(`SSAppWaveComponent [SS] error: ${err.message}`))
  }

  async connectedCallback() {
    try {
      await this.#qClient.subscribe(`${Q_PATH}/wave`, this.#ssWave)
      await this.#qClient.publish(`${Q_PATH}/wave`, {})
    } catch (err) {
      this.#viewport.error = `SSAppWaveComponent [connectedCallback] error: ${err.message}`
      return
    }

    this.#wave.addEventListener("ended", this.#ended, { passive: true })
  }

  async disconnectedCallback() {
    this.#wave.removeEventListener("ended", this.#ended)
    await this.#qClient.unsubscribe(`${Q_PATH}/wave`, this.#ssWave)
  }
}

customElements.define(SSAppWaveComponent.TAG_NAME, SSAppWaveComponent)