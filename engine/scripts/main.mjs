import { UUIDv4 } from "./uuid.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
const APP_MODULE = `./components/ss-app-${ID}/index.mjs`
document.title += ` - ${ID}`
document.body.classList.add(`sw--${window.screen.width}`)

void async function main() {
  const { default: SSAppComponent } = await import(APP_MODULE)
  document.body.appendChild(new SSAppComponent())
}().catch(err => {
  console.error(err)
  document.body.innerHTML = `<div class="error">MAIN ERROR: ${err}</div>`
})

const MASTER = new URLSearchParams(window.location.search).has("master")
void async function master() {
  if (!MASTER) return
  const { Master } = await import("./master.mjs")
  const master = await new Master()
  window.addEventListener("unload", async () => await master.release())
}().catch(err => {
  console.error(err)
  document.body.innerHTML = `<div class="error">MASTER ERROR: ${err}</div>`
})