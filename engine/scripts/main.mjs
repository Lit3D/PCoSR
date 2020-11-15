import { Slave } from "./slave.mjs"
import { UUIDv4 } from "./uuid.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
document.title += ` - ${ID}`

const CFG_ID = `ss-client-${ID}`
const SS_CONFIG_URL = `/assets/${CFG_ID}.json`

document.body.classList.add(`sw--${window.screen.width}`)
document.body.classList.add(CFG_ID)

void async function line() {
  const response = await fetch(SS_CONFIG_URL)
  const { slaves } = await response.json()
  for (let { id, wrapper, ...options } of slaves) {
    if (slaves.length > 1) options = {...options, root: document.body.appendChild(document.createElement("div")) }
    await new Slave(id, options)
  }
}().catch(err => {
  console.error(err)
  document.body.innerHTML = `<div class="error">GLOBAL ERROR: ${err}</div>`
})
