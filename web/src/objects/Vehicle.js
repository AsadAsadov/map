import Phaser from "phaser";

export default class Vehicle extends Phaser.GameObjects.Container {
  constructor(scene, path = [], color = 0xd6b66a) {
    if (!Array.isArray(path) || path.length === 0) { super(scene, 0, 0); scene.add.existing(this); this.setVisible(false); return; }
    super(scene, path[0].x, path[0].y); this.sceneRef = scene; this.path = path.filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y)); this.currentIndex = 0;
    const g = scene.add.graphics();
    g.lineStyle(2, color, 0.8); g.lineBetween(-16, 0, 16, 0);
    g.fillStyle(color, 0.95); g.fillCircle(-18, 0, 2.5); g.fillCircle(18, 0, 2.5);
    g.fillStyle(0x020617, 0.22); g.fillEllipse(0, 5, 42, 6);
    this.add(g); scene.add.existing(this); this.setDepth(2000); if (this.path.length > 1) this.moveToNextPoint();
  }
  moveToNextPoint() { const nextIndex=(this.currentIndex+1)%this.path.length,target=this.path[nextIndex]; if(!target) return; const distance=Phaser.Math.Distance.Between(this.x,this.y,target.x,target.y); this.sceneRef.tweens.add({targets:this,x:target.x,y:target.y,duration:Math.max(900,distance*22),ease:"Sine.inOut",onUpdate:()=>this.setDepth(this.y+200),onComplete:()=>{this.currentIndex=nextIndex;this.moveToNextPoint();}}); }
}
