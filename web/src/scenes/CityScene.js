import Phaser from "phaser";

export default class CityScene extends Phaser.Scene {
  constructor() {
    super("CityScene");
    this.selectedPlot = null;
  }

  create() {
    this.cameras.main.setBackgroundColor("#07111f");

    this.add
      .text(24, 20, "🏢 Real Estate Empire", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0);

    this.add
      .text(24, 54, "Coin: 1000  |  Diamond: 10", {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#9fb3c8",
      })
      .setScrollFactor(0);

    this.createIsoCity();

    this.scale.on("resize", () => {
      this.scene.restart();
    });
  }

  createIsoCity() {
    const width = this.scale.width;
    const height = this.scale.height;

    const tileW = width < 600 ? 92 : 130;
    const tileH = width < 600 ? 46 : 65;

    const startX = width / 2;
    const startY = height < 700 ? 155 : 210;

    const rows = 4;
    const cols = 3;

    let index = 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isoX = startX + (x - y) * (tileW / 2);
        const isoY = startY + (x + y) * (tileH / 2);

        const zone =
          index <= 4 ? "Cheap" : index <= 8 ? "Middle" : "Premium";

        this.createPlot({
          x: isoX,
          y: isoY,
          tileW,
          tileH,
          index,
          zone,
        });

        index++;
      }
    }
  }

  createPlot({ x, y, tileW, tileH, index, zone }) {
    const container = this.add.container(x, y);

    const g = this.add.graphics();

    const fill =
      zone === "Cheap" ? 0x244c35 : zone === "Middle" ? 0x30516e : 0x6b5228;

    const stroke =
      zone === "Cheap" ? 0x4ade80 : zone === "Middle" ? 0x38bdf8 : 0xfbbf24;

    g.fillStyle(fill, 1);
    g.lineStyle(2, stroke, 0.95);

    g.beginPath();
    g.moveTo(0, -tileH / 2);
    g.lineTo(tileW / 2, 0);
    g.lineTo(0, tileH / 2);
    g.lineTo(-tileW / 2, 0);
    g.closePath();
    g.fillPath();
    g.strokePath();

    const label = this.add
      .text(0, -8, `Plot ${index}`, {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const zoneText = this.add
      .text(0, 10, zone, {
        fontFamily: "Arial",
        fontSize: "11px",
        color: "#dbeafe",
      })
      .setOrigin(0.5);

    container.add([g, label, zoneText]);

    const hit = new Phaser.Geom.Polygon([
      0,
      -tileH / 2,
      tileW / 2,
      0,
      0,
      tileH / 2,
      -tileW / 2,
      0,
    ]);

    container.setSize(tileW, tileH);
    container.setInteractive(hit, Phaser.Geom.Polygon.Contains);

    container.on("pointerdown", () => {
      this.selectPlot(index, zone);
    });

    container.on("pointerover", () => {
      this.tweens.add({
        targets: container,
        scale: 1.06,
        duration: 120,
      });
    });

    container.on("pointerout", () => {
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 120,
      });
    });
  }

  selectPlot(index, zone) {
    if (this.selectedPlot) {
      this.selectedPlot.destroy();
    }

    const width = this.scale.width;
    const height = this.scale.height;

    this.selectedPlot = this.add.container(width / 2, height - 95);

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.96);
    bg.lineStyle(1, 0x334155, 1);
    bg.fillRoundedRect(-170, -48, 340, 96, 18);
    bg.strokeRoundedRect(-170, -48, 340, 96, 18);

    const title = this.add
      .text(-145, -34, `Plot ${index} seçildi`, {
        fontFamily: "Arial",
        fontSize: "17px",
        color: "#ffffff",
        fontStyle: "bold",
      });

    const desc = this.add
      .text(-145, -10, `Zona: ${zone} | Qiymət: ${this.getPrice(index)} coin`, {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#cbd5e1",
      });

    const btn = this.add
      .text(-145, 18, "Torpaq al", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#020617",
        backgroundColor: "#fbbf24",
        padding: { x: 14, y: 7 },
      })
      .setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      desc.setText(`Plot ${index} alındı ✅`);
    });

    this.selectedPlot.add([bg, title, desc, btn]);
  }

  getPrice(index) {
    if (index <= 4) return 300 + index * 100;
    if (index <= 8) return 1000 + index * 250;
    return 3000 + index * 500;
  }
}
