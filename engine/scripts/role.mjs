
import { EventBus, ROLE_ENDED } from "./event-bus/index.mjs"

export class Role {
  #eventBus = new EventBus()

  #root = undefined

  #scenario = undefined
  #sendEnded = false
  #step = undefined

  #nodes = []

  constructor({ classes = [], content = [], sendEnded = false, scenario, step } = {}, root = document.createElement("div")) {
    this.#root = root
    this.#root.classList.add(...classes)

    this.#scenario = scenario
    this.#sendEnded = sendEnded
    this.#step = step

    this.#initContent(content)
    this.start()
  }

  #initContent(content) {
    for (const {tag, src, loop, muted } of content) {
      const contentNode = document.createElement(tag)
      contentNode.src = src
      contentNode.loop = loop
      contentNode.muted = muted
      this.addEventListener("ended", this.#onEnded)
      this.#root.appendChild(contentNode)
      this.#nodes.push(contentNode)
    }
  }

  #onEnded = () => {
    if (!this.#sendEnded) return
    if (this.#nodes.every(node => node.ended)) {
      this.#eventBus.send({ type: ROLE_ENDED, to: "master", detail: { scenario: this.#scenario, step: this.#step } })
    }
  }

  start() {
    requestAnimationFrame(() => this.#nodes.forEach(node => node.play()))
  }
}
