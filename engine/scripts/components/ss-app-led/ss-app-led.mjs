import { QClient, Q_PATH_LED } from "../../q-client.mjs"
import { SSViewportComponent } from "../ss-viewport/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`
const Q_PATH = Q_PATH_LED

export class SSAppLedComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-led"

  #root = this.attachShadow({ mode: "open" })
  #viewport = new SSViewportComponent(Q_PATH)
  #timerNode = document.createElement("div")

  #qClient = undefined

  constructor() {
    super()
    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#viewport)

    this.#timerNode.classList.add("ss-timer")
    this.#timerNode.innerHTML = ""
    this.#root.appendChild(this.#timerNode)
  }

  #setVolume = (volume) => {
    console.debug(`SSAppLedComponent [SET VOLUME]: ${volume}`)
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return
    this.#viewport.volume = volume
  }

  #timer = 0
  #setTimer = ({ timer = 0 } = {}) => this.#timer = timer

  #interval = undefined
  #lastTime = Math.round(new Date().getTime() / 1000)
  #tickTimer = () => {
    const cur = Math.round(new Date().getTime() / 1000)
    const dd = cur - this.#lastTime
    this.#lastTime = cur
    if (dd <= 0) return

    this.#timer = this.#timer - dd
    if (this.#timer <= 0) {
      this.#timer = 0
      requestAnimationFrame(() => this.#timerNode.innerHTML = "")
      return
    }

    const min = Math.floor(this.#timer / 60)
    const sec = this.#timer % 60
    const str = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
    requestAnimationFrame(() => this.#timerNode.innerHTML = str)
  }

  async connectedCallback() {
    try {
      this.#qClient = await new QClient()
      await this.#qClient.subscribe(`${Q_PATH}/volume/set`, this.#setVolume)
      await this.#qClient.publish(`${Q_PATH}/volume/set`, null)
      await this.#qClient.subscribe(`${Q_PATH}/timer`, this.#setTimer)
      await this.#qClient.publish(`${Q_PATH}/timer`, {})
    } catch (err) {
      this.#viewport.error = `SSAppLedComponent [connectedCallback] error: ${err.message}`
    }
    this.#interval = setInterval(this.#tickTimer, 1000)
  }

  async disconnectedCallback() {
    await this.#qClient.unsubscribe(`${Q_PATH}/volume/set`, this.#setVolume)
    await this.#qClient.unsubscribe(`${Q_PATH}/timer`, this.#setTimer)
    this.#interval && clearInterval(this.#interval)
  }
}

customElements.define(SSAppLedComponent.TAG_NAME, SSAppLedComponent)