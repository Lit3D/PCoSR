import { EventBus } from "./event-bus/index.mjs"
import { Scenario } from "./scenario.mjs"

EventBus.ID = "master"

let scenario = undefined

async function newScenario({ detail: { id = "main", step = 0 } = {} }) {
  scenario && scenario.destruct()
  globalThis.document.body.innerHTML = ""
  scenario = await new Scenario(id)
  scenario.step(step)
}

void async function main() {
  const eventBus = new EventBus()
  eventBus.addEventListener(SCENARIO_START, newScenario)
}
