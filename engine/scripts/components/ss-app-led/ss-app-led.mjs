import { QClient } from "../../q-client.mjs"
import { SSErrorComponent } from "../ss-error/index.mjs"
import { SSVideoComponent } from "../ss-video/index.mjs"
import { SSWebcamComponent } from "../ss-webcam/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`
const Q_PATH = "/lit3d/slave/led"
const SS_DATA_URL = "/content/ss-data.json"

export class SSAppLedComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-led"

  #root = this.attachShadow({ mode: "open" })

  #qClient = undefined
  #ssData = []

  #volume = 90
  get volume() { return this.#volume }
  set volume(volume) {
    this.#volume = volume
    this.#root.querySelectorAll("*").forEach(node => node.volume = this.#volume / 100)
  }

  constructor() {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE
  }

  #clear = () => this.#root.innerHTML = TEMPLATE

  #error = message => {
    console.error(message)
    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(new SSErrorComponent(message))
    })
  }

  #ssCmd = ({id, muted = false } = {}) => {
    console.debug(`SSAppLedComponent [SS]: ${JSON.stringify({id, muted})}`)
    if (id === undefined || id === null) return

    const ssData = this.#ssData.find(item => item.id === id )
    if (!ssData) return this.#error(`SSAppLedComponent [SS] incorrect ID: ${id}`)

    const ssVideo = new SSVideoComponent(ssData, { muted })
    ssVideo.volume = this.volume / 100

    ssVideo.addEventListener("ended", () => {
      requestAnimationFrame(this.#clear)
      this.#qClient
          .publish(`${Q_PATH}/ss/ended`, "1")
          .catch(err => console.error(`SSAppLedComponent [SS] error: ${err.message}`))
    }, { once: true, passive: true })

    ssVideo.addEventListener("timeupdate", () => {
      this.#qClient
          .publish(`${Q_PATH}/ss/status`, JSON.stringify({
            src: ssVideo.src,
            muted: ssVideo.muted,
            loop: false,
            duration: ssVideo.duration,
            currentTime: ssVideo.currentTime,
          })).catch(err => console.error(`SSAppLedComponent [SS] error: ${err.message}`))
    }, { passive: true })

    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(ssVideo)
      setTimeout(() => ssVideo.play(),0)
    })
  }

  #videoCmd = ({ src, muted = true, loop = false } = {}) => {
    console.debug(`SSAppLedComponent [VIDEO]: ${JSON.stringify({src, muted, loop})}`)
    if (src === undefined || src === null) return

    const videoNode = document.createElement("video")
    videoNode.classList.add("video")
    videoNode.muted = muted
    videoNode.loop = loop
    videoNode.src = src
    videoNode.volume = this.volume / 100

    videoNode.addEventListener("ended", () =>{
      requestAnimationFrame(this.#clear)
      this.#qClient
          .publish(`${Q_PATH}/video/ended`, "1")
          .catch(err => console.error(`SSAppLedComponent [VIDEO] error: ${err.message}`))
    }, { once: true, passive: true })


    videoNode.addEventListener("timeupdate", () => {
      this.#qClient
          .publish(`${Q_PATH}/video/status`, JSON.stringify({
            src: videoNode.src,
            muted: videoNode.muted,
            loop: videoNode.loop,
            duration: videoNode.duration,
            currentTime: videoNode.currentTime,
          })).catch(err => console.error(`SSAppLedComponent [VIDEO] error: ${err.message}`))
    }, { passive: true })

    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(videoNode)
      setTimeout(() => videoNode.play(),0)
    })
  }

  #imageCmd = ({src} = {}) => {
    console.debug(`SSAppLedComponent [IMAGE]: ${JSON.stringify({src})}`)
    if (src === undefined || src === null) this.style.removeProperty("--bg-image")
    else this.style.setProperty("--bg-image", `url(${src})`)
    requestAnimationFrame(this.#clear)
  }

  #webcamCmd = async (options = {}) => {
    console.debug(`SSAppLedComponent [WEBCAM]: ${JSON.stringify(options)}`)
    if (Object.keys(options).length === 0) return

    const ssWebcam = await new SSWebcamComponent(options)
    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(ssWebcam)
    })
  }

  #splashCmd = () => {
    console.debug(`SSAppLedComponent [SPLASH] set`)
    requestAnimationFrame(this.#clear)
  }

  #setVolume = (volume) => {
    console.debug(`SSAppLedComponent [SET VOLUME]: ${volume}`)
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return
    this.volume = volume
  }

  async connectedCallback() {
    try {
      const response = await fetch(SS_DATA_URL)
      this.#ssData = await response.json()

      this.#qClient = await new QClient()

      await this.#qClient.subscribe(`${Q_PATH}/ss`, this.#ssCmd)
      await this.#qClient.publish(`${Q_PATH}/ss`, {})
      await this.#qClient.subscribe(`${Q_PATH}/video`, this.#videoCmd)
      await this.#qClient.publish(`${Q_PATH}/video`, {})
      await this.#qClient.subscribe(`${Q_PATH}/image`, this.#imageCmd)
      await this.#qClient.publish(`${Q_PATH}/image`, {})
      await this.#qClient.subscribe(`${Q_PATH}/webcam`, this.#webcamCmd)
      await this.#qClient.publish(`${Q_PATH}/webcam`, {})
      await this.#qClient.subscribe(`${Q_PATH}/splash`, this.#splashCmd)
      await this.#qClient.publish(`${Q_PATH}/splash`, {})
      await this.#qClient.subscribe(`${Q_PATH}/volume/set`, this.#setVolume)
      await this.#qClient.publish(`${Q_PATH}/volume/set`, null)
    } catch (err) {
      console.error(`SSAppLedComponent [connectedCallback] error: ${err.message}`)
    }
  }

  async disconnectedCallback() {
    await this.#qClient.unsubscribe(`${Q_PATH}/ss`, this.#ssCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/video`, this.#videoCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/image`, this.#imageCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/webcam`, this.#webcamCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/splash`, this.#splashCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/volume/set`, this.#setVolume)
  }

  debug = (cmd, options) => {
    cmd = cmd.toLowerCase()
    switch (cmd) {
      case "ss":
        this.#ssCmd(options)
        return
      case "video":
        this.#videoCmd(options)
        return
      case "image":
        this.#imageCmd(options)
        return
      case "webcam":
        this.#webcamCmd(options)
        return
      case "splash":
        this.#splashCmd(options)
        return
    }
  }
}

customElements.define(SSAppLedComponent.TAG_NAME, SSAppLedComponent)