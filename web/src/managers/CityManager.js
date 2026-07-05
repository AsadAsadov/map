import IsoPlot from "../objects/IsoPlot";
import IsoBuilding from "../objects/IsoBuilding";
import Tree from "../objects/Tree";
import Vehicle from "../objects/Vehicle";
import Walker from "../objects/Walker";

const BUILDINGS = ["Small House", "Villa", "Apartment", "Business Center", "Hotel"];

export default class CityManager {
  constructor(scene, economy) { this.scene=scene; this.economy=economy; this.plots=[]; this.plotViews=new Map(); this.buildings=new Map(); this.constructionFx=new Map(); this.selectedId=null; }
  createCity(){ this.createTexture(); this.makePlots(); this.drawRoads(); this.drawSidewalks(); this.renderPlots(); this.addDecor(); this.addLife(); }
  createTexture(){ const g=this.scene.add.graphics(); g.fillStyle(0xffffff,1).fillCircle(2,2,2); g.generateTexture("__WHITE",4,4); g.destroy(); }
  iso(cx,cy,tileW,tileH,x,y){ return {x:cx+(x-y)*tileW/2,y:cy+(x+y)*tileH/2}; }
  makePlots(){ const w=this.scene.scale.width,h=this.scene.scale.height; this.tileW=w<600?88:126; this.tileH=w<600?44:63; this.origin={x:w/2,y:Math.max(150, h*.25)}; let id=1; for(let r=0;r<3;r++) for(let c=0;c<4;c++){ const p=this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,c,r); const zone=id<=4?"Suburbs":id<=8?"Midtown":"Downtown"; const price=id<=4?350+id*80:id<=8?1100+id*170:2600+id*260; this.plots.push({id,name:`Plot ${id}`,zone,price,status:"empty",income:0,level:0,building:null,x:p.x,y:p.y,tileW:this.tileW,tileH:this.tileH}); id++; } }
  drawRoads(){ const g=this.scene.add.graphics().setDepth(0); const pts=[]; for(let i=-1;i<6;i++) pts.push(this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,i,1.5)); g.lineStyle(this.tileH*.72,0x1f2937,1); for(let i=0;i<pts.length-1;i++) g.lineBetween(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y); const pts2=[]; for(let i=-1;i<5;i++) pts2.push(this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,1.5,i)); g.lineStyle(this.tileH*.64,0x243244,1); for(let i=0;i<pts2.length-1;i++) g.lineBetween(pts2[i].x,pts2[i].y,pts2[i+1].x,pts2[i+1].y); g.lineStyle(3,0xf8fafc,.5); for(let i=0;i<pts.length-1;i++) if(i%2===0) g.lineBetween(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y); }
  drawSidewalks(){ const g=this.scene.add.graphics().setDepth(1); g.lineStyle(6,0x94a3b8,.5); for(const p of this.plots){ g.strokePoints([{x:p.x,y:p.y-this.tileH/2-8},{x:p.x+this.tileW/2+10,y:p.y}],false); } }
  renderPlots(){ for(const p of this.plots){ const view=new IsoPlot(this.scene,p); this.plotViews.set(p.id,view); } }
  addDecor(){ for(const p of this.plots){ if(p.id%2) new Tree(this.scene,p.x-this.tileW*.46,p.y+this.tileH*.15,this.scene.scale.width<600?.75:1); if(p.id%3===0) new Tree(this.scene,p.x+this.tileW*.42,p.y-this.tileH*.05,.72); } }
  addLife(){ const a=this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,-1,1.5), b=this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,5,1.5); new Vehicle(this.scene,[a,b,a],0xef4444); new Vehicle(this.scene,[this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,1.5,-.8),this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,1.5,4.2)],0x38bdf8); for(let i=0;i<5;i++) new Walker(this.scene,[this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,Math.random()*3.5,Math.random()*2.2),this.iso(this.origin.x,this.origin.y,this.tileW,this.tileH,Math.random()*3.5,Math.random()*2.2)]); }
  getPlot(id){ return this.plots.find(p=>p.id===id); }
  select(id){ this.selectedId=id; for(const p of this.plots) this.plotViews.get(p.id).render(p.id===id); return this.getPlot(id); }
  buy(id){ const p=this.getPlot(id); if(p.status!=="empty"||!this.economy.spend(p.price)) return false; p.status="owned"; p.income=0; this.refresh(p); return true; }
  build(id){ const p=this.getPlot(id); if(p.status!=="owned"||!this.economy.spend(Math.round(p.price*.65))) return false; p.status="under_construction"; p.building=BUILDINGS[(p.id-1)%BUILDINGS.length]; p.income=Math.round(p.price/8); p.level=1; this.refresh(p); this.startConstruction(p); this.scene.time.delayedCall(4500,()=>{ if(p.status==="under_construction"){ p.status="built"; this.stopConstruction(p); this.refresh(p); }}); return true; }
  upgrade(id){ const p=this.getPlot(id); if(p.status!=="built"||!this.economy.spend(p.level*650)) return false; p.level++; p.income=Math.round(p.income*1.45); this.refresh(p); return true; }
  collect(id){ const p=this.getPlot(id); if(p.status!=="built") return 0; const amount=p.income*p.level; this.economy.earn(amount); return amount; }
  sell(id){ const p=this.getPlot(id); if(p.status==="empty") return false; this.economy.earn(Math.round(p.price*.55)); this.stopConstruction(p); p.status="empty"; p.building=null; p.level=0; p.income=0; this.refresh(p); return true; }
  repair(){ return true; } workers(){ return true; }
  refresh(p){ this.plotViews.get(p.id).updateData(p,p.id===this.selectedId); const old=this.buildings.get(p.id); if(old){old.destroy(); this.buildings.delete(p.id);} if(p.status==="built") this.buildings.set(p.id,new IsoBuilding(this.scene,p)); }
  startConstruction(p){ const crane=this.scene.add.container(p.x,p.y-28).setDepth(p.y+100); const g=this.scene.add.graphics(); g.lineStyle(4,0xfacc15,1).lineBetween(0,0,0,-75).lineBetween(0,-75,42,-62).lineBetween(42,-62,42,-45); g.fillStyle(0xf59e0b,1).fillRect(-16,0,32,10); crane.add(g); this.scene.tweens.add({targets:crane,angle:{from:-4,to:5},duration:1200,yoyo:true,repeat:-1}); const dust=this.scene.add.particles(p.x,p.y,"__WHITE",{lifespan:700,speed:{min:10,max:45},scale:{start:.9,end:0},alpha:{start:.3,end:0},tint:0xd6a15f,frequency:80}); dust.setDepth(p.y+90); this.constructionFx.set(p.id,[crane,dust]); }
  stopConstruction(p){ (this.constructionFx.get(p.id)||[]).forEach(o=>o.destroy()); this.constructionFx.delete(p.id); }
}
