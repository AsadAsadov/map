export default class Hud {
  constructor(scene, economy){ this.scene=scene; this.economy=economy; this.container=scene.add.container(0,0).setDepth(10000).setScrollFactor(0); this.bg=scene.add.graphics(); this.text=scene.add.text(0,0,"",{fontFamily:"Inter, Arial, sans-serif",fontSize:"13px",color:"#e5e7eb"}); this.container.add([this.bg,this.text]); this.resize(); this.update(economy.getPlayer()); scene.events.on("economy:update",p=>this.update(p)); scene.scale.on("resize",()=>this.resize()); }
  resize(){ const w=this.scene.scale.width; const bw=Math.min(w-20,820); this.bg.clear().fillStyle(0x020617,.72).fillRoundedRect(10,10,bw,58,18).lineStyle(1,0xffffff,.1).strokeRoundedRect(10,10,bw,58,18).lineStyle(1,0x67e8f9,.18).lineBetween(28,66,10+bw-28,66); this.text.setPosition(26,25); this.text.setFontSize(w<520?"11px":"13px"); }
  update(p){ this.text.setText(`REAL ESTATE EMPIRE   |   ${p.name.toUpperCase()}   |   ◇ $${p.coins.toLocaleString()}   ◆ ${p.diamonds}   ENERGY ${p.energy}   LEVEL ${p.level}`); }
  coinTarget(){ return {x: this.scene.scale.width<520 ? 126 : 270, y: 38}; }
}
