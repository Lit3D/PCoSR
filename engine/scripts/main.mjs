import { Slave } from "./slave.mjs"
import { UUIDv4 } from "./uuid.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
document.title += ` - ${ID}`

// Add body class
document.body.classList.add(`sw--${window.screen.width}`)

void async function line() {
  await new Slave(ID)
}().catch(err => document.body.innerHTML = `<div class="error">GLOBAL ERROR: ${err}</div>`)
