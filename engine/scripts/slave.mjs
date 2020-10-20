import { UUIDv4 } from "./uuid.mjs"
import { QClient } from "./q-client.mjs"
import { SSVideoComponent } from "./components/ss-video/index.mjs"
import { SSSelectors } from "./components/ss-selectors/index.mjs"

const SS_DATA_URL = "/assets/ss-data.json"

export class Slave {
  #id = undefined
  #root = undefined

  #qClient = undefined
  #qPath = undefined

  #ssData = []

  constructor(id, root = document.body) {
    this.#id = id ?? UUIDv4()
    this.#qPath = `/lit3d/slave/${this.#id}`
    this.#root = root
    return this.#init()
  }

  #init = async () => {
    // Get SS Video Data
    const response = await fetch(SS_DATA_URL)
    this.#ssData = await response.json()

    // Init MQTT
    this.#qClient = await new QClient()
    await this.#qClient.subscribe(`${this.#qPath}/ss`, this.#ssCmd)
    await this.#qClient.subscribe(`${this.#qPath}/video`, this.#videoCmd)
    await this.#qClient.subscribe(`${this.#qPath}/audio`, this.#audioCmd)
    await this.#qClient.subscribe(`${this.#qPath}/image`, this.#imageCmd)
    await this.#qClient.subscribe(`${this.#qPath}/selectors`, this.#selectorsCmd)
    await this.#qClient.subscribe(`${this.#qPath}/webcam`, this.#webcamCmd)

    return this
  }

  #ssCmd = ({id, muted = true}) => {
    const ssData = this.#ssData[id]

    if (!ssData) {
      this.#root.innerHTML = `[SS ERROR] Incorrect ID: ${id}`
      return
    }

    const ssVideo = new SSVideoComponent(ssData, { muted })
    
    ssVideo.addEventListener("ended", () => this.#qClient.publish(`${this.#qPath}/ss/ended`, "1"), { once: true })
    ssVideo.addEventListener("timeupdate", () => this.#qClient.publish(`${this.#qPath}/ss/status`, JSON.stringify({
      src: ssVideo.src,
      muted: ssVideo.muted,
      loop: false,
      duration: ssVideo.duration,
      currentTime: ssVideo.currentTime,
    })))

    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssVideo)
      setTimeout(() => ssVideo.play(),0)
    })
  }

  #videoCmd = ({ src, muted = true, loop = false }) => {
    const videoNode = document.createElement("video")
    videoNode.muted = muted
    videoNode.loop = loop
    videoNode.src = src

    videoNode.addEventListener("ended", () => this.#qClient.publish(`${this.#qPath}/video/ended`, "1"), { once: true })
    videoNode.addEventListener("timeupdate", () => this.#qClient.publish(`${this.#qPath}/video/status`, JSON.stringify({
      src: videoNode.src,
      muted: videoNode.muted,
      loop: videoNode.loop,
      duration: videoNode.duration,
      currentTime: videoNode.currentTime,
    })))

    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(videoNode)
      setTimeout(() => videoNode.play(),0)
    })
  }

  #audioCmd = ({src, loop}) => {

  }

  #imageCmd = ({src}) => {
    const imgNode = new Image()
    imgNode.src = src
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(imgNode)
    })
  }

  #selectorsCmd = ({ top, bottom }) => {
    const ssSelectors = new SSSelectors({ top, bottom })
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssSelectors)
    })
  }

  #webcamCmd = ({ hdmi = 1 }) => {

  }
}