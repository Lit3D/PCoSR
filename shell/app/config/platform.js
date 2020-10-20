const { arch, cpus, hostname, platform, type, release, totalmem, networkInterfaces }  = require("os")

const GetNetworks = () =>
  Object.entries(networkInterfaces())
        .flatMap(([name, obj]) => obj ? obj.map(v => ({...v, name})) : [])
        .filter(({internal}) => !internal)
        .map(({mac, internal, ...obj}) => ({...obj, mac: mac.replace(/[^0-9a-f]+/ig,"").toLowerCase()}))

const ARCH = arch()
const CPUS = cpus().map(({model}) => model)
const HOSTNAME = hostname()
const NETWORKS = GetNetworks()
const MACS = NETWORKS.map(({mac}) => mac).filter((v, i, arr) => arr.indexOf(v) === i)
const IPv4 = NETWORKS.filter(({family}) => family === "IPv4").map(({address}) => address).filter((v, i, arr) => arr.indexOf(v) === i)
const IPv6 = NETWORKS.filter(({family}) => family === "IPv6").map(({address}) => address).filter((v, i, arr) => arr.indexOf(v) === i)
const OS = `${type()} ${release()}`
const PLATFORM = platform()
const RAM = totalmem()

const [,,ENGINE_HOST] = /^\s*(https?:\/\/)?([^\/]{3,}).*$/i.exec(process.argv[1] || "") || ["","","localhost"]
const ENGINE_URL = `https://${ENGINE_HOST}/engine/index.html`

module.exports = { ARCH, CPUS, HOSTNAME, MACS, IPv4, IPv6, NETWORKS, OS, PLATFORM, RAM, ENGINE_HOST, ENGINE_URL }
