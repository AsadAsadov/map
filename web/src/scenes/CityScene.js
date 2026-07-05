import Phaser from "phaser";
import CityManager from "../managers/CityManager";
import EconomyManager from "../managers/EconomyManager";
import Hud from "../ui/Hud";
import ActionPanel from "../ui/ActionPanel";
import WeatherManager from "../effects/WeatherManager";

export default class CityScene extends Phaser.Scene {
  constructor(){ super("CityScene"); }
  create(){ this.cameras.main.setBackgroundColor("#0b1f2f"); this.addBackground(); this.economy=new EconomyManager(this); this.city=new CityManager(this,this.economy); this.city.createCity(); this.hud=new Hud(this,this.economy); this.panel=new ActionPanel(this,this.city); this.weather=new WeatherManager(this); this.events.on("plot:selected",id=>{ const p=this.city.select(id); this.panel.show(p); }); this.scale.on("resize",()=>this.scene.restart()); }
  addBackground(){ const w=this.scale.width,h=this.scale.height; const g=this.add.graphics().setDepth(-10); g.fillGradientStyle(0x0b1f2f,0x0b1f2f,0x123d4f,0x1f4f46,1); g.fillRect(0,0,w,h); g.fillStyle(0x164e63,.45); for(let i=0;i<18;i++) g.fillCircle(Math.random()*w,110+Math.random()*h*.55,40+Math.random()*70); }
  animateCollect(plot,amount){ const text=this.add.text(plot.x,plot.y-110,`+${amount} coins`,{fontFamily:"Arial",fontSize:"20px",fontStyle:"bold",color:"#fde68a",stroke:"#78350f",strokeThickness:3}).setOrigin(.5).setDepth(10050); this.tweens.add({targets:text,y:text.y-55,alpha:0,duration:1200,onComplete:()=>text.destroy()}); const target=this.hud.coinTarget(); for(let i=0;i<18;i++){ const c=this.add.circle(plot.x+Phaser.Math.Between(-25,25),plot.y-45+Phaser.Math.Between(-20,20),4,0xfacc15).setDepth(10040); this.tweens.add({targets:c,x:target.x+Phaser.Math.Between(-8,8),y:target.y+Phaser.Math.Between(-8,8),duration:650+i*22,ease:"Cubic.in",onComplete:()=>c.destroy()}); } }
  toast(message){ const t=this.add.text(this.scale.width/2,92,message,{fontFamily:"Arial",fontSize:"15px",color:"#fff",backgroundColor:"#0f172a",padding:{x:14,y:8}}).setOrigin(.5).setDepth(11000).setScrollFactor(0); this.tweens.add({targets:t,y:72,alpha:0,duration:1200,onComplete:()=>t.destroy()}); }
}
