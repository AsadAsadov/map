export default class EconomyManager {
  constructor(scene) {
    this.scene = scene;
    this.player = { name: "Asad", coins: 4200, diamonds: 35, energy: 82, level: 7 };
  }

  canAfford(amount) { return this.player.coins >= amount; }
  spend(amount) { if (!this.canAfford(amount)) return false; this.player.coins -= amount; this.scene.events.emit("economy:update", this.player); return true; }
  earn(amount) { this.player.coins += amount; this.scene.events.emit("economy:update", this.player); }
  getPlayer() { return { ...this.player }; }
}
