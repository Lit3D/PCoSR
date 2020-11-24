import { QClient } from "../../q-client.mjs"
import { SSErrorComponent } from "../ss-error/index.mjs"
import { SSVideoComponent } from "../ss-video/index.mjs"
import { SSWebcamComponent } from "../ss-webcam/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`
const SS_DATA_URL = "/content/ss-data.json"

export class SSViewportComponent extends HTMLElement  {
  static TAG_NAME = "ss-viewport"

  #root = this.attachShadow({ mode: "open" })
  #ssData = []

  #qClient = undefined
  #qPath = undefined

  #volume = 90
  get volume() { return this.#volume }
  set volume(volume) {
    this.#volume = volume
    this.#root.querySelectorAll("*").forEach(node => node.volume = this.#volume / 100)
  }

  #webm = false

  constructor(qPath, { webm = false } = {}) {
    super()
    this.#qPath = qPath
    this.#webm = webm
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
  set error(message) { this.#error(message) }

  #ssCmd = ({id, muted = false } = {}) => {
    console.debug(`SSViewportComponent [SS]: ${JSON.stringify({id, muted})}`)
    if (id === undefined || id === null) return

    const ssData = this.#ssData.find(item => item.id === id )
    if (!ssData) return this.#error(`SSViewportComponent [SS] incorrect ID: ${id}`)

    const ssVideo = new SSVideoComponent(ssData, { muted, webm: this.#webm })
    ssVideo.volume = this.volume / 100

    ssVideo.addEventListener("ended", () => {
      requestAnimationFrame(this.#clear)
      this.#qClient
          .publish(`${this.#qPath}/ss/ended`, "1")
          .catch(err => console.error(`SSViewportComponent [SS] error: ${err.message}`))
    }, { once: true, passive: true })

    ssVideo.addEventListener("timeupdate", () => {
      this.#qClient
          .publish(`${this.#qPath}/ss/status`, JSON.stringify({
            src: ssVideo.src,
            muted: ssVideo.muted,
            loop: false,
            duration: ssVideo.duration,
            currentTime: ssVideo.currentTime,
          })).catch(err => console.error(`SSViewportComponent [SS] error: ${err.message}`))
    }, { passive: true })

    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(ssVideo)
      setTimeout(() => ssVideo.play(),0)
    })
  }

  #videoCmd = ({ src, muted = false, loop = false } = {}) => {
    console.debug(`SSViewportComponent [VIDEO]: ${JSON.stringify({src, muted, loop})}`)
    if (src === undefined || src === null) return

    const videoNode = document.createElement("video")
    videoNode.classList.add("video")
    videoNode.muted = muted
    videoNode.loop = loop
    videoNode.src = src
    videoNode.volume = this.volume / 100

    videoNode.addEventListener("ended", () => {
      if (videoNode.loop) return
      requestAnimationFrame(this.#clear)
      this.#qClient
          .publish(`${this.#qPath}/video/ended`, 1)
          .catch(err => console.error(`SSViewportComponent [VIDEO] error: ${err.message}`))
    }, { once: true, passive: true })


    videoNode.addEventListener("timeupdate", () => {
      this.#qClient
          .publish(`${this.#qPath}/video/status`, JSON.stringify({
            src: videoNode.src,
            muted: videoNode.muted,
            loop: videoNode.loop,
            duration: videoNode.duration,
            currentTime: videoNode.currentTime,
          })).catch(err => console.error(`SSViewportComponent [VIDEO] error: ${err.message}`))
    }, { passive: true })

    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(videoNode)
      setTimeout(() => videoNode.play(),0)
    })
  }

  #imageCmd = ({src} = {}) => {
    console.debug(`SSViewportComponent [IMAGE]: ${JSON.stringify({src})}`)
    if (src === undefined || src === null) this.style.removeProperty("--bg-image")
    else this.style.setProperty("--bg-image", `url(${src})`)
    requestAnimationFrame(this.#clear)
  }

  #webcamCmd = async (options = {}) => {
    console.debug(`SSViewportComponent [WEBCAM]: ${JSON.stringify(options)}`)
    if (Object.keys(options).length === 0) return

    const ssWebcam = await new SSWebcamComponent(options)
    requestAnimationFrame(() => {
      this.#clear()
      this.#root.appendChild(ssWebcam)
    })
  }

  #splashCmd = () => {
    console.debug(`SSViewportComponent [SPLASH] set`)
    requestAnimationFrame(this.#clear)
  }

  async connectedCallback() {
    try {
      const response = await fetch(SS_DATA_URL)
      this.#ssData = await response.json()

      this.#qClient = await new QClient()

      await this.#qClient.subscribe(`${this.#qPath}/ss`, this.#ssCmd)
      await this.#qClient.publish(`${this.#qPath}/ss`, {})
      await this.#qClient.subscribe(`${this.#qPath}/video`, this.#videoCmd)
      await this.#qClient.publish(`${this.#qPath}/video`, {})
      await this.#qClient.subscribe(`${this.#qPath}/image`, this.#imageCmd)
      await this.#qClient.publish(`${this.#qPath}/image`, {})
      await this.#qClient.subscribe(`${this.#qPath}/webcam`, this.#webcamCmd)
      await this.#qClient.publish(`${this.#qPath}/webcam`, {})
      await this.#qClient.subscribe(`${this.#qPath}/splash`, this.#splashCmd)
      await this.#qClient.publish(`${this.#qPath}/splash`, {})
    } catch (err) {
      console.error(`SSViewportComponent [connectedCallback] error: ${err.message}`)
    }
  }

  async disconnectedCallback() {
    await this.#qClient.unsubscribe(`${this.#qPath}/ss`, this.#ssCmd)
    await this.#qClient.unsubscribe(`${this.#qPath}/video`, this.#videoCmd)
    await this.#qClient.unsubscribe(`${this.#qPath}/image`, this.#imageCmd)
    await this.#qClient.unsubscribe(`${this.#qPath}/webcam`, this.#webcamCmd)
    await this.#qClient.unsubscribe(`${this.#qPath}/splash`, this.#splashCmd)
  }

  command = (cmd, options) => {
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

customElements.define(SSViewportComponent.TAG_NAME, SSViewportComponent)