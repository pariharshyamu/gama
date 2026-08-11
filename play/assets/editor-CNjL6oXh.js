import{G as Ve,a as re,O as He,b as Ye,V as se,c as v,R as Je,P as Ge,L as Fe,E as We,C as Xe,F as qe,D as Qe,H as _e,M as Me,d as Ae,e as Ze,f as et,B as tt,g as at,h as De,i as nt,j as ot,k as dt,l as rt}from"./havenbrook-DyUp87XK.js";var st=`
.gama-ed {
  --ed-bg: #0b0e14; --ed-panel: #12161f; --ed-panel-2: #171c27;
  --ed-line: #262d3b; --ed-ink: #dbe4f0; --ed-dim: #8593a8;
  --ed-accent: #4d8dff; --ed-warn: #ffb454;
  position: absolute; inset: 0; display: grid;
  grid-template-rows: 44px 1fr 26px;
  background: var(--ed-bg); color: var(--ed-ink);
  font: 13px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.gama-ed *, .gama-ed *::before, .gama-ed *::after { box-sizing: border-box; }
.gama-ed button, .gama-ed select, .gama-ed input { font: inherit; color: inherit; }

.gama-ed .ed-bar {
  display: flex; align-items: center; gap: 10px; padding: 0 12px;
  background: var(--ed-panel); border-bottom: 1px solid var(--ed-line);
}
.gama-ed .ed-title { color: var(--ed-dim); margin-right: 8px; white-space: nowrap; }
.gama-ed .ed-title b { color: var(--ed-ink); font-weight: 700; letter-spacing: .04em; }
.gama-ed .ed-tools {
  display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;
  overflow-x: auto; scrollbar-width: thin;
}
.gama-ed .ed-tools button, .gama-ed .ed-palette button {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line); border-radius: 6px;
  padding: 5px 10px; cursor: pointer; white-space: nowrap;
}
.gama-ed .ed-tools button:hover:not(:disabled),
.gama-ed .ed-palette button:hover { border-color: var(--ed-accent); }
.gama-ed .ed-tools button:disabled { opacity: .4; cursor: default; }
.gama-ed .ed-tools label {
  color: var(--ed-dim); display: flex; align-items: center; gap: 5px; white-space: nowrap;
}
.gama-ed .ed-tools select {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line);
  border-radius: 6px; padding: 4px 6px;
}
.gama-ed .ed-sep { width: 1px; height: 22px; background: var(--ed-line); margin: 0 2px; }
.gama-ed .ed-spacer { flex: 1; }

.gama-ed .ed-body { display: grid; grid-template-columns: 176px 1fr 250px; min-height: 0; }
.gama-ed .ed-palette, .gama-ed .ed-inspector {
  background: var(--ed-panel); overflow-y: auto; padding: 10px;
}
.gama-ed .ed-palette { border-right: 1px solid var(--ed-line); }
.gama-ed .ed-inspector { border-left: 1px solid var(--ed-line); }
.gama-ed .ed-palette h4, .gama-ed .ed-inspector h4 {
  margin: 12px 0 6px; font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ed-dim); font-weight: 600;
}
.gama-ed .ed-palette h4:first-child, .gama-ed .ed-inspector h4:first-child { margin-top: 0; }
.gama-ed .ed-palette button { display: block; width: 100%; text-align: left; margin-bottom: 4px; }
.gama-ed .ed-palette button[aria-pressed='true'] {
  border-color: var(--ed-accent); background: #4d8dff22; color: #fff;
}

.gama-ed .ed-stage { position: relative; min-width: 0; }
.gama-ed .ed-viewport { position: absolute; inset: 0; }
.gama-ed .ed-viewport canvas { display: block; touch-action: none; }
.gama-ed .ed-hint {
  position: absolute; left: 12px; bottom: 12px; padding: 6px 10px; border-radius: 6px;
  background: #0b0e14cc; border: 1px solid var(--ed-line); color: var(--ed-dim);
  pointer-events: none; max-width: 62%;
}
.gama-ed .ed-hint b { color: var(--ed-ink); }
.gama-ed .ed-hint.armed { color: var(--ed-ink); border-color: var(--ed-accent); }

.gama-ed .ed-row {
  display: grid; grid-template-columns: 62px 1fr; align-items: center;
  gap: 6px; margin-bottom: 5px;
}
.gama-ed .ed-row > label { color: var(--ed-dim); overflow: hidden; text-overflow: ellipsis; }
.gama-ed .ed-row input, .gama-ed .ed-row select {
  width: 100%; background: var(--ed-panel-2); border: 1px solid var(--ed-line);
  border-radius: 5px; padding: 4px 6px; min-width: 0;
}
.gama-ed .ed-row input[type='color'] { padding: 2px; height: 26px; }
.gama-ed .ed-triple { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.gama-ed .ed-readonly {
  color: var(--ed-ink); font-family: ui-monospace, Menlo, monospace;
  font-size: 12px; word-break: break-all;
}
.gama-ed .ed-empty { color: var(--ed-dim); padding: 6px 0; }

.gama-ed .ed-status {
  display: flex; align-items: center; gap: 14px; padding: 0 12px;
  background: var(--ed-panel); border-top: 1px solid var(--ed-line);
  color: var(--ed-dim); font-size: 12px; white-space: nowrap; overflow: hidden;
}
.gama-ed .ed-status b { color: var(--ed-ink); font-weight: 600; }

.gama-ed dialog {
  background: var(--ed-panel); color: var(--ed-ink); border: 1px solid var(--ed-line);
  border-radius: 10px; padding: 18px 22px; max-width: 460px;
}
.gama-ed dialog::backdrop { background: #0008; }
.gama-ed kbd {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line); border-bottom-width: 2px;
  border-radius: 4px; padding: 1px 5px; font: 11px ui-monospace, Menlo, monospace;
}
.gama-ed dialog dl {
  display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; margin: 10px 0 0;
}
.gama-ed dialog dd { margin: 0; color: var(--ed-dim); }

@media (max-width: 900px) {
  .gama-ed .ed-body { grid-template-columns: 132px 1fr 200px; }
}
`,it=`
<header class="ed-bar">
  <span class="ed-title"><b data-ed="brand"></b> <span data-ed="subtitle"></span></span>
  <div class="ed-tools">
    <button data-act="new">New</button>
    <button data-act="open">Open…</button>
    <button data-act="save">Save</button>
    <button data-act="copy">Copy</button>
    <span class="ed-sep"></span>
    <button data-act="undo" data-ed="undo">Undo</button>
    <button data-act="redo" data-ed="redo">Redo</button>
    <span class="ed-sep"></span>
    <label>Grid
      <select data-ed="snap">
        <option value="0">free</option><option value="0.25">0.25</option>
        <option value="0.5" selected>0.5</option><option value="1">1</option>
        <option value="2">2</option>
      </select>
    </label>
    <label>Angle
      <select data-ed="angle">
        <option value="0">free</option><option value="15" selected>15°</option>
        <option value="45">45°</option><option value="90">90°</option>
      </select>
    </label>
    <span class="ed-spacer"></span>
    <span data-ed="extras"></span>
    <button data-act="help">Keys</button>
  </div>
</header>
<div class="ed-body">
  <aside class="ed-palette" data-ed="palette"></aside>
  <section class="ed-stage">
    <div class="ed-viewport" data-ed="viewport"></div>
    <div class="ed-hint" data-ed="hint"></div>
  </section>
  <aside class="ed-inspector" data-ed="inspector"></aside>
</div>
<footer class="ed-status" data-ed="status"></footer>
<input type="file" data-ed="file" accept="application/json,.json" hidden />
<dialog data-ed="help">
  <h3 style="margin:0">Keys</h3>
  <dl>
    <dt><kbd>click</kbd></dt><dd>select · <kbd>shift</kbd> adds</dd>
    <dt><kbd>drag</kbd></dt><dd>move along the ground</dd>
    <dt><kbd>right-drag</kbd> / <kbd>wheel</kbd></dt><dd>orbit · zoom</dd>
    <dt><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></dt><dd>pan the camera</dd>
    <dt><kbd>arrows</kbd></dt><dd>nudge · <kbd>shift</kbd> fine · <kbd>PgUp/PgDn</kbd> height</dd>
    <dt><kbd>Q</kbd> <kbd>E</kbd></dt><dd>rotate</dd>
    <dt><kbd>[</kbd> <kbd>]</kbd></dt><dd>scale</dd>
    <dt><kbd>G</kbd></dt><dd>drop to the ground</dd>
    <dt><kbd>Tab</kbd></dt><dd>cycle through the level</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>D</kbd></dt><dd>duplicate</dd>
    <dt><kbd>Del</kbd></dt><dd>delete</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Y</kbd></dt><dd>undo · redo</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>S</kbd></dt><dd>save the level file</dd>
    <dt><kbd>Esc</kbd></dt><dd>put the palette down / deselect</dd>
  </dl>
  <p style="color:var(--ed-dim)">
    Everything you place is stored as a placement — a kind, a transform and a few
    props — never as geometry.
  </p>
  <form method="dialog"><button style="margin-top:6px">Close</button></form>
</dialog>
`,ie=o=>Math.round(o*1e3)/1e3,lt=o=>`#${(o&16777215).toString(16).padStart(6,"0")}`,Pe=!1;function ct(o){const{catalog:i,container:c=document.body,storageKey:p="gama.editor.level",brand:M="GAMA",subtitle:x="Level editor",release:A}=o;if(!Pe){const e=document.createElement("style");e.textContent=st,document.head.append(e),Pe=!0}const O=document.createElement("div");O.className="gama-ed",O.innerHTML=it,getComputedStyle(c).position==="static"&&(c.style.position="relative"),c.append(O);const m=e=>O.querySelector(`[data-ed="${e}"]`);m("brand").textContent=M,m("subtitle").textContent=x;const H=m("viewport"),q=m("palette"),u=m("inspector"),pe=m("hint"),Be=m("status"),Y=m("snap"),J=m("angle"),G=m("file");o.snap!==void 0&&(Y.value=String(o.snap)),o.snapAngle!==void 0&&(J.value=String(o.snapAngle));const w=new Ve({parent:H,autoResize:!1,antialias:!0}),B=w.world.scene,R=w.camera;w.renderer.shadowMap.enabled=!0;const E=new re;E.name="gizmos",B.add(E);let k=new re;k.name="level",B.add(k);const S=new He;B.add(S);const L={pointerDelta:new se,wheelDelta:0,pointerDown:!1},Q=new Ye(R,S,L,{distance:o.distance??30,minDistance:4,maxDistance:Math.max(160,(o.distance??30)*3),pitch:o.pitch??.72,yaw:o.yaw??.5,maxPitch:1.45,stiffness:14,lookOffset:new v(0,1.5,0)}),ue=()=>{const e=H.clientWidth||1,t=H.clientHeight||1;w.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),w.renderer.setSize(e,t,!0),R.aspect=e/t,R.updateProjectionMatrix()},me=new ResizeObserver(ue);me.observe(H),ue();let C,a,j="Untitled",_=1,ge,f=null,T=null;const F={get game(){return w},get editor(){return a},get level(){return C},get root(){return k},pivot:S,load:z,toJSON:I,download:oe,refresh:K,dispose:Ue};function I(){return{...a.toJSON(),name:j,seed:_,meta:ge}}function z(e){C?.dispose(),B.remove(k),k=new re,k.name="level",B.add(k);const t=Fe.parse(e);j=t.name??"Untitled",_=t.seed,ge=t.meta,C=t.instantiate(i,k,{release:A}),a=new We(C,{snap:Number(Y.value),snapAngle:Number(J.value)*Math.PI/180,onChange:()=>K()}),f=null,K()}function K(){if(T){Z(),ne();return}Re(),Oe(),Z(),Ne(),ne(),o.onChange?.(F,I())}function Re(){for(const e of E.children){const t=e;t.geometry.dispose(),t.material.dispose()}E.clear();for(const e of a.selected){e.object.updateWorldMatrix(!0,!0);const t=new tt(e.object,5082623);t.material.depthTest=!1,t.renderOrder=2,E.add(t)}}function Ke(){const e=new Map;for(const t of i.list()){const n=t.group??"Other";let d=e.get(n);if(!d){const P=document.createElement("h4");P.textContent=n,q.append(P),d=document.createElement("div"),q.append(d),e.set(n,d)}const l=document.createElement("button");l.textContent=t.label,l.dataset.kind=t.kind,l.title=t.prefab?`recipe — expands to ${t.kind}`:t.kind,l.addEventListener("click",()=>{f=f===t.kind?null:t.kind,K()}),d.append(l)}}function Ne(){for(const e of q.querySelectorAll("button"))e.setAttribute("aria-pressed",String(e.dataset.kind===f));pe.classList.toggle("armed",!!f),pe.innerHTML=f?`Click the ground to place <b>${f}</b> — <kbd>Esc</kbd> to put it down`:a.selection.length?`<b>${a.selection.join(", ")}</b> — drag to move · <b>Q</b>/<b>E</b> turn · <b>[</b>/<b>]</b> scale · <b>Del</b>`:"Click a thing to select it, or pick something from the palette"}function h(e,t){const n=document.createElement("div");n.className="ed-row";const d=document.createElement("label");return d.textContent=e,n.append(d,t),n}function U(e,t,n){const d=document.createElement("input");return d.type="number",d.step=String(t),d.value=String(ie(e)),d.addEventListener("change",()=>{const l=Number(d.value);Number.isFinite(l)&&n(l)}),d}function be(e){const[t,n]=[a.snap,a.snapAngle];a.snap=0,a.snapAngle=0,e(),a.commit(),a.snap=t,a.snapAngle=n}function Oe(){u.replaceChildren();const e=a.focused;if(!e){const r=document.createElement("h4");r.textContent="Level",u.append(r);const g=document.createElement("input");g.value=j,g.addEventListener("change",()=>{j=g.value,ne(),Z()}),u.append(h("name",g)),u.append(h("seed",U(_,1,s=>z({...I(),seed:Math.round(s)}))));const b=document.createElement("div");b.className="ed-empty",b.textContent=a.selection.length?`${a.selection.length} selected — pick one to edit its props.`:"Nothing selected.",u.append(b);return}const t=e.object,n=i.info(e.kind),d=document.createElement("h4");d.textContent=n?.label??e.kind,u.append(d);const l=document.createElement("div");l.className="ed-readonly",l.textContent=`${e.id}  ·  ${e.kind}`,u.append(h("id",l));const P=document.createElement("div");P.className="ed-triple";for(const r of["x","y","z"])P.append(U(t.position[r],.1,g=>{const b=t.position.clone();b[r]=g,be(()=>a.moveTo(b.x,b.y,b.z))}));u.append(h("position",P)),u.append(h("yaw°",U(t.rotation.y*180/Math.PI,5,r=>be(()=>a.rotate(r*Math.PI/180-t.rotation.y))))),u.append(h("scale",U(t.scale.x,.1,r=>a.setScale(Math.max(.01,r)))));const V=document.createElement("input");if(V.value=e.tags.join(", "),V.placeholder="spawn, pickup…",V.addEventListener("change",()=>a.setTags(V.value.split(",").map(r=>r.trim()).filter(Boolean))),u.append(h("tags",V)),!n?.fields.length)return;const Ce=document.createElement("h4");Ce.textContent="Props",u.append(Ce);const $e={...n.defaults,...C.specs.find(r=>r.id===e.id)?.props??{}};for(const r of n.fields){const g=$e[r.key],b=r.label??r.key;if(r.type==="color"){const s=document.createElement("input");s.type="color",s.value=lt(typeof g=="number"?g:16777215),s.addEventListener("change",()=>a.setProps({[r.key]:parseInt(s.value.slice(1),16)})),u.append(h(b,s))}else if(r.type==="select"){const s=document.createElement("select");for(const X of r.options??[]){const de=document.createElement("option");de.value=X,de.textContent=X,s.append(de)}s.value=String(g??r.options?.[0]??""),s.addEventListener("change",()=>a.setProps({[r.key]:s.value})),u.append(h(b,s))}else if(r.type==="boolean"){const s=document.createElement("input");s.type="checkbox",s.checked=!!g,s.addEventListener("change",()=>a.setProps({[r.key]:s.checked})),u.append(h(b,s))}else if(r.type==="number"){const s=U(typeof g=="number"?g:0,r.step??.1,X=>a.setProps({[r.key]:X}));r.min!==void 0&&(s.min=String(r.min)),r.max!==void 0&&(s.max=String(r.max)),u.append(h(b,s))}else{const s=document.createElement("input");s.value=String(g??""),s.addEventListener("change",()=>a.setProps({[r.key]:s.value})),u.append(h(b,s))}}}function Z(){const e=a.toJSON(),t=e.entities.filter(l=>!i.has(l.kind)).length;Be.innerHTML=`<span><b>${j}</b></span><span><b>${e.entities.length}</b> entities · <b>${C.objects.length}</b> built`+(t?` · <b style="color:var(--ed-warn)">${t}</b> unknown kind`:"")+`</span><span>selection <b>${a.selection.length||"—"}</b></span><span>undo <b>${a.undoLabel??"—"}</b></span><span>${JSON.stringify(e).length} bytes</span>`;const n=m("undo"),d=m("redo");n.disabled=!a.canUndo,d.disabled=!a.canRedo,n.textContent=a.canUndo?`Undo ${a.undoLabel}`:"Undo",d.textContent=a.canRedo?`Redo ${a.redoLabel}`:"Redo"}const ee=new Je,je=new se,fe=new Ge(new v(0,1,0),0),he=new v;let W=new v,$=!1,te=!1;const N=new se,y=w.renderer.domElement,we=e=>{const t=y.getBoundingClientRect();return je.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)};function ae(e,t=0,n=!0){if(ee.setFromCamera(we(e),R),n){const d=ee.intersectObject(k,!0);if(d.length)return d[0].point.clone()}return fe.constant=-t,ee.ray.intersectPlane(fe,he)?he.clone():null}const ve=e=>a.snap>0?Math.round(e/a.snap)*a.snap:ie(e);y.addEventListener("contextmenu",e=>e.preventDefault()),y.addEventListener("pointerdown",e=>{if(y.setPointerCapture(e.pointerId),N.set(e.clientX,e.clientY),e.button===2||e.button===1){$=!e.shiftKey&&e.button===2,te=!$,L.pointerDown=$;return}if(e.button!==0)return;if(f){const l=ae(e);l&&(a.place({kind:f,at:[ve(l.x),ie(l.y),ve(l.z)]}),e.shiftKey||(f=null),K());return}const t=we(e),n=a.pick(t.x,t.y,R);if(!n){e.shiftKey||a.select(null);return}e.shiftKey?a.select(n.id,{toggle:!0}):a.isSelected(n.id)||a.select(n.id);const d=ae(e,n.object.position.y,!1);!d||!a.selection.length||(W=d,T=new Map(a.selected.map(l=>[l.id,l.object.position.clone()])))}),y.addEventListener("pointermove",e=>{if($){L.pointerDelta.set(e.clientX-N.x,e.clientY-N.y),N.set(e.clientX,e.clientY);return}if(te){const n=(e.clientX-N.x)*Q.distance*.0016,d=(e.clientY-N.y)*Q.distance*.0016,l=new v().setFromMatrixColumn(R.matrixWorld,0).setY(0).normalize(),P=new v().crossVectors(new v(0,1,0),l);S.position.addScaledVector(l,-n).addScaledVector(P,-d),N.set(e.clientX,e.clientY);return}if(!T)return;const t=ae(e,W.y,!1);if(t){for(const[n,d]of T)C.byId(n)?.object.position.copy(d);a.move(t.x-W.x,0,t.z-W.z)}});const xe=e=>{T&&(T=null,a.commit(),K()),$=te=!1,L.pointerDown=!1,L.pointerDelta.set(0,0),y.releasePointerCapture?.(e.pointerId)};y.addEventListener("pointerup",xe),y.addEventListener("pointercancel",xe),y.addEventListener("wheel",e=>{e.preventDefault(),L.wheelDelta=e.deltaY},{passive:!1});const D=new Set,Te=e=>e.target?.matches?.("input, select, textarea"),ke=e=>{if(Te(e))return;D.add(e.code);const t=e.ctrlKey||e.metaKey;if(t&&e.code==="KeyZ")return e.shiftKey?a.redo():a.undo(),e.preventDefault();if(t&&e.code==="KeyY")return a.redo(),e.preventDefault();if(t&&e.code==="KeyD")return a.duplicate(),e.preventDefault();if(t&&e.code==="KeyS")return oe(),e.preventDefault();if(t&&e.code==="KeyA")return a.selectAll(),e.preventDefault();if(t)return;const n=e.shiftKey?.05:a.snap||.25;switch(e.code){case"Escape":f?f=null:a.select(null),K();break;case"Tab":a.selectNext(e.shiftKey?-1:1);break;case"Delete":case"Backspace":a.remove();break;case"ArrowLeft":a.move(-n,0,0);break;case"ArrowRight":a.move(n,0,0);break;case"ArrowUp":a.move(0,0,-n);break;case"ArrowDown":a.move(0,0,n);break;case"PageUp":a.move(0,n,0);break;case"PageDown":a.move(0,-n,0);break;case"KeyQ":a.rotate(a.snapAngle||.08);break;case"KeyE":a.rotate(-(a.snapAngle||.08));break;case"BracketRight":a.scaleBy(1.1);break;case"BracketLeft":a.scaleBy(1/1.1);break;case"KeyG":a.ground();break;default:return}e.preventDefault()},ye=e=>{D.delete(e.code),a.commit()},Ee=()=>D.clear();window.addEventListener("keydown",ke),window.addEventListener("keyup",ye),window.addEventListener("blur",Ee);let Se=0;function ne(){p&&(clearTimeout(Se),Se=window.setTimeout(()=>{try{localStorage.setItem(p,JSON.stringify(I()))}catch{}},400))}function oe(){const e=new Blob([`${JSON.stringify(I(),null,2)}
`],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`${j.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"level"}.json`,t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),1e3)}G.addEventListener("change",async()=>{const e=G.files?.[0];if(e){try{z(JSON.parse(await e.text()))}catch(t){alert(`That did not load: ${t.message}`)}G.value=""}});const Ie=m("extras");for(const e of o.actions??[]){const t=document.createElement("button");t.textContent=e.label,e.title&&(t.title=e.title),t.addEventListener("click",()=>e.run(F)),Ie.append(t)}O.querySelector(".ed-tools").addEventListener("click",e=>{const t=e.target.closest("[data-act]")?.dataset.act;t==="new"?z({format:"gama.level",version:1,name:"Untitled",entities:[]}):t==="open"?G.click():t==="save"?oe():t==="copy"?navigator.clipboard?.writeText(JSON.stringify(I(),null,2)):t==="undo"?a.undo():t==="redo"?a.redo():t==="help"&&m("help").showModal()}),Y.addEventListener("change",()=>{a.snap=Number(Y.value)}),J.addEventListener("change",()=>{a.snapAngle=Number(J.value)*Math.PI/180});const ze=w.onUpdate(e=>{if(D.size){const t=26*e.delta,n=new v().setFromMatrixColumn(R.matrixWorld,0).setY(0).normalize(),d=new v().crossVectors(new v(0,1,0),n);D.has("KeyA")&&S.position.addScaledVector(n,-t),D.has("KeyD")&&S.position.addScaledVector(n,t),D.has("KeyW")&&S.position.addScaledVector(d,t),D.has("KeyS")&&S.position.addScaledVector(d,-t)}Q.update(e.delta),L.pointerDelta.set(0,0),L.wheelDelta=0;for(const t of E.children)t.update()});function Ue(){for(const e of E.children){const t=e;t.geometry.dispose(),t.material.dispose()}E.clear(),ze(),w.stop(),me.disconnect(),window.removeEventListener("keydown",ke),window.removeEventListener("keyup",ye),window.removeEventListener("blur",Ee),C?.dispose(),O.remove()}Ke(),o.decorate?o.decorate(B,F):pt(B);let Le=o.level;if(p)try{const e=localStorage.getItem(p);e&&(Le=JSON.parse(e))}catch{}try{z(Le??{format:"gama.level",version:1,name:"Untitled",entities:[]})}catch{z(o.level??{format:"gama.level",version:1,name:"Untitled",entities:[]})}return w.start(),F}function pt(o){o.background=new Xe(988192),o.fog=new qe(988192,70,200);const i=new Qe(16773852,2.5);i.position.set(24,34,16),i.castShadow=!0,i.shadow.mapSize.set(2048,2048),i.shadow.camera.left=-50,i.shadow.camera.right=50,i.shadow.camera.top=50,i.shadow.camera.bottom=-50,i.shadow.camera.far=120,i.shadow.bias=-8e-4,o.add(i,new _e(11060968,4871488,1.7));const c=new Me(new Ae(400,400),new Ze({color:4478266,roughness:1}));c.rotation.x=-Math.PI/2,c.position.y=-.01,c.receiveShadow=!0,o.add(c);const p=new et(120,120,7053567,3360094);p.material.transparent=!0,p.material.opacity=.4,o.add(p)}const ut=new URLSearchParams(location.search).has("leak"),ce=ct({release:!ut,storageKey:null,catalog:at({preview:!0}),container:document.getElementById("app"),level:De,brand:"HAVENBROOK",subtitle:"level editor",snap:.5,snapAngle:15,distance:46,pitch:.62,decorate(o){const i=nt({palette:rt.meadow}),c=ot("day");o.add(i.mesh,c.group);const p=new Me(new Ae(600,600),dt("moss",{seed:7}));p.rotation.x=-Math.PI/2,p.position.y=-.02,p.receiveShadow=!0,o.add(p)},actions:[{label:"Playtest",title:"Open the game on this level (save it into src/levels first)",run:()=>window.open("./index.html?level=havenbrook","_blank")},{label:"Reload from disk",title:"Throw away browser edits and reopen src/levels/havenbrook.json",run:o=>o.load(De)}]}),le=()=>new Promise(o=>requestAnimationFrame(()=>o()));window.editorStress=async o=>{const{editor:i,game:c}=ce;i.select("house-1");const p=()=>ce.level.byId("house-1")?.object.traverse(A=>{A.frustumCulled=!1});p(),await le(),await le();const M={...c.renderer.info.memory};for(let A=0;A<o;A++)i.setProps({width:4.5+A%7*.25}),p(),await le();const x={...c.renderer.info.memory};return{times:o,geometriesBefore:M.geometries,geometriesAfter:x.geometries,texturesBefore:M.textures,texturesAfter:x.textures,leaked:x.geometries-M.geometries}};window.editorDebug=()=>{const{editor:o,level:i,game:c}=ce,p=o.toJSON(),M=x=>i.byId(x)?.source;return{entities:p.entities.length,built:i.objects.length,kinds:document.querySelectorAll(".ed-palette button").length,addresses:i.byTag("address").length,depots:i.byTag("depot").length,waypoints:i.byTag("waypoint").length,blockers:i.objects.filter(x=>x.source?.obstacleRadius).length,houseRadius:M("house-1")?.obstacleRadius??null,selection:o.selection,undo:o.undoLabel,draws:c.renderer.info.render.calls,triangles:c.renderer.info.render.triangles,geometries:c.renderer.info.memory.geometries,textures:c.renderer.info.memory.textures}};
