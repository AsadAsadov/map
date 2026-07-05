import Phaser from "phaser";

const COLORS = {
  empty: { fill: 0x151c28, stroke: 0x67e8f9, accent: 0xd6b66a },
  owned: { fill: 0x192436, stroke: 0xd6b66a, accent: 0x67e8f9 },
  under_construction: { fill: 0x262433, stroke: 0xd6b66a, accent: 0xf8e7b0 },
  built: { fill: 0x111827, stroke: 0x8fb5c7, accent: 0xd6b66a },
};

export default class IsoPlot extends Phaser.GameObjects.Container {
  constructor(scene, data) {
    super(scene, data.x, data.y);
    this.scene = scene; this.dataModel = data; this.tileW = data.tileW; this.tileH = data.tileH;
    this.base = scene.add.graphics(); this.highlight = scene.add.graphics();
    this.label = scene.add.text(0, 0, "", { fontFamily: "Inter, Arial, sans-serif", fontSize: "10px", color: "#cbd5e1", letterSpacing: 1 }).setOrigin(0.5);
    this.add([this.highlight, this.base, this.label]); scene.add.existing(this); this.setDepth(this.y);
    this.setSize(this.tileW, this.tileH);
    this.setInteractive(new Phaser.Geom.Polygon([0,-this.tileH/2,this.tileW/2,0,0,this.tileH/2,-this.tileW/2,0]), Phaser.Geom.Polygon.Contains);
    this.on("pointerdown", () => scene.events.emit("plot:selected", this.dataModel.id));
    this.on("pointerover", () => scene.tweens.add({ targets: this, y: data.y - 3, duration: 120 }));
    this.on("pointerout", () => scene.tweens.add({ targets: this, y: data.y, duration: 120 }));
    this.render();
  }
  diamond(g, dy = 0, fill = true) { g.beginPath(); g.moveTo(0, -this.tileH/2 + dy); g.lineTo(this.tileW/2, dy); g.lineTo(0, this.tileH/2 + dy); g.lineTo(-this.tileW/2, dy); g.closePath(); fill ? g.fillPath() : g.strokePath(); }
  render(selected = false) {
    const c = COLORS[this.dataModel.status] || COLORS.empty;
    this.base.clear(); this.highlight.clear();
    this.base.fillStyle(0x020617, 0.42); this.diamond(this.base, 12);
    this.base.fillStyle(0x0b1220, 0.85); this.diamond(this.base, 6);
    this.base.fillStyle(c.fill, 0.98); this.base.lineStyle(this.dataModel.status === "empty" ? 1 : 2, c.stroke, this.dataModel.status === "empty" ? 0.55 : 0.9); this.diamond(this.base); this.diamond(this.base, 0, false);
    this.base.lineStyle(1, 0xffffff, 0.07); this.base.lineBetween(-this.tileW/2 + 12, 0, 0, this.tileH/2 - 6); this.base.lineBetween(0, -this.tileH/2 + 6, this.tileW/2 - 12, 0);
    this.base.lineStyle(1, c.accent, 0.28); this.base.lineBetween(-this.tileW/4, -this.tileH/4, this.tileW/4, this.tileH/4);
    if (selected) { this.highlight.lineStyle(3, 0xd6b66a, 0.9); this.diamond(this.highlight, 0, false); this.highlight.lineStyle(1, 0x67e8f9, 0.8); this.diamond(this.highlight, -5, false); }
    const status = this.dataModel.status === "empty" ? "AVAILABLE" : this.dataModel.status.replace("_", " ").toUpperCase();
    this.label.setText(`${this.dataModel.name}\n${status}`);
    this.label.setY(this.dataModel.status === "built" ? 30 : 0);
    this.label.setAlpha(this.dataModel.status === "built" ? 0.65 : 0.92);
  }
  updateData(data, selected = false) { this.dataModel = data; this.render(selected); }
}
