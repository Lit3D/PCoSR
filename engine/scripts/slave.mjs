import { UUIDv4 } from "./uuid.mjs"
import { QClient } from "./q-client.mjs"
import { SSVideoComponent } from "./components/ss-video/index.mjs"
import { SSWebcamComponent } from "./components/ss-webcam/index.mjs"
import { SSSelectorComponent } from "./components/ss-selector/index.mjs"

const SS_DATA_URL = "/assets/ss-data.json"

export class Slave {
  #id = undefined
  #root = undefined

  #qClient = undefined
  #qPath = undefined

  #ssData = []

  #defaultState = undefined

  #volume = 90
  get volume() {
    return this.#volume
  }

  set volume(volume) {
    this.#volume = volume
    this.#root.querySelectorAll("*").forEach(node => node.volume = this.#volume / 100)
  }

  constructor(id, { root = document.body, ...options} = {}) {
    this.#id = id ?? UUIDv4()
    this.#qPath = `/lit3d/slave/${this.#id}`
    this.#root = root
    this.#defaultState = this.#getDefaultState(options)
    return this.#init()
  }

  #getDefaultState = options => {
    for (const [key, data] of Object.entries(options)) {
      switch(key) {
        case "ss":
          return () => this.#ssCmd(data)
        case "audio":
          return () => this.#audioCmd(data)
        case "video":
          return () => this.#videoCmd(data)
        case "image":
          return () => this.#imageCmd(data)
        case "webcam":
          return () => this.#webcamCmd(data)
        case "splash":
          return () => this.#splashCmd(data)
      }
    }

    return this.#splashCmd(data)
  }

  #init = async () => {
    // Get SS Video Data
    const response = await fetch(SS_DATA_URL)
    this.#ssData = await response.json()

    // Init MQTT
    this.#qClient = await new QClient()
    await this.#qClient.subscribe(`${this.#qPath}/ss`, this.#ssCmd)
    await this.#qClient.publish(`${this.#qPath}/ss`, {})
    await this.#qClient.subscribe(`${this.#qPath}/video`, this.#videoCmd)
    await this.#qClient.publish(`${this.#qPath}/video`, {})
    await this.#qClient.subscribe(`${this.#qPath}/audio`, this.#audioCmd)
    await this.#qClient.publish(`${this.#qPath}/audio`, {})
    await this.#qClient.subscribe(`${this.#qPath}/image`, this.#imageCmd)
    await this.#qClient.publish(`${this.#qPath}/image`, {})
    await this.#qClient.subscribe(`${this.#qPath}/webcam`, this.#webcamCmd)
    await this.#qClient.publish(`${this.#qPath}/webcam`, {})
    await this.#qClient.subscribe(`${this.#qPath}/selector`, this.#selectorCmd)
    await this.#qClient.publish(`${this.#qPath}/selector`, {})
    await this.#qClient.subscribe(`${this.#qPath}/splash`, this.#splashCmd)
    await this.#qClient.publish(`${this.#qPath}/splash`, {})
    await this.#qClient.subscribe(`${this.#qPath}/volume/set`, this.#setVolume)
    await this.#qClient.publish(`${this.#qPath}/volume/set`, null)

    this.#defaultState()

    return this
  }

  #ssCmd = ({id, muted = true }) => {
    console.log("ssCmd", {id, muted})
    if (id === undefined) return

    const ssData = this.#ssData.find(item => item.id === id )

    if (!ssData) {
      this.#root.innerHTML = `[SS ERROR] Incorrect ID: ${id}`
      return
    }

    const ssVideo = new SSVideoComponent(ssData, { muted })
    ssVideo.volume = this.volume / 100
    
    ssVideo.addEventListener("ended", () => {
      this.#qClient.publish(`${this.#qPath}/ss/ended`, "1")
      this.#defaultState()
    }, { once: true, passive: true })

    ssVideo.addEventListener("timeupdate", () => this.#qClient.publish(`${this.#qPath}/ss/status`, JSON.stringify({
      src: ssVideo.src,
      muted: ssVideo.muted,
      loop: false,
      duration: ssVideo.duration,
      currentTime: ssVideo.currentTime,
    })), { passive: true })

    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssVideo)
      setTimeout(() => ssVideo.play(),0)
    })
  }

  #videoCmd = ({ src, muted = true, loop = false }) => {
    console.log("videoCmd", {src, muted, loop})
    if (src === undefined) return

    const videoNode = document.createElement("video")
    videoNode.classList.add("video")
    videoNode.muted = muted
    videoNode.loop = loop
    videoNode.src = src
    videoNode.volume = this.volume / 100

    videoNode.addEventListener("ended", () =>{
      this.#qClient.publish(`${this.#qPath}/video/ended`, "1")
      this.#defaultState()
    }, { once: true, passive: true })

    videoNode.addEventListener("timeupdate", () => this.#qClient.publish(`${this.#qPath}/video/status`, JSON.stringify({
      src: videoNode.src,
      muted: videoNode.muted,
      loop: videoNode.loop,
      duration: videoNode.duration,
      currentTime: videoNode.currentTime,
    })), { passive: true })

    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(videoNode)
      videoNode.play()
    })
  }

  #audioCmd = ({src, loop}) => {
    console.log("audioCmd", {src, loop})
    if (src === undefined) return
  }

  #imageCmd = ({src}) => {
    console.log("imageCmd", {src})
    if (src === undefined) return

    const imgNode = new Image()
    imgNode.src = src
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(imgNode)
    })
  }

  #webcamCmd = async (options) => {
    console.log("webcamCmd", {options})
    if (Object.keys(options).length === 0) return

    const ssWebcam = await new SSWebcamComponent(options)
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssWebcam)
    })
  }

  #selectorCmd = ({ top, bottom }) => {
    console.log("selectorCmd", {top, bottom})
    if (top === undefined || bottom === undefined) return

    const ssTop = this.#ssData.find(item => item.id === top )?.selector
    if (ssTop === undefined) {
      this.#root.innerHTML = `[SS ERROR] Incorrect selector ID: ${top}`
      return
    }

    const ssBottom = this.#ssData.find(item => item.id === bottom )?.selector
    if (ssBottom === undefined) {
      this.#root.innerHTML = `[SS ERROR] Incorrect selector ID: ${bottom}`
      return
    }

    const SSSelectorComponent = await new SSSelectorComponent({ top: ssTop, bottom: ssBottom })
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(SSSelectorComponent)
    })
  }

  #splashCmd = () => {
    console.log("splashCmd", {})
    requestAnimationFrame(() => this.#root.innerHTML = "")
  }

  #setVolume = (volume) => {
    console.log("setVolume", {volume})
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return
    this.volume = volume
  }
}