import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

/* ────────────────────────────────────────────────────────────
   O MOSTEIRO — ilha flutuante onde cada monge é uma automação.
   O pipeline é de verdade:
     sino (cron) → templo (IA) → biblioteca (dados) → pombal (WhatsApp)
   e todo mundo passa pela lanterna do centro (a fila).
   ──────────────────────────────────────────────────────────── */

export type MonkMode = "auto" | "wait" | "meditate"
export type NodeKey = "B" | "T" | "L" | "P" | "J"

export type Selection =
  | { kind: "monk"; id: number; name: string; mode: MonkMode }
  | { kind: "building"; key: NodeKey; title: string; action: string }

export interface LogLine {
  id: number
  text: string
  tone: "info" | "warn" | "ok"
}

export interface Stats {
  total: number
  healthy: number
  sent: number
  records: number
}

export interface EngineCallbacks {
  onSelect: (s: Selection | null) => void
  onStats: (s: Stats) => void
  onLog: (line: LogLine) => void
  onVinyl: () => void
  onHint?: () => void
}

export interface OverlayEls {
  box: HTMLDivElement
  label: HTMLDivElement
  toolbar: HTMLDivElement
}

const W = 18
const D = 12
const PX = 100
const MAX_MONKS = 16

/* nós do grafo: portas dos prédios + o hub (lanterna) */
const NODES: Record<NodeKey, THREE.Vector2> = {
  B: new THREE.Vector2(-4.9, -1.4),
  T: new THREE.Vector2(0, -0.7),
  L: new THREE.Vector2(3.9, -0.3),
  P: new THREE.Vector2(3.2, 2.5),
  J: new THREE.Vector2(0.2, 1.2),
}

const BUILDINGS: Record<Exclude<NodeKey, "J">, { title: string; tech: string; action: string }> & {
  J: { title: string; tech: string; action: string }
} = {
  B: { title: "sino", tech: "agendador (cron)", action: "Tocar o sino" },
  T: { title: "templo", tech: "agente de IA", action: "Processar fila" },
  L: { title: "biblioteca", tech: "PostgreSQL", action: "Consultar" },
  P: { title: "pombal", tech: "WhatsApp API", action: "Soltar um pombo" },
  J: { title: "lanterna", tech: "fila de mensagens", action: "Ver a fila" },
}

const AUTOMATIONS: { name: string; route: Exclude<NodeKey, "J">[]; robe: string }[] = [
  { name: "lembrete-d1", route: ["B", "T", "P"], robe: "#e0892f" },
  { name: "confirmacao", route: ["T", "P"], robe: "#c9662c" },
  { name: "cobranca-pix", route: ["T", "L", "P"], robe: "#8e3b2f" },
  { name: "agente-ia", route: ["P", "T", "P"], robe: "#e0892f" },
  { name: "lista-de-espera", route: ["L", "T", "P"], robe: "#b9772f" },
  { name: "reativacao", route: ["L", "P"], robe: "#c9662c" },
  { name: "relatorio-semanal", route: ["B", "L", "T"], robe: "#8e3b2f" },
  { name: "etl-dados", route: ["T", "L"], robe: "#e0892f" },
]

const SKIN = ["#8d5a3b", "#c08a5f", "#6b4329", "#e0b48c", "#a86d45"]

/* ── utils ─────────────────────────────────────────── */
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
function angleLerp(a: number, b: number, t: number) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

/* ── textura pintada: musgo, pátio de areia rastelada, caminhos de pedra, lago ── */
function paintGround(): HTMLCanvasElement {
  const cw = W * PX
  const ch = D * PX
  const c = document.createElement("canvas")
  c.width = cw
  c.height = ch
  const g = c.getContext("2d")!
  const rnd = mulberry32(11)
  const P = (x: number, z: number): [number, number] => [(x + W / 2) * PX, (z + D / 2) * PX]

  // borda rasgada
  const x0 = 80, x1 = cw - 80, y0 = 70, y1 = ch - 70
  const pts: [number, number][] = []
  const jag = (i: number) => Math.sin(i * 0.19) * 6 + Math.sin(i * 0.047) * 10 + (rnd() - 0.5) * 8
  let i = 0
  for (let x = x0; x <= x1; x += 7) pts.push([x, y0 + jag(i++)])
  for (let y = y0; y <= y1; y += 7) pts.push([x1 + jag(i++), y])
  for (let x = x1; x >= x0; x -= 7) pts.push([x, y1 + jag(i++)])
  for (let y = y1; y >= y0; y -= 7) pts.push([x0 + jag(i++), y])
  g.lineCap = "round"
  const fringe = ["#c3d38c", "#aec27a", "#e8e3c8", "#98b465"]
  for (const [px, py] of pts) {
    for (let k = 0; k < 3; k++) {
      const a = rnd() * Math.PI * 2
      const l = 4 + rnd() * 10
      g.strokeStyle = fringe[(rnd() * fringe.length) | 0]
      g.globalAlpha = 0.5 + rnd() * 0.4
      g.lineWidth = 1.5 + rnd() * 2
      g.beginPath()
      g.moveTo(px, py)
      g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l)
      g.stroke()
    }
  }
  g.globalAlpha = 1
  g.beginPath()
  pts.forEach(([px, py], k) => (k ? g.lineTo(px, py) : g.moveTo(px, py)))
  g.closePath()
  g.fillStyle = "#a3bd66"
  g.fill()
  g.globalCompositeOperation = "source-atop"

  // manchas de musgo
  const moss = ["#9bb75c", "#adc672", "#8dac52", "#b6cc7c"]
  for (let k = 0; k < 90; k++) {
    const [px, py] = [rnd() * cw, rnd() * ch]
    const r = 40 + rnd() * 140
    const grd = g.createRadialGradient(px, py, 0, px, py, r)
    const col = moss[(rnd() * moss.length) | 0]
    grd.addColorStop(0, col)
    grd.addColorStop(1, col + "00")
    g.fillStyle = grd
    g.beginPath()
    g.arc(px, py, r, 0, Math.PI * 2)
    g.fill()
  }

  // pátio de areia rastelada em volta do templo
  const [sx, sy] = P(-3.2, -4.3)
  const [ex, ey] = P(3.2, 0.3)
  g.save()
  g.beginPath()
  g.roundRect(sx, sy, ex - sx, ey - sy, 60)
  g.fillStyle = "#e9dec5"
  g.fill()
  g.clip()
  g.strokeStyle = "rgba(160,135,95,0.22)"
  g.lineWidth = 2
  for (let y = sy + 10; y < ey; y += 13) {
    g.beginPath()
    for (let x = sx; x <= ex; x += 10) {
      const yy = y + Math.sin(x * 0.012) * 3
      if (x === sx) g.moveTo(x, yy)
      else g.lineTo(x, yy)
    }
    g.stroke()
  }
  // círculos rastelados em volta das pedras
  ;[[-2.2, -3.4], [2.3, -3.6], [2.2, -0.4]].forEach(([x, z]) => {
    const [cx, cy] = P(x, z)
    for (let r = 30; r < 90; r += 13) {
      g.fillStyle = "#e9dec5"
      g.beginPath()
      g.arc(cx, cy, r + 6, 0, Math.PI * 2)
      g.fill()
    }
    for (let r = 30; r < 90; r += 13) {
      g.beginPath()
      g.arc(cx, cy, r, 0, Math.PI * 2)
      g.stroke()
    }
  })
  g.restore()
  g.strokeStyle = "rgba(120,100,70,0.25)"
  g.lineWidth = 3
  g.beginPath()
  g.roundRect(sx, sy, ex - sx, ey - sy, 60)
  g.stroke()

  // caminhos de pedra: de cada porta até a lanterna
  const stones = (a: THREE.Vector2, b: THREE.Vector2) => {
    const len = a.distanceTo(b)
    const n = Math.max(3, Math.round(len / 0.32))
    for (let k = 0; k <= n; k++) {
      const t = k / n
      const x = lerp(a.x, b.x, t) + (rnd() - 0.5) * 0.08
      const z = lerp(a.y, b.y, t) + (rnd() - 0.5) * 0.08
      const [px, py] = P(x, z)
      g.fillStyle = "rgba(90,80,60,0.18)"
      g.beginPath()
      g.ellipse(px + 2, py + 3, 15, 11, rnd() * 3, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = ["#d9d2c3", "#cfc7b6", "#e2dccf"][(rnd() * 3) | 0]
      g.beginPath()
      g.ellipse(px, py, 14, 10, rnd() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  ;(["B", "T", "L", "P"] as NodeKey[]).forEach((k) => stones(NODES[k], NODES.J))
  // círculo de pedra do hub
  {
    const [cx, cy] = P(NODES.J.x, NODES.J.y)
    g.fillStyle = "#d6cfbf"
    g.beginPath()
    g.arc(cx, cy, 62, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = "rgba(110,95,70,0.3)"
    g.lineWidth = 3
    g.stroke()
  }

  // lago com borda de pedrinhas
  {
    const [cx, cy] = P(-4.3, 2.7)
    g.fillStyle = "#cfc7b6"
    g.beginPath()
    g.ellipse(cx, cy, 190, 118, -0.15, 0, Math.PI * 2)
    g.fill()
    const water = g.createRadialGradient(cx - 30, cy - 20, 10, cx, cy, 180)
    water.addColorStop(0, "#7cc0dc")
    water.addColorStop(1, "#3f86b3")
    g.fillStyle = water
    g.beginPath()
    g.ellipse(cx, cy, 172, 102, -0.15, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = "rgba(255,255,255,0.4)"
    g.lineWidth = 2
    for (let k = 0; k < 5; k++) {
      g.beginPath()
      g.ellipse(cx - 40 + k * 22, cy - 30 + k * 14, 30 + k * 6, 6, -0.15, 0, Math.PI)
      g.stroke()
    }
    // vitórias-régias
    for (let k = 0; k < 6; k++) {
      const a = rnd() * Math.PI * 2
      const r = 40 + rnd() * 90
      g.fillStyle = "#6fa44a"
      g.beginPath()
      g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.55, 10 + rnd() * 6, 0.3, Math.PI * 2 - 0.3)
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.55)
      g.fill()
    }
  }

  // folhas de bordo caídas e florzinhas
  const leaves = ["#e0703a", "#d9542f", "#f0a04b", "#c94a3a", "#f3c35c"]
  for (let k = 0; k < 1500; k++) {
    const [px, py] = [rnd() * cw, rnd() * ch]
    g.fillStyle = leaves[(rnd() * leaves.length) | 0]
    g.globalAlpha = 0.75
    g.beginPath()
    g.ellipse(px, py, 2 + rnd() * 2.5, 1.2 + rnd() * 1.4, rnd() * 3, 0, Math.PI * 2)
    g.fill()
  }
  for (let k = 0; k < 9000; k++) {
    const px = rnd() * cw
    const py = rnd() * ch
    const a = -1.2 + rnd() * 0.6
    const l = 3 + rnd() * 6
    g.globalAlpha = 1
    g.strokeStyle = rnd() > 0.5 ? "rgba(255,255,220,0.10)" : "rgba(40,60,10,0.09)"
    g.lineWidth = 1 + rnd()
    g.beginPath()
    g.moveTo(px, py)
    g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l)
    g.stroke()
  }
  g.globalAlpha = 1

  const grd = g.createRadialGradient(cw / 2, ch / 2, ch * 0.3, cw / 2, ch / 2, cw * 0.62)
  grd.addColorStop(0, "rgba(0,0,0,0)")
  grd.addColorStop(1, "rgba(60,50,20,0.14)")
  g.fillStyle = grd
  g.fillRect(0, 0, cw, ch)
  g.globalCompositeOperation = "source-over"
  return c
}

function softShadowTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")!
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  grd.addColorStop(0, "rgba(60,45,20,0.35)")
  grd.addColorStop(1, "rgba(60,45,20,0)")
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

/* ── tipos internos ─────────────────────────────────── */
interface Monk {
  id: number
  name: string
  route: Exclude<NodeKey, "J">[]
  root: THREE.Group
  body: THREE.Group
  scroll: THREE.Mesh
  mode: MonkMode
  path: THREE.Vector2[]
  pathNodes: (NodeKey | null)[]
  step: number
  routeIdx: number
  dwell: number
  heading: number
  phase: number
  offset: number
  runs: number
  speedBoost: number
  spawn: number
  dying: number
}

interface Puff {
  meshes: THREE.Mesh[]
  vel: THREE.Vector3[]
  t: number
  mat: THREE.MeshStandardMaterial
}

interface Pigeon {
  grp: THREE.Group
  wings: THREE.Mesh[]
  from: THREE.Vector3
  dir: THREE.Vector3
  t: number
}

interface Ring {
  mesh: THREE.Mesh
  t: number
  mat: THREE.MeshBasicMaterial
}

export class MonasteryEngine {
  private container: HTMLElement
  private overlay: OverlayEls
  private cb: EngineCallbacks
  private reduced: boolean

  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private world = new THREE.Group()
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private visible = true

  private monks: Monk[] = []
  private puffs: Puff[] = []
  private pigeons: Pigeon[] = []
  private rings: Ring[] = []
  private clouds: THREE.Group[] = []
  private koi: THREE.Mesh[] = []
  private buildings: Partial<Record<NodeKey, THREE.Group>> = {}
  private bellPivot!: THREE.Group
  private bellSwing = 0
  private templeGlow!: THREE.MeshStandardMaterial
  private templePulse = 0
  private lanternMat!: THREE.MeshStandardMaterial
  private lanternPulse = 0
  private books: THREE.Mesh[] = []
  private bookBounce = 0
  private vinyl!: THREE.Mesh
  private pickables: THREE.Object3D[] = []

  private selMonk: Monk | null = null
  private selBuilding: NodeKey | null = null
  private hovered: THREE.Object3D | null = null
  private nextId = 1
  private logId = 1
  private lastAutoLog = 0
  private pendingRespawn = 0
  private dupCount: Record<string, number> = {}
  private sent = 0
  private records = 0

  private mouse = new THREE.Vector2(0, 0)
  private mouseSmooth = new THREE.Vector2(0, 0)
  private scroll = 0
  private camDist = 1
  private ray = new THREE.Raycaster()
  private downAt: { x: number; y: number } | null = null
  private ro: ResizeObserver
  private interacted = false
  public toolbarHover = false

  private geo = {
    sphere: new THREE.SphereGeometry(1, 20, 14),
    robe: new THREE.CylinderGeometry(0.12, 0.25, 0.5, 18),
    sash: new THREE.CylinderGeometry(0.155, 0.17, 0.05, 18),
    scroll: new THREE.CylinderGeometry(0.035, 0.035, 0.24, 10),
  }
  private mat = {
    eye: new THREE.MeshStandardMaterial({ color: "#1d1712", roughness: 0.4 }),
    scroll: new THREE.MeshStandardMaterial({ color: "#f6ecd2", roughness: 0.6, emissive: "#ffcf6b", emissiveIntensity: 0 }),
    stone: new THREE.MeshStandardMaterial({ color: "#d8d0c0", roughness: 0.95 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: "#b9b09d", roughness: 0.95 }),
    wood: new THREE.MeshStandardMaterial({ color: "#8a5a3b", roughness: 0.85 }),
    cream: new THREE.MeshStandardMaterial({ color: "#f3ead8", roughness: 0.9 }),
    teal: new THREE.MeshStandardMaterial({ color: "#2f4a4a", roughness: 0.75 }),
    terracotta: new THREE.MeshStandardMaterial({ color: "#b5552e", roughness: 0.8 }),
    red: new THREE.MeshStandardMaterial({ color: "#b5402e", roughness: 0.75 }),
    gold: new THREE.MeshStandardMaterial({ color: "#d9a93f", roughness: 0.35, metalness: 0.5 }),
    white: new THREE.MeshStandardMaterial({ color: "#f7f3ea", roughness: 0.9 }),
    puff: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, transparent: true }),
    hover: new THREE.MeshStandardMaterial({ color: "#ffffff" }),
  }

  constructor(container: HTMLElement, overlay: OverlayEls, cb: EngineCallbacks, opts: { reducedMotion: boolean }) {
    this.container = container
    this.overlay = overlay
    this.cb = cb
    this.reduced = opts.reducedMotion

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.style.touchAction = "pan-y"
    this.renderer.domElement.style.display = "block"
    container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 140)

    this.buildLights()
    this.buildIsland()
    this.buildTemple()
    this.buildBell()
    this.buildLibrary()
    this.buildLoft()
    this.buildLantern()
    this.buildNature()
    this.buildVinyl()
    this.scene.add(this.world)

    AUTOMATIONS.forEach((a, k) => this.addMonk(a.name, a.route, a.robe, false, k))
    this.emitStats()

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.resize()

    const el = this.renderer.domElement
    el.addEventListener("pointermove", this.onPointerMove)
    el.addEventListener("pointerdown", this.onPointerDown)
    el.addEventListener("pointerup", this.onPointerUp)
    el.addEventListener("pointerleave", this.onPointerLeave)
  }

  /* ── cena ── */
  private mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent?: THREE.Object3D) {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    ;(parent ?? this.world).add(m)
    return m
  }

  /** telhado em pirâmide (cone de 4 lados girado 45°) */
  private roof(w: number, d: number, h: number, mat: THREE.Material) {
    const geo = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1)
    geo.rotateY(Math.PI / 4)
    const m = new THREE.Mesh(geo, mat)
    m.scale.set(w, h, d)
    m.castShadow = true
    return m
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight("#fff6e6", "#8a7a52", 1.25))
    const sun = new THREE.DirectionalLight("#fff0d2", 2.3)
    sun.position.set(-7, 14, 7)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -12
    sun.shadow.camera.right = 12
    sun.shadow.camera.top = 10
    sun.shadow.camera.bottom = -10
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 40
    sun.shadow.bias = -0.0005
    sun.shadow.normalBias = 0.02
    sun.shadow.radius = 6
    this.scene.add(sun)
    const fill = new THREE.DirectionalLight("#dfe8ff", 0.45)
    fill.position.set(8, 6, -4)
    this.scene.add(fill)
  }

  private buildIsland() {
    const tex = new THREE.CanvasTexture(paintGround())
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D),
      new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.04 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0.01
    ground.receiveShadow = true
    this.world.add(ground)

    // a ilha flutua: camadas de terra embaixo
    const earth = new THREE.Mesh(
      new RoundedBoxGeometry(W - 1.75, 0.9, D - 1.45, 4, 0.3),
      new THREE.MeshStandardMaterial({ color: "#b8875a", roughness: 1 })
    )
    earth.position.y = -0.5
    earth.receiveShadow = true
    this.world.add(earth)
    const deep = new THREE.Mesh(
      new RoundedBoxGeometry(W - 3.2, 0.8, D - 2.9, 4, 0.35),
      new THREE.MeshStandardMaterial({ color: "#8f6544", roughness: 1 })
    )
    deep.position.y = -1.1
    this.world.add(deep)

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 1.15, D * 1.25),
      new THREE.MeshBasicMaterial({ map: softShadowTexture(), transparent: true, depthWrite: false })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -2.6
    this.world.add(shadow)
  }

  private tag(grp: THREE.Group, key: NodeKey) {
    grp.traverse((o) => (o.userData.building = key))
    this.buildings[key] = grp
    this.pickables.push(grp)
    this.world.add(grp)
  }

  private buildTemple() {
    const g = new THREE.Group()
    this.mesh(new RoundedBoxGeometry(3.4, 0.3, 2.3, 2, 0.06), this.mat.stone, 0, 0.15, 0, g)
    this.mesh(new RoundedBoxGeometry(3.0, 0.16, 1.95, 2, 0.05), this.mat.stoneDark, 0, 0.36, 0, g)
    this.mesh(new THREE.BoxGeometry(2.4, 1.0, 1.45), this.mat.cream, 0, 0.94, 0, g)
    // pilares vermelhos na frente
    const pillar = new THREE.CylinderGeometry(0.07, 0.07, 1.05, 10)
    ;[-1.05, -0.4, 0.4, 1.05].forEach((x) => this.mesh(pillar, this.mat.red, x, 0.94, 0.8, g))
    // porta iluminada
    this.templeGlow = new THREE.MeshStandardMaterial({ color: "#3a2a1c", emissive: "#ffb347", emissiveIntensity: 0.15, roughness: 0.6 })
    this.mesh(new THREE.BoxGeometry(0.6, 0.7, 0.05), this.templeGlow, 0, 0.8, 0.74, g)
    const r1 = this.roof(3.6, 2.5, 0.75, this.mat.teal)
    r1.position.y = 1.8
    g.add(r1)
    this.mesh(new THREE.BoxGeometry(1.3, 0.35, 0.9), this.mat.cream, 0, 2.15, 0, g)
    const r2 = this.roof(1.9, 1.4, 0.6, this.mat.teal)
    r2.position.y = 2.6
    g.add(r2)
    const fin = this.mesh(this.geo.sphere, this.mat.gold, 0, 2.95, 0, g)
    fin.scale.setScalar(0.09)
    g.position.set(0, 0, -2.2)
    this.tag(g, "T")
  }

  private buildBell() {
    const g = new THREE.Group()
    this.mesh(new RoundedBoxGeometry(1.1, 0.22, 1.1, 2, 0.05), this.mat.stone, 0, 0.11, 0, g)
    const post = new THREE.CylinderGeometry(0.06, 0.07, 1.7, 8)
    ;[
      [-0.4, -0.4],
      [0.4, -0.4],
      [-0.4, 0.4],
      [0.4, 0.4],
    ].forEach(([x, z]) => this.mesh(post, this.mat.wood, x, 1.05, z, g))
    this.mesh(new THREE.BoxGeometry(1.0, 0.08, 0.12), this.mat.wood, 0, 1.85, 0, g)
    const roof = this.roof(1.25, 1.25, 0.5, this.mat.teal)
    roof.position.y = 2.3
    g.add(roof)
    this.bellPivot = new THREE.Group()
    this.bellPivot.position.y = 1.82
    g.add(this.bellPivot)
    const bell = this.mesh(new THREE.CylinderGeometry(0.13, 0.27, 0.42, 22), this.mat.gold, 0, -0.32, 0, this.bellPivot)
    bell.castShadow = true
    const cap = this.mesh(this.geo.sphere, this.mat.gold, 0, -0.1, 0, this.bellPivot)
    cap.scale.set(0.14, 0.09, 0.14)
    g.position.set(-5.7, 0, -2.6)
    this.tag(g, "B")
  }

  private buildLibrary() {
    const g = new THREE.Group()
    this.mesh(new RoundedBoxGeometry(2.5, 0.2, 1.7, 2, 0.05), this.mat.stone, 0, 0.1, 0, g)
    this.mesh(new THREE.BoxGeometry(2.2, 1.1, 1.35), new THREE.MeshStandardMaterial({ color: "#c98f5a", roughness: 0.85 }), 0, 0.75, 0, g)
    const win = new THREE.MeshStandardMaterial({ color: "#5a3a1c", emissive: "#ffcf6b", emissiveIntensity: 0.35 })
    ;[-0.6, 0, 0.6].forEach((x) => this.mesh(new THREE.BoxGeometry(0.32, 0.38, 0.04), win, x, 0.85, 0.69, g))
    const roof = this.roof(2.7, 1.8, 0.7, this.mat.terracotta)
    roof.position.y = 1.65
    g.add(roof)
    // pilha de pergaminhos (cresce com os registros)
    for (let k = 0; k < 10; k++) {
      const b = this.mesh(this.geo.scroll, this.mat.scroll, 1.45 + (k % 2) * 0.09, 0.08 + Math.floor(k / 2) * 0.075, 0.45 - (k % 3) * 0.08, g)
      b.rotation.z = Math.PI / 2
      b.visible = k < 3
      this.books.push(b)
    }
    g.position.set(5.4, 0, -1.6)
    this.tag(g, "L")
  }

  private buildLoft() {
    const g = new THREE.Group()
    this.mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.1, 8), this.mat.wood, 0, 0.55, 0, g)
    this.mesh(new RoundedBoxGeometry(0.85, 0.55, 0.7, 2, 0.05), this.mat.white, 0, 1.35, 0, g)
    const holes = new THREE.MeshStandardMaterial({ color: "#2b2118" })
    ;[-0.2, 0.2].forEach((x) => {
      const h = this.mesh(new THREE.CircleGeometry(0.09, 16), holes, x, 1.38, 0.352, g)
      h.castShadow = false
    })
    const roof = this.roof(1.1, 0.95, 0.5, this.mat.red)
    roof.position.y = 1.87
    g.add(roof)
    // pombos no telhado
    ;[-0.18, 0.2].forEach((x, k) => {
      const p = this.makePigeon()
      p.grp.position.set(x, 2.02, 0.05 * k)
      p.grp.rotation.y = k ? -0.6 : 0.8
      g.add(p.grp)
    })
    g.position.set(4.6, 0, 3.3)
    this.tag(g, "P")
  }

  private buildLantern() {
    const g = new THREE.Group()
    this.mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.16, 8), this.mat.stone, 0, 0.08, 0, g)
    this.mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.55, 8), this.mat.stone, 0, 0.42, 0, g)
    this.lanternMat = new THREE.MeshStandardMaterial({ color: "#fff1c9", emissive: "#ffc65a", emissiveIntensity: 0.7 })
    const light = this.mesh(new THREE.BoxGeometry(0.34, 0.3, 0.34), this.lanternMat, 0, 0.85, 0, g)
    light.castShadow = false
    const cap = this.roof(0.62, 0.62, 0.32, this.mat.stoneDark)
    cap.position.y = 1.15
    g.add(cap)
    const glow = new THREE.PointLight("#ffc65a", 0.8, 3.5, 2)
    glow.position.y = 0.85
    g.add(glow)
    g.position.set(NODES.J.x + 0.75, 0, NODES.J.y - 0.1)
    this.tag(g, "J")
  }

  private makeTree(colors: string[], scale: number) {
    const grp = new THREE.Group()
    this.mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.6, 8), this.mat.wood, 0, 0.3, 0, grp)
    const blobs: [number, number, number, number][] = [
      [0, 0.82, 0, 0.42],
      [0.28, 0.7, 0.08, 0.3],
      [-0.27, 0.72, -0.04, 0.32],
      [0.04, 0.7, -0.28, 0.3],
      [0.02, 1.06, 0.05, 0.3],
      [-0.1, 0.66, 0.27, 0.29],
    ]
    blobs.forEach(([x, y, z, r], k) => {
      const m = this.mesh(this.geo.sphere, new THREE.MeshStandardMaterial({ color: colors[k % colors.length], roughness: 0.85 }), x, y, z, grp)
      m.scale.setScalar(r)
    })
    grp.scale.setScalar(scale)
    return grp
  }

  private makePine(scale: number) {
    const grp = new THREE.Group()
    this.mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.4, 8), this.mat.wood, 0, 0.2, 0, grp)
    const mat = new THREE.MeshStandardMaterial({ color: "#4f7d4a", roughness: 0.9 })
    ;[
      [0.55, 0.5, 0.75],
      [0.43, 0.45, 1.05],
      [0.3, 0.38, 1.32],
    ].forEach(([r, h, y]) => this.mesh(new THREE.ConeGeometry(r, h, 10), mat, 0, y, 0, grp))
    grp.scale.setScalar(scale)
    return grp
  }

  private buildNature() {
    const maple = ["#e0703a", "#d9542f", "#f0a04b", "#e3823c"]
    const pink = ["#e98fb0", "#f1a7c2", "#de7aa0"]
    const trees: [number, number, "maple" | "pink" | "pine", number][] = [
      [-7.6, -4.4, "pine", 1.1],
      [-7.9, -2.4, "maple", 0.9],
      [-3.6, -4.8, "maple", 0.85],
      [3.6, -4.8, "pink", 0.9],
      [7.6, -4.4, "pine", 1.2],
      [7.9, 0.6, "maple", 1.0],
      [7.6, 4.5, "pine", 0.95],
      [-7.7, 4.4, "pink", 1.05],
      [-1.6, 4.9, "maple", 0.8],
      [1.9, 4.9, "pine", 0.8],
    ]
    trees.forEach(([x, z, kind, s]) => {
      const t = kind === "pine" ? this.makePine(s) : this.makeTree(kind === "pink" ? pink : maple, s)
      t.position.set(x, 0, z)
      t.rotation.y = x * 1.3
      this.world.add(t)
    })
    // pedras do jardim zen
    const rock = new THREE.IcosahedronGeometry(1, 1)
    ;[
      [-2.2, -3.4, 0.28],
      [2.3, -3.6, 0.22],
      [2.2, -0.4, 0.24],
      [-6.2, 1.6, 0.3],
      [-2.4, 3.5, 0.2],
    ].forEach(([x, z, s]) => {
      const m = this.mesh(rock, this.mat.stoneDark, x, s * 0.45, z)
      m.scale.set(s * 1.3, s, s)
      m.rotation.set(x, z, 0)
    })
    // arbustinhos
    const bush = new THREE.MeshStandardMaterial({ color: "#7aa64c", roughness: 0.9 })
    ;[
      [-3.4, -0.2],
      [3.3, 0.8],
      [-1.2, 2.4],
      [6.6, 2.1],
      [-6.4, -0.6],
    ].forEach(([x, z]) => {
      const m = this.mesh(this.geo.sphere, bush, x, 0.18, z)
      m.scale.set(0.32, 0.24, 0.3)
    })
    // carpas
    const koiMat = [
      new THREE.MeshStandardMaterial({ color: "#f07a2a", roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: "#e64a2e", roughness: 0.5 }),
    ]
    for (let k = 0; k < 3; k++) {
      const m = new THREE.Mesh(this.geo.sphere, koiMat[k])
      m.scale.set(0.07, 0.03, 0.17)
      this.world.add(m)
      this.koi.push(m)
    }
    // nuvens
    const mk = (s: number) => {
      const grp = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial({ color: "#fdfbff", roughness: 1, emissive: "#f1dccb", emissiveIntensity: 0.15 })
      ;[
        [0, 0, 0, 0.55],
        [0.6, -0.05, 0.1, 0.42],
        [-0.55, -0.08, 0, 0.4],
        [0.25, 0.3, -0.05, 0.4],
        [-0.2, 0.22, 0.15, 0.35],
      ].forEach(([x, y, z, r]) => {
        const m = new THREE.Mesh(this.geo.sphere, mat)
        m.position.set(x, y, z)
        m.scale.set(r, r * 0.85, r)
        m.castShadow = true
        grp.add(m)
      })
      grp.scale.setScalar(s)
      return grp
    }
    const a = mk(1)
    a.position.set(2.4, 4.0, -5.4)
    const b = mk(0.6)
    b.position.set(-3.4, 3.4, -4.4)
    this.clouds.push(a, b)
    this.world.add(a, b)
  }

  private buildVinyl() {
    const root = new THREE.Group()
    this.mesh(new RoundedBoxGeometry(0.7, 0.36, 0.7, 2, 0.04), new THREE.MeshStandardMaterial({ color: "#b98352", roughness: 0.85 }), 0, 0.18, 0, root)
    const disc = this.mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.03, 40),
      new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.35, metalness: 0.2 }),
      0,
      0.38,
      0,
      root
    )
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.034, 24), this.mat.gold)
    disc.add(label)
    root.position.set(-2.0, 0, 4.0)
    root.rotation.y = 0.4
    this.vinyl = disc
    root.traverse((o) => (o.userData.vinyl = true))
    this.pickables.push(root)
    this.world.add(root)
  }

  private makePigeon(): Pigeon {
    const grp = new THREE.Group()
    const body = new THREE.Mesh(this.geo.sphere, this.mat.white)
    body.scale.set(0.09, 0.08, 0.13)
    grp.add(body)
    const head = new THREE.Mesh(this.geo.sphere, this.mat.white)
    head.scale.setScalar(0.055)
    head.position.set(0, 0.07, 0.1)
    grp.add(head)
    const beak = new THREE.Mesh(this.geo.sphere, this.mat.gold)
    beak.scale.set(0.015, 0.015, 0.03)
    beak.position.set(0, 0.06, 0.16)
    grp.add(beak)
    const wings: THREE.Mesh[] = []
    ;[1, -1].forEach((s) => {
      const w = new THREE.Mesh(this.geo.sphere, this.mat.white)
      w.scale.set(0.12, 0.015, 0.07)
      w.position.set(0.09 * s, 0.03, 0)
      grp.add(w)
      wings.push(w)
    })
    grp.traverse((o) => (o.castShadow = true))
    return { grp, wings, from: new THREE.Vector3(), dir: new THREE.Vector3(), t: 0 }
  }

  /* ── monges ── */
  private addMonk(name: string, route: Exclude<NodeKey, "J">[], robe: string, animateIn: boolean, seed = 0) {
    const root = new THREE.Group()
    const body = new THREE.Group()
    root.add(body)
    const robeMat = new THREE.MeshStandardMaterial({ color: robe, roughness: 0.85 })
    this.mesh(this.geo.robe, robeMat, 0, 0.25, 0, body)
    this.mesh(this.geo.sash, new THREE.MeshStandardMaterial({ color: "#5a2a20", roughness: 0.8 }), 0, 0.36, 0, body)
    const skin = new THREE.MeshStandardMaterial({ color: SKIN[(seed + name.length) % SKIN.length], roughness: 0.7 })
    const head = this.mesh(this.geo.sphere, skin, 0, 0.61, 0, body)
    head.scale.setScalar(0.135)
    ;[1, -1].forEach((s) => {
      const e = this.mesh(this.geo.sphere, this.mat.eye, 0.045 * s, 0.63, 0.122, body)
      e.scale.setScalar(0.017)
    })
    const scroll = this.mesh(this.geo.scroll, this.mat.scroll.clone(), 0, 0.34, 0.24, body)
    scroll.rotation.z = Math.PI / 2

    const start = NODES[route[0]]
    const m: Monk = {
      id: this.nextId++,
      name,
      route,
      root,
      body,
      scroll,
      mode: "auto",
      path: [],
      pathNodes: [],
      step: 0,
      routeIdx: 0,
      dwell: animateIn ? 0.4 : 0.3 + seed * 0.9,
      heading: Math.random() * Math.PI * 2,
      phase: Math.random() * 10,
      offset: ((seed % 5) - 2) * 0.12,
      runs: 0,
      speedBoost: 1,
      spawn: animateIn ? 0 : 1,
      dying: -1,
    }
    root.position.set(start.x + m.offset, 0, start.y + m.offset * 0.5)
    root.scale.setScalar(animateIn ? 0.001 : 1.35)
    root.traverse((o) => (o.userData.monkId = m.id))
    this.world.add(root)
    this.pickables.push(root)
    this.monks.push(m)
    this.planNextLeg(m, true)
    return m
  }

  /** monta o próximo trecho: porta atual → lanterna → próxima porta */
  private planNextLeg(m: Monk, first = false) {
    if (!first) m.routeIdx = (m.routeIdx + 1) % m.route.length
    if (!first && m.routeIdx === 0) m.runs++
    const to = m.route[m.routeIdx]
    const here = new THREE.Vector2(m.root.position.x, m.root.position.z)
    const target = NODES[to].clone().add(new THREE.Vector2(m.offset, m.offset * 0.5))
    if (here.distanceTo(target) < 0.2) {
      m.path = [target]
      m.pathNodes = [to]
    } else {
      const hub = NODES.J.clone().add(new THREE.Vector2(m.offset * 0.8, -m.offset * 0.6))
      m.path = [hub, target]
      m.pathNodes = ["J", to]
    }
    m.step = 0
  }

  private arrive(m: Monk, node: NodeKey) {
    if (node === "J") {
      this.lanternPulse = 1
      return
    }
    m.dwell = 0.9
    if (node === "B") {
      this.bellSwing = 1
      this.spawnRing("B")
      m.scroll.visible = true
    } else if (node === "T") {
      this.templePulse = 1
      m.scroll.visible = true
      ;(m.scroll.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9
    } else if (node === "L") {
      this.addRecord()
    } else if (node === "P") {
      this.launchPigeon()
      this.sent++
      this.autoLog(`✓ ${m.name} → mensagem enviada no WhatsApp`, "ok")
      m.scroll.visible = false
      ;(m.scroll.material as THREE.MeshStandardMaterial).emissiveIntensity = 0
      this.emitStats()
    }
  }

  private addRecord() {
    this.records++
    this.bookBounce = 1
    const n = (this.records % 8) + 3
    this.books.forEach((b, k) => (b.visible = k < n))
    this.emitStats()
  }

  private launchPigeon() {
    const p = this.makePigeon()
    const loft = this.buildings.P!.position
    p.from.set(loft.x, 2.0, loft.z)
    const a = -0.4 + Math.random() * 1.6
    p.dir.set(Math.cos(a), 0, Math.sin(a)).normalize()
    p.grp.position.copy(p.from)
    this.world.add(p.grp)
    this.pigeons.push(p)
  }

  private spawnRing(key: NodeKey) {
    const mat = new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: 0.8, depthWrite: false })
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.025, 8, 40), mat)
    const b = this.buildings[key]!
    mesh.position.set(b.position.x, 1.55, b.position.z)
    mesh.rotation.x = Math.PI / 2
    this.world.add(mesh)
    this.rings.push({ mesh, t: 0, mat })
  }

  /* ── API pública ── */
  start() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    const loop = () => {
      if (!this.running) return
      this.raf = requestAnimationFrame(loop)
      if (!this.visible || document.hidden) return
      this.tick()
    }
    loop()
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  setVisible(v: boolean) {
    this.visible = v
    if (v) this.clock.getDelta()
  }

  setScroll(p: number) {
    this.scroll = clamp(p, 0, 1)
  }

  setMode(mode: "auto" | "meditate") {
    const m = this.selMonk
    if (!m) return
    m.mode = mode
    if (mode === "auto") {
      m.speedBoost = 1.8
      this.log(`▶ ${m.name} executando agora`, "info")
    } else this.log(`${m.name} meditando (pausada)`, "info")
    this.emitSelect()
  }

  duplicate() {
    const m = this.selMonk
    if (!m) return
    const alive = this.monks.filter((q) => q.dying < 0).length
    if (alive >= MAX_MONKS) {
      this.log(`limite: ${MAX_MONKS} monges. O mosteiro tem hora pra fechar.`, "warn")
      return
    }
    const base = m.name.replace(/-r\d+$/, "")
    this.dupCount[base] = (this.dupCount[base] || 1) + 1
    const robe = ((m.body.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.getStyle()
    const n = this.addMonk(`${base}-r${this.dupCount[base]}`, m.route, robe, true, this.nextId)
    n.root.position.copy(m.root.position).add(new THREE.Vector3(0.4, 0, 0.3))
    n.routeIdx = m.routeIdx
    this.planNextLeg(n, true)
    this.log(`scale ${base} → +1 monge (${n.name})`, "ok")
    this.emitStats()
  }

  remove() {
    const m = this.selMonk
    if (!m) return
    m.dying = 0
    this.spawnPuff(m.root.position)
    this.log(`kill ${m.name}`, "warn")
    this.deselect()
    const { name, route } = m
    const robe = ((m.body.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.getStyle()
    this.pendingRespawn++
    this.emitStats()
    window.setTimeout(() => this.log(`↻ reiniciando ${name}…`, "info"), 700)
    const t0 = performance.now()
    window.setTimeout(() => {
      this.pendingRespawn--
      const n = this.addMonk(name, route, robe, true, this.nextId)
      n.root.position.set(NODES.T.x, 0, NODES.T.y + 0.3)
      this.planNextLeg(n, true)
      this.log(`✓ ${name} de volta — self-healed em ${((performance.now() - t0) / 1000).toFixed(1)}s`, "ok")
      this.emitStats()
    }, 2300)
  }

  triggerBuilding() {
    const key = this.selBuilding
    if (!key) return
    if (key === "B") {
      this.bellSwing = 1
      this.spawnRing("B")
      const woke = this.monks.filter((m) => m.route[0] === "B" && m.dying < 0)
      woke.forEach((m) => (m.speedBoost = 1.8))
      this.log(`⏰ cron disparou: ${woke.length} automações acordadas`, "info")
    } else if (key === "T") {
      this.templePulse = 1
      this.log("agente de IA leu 3 mensagens e respondeu 2 sozinho", "ok")
    } else if (key === "L") {
      this.addRecord()
      this.log(`SELECT count(*) FROM agendamentos → ${this.records + 37} (${8 + ((Math.random() * 9) | 0)}ms)`, "info")
    } else if (key === "P") {
      this.launchPigeon()
      this.sent++
      this.emitStats()
      this.log("🕊 pombo solto: mensagem enviada no WhatsApp", "ok")
    } else if (key === "J") {
      this.lanternPulse = 1
      const moving = this.monks.filter((m) => m.dying < 0 && m.dwell <= 0 && m.mode === "auto").length
      this.log(`fila: ${moving} mensagens em trânsito, 0 perdidas`, "info")
    }
  }

  deselect() {
    if (this.selMonk && this.selMonk.mode === "wait") this.selMonk.mode = "auto"
    this.selMonk = null
    this.selBuilding = null
    this.cb.onSelect(null)
    this.hideOverlay()
  }

  dispose() {
    this.stop()
    this.ro.disconnect()
    const el = this.renderer.domElement
    el.removeEventListener("pointermove", this.onPointerMove)
    el.removeEventListener("pointerdown", this.onPointerDown)
    el.removeEventListener("pointerup", this.onPointerUp)
    el.removeEventListener("pointerleave", this.onPointerLeave)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.geometry?.dispose()
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        mats.forEach((mm) => {
          ;(mm as THREE.MeshStandardMaterial).map?.dispose()
          mm.dispose()
        })
      }
    })
    this.renderer.dispose()
    el.remove()
  }

  /* ── internos ── */
  private log(text: string, tone: LogLine["tone"]) {
    this.cb.onLog({ id: this.logId++, text, tone })
  }

  private autoLog(text: string, tone: LogLine["tone"]) {
    const now = performance.now()
    if (now - this.lastAutoLog < 2600) return
    this.lastAutoLog = now
    this.log(text, tone)
  }

  private emitStats() {
    const alive = this.monks.filter((s) => s.dying < 0)
    this.cb.onStats({
      total: alive.length + this.pendingRespawn,
      healthy: alive.filter((s) => s.spawn >= 1).length,
      sent: this.sent,
      records: this.records,
    })
  }

  private statusText(m: Monk) {
    if (m.mode === "meditate") return "meditando"
    if (m.mode === "wait") return "aguardando comando"
    return m.dwell > 0 ? "trabalhando" : "a caminho"
  }

  private emitSelect() {
    if (this.selMonk) {
      const m = this.selMonk
      this.cb.onSelect({ kind: "monk", id: m.id, name: m.name, mode: m.mode })
    } else if (this.selBuilding) {
      const b = BUILDINGS[this.selBuilding]
      this.cb.onSelect({ kind: "building", key: this.selBuilding, title: b.title, action: b.action })
    } else this.cb.onSelect(null)
  }

  private resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.renderer.domElement.style.width = w + "px"
    this.renderer.domElement.style.height = h + "px"
    this.camera.aspect = w / h
    const portrait = this.camera.aspect < 0.95
    this.world.rotation.y = portrait ? -Math.PI / 2 : 0
    this.camDist = portrait ? clamp(1.3 / this.camera.aspect, 1, 2.7) : clamp(1.95 / this.camera.aspect, 1, 2.7)
    this.camera.updateProjectionMatrix()
  }

  private onPointerMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect()
    this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    if (e.pointerType === "mouse") this.setHover(this.pick())
  }
  private onPointerLeave = () => this.setHover(null)
  private onPointerDown = (e: PointerEvent) => {
    this.downAt = { x: e.clientX, y: e.clientY }
  }
  private onPointerUp = (e: PointerEvent) => {
    if (!this.downAt) return
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y)
    this.downAt = null
    if (moved > 8) return
    const r = this.renderer.domElement.getBoundingClientRect()
    this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    const hit = this.pick()
    if (!hit) {
      this.deselect()
      return
    }
    if (hit.userData.vinyl) {
      this.log("lado B encontrado. tocando…", "ok")
      this.cb.onVinyl()
      return
    }
    if (this.selMonk && this.selMonk.mode === "wait") this.selMonk.mode = "auto"
    this.selMonk = null
    this.selBuilding = null
    if (hit.userData.monkId) {
      const m = this.monks.find((q) => q.id === hit.userData.monkId && q.dying < 0)
      if (!m) return
      this.selMonk = m
      if (m.mode === "auto") m.mode = "wait" // para e espera o comando
    } else if (hit.userData.building) {
      this.selBuilding = hit.userData.building as NodeKey
    }
    if (!this.interacted) {
      this.interacted = true
      this.cb.onHint?.()
    }
    this.emitSelect()
  }

  private pick(): THREE.Object3D | null {
    this.ray.setFromCamera(this.mouse, this.camera)
    const hits = this.ray.intersectObjects(this.pickables, true)
    return hits.length ? hits[0].object : null
  }

  private setHover(obj: THREE.Object3D | null) {
    this.hovered = obj
    this.renderer.domElement.style.cursor = obj ? "pointer" : "default"
  }

  private spawnPuff(at: THREE.Vector3) {
    const mat = this.mat.puff.clone()
    const meshes: THREE.Mesh[] = []
    const vel: THREE.Vector3[] = []
    for (let k = 0; k < 10; k++) {
      const m = new THREE.Mesh(this.geo.sphere, mat)
      m.scale.setScalar(0.12 + Math.random() * 0.1)
      m.position.copy(at).add(new THREE.Vector3(0, 0.45, 0))
      const a = (k / 10) * Math.PI * 2
      vel.push(new THREE.Vector3(Math.cos(a) * 1.6, 0.6 + Math.random() * 1.2, Math.sin(a) * 1.6))
      this.world.add(m)
      meshes.push(m)
    }
    this.puffs.push({ meshes, vel, t: 0, mat })
  }

  private hideOverlay() {
    this.overlay.box.style.opacity = "0"
    this.overlay.toolbar.style.opacity = "0"
    this.overlay.toolbar.style.pointerEvents = "none"
  }

  private tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    const sp = this.reduced ? 0.5 : 1

    // câmera
    this.mouseSmooth.lerp(this.mouse, 0.04)
    const d = this.camDist * (1 - this.scroll * 0.12)
    const yaw = this.mouseSmooth.x * 0.06 + this.scroll * 0.18
    const r = 24 * d
    const elev = 0.9 - this.mouseSmooth.y * 0.03 - this.scroll * 0.08
    this.camera.position.set(Math.sin(yaw) * Math.cos(elev) * r, Math.sin(elev) * r, Math.cos(yaw) * Math.cos(elev) * r)
    this.camera.lookAt(0, -0.6, 0.3)

    // ambiente
    this.clouds.forEach((c, k) => {
      c.position.x += Math.sin(t * 0.1 + k) * 0.002
      c.position.y += Math.sin(t * 0.6 + k * 2) * 0.0015
    })
    this.vinyl.rotation.y += dt * 2.2
    this.koi.forEach((k, i) => {
      const a = t * (0.35 + i * 0.08) * sp + i * 2.1
      k.position.set(-4.3 + Math.cos(a) * (1.0 - i * 0.18), 0.03, 2.7 + Math.sin(a) * (0.55 - i * 0.08))
      k.rotation.y = -a
    })

    // efeitos dos prédios
    this.bellSwing = Math.max(0, this.bellSwing - dt * 0.6)
    this.bellPivot.rotation.z = Math.sin(t * 9) * 0.45 * this.bellSwing
    this.templePulse = Math.max(0, this.templePulse - dt * 0.8)
    this.templeGlow.emissiveIntensity = 0.15 + this.templePulse * 1.6
    this.lanternPulse = Math.max(0, this.lanternPulse - dt * 1.5)
    this.lanternMat.emissiveIntensity = 0.7 + this.lanternPulse * 1.4 + Math.sin(t * 3) * 0.05
    this.bookBounce = Math.max(0, this.bookBounce - dt * 2)
    this.books.forEach((b, k) => (b.position.y = 0.08 + Math.floor(k / 2) * 0.075 + Math.sin(this.bookBounce * Math.PI) * 0.08))

    // monges
    let statsDirty = false
    for (const m of this.monks) {
      if (m.dying >= 0) {
        m.dying += dt * 3
        m.root.scale.setScalar(1.35 * Math.max(0, 1 - easeOutBack(Math.min(1, m.dying))))
        continue
      }
      if (m.spawn < 1) {
        m.spawn = Math.min(1, m.spawn + dt * 1.8)
        m.root.scale.setScalar(1.35 * Math.max(0.001, easeOutBack(m.spawn)))
        if (m.spawn >= 1) statsDirty = true
      }
      m.phase += dt
      let bodyY = 0
      let wobble = 0

      if (m.mode === "meditate") {
        bodyY = 0.2 + Math.sin(t * 1.6 + m.id) * 0.05
      } else if (m.mode === "wait") {
        m.body.scale.y = 1 + Math.sin(t * 2 + m.id) * 0.015
      } else if (m.dwell > 0) {
        m.dwell -= dt * sp
        // reverência
        m.body.rotation.x = Math.sin(Math.min(1, (0.9 - m.dwell) / 0.9) * Math.PI) * 0.35
        if (m.dwell <= 0) {
          m.body.rotation.x = 0
          this.planNextLeg(m)
          if (m.routeIdx === 0) m.speedBoost = 1
        }
      } else {
        const tgt = m.path[m.step]
        const dx = tgt.x - m.root.position.x
        const dz = tgt.y - m.root.position.z
        const dist = Math.hypot(dx, dz)
        if (dist < 0.06) {
          const node = m.pathNodes[m.step]
          if (node) this.arrive(m, node)
          m.step++
          if (m.step >= m.path.length && m.dwell <= 0) this.planNextLeg(m)
        } else {
          const speed = 0.9 * sp * m.speedBoost
          m.heading = angleLerp(m.heading, Math.atan2(dx, dz), Math.min(1, dt * 6))
          const step = Math.min(dist, speed * dt)
          m.root.position.x += (dx / dist) * step
          m.root.position.z += (dz / dist) * step
          bodyY = Math.abs(Math.sin(m.phase * 10)) * 0.04
          wobble = Math.sin(m.phase * 10) * 0.08
        }
      }
      if (m.mode !== "wait") m.body.scale.y = lerp(m.body.scale.y, 1, 0.2)
      m.body.position.y = lerp(m.body.position.y, bodyY, m.mode === "meditate" ? 0.05 : 0.35)
      m.body.rotation.z = lerp(m.body.rotation.z, wobble, 0.3)
      m.root.rotation.y = m.heading
    }

    const before = this.monks.length
    this.monks = this.monks.filter((m) => {
      if (m.dying >= 1) {
        this.world.remove(m.root)
        this.pickables = this.pickables.filter((p) => p !== m.root)
        return false
      }
      return true
    })
    if (before !== this.monks.length) statsDirty = true
    if (statsDirty) this.emitStats()

    // pombos voando
    this.pigeons = this.pigeons.filter((p) => {
      p.t += dt / 2.4
      const pos = p.from.clone().addScaledVector(p.dir, p.t * 9)
      pos.y = p.from.y + Math.sin(p.t * Math.PI * 0.8) * 2.4 + p.t * 1.5
      p.grp.position.copy(pos)
      p.grp.rotation.y = Math.atan2(p.dir.x, p.dir.z)
      p.wings.forEach((w, k) => (w.rotation.z = Math.sin(t * 28) * 0.9 * (k ? -1 : 1)))
      p.grp.scale.setScalar(Math.max(0.001, 1.3 * (1 - Math.max(0, p.t - 0.7) / 0.3)))
      if (p.t >= 1) {
        this.world.remove(p.grp)
        return false
      }
      return true
    })

    // ondas do sino
    this.rings = this.rings.filter((rg) => {
      rg.t += dt
      rg.mesh.scale.setScalar(1 + rg.t * 4)
      rg.mat.opacity = Math.max(0, 0.8 - rg.t)
      if (rg.t > 0.8) {
        this.world.remove(rg.mesh)
        rg.mesh.geometry.dispose()
        rg.mat.dispose()
        return false
      }
      return true
    })

    // fumacinha
    this.puffs = this.puffs.filter((p) => {
      p.t += dt
      p.meshes.forEach((mm, k) => {
        mm.position.addScaledVector(p.vel[k], dt)
        p.vel[k].multiplyScalar(0.92)
        mm.scale.multiplyScalar(1 + dt * 1.5)
      })
      p.mat.opacity = Math.max(0, 1 - p.t / 0.7)
      if (p.t > 0.7) {
        p.meshes.forEach((mm) => this.world.remove(mm))
        p.mat.dispose()
        return false
      }
      return true
    })

    this.renderer.render(this.scene, this.camera)
    this.updateOverlay()
  }

  private box3 = new THREE.Box3()
  private v3 = new THREE.Vector3()
  private updateOverlay() {
    const target = this.selMonk?.root ?? (this.selBuilding ? this.buildings[this.selBuilding] : null)
    if (!target) return
    this.box3.setFromObject(target)
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9
    const { min, max } = this.box3
    for (let k = 0; k < 8; k++) {
      this.v3.set(k & 1 ? max.x : min.x, k & 2 ? max.y : min.y, k & 4 ? max.z : min.z).project(this.camera)
      const sx = (this.v3.x * 0.5 + 0.5) * w
      const sy = (-this.v3.y * 0.5 + 0.5) * h
      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }
    const pad = 4
    const bs = this.overlay.box.style
    bs.opacity = "1"
    bs.transform = `translate(${minX - pad}px, ${minY - pad}px)`
    bs.width = `${maxX - minX + pad * 2}px`
    bs.height = `${maxY - minY + pad * 2}px`

    if (this.selMonk) {
      const m = this.selMonk
      this.overlay.label.textContent = `${m.name} · ${m.runs} execuções · ${this.statusText(m)}`
    } else if (this.selBuilding) {
      const b = BUILDINGS[this.selBuilding]
      this.overlay.label.textContent = `${b.title} · ${b.tech}`
    }

    const tb = this.overlay.toolbar
    tb.style.opacity = "1"
    tb.style.pointerEvents = "auto"
    if (this.toolbarHover) return
    const tw = tb.offsetWidth
    const cx = clamp((minX + maxX) / 2 - tw / 2, 8, w - tw - 8)
    let ty = maxY + 30
    if (ty + tb.offsetHeight > h - 8) ty = minY - tb.offsetHeight - 30
    tb.style.transform = `translate(${cx}px, ${ty}px)`
  }
}
