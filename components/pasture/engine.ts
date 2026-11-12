import * as THREE from "three"

/* ────────────────────────────────────────────────────────────
   O PASTO — diorama 3D aconchegante.
   Cada ovelha é um "microsserviço": dá pra mandar pastar,
   andar, pular, escalar (duplicar) e derrubar (ela se recupera
   sozinha — self-healing).
   ──────────────────────────────────────────────────────────── */

export type SheepMode = "idle" | "graze" | "walk" | "jump"

export interface SelectedInfo {
  id: number
  name: string
  mode: SheepMode
}

export interface LogLine {
  id: number
  text: string
  tone: "info" | "warn" | "ok"
}

export interface EngineCallbacks {
  onSelect: (s: SelectedInfo | null) => void
  onStats: (s: { total: number; healthy: number }) => void
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
const PX = 100 // pixels por unidade na textura
const MAX_SHEEP = 18

export const riverX = (z: number) => -6.0 + Math.sin(z * 0.55 + 0.6) * 0.7 + z * 0.12
export const pathX = (z: number) => 1.1 + Math.sin(z * 0.45 + 2.0) * 0.6 - z * 0.08

const SERVICE_NAMES = [
  "auth-service",
  "payments-worker",
  "outbox-relay",
  "sqs-consumer",
  "ledger-api",
  "ai-triage-agent",
  "ws-gateway",
  "notifier",
  "scheduler",
]

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

/* ── textura pintada do terreno ────────────────────── */
function paintGround(): HTMLCanvasElement {
  const cw = W * PX
  const ch = D * PX
  const c = document.createElement("canvas")
  c.width = cw
  c.height = ch
  const g = c.getContext("2d")!
  const rnd = mulberry32(7)
  const toPx = (x: number, z: number): [number, number] => [(x + W / 2) * PX, (z + D / 2) * PX]

  // 1) máscara da terra com borda rasgada
  const x0 = 70, x1 = cw - 70, y0 = 80, y1 = ch - 60
  const pts: [number, number][] = []
  const jag = (i: number) => Math.sin(i * 0.21) * 7 + Math.sin(i * 0.053) * 12 + (rnd() - 0.5) * 9
  let i = 0
  for (let x = x0; x <= x1; x += 7) pts.push([x, y0 + jag(i++)])
  for (let y = y0; y <= y1; y += 7) pts.push([x1 + jag(i++), y])
  for (let x = x1; x >= x0; x -= 7) pts.push([x, y1 + jag(i++)])
  for (let y = y1; y >= y0; y -= 7) pts.push([x0 + jag(i++), y])

  // franja de grama saindo da borda
  g.lineCap = "round"
  const fringe = ["#c9e29a", "#b4d77c", "#e9eccf", "#9ccc5a"]
  for (const [px, py] of pts) {
    for (let k = 0; k < 4; k++) {
      const a = rnd() * Math.PI * 2
      const l = 5 + rnd() * 12
      g.strokeStyle = fringe[(rnd() * fringe.length) | 0]
      g.globalAlpha = 0.55 + rnd() * 0.4
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
  g.fillStyle = "#86c23e"
  g.fill()

  // 2) campos (voronoi com domain warp), em meia resolução
  const lw = cw / 2
  const lh = ch / 2
  const seeds: { x: number; y: number; col: [number, number, number] }[] = []
  const palette: [number, number, number][] = [
    [140, 198, 63],
    [125, 187, 53],
    [159, 207, 74],
    [111, 174, 46],
    [168, 210, 90],
    [132, 192, 70],
  ]
  for (let s = 0; s < 10; s++) {
    seeds.push({
      x: 40 + rnd() * (lw - 80),
      y: 40 + rnd() * (lh - 80),
      col: palette[(rnd() * palette.length) | 0],
    })
  }
  // campo de trigo no canto inferior direito, prado escuro perto do rio
  seeds.push({ x: lw * 0.78, y: lh * 0.84, col: [214, 192, 92] })
  seeds.push({ x: lw * 0.62, y: lh * 0.9, col: [207, 186, 86] })
  seeds.push({ x: lw * 0.16, y: lh * 0.55, col: [96, 158, 44] })

  const img = g.createImageData(lw, lh)
  const data = img.data
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const wx = x + Math.sin(y * 0.031) * 14 + Math.sin((x + y) * 0.017) * 10
      const wy = y + Math.sin(x * 0.027) * 14 + Math.cos((x - y) * 0.021) * 8
      let d1 = 1e9, d2 = 1e9, best = 0
      for (let s = 0; s < seeds.length; s++) {
        const dx = wx - seeds[s].x
        const dy = wy - seeds[s].y
        const d = dx * dx + dy * dy
        if (d < d1) {
          d2 = d1
          d1 = d
          best = s
        } else if (d < d2) d2 = d
      }
      const edge = Math.sqrt(d2) - Math.sqrt(d1)
      const o = (y * lw + x) * 4
      const n = (Math.random() - 0.5) * 14
      if (edge < 2.0) {
        data[o] = 70 + n * 0.5
        data[o + 1] = 135 + n
        data[o + 2] = 38
      } else {
        const [r, gg, b] = seeds[best].col
        const shade = edge < 7 ? -10 : 0
        data[o] = r + n + shade
        data[o + 1] = gg + n + shade
        data[o + 2] = b + n * 0.5 + shade
      }
      data[o + 3] = 255
    }
  }
  const tmp = document.createElement("canvas")
  tmp.width = lw
  tmp.height = lh
  tmp.getContext("2d")!.putImageData(img, 0, 0)
  g.globalCompositeOperation = "source-atop"
  g.imageSmoothingEnabled = true
  g.drawImage(tmp, 0, 0, cw, ch)

  // 3) pinceladas de grama
  for (let k = 0; k < 14000; k++) {
    const px = rnd() * cw
    const py = rnd() * ch
    const a = -1.2 + rnd() * 0.6
    const l = 3 + rnd() * 7
    g.strokeStyle = rnd() > 0.5 ? "rgba(255,255,220,0.13)" : "rgba(30,70,10,0.12)"
    g.lineWidth = 1 + rnd() * 1.5
    g.beginPath()
    g.moveTo(px, py)
    g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l)
    g.stroke()
  }

  const strokeCurve = (fx: (z: number) => number, width: number, color: string, offset = 0) => {
    g.strokeStyle = color
    g.lineWidth = width
    g.lineCap = "round"
    g.lineJoin = "round"
    g.beginPath()
    for (let z = -D / 2; z <= D / 2; z += 0.1) {
      const [px, py] = toPx(fx(z) + offset, z)
      if (z === -D / 2) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.stroke()
  }

  // 4) estradinha
  strokeCurve(pathX, 40, "rgba(80,120,40,0.35)")
  strokeCurve(pathX, 28, "#d6bf86")
  strokeCurve(pathX, 18, "#e6d4a2")
  for (let k = 0; k < 500; k++) {
    const z = -D / 2 + rnd() * D
    const [px, py] = toPx(pathX(z) + (rnd() - 0.5) * 0.22, z)
    g.fillStyle = rnd() > 0.5 ? "rgba(255,250,230,0.5)" : "rgba(150,120,70,0.35)"
    g.fillRect(px, py, 2, 2)
  }

  // 5) rio
  strokeCurve(riverX, 76, "rgba(60,120,35,0.55)")
  strokeCurve(riverX, 54, "#2e68bd")
  strokeCurve(riverX, 38, "#3d7fd6")
  strokeCurve(riverX, 14, "#5d9ae6", -0.06)
  g.setLineDash([10, 22])
  strokeCurve(riverX, 2, "rgba(255,255,255,0.55)", 0.1)
  g.setLineDash([6, 30])
  strokeCurve(riverX, 2, "rgba(255,255,255,0.4)", -0.12)
  g.setLineDash([])

  // 6) florzinhas
  const flowers = ["#fff6c0", "#ffe066", "#ffffff", "#f6a6c6", "#fbd38d"]
  for (let k = 0; k < 1800; k++) {
    const x = -W / 2 + rnd() * W
    const z = -D / 2 + rnd() * D
    if (Math.abs(x - riverX(z)) < 0.45) continue
    const [px, py] = toPx(x, z)
    g.fillStyle = flowers[(rnd() * flowers.length) | 0]
    g.globalAlpha = 0.85
    g.beginPath()
    g.arc(px, py, 1.2 + rnd() * 1.6, 0, Math.PI * 2)
    g.fill()
  }
  g.globalAlpha = 1

  // 7) vinheta suave nas bordas
  const grd = g.createRadialGradient(cw / 2, ch / 2, ch * 0.3, cw / 2, ch / 2, cw * 0.62)
  grd.addColorStop(0, "rgba(0,0,0,0)")
  grd.addColorStop(1, "rgba(30,60,10,0.16)")
  g.fillStyle = grd
  g.fillRect(0, 0, cw, ch)
  g.globalCompositeOperation = "source-over"
  return c
}

/* ── ovelha ───────────────────────────────────────── */
interface Sheep {
  id: number
  name: string
  root: THREE.Group
  body: THREE.Group
  headPivot: THREE.Group
  legs: THREE.Mesh[]
  mode: SheepMode
  locked: boolean
  timer: number
  target: THREE.Vector3
  heading: number
  phase: number
  spawn: number // 0→1
  dying: number // -1 vivo, 0→1 morrendo
}

interface Puff {
  meshes: THREE.Mesh[]
  vel: THREE.Vector3[]
  t: number
  mat: THREE.MeshStandardMaterial
}

export class PastureEngine {
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

  private sheep: Sheep[] = []
  private puffs: Puff[] = []
  private clouds: THREE.Group[] = []
  private vinyl!: THREE.Mesh
  private vinylRoot!: THREE.Group
  private obstacles: { x: number; z: number; r: number }[] = []
  private pickables: THREE.Object3D[] = []

  private selected: Sheep | null = null
  private hovered: THREE.Object3D | null = null
  private nextId = 1
  private logId = 1
  private pendingRespawn = 0
  private dupCount: Record<string, number> = {}

  private mouse = new THREE.Vector2(0, 0)
  private mouseSmooth = new THREE.Vector2(0, 0)
  private scroll = 0
  private camDist = 1
  private ray = new THREE.Raycaster()
  private downAt: { x: number; y: number } | null = null
  private ro: ResizeObserver
  private interacted = false
  public toolbarHover = false

  // geometria/material compartilhados
  private geo = {
    sphere: new THREE.SphereGeometry(1, 20, 14),
    leg: new THREE.CylinderGeometry(0.045, 0.04, 0.3, 8),
  }
  private mat = {
    wool: new THREE.MeshStandardMaterial({ color: "#f7f2e8", roughness: 1 }),
    woolHover: new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.9, emissive: "#3b3220", emissiveIntensity: 0.25 }),
    face: new THREE.MeshStandardMaterial({ color: "#2c2522", roughness: 0.65 }),
    puff: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, transparent: true }),
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

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

    this.buildLights()
    this.buildGround()
    this.buildTrees()
    this.buildClouds()
    this.buildVinyl()
    this.scene.add(this.world)

    const rnd = mulberry32(42)
    SERVICE_NAMES.forEach((name) => {
      const z = -4 + rnd() * 8
      const x = lerp(riverX(z) + 1.4, 7.2, rnd())
      this.addSheep(name, x, z, false)
    })
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

  /* ── construção da cena ── */
  private buildLights() {
    const hemi = new THREE.HemisphereLight("#fff8ea", "#7d9a4a", 1.25)
    this.scene.add(hemi)
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

  private buildGround() {
    const tex = new THREE.CanvasTexture(paintGround())
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.04 })
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.world.add(ground)
  }

  private makeTree(color: string, scale: number) {
    const grp = new THREE.Group()
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.11, 0.55, 8),
      new THREE.MeshStandardMaterial({ color: "#8a5a3b", roughness: 0.9 })
    )
    trunk.position.y = 0.27
    trunk.castShadow = true
    grp.add(trunk)
    const base = new THREE.Color(color)
    const blobs: [number, number, number, number][] = [
      [0, 0.78, 0, 0.42],
      [0.27, 0.66, 0.08, 0.31],
      [-0.26, 0.68, -0.04, 0.33],
      [0.04, 0.66, -0.28, 0.3],
      [0.02, 1.02, 0.05, 0.3],
      [-0.1, 0.62, 0.27, 0.29],
      [0.2, 0.92, -0.12, 0.24],
    ]
    blobs.forEach(([x, y, z, r], k) => {
      const c = base.clone().offsetHSL(0, 0, (k % 3) * 0.035 - 0.02)
      const m = new THREE.Mesh(this.geo.sphere, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }))
      m.position.set(x, y, z)
      m.scale.setScalar(r)
      m.castShadow = true
      m.receiveShadow = true
      grp.add(m)
    })
    grp.scale.setScalar(scale)
    return grp
  }

  private buildTrees() {
    const trees: [number, number, string, number][] = [
      [-7.3, -4.6, "#4fae35", 1.05],
      [-4.4, -4.85, "#5bb83a", 0.85],
      [-0.9, -5.0, "#4fae35", 0.8],
      [4.0, -5.0, "#5bb83a", 0.9],
      [7.6, -4.5, "#47a62f", 1.15],
      [-7.7, 1.2, "#e386b6", 1.0],
      [-3.4, 4.85, "#4fae35", 0.95],
      [7.7, 3.7, "#58b83a", 1.35],
      [8.0, -0.6, "#4fae35", 0.7],
    ]
    trees.forEach(([x, z, col, s]) => {
      const t = this.makeTree(col, s)
      t.position.set(x, 0, z)
      t.rotation.y = x * 1.7
      this.world.add(t)
      this.obstacles.push({ x, z, r: 0.75 * s })
    })
  }

  private buildClouds() {
    const mk = (s: number) => {
      const grp = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial({ color: "#fdfbff", roughness: 1, emissive: "#d9ccf5", emissiveIntensity: 0.18 })
      const parts: [number, number, number, number][] = [
        [0, 0, 0, 0.55],
        [0.6, -0.05, 0.1, 0.42],
        [-0.55, -0.08, 0, 0.4],
        [0.25, 0.3, -0.05, 0.4],
        [-0.2, 0.22, 0.15, 0.35],
      ]
      parts.forEach(([x, y, z, r]) => {
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
    a.position.set(1.4, 3.4, -5.6)
    const b = mk(0.62)
    b.position.set(-2.6, 3.0, -4.6)
    this.clouds.push(a, b)
    this.world.add(a, b)
  }

  private buildVinyl() {
    const root = new THREE.Group()
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.38, 0.75),
      new THREE.MeshStandardMaterial({ color: "#b98352", roughness: 0.85 })
    )
    crate.position.y = 0.19
    crate.castShadow = true
    crate.receiveShadow = true
    root.add(crate)
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.03, 40),
      new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.35, metalness: 0.2 })
    )
    disc.position.y = 0.4
    disc.castShadow = true
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.034, 24),
      new THREE.MeshStandardMaterial({ color: "#d9a93f", roughness: 0.5 })
    )
    label.position.y = 0.002
    disc.add(label)
    const nub = new THREE.Mesh(this.geo.sphere, new THREE.MeshStandardMaterial({ color: "#f2e9d8" }))
    nub.scale.setScalar(0.03)
    nub.position.y = 0.03
    disc.add(nub)
    root.add(disc)
    root.position.set(-3.7, 0, 3.7)
    root.rotation.y = 0.4
    this.vinyl = disc
    this.vinylRoot = root
    root.traverse((o) => (o.userData.vinyl = true))
    this.pickables.push(root)
    this.obstacles.push({ x: -3.7, z: 3.7, r: 0.7 })
    this.world.add(root)
  }

  private makeSheepMesh() {
    const root = new THREE.Group()
    const body = new THREE.Group()
    root.add(body)
    const wool: [number, number, number, number][] = [
      [0, 0.44, 0, 0.3],
      [0.17, 0.42, 0.14, 0.23],
      [-0.17, 0.42, 0.14, 0.23],
      [0.17, 0.42, -0.15, 0.23],
      [-0.17, 0.42, -0.15, 0.23],
      [0, 0.56, 0.1, 0.22],
      [0, 0.56, -0.12, 0.22],
      [0, 0.42, -0.27, 0.2],
      [0, 0.44, 0.24, 0.2],
    ]
    wool.forEach(([x, y, z, r]) => {
      const m = new THREE.Mesh(this.geo.sphere, this.mat.wool)
      m.position.set(x, y, z)
      m.scale.set(r, r * 0.92, r)
      m.castShadow = true
      m.receiveShadow = true
      body.add(m)
    })
    const legs: THREE.Mesh[] = []
    ;[
      [0.13, 0.17],
      [-0.13, 0.17],
      [0.13, -0.17],
      [-0.13, -0.17],
    ].forEach(([x, z]) => {
      const l = new THREE.Mesh(this.geo.leg, this.mat.face)
      l.position.set(x, 0.15, z)
      l.castShadow = true
      body.add(l)
      legs.push(l)
    })
    const headPivot = new THREE.Group()
    headPivot.position.set(0, 0.5, 0.36)
    body.add(headPivot)
    const head = new THREE.Mesh(this.geo.sphere, this.mat.face)
    head.scale.set(0.13, 0.13, 0.17)
    head.position.set(0, 0, 0.1)
    head.castShadow = true
    headPivot.add(head)
    ;[1, -1].forEach((s) => {
      const ear = new THREE.Mesh(this.geo.sphere, this.mat.face)
      ear.scale.set(0.08, 0.03, 0.045)
      ear.position.set(0.13 * s, 0.03, 0.04)
      ear.rotation.z = 0.4 * s
      headPivot.add(ear)
    })
    const tuft = new THREE.Mesh(this.geo.sphere, this.mat.wool)
    tuft.scale.setScalar(0.09)
    tuft.position.set(0, 0.11, 0.03)
    headPivot.add(tuft)
    return { root, body, headPivot, legs }
  }

  private addSheep(name: string, x: number, z: number, animateIn: boolean, mode: SheepMode = "idle") {
    const { root, body, headPivot, legs } = this.makeSheepMesh()
    const s: Sheep = {
      id: this.nextId++,
      name,
      root,
      body,
      headPivot,
      legs,
      mode,
      locked: false,
      timer: 1 + Math.random() * 3,
      target: new THREE.Vector3(x, 0, z),
      heading: Math.random() * Math.PI * 2,
      phase: Math.random() * 10,
      spawn: animateIn ? 0 : 1,
      dying: -1,
    }
    const sc = 0.9 + Math.random() * 0.18
    root.userData.baseScale = sc
    root.position.set(x, 0, z)
    root.rotation.y = s.heading
    root.scale.setScalar(animateIn ? 0.001 : sc)
    root.traverse((o) => (o.userData.sheepId = s.id))
    this.world.add(root)
    this.pickables.push(root)
    this.sheep.push(s)
    return s
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

  setMode(mode: SheepMode) {
    const s = this.selected
    if (!s) return
    s.mode = mode
    s.locked = true
    if (mode === "walk") this.pickTarget(s)
    this.log(`${s.name} → ${({ idle: "parada", graze: "pastando", walk: "andando", jump: "pulando" } as const)[mode]}`, "info")
    this.emitSelect()
  }

  release() {
    if (this.selected) this.selected.locked = false
  }

  duplicate() {
    const s = this.selected
    if (!s) return
    const alive = this.sheep.filter((q) => q.dying < 0).length
    if (alive >= MAX_SHEEP) {
      this.log(`limite do cluster: ${MAX_SHEEP} réplicas. Calma, não é Black Friday.`, "warn")
      return
    }
    const base = s.name.replace(/-r\d+$/, "")
    this.dupCount[base] = (this.dupCount[base] || 1) + 1
    const ang = Math.random() * Math.PI * 2
    const p = this.clampToField(s.root.position.x + Math.cos(ang) * 0.9, s.root.position.z + Math.sin(ang) * 0.9)
    const n = this.addSheep(`${base}-r${this.dupCount[base]}`, p.x, p.z, true, s.mode === "jump" ? "jump" : "idle")
    n.locked = s.locked && s.mode === "jump"
    this.log(`scale ${base} → +1 réplica (${n.name})`, "ok")
    this.emitStats()
  }

  remove() {
    const s = this.selected
    if (!s) return
    s.dying = 0
    this.spawnPuff(s.root.position)
    this.log(`kubectl delete pod ${s.name}`, "warn")
    this.selected = null
    this.cb.onSelect(null)
    this.hideOverlay()
    const name = s.name
    this.pendingRespawn++
    this.emitStats()
    window.setTimeout(() => this.log(`↻ restarting ${name}…`, "info"), 700)
    const t0 = performance.now()
    window.setTimeout(() => {
      this.pendingRespawn--
      const z = -4.4
      const n = this.addSheep(name, pathX(z), z, true, "walk")
      n.target.set(pathX(-1), 0, -1)
      n.timer = 3
      this.log(`✓ ${name} healthy — self-healed em ${((performance.now() - t0) / 1000).toFixed(1)}s`, "ok")
      this.emitStats()
    }, 2300)
  }

  deselect() {
    if (this.selected) this.selected.locked = false
    this.selected = null
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
          const withMap = mm as THREE.MeshStandardMaterial
          withMap.map?.dispose()
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

  private emitStats() {
    const alive = this.sheep.filter((s) => s.dying < 0)
    this.cb.onStats({
      total: alive.length + this.pendingRespawn,
      healthy: alive.filter((s) => s.spawn >= 1).length,
    })
  }

  private emitSelect() {
    const s = this.selected
    this.cb.onSelect(s ? { id: s.id, name: s.name, mode: s.mode } : null)
  }

  private clampToField(x: number, z: number) {
    const cz = clamp(z, -4.5, 4.6)
    const minX = riverX(cz) + 0.95
    return { x: clamp(x, minX, 7.4), z: cz }
  }

  private pickTarget(s: Sheep) {
    const r = 1.2 + Math.random() * 2.6
    const a = Math.random() * Math.PI * 2
    const p = this.clampToField(s.root.position.x + Math.cos(a) * r, s.root.position.z + Math.sin(a) * r)
    s.target.set(p.x, 0, p.z)
  }

  private resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.renderer.domElement.style.width = w + "px"
    this.renderer.domElement.style.height = h + "px"
    this.camera.aspect = w / h
    // retrato (celular): gira o pasto 90° pra usar a altura da tela
    const portrait = this.camera.aspect < 0.95
    this.world.rotation.y = portrait ? -Math.PI / 2 : 0
    this.camDist = portrait ? clamp(1.24 / this.camera.aspect, 1, 2.6) : clamp(1.9 / this.camera.aspect, 1, 2.6)
    this.camera.updateProjectionMatrix()
  }

  private onPointerMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect()
    this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    if (e.pointerType === "mouse") {
      const hit = this.pick()
      this.setHover(hit)
    }
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
    const s = this.sheep.find((q) => q.id === hit.userData.sheepId && q.dying < 0)
    if (!s) return
    if (this.selected && this.selected !== s) this.selected.locked = false
    this.selected = s
    // ao selecionar, a ovelha para e espera o comando
    if (s.mode === "walk") s.mode = "idle"
    s.locked = true
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
    const id = obj?.userData.sheepId
    const prev = this.hovered?.userData.sheepId
    if (prev && prev !== id) this.paintSheep(prev, this.mat.wool)
    if (id && id !== prev) this.paintSheep(id, this.mat.woolHover)
    this.hovered = obj
    this.renderer.domElement.style.cursor = obj ? "pointer" : "default"
  }

  private paintSheep(id: number, mat: THREE.Material) {
    const s = this.sheep.find((q) => q.id === id)
    if (!s) return
    s.body.children.forEach((c) => {
      const m = c as THREE.Mesh
      if (m.isMesh && (m.material === this.mat.wool || m.material === this.mat.woolHover)) m.material = mat
    })
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
    const speedMul = this.reduced ? 0.5 : 1

    // câmera: parallax do mouse + scroll
    this.mouseSmooth.lerp(this.mouse, 0.04)
    const d = this.camDist * (1 - this.scroll * 0.12)
    const yaw = this.mouseSmooth.x * 0.06 + this.scroll * 0.18
    const r = 24 * d
    const elev = 0.92 - this.mouseSmooth.y * 0.03 - this.scroll * 0.08
    this.camera.position.set(Math.sin(yaw) * Math.cos(elev) * r, Math.sin(elev) * r, Math.cos(yaw) * Math.cos(elev) * r)
    this.camera.lookAt(0, -0.4, 0.4)

    // nuvens e vinil
    this.clouds.forEach((c, k) => {
      c.position.x += Math.sin(t * 0.1 + k) * 0.002
      c.position.y += Math.sin(t * 0.6 + k * 2) * 0.0015
    })
    this.vinyl.rotation.y += dt * 2.2
    this.vinylRoot.position.y = 0

    // ovelhas
    let statsDirty = false
    for (const s of this.sheep) {
      const base = s.root.userData.baseScale as number
      if (s.dying >= 0) {
        s.dying += dt * 3
        s.root.scale.setScalar(base * Math.max(0, 1 - easeOutBack(Math.min(1, s.dying))))
        continue
      }
      if (s.spawn < 1) {
        s.spawn = Math.min(1, s.spawn + dt * 1.8)
        s.root.scale.setScalar(base * Math.max(0.001, easeOutBack(s.spawn)))
        if (s.spawn >= 1) statsDirty = true
      }

      if (!s.locked) {
        s.timer -= dt
        if (s.timer <= 0) {
          const r = Math.random()
          s.mode = r < 0.45 ? "walk" : r < 0.8 ? "graze" : r < 0.97 ? "idle" : "jump"
          if (this.reduced && s.mode === "jump") s.mode = "graze"
          s.timer = s.mode === "jump" ? 1.4 : 2.5 + Math.random() * 4
          if (s.mode === "walk") this.pickTarget(s)
          if (s === this.selected) this.emitSelect()
        }
      }

      s.phase += dt
      let headTarget = Math.sin(t * 0.8 + s.id) * 0.08
      let bodyY = 0
      let legSwing = 0

      if (s.mode === "walk") {
        const dx = s.target.x - s.root.position.x
        const dz = s.target.z - s.root.position.z
        const dist = Math.hypot(dx, dz)
        if (dist < 0.15) {
          if (s.locked) this.pickTarget(s)
          else {
            s.mode = "graze"
            s.timer = 2 + Math.random() * 3
            if (s === this.selected) this.emitSelect()
          }
        } else {
          const sp = 0.65 * speedMul
          s.heading = angleLerp(s.heading, Math.atan2(dx, dz), Math.min(1, dt * 4))
          const step = Math.min(dist, sp * dt)
          s.root.position.x += Math.sin(s.heading) * step
          s.root.position.z += Math.cos(s.heading) * step
          bodyY = Math.abs(Math.sin(s.phase * 9)) * 0.045
          legSwing = Math.sin(s.phase * 9) * 0.55
        }
      } else if (s.mode === "graze") {
        headTarget = 0.85 + Math.sin(t * 7 + s.id) * 0.07
      } else if (s.mode === "jump") {
        const p = (s.phase % 0.75) / 0.75
        bodyY = Math.sin(p * Math.PI) * 0.55
        legSwing = p < 0.5 ? -0.5 : 0.3
        headTarget = -0.2
      }
      if (s.mode === "idle") {
        s.body.scale.y = 1 + Math.sin(t * 2 + s.id) * 0.012
      } else s.body.scale.y = 1

      s.body.position.y = lerp(s.body.position.y, bodyY, s.mode === "jump" ? 0.6 : 0.3)
      s.headPivot.rotation.x = lerp(s.headPivot.rotation.x, headTarget, 0.08)
      s.legs.forEach((l, k) => (l.rotation.x = lerp(l.rotation.x, legSwing * (k % 3 === 0 ? 1 : -1), 0.3)))
      s.root.rotation.y = s.heading
    }

    // separação entre ovelhas e obstáculos
    for (let a = 0; a < this.sheep.length; a++) {
      const sa = this.sheep[a]
      if (sa.dying >= 0) continue
      for (let b = a + 1; b < this.sheep.length; b++) {
        const sb = this.sheep[b]
        if (sb.dying >= 0) continue
        const dx = sb.root.position.x - sa.root.position.x
        const dz = sb.root.position.z - sa.root.position.z
        const dd = Math.hypot(dx, dz)
        if (dd > 0.0001 && dd < 0.78) {
          const push = (0.78 - dd) * 0.5
          sa.root.position.x -= (dx / dd) * push
          sa.root.position.z -= (dz / dd) * push
          sb.root.position.x += (dx / dd) * push
          sb.root.position.z += (dz / dd) * push
        }
      }
      for (const o of this.obstacles) {
        const dx = sa.root.position.x - o.x
        const dz = sa.root.position.z - o.z
        const dd = Math.hypot(dx, dz)
        if (dd < o.r + 0.35 && dd > 0.0001) {
          const push = o.r + 0.35 - dd
          sa.root.position.x += (dx / dd) * push
          sa.root.position.z += (dz / dd) * push
        }
      }
      const p = this.clampToField(sa.root.position.x, sa.root.position.z)
      sa.root.position.x = p.x
      sa.root.position.z = p.z
    }

    // limpa mortas
    const before = this.sheep.length
    this.sheep = this.sheep.filter((s) => {
      if (s.dying >= 1) {
        this.world.remove(s.root)
        this.pickables = this.pickables.filter((p) => p !== s.root)
        return false
      }
      return true
    })
    if (before !== this.sheep.length) statsDirty = true
    if (statsDirty) this.emitStats()

    // fumacinha
    this.puffs = this.puffs.filter((p) => {
      p.t += dt
      p.meshes.forEach((m, k) => {
        m.position.addScaledVector(p.vel[k], dt)
        p.vel[k].multiplyScalar(0.92)
        m.scale.multiplyScalar(1 + dt * 1.5)
      })
      p.mat.opacity = Math.max(0, 1 - p.t / 0.7)
      if (p.t > 0.7) {
        p.meshes.forEach((m) => this.world.remove(m))
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
    const s = this.selected
    if (!s) return
    this.box3.setFromObject(s.root)
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

    const size = this.box3.getSize(this.v3)
    const dist = this.camera.position.distanceTo(s.root.position)
    this.overlay.label.textContent = `${s.name} · ${(size.x * 2.3).toFixed(2)} × ${(size.z * 2.3).toFixed(2)} m · ${Math.round(dist * 3.4)} m away`

    const tb = this.overlay.toolbar
    tb.style.opacity = "1"
    tb.style.pointerEvents = "auto"
    if (this.toolbarHover) return // não foge do cursor
    const tw = tb.offsetWidth
    const cx = clamp((minX + maxX) / 2 - tw / 2, 8, w - tw - 8)
    let ty = maxY + 30
    if (ty + tb.offsetHeight > h - 8) ty = minY - tb.offsetHeight - 30
    tb.style.transform = `translate(${cx}px, ${ty}px)`
  }
}
