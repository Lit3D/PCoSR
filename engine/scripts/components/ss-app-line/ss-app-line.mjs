import { Q_PATH_LINE } from "../../q-client.mjs"
import { SSViewportComponent } from "../ss-viewport/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

const Q_PATH = Q_PATH_LINE
const SS_DATA_URL = "/content/ss-data.json"
const SELECTORS_CONFIG_URL = "/config/selectors.json"

export class SSAppLineComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-line"

  #root = this.attachShadow({ mode: "open" })

  #top = document.createElement("video")
  #bottom = document.createElement("video")
  #viewport = undefined

  #id = 0
  constructor(id = 0) {
    super()
    this.#id = id
    this.#root.innerHTML = TEMPLATE

    this.#top.classList.add("selector")
    this.#top.muted = true
    this.#top.loop = true
    this.#root.appendChild(this.#top)

    this.#bottom.classList.add("selector")
    this.#bottom.muted = true
    this.#bottom.loop = true
    this.#root.appendChild(this.#bottom)

    this.#viewport = new SSViewportComponent(`${Q_PATH}/${this.#id}`)
    this.#root.appendChild(this.#viewport)
  }

  async connectedCallback() {
    let ssData, selectorsConfig
    try {
      let response = await fetch(SS_DATA_URL)
      ssData = await response.json()

      response = await fetch(SELECTORS_CONFIG_URL)
      selectorsConfig = await response.json()
    } catch (err) {
      this.#viewport.error = `SSAppLineComponent [connectedCallback] error: ${err.message}`
      return
    }

    const [top, bottom] = selectorsConfig.find(({id}) => id === this.#id)?.ss ?? []
    let selector = ssData.find(item => item.id === top)?.selector
    this.#top.src = selector["webm"] ?? selector["mp4"]
    selector = ssData.find(item => item.id === bottom)?.selector
    this.#bottom.src = selector["webm"] ?? selector["mp4"]

    setTimeout(() => {
      this.#top.play()
      this.#bottom.play()
    },0)
  }

  async disconnectedCallback() { }
}

customElements.define(SSAppLineComponent.TAG_NAME, SSAppLineComponent)