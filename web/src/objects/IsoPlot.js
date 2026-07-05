import Phaser from "phaser";

const COLORS = {
  empty: [0x2f7d4b, 0x75e6a0], owned: [0x356f9d, 0x93c5fd],
  under_construction: [0x9a6b2f, 0xfacc15], built: [0x486177, 0xe2e8f0],
};

export default class IsoPlot extends Phaser.GameObjects.Container {
  constructor(scene, data) {
    super(scene, data.x, data.y);
    this.scene = scene; this.dataModel = data; this.tileW = data.tileW; this.tileH = data.tileH;
    this.base = scene.add.graphics(); this.highlight = scene.add.graphics(); this.label = scene.add.text(0, 0, "", { fontFamily: "Arial", fontSize: "12px", color: "#fff", fontStyle: "bold" }).setOrigin(0.5);
    this.add([this.highlight, this.base, this.label]); scene.add.existing(this); this.setDepth(this.y);
    this.setSize(this.tileW, this.tileH);
    this.setInteractive(new Phaser.Geom.Polygon([0,-this.tileH/2,this.tileW/2,0,0,this.tileH/2,-this.tileW/2,0]), Phaser.Geom.Polygon.Contains);
    this.on("pointerdown", () => scene.events.emit("plot:selected", this.dataModel.id));
    this.on("pointerover", () => scene.tweens.add({ targets: this, scale: 1.045, duration: 120 }));
    this.on("pointerout", () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));
    this.render();
  }
  diamond(g, dy = 0, fill = true) { g.beginPath(); g.moveTo(0, -this.tileH/2 + dy); g.lineTo(this.tileW/2, dy); g.lineTo(0, this.tileH/2 + dy); g.lineTo(-this.tileW/2, dy); g.closePath(); fill ? g.fillPath() : g.strokePath(); }
  render(selected = false) {
    const [fill, stroke] = COLORS[this.dataModel.status] || COLORS.empty;
    this.base.clear(); this.highlight.clear();
    this.base.fillStyle(0x0b1220, 0.32); this.diamond(this.base, 10);
    this.base.fillStyle(fill, 0.95); this.base.lineStyle(2, stroke, 0.95); this.diamond(this.base); this.diamond(this.base, 0, false);
    this.base.lineStyle(1, 0xffffff, 0.16); this.base.lineBetween(-this.tileW/4, -this.tileH/4, this.tileW/4, this.tileH/4); this.base.lineBetween(this.tileW/4, -this.tileH/4, -this.tileW/4, this.tileH/4);
    if (selected) { this.highlight.lineStyle(5, 0xfff7ad, 0.75); this.diamond(this.highlight, 0, false); }
    this.label.setText(this.dataModel.status === "empty" ? this.dataModel.name : this.dataModel.zone);
    this.label.setY(this.dataModel.status === "built" ? 26 : 0);
  }
  updateData(data, selected = false) { this.dataModel = data; this.render(selected); }
}
