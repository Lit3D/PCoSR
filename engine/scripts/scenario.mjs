
import { UUIDv4 } from "../uuid.mjs"
import { EventBus, ROLE_START } from "../event-bus/index.mjs"

const SCENARIOS_URL = "/scenarios"

export class Scenario {
  #eventBus = new EventBus()

  #id = UUIDv4()
  #name = "main"

  get scenario() {
    return `${this.#name}_${this.#id}`
  }

  #steps = []
  #currentStep = 0

  constructor(name) {
    this.#name = name
    return this.#init()
  }

  #init = async () => {
    try {
      const response = await fetch(`${SCENARIOS_URL}/${this.#name}`)
      this.#steps = await response.json()
    } catch (err) {
      console.error(err)
      return
    }
    this.#eventBus.addEventListener(ROLE_ENDED, this.#roleEnded)
    return this
  }

  #timeout = undefined

  destruct() {
    this.#timeout && clearTimeout(this.#timeout)
    this.#eventBus.removeEventListener(ROLE_ENDED, this.#roleEnded)
  }

  step = async (i = 0) => {
    this.#timeout && clearTimeout(this.#timeout)
    this.#timeout = undefined

    this.#currentStep = i
    if (this.#currentStep >= this.#steps.length) return

    const { timeout, ...roles } = this.#steps[this.#currentStep]
    for (const [role, data] of Object.entries(roles)) {
      this.#eventBus.send({ type: ROLE_START, to: role, detail: { scenario, step: this.#currentStep, ...data} })
    }

    if (Number.isFinite(timeout) && timeout > 0) {
      this.#timeout = setTimeout(this.nextStep, timeout)
    }
  }

  nextStep = async () => {
    return this.step(this.#currentStep + 1)
  }

  #roleEnded = async ({detail: { scenario, step } = {}}) => {
    if (scenario !== this.scenario || step !== this.#currentStep) return
    return this.nextStep
  }
}
