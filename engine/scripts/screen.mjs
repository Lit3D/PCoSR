
import { EventBus } from "./event-bus/index.mjs"
import { Scenario } from "./scenario.mjs"
import ID from "./id.mjs"

globalThis.document.title += ` - ${ID}`
EventBus.ID = ID

async function newScenario({ detail: { id = "main", step = 0 } = {} }) {
  globalThis.document.body.innerHTML = ""
  const scenario = await new Scenario(id, globalThis.document.body)
  scenario.step(step)
}

void async function main() {
  const eventBus = new EventBus()
  eventBus.addEventListener(SCENARIO_START, newScenario)
  eventBus.addEventListener(RELOAD, globalThis.location.reload())
}
