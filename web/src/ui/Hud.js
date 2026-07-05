export default class Hud {
  constructor(scene, economy){ this.scene=scene; this.economy=economy; this.container=scene.add.container(0,0).setDepth(10000).setScrollFactor(0); this.bg=scene.add.graphics(); this.text=scene.add.text(0,0,"",{fontFamily:"Arial",fontSize:"15px",color:"#fff",fontStyle:"bold"}); this.container.add([this.bg,this.text]); this.resize(); this.update(economy.getPlayer()); scene.events.on("economy:update",p=>this.update(p)); scene.scale.on("resize",()=>this.resize()); }
  resize(){ const w=this.scene.scale.width; this.bg.clear().fillStyle(0x0f172a,.92).fillRoundedRect(10,10,Math.min(w-20,720),54,16).lineStyle(1,0x38bdf8,.35).strokeRoundedRect(10,10,Math.min(w-20,720),54,16); this.text.setPosition(24,25); this.text.setFontSize(w<520?"12px":"15px"); }
  update(p){ this.text.setText(`👤 ${p.name}   🪙 ${p.coins.toLocaleString()}   💎 ${p.diamonds}   ⚡ ${p.energy}   ⭐ Lv ${p.level}`); }
  coinTarget(){ return {x: this.scene.scale.width<520 ? 90 : 116, y: 35}; }
}
