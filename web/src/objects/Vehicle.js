import Phaser from "phaser";

export default class Vehicle extends Phaser.GameObjects.Container {
  constructor(scene, path = [], color = 0xef4444) {
    if (!Array.isArray(path) || path.length === 0) {
      super(scene, 0, 0);
      scene.add.existing(this);
      this.setVisible(false);
      return;
    }

    super(scene, path[0].x, path[0].y);

    this.sceneRef = scene;
    this.path = path.filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y));
    this.currentIndex = 0;

    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(0, 8, 34, 10);

    g.fillStyle(color, 1);
    g.fillRoundedRect(-18, -7, 36, 16, 5);

    g.fillStyle(0xdbeafe, 1);
    g.fillRect(-8, -11, 16, 7);

    g.fillStyle(0x111827, 1);
    g.fillCircle(-10, 9, 4);
    g.fillCircle(11, 9, 4);

    this.add(g);
    scene.add.existing(this);
    this.setDepth(2000);

    if (this.path.length > 1) {
      this.moveToNextPoint();
    }
  }

  moveToNextPoint() {
    const nextIndex = (this.currentIndex + 1) % this.path.length;
    const target = this.path[nextIndex];

    if (!target) return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y
    );

    this.sceneRef.tweens.add({
      targets: this,
      x: target.x,
      y: target.y,
      duration: Math.max(500, distance * 18),
      ease: "Linear",
      onUpdate: () => {
        this.setDepth(this.y + 200);
      },
      onComplete: () => {
        this.currentIndex = nextIndex;
        this.moveToNextPoint();
      },
    });
  }
}
