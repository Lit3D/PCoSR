import { EventBus } from "./event-bus/index.mjs"
import { Role } from "./role.mjs"
import { Master } from "./master.mjs"

const DEFAULT_CLASSES = document.body.className

async function newRole({ detail }) {
  document.body.innerHTML = ""
  document.body.className = DEFAULT_CLASSES
  new Role(detail, document.body)
}

void async function main() {
  const eventBus = new EventBus()
  eventBus.addEventListener(ROLE_START, newRole)
  eventBus.addEventListener(RELOAD, location.reload())

  if (eventBus.ID === "master") new Master(true)
}
