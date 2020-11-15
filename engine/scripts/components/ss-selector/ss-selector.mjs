const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
  <video id="topVideo" class="video video--top"></video>
  <video id="bottomVideo" class="video video--bottom"></video>
`

export class SSSelectorComponent extends HTMLElement  {
  static TAG_NAME = "ss-selector"

  #root = this.attachShadow({ mode: "open" })

  #topVideo = undefined
  #bottomVideo = undefined

  constructor({ top, bottom } = {}) {
    // Init root template
    this.#root.innerHTML = TEMPLATE

    // Configure splash video
    this.#topVideo = this.#root.getElementById("topVideo")
    this.#topVideo.muted = true
    this.#topVideo.loop = true
    this.#topVideo.src = top

    // Configure main vieo
    this.#bottomVideo = this.#root.getElementById("bottomVideo")
    this.#bottomVideo.muted = true
    this.#bottomVideo.loop = true
    this.#bottomVideo.src = bottom
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this.#topVideo.play()
      this.#bottomVideo.play()
    })
  }
}

customElements.define(SSSelectorComponent.TAG_NAME, SSSelectorComponent)