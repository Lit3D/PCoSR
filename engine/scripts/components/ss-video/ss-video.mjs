const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
  <video id="splashVideo" class="splash"></video>
  <video id="mainVideo" class="video"></video>
  <img id="logotypesImg" class="logotypes">
  <div id="ssLine" class="ss-line">
    <img src="/assets/images/logo.svg" class="ss-line__logo">
    <div id="ssSubtitle" class="ss-line__subtitle"></div>
    <div class="ss-line__curve-container">
      <img src="/assets/images/curve.svg" class="ss-line__curve">
    </div>
    <div id="ssWrapperNode" class="ss-line__ss-wrapper"></div>
  </div>
  <div id="ssTimer" class="ss-timer"></div>
`

const LOGOTYPES_TIMEOUT = 9 // 9s
const TIMER_TIMEOUT = 30 // 30s

export class SSVideoComponent extends HTMLElement  {
  static TAG_NAME = "ss-video"
  static observedAttributes = ["src", "muted", "loop"]

  #root = this.attachShadow({ mode: "open" })

  #splashVideo = undefined
  #mainVideo = undefined
  #logotypesImg = undefined
  #ssWrapperNode = undefined
  #ssLine = undefined
  #ssSubtitle = undefined

  #isTimer = false
  #ssTimer = undefined

  #ssNodeList = []

  constructor({
    splash,
    video,
    logos,
    section_ru,
    section_en,
    subtitles,
    ...options
  } = {}, { muted = true, webm = false, timer = false } = {}) {
    super()

    const screenWidth = window.screen.width

    // Init root template
    this.#root.innerHTML = TEMPLATE

    // Configure splash video
    this.#splashVideo = this.#root.getElementById("splashVideo")
    this.#splashVideo.muted = true
    this.#splashVideo.loop = false
    this.#splashVideo.src = splash[`${webm ? "webm" : "mp4"}-${screenWidth}`] ?? splash[webm ? "webm" : "mp4"]

    // Configure main vieo
    this.#mainVideo = this.#root.getElementById("mainVideo")
    this.#mainVideo.muted = muted
    this.#mainVideo.loop = false
    this.#mainVideo.src = video[webm ? "webm" : "mp4"]

    // Configure final image
    this.#logotypesImg = this.#root.getElementById("logotypesImg")
    this.#logotypesImg.src = logos[screenWidth] ?? logos["default"]

    this.#ssWrapperNode = this.#root.getElementById("ssWrapperNode")
    this.#ssLine = this.#root.getElementById("ssLine")

    this.#ssSubtitle = this.#root.getElementById("ssSubtitle")
    this.#ssSubtitle.innerHTML = section_ru

    this.#initSubtitles(subtitles)

    this.#isTimer = timer
    this.#ssTimer = this.#root.getElementById("ssTimer")
    this.#ssTimer.innerHTML = ""
  }

  get src() {
     return this.#mainVideo.src
  }

  get muted() {
    return this.#mainVideo.muted
  }

  get loop() {
    return this.#mainVideo.loop
  }

  get duration() {
    return this.#mainVideo.duration
  }

  get currentTime() {
    return this.#mainVideo.currentTime
  }

  set volume(volume) {
    if (this.#mainVideo) this.#mainVideo.volume = volume
  }

  get volume() {
    return this.#mainVideo && this.#mainVideo.volume || null
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

  #timerShow =() => {
    if (!this.#isTimer) return
    const seconds = this.#mainVideo.duration - this.#mainVideo.currentTime
    if (seconds > TIMER_TIMEOUT) return
    this.#ssTimer.innerHTML = `0:${String(seconds).padStart(2,"0")}`
  }

  #splashEnded = () => {
    requestAnimationFrame(() => {
      this.#splashVideo.classList.remove("active")
      this.#mainVideo.classList.add("active")
      this.#ssLine.classList.add("show")
    })
  }

  #dispatchTimeupdate = () => this.dispatchEvent(new Event("timeupdate"))
  #dispatchEnded = () => this.dispatchEvent(new Event("ended"))

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
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#ssShow, { passive: true })
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#logosShow, { passive: true })
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#dispatchTimeupdate, { passive: true })
    this.#mainVideo && this.#mainVideo.addEventListener("timeupdate", this.#timerShow, { passive: true })
    this.#mainVideo && this.#mainVideo.addEventListener("ended", this.#dispatchEnded, { once: true, passive: true })
    this.#splashVideo && this.#splashVideo.addEventListener("ended", this.#splashEnded, { once: true, passive: true })
  }

  disconnectedCallback() {
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#ssShow)
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#logosShow)
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#dispatchTimeupdate)
    this.#mainVideo && this.#mainVideo.removeEventListener("timeupdate", this.#timerShow)
    this.#mainVideo && this.#mainVideo.removeEventListener("ended", this.#dispatchEnded)
    this.#splashVideo && this.#splashVideo.removeEventListener("ended", this.#splashEnded)
  }
}

customElements.define(SSVideoComponent.TAG_NAME, SSVideoComponent)