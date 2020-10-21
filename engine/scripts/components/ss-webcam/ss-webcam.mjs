
const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
`

export class SSWebcamComponent extends HTMLElement  {
  static TAG_NAME = "ss-webcam"

  #root = this.attachShadow({ mode: "open" })
  #videoNode = document.createElement("video")

  constructor() {
    super()
    return this.#init()
  }

  #init = async () => {
    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#videoNode)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      // video: { width: 1920, height: 1080 },
      video: true,
    })
    console.dir(stream)
    this.#videoNode.srcObject = stream
    this.#videoNode.autoplay = true
    // this.#videoNode.autoplay = true
    return this
  }

}

customElements.define(SSWebcamComponent.TAG_NAME, SSWebcamComponent)