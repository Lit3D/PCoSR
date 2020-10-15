import { EventBus } from "./event-bus/index.mjs"
import { Scenario } from "./scenario.mjs"

export class Master {
  #scenario = undefined

  #newScenario = ({ detail: { id = "main", step = 0 } = {} }) => {
    this.#scenario && this.#scenario.destruct()
    this.#scenario = await new Scenario(id)
    this.#scenario.step(step)
  }

  constructor() {
    const eventBus = new EventBus()
    eventBus.addEventListener(SCENARIO_START, this.#newScenario)
  }
}
