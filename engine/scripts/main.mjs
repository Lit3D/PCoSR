import { Slave } from "./slave.mjs"
import { UUIDv4 } from "./uuid.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
document.title += ` - ${ID}`

void async function main() {
  await new Slave(ID)
}().catch(err => document.body.innerHTML = `<div class="error">GLOBAL ERROR: ${err}</div>`)
