const { screen } = require("electron")
const path = require("path")

const { MACS, IPv4, IPv6, HOSTNAME, ENGINE_URL } = require("./platform.js")

class Config {
  static GetDisplays = () =>
    screen.getAllDisplays()
          .sort(({bounds: {x: a}}, {bounds: {x: b}}) => a - b)
          .map(({bounds}, i) => ({...bounds, id: i + 1 }))

  static GetFileConfig = () => {
    const { dir, name } = path.parse(process.argv[0])
    const cfgPath = path.resolve(dir, name + ".json")
    try {
      return require(cfgPath)
    } catch (err) {
      console.error(err)
      return undefined
    }
  }

  static GetConfig = () => {
    const config = this.GetFileConfig() ?? {
      id: HOSTNAME,
      viewPorts: this.GetDisplays().map(({ id, x, y, width, height }) => ({
        id, x, y, width, height,
        fullscreen: true,
      }))
    }
    return {...config, mac: MACS[0], IPv4: IPv4[0], IPv6: IPv6[0], hostname: HOSTNAME, engine: ENGINE_URL }
  }

  constructor() { throw new Error("Unconstructable class") }
}

module.exports = { Config }