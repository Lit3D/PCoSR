import { COMPONENT_ATTRIBUTE } from "../common.mjs"

const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
`

export class SSWebcamComponent extends HTMLElement  {
  static TAG_NAME = "ss-webcam"

  #root = this.attachShadow({ mode: "open" })
  #videoNode = document.createElement("video")

  constructor() {
    super()
    this.setAttribute(COMPONENT_ATTRIBUTE, 1)
    return this.#init()
  }

  #init = async () => {

    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#videoNode)
    try {
      this.#videoNode.srcObject = await navigator.mediaDevices.getUserMedia({
        audio: false,
        // video: { width: 1920, height: 1080 },
        video: true,
      })
    } catch (err) {
      console.error(err)
      return
    }
    this.#videoNode.autoplay = true
    // this.#videoNode.autoplay = true
    return this
  }

}

customElements.define(SSWebcamComponent.TAG_NAME, SSWebcamComponent)