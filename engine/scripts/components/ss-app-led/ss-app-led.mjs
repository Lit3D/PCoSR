import { QClient, Q_PATH_LED } from "../../q-client.mjs"
import { SSViewportComponent } from "../ss-viewport/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`
const Q_PATH = Q_PATH_LED

export class SSAppLedComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-led"

  #root = this.attachShadow({ mode: "open" })
  #viewport = new SSViewportComponent(Q_PATH)

  #qClient = undefined

  constructor() {
    super()
    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#viewport)
  }

  #setVolume = (volume) => {
    console.debug(`SSAppLedComponent [SET VOLUME]: ${volume}`)
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return
    this.#viewport.volume = volume
  }

  async connectedCallback() {
    try {
      this.#qClient = await new QClient()
      await this.#qClient.subscribe(`${Q_PATH}/volume/set`, this.#setVolume)
      await this.#qClient.publish(`${Q_PATH}/volume/set`, null)
    } catch (err) {
      console.error(`SSAppLedComponent [connectedCallback] error: ${err.message}`)
    }
  }

  async disconnectedCallback() {
    await this.#qClient.unsubscribe(`${Q_PATH}/volume/set`, this.#setVolume)
  }
}

customElements.define(SSAppLedComponent.TAG_NAME, SSAppLedComponent)