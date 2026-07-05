import Phaser from "phaser";
import CityManager from "../managers/CityManager";
import EconomyManager from "../managers/EconomyManager";
import Hud from "../ui/Hud";
import ActionPanel from "../ui/ActionPanel";
import WeatherManager from "../effects/WeatherManager";

export default class CityScene extends Phaser.Scene {
  constructor(){ super("CityScene"); }
  create(){ this.cameras.main.setBackgroundColor("#050913"); this.addBackground(); this.economy=new EconomyManager(this); this.city=new CityManager(this,this.economy); this.city.createCity(); this.hud=new Hud(this,this.economy); this.panel=new ActionPanel(this,this.city); this.weather=new WeatherManager(this); this.events.on("plot:selected",id=>{ const p=this.city.select(id); this.panel.show(p); }); this.scale.on("resize",()=>this.scene.restart()); }
  addBackground(){ const w=this.scale.width,h=this.scale.height; const g=this.add.graphics().setDepth(-10); g.fillGradientStyle(0x050913,0x08111f,0x101827,0x0b1220,1); g.fillRect(0,0,w,h); g.lineStyle(1,0x94a3b8,.045); const step=34; for(let x=0;x<w;x+=step) g.lineBetween(x,0,x,h); for(let y=0;y<h;y+=step) g.lineBetween(0,y,w,y); g.lineStyle(1,0x67e8f9,.035); for(let x=-h;x<w+h;x+=step*2) g.lineBetween(x,0,x+h,h); g.fillStyle(0xffffff,.12); for(let i=0;i<70;i++) g.fillCircle(Math.random()*w,Math.random()*h,Math.random()*1.15); const v=this.add.graphics().setDepth(-9); v.fillGradientStyle(0x000000,0x000000,0x000000,0x000000,.56,.2,.72,.85); v.fillRect(0,0,w,h); }
  animateCollect(plot,amount){ const text=this.add.text(plot.x,plot.y-112,`+$${amount.toLocaleString()}`,{fontFamily:"Inter, Arial, sans-serif",fontSize:"18px",fontStyle:"600",color:"#f6d78b",stroke:"#020617",strokeThickness:3}).setOrigin(.5).setDepth(10050); this.tweens.add({targets:text,y:text.y-45,alpha:0,duration:1200,ease:"Cubic.out",onComplete:()=>text.destroy()}); const target=this.hud.coinTarget(); for(let i=0;i<10;i++){ const c=this.add.circle(plot.x+Phaser.Math.Between(-18,18),plot.y-42+Phaser.Math.Between(-12,12),2.2,0xd6b66a,.88).setDepth(10040); this.tweens.add({targets:c,x:target.x+Phaser.Math.Between(-6,6),y:target.y+Phaser.Math.Between(-6,6),alpha:.1,duration:720+i*26,ease:"Cubic.in",onComplete:()=>c.destroy()}); } }
  toast(message){ const t=this.add.text(this.scale.width/2,92,message,{fontFamily:"Inter, Arial, sans-serif",fontSize:"13px",color:"#e5e7eb",backgroundColor:"rgba(15,23,42,.92)",padding:{x:14,y:8}}).setOrigin(.5).setDepth(11000).setScrollFactor(0); this.tweens.add({targets:t,y:72,alpha:0,duration:1200,onComplete:()=>t.destroy()}); }
}
