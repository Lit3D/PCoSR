import { UUIDv4 } from "./uuid.mjs"
import { QClient } from "./q-client.mjs"
import { SSVideoComponent } from "./components/ss-video/index.mjs"
import { SSSelectors } from "./components/ss-selector/index.mjs"

const SS_DATA_URL = "/assets/ss-data.json"

export class Slave {
  #id = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
  #qPath = `/lit3d/slave/${this.#id}`
  #qClient = undefined
  #root = undefined

  #ssData = []

  constructor(root = document.body) {
    this.#root = root
    return this.#init()
  }

  #init = async () => {
    // Get SS Video Data
    const response = await fetch(SS_DATA_URL)
    this.#ssData = await response.json()

    // Init MQTT
    this.#qClient = await new QClient()
    await this.#qClient.subscribe(`${this.#qPath}/ss-play`, this.#ssPlay)
    await this.#qClient.subscribe(`${this.#qPath}/video-play`, this.#videoPlay)
    await this.#qClient.subscribe(`${this.#qPath}/selectors`, this.#selectors)
    return this
  }

  #ssPlay = ({id, muted = true}) => {
    const ssData = this.#ssData[id]

    if (!ssData) {
      this.#root.innerHTML = `[SS Video ERROR] Incorrect ID: ${id}`
      return
    }

    const ssVideo = new SSVideoComponent(ssData, { muted })
    ssVideo.addEventListener("ended", this.#ssEnded)
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssVideo)
      ssVideo.play()
    })
  }

  #ssEnded = () => this.#qClient.publish(`${this.#qPath}/ss-ended`, "1")

  #videoPlay = ({ src, muted = true }) => {
    const videoNode = document.createElement("video")
    videoNode.muted = muted
    videoNode.loop = false
    videoNode.src = src

    videoNode.addEventListener("ended", this.#videoEnded)

    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(videoNode)
      videoNode.play()
    })
  }

  #videoEnded = () => this.#qClient.publish(`${this.#qPath}/video-ended`, "1")

  #selectors = ({ top, bottom }) => {
    const ssSelectors = new SSSelectors({ top, bottom })
    requestAnimationFrame(() => {
      this.#root.innerHTML = ""
      this.#root.appendChild(ssSelectors)
    })
  }
}