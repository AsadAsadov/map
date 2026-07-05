import Phaser from "phaser";

export default class LandscapeBlock extends Phaser.GameObjects.Container {
  constructor(scene, x, y, scale = 1) {
    super(scene, x, y);
    const g = scene.add.graphics();
    g.fillStyle(0x020617, 0.28);
    g.fillEllipse(0, 8 * scale, 54 * scale, 14 * scale);
    g.fillStyle(0x1f3b35, 0.98);
    g.fillRoundedRect(-22 * scale, -6 * scale, 44 * scale, 12 * scale, 2 * scale);
    g.fillStyle(0x2f5d4f, 0.9);
    g.fillRoundedRect(-17 * scale, -12 * scale, 12 * scale, 8 * scale, 2 * scale);
    g.fillRoundedRect(3 * scale, -11 * scale, 16 * scale, 7 * scale, 2 * scale);
    g.lineStyle(1, 0xd6b66a, 0.35);
    g.strokeRoundedRect(-22 * scale, -6 * scale, 44 * scale, 12 * scale, 2 * scale);
    this.add(g);
    scene.add.existing(this);
    this.setDepth(y + 2);
  }
}
