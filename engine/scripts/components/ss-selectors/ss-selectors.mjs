
const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

export class SSSelectors extends HTMLElement  {
  static TAG_NAME = "ss-selectors"

  #root = this.attachShadow({ mode: "open" })

  #topVideo = document.createElement("video")
  #bottomVideo = document.createElement("video")

  constructor({ top, bottom }) {
    // Init root template
    this.#root.innerHTML = TEMPLATE

    this.#topVideo.muted = true
    this.#topVideo.loop = true
    this.#topVideo.src = top
    this.#root.appendChild(this.#topVideo)

    this.#bottomVideo.muted = true
    this.#bottomVideo.loop = true
    this.#bottomVideo.src = bottom
    this.#root.appendChild(this.#bottomVideo)
  }

  connectedCallback() {
    this.#topVideo.play()
    this.#bottomVideo.play()
  }

  disconnectedCallback() {
    this.#topVideo.pause()
    this.#bottomVideo.pause()
  }
}

customElements.define(SSSelectors.TAG_NAME, SSSelectors)