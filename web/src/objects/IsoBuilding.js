import Phaser from "phaser";
const TYPES = {"Luxury Villa":{h:46,w:76,glass:0x6ea6b8,wall:0x8b8f94},"Low-Rise Residence":{h:62,w:78,glass:0x7fb7cf,wall:0x56616d},"Apartment Tower":{h:96,w:62,glass:0x75a9c5,wall:0x303b4a},"Business Tower":{h:116,w:66,glass:0x4b8eaa,wall:0x1f2937},"Hotel Tower":{h:106,w:72,glass:0x587d99,wall:0x3b3430}};
export default class IsoBuilding extends Phaser.GameObjects.Container {
  constructor(scene, plot) { super(scene, plot.x, plot.y - 10); this.scene=scene; this.plot=plot; this.g=scene.add.graphics(); this.add(this.g); scene.add.existing(this); this.setDepth(this.y + 35); this.draw(); this.setInteractive(new Phaser.Geom.Rectangle(-45,-130,90,150), Phaser.Geom.Rectangle.Contains); this.on("pointerdown",()=>scene.events.emit("plot:selected", plot.id)); }
  draw() { const spec=TYPES[this.plot.building]||TYPES["Luxury Villa"]; const h=spec.h+Math.min(this.plot.level-1,4)*10,w=spec.w; const g=this.g; g.clear();
    g.fillStyle(0x020617,.38); g.fillEllipse(0,34,w+34,28);
    g.fillStyle(spec.wall,.96); g.fillRect(-w/2,-h+14,w,h);
    g.fillStyle(Phaser.Display.Color.ValueToColor(spec.wall).darken(18).color,1); g.beginPath(); g.moveTo(w/2,-h+14); g.lineTo(w/2+18,-h+25); g.lineTo(w/2+18,22); g.lineTo(w/2,14); g.closePath(); g.fillPath();
    g.fillStyle(0x111827,1); g.beginPath(); g.moveTo(-w/2,-h+14); g.lineTo(0,-h-10); g.lineTo(w/2+18,-h+25); g.lineTo(w/2,-h+14); g.lineTo(0,-h+32); g.closePath(); g.fillPath();
    g.lineStyle(1,0xd6b66a,.35); g.strokePath();
    g.fillStyle(spec.glass,.58); for(let y=-h+28;y<8;y+=16){ for(let x=-w/2+10;x<w/2-6;x+=16) g.fillRoundedRect(x,y,8,10,1); }
    g.fillStyle(0xf6d78b,.88); for(let y=-h+34;y<6;y+=32){ for(let x=-w/2+14;x<w/2-10;x+=32) g.fillRoundedRect(x,y,6,8,1); }
    g.lineStyle(1,0xffffff,.12); g.strokeRect(-w/2,-h+14,w,h); if(this.plot.level>1){ g.fillStyle(0xd6b66a,.95); g.fillCircle(w/2+13,-h+18,3.5); }
  }
}
