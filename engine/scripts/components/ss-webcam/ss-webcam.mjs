const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
`

const DEVICE_LABEL = "OBS-Camera"

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
  
    let devices = undefined

    try {
      devices = await navigator.mediaDevices.enumerateDevices()
    } catch (err) {
      console.error(err)
      this.#root.innerHTML = `<div class="error">SSWebcamComponent [enumerateDevices] error: ${err}</div>`
      return
    }

    const device = devices.find(({label}) => label === DEVICE_LABEL)
    if (!device) {
      console.error(`SSWebcamComponent error: "${DEVICE_LABEL}" is not found`)
      this.#root.innerHTML = `<div class="error">SSWebcamComponent error: ${DEVICE_LABEL} is not found</div>`
      return
    }

    const { deviceId } = device
    console.debug(`SSWebcamComponent [${DEVICE_LABEL}] id: ${deviceId}`)

    try {
      this.#videoNode.srcObject = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {deviceId, width: 1920, height: 1080 },
      })
    } catch (err) {
      console.error(err)
      this.#root.innerHTML = `<div class="error">SSWebcamComponent [getUserMedia] error: ${err}</div>`
      return
    }

    this.#videoNode.autoplay = true
    return this
  }

}

customElements.define(SSWebcamComponent.TAG_NAME, SSWebcamComponent)