
const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
  <video id="splashVideo" class="splash"></video>
  <video id="mainVideo" class="video"></video>
  <img id="logotypesImg" class="logotypes">
  <div id="ssLine" class="ss-line">
    <img src="/assets/images/logo.svg" class="ss-line__logo">
    <div class="ss-line__subtitle"></div>
    <div class="ss-line__curve-container">
      <img src="/assets/images/curve.svg" class="ss-line__curve">
    </div>
    <div id="ssWrapperNode" class="ss-line__ss-wrapper"></div>
  </div>
`

const LOGOTYPES_TIMEOUT = 9 // 9s

export class SSVideoComponent extends HTMLElement  {
  static TAG_NAME = "ss-video"
  static observedAttributes = ["src", "muted", "loop"]

  #root = this.attachShadow({ mode: "open" })

  #splashVideo = undefined
  #mainVideo = undefined
  #logotypesImg = undefined
  #ssWrapperNode = undefined
  #ssLine = undefined

  #ssNodeList = []

  constructor({
    splash,
    video,
    logo,
    section_ru,
    section_en,
    subtitles,
    ...options
  } = {}, { muted = true } = {}) {
    super()

    const screenWidth = window.screen.width

    // Init root template
    this.#root.innerHTML = TEMPLATE

    // Configure splash video
    this.#splashVideo = this.#root.getElementById("splashVideo")
    this.#splashVideo.muted = true
    this.#splashVideo.loop = false
    this.#splashVideo.src = options[`splash${screenWidth}`] ?? splash

    // Configure main vieo
    this.#mainVideo = this.#root.getElementById("mainVideo")
    this.#mainVideo.muted = muted
    this.#mainVideo.loop = false
    this.#mainVideo.src = video

    // Configure final image
    this.#logotypesImg = this.#root.getElementById("logotypesImg")
    this.#logotypesImg.src = options[`logo${screenWidth}`] ?? logo

    this.#ssWrapperNode = this.#root.getElementById("ssWrapperNode")
    this.#ssLine = this.#root.getElementById("ssLine")

    this.#initSubtitles(subtitles)
  }

  #initSubtitles = subtitles => {
    this.#ssNodeList = subtitles.map(ss => {
      const node = document.createElement("div")
      node.classList.add("ss-line__ss-item")
      node.innerHTML = `<div class="ss-line__ss-item-ru">${ss.ru}</div><div class="ss-line__ss-item-en">${ss.en}</div>`
      this.#ssWrapperNode.appendChild(node)
      return {...ss, node}
    })
  }

  #ssShow = () => {
    const currentTime = this.#mainVideo.currentTime
    const ssData = this.#ssNodeList.find(({show, hide}) => currentTime >= show && currentTime <= hide)
    if (ssData && ssData.node.classList.contains("active")) return

    requestAnimationFrame(() => {
      this.#ssNodeList.forEach(({node}) => node.classList.remove("active"))
      ssData && ssData.node.classList.add("active")
    })
  }

  #logosShow = () => {
    if ((this.#mainVideo.duration - this.#mainVideo.currentTime) > LOGOTYPES_TIMEOUT) return
    requestAnimationFrame(() => {
      this.#ssLine.classList.remove("show")
      this.#mainVideo.classList.remove("active")
      this.#logotypesImg.classList.add("active")
    })
  }

  #splashEnded = () => {
    requestAnimationFrame(() => {
      this.#splashVideo.classList.remove("active")
      this.#mainVideo.classList.add("active")
      this.#ssLine.classList.add("show")
    })
  }

  #mainEnded = () => {
    console.log("ENDED")
  }

  play() {
    requestAnimationFrame(() => {
      this.#splashVideo.classList.add("active")
      this.#splashVideo.play()
      this.#mainVideo.play()
    })
  }

  pause() {
    this.#splashVideo.pause()
    this.#mainVideo.pause()
  }

  connectedCallback() {
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#ssShow)
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#logosShow, { once: true })
    this.#mainVideo && this.#mainVideo.addEventListener("ended", this.#mainEnded, { once: true })
    this.#splashVideo && this.#splashVideo.addEventListener("ended", this.#splashEnded, { once: true })
  }

  disconnectedCallback() {
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#ssShow)
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#logosShow, { once: true })
    this.#mainVideo && this.#mainVideo.removeEventListener("ended", this.#mainEnded, { once: true })
    this.#splashVideo && this.#splashVideo.removeEventListener("ended", this.#splashEnded, { once: true })
  }
}

customElements.define(SSVideoComponent.TAG_NAME, SSVideoComponent)