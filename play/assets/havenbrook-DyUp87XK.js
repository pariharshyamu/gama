(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ho="185",Mu=0,Cl=1,Su=2,mr=1,wu=2,xs=3,si=0,Je=1,tn=2,Vn=0,$i=1,yi=2,Pl=3,Il=4,Au=5,gi=100,Tu=101,Eu=102,Ru=103,Cu=104,Pu=200,Iu=201,Lu=202,Du=203,Ha=204,Ga=205,Nu=206,Uu=207,Fu=208,Ou=209,ku=210,Bu=211,zu=212,Vu=213,Hu=214,Wa=0,Xa=1,qa=2,Zi=3,Ya=4,$a=5,Ka=6,Ja=7,lh=0,Gu=1,Wu=2,Pn=0,ch=1,hh=2,uh=3,dh=4,fh=5,ph=6,mh=7,Ll="attached",Xu="detached",gh=300,bi=301,Qi=302,Xr=303,qr=304,Or=306,Za=1e3,zn=1001,Qa=1002,Ve=1003,qu=1004,Us=1005,Ye=1006,Yr=1007,vi=1008,on=1009,_h=1010,vh=1011,Ts=1012,Go=1013,Dn=1014,vn=1015,Gn=1016,Wo=1017,Xo=1018,Es=1020,xh=35902,yh=35899,bh=1021,Mh=1022,ln=1023,Wn=1026,xi=1027,Sh=1028,qo=1029,Mi=1030,Yo=1031,$o=1033,gr=33776,_r=33777,vr=33778,xr=33779,ja=35840,to=35841,eo=35842,no=35843,io=36196,so=37492,ro=37496,ao=37488,oo=37489,Mr=37490,lo=37491,co=37808,ho=37809,uo=37810,fo=37811,po=37812,mo=37813,go=37814,_o=37815,vo=37816,xo=37817,yo=37818,bo=37819,Mo=37820,So=37821,wo=36492,Ao=36494,To=36495,Eo=36283,Ro=36284,Sr=36285,Co=36286,wh=2200,Po=2201,Yu=2202,wr=2300,Io=2301,$r=2302,Dl=2303,qi=2400,Yi=2401,Ar=2402,Ko=2500,$u=2501,Ku=3200,Lo=0,Ju=1,ni="",un="srgb",Tr="srgb-linear",Er="linear",he="srgb",Ei=7680,Nl=519,Zu=512,Qu=513,ju=514,Jo=515,td=516,ed=517,Zo=518,nd=519,Do=35044,Ul="300 es",Cn=2e3,Rs=2001;function id(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function sd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function rd(){const i=Rr("canvas");return i.style.display="block",i}const Fl={};function Cr(...i){const t="THREE."+i.shift();console.log(t,...i)}function Ah(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function It(...i){i=Ah(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ft(...i){i=Ah(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Ki(...i){const t=i.join(" ");t in Fl||(Fl[t]=!0,It(...i))}function ad(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const od={[Wa]:Xa,[qa]:Ka,[Ya]:Ja,[Zi]:$a,[Xa]:Wa,[Ka]:qa,[Ja]:Ya,[$a]:Zi};class ai{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ol=1234567;const bs=Math.PI/180,Cs=180/Math.PI;function xn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]).toLowerCase()}function Jt(i,t,e){return Math.max(t,Math.min(e,i))}function Qo(i,t){return(i%t+t)%t}function ld(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function cd(i,t,e){return i!==t?(e-i)/(t-i):0}function Ms(i,t,e){return(1-e)*i+e*t}function hd(i,t,e,n){return Ms(i,t,1-Math.exp(-e*n))}function ud(i,t=1){return t-Math.abs(Qo(i,t*2)-t)}function dd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function fd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function pd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function md(i,t){return i+Math.random()*(t-i)}function gd(i){return i*(.5-Math.random())}function _d(i){i!==void 0&&(Ol=i);let t=Ol+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function vd(i){return i*bs}function xd(i){return i*Cs}function yd(i){return(i&i-1)===0&&i!==0}function bd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Md(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Sd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*f,o*h,o*c);break;default:It("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function _n(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Kr={DEG2RAD:bs,RAD2DEG:Cs,generateUUID:xn,clamp:Jt,euclideanModulo:Qo,mapLinear:ld,inverseLerp:cd,lerp:Ms,damp:hd,pingpong:ud,smoothstep:dd,smootherstep:fd,randInt:pd,randFloat:md,randFloatSpread:gd,seededRandom:_d,degToRad:vd,radToDeg:xd,isPowerOfTwo:yd,ceilPowerOfTwo:bd,floorPowerOfTwo:Md,setQuaternionFromProperEuler:Sd,normalize:ue,denormalize:_n};class mt{static{mt.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ee{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],p=r[a+2],v=r[a+3];if(d!==v||l!==u||c!==f||h!==p){let m=l*u+c*f+h*p+d*v;m<0&&(u=-u,f=-f,p=-p,v=-v,m=-m);let g=1-o;if(m<.9995){const b=Math.acos(m),S=Math.sin(b);g=Math.sin(g*b)/S,o=Math.sin(o*b)/S,l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+v*o}else{l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+v*o;const b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:It("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{static{I.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Jr.copy(this).projectOnVector(t),this.sub(Jr)}reflect(t){return this.sub(Jr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jr=new I,kl=new Ee;class Vt{static{Vt.prototype.isMatrix3=!0}constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],v=s[0],m=s[3],g=s[6],b=s[1],S=s[4],x=s[7],A=s[2],M=s[5],T=s[8];return r[0]=a*v+o*b+l*A,r[3]=a*m+o*S+l*M,r[6]=a*g+o*x+l*T,r[1]=c*v+h*b+d*A,r[4]=c*m+h*S+d*M,r[7]=c*g+h*x+d*T,r[2]=u*v+f*b+p*A,r[5]=u*m+f*S+p*M,r[8]=u*g+f*x+p*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,p=e*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(o*n-s*a)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Ki("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zr.makeScale(t,e)),this}rotate(t){return Ki("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zr.makeRotation(-t)),this}translate(t,e){return Ki("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zr=new Vt,Bl=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zl=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wd(){const i={enabled:!0,workingColorSpace:Tr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===he&&(s.r=Hn(s.r),s.g=Hn(s.g),s.b=Hn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ni?Er:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ki("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ki("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Tr]:{primaries:t,whitePoint:n,transfer:Er,toXYZ:Bl,fromXYZ:zl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:t,whitePoint:n,transfer:he,toXYZ:Bl,fromXYZ:zl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}const te=wd();function Hn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ri;class Ad{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ri===void 0&&(Ri=Rr("canvas")),Ri.width=t.width,Ri.height=t.height;const s=Ri.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ri}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Rr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Hn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Hn(e[n]/255)*255):e[n]=Hn(e[n]);return{data:e,width:t.width,height:t.height}}else return It("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Td=0;class jo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=xn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Qr(s[a].image)):r.push(Qr(s[a]))}else r=Qr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Qr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ad.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(It("Texture: Unable to serialize Texture."),{})}let Ed=0;const jr=new I;class Ze extends ai{constructor(t=Ze.DEFAULT_IMAGE,e=Ze.DEFAULT_MAPPING,n=zn,s=zn,r=Ye,a=vi,o=ln,l=on,c=Ze.DEFAULT_ANISOTROPY,h=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=xn(),this.name="",this.source=new jo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){It(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){It(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==gh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Za:t.x=t.x-Math.floor(t.x);break;case zn:t.x=t.x<0?0:1;break;case Qa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Za:t.y=t.y-Math.floor(t.y);break;case zn:t.y=t.y<0?0:1;break;case Qa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ze.DEFAULT_IMAGE=null;Ze.DEFAULT_MAPPING=gh;Ze.DEFAULT_ANISOTROPY=1;class ge{static{ge.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],v=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,x=(f+1)/2,A=(g+1)/2,M=(h+u)/4,T=(d+v)/4,_=(p+m)/4;return S>x&&S>A?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=M/n,r=T/n):x>A?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=M/s,r=_/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=T/r,s=_/r),this.set(n,s,r,e),this}let b=Math.sqrt((m-p)*(m-p)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(m-p)/b,this.y=(d-v)/b,this.z=(u-h)/b,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this.w=Jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this.w=Jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Rd extends ai{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ye,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Ze(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Ye,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new jo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class In extends Rd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Th extends Ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cd extends Ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qt{static{qt.prototype.isMatrix4=!0}constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,p,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,v,m)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Ci.setFromMatrixColumn(t,0).length(),r=1/Ci.setFromMatrixColumn(t,1).length(),a=1/Ci.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,v=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-v*c,e[9]=-o*l,e[2]=v-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,v=c*d;e[0]=u+v*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=v+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,v=c*d;e[0]=u-v*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=v-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,v=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,v=o*c;e[0]=l*h,e[4]=v-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-v*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,v=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Pd,t,Id)}lookAt(t,e,n){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),Jn.crossVectors(n,rn),Jn.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),Jn.crossVectors(n,rn)),Jn.normalize(),Fs.crossVectors(rn,Jn),s[0]=Jn.x,s[4]=Fs.x,s[8]=rn.x,s[1]=Jn.y,s[5]=Fs.y,s[9]=rn.y,s[2]=Jn.z,s[6]=Fs.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],v=n[6],m=n[10],g=n[14],b=n[3],S=n[7],x=n[11],A=n[15],M=s[0],T=s[4],_=s[8],E=s[12],P=s[1],C=s[5],L=s[9],B=s[13],H=s[2],O=s[6],X=s[10],D=s[14],q=s[3],V=s[7],K=s[11],it=s[15];return r[0]=a*M+o*P+l*H+c*q,r[4]=a*T+o*C+l*O+c*V,r[8]=a*_+o*L+l*X+c*K,r[12]=a*E+o*B+l*D+c*it,r[1]=h*M+d*P+u*H+f*q,r[5]=h*T+d*C+u*O+f*V,r[9]=h*_+d*L+u*X+f*K,r[13]=h*E+d*B+u*D+f*it,r[2]=p*M+v*P+m*H+g*q,r[6]=p*T+v*C+m*O+g*V,r[10]=p*_+v*L+m*X+g*K,r[14]=p*E+v*B+m*D+g*it,r[3]=b*M+S*P+x*H+A*q,r[7]=b*T+S*C+x*O+A*V,r[11]=b*_+S*L+x*X+A*K,r[15]=b*E+S*B+x*D+A*it,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],v=t[7],m=t[11],g=t[15],b=l*f-c*u,S=o*f-c*d,x=o*u-l*d,A=a*f-c*h,M=a*u-l*h,T=a*d-o*h;return e*(v*b-m*S+g*x)-n*(p*b-m*A+g*M)+s*(p*S-v*A+g*T)-r*(p*x-v*M+m*T)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],v=t[13],m=t[14],g=t[15],b=e*o-n*a,S=e*l-s*a,x=e*c-r*a,A=n*l-s*o,M=n*c-r*o,T=s*c-r*l,_=h*v-d*p,E=h*m-u*p,P=h*g-f*p,C=d*m-u*v,L=d*g-f*v,B=u*g-f*m,H=b*B-S*L+x*C+A*P-M*E+T*_;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/H;return t[0]=(o*B-l*L+c*C)*O,t[1]=(s*L-n*B-r*C)*O,t[2]=(v*T-m*M+g*A)*O,t[3]=(u*M-d*T-f*A)*O,t[4]=(l*P-a*B-c*E)*O,t[5]=(e*B-s*P+r*E)*O,t[6]=(m*x-p*T-g*S)*O,t[7]=(h*T-u*x+f*S)*O,t[8]=(a*L-o*P+c*_)*O,t[9]=(n*P-e*L-r*_)*O,t[10]=(p*M-v*x+g*b)*O,t[11]=(d*x-h*M-f*b)*O,t[12]=(o*E-a*C-l*_)*O,t[13]=(e*C-n*E+s*_)*O,t[14]=(v*S-p*A-m*b)*O,t[15]=(h*A-d*S+u*b)*O,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,p=r*d,v=a*h,m=a*d,g=o*d,b=l*c,S=l*h,x=l*d,A=n.x,M=n.y,T=n.z;return s[0]=(1-(v+g))*A,s[1]=(f+x)*A,s[2]=(p-S)*A,s[3]=0,s[4]=(f-x)*M,s[5]=(1-(u+g))*M,s[6]=(m+b)*M,s[7]=0,s[8]=(p+S)*T,s[9]=(m-b)*T,s[10]=(1-(u+v))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Ci.set(s[0],s[1],s[2]).length();const o=Ci.set(s[4],s[5],s[6]).length(),l=Ci.set(s[8],s[9],s[10]).length();r<0&&(a=-a),fn.copy(this);const c=1/a,h=1/o,d=1/l;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=d,fn.elements[9]*=d,fn.elements[10]*=d,e.setFromRotationMatrix(fn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=Cn,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let p,v;if(l)p=r/(a-r),v=a*r/(a-r);else if(o===Cn)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Rs)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Cn,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s);let p,v;if(l)p=1/(a-r),v=a/(a-r);else if(o===Cn)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===Rs)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ci=new I,fn=new qt,Pd=new I(0,0,0),Id=new I(1,1,1),Jn=new I,Fs=new I,rn=new I,Vl=new qt,Hl=new Ee;class ri{constructor(t=0,e=0,n=0,s=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Jt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:It("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Vl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Vl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Hl.setFromEuler(this),this.setFromQuaternion(Hl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class tl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ld=0;const Gl=new I,Pi=new Ee,Nn=new qt,Os=new I,rs=new I,Dd=new I,Nd=new Ee,Wl=new I(1,0,0),Xl=new I(0,1,0),ql=new I(0,0,1),Yl={type:"added"},Ud={type:"removed"},Ii={type:"childadded",child:null},ta={type:"childremoved",child:null};class Me extends ai{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Me.DEFAULT_UP.clone();const t=new I,e=new ri,n=new Ee,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qt},normalMatrix:{value:new Vt}}),this.matrix=new qt,this.matrixWorld=new qt,this.matrixAutoUpdate=Me.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Pi.setFromAxisAngle(t,e),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(t,e){return Pi.setFromAxisAngle(t,e),this.quaternion.premultiply(Pi),this}rotateX(t){return this.rotateOnAxis(Wl,t)}rotateY(t){return this.rotateOnAxis(Xl,t)}rotateZ(t){return this.rotateOnAxis(ql,t)}translateOnAxis(t,e){return Gl.copy(t).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wl,t)}translateY(t){return this.translateOnAxis(Xl,t)}translateZ(t){return this.translateOnAxis(ql,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Os.copy(t):Os.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(rs,Os,this.up):Nn.lookAt(Os,rs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),Pi.setFromRotationMatrix(Nn),this.quaternion.premultiply(Pi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ft("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yl),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null):Ft("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ud),ta.child=t,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Nn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Nn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yl),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,t,Dd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,Nd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Me.DEFAULT_UP=new I(0,1,0);Me.DEFAULT_MATRIX_AUTO_UPDATE=!0;Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Zt extends Me{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fd={type:"move"};class ea{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),g=this._getHandJoint(c,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Fd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Zt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function na(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class _t{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=te.workingColorSpace){if(t=Qo(t,1),e=Jt(e,0,1),n=Jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=na(a,r,t+1/3),this.g=na(a,r,t),this.b=na(a,r,t-1/3)}return te.colorSpaceToWorking(this,s),this}setStyle(t,e=un){function n(r){r!==void 0&&parseFloat(r)<1&&It("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:It("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);It("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const n=Eh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):It("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Hn(t.r),this.g=Hn(t.g),this.b=Hn(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return te.workingToColorSpace(Xe.copy(this),t),Math.round(Jt(Xe.r*255,0,255))*65536+Math.round(Jt(Xe.g*255,0,255))*256+Math.round(Jt(Xe.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(Xe.copy(this),e);const n=Xe.r,s=Xe.g,r=Xe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(Xe.copy(this),e),t.r=Xe.r,t.g=Xe.g,t.b=Xe.b,t}getStyle(t=un){te.workingToColorSpace(Xe.copy(this),t);const e=Xe.r,n=Xe.g,s=Xe.b;return t!==un?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(ks);const n=Ms(Zn.h,ks.h,e),s=Ms(Zn.s,ks.s,e),r=Ms(Zn.l,ks.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xe=new _t;_t.NAMES=Eh;class el{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new _t(t),this.near=e,this.far=n}clone(){return new el(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Od extends Me{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const pn=new I,Un=new I,ia=new I,Fn=new I,Li=new I,Di=new I,$l=new I,sa=new I,ra=new I,aa=new I,oa=new ge,la=new ge,ca=new ge;class dn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),Un.subVectors(n,e),ia.subVectors(t,e);const a=pn.dot(pn),o=pn.dot(Un),l=pn.dot(ia),c=Un.dot(Un),h=Un.dot(ia),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Fn)===null?!1:Fn.x>=0&&Fn.y>=0&&Fn.x+Fn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Fn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Fn.x),l.addScaledVector(a,Fn.y),l.addScaledVector(o,Fn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return oa.setScalar(0),la.setScalar(0),ca.setScalar(0),oa.fromBufferAttribute(t,e),la.fromBufferAttribute(t,n),ca.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(oa,r.x),a.addScaledVector(la,r.y),a.addScaledVector(ca,r.z),a}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),Un.subVectors(t,e),pn.cross(Un).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),pn.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return dn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Li.subVectors(s,n),Di.subVectors(r,n),sa.subVectors(t,n);const l=Li.dot(sa),c=Di.dot(sa);if(l<=0&&c<=0)return e.copy(n);ra.subVectors(t,s);const h=Li.dot(ra),d=Di.dot(ra);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Li,a);aa.subVectors(t,r);const f=Li.dot(aa),p=Di.dot(aa);if(p>=0&&f<=p)return e.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Di,o);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return $l.subVectors(r,s),o=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector($l,o);const g=1/(m+v+u);return a=v*g,o=u*g,e.copy(n).addScaledVector(Li,a).addScaledVector(Di,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Si{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,mn):mn.fromBufferAttribute(r,a),mn.applyMatrix4(t.matrixWorld),this.expandByPoint(mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bs.copy(n.boundingBox)),Bs.applyMatrix4(t.matrixWorld),this.union(Bs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,mn),mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(as),zs.subVectors(this.max,as),Ni.subVectors(t.a,as),Ui.subVectors(t.b,as),Fi.subVectors(t.c,as),Qn.subVectors(Ui,Ni),jn.subVectors(Fi,Ui),hi.subVectors(Ni,Fi);let e=[0,-Qn.z,Qn.y,0,-jn.z,jn.y,0,-hi.z,hi.y,Qn.z,0,-Qn.x,jn.z,0,-jn.x,hi.z,0,-hi.x,-Qn.y,Qn.x,0,-jn.y,jn.x,0,-hi.y,hi.x,0];return!ha(e,Ni,Ui,Fi,zs)||(e=[1,0,0,0,1,0,0,0,1],!ha(e,Ni,Ui,Fi,zs))?!1:(Vs.crossVectors(Qn,jn),e=[Vs.x,Vs.y,Vs.z],ha(e,Ni,Ui,Fi,zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const On=[new I,new I,new I,new I,new I,new I,new I,new I],mn=new I,Bs=new Si,Ni=new I,Ui=new I,Fi=new I,Qn=new I,jn=new I,hi=new I,as=new I,zs=new I,Vs=new I,ui=new I;function ha(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ui.fromArray(i,r);const o=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),l=t.dot(ui),c=e.dot(ui),h=n.dot(ui);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Le=new I,Hs=new mt;let kd=0;class Qt extends ai{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:kd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Do,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hs.fromBufferAttribute(this,e),Hs.applyMatrix3(t),this.setXY(e,Hs.x,Hs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=_n(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=_n(e,this.array)),e}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=_n(e,this.array)),e}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=_n(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=_n(e,this.array)),e}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array),r=ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Do&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class nl extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Rh extends Qt{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ae extends Qt{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Bd=new Si,os=new I,ua=new I;class wi{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Bd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;os.subVectors(t,this.center);const e=os.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(os,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ua.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(os.copy(t.center).add(ua)),this.expandByPoint(os.copy(t.center).sub(ua))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let zd=0;const hn=new qt,da=new Me,Oi=new I,an=new Si,ls=new Si,Oe=new I;class le extends ai{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(id(t)?Rh:nl)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return hn.makeRotationFromQuaternion(t),this.applyMatrix4(hn),this}rotateX(t){return hn.makeRotationX(t),this.applyMatrix4(hn),this}rotateY(t){return hn.makeRotationY(t),this.applyMatrix4(hn),this}rotateZ(t){return hn.makeRotationZ(t),this.applyMatrix4(hn),this}translate(t,e,n){return hn.makeTranslation(t,e,n),this.applyMatrix4(hn),this}scale(t,e,n){return hn.makeScale(t,e,n),this.applyMatrix4(hn),this}lookAt(t){return da.lookAt(t),da.updateMatrix(),this.applyMatrix4(da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ae(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&It("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Si);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ft("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ft('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ft("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(an.min,ls.min),an.expandByPoint(Oe),Oe.addVectors(an.max,ls.max),an.expandByPoint(Oe)):(an.expandByPoint(ls.min),an.expandByPoint(ls.max))}an.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Oe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Oe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Oe.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(t,c),Oe.add(Oi)),s=Math.max(s,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ft('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ft("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new I,l[_]=new I;const c=new I,h=new I,d=new I,u=new mt,f=new mt,p=new mt,v=new I,m=new I;function g(_,E,P){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,P),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,P),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(C),o[_].add(v),o[E].add(v),o[P].add(v),l[_].add(m),l[E].add(m),l[P].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let _=0,E=b.length;_<E;++_){const P=b[_],C=P.start,L=P.count;for(let B=C,H=C+L;B<H;B+=3)g(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const S=new I,x=new I,A=new I,M=new I;function T(_){A.fromBufferAttribute(s,_),M.copy(A);const E=o[_];S.copy(E),S.sub(A.multiplyScalar(A.dot(E))).normalize(),x.crossVectors(M,E);const C=x.dot(l[_])<0?-1:1;a.setXYZW(_,S.x,S.y,S.z,C)}for(let _=0,E=b.length;_<E;++_){const P=b[_],C=P.start,L=P.count;for(let B=C,H=C+L;B<H;B+=3)T(t.getX(B+0)),T(t.getX(B+1)),T(t.getX(B+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Qt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,d=new I;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),v=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let g=0;g<h;g++)u[p++]=c[f++]}return new Qt(u,h,d)}if(this.index===null)return It("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new le,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vd{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Do,this.updateRanges=[],this.version=0,this.uuid=xn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $e=new I;class Pr{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=_n(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ue(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=_n(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=_n(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=_n(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=_n(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ue(e,this.array),n=ue(n,this.array),s=ue(s,this.array),r=ue(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Cr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Qt(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Pr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Cr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Hd=0;class oi extends ai{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=xn(),this.name="",this.type="Material",this.blending=$i,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ha,this.blendDst=Ga,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=Zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ei,this.stencilZFail=Ei,this.stencilZPass=Ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){It(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){It(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ha&&(n.blendSrc=this.blendSrc),this.blendDst!==Ga&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new _t().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new mt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new mt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ch extends oi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new _t(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ki;const cs=new I,Bi=new I,zi=new I,Vi=new mt,hs=new mt,Ph=new qt,Gs=new I,us=new I,Ws=new I,Kl=new mt,fa=new mt,Jl=new mt;class Gd extends Me{constructor(t=new Ch){if(super(),this.isSprite=!0,this.type="Sprite",ki===void 0){ki=new le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Vd(e,5);ki.setIndex([0,1,2,0,2,3]),ki.setAttribute("position",new Pr(n,3,0,!1)),ki.setAttribute("uv",new Pr(n,2,3,!1))}this.geometry=ki,this.material=t,this.center=new mt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&Ft('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Bi.setFromMatrixScale(this.matrixWorld),Ph.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),zi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Bi.multiplyScalar(-zi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Xs(Gs.set(-.5,-.5,0),zi,a,Bi,s,r),Xs(us.set(.5,-.5,0),zi,a,Bi,s,r),Xs(Ws.set(.5,.5,0),zi,a,Bi,s,r),Kl.set(0,0),fa.set(1,0),Jl.set(1,1);let o=t.ray.intersectTriangle(Gs,us,Ws,!1,cs);if(o===null&&(Xs(us.set(-.5,.5,0),zi,a,Bi,s,r),fa.set(0,1),o=t.ray.intersectTriangle(Gs,Ws,us,!1,cs),o===null))return;const l=t.ray.origin.distanceTo(cs);l<t.near||l>t.far||e.push({distance:l,point:cs.clone(),uv:dn.getInterpolation(cs,Gs,us,Ws,Kl,fa,Jl,new mt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Xs(i,t,e,n,s,r){Vi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(hs.x=r*Vi.x-s*Vi.y,hs.y=s*Vi.x+r*Vi.y):hs.copy(Vi),i.copy(t),i.x+=hs.x,i.y+=hs.y,i.applyMatrix4(Ph)}const kn=new I,pa=new I,qs=new I,ti=new I,ma=new I,Ys=new I,ga=new I;class Ps{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){pa.copy(t).add(e).multiplyScalar(.5),qs.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(pa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(qs),o=ti.dot(this.direction),l=-ti.dot(qs),c=ti.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const v=1/h;d*=v,u*=v,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(pa).addScaledVector(qs,u),f}intersectSphere(t,e){kn.subVectors(t.center,this.origin);const n=kn.dot(this.direction),s=kn.dot(kn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,s,r){ma.subVectors(e,t),Ys.subVectors(n,t),ga.crossVectors(ma,Ys);let a=this.direction.dot(ga),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ti.subVectors(this.origin,t);const l=o*this.direction.dot(Ys.crossVectors(ti,Ys));if(l<0)return null;const c=o*this.direction.dot(ma.cross(ti));if(c<0||l+c>a)return null;const h=-o*ti.dot(ga);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ji extends oi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Zl=new qt,di=new Ps,$s=new wi,Ql=new I,Ks=new I,Js=new I,Zs=new I,_a=new I,Qs=new I,jl=new I,js=new I;class k extends Me{constructor(t=new le,e=new ji){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(_a.fromBufferAttribute(d,t),a?Qs.addScaledVector(_a,h):Qs.addScaledVector(_a.sub(e),h))}e.add(Qs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(r),di.copy(t.ray).recast(t.near),!($s.containsPoint(di.origin)===!1&&(di.intersectSphere($s,Ql)===null||di.origin.distanceToSquared(Ql)>(t.far-t.near)**2))&&(Zl.copy(r).invert(),di.copy(t.ray).applyMatrix4(Zl),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=u.length;p<v;p++){const m=u[p],g=a[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=S;x<A;x+=3){const M=o.getX(x),T=o.getX(x+1),_=o.getX(x+2);s=tr(this,g,t,n,c,h,d,M,T,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const b=o.getX(m),S=o.getX(m+1),x=o.getX(m+2);s=tr(this,a,t,n,c,h,d,b,S,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,v=u.length;p<v;p++){const m=u[p],g=a[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=S;x<A;x+=3){const M=x,T=x+1,_=x+2;s=tr(this,g,t,n,c,h,d,M,T,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const b=m,S=m+1,x=m+2;s=tr(this,a,t,n,c,h,d,b,S,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Wd(i,t,e,n,s,r,a,o){let l;if(t.side===Je?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===si,o),l===null)return null;js.copy(o),js.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(js);return c<e.near||c>e.far?null:{distance:c,point:js.clone(),object:i}}function tr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Ks),i.getVertexPosition(l,Js),i.getVertexPosition(c,Zs);const h=Wd(i,t,e,n,Ks,Js,Zs,jl);if(h){const d=new I;dn.getBarycoord(jl,Ks,Js,Zs,d),s&&(h.uv=dn.getInterpolatedAttribute(s,o,l,c,d,new mt)),r&&(h.uv1=dn.getInterpolatedAttribute(r,o,l,c,d,new mt)),a&&(h.normal=dn.getInterpolatedAttribute(a,o,l,c,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new I,materialIndex:0};dn.getNormal(Ks,Js,Zs,u.normal),h.face=u,h.barycoord=d}return h}const ds=new ge,tc=new ge,ec=new ge,Xd=new ge,nc=new qt,er=new I,va=new wi,ic=new qt,xa=new Ps;class qd extends k{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ll,this.bindMatrix=new qt,this.bindMatrixInverse=new qt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Si),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,er),this.boundingBox.expandByPoint(er)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new wi),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,er),this.boundingSphere.expandByPoint(er)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),va.copy(this.boundingSphere),va.applyMatrix4(s),t.ray.intersectsSphere(va)!==!1&&(ic.copy(s).invert(),xa.copy(t.ray).applyMatrix4(ic),!(this.boundingBox!==null&&xa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,xa)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new ge,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ll?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Xu?this.bindMatrixInverse.copy(this.bindMatrix).invert():It("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;tc.fromBufferAttribute(s.attributes.skinIndex,t),ec.fromBufferAttribute(s.attributes.skinWeight,t),e.isVector4?(ds.copy(e),e.set(0,0,0,0)):(ds.set(...e,1),e.set(0,0,0)),ds.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=ec.getComponent(r);if(a!==0){const o=tc.getComponent(r);nc.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Xd.copy(ds).applyMatrix4(nc),a)}}return e.isVector4&&(e.w=ds.w),e.applyMatrix4(this.bindMatrixInverse)}}class Ih extends Me{constructor(){super(),this.isBone=!0,this.type="Bone"}}class il extends Ze{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Ve,h=Ve,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const sc=new qt,Yd=new qt;class sl{constructor(t=[],e=[]){this.uuid=xn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){It("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new qt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new qt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:Yd;sc.multiplyMatrices(o,e[r]),sc.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new sl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new il(e,t,t,ln,vn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let a=e[r];a===void 0&&(It("Skeleton: No bone found with UUID:",r),a=new Ih),this.bones.push(a),this.boneInverses.push(new qt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=n[s];t.boneInverses.push(o.toArray())}return t}}const ya=new I,$d=new I,Kd=new Vt;class mi{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ya.subVectors(n,e).cross($d.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(ya),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Kd.getNormalMatrix(t),s=this.coplanarPoint(ya).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new wi,Jd=new mt(.5,.5),nr=new I;class rl{constructor(t=new mi,e=new mi,n=new mi,s=new mi,r=new mi,a=new mi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Cn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],v=r[9],m=r[10],g=r[11],b=r[12],S=r[13],x=r[14],A=r[15];if(s[0].setComponents(c-a,f-h,g-p,A-b).normalize(),s[1].setComponents(c+a,f+h,g+p,A+b).normalize(),s[2].setComponents(c+o,f+d,g+v,A+S).normalize(),s[3].setComponents(c-o,f-d,g-v,A-S).normalize(),n)s[4].setComponents(l,u,m,x).normalize(),s[5].setComponents(c-l,f-u,g-m,A-x).normalize();else if(s[4].setComponents(c-l,f-u,g-m,A-x).normalize(),e===Cn)s[5].setComponents(c+l,f+u,g+m,A+x).normalize();else if(e===Rs)s[5].setComponents(l,u,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(t){fi.center.set(0,0,0);const e=Jd.distanceTo(t.center);return fi.radius=.7071067811865476+e,fi.applyMatrix4(t.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(nr.x=s.normal.x>0?t.max.x:t.min.x,nr.y=s.normal.y>0?t.max.y:t.min.y,nr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(nr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class al extends oi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ir=new I,Lr=new I,rc=new qt,fs=new Ps,ir=new wi,ba=new I,ac=new I;class Zd extends Me{constructor(t=new le,e=new al){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Ir.fromBufferAttribute(e,s-1),Lr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ir.distanceTo(Lr);t.setAttribute("lineDistance",new ae(n,1))}else It("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(s),ir.radius+=r,t.ray.intersectsSphere(ir)===!1)return;rc.copy(s).invert(),fs.copy(t.ray).applyMatrix4(rc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=h.getX(v),b=h.getX(v+1),S=sr(this,t,fs,l,g,b,v);S&&e.push(S)}if(this.isLineLoop){const v=h.getX(p-1),m=h.getX(f),g=sr(this,t,fs,l,v,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=sr(this,t,fs,l,v,v+1,v);g&&e.push(g)}if(this.isLineLoop){const v=sr(this,t,fs,l,p-1,f,p-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function sr(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(Ir.fromBufferAttribute(o,s),Lr.fromBufferAttribute(o,r),e.distanceSqToSegment(Ir,Lr,ba,ac)>n)return;ba.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ba);if(!(c<t.near||c>t.far))return{distance:c,point:ac.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const oc=new I,lc=new I;class Lh extends Zd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)oc.fromBufferAttribute(e,s),lc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+oc.distanceTo(lc);t.setAttribute("lineDistance",new ae(n,1))}else It("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Qd extends oi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new _t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const cc=new qt,No=new Ps,rr=new wi,ar=new I;class Dh extends Me{constructor(t=new le,e=new Qd){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,t.ray.intersectsSphere(rr)===!1)return;cc.copy(s).invert(),No.copy(t.ray).applyMatrix4(cc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=u,v=f;p<v;p++){const m=c.getX(p);ar.fromBufferAttribute(d,m),hc(ar,m,l,s,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,v=f;p<v;p++)ar.fromBufferAttribute(d,p),hc(ar,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function hc(i,t,e,n,s,r,a){const o=No.distanceSqToPoint(i);if(o<e){const l=new I;No.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Nh extends Ze{constructor(t=[],e=bi,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ts extends Ze{constructor(t,e,n=Dn,s,r,a,o=Ve,l=Ve,c,h=Wn,d=1){if(h!==Wn&&h!==xi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new jo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class jd extends ts{constructor(t,e=Dn,n=bi,s,r,a=Ve,o=Ve,l,c=Wn){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Uh extends Ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class kt extends le{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ae(c,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(d,2));function p(v,m,g,b,S,x,A,M,T,_,E){const P=x/T,C=A/_,L=x/2,B=A/2,H=M/2,O=T+1,X=_+1;let D=0,q=0;const V=new I;for(let K=0;K<X;K++){const it=K*C-B;for(let lt=0;lt<O;lt++){const Et=lt*P-L;V[v]=Et*b,V[m]=it*S,V[g]=H,c.push(V.x,V.y,V.z),V[v]=0,V[m]=0,V[g]=M>0?1:-1,h.push(V.x,V.y,V.z),d.push(lt/T),d.push(1-K/_),D+=1}}for(let K=0;K<_;K++)for(let it=0;it<T;it++){const lt=u+it+O*K,Et=u+it+O*(K+1),oe=u+(it+1)+O*(K+1),Ht=u+(it+1)+O*K;l.push(lt,Et,Ht),l.push(Et,oe,Ht),q+=6}o.addGroup(f,q,E),f+=q,u+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class xt extends le{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const v=[],m=n/2;let g=0;b(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ae(d,3)),this.setAttribute("normal",new ae(u,3)),this.setAttribute("uv",new ae(f,2));function b(){const x=new I,A=new I;let M=0;const T=(e-t)/n;for(let _=0;_<=r;_++){const E=[],P=_/r,C=P*(e-t)+t;for(let L=0;L<=s;L++){const B=L/s,H=B*l+o,O=Math.sin(H),X=Math.cos(H);A.x=C*O,A.y=-P*n+m,A.z=C*X,d.push(A.x,A.y,A.z),x.set(O,T,X).normalize(),u.push(x.x,x.y,x.z),f.push(B,1-P),E.push(p++)}v.push(E)}for(let _=0;_<s;_++)for(let E=0;E<r;E++){const P=v[E][_],C=v[E+1][_],L=v[E+1][_+1],B=v[E][_+1];(t>0||E!==0)&&(h.push(P,C,B),M+=3),(e>0||E!==r-1)&&(h.push(C,L,B),M+=3)}c.addGroup(g,M,0),g+=M}function S(x){const A=p,M=new mt,T=new I;let _=0;const E=x===!0?t:e,P=x===!0?1:-1;for(let L=1;L<=s;L++)d.push(0,m*P,0),u.push(0,P,0),f.push(.5,.5),p++;const C=p;for(let L=0;L<=s;L++){const H=L/s*l+o,O=Math.cos(H),X=Math.sin(H);T.x=E*X,T.y=m*P,T.z=E*O,d.push(T.x,T.y,T.z),u.push(0,P,0),M.x=O*.5+.5,M.y=X*.5*P+.5,f.push(M.x,M.y),p++}for(let L=0;L<s;L++){const B=A+L,H=C+L;x===!0?h.push(H,H+1,B):h.push(H+1,H,B),_+=3}c.addGroup(g,_,x===!0?1:2),g+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ln extends xt{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Ln(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ol extends le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ae(r,3)),this.setAttribute("normal",new ae(r.slice(),3)),this.setAttribute("uv",new ae(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const S=new I,x=new I,A=new I;for(let M=0;M<e.length;M+=3)f(e[M+0],S),f(e[M+1],x),f(e[M+2],A),l(S,x,A,b)}function l(b,S,x,A){const M=A+1,T=[];for(let _=0;_<=M;_++){T[_]=[];const E=b.clone().lerp(x,_/M),P=S.clone().lerp(x,_/M),C=M-_;for(let L=0;L<=C;L++)L===0&&_===M?T[_][L]=E:T[_][L]=E.clone().lerp(P,L/C)}for(let _=0;_<M;_++)for(let E=0;E<2*(M-_)-1;E++){const P=Math.floor(E/2);E%2===0?(u(T[_][P+1]),u(T[_+1][P]),u(T[_][P])):(u(T[_][P+1]),u(T[_+1][P+1]),u(T[_+1][P]))}}function c(b){const S=new I;for(let x=0;x<r.length;x+=3)S.x=r[x+0],S.y=r[x+1],S.z=r[x+2],S.normalize().multiplyScalar(b),r[x+0]=S.x,r[x+1]=S.y,r[x+2]=S.z}function h(){const b=new I;for(let S=0;S<r.length;S+=3){b.x=r[S+0],b.y=r[S+1],b.z=r[S+2];const x=m(b)/2/Math.PI+.5,A=g(b)/Math.PI+.5;a.push(x,1-A)}p(),d()}function d(){for(let b=0;b<a.length;b+=6){const S=a[b+0],x=a[b+2],A=a[b+4],M=Math.max(S,x,A),T=Math.min(S,x,A);M>.9&&T<.1&&(S<.2&&(a[b+0]+=1),x<.2&&(a[b+2]+=1),A<.2&&(a[b+4]+=1))}}function u(b){r.push(b.x,b.y,b.z)}function f(b,S){const x=b*3;S.x=t[x+0],S.y=t[x+1],S.z=t[x+2]}function p(){const b=new I,S=new I,x=new I,A=new I,M=new mt,T=new mt,_=new mt;for(let E=0,P=0;E<r.length;E+=9,P+=6){b.set(r[E+0],r[E+1],r[E+2]),S.set(r[E+3],r[E+4],r[E+5]),x.set(r[E+6],r[E+7],r[E+8]),M.set(a[P+0],a[P+1]),T.set(a[P+2],a[P+3]),_.set(a[P+4],a[P+5]),A.copy(b).add(S).add(x).divideScalar(3);const C=m(A);v(M,P+0,b,C),v(T,P+2,S,C),v(_,P+4,x,C)}}function v(b,S,x,A){A<0&&b.x===1&&(a[S]=b.x-1),x.x===0&&x.z===0&&(a[S]=A/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function g(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ol(t.vertices,t.indices,t.radius,t.detail)}}class qn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){It("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new mt:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new qt;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Jt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Jt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Fh extends qn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new mt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class tf extends Fh{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ll(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const uc=new I,dc=new I,Ma=new ll,Sa=new ll,wa=new ll;class cl extends qn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(dc.subVectors(s[0],s[1]).add(s[0]),c=dc);const d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(uc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=uc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),p<1e-4&&(p=v),m<1e-4&&(m=v),Ma.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,v,m),Sa.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,v,m),wa.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,v,m)}else this.curveType==="catmullrom"&&(Ma.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Sa.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),wa.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Ma.calc(l),Sa.calc(l),wa.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function fc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function ef(i,t){const e=1-i;return e*e*t}function nf(i,t){return 2*(1-i)*i*t}function sf(i,t){return i*i*t}function Ss(i,t,e,n){return ef(i,t)+nf(i,e)+sf(i,n)}function rf(i,t){const e=1-i;return e*e*e*t}function af(i,t){const e=1-i;return 3*e*e*i*t}function of(i,t){return 3*(1-i)*i*i*t}function lf(i,t){return i*i*i*t}function ws(i,t,e,n,s){return rf(i,t)+af(i,e)+of(i,n)+lf(i,s)}class cf extends qn{constructor(t=new mt,e=new mt,n=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ws(t,s.x,r.x,a.x,o.x),ws(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class hf extends qn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ws(t,s.x,r.x,a.x,o.x),ws(t,s.y,r.y,a.y,o.y),ws(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class uf extends qn{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class df extends qn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ff extends qn{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ss(t,s.x,r.x,a.x),Ss(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Oh extends qn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ss(t,s.x,r.x,a.x),Ss(t,s.y,r.y,a.y),Ss(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class pf extends qn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(fc(o,l.x,c.x,h.x,d.x),fc(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new mt().fromArray(s))}return this}}var mf=Object.freeze({__proto__:null,ArcCurve:tf,CatmullRomCurve3:cl,CubicBezierCurve:cf,CubicBezierCurve3:hf,EllipseCurve:Fh,LineCurve:uf,LineCurve3:df,QuadraticBezierCurve:ff,QuadraticBezierCurve3:Oh,SplineCurve:pf});class De extends ol{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new De(t.radius,t.detail)}}class Is extends le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],p=[],v=[],m=[];for(let g=0;g<h;g++){const b=g*u-a;for(let S=0;S<c;S++){const x=S*d-r;p.push(x,-b,0),v.push(0,0,1),m.push(S/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let b=0;b<o;b++){const S=b+c*g,x=b+c*(g+1),A=b+1+c*(g+1),M=b+1+c*g;f.push(S,x,M),f.push(x,A,M)}this.setIndex(f),this.setAttribute("position",new ae(p,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Is(t.width,t.height,t.widthSegments,t.heightSegments)}}class kr extends le{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let d=t;const u=(e-t)/s,f=new I,p=new mt;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const g=r+m/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}d+=u}for(let v=0;v<s;v++){const m=v*(n+1);for(let g=0;g<n;g++){const b=g+m,S=b,x=b+n+1,A=b+n+2,M=b+1;o.push(S,x,M),o.push(x,A,M)}}this.setIndex(o),this.setAttribute("position",new ae(l,3)),this.setAttribute("normal",new ae(c,3)),this.setAttribute("uv",new ae(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kr(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class yn extends le{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new I,u=new I,f=[],p=[],v=[],m=[];for(let g=0;g<=n;g++){const b=[],S=g/n,x=a+S*o,A=t*Math.cos(x),M=Math.sqrt(t*t-A*A);let T=0;g===0&&a===0?T=.5/e:g===n&&l===Math.PI&&(T=-.5/e);for(let _=0;_<=e;_++){const E=_/e,P=s+E*r;d.x=-M*Math.cos(P),d.y=A,d.z=M*Math.sin(P),p.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),m.push(E+T,1-S),b.push(c++)}h.push(b)}for(let g=0;g<n;g++)for(let b=0;b<e;b++){const S=h[g][b+1],x=h[g][b],A=h[g+1][b],M=h[g+1][b+1];(g!==0||a>0)&&f.push(S,x,M),(g!==n-1||l<Math.PI)&&f.push(x,A,M)}this.setIndex(f),this.setAttribute("position",new ae(p,3)),this.setAttribute("normal",new ae(v,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xn extends le{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],d=[],u=new I,f=new I,p=new I;for(let v=0;v<=n;v++){const m=a+v/n*o;for(let g=0;g<=s;g++){const b=g/s*r;f.x=(t+e*Math.cos(m))*Math.cos(b),f.y=(t+e*Math.cos(m))*Math.sin(b),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(b),u.y=t*Math.sin(b),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(g/s),d.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=s;m++){const g=(s+1)*v+m-1,b=(s+1)*(v-1)+m-1,S=(s+1)*(v-1)+m,x=(s+1)*v+m;l.push(g,b,x),l.push(b,S,x)}this.setIndex(l),this.setAttribute("position",new ae(c,3)),this.setAttribute("normal",new ae(h,3)),this.setAttribute("uv",new ae(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class hl extends le{constructor(t=new Oh(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,l=new I,c=new mt;let h=new I;const d=[],u=[],f=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new ae(d,3)),this.setAttribute("normal",new ae(u,3)),this.setAttribute("uv",new ae(f,2));function v(){for(let S=0;S<e;S++)m(S);m(r===!1?e:0),b(),g()}function m(S){h=t.getPointAt(S/e,h);const x=a.normals[S],A=a.binormals[S];for(let M=0;M<=s;M++){const T=M/s*Math.PI*2,_=Math.sin(T),E=-Math.cos(T);l.x=E*x.x+_*A.x,l.y=E*x.y+_*A.y,l.z=E*x.z+_*A.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function g(){for(let S=1;S<=e;S++)for(let x=1;x<=s;x++){const A=(s+1)*(S-1)+(x-1),M=(s+1)*S+(x-1),T=(s+1)*S+x,_=(s+1)*(S-1)+x;p.push(A,M,_),p.push(M,T,_)}}function b(){for(let S=0;S<=e;S++)for(let x=0;x<=s;x++)c.x=S/e,c.y=x/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new hl(new mf[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function es(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(pc(s))s.isRenderTargetTexture?(It("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(pc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function Ke(i){const t={};for(let e=0;e<i.length;e++){const n=es(i[e]);for(const s in n)t[s]=n[s]}return t}function pc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function gf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}const _f={clone:es,merge:Ke};var vf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class nn extends oi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vf,this.fragmentShader=xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=es(t.uniforms),this.uniformsGroups=gf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new _t().setHex(s.value);break;case"v2":this.uniforms[n].value=new mt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ge().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Vt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new qt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class yf extends nn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class be extends oi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new _t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lo,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class bf extends be{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new mt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Jt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new _t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new _t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new _t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Mf extends oi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ku,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Sf extends oi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}function or(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function wf(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function mc(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let l=0;l!==t;++l)s[a++]=i[o+l]}return s}function Af(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=i[s++];while(r!==void 0)}class Ls{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];t:{e:{let a;n:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break e}a=e.length;break n}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break e}a=n,n=0;break n}break t}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Tf extends Ls{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qi,endingEnd:qi}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Yi:r=t,o=2*e-n;break;case Ar:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Yi:a=t,l=2*n-e;break;case Ar:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-e)/(s-e),v=p*p,m=v*p,g=-u*m+2*u*v-u*p,b=(1+u)*m+(-1.5-2*u)*v+(-.5+u)*p+1,S=(-1-f)*m+(1.5+f)*v+.5*p,x=f*m-f*v;for(let A=0;A!==o;++A)r[A]=g*a[h+A]+b*a[c+A]+S*a[l+A]+x*a[d+A];return r}}class Bh extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}}class Ef extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class Rf extends Ls{interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const p=(n-e)/(s-e),v=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*v+a[l+m]*p;return r}const u=o*2,f=t-1;for(let p=0;p!==o;++p){const v=a[c+p],m=a[l+p],g=f*u+p*2,b=d[g],S=d[g+1],x=t*u+p*2,A=h[x],M=h[x+1];let T=(n-e)/(s-e),_,E,P,C,L;for(let B=0;B<8;B++){_=T*T,E=_*T,P=1-T,C=P*P,L=C*P;const O=L*e+3*C*T*b+3*P*_*A+E*s-n;if(Math.abs(O)<1e-10)break;const X=3*C*(b-e)+6*P*T*(A-b)+3*_*(s-A);if(Math.abs(X)<1e-10)break;T=T-O/X,T=Math.max(0,Math.min(1,T))}r[p]=L*v+3*C*T*S+3*P*_*M+E*m}return r}}class bn{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=or(e,this.TimeBufferType),this.values=or(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:or(t.times,Array),values:or(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Ef(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Bh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Tf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new Rf(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case wr:e=this.InterpolantFactoryMethodDiscrete;break;case Io:e=this.InterpolantFactoryMethodLinear;break;case $r:e=this.InterpolantFactoryMethodSmooth;break;case Dl:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return It("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return wr;case this.InterpolantFactoryMethodLinear:return Io;case this.InterpolantFactoryMethodSmooth:return $r;case this.InterpolantFactoryMethodBezier:return Dl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Ft("KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Ft("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ft("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ft("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&sd(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Ft("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===$r,r=t.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{const d=o*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){const v=e[d+p];if(v!==e[u+p]||v!==e[f+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}bn.prototype.ValueTypeName="";bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=Io;class ns extends bn{constructor(t,e,n){super(t,e,n)}}ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=wr;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;class zh extends bn{constructor(t,e,n,s){super(t,e,n,s)}}zh.prototype.ValueTypeName="color";class ul extends bn{constructor(t,e,n,s){super(t,e,n,s)}}ul.prototype.ValueTypeName="number";class Cf extends Ls{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e);let c=t*o;for(let h=c+o;c!==h;c+=4)Ee.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Br extends bn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Cf(this.times,this.values,this.getValueSize(),t)}}Br.prototype.ValueTypeName="quaternion";Br.prototype.InterpolantFactoryMethodSmooth=void 0;class is extends bn{constructor(t,e,n){super(t,e,n)}}is.prototype.ValueTypeName="string";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=wr;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;class dl extends bn{constructor(t,e,n,s){super(t,e,n,s)}}dl.prototype.ValueTypeName="vector";class Dr{constructor(t="",e=-1,n=[],s=Ko){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=xn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(If(n[a]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,a=n.length;r!==a;++r)e.push(bn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=wf(l);l=mc(l,1,h),c=mc(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new ul(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){const c=t[o],h=c.name.match(r);if(h&&h.length>1){const d=h[1];let u=s[d];u||(s[d]=u=[]),u.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],e,n));return a}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function Pf(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ul;case"vector":case"vector2":case"vector3":case"vector4":return dl;case"color":return zh;case"quaternion":return Br;case"bool":case"boolean":return ns;case"string":return is}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function If(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=Pf(i.type);if(i.times===void 0){const e=[],n=[];Af(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}class zr extends Me{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Lf extends zr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.groundColor=new _t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Aa=new qt,gc=new I,_c=new I;class Vh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.mapType=on,this.map=null,this.mapPass=null,this.matrix=new qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rl,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;gc.setFromMatrixPosition(t.matrixWorld),e.position.copy(gc),_c.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(_c),e.updateMatrixWorld(),Aa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Aa,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Rs||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Aa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const lr=new I,cr=new Ee,An=new I;class Hh extends Me{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qt,this.projectionMatrix=new qt,this.projectionMatrixInverse=new qt,this.coordinateSystem=Cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(lr,cr,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(lr,cr,An.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(lr,cr,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(lr,cr,An.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ei=new I,vc=new mt,xc=new mt;class je extends Hh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Cs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(bs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Cs*2*Math.atan(Math.tan(bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ei.x,ei.y).multiplyScalar(-t/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ei.x,ei.y).multiplyScalar(-t/ei.z)}getViewSize(t,e){return this.getViewBounds(t,vc,xc),e.subVectors(xc,vc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(bs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Df extends Vh{constructor(){super(new je(90,1,.5,500)),this.isPointLightShadow=!0}}class fl extends zr{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Df}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class pl extends Hh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Nf extends Vh{constructor(){super(new pl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Uf extends zr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.target=new Me,this.shadow=new Nf}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Ff extends zr{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Hi=-90,Gi=1;class Of extends Me{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new je(Hi,Gi,t,e);s.layers=this.layers,this.add(s);const r=new je(Hi,Gi,t,e);r.layers=this.layers,this.add(r);const a=new je(Hi,Gi,t,e);a.layers=this.layers,this.add(a);const o=new je(Hi,Gi,t,e);o.layers=this.layers,this.add(o);const l=new je(Hi,Gi,t,e);l.layers=this.layers,this.add(l);const c=new je(Hi,Gi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Rs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class kf extends je{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Bf{constructor(t,e,n){this.binding=t,this.valueSize=n;let s,r,a;switch(e){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,s=this.valueSize,r=t*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=e}else{a+=e;const o=e/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,s,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,s=t*e+e,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=e*this._origIndex;this._mixBufferRegion(n,s,l,1-r,e)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){o.setValue(n,s);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,s=n*this._origIndex;t.getValue(e,s);for(let r=n,a=s;r!==a;++r)e[r]=e[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)t[e+a]=t[n+a]}_slerp(t,e,n,s){Ee.slerpFlat(t,e,t,e,t,n,s)}_slerpAdditive(t,e,n,s,r){const a=this._workIndex*r;Ee.multiplyQuaternionsFlat(t,a,t,e,t,n),Ee.slerpFlat(t,e,t,e,t,a,s)}_lerp(t,e,n,s,r){const a=1-s;for(let o=0;o!==r;++o){const l=e+o;t[l]=t[l]*a+t[n+o]*s}}_lerpAdditive(t,e,n,s,r){for(let a=0;a!==r;++a){const o=e+a;t[o]=t[o]+t[n+a]*s}}}const ml="\\[\\]\\.:\\/",zf=new RegExp("["+ml+"]","g"),gl="[^"+ml+"]",Vf="[^"+ml.replace("\\.","")+"]",Hf=/((?:WC+[\/:])*)/.source.replace("WC",gl),Gf=/(WCOD+)?/.source.replace("WCOD",Vf),Wf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",gl),Xf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",gl),qf=new RegExp("^"+Hf+Gf+Wf+Xf+"$"),Yf=["material","materials","bones","map"];class $f{constructor(t,e,n){const s=n||de.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class de{constructor(t,e,n){this.path=e,this.parsedPath=n||de.parseTrackName(e),this.node=de.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new de.Composite(t,e,n):new de(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(zf,"")}static parseTrackName(t){const e=qf.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Yf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=de.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){It("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ft("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ft("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ft("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ft("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ft("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ft("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ft("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const a=t[s];if(a===void 0){const c=e.nodeName;Ft("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ft("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ft("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}de.Composite=$f;de.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};de.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};de.prototype.GetterByBindingType=[de.prototype._getValue_direct,de.prototype._getValue_array,de.prototype._getValue_arrayElement,de.prototype._getValue_toArray];de.prototype.SetterByBindingTypeAndVersioning=[[de.prototype._setValue_direct,de.prototype._setValue_direct_setNeedsUpdate,de.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[de.prototype._setValue_array,de.prototype._setValue_array_setNeedsUpdate,de.prototype._setValue_array_setMatrixWorldNeedsUpdate],[de.prototype._setValue_arrayElement,de.prototype._setValue_arrayElement_setNeedsUpdate,de.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[de.prototype._setValue_fromArray,de.prototype._setValue_fromArray_setNeedsUpdate,de.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Kf{constructor(t,e,n=null,s=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=s;const r=e.tracks,a=r.length,o=new Array(a),l={endingStart:qi,endingEnd:qi};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Po,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n=!1){if(t.fadeOut(e),this.fadeIn(e),n===!0){const s=this._clip.duration,r=t._clip.duration,a=r/s,o=s/r;t._restoreTimeScale=t.timeScale,this._restoreTimeScale=this.timeScale,t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,n=!1){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=t/a,c[1]=e/a,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,s){if(!this.enabled){this._updateWeight(t);return}const r=this._startTime;if(r!==null){const l=(t-r)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);const a=this._updateTime(e),o=this._updateWeight(t);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case $u:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Ko:default:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(e===0?this.paused=!0:(this._restoreTimeScale!==null&&(e=this._restoreTimeScale),this.timeScale=e),this.stopWarping())}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let s=this.time+t,r=this._loopCount;const a=n===Yu;if(t===0)return r===-1?s:a&&(r&1)===1?e-s:s;if(n===wh){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(s>=e)s=e;else if(s<0)s=0;else{this.time=s;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=e||s<0){const o=Math.floor(s/e);s-=e*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=t>0?e:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return e-s}return s}_setEndings(t,e,n){const s=this._interpolantSettings;n?(s.endingStart=Yi,s.endingEnd=Yi):(t?s.endingStart=this.zeroSlopeAtStart?Yi:qi:s.endingStart=Ar,e?s.endingEnd=this.zeroSlopeAtEnd?Yi:qi:s.endingEnd=Ar)}_scheduleFading(t,e,n){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=e,o[1]=r+t,l[1]=n,this}}const Jf=new Float32Array(1);class Zf extends ai{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(t,e){const n=t._localRoot||this._root,s=t._clip.tracks,r=s.length,a=t._propertyBindings,o=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let d=0;d!==r;++d){const u=s[d],f=u.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[d]=p;else{if(p=a[d],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const v=e&&e._propertyBindings[d].binding.parsedPath;p=new Bf(de.create(n,f,v),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[d]=p}o[d].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,s=t._clip.uuid,r=this._actionsByClip[s];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,s,n)}const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const s=this._actions,r=this._actionsByClip;let a=r[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=a;else{const o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=s.length,s.push(t),a.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],s=t._cacheIndex;n._cacheIndex=s,e[s]=n,e.pop(),t._cacheIndex=null;const r=t._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const d=o.actionByRoot,u=(t._localRoot||this._root).uuid;delete d[u],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,s=this._nActiveActions++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,s=--this._nActiveActions,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[e];a===void 0&&(a={},s[e]=a),a[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,s=this._nActiveBindings++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,s=--this._nActiveBindings,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new Bh(new Float32Array(2),new Float32Array(2),1,Jf),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,s=--this._nActiveControlInterpolants,r=e[s];t.__cacheIndex=s,e[s]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){const s=e||this._root,r=s.uuid;let a=typeof t=="string"?Dr.findByName(s,t):t;const o=a!==null?a.uuid:t,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Ko),l!==void 0){const d=l.actionByRoot[r];if(d!==void 0&&d.blendMode===n)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Kf(this,a,e,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(t,e){const n=e||this._root,s=n.uuid,r=typeof t=="string"?Dr.findByName(n,t):t,a=r?r.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,s=this.time+=t,r=Math.sign(t),a=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(s,t,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,d=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=h,e[h]=d,e.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[e];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const yc=new qt;class Qf{constructor(t,e,n=0,s=1/0){this.ray=new Ps(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new tl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Ft("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return yc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(yc),this}intersectObject(t,e=!0,n=[]){return Uo(t,this,n,e),n.sort(bc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Uo(t[s],this,n,e);return n.sort(bc),n}}function bc(i,t){return i.distance-t.distance}function Uo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Uo(r[a],t,e,!0)}}class Gh{static{Gh.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}}class _1 extends Lh{constructor(t=10,e=10,n=4473924,s=8947848){n=new _t(n),s=new _t(s);const r=e/2,a=t/e,o=t/2,l=[],c=[];for(let u=0,f=0,p=-o;u<=e;u++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const v=u===r?n:s;v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3}const h=new le;h.setAttribute("position",new ae(l,3)),h.setAttribute("color",new ae(c,3));const d=new al({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const hr=new Si;class v1 extends Lh{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(8*3),r=new le;r.setIndex(new Qt(n,1)),r.setAttribute("position",new Qt(s,3)),super(r,new al({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&hr.setFromObject(this.object),hr.isEmpty())return;const t=hr.min,e=hr.max,n=this.geometry.attributes.position,s=n.array;s[0]=e.x,s[1]=e.y,s[2]=e.z,s[3]=t.x,s[4]=e.y,s[5]=e.z,s[6]=t.x,s[7]=t.y,s[8]=e.z,s[9]=e.x,s[10]=t.y,s[11]=e.z,s[12]=e.x,s[13]=e.y,s[14]=t.z,s[15]=t.x,s[16]=e.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=e.x,s[22]=t.y,s[23]=t.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function Mc(i,t,e,n){const s=jf(n);switch(e){case bh:return i*t;case Sh:return i*t/s.components*s.byteLength;case qo:return i*t/s.components*s.byteLength;case Mi:return i*t*2/s.components*s.byteLength;case Yo:return i*t*2/s.components*s.byteLength;case Mh:return i*t*3/s.components*s.byteLength;case ln:return i*t*4/s.components*s.byteLength;case $o:return i*t*4/s.components*s.byteLength;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case vr:case xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case to:case no:return Math.max(i,16)*Math.max(t,8)/4;case ja:case eo:return Math.max(i,8)*Math.max(t,8)/2;case io:case so:case ao:case oo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ro:case Mr:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case uo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case mo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case _o:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case vo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Mo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case So:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case wo:case Ao:case To:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Eo:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Sr:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function jf(i){switch(i){case on:case _h:return{byteLength:1,components:1};case Ts:case vh:case Gn:return{byteLength:2,components:1};case Wo:case Xo:return{byteLength:2,components:4};case Dn:case Go:case vn:return{byteLength:4,components:1};case xh:case yh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ho}}));typeof window<"u"&&(window.__THREE__?It("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ho);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function tp(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],v=d[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const v=d[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ep=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,np=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ip=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ap=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,op=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,hp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,up=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Mp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Sp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,wp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ap=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Tp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ip="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Up=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Fp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Yp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$p=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,t0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,e0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,n0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,i0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,s0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,r0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,a0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,l0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,c0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,h0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,u0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,d0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,f0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,p0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,m0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,g0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,v0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,y0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,b0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,S0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,w0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,A0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,E0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,R0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,C0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,P0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,I0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,L0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,D0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,N0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,U0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,F0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,O0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,k0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,B0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,z0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,V0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,H0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,G0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,W0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,X0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,q0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Y0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,K0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,J0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,j0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const em=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,am=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,om=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,hm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_m=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ym=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Sm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Tm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Em=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Pm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Im=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Nm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:ep,alphahash_pars_fragment:np,alphamap_fragment:ip,alphamap_pars_fragment:sp,alphatest_fragment:rp,alphatest_pars_fragment:ap,aomap_fragment:op,aomap_pars_fragment:lp,batching_pars_vertex:cp,batching_vertex:hp,begin_vertex:up,beginnormal_vertex:dp,bsdfs:fp,iridescence_fragment:pp,bumpmap_pars_fragment:mp,clipping_planes_fragment:gp,clipping_planes_pars_fragment:_p,clipping_planes_pars_vertex:vp,clipping_planes_vertex:xp,color_fragment:yp,color_pars_fragment:bp,color_pars_vertex:Mp,color_vertex:Sp,common:wp,cube_uv_reflection_fragment:Ap,defaultnormal_vertex:Tp,displacementmap_pars_vertex:Ep,displacementmap_vertex:Rp,emissivemap_fragment:Cp,emissivemap_pars_fragment:Pp,colorspace_fragment:Ip,colorspace_pars_fragment:Lp,envmap_fragment:Dp,envmap_common_pars_fragment:Np,envmap_pars_fragment:Up,envmap_pars_vertex:Fp,envmap_physical_pars_fragment:Yp,envmap_vertex:Op,fog_vertex:kp,fog_pars_vertex:Bp,fog_fragment:zp,fog_pars_fragment:Vp,gradientmap_pars_fragment:Hp,lightmap_pars_fragment:Gp,lights_lambert_fragment:Wp,lights_lambert_pars_fragment:Xp,lights_pars_begin:qp,lights_toon_fragment:$p,lights_toon_pars_fragment:Kp,lights_phong_fragment:Jp,lights_phong_pars_fragment:Zp,lights_physical_fragment:Qp,lights_physical_pars_fragment:jp,lights_fragment_begin:t0,lights_fragment_maps:e0,lights_fragment_end:n0,lightprobes_pars_fragment:i0,logdepthbuf_fragment:s0,logdepthbuf_pars_fragment:r0,logdepthbuf_pars_vertex:a0,logdepthbuf_vertex:o0,map_fragment:l0,map_pars_fragment:c0,map_particle_fragment:h0,map_particle_pars_fragment:u0,metalnessmap_fragment:d0,metalnessmap_pars_fragment:f0,morphinstance_vertex:p0,morphcolor_vertex:m0,morphnormal_vertex:g0,morphtarget_pars_vertex:_0,morphtarget_vertex:v0,normal_fragment_begin:x0,normal_fragment_maps:y0,normal_pars_fragment:b0,normal_pars_vertex:M0,normal_vertex:S0,normalmap_pars_fragment:w0,clearcoat_normal_fragment_begin:A0,clearcoat_normal_fragment_maps:T0,clearcoat_pars_fragment:E0,iridescence_pars_fragment:R0,opaque_fragment:C0,packing:P0,premultiplied_alpha_fragment:I0,project_vertex:L0,dithering_fragment:D0,dithering_pars_fragment:N0,roughnessmap_fragment:U0,roughnessmap_pars_fragment:F0,shadowmap_pars_fragment:O0,shadowmap_pars_vertex:k0,shadowmap_vertex:B0,shadowmask_pars_fragment:z0,skinbase_vertex:V0,skinning_pars_vertex:H0,skinning_vertex:G0,skinnormal_vertex:W0,specularmap_fragment:X0,specularmap_pars_fragment:q0,tonemapping_fragment:Y0,tonemapping_pars_fragment:$0,transmission_fragment:K0,transmission_pars_fragment:J0,uv_pars_fragment:Z0,uv_pars_vertex:Q0,uv_vertex:j0,worldpos_vertex:tm,background_vert:em,background_frag:nm,backgroundCube_vert:im,backgroundCube_frag:sm,cube_vert:rm,cube_frag:am,depth_vert:om,depth_frag:lm,distance_vert:cm,distance_frag:hm,equirect_vert:um,equirect_frag:dm,linedashed_vert:fm,linedashed_frag:pm,meshbasic_vert:mm,meshbasic_frag:gm,meshlambert_vert:_m,meshlambert_frag:vm,meshmatcap_vert:xm,meshmatcap_frag:ym,meshnormal_vert:bm,meshnormal_frag:Mm,meshphong_vert:Sm,meshphong_frag:wm,meshphysical_vert:Am,meshphysical_frag:Tm,meshtoon_vert:Em,meshtoon_frag:Rm,points_vert:Cm,points_frag:Pm,shadow_vert:Im,shadow_frag:Lm,sprite_vert:Dm,sprite_frag:Nm},ft={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},Rn={basic:{uniforms:Ke([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Ke([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new _t(0)},envMapIntensity:{value:1}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Ke([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Ke([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Ke([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new _t(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Ke([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Ke([ft.points,ft.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Ke([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Ke([ft.common,ft.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Ke([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Ke([ft.sprite,ft.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distance:{uniforms:Ke([ft.common,ft.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distance_vert,fragmentShader:Yt.distance_frag},shadow:{uniforms:Ke([ft.lights,ft.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Rn.physical={uniforms:Ke([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const ur={r:0,b:0,g:0},Um=new qt,Xh=new Vt;Xh.set(-1,0,0,0,1,0,0,0,1);function Fm(i,t,e,n,s,r){const a=new _t(0);let o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(b){let S=b.isScene===!0?b.background:null;if(S&&S.isTexture){const x=b.backgroundBlurriness>0;S=t.get(S,x)}return S}function p(b){let S=!1;const x=f(b);x===null?m(a,o):x&&x.isColor&&(m(x,1),S=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(b,S){const x=f(S);x&&(x.isCubeTexture||x.mapping===Or)?(c===void 0&&(c=new k(new kt(1,1,1),new nn({name:"BackgroundCubeMaterial",uniforms:es(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Um.makeRotationFromEuler(S.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Xh),c.material.toneMapped=te.getTransfer(x.colorSpace)!==he,(h!==x||d!==x.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new k(new Is(2,2),new nn({name:"BackgroundMaterial",uniforms:es(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=te.getTransfer(x.colorSpace)!==he,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||d!==x.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,S){b.getRGB(ur,kh(i)),e.buffers.color.setClear(ur.r,ur.g,ur.b,S,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,S=1){a.set(b),o=S,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:p,addToRenderList:v,dispose:g}}function Om(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(C,L,B,H,O){let X=!1;const D=d(C,H,B,L);r!==D&&(r=D,c(r.object)),X=f(C,H,B,O),X&&p(C,H,B,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,x(C,L,B,H),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function h(C){return i.deleteVertexArray(C)}function d(C,L,B,H){const O=H.wireframe===!0;let X=n[L.id];X===void 0&&(X={},n[L.id]=X);const D=C.isInstancedMesh===!0?C.id:0;let q=X[D];q===void 0&&(q={},X[D]=q);let V=q[B.id];V===void 0&&(V={},q[B.id]=V);let K=V[O];return K===void 0&&(K=u(l()),V[O]=K),K}function u(C){const L=[],B=[],H=[];for(let O=0;O<e;O++)L[O]=0,B[O]=0,H[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:H,object:C,attributes:{},index:null}}function f(C,L,B,H){const O=r.attributes,X=L.attributes;let D=0;const q=B.getAttributes();for(const V in q)if(q[V].location>=0){const it=O[V];let lt=X[V];if(lt===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(lt=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(lt=C.instanceColor)),it===void 0||it.attribute!==lt||lt&&it.data!==lt.data)return!0;D++}return r.attributesNum!==D||r.index!==H}function p(C,L,B,H){const O={},X=L.attributes;let D=0;const q=B.getAttributes();for(const V in q)if(q[V].location>=0){let it=X[V];it===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(it=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(it=C.instanceColor));const lt={};lt.attribute=it,it&&it.data&&(lt.data=it.data),O[V]=lt,D++}r.attributes=O,r.attributesNum=D,r.index=H}function v(){const C=r.newAttributes;for(let L=0,B=C.length;L<B;L++)C[L]=0}function m(C){g(C,0)}function g(C,L){const B=r.newAttributes,H=r.enabledAttributes,O=r.attributeDivisors;B[C]=1,H[C]===0&&(i.enableVertexAttribArray(C),H[C]=1),O[C]!==L&&(i.vertexAttribDivisor(C,L),O[C]=L)}function b(){const C=r.newAttributes,L=r.enabledAttributes;for(let B=0,H=L.length;B<H;B++)L[B]!==C[B]&&(i.disableVertexAttribArray(B),L[B]=0)}function S(C,L,B,H,O,X,D){D===!0?i.vertexAttribIPointer(C,L,B,O,X):i.vertexAttribPointer(C,L,B,H,O,X)}function x(C,L,B,H){v();const O=H.attributes,X=B.getAttributes(),D=L.defaultAttributeValues;for(const q in X){const V=X[q];if(V.location>=0){let K=O[q];if(K===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(K=C.instanceColor)),K!==void 0){const it=K.normalized,lt=K.itemSize,Et=t.get(K);if(Et===void 0)continue;const oe=Et.buffer,Ht=Et.type,Z=Et.bytesPerElement,st=Ht===i.INT||Ht===i.UNSIGNED_INT||K.gpuType===Go;if(K.isInterleavedBufferAttribute){const nt=K.data,Nt=nt.stride,Bt=K.offset;if(nt.isInstancedInterleavedBuffer){for(let Dt=0;Dt<V.locationSize;Dt++)g(V.location+Dt,nt.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let Dt=0;Dt<V.locationSize;Dt++)m(V.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let Dt=0;Dt<V.locationSize;Dt++)S(V.location+Dt,lt/V.locationSize,Ht,it,Nt*Z,(Bt+lt/V.locationSize*Dt)*Z,st)}else{if(K.isInstancedBufferAttribute){for(let nt=0;nt<V.locationSize;nt++)g(V.location+nt,K.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let nt=0;nt<V.locationSize;nt++)m(V.location+nt);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let nt=0;nt<V.locationSize;nt++)S(V.location+nt,lt/V.locationSize,Ht,it,lt*Z,lt/V.locationSize*nt*Z,st)}}else if(D!==void 0){const it=D[q];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(V.location,it);break;case 3:i.vertexAttrib3fv(V.location,it);break;case 4:i.vertexAttrib4fv(V.location,it);break;default:i.vertexAttrib1fv(V.location,it)}}}}b()}function A(){E();for(const C in n){const L=n[C];for(const B in L){const H=L[B];for(const O in H){const X=H[O];for(const D in X)h(X[D].object),delete X[D];delete H[O]}}delete n[C]}}function M(C){if(n[C.id]===void 0)return;const L=n[C.id];for(const B in L){const H=L[B];for(const O in H){const X=H[O];for(const D in X)h(X[D].object),delete X[D];delete H[O]}}delete n[C.id]}function T(C){for(const L in n){const B=n[L];for(const H in B){const O=B[H];if(O[C.id]===void 0)continue;const X=O[C.id];for(const D in X)h(X[D].object),delete X[D];delete O[C.id]}}}function _(C){for(const L in n){const B=n[L],H=C.isInstancedMesh===!0?C.id:0,O=B[H];if(O!==void 0){for(const X in O){const D=O[X];for(const q in D)h(D[q].object),delete D[q];delete O[X]}delete B[H],Object.keys(B).length===0&&delete n[L]}}}function E(){P(),a=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:A,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function km(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Bm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==ln&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const _=T===Gn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==on&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==vn&&!_)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(It("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&It("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),M=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:x,maxSamples:A,samples:M}}function zm(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new mi,o=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,g=i.get(d);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const b=r?0:n,S=b*4;let x=g.clippingState||null;l.value=x,x=h(p,u,S,f);for(let A=0;A!==S;++A)x[A]=e[A];g.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,p!==!0||m===null){const g=f+v*4,b=u.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<g)&&(m=new Float32Array(g));for(let S=0,x=f;S!==v;++S,x+=4)a.copy(d[S]).applyMatrix4(b,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}const ii=4,Sc=[.125,.215,.35,.446,.526,.582],_i=20,Vm=256,ps=new pl,wc=new _t;let Ta=null,Ea=0,Ra=0,Ca=!1;const Hm=new I;class Ac{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Hm}=r;Ta=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ta,Ea,Ra),this._renderer.xr.enabled=Ca,t.scissorTest=!1,Wi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bi||t.mapping===Qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ta=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ye,minFilter:Ye,generateMipmaps:!1,type:Gn,format:ln,colorSpace:Tr,depthBuffer:!1},s=Tc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tc(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Gm(r)),this._blurMaterial=Xm(r,t,e),this._ggxMaterial=Wm(r,t,e)}return s}_compileMaterial(t){const e=new k(new le,t);this._renderer.compile(e,ps)}_sceneToCubeUV(t,e,n,s,r){const l=new je(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(wc),d.toneMapping=Pn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new k(new kt,new ji({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let g=!1;const b=t.background;b?b.isColor&&(m.color.copy(b),t.background=null,g=!0):(m.color.copy(wc),g=!0);for(let S=0;S<6;S++){const x=S%3;x===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):x===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));const A=this._cubeSize;Wi(s,x*A,S>2?A:0,A,A),d.setRenderTarget(s),g&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===bi||t.mapping===Qi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ec());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Wi(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,ps)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,f=d*u,{_lodMax:p}=this,v=this._sizeLods[n],m=3*v*(n>p-ii?n-p+ii:0),g=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Wi(r,m,g,3*v,2*v),s.setRenderTarget(r),s.render(o,ps),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Wi(t,m,g,3*v,2*v),s.setRenderTarget(t),s.render(o,ps)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ft("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=c;const u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*_i-1),v=r/p,m=isFinite(r)?1+Math.floor(h*v):_i;m>_i&&It(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const g=[];let b=0;for(let T=0;T<_i;++T){const _=T/v,E=Math.exp(-_*_/2);g.push(E),T===0?b+=E:T<m&&(b+=2*E)}for(let T=0;T<g.length;T++)g[T]=g[T]/b;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:S}=this;u.dTheta.value=p,u.mipInt.value=S-n;const x=this._sizeLods[s],A=3*x*(s>S-ii?s-S+ii:0),M=4*(this._cubeSize-x);Wi(e,A,M,3*x,2*x),l.setRenderTarget(e),l.render(d,ps)}}function Gm(i){const t=[],e=[],n=[];let s=i;const r=i-ii+1+Sc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ii?l=Sc[a-i+ii-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,v=3,m=2,g=1,b=new Float32Array(v*p*f),S=new Float32Array(m*p*f),x=new Float32Array(g*p*f);for(let M=0;M<f;M++){const T=M%3*2/3-1,_=M>2?0:-1,E=[T,_,0,T+2/3,_,0,T+2/3,_+1,0,T,_,0,T+2/3,_+1,0,T,_+1,0];b.set(E,v*p*M),S.set(u,m*p*M);const P=[M,M,M,M,M,M];x.set(P,g*p*M)}const A=new le;A.setAttribute("position",new Qt(b,v)),A.setAttribute("uv",new Qt(S,m)),A.setAttribute("faceIndex",new Qt(x,g)),n.push(new k(A,null)),s>ii&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Tc(i,t,e){const n=new In(i,t,e);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Wm(i,t,e){return new nn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Vm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Xm(i,t,e){const n=new Float32Array(_i),s=new I(0,1,0);return new nn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Ec(){return new nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Rc(){return new nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Vr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class qh extends In{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Nh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new kt(5,5,5),r=new nn({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Je,blending:Vn});r.uniforms.tEquirect.value=e;const a=new k(s,r),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=Ye),new Of(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}function qm(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Xr||f===qr)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const v=new qh(p.height);return v.fromEquirectangularTexture(i,u),t.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,p=f===Xr||f===qr,v=f===bi||f===Qi;if(p||v){let m=e.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new Ac(i)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const b=u.image;return p&&b&&b.height>0||v&&b&&l(b)?(n===null&&(n=new Ac(i)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Xr?u.mapping=bi:f===qr&&(u.mapping=Qi),u}function l(u){let f=0;const p=6;for(let v=0;v<p;v++)u[v]!==void 0&&f++;return f===p}function c(u){const f=u.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Ym(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ki("WebGLRenderer: "+n+" extension not supported."),s}}}function $m(i,t,e,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,p=d.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const b=f.array;v=f.version;for(let S=0,x=b.length;S<x;S+=3){const A=b[S+0],M=b[S+1],T=b[S+2];u.push(A,M,M,T,T,A)}}else{const b=p.array;v=p.version;for(let S=0,x=b.length/3-1;S<x;S+=3){const A=S+0,M=S+1,T=S+2;u.push(A,M,M,T,T,A)}}const m=new(p.count>=65535?Rh:nl)(u,1);m.version=v;const g=r.get(d);g&&t.remove(g),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Km(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let m=0;m<f;m++)v+=u[m];e.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Jm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Ft("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Zm(i,t,e){const n=new WeakMap,s=new ge;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let E=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let S=0;f===!0&&(S=1),p===!0&&(S=2),v===!0&&(S=3);let x=o.attributes.position.count*S,A=1;x>t.maxTextureSize&&(A=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const M=new Float32Array(x*A*4*d),T=new Th(M,x,A,d);T.type=vn,T.needsUpdate=!0;const _=S*4;for(let P=0;P<d;P++){const C=m[P],L=g[P],B=b[P],H=x*A*4*P;for(let O=0;O<C.count;O++){const X=O*_;f===!0&&(s.fromBufferAttribute(C,O),M[H+X+0]=s.x,M[H+X+1]=s.y,M[H+X+2]=s.z,M[H+X+3]=0),p===!0&&(s.fromBufferAttribute(L,O),M[H+X+4]=s.x,M[H+X+5]=s.y,M[H+X+6]=s.z,M[H+X+7]=0),v===!0&&(s.fromBufferAttribute(B,O),M[H+X+8]=s.x,M[H+X+9]=s.y,M[H+X+10]=s.z,M[H+X+11]=B.itemSize===4?s.w:1)}}u={count:d,texture:T,size:new mt(x,A)},n.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Qm(i,t,e,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const jm={[ch]:"LINEAR_TONE_MAPPING",[hh]:"REINHARD_TONE_MAPPING",[uh]:"CINEON_TONE_MAPPING",[dh]:"ACES_FILMIC_TONE_MAPPING",[ph]:"AGX_TONE_MAPPING",[mh]:"NEUTRAL_TONE_MAPPING",[fh]:"CUSTOM_TONE_MAPPING"};function tg(i,t,e,n,s,r){const a=new In(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new ts(t,e):void 0}),o=new In(t,e,{type:Gn,depthBuffer:!1,stencilBuffer:!1}),l=new le;l.setAttribute("position",new ae([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ae([0,2,0,0,2,0],2));const c=new yf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new k(l,c),d=new pl(-1,1,1,-1,0,1);let u=null,f=null,p=!1,v,m=null,g=[],b=!1;this.setSize=function(S,x){a.setSize(S,x),o.setSize(S,x);for(let A=0;A<g.length;A++){const M=g[A];M.setSize&&M.setSize(S,x)}},this.setEffects=function(S){g=S,b=g.length>0&&g[0].isRenderPass===!0;const x=a.width,A=a.height;for(let M=0;M<g.length;M++){const T=g[M];T.setSize&&T.setSize(x,A)}},this.begin=function(S,x){if(p||S.toneMapping===Pn&&g.length===0)return!1;if(m=x,x!==null){const A=x.width,M=x.height;(a.width!==A||a.height!==M)&&this.setSize(A,M)}return b===!1&&S.setRenderTarget(a),v=S.toneMapping,S.toneMapping=Pn,!0},this.hasRenderPass=function(){return b},this.end=function(S,x){S.toneMapping=v,p=!0;let A=a,M=o;for(let T=0;T<g.length;T++){const _=g[T];if(_.enabled!==!1&&(_.render(S,M,A,x),_.needsSwap!==!1)){const E=A;A=M,M=E}}if(u!==S.outputColorSpace||f!==S.toneMapping){u=S.outputColorSpace,f=S.toneMapping,c.defines={},te.getTransfer(u)===he&&(c.defines.SRGB_TRANSFER="");const T=jm[f];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,S.setRenderTarget(m),S.render(h,d),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Yh=new Ze,Fo=new ts(1,1),$h=new Th,Kh=new Cd,Jh=new Nh,Cc=[],Pc=[],Ic=new Float32Array(16),Lc=new Float32Array(9),Dc=new Float32Array(4);function ss(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Cc[s];if(r===void 0&&(r=new Float32Array(s),Cc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Hr(i,t){let e=Pc[t];e===void 0&&(e=new Int32Array(t),Pc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function eg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2fv(this.addr,t),Fe(e,t)}}function ig(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;i.uniform3fv(this.addr,t),Fe(e,t)}}function sg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4fv(this.addr,t),Fe(e,t)}}function rg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;Dc.set(n),i.uniformMatrix2fv(this.addr,!1,Dc),Fe(e,n)}}function ag(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;Lc.set(n),i.uniformMatrix3fv(this.addr,!1,Lc),Fe(e,n)}}function og(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ue(e,n))return;Ic.set(n),i.uniformMatrix4fv(this.addr,!1,Ic),Fe(e,n)}}function lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2iv(this.addr,t),Fe(e,t)}}function hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3iv(this.addr,t),Fe(e,t)}}function ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4iv(this.addr,t),Fe(e,t)}}function dg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2uiv(this.addr,t),Fe(e,t)}}function pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3uiv(this.addr,t),Fe(e,t)}}function mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4uiv(this.addr,t),Fe(e,t)}}function gg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Fo.compareFunction=e.isReversedDepthBuffer()?Zo:Jo,r=Fo):r=Yh,e.setTexture2D(t||r,s)}function _g(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Kh,s)}function vg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Jh,s)}function xg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||$h,s)}function yg(i){switch(i){case 5126:return eg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return ag;case 35676:return og;case 5124:case 35670:return lg;case 35667:case 35671:return cg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return _g;case 35680:case 36300:case 36308:case 36293:return vg;case 36289:case 36303:case 36311:case 36292:return xg}}function bg(i,t){i.uniform1fv(this.addr,t)}function Mg(i,t){const e=ss(t,this.size,2);i.uniform2fv(this.addr,e)}function Sg(i,t){const e=ss(t,this.size,3);i.uniform3fv(this.addr,e)}function wg(i,t){const e=ss(t,this.size,4);i.uniform4fv(this.addr,e)}function Ag(i,t){const e=ss(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Tg(i,t){const e=ss(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Eg(i,t){const e=ss(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Rg(i,t){i.uniform1iv(this.addr,t)}function Cg(i,t){i.uniform2iv(this.addr,t)}function Pg(i,t){i.uniform3iv(this.addr,t)}function Ig(i,t){i.uniform4iv(this.addr,t)}function Lg(i,t){i.uniform1uiv(this.addr,t)}function Dg(i,t){i.uniform2uiv(this.addr,t)}function Ng(i,t){i.uniform3uiv(this.addr,t)}function Ug(i,t){i.uniform4uiv(this.addr,t)}function Fg(i,t,e){const n=this.cache,s=t.length,r=Hr(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Fo:a=Yh;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function Og(i,t,e){const n=this.cache,s=t.length,r=Hr(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Kh,r[a])}function kg(i,t,e){const n=this.cache,s=t.length,r=Hr(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Jh,r[a])}function Bg(i,t,e){const n=this.cache,s=t.length,r=Hr(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||$h,r[a])}function zg(i){switch(i){case 5126:return bg;case 35664:return Mg;case 35665:return Sg;case 35666:return wg;case 35674:return Ag;case 35675:return Tg;case 35676:return Eg;case 5124:case 35670:return Rg;case 35667:case 35671:return Cg;case 35668:case 35672:return Pg;case 35669:case 35673:return Ig;case 5125:return Lg;case 36294:return Dg;case 36295:return Ng;case 36296:return Ug;case 35678:case 36198:case 36298:case 36306:case 35682:return Fg;case 35679:case 36299:case 36307:return Og;case 35680:case 36300:case 36308:case 36293:return kg;case 36289:case 36303:case 36311:case 36292:return Bg}}class Vg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=yg(e.type)}}class Hg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=zg(e.type)}}class Gg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function Nc(i,t){i.seq.push(t),i.map[t.id]=t}function Wg(i,t,e){const n=i.name,s=n.length;for(Pa.lastIndex=0;;){const r=Pa.exec(n),a=Pa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Nc(e,c===void 0?new Vg(o,i,t):new Hg(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new Gg(o),Nc(e,d)),e=d}}}class yr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Wg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Uc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Xg=37297;let qg=0;function Yg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Fc=new Vt;function $g(i){te._getMatrix(Fc,te.workingColorSpace,i);const t=`mat3( ${Fc.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case Er:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return It("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Oc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Yg(i.getShaderSource(t),o)}else return r}function Kg(i,t){const e=$g(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Jg={[ch]:"Linear",[hh]:"Reinhard",[uh]:"Cineon",[dh]:"ACESFilmic",[ph]:"AgX",[mh]:"Neutral",[fh]:"Custom"};function Zg(i,t){const e=Jg[t];return e===void 0?(It("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const dr=new I;function Qg(){te.getLuminanceCoefficients(dr);const i=dr.x.toFixed(4),t=dr.y.toFixed(4),e=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ys).join(`
`)}function t_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function e_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ys(i){return i!==""}function kc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const n_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oo(i){return i.replace(n_,s_)}const i_=new Map;function s_(i,t){let e=Yt[t];if(e===void 0){const n=i_.get(t);if(n!==void 0)e=Yt[n],It('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Oo(e)}const r_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zc(i){return i.replace(r_,a_)}function a_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const o_={[mr]:"SHADOWMAP_TYPE_PCF",[xs]:"SHADOWMAP_TYPE_VSM"};function l_(i){return o_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const c_={[bi]:"ENVMAP_TYPE_CUBE",[Qi]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE_UV"};function h_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":c_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const u_={[Qi]:"ENVMAP_MODE_REFRACTION"};function d_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":u_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const f_={[lh]:"ENVMAP_BLENDING_MULTIPLY",[Gu]:"ENVMAP_BLENDING_MIX",[Wu]:"ENVMAP_BLENDING_ADD"};function p_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":f_[i.combine]||"ENVMAP_BLENDING_NONE"}function m_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function g_(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=l_(e),c=h_(e),h=d_(e),d=p_(e),u=m_(e),f=jg(e),p=t_(r),v=s.createProgram();let m,g,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),g.length>0&&(g+=`
`)):(m=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ys).join(`
`),g=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Pn?"#define TONE_MAPPING":"",e.toneMapping!==Pn?Yt.tonemapping_pars_fragment:"",e.toneMapping!==Pn?Zg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,Kg("linearToOutputTexel",e.outputColorSpace),Qg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ys).join(`
`)),a=Oo(a),a=kc(a,e),a=Bc(a,e),o=Oo(o),o=kc(o,e),o=Bc(o,e),a=zc(a),o=zc(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const S=b+m+a,x=b+g+o,A=Uc(s,s.VERTEX_SHADER,S),M=Uc(s,s.FRAGMENT_SHADER,x);s.attachShader(v,A),s.attachShader(v,M),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(C){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(A)||"",H=s.getShaderInfoLog(M)||"",O=L.trim(),X=B.trim(),D=H.trim();let q=!0,V=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,A,M);else{const K=Oc(s,A,"vertex"),it=Oc(s,M,"fragment");Ft("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+O+`
`+K+`
`+it)}else O!==""?It("WebGLProgram: Program Info Log:",O):(X===""||D==="")&&(V=!1);V&&(C.diagnostics={runnable:q,programLog:O,vertexShader:{log:X,prefix:m},fragmentShader:{log:D,prefix:g}})}s.deleteShader(A),s.deleteShader(M),_=new yr(s,v),E=e_(s,v)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(v,Xg)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=qg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=M,this}let __=0;class v_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new x_(t),e.set(t,n)),n}}class x_{constructor(t){this.id=__++,this.code=t,this.usedTimes=0}}function y_(i){return i===Mi||i===Mr||i===Sr}function b_(i,t,e,n,s,r){const a=new tl,o=new v_,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,E,P,C,L,B){const H=C.fog,O=L.geometry,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,D=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,q=t.get(_.envMap||X,D),V=q&&q.mapping===Or?q.image.height:null,K=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&It("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const it=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,lt=it!==void 0?it.length:0;let Et=0;O.morphAttributes.position!==void 0&&(Et=1),O.morphAttributes.normal!==void 0&&(Et=2),O.morphAttributes.color!==void 0&&(Et=3);let oe,Ht,Z,st;if(K){const St=Rn[K];oe=St.vertexShader,Ht=St.fragmentShader}else{oe=_.vertexShader,Ht=_.fragmentShader;const St=o.getVertexShaderStage(_),Ae=o.getFragmentShaderStage(_);o.update(_,St,Ae),Z=St.id,st=Ae.id}const nt=i.getRenderTarget(),Nt=i.state.buffers.depth.getReversed(),Bt=L.isInstancedMesh===!0,Dt=L.isBatchedMesh===!0,Se=!!_.map,$t=!!_.matcap,ie=!!q,ee=!!_.aoMap,Xt=!!_.lightMap,ce=!!_.bumpMap&&_.wireframe===!1,we=!!_.normalMap,yt=!!_.displacementMap,zt=!!_.emissiveMap,fe=!!_.metalnessMap,re=!!_.roughnessMap,U=_.anisotropy>0,He=_.clearcoat>0,se=_.dispersion>0,R=_.iridescence>0,y=_.sheen>0,z=_.transmission>0,Y=U&&!!_.anisotropyMap,J=He&&!!_.clearcoatMap,rt=He&&!!_.clearcoatNormalMap,ot=He&&!!_.clearcoatRoughnessMap,Q=R&&!!_.iridescenceMap,tt=R&&!!_.iridescenceThicknessMap,ct=y&&!!_.sheenColorMap,Rt=y&&!!_.sheenRoughnessMap,dt=!!_.specularMap,ht=!!_.specularColorMap,Lt=!!_.specularIntensityMap,Ut=z&&!!_.transmissionMap,Gt=z&&!!_.thicknessMap,N=!!_.gradientMap,at=!!_.alphaMap,j=_.alphaTest>0,ut=!!_.alphaHash,vt=!!_.extensions;let et=Pn;_.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(et=i.toneMapping);const At={shaderID:K,shaderType:_.type,shaderName:_.name,vertexShader:oe,fragmentShader:Ht,defines:_.defines,customVertexShaderID:Z,customFragmentShaderID:st,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Dt,batchingColor:Dt&&L._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&L.instanceColor!==null,instancingMorph:Bt&&L.morphTexture!==null,outputColorSpace:nt===null?i.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:te.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Se,matcap:$t,envMap:ie,envMapMode:ie&&q.mapping,envMapCubeUVHeight:V,aoMap:ee,lightMap:Xt,bumpMap:ce,normalMap:we,displacementMap:yt,emissiveMap:zt,normalMapObjectSpace:we&&_.normalMapType===Ju,normalMapTangentSpace:we&&_.normalMapType===Lo,packedNormalMap:we&&_.normalMapType===Lo&&y_(_.normalMap.format),metalnessMap:fe,roughnessMap:re,anisotropy:U,anisotropyMap:Y,clearcoat:He,clearcoatMap:J,clearcoatNormalMap:rt,clearcoatRoughnessMap:ot,dispersion:se,iridescence:R,iridescenceMap:Q,iridescenceThicknessMap:tt,sheen:y,sheenColorMap:ct,sheenRoughnessMap:Rt,specularMap:dt,specularColorMap:ht,specularIntensityMap:Lt,transmission:z,transmissionMap:Ut,thicknessMap:Gt,gradientMap:N,opaque:_.transparent===!1&&_.blending===$i&&_.alphaToCoverage===!1,alphaMap:at,alphaTest:j,alphaHash:ut,combine:_.combine,mapUv:Se&&p(_.map.channel),aoMapUv:ee&&p(_.aoMap.channel),lightMapUv:Xt&&p(_.lightMap.channel),bumpMapUv:ce&&p(_.bumpMap.channel),normalMapUv:we&&p(_.normalMap.channel),displacementMapUv:yt&&p(_.displacementMap.channel),emissiveMapUv:zt&&p(_.emissiveMap.channel),metalnessMapUv:fe&&p(_.metalnessMap.channel),roughnessMapUv:re&&p(_.roughnessMap.channel),anisotropyMapUv:Y&&p(_.anisotropyMap.channel),clearcoatMapUv:J&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:rt&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&p(_.sheenRoughnessMap.channel),specularMapUv:dt&&p(_.specularMap.channel),specularColorMapUv:ht&&p(_.specularColorMap.channel),specularIntensityMapUv:Lt&&p(_.specularIntensityMap.channel),transmissionMapUv:Ut&&p(_.transmissionMap.channel),thicknessMapUv:Gt&&p(_.thicknessMap.channel),alphaMapUv:at&&p(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(we||U),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!O.attributes.uv&&(Se||at),fog:!!H,useFog:_.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&we===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Nt,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:Et,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:et,decodeVideoTexture:Se&&_.map.isVideoTexture===!0&&te.getTransfer(_.map.colorSpace)===he,decodeVideoTextureEmissive:zt&&_.emissiveMap.isVideoTexture===!0&&te.getTransfer(_.emissiveMap.colorSpace)===he,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===tn,flipSided:_.side===Je,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:vt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&_.extensions.multiDraw===!0||Dt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function m(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)E.push(P),E.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(g(E,_),b(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function g(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function b(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function S(_){const E=f[_.type];let P;if(E){const C=Rn[E];P=_f.clone(C.uniforms)}else P=_.uniforms;return P}function x(_,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new g_(i,E,_,s),c.push(P),h.set(E,P)),P}function A(_){if(--_.usedTimes===0){const E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function M(_){o.remove(_)}function T(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:S,acquireProgram:x,releaseProgram:A,releaseShaderCache:M,programs:c,dispose:T}}function M_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function S_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Hc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Gc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,v,m,g){let b=i[t];return b===void 0?(b={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:m,group:g},i[t]=b):(b.id=u.id,b.object=u,b.geometry=f,b.material=p,b.materialVariant=a(u),b.groupOrder=v,b.renderOrder=u.renderOrder,b.z=m,b.group=g),t++,b}function l(u,f,p,v,m,g){const b=o(u,f,p,v,m,g);p.transmission>0?n.push(b):p.transparent===!0?s.push(b):e.push(b)}function c(u,f,p,v,m,g){const b=o(u,f,p,v,m,g);p.transmission>0?n.unshift(b):p.transparent===!0?s.unshift(b):e.unshift(b)}function h(u,f,p){e.length>1&&e.sort(u||S_),n.length>1&&n.sort(f||Hc),s.length>1&&s.sort(f||Hc),p&&(e.reverse(),n.reverse(),s.reverse())}function d(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function w_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Gc,i.set(n,[a])):s>=r.length?(a=new Gc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function A_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new _t};break;case"SpotLight":e={position:new I,direction:new I,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new _t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":e={color:new _t,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function T_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let E_=0;function R_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function C_(i){const t=new A_,e=T_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new qt,a=new qt;function o(c){let h=0,d=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,p=0,v=0,m=0,g=0,b=0,S=0,x=0,A=0,M=0,T=0;c.sort(R_);for(let E=0,P=c.length;E<P;E++){const C=c[E],L=C.color,B=C.intensity,H=C.distance;let O=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Mi?O=C.shadow.map.texture:O=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=L.r*B,d+=L.g*B,u+=L.b*B;else if(C.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(C.sh.coefficients[X],B);T++}else if(C.isDirectionalLight){const X=t.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const D=C.shadow,q=e.get(C);q.shadowIntensity=D.intensity,q.shadowBias=D.bias,q.shadowNormalBias=D.normalBias,q.shadowRadius=D.radius,q.shadowMapSize=D.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=C.shadow.matrix,b++}n.directional[f]=X,f++}else if(C.isSpotLight){const X=t.get(C);X.position.setFromMatrixPosition(C.matrixWorld),X.color.copy(L).multiplyScalar(B),X.distance=H,X.coneCos=Math.cos(C.angle),X.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),X.decay=C.decay,n.spot[v]=X;const D=C.shadow;if(C.map&&(n.spotLightMap[A]=C.map,A++,D.updateMatrices(C),C.castShadow&&M++),n.spotLightMatrix[v]=D.matrix,C.castShadow){const q=e.get(C);q.shadowIntensity=D.intensity,q.shadowBias=D.bias,q.shadowNormalBias=D.normalBias,q.shadowRadius=D.radius,q.shadowMapSize=D.mapSize,n.spotShadow[v]=q,n.spotShadowMap[v]=O,x++}v++}else if(C.isRectAreaLight){const X=t.get(C);X.color.copy(L).multiplyScalar(B),X.halfWidth.set(C.width*.5,0,0),X.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=X,m++}else if(C.isPointLight){const X=t.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),X.distance=C.distance,X.decay=C.decay,C.castShadow){const D=C.shadow,q=e.get(C);q.shadowIntensity=D.intensity,q.shadowBias=D.bias,q.shadowNormalBias=D.normalBias,q.shadowRadius=D.radius,q.shadowMapSize=D.mapSize,q.shadowCameraNear=D.camera.near,q.shadowCameraFar=D.camera.far,n.pointShadow[p]=q,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=C.shadow.matrix,S++}n.point[p]=X,p++}else if(C.isHemisphereLight){const X=t.get(C);X.skyColor.copy(C.color).multiplyScalar(B),X.groundColor.copy(C.groundColor).multiplyScalar(B),n.hemi[g]=X,g++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const _=n.hash;(_.directionalLength!==f||_.pointLength!==p||_.spotLength!==v||_.rectAreaLength!==m||_.hemiLength!==g||_.numDirectionalShadows!==b||_.numPointShadows!==S||_.numSpotShadows!==x||_.numSpotMaps!==A||_.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+A-M,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=T,_.directionalLength=f,_.pointLength=p,_.spotLength=v,_.rectAreaLength=m,_.hemiLength=g,_.numDirectionalShadows=b,_.numPointShadows=S,_.numSpotShadows=x,_.numSpotMaps=A,_.numLightProbes=T,n.version=E_++)}function l(c,h){let d=0,u=0,f=0,p=0,v=0;const m=h.matrixWorldInverse;for(let g=0,b=c.length;g<b;g++){const S=c[g];if(S.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(S.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const x=n.rectArea[p];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),p++}else if(S.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function Wc(i){const t=new C_(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function P_(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Wc(i),t.set(s,[o])):r>=a.length?(o=new Wc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const I_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,L_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,D_=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],N_=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Xc=new qt,ms=new I,Ia=new I;function U_(i,t,e){let n=new rl;const s=new mt,r=new mt,a=new ge,o=new Mf,l=new Sf,c={},h=e.maxTextureSize,d={[si]:Je,[Je]:si,[tn]:tn},u=new nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:I_,fragmentShader:L_}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new le;p.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new k(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mr;let g=this.type;this.render=function(M,T,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===wu&&(It("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=mr);const E=i.getRenderTarget(),P=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Vn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const B=g!==this.type;B&&T.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(O=>O.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,O=M.length;H<O;H++){const X=M[H],D=X.shadow;if(D===void 0){It("WebGLShadowMap:",X,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;s.copy(D.mapSize);const q=D.getFrameExtents();s.multiply(q),r.copy(D.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,D.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,D.mapSize.y=r.y));const V=i.state.buffers.depth.getReversed();if(D.camera._reversedDepth=V,D.map===null||B===!0){if(D.map!==null&&(D.map.depthTexture!==null&&(D.map.depthTexture.dispose(),D.map.depthTexture=null),D.map.dispose()),this.type===xs){if(X.isPointLight){It("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}D.map=new In(s.x,s.y,{format:Mi,type:Gn,minFilter:Ye,magFilter:Ye,generateMipmaps:!1}),D.map.texture.name=X.name+".shadowMap",D.map.depthTexture=new ts(s.x,s.y,vn),D.map.depthTexture.name=X.name+".shadowMapDepth",D.map.depthTexture.format=Wn,D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Ve,D.map.depthTexture.magFilter=Ve}else X.isPointLight?(D.map=new qh(s.x),D.map.depthTexture=new jd(s.x,Dn)):(D.map=new In(s.x,s.y),D.map.depthTexture=new ts(s.x,s.y,Dn)),D.map.depthTexture.name=X.name+".shadowMap",D.map.depthTexture.format=Wn,this.type===mr?(D.map.depthTexture.compareFunction=V?Zo:Jo,D.map.depthTexture.minFilter=Ye,D.map.depthTexture.magFilter=Ye):(D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Ve,D.map.depthTexture.magFilter=Ve);D.camera.updateProjectionMatrix()}const K=D.map.isWebGLCubeRenderTarget?6:1;for(let it=0;it<K;it++){if(D.map.isWebGLCubeRenderTarget)i.setRenderTarget(D.map,it),i.clear();else{it===0&&(i.setRenderTarget(D.map),i.clear());const lt=D.getViewport(it);a.set(r.x*lt.x,r.y*lt.y,r.x*lt.z,r.y*lt.w),L.viewport(a)}if(X.isPointLight){const lt=D.camera,Et=D.matrix,oe=X.distance||lt.far;oe!==lt.far&&(lt.far=oe,lt.updateProjectionMatrix()),ms.setFromMatrixPosition(X.matrixWorld),lt.position.copy(ms),Ia.copy(lt.position),Ia.add(D_[it]),lt.up.copy(N_[it]),lt.lookAt(Ia),lt.updateMatrixWorld(),Et.makeTranslation(-ms.x,-ms.y,-ms.z),Xc.multiplyMatrices(lt.projectionMatrix,lt.matrixWorldInverse),D._frustum.setFromProjectionMatrix(Xc,lt.coordinateSystem,lt.reversedDepth)}else D.updateMatrices(X);n=D.getFrustum(),x(T,_,D.camera,X,this.type)}D.isPointLightShadow!==!0&&this.type===xs&&b(D,_),D.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(E,P,C)};function b(M,T){const _=t.update(v);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new In(s.x,s.y,{format:Mi,type:Gn})),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(T,null,_,u,v,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(T,null,_,f,v,null)}function S(M,T,_,E){let P=null;const C=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(C!==void 0)P=C;else if(P=_.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const L=P.uuid,B=T.uuid;let H=c[L];H===void 0&&(H={},c[L]=H);let O=H[B];O===void 0&&(O=P.clone(),H[B]=O,T.addEventListener("dispose",A)),P=O}if(P.visible=T.visible,P.wireframe=T.wireframe,E===xs?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:d[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,_.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const L=i.properties.get(P);L.light=_}return P}function x(M,T,_,E,P){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&P===xs)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);const B=t.update(M),H=M.material;if(Array.isArray(H)){const O=B.groups;for(let X=0,D=O.length;X<D;X++){const q=O[X],V=H[q.materialIndex];if(V&&V.visible){const K=S(M,V,E,P);M.onBeforeShadow(i,M,T,_,B,K,q),i.renderBufferDirect(_,null,B,K,M,q),M.onAfterShadow(i,M,T,_,B,K,q)}}}else if(H.visible){const O=S(M,H,E,P);M.onBeforeShadow(i,M,T,_,B,O,null),i.renderBufferDirect(_,null,B,O,M,null),M.onAfterShadow(i,M,T,_,B,O,null)}}const L=M.children;for(let B=0,H=L.length;B<H;B++)x(L[B],T,_,E,P)}function A(M){M.target.removeEventListener("dispose",A);for(const _ in c){const E=c[_],P=M.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function F_(i,t){function e(){let N=!1;const at=new ge;let j=null;const ut=new ge(0,0,0,0);return{setMask:function(vt){j!==vt&&!N&&(i.colorMask(vt,vt,vt,vt),j=vt)},setLocked:function(vt){N=vt},setClear:function(vt,et,At,St,Ae){Ae===!0&&(vt*=St,et*=St,At*=St),at.set(vt,et,At,St),ut.equals(at)===!1&&(i.clearColor(vt,et,At,St),ut.copy(at))},reset:function(){N=!1,j=null,ut.set(-1,0,0,0)}}}function n(){let N=!1,at=!1,j=null,ut=null,vt=null;return{setReversed:function(et){if(at!==et){const At=t.get("EXT_clip_control");et?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),at=et;const St=vt;vt=null,this.setClear(St)}},getReversed:function(){return at},setTest:function(et){et?nt(i.DEPTH_TEST):Nt(i.DEPTH_TEST)},setMask:function(et){j!==et&&!N&&(i.depthMask(et),j=et)},setFunc:function(et){if(at&&(et=od[et]),ut!==et){switch(et){case Wa:i.depthFunc(i.NEVER);break;case Xa:i.depthFunc(i.ALWAYS);break;case qa:i.depthFunc(i.LESS);break;case Zi:i.depthFunc(i.LEQUAL);break;case Ya:i.depthFunc(i.EQUAL);break;case $a:i.depthFunc(i.GEQUAL);break;case Ka:i.depthFunc(i.GREATER);break;case Ja:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=et}},setLocked:function(et){N=et},setClear:function(et){vt!==et&&(vt=et,at&&(et=1-et),i.clearDepth(et))},reset:function(){N=!1,j=null,ut=null,vt=null,at=!1}}}function s(){let N=!1,at=null,j=null,ut=null,vt=null,et=null,At=null,St=null,Ae=null;return{setTest:function(xe){N||(xe?nt(i.STENCIL_TEST):Nt(i.STENCIL_TEST))},setMask:function(xe){at!==xe&&!N&&(i.stencilMask(xe),at=xe)},setFunc:function(xe,Mn,Sn){(j!==xe||ut!==Mn||vt!==Sn)&&(i.stencilFunc(xe,Mn,Sn),j=xe,ut=Mn,vt=Sn)},setOp:function(xe,Mn,Sn){(et!==xe||At!==Mn||St!==Sn)&&(i.stencilOp(xe,Mn,Sn),et=xe,At=Mn,St=Sn)},setLocked:function(xe){N=xe},setClear:function(xe){Ae!==xe&&(i.clearStencil(xe),Ae=xe)},reset:function(){N=!1,at=null,j=null,ut=null,vt=null,et=null,At=null,St=null,Ae=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u={},f=new WeakMap,p=[],v=null,m=!1,g=null,b=null,S=null,x=null,A=null,M=null,T=null,_=new _t(0,0,0),E=0,P=!1,C=null,L=null,B=null,H=null,O=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,q=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(V)[1]),D=q>=1):V.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),D=q>=2);let K=null,it={};const lt=i.getParameter(i.SCISSOR_BOX),Et=i.getParameter(i.VIEWPORT),oe=new ge().fromArray(lt),Ht=new ge().fromArray(Et);function Z(N,at,j,ut){const vt=new Uint8Array(4),et=i.createTexture();i.bindTexture(N,et),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let At=0;At<j;At++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(at+At,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return et}const st={};st[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),nt(i.DEPTH_TEST),a.setFunc(Zi),ce(!1),we(Cl),nt(i.CULL_FACE),ee(Vn);function nt(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Nt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Bt(N,at){return u[N]!==at?(i.bindFramebuffer(N,at),u[N]=at,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=at),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=at),!0):!1}function Dt(N,at){let j=p,ut=!1;if(N){j=f.get(at),j===void 0&&(j=[],f.set(at,j));const vt=N.textures;if(j.length!==vt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let et=0,At=vt.length;et<At;et++)j[et]=i.COLOR_ATTACHMENT0+et;j.length=vt.length,ut=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ut=!0);ut&&i.drawBuffers(j)}function Se(N){return v!==N?(i.useProgram(N),v=N,!0):!1}const $t={[gi]:i.FUNC_ADD,[Tu]:i.FUNC_SUBTRACT,[Eu]:i.FUNC_REVERSE_SUBTRACT};$t[Ru]=i.MIN,$t[Cu]=i.MAX;const ie={[Pu]:i.ZERO,[Iu]:i.ONE,[Lu]:i.SRC_COLOR,[Ha]:i.SRC_ALPHA,[ku]:i.SRC_ALPHA_SATURATE,[Fu]:i.DST_COLOR,[Nu]:i.DST_ALPHA,[Du]:i.ONE_MINUS_SRC_COLOR,[Ga]:i.ONE_MINUS_SRC_ALPHA,[Ou]:i.ONE_MINUS_DST_COLOR,[Uu]:i.ONE_MINUS_DST_ALPHA,[Bu]:i.CONSTANT_COLOR,[zu]:i.ONE_MINUS_CONSTANT_COLOR,[Vu]:i.CONSTANT_ALPHA,[Hu]:i.ONE_MINUS_CONSTANT_ALPHA};function ee(N,at,j,ut,vt,et,At,St,Ae,xe){if(N===Vn){m===!0&&(Nt(i.BLEND),m=!1);return}if(m===!1&&(nt(i.BLEND),m=!0),N!==Au){if(N!==g||xe!==P){if((b!==gi||A!==gi)&&(i.blendEquation(i.FUNC_ADD),b=gi,A=gi),xe)switch(N){case $i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yi:i.blendFunc(i.ONE,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ft("WebGLState: Invalid blending: ",N);break}else switch(N){case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Pl:Ft("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Il:Ft("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ft("WebGLState: Invalid blending: ",N);break}S=null,x=null,M=null,T=null,_.set(0,0,0),E=0,g=N,P=xe}return}vt=vt||at,et=et||j,At=At||ut,(at!==b||vt!==A)&&(i.blendEquationSeparate($t[at],$t[vt]),b=at,A=vt),(j!==S||ut!==x||et!==M||At!==T)&&(i.blendFuncSeparate(ie[j],ie[ut],ie[et],ie[At]),S=j,x=ut,M=et,T=At),(St.equals(_)===!1||Ae!==E)&&(i.blendColor(St.r,St.g,St.b,Ae),_.copy(St),E=Ae),g=N,P=!1}function Xt(N,at){N.side===tn?Nt(i.CULL_FACE):nt(i.CULL_FACE);let j=N.side===Je;at&&(j=!j),ce(j),N.blending===$i&&N.transparent===!1?ee(Vn):ee(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ut=N.stencilWrite;o.setTest(ut),ut&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),zt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?nt(i.SAMPLE_ALPHA_TO_COVERAGE):Nt(i.SAMPLE_ALPHA_TO_COVERAGE)}function ce(N){C!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),C=N)}function we(N){N!==Mu?(nt(i.CULL_FACE),N!==L&&(N===Cl?i.cullFace(i.BACK):N===Su?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Nt(i.CULL_FACE),L=N}function yt(N){N!==B&&(D&&i.lineWidth(N),B=N)}function zt(N,at,j){N?(nt(i.POLYGON_OFFSET_FILL),(H!==at||O!==j)&&(H=at,O=j,a.getReversed()&&(at=-at),i.polygonOffset(at,j))):Nt(i.POLYGON_OFFSET_FILL)}function fe(N){N?nt(i.SCISSOR_TEST):Nt(i.SCISSOR_TEST)}function re(N){N===void 0&&(N=i.TEXTURE0+X-1),K!==N&&(i.activeTexture(N),K=N)}function U(N,at,j){j===void 0&&(K===null?j=i.TEXTURE0+X-1:j=K);let ut=it[j];ut===void 0&&(ut={type:void 0,texture:void 0},it[j]=ut),(ut.type!==N||ut.texture!==at)&&(K!==j&&(i.activeTexture(j),K=j),i.bindTexture(N,at||st[N]),ut.type=N,ut.texture=at)}function He(){const N=it[K];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function se(){try{i.compressedTexImage2D(...arguments)}catch(N){Ft("WebGLState:",N)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(N){Ft("WebGLState:",N)}}function y(){try{i.texSubImage2D(...arguments)}catch(N){Ft("WebGLState:",N)}}function z(){try{i.texSubImage3D(...arguments)}catch(N){Ft("WebGLState:",N)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(N){Ft("WebGLState:",N)}}function J(){try{i.compressedTexSubImage3D(...arguments)}catch(N){Ft("WebGLState:",N)}}function rt(){try{i.texStorage2D(...arguments)}catch(N){Ft("WebGLState:",N)}}function ot(){try{i.texStorage3D(...arguments)}catch(N){Ft("WebGLState:",N)}}function Q(){try{i.texImage2D(...arguments)}catch(N){Ft("WebGLState:",N)}}function tt(){try{i.texImage3D(...arguments)}catch(N){Ft("WebGLState:",N)}}function ct(N){return d[N]!==void 0?d[N]:i.getParameter(N)}function Rt(N,at){d[N]!==at&&(i.pixelStorei(N,at),d[N]=at)}function dt(N){oe.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),oe.copy(N))}function ht(N){Ht.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Ht.copy(N))}function Lt(N,at){let j=c.get(at);j===void 0&&(j=new WeakMap,c.set(at,j));let ut=j.get(N);ut===void 0&&(ut=i.getUniformBlockIndex(at,N.name),j.set(N,ut))}function Ut(N,at){const ut=c.get(at).get(N);l.get(at)!==ut&&(i.uniformBlockBinding(at,ut,N.__bindingPointIndex),l.set(at,ut))}function Gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,it={},u={},f=new WeakMap,p=[],v=null,m=!1,g=null,b=null,S=null,x=null,A=null,M=null,T=null,_=new _t(0,0,0),E=0,P=!1,C=null,L=null,B=null,H=null,O=null,oe.set(0,0,i.canvas.width,i.canvas.height),Ht.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:nt,disable:Nt,bindFramebuffer:Bt,drawBuffers:Dt,useProgram:Se,setBlending:ee,setMaterial:Xt,setFlipSided:ce,setCullFace:we,setLineWidth:yt,setPolygonOffset:zt,setScissorTest:fe,activeTexture:re,bindTexture:U,unbindTexture:He,compressedTexImage2D:se,compressedTexImage3D:R,texImage2D:Q,texImage3D:tt,pixelStorei:Rt,getParameter:ct,updateUBOMapping:Lt,uniformBlockBinding:Ut,texStorage2D:rt,texStorage3D:ot,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:Y,compressedTexSubImage3D:J,scissor:dt,viewport:ht,reset:Gt}}function O_(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,y){return p?new OffscreenCanvas(R,y):Rr("canvas")}function m(R,y,z){let Y=1;const J=se(R);if((J.width>z||J.height>z)&&(Y=z/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const rt=Math.floor(Y*J.width),ot=Math.floor(Y*J.height);u===void 0&&(u=v(rt,ot));const Q=y?v(rt,ot):u;return Q.width=rt,Q.height=ot,Q.getContext("2d").drawImage(R,0,0,rt,ot),It("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+rt+"x"+ot+")."),Q}else return"data"in R&&It("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),R;return R}function g(R){return R.generateMipmaps}function b(R){i.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(R,y,z,Y,J,rt=!1){if(R!==null){if(i[R]!==void 0)return i[R];It("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ot;Y&&(ot=t.get("EXT_texture_norm16"),ot||It("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=y;if(y===i.RED&&(z===i.FLOAT&&(Q=i.R32F),z===i.HALF_FLOAT&&(Q=i.R16F),z===i.UNSIGNED_BYTE&&(Q=i.R8),z===i.UNSIGNED_SHORT&&ot&&(Q=ot.R16_EXT),z===i.SHORT&&ot&&(Q=ot.R16_SNORM_EXT)),y===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.R8UI),z===i.UNSIGNED_SHORT&&(Q=i.R16UI),z===i.UNSIGNED_INT&&(Q=i.R32UI),z===i.BYTE&&(Q=i.R8I),z===i.SHORT&&(Q=i.R16I),z===i.INT&&(Q=i.R32I)),y===i.RG&&(z===i.FLOAT&&(Q=i.RG32F),z===i.HALF_FLOAT&&(Q=i.RG16F),z===i.UNSIGNED_BYTE&&(Q=i.RG8),z===i.UNSIGNED_SHORT&&ot&&(Q=ot.RG16_EXT),z===i.SHORT&&ot&&(Q=ot.RG16_SNORM_EXT)),y===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RG8UI),z===i.UNSIGNED_SHORT&&(Q=i.RG16UI),z===i.UNSIGNED_INT&&(Q=i.RG32UI),z===i.BYTE&&(Q=i.RG8I),z===i.SHORT&&(Q=i.RG16I),z===i.INT&&(Q=i.RG32I)),y===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),z===i.UNSIGNED_INT&&(Q=i.RGB32UI),z===i.BYTE&&(Q=i.RGB8I),z===i.SHORT&&(Q=i.RGB16I),z===i.INT&&(Q=i.RGB32I)),y===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),z===i.UNSIGNED_INT&&(Q=i.RGBA32UI),z===i.BYTE&&(Q=i.RGBA8I),z===i.SHORT&&(Q=i.RGBA16I),z===i.INT&&(Q=i.RGBA32I)),y===i.RGB&&(z===i.UNSIGNED_SHORT&&ot&&(Q=ot.RGB16_EXT),z===i.SHORT&&ot&&(Q=ot.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),y===i.RGBA){const tt=rt?Er:te.getTransfer(J);z===i.FLOAT&&(Q=i.RGBA32F),z===i.HALF_FLOAT&&(Q=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Q=tt===he?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&ot&&(Q=ot.RGBA16_EXT),z===i.SHORT&&ot&&(Q=ot.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function A(R,y){let z;return R?y===null||y===Dn||y===Es?z=i.DEPTH24_STENCIL8:y===vn?z=i.DEPTH32F_STENCIL8:y===Ts&&(z=i.DEPTH24_STENCIL8,It("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Dn||y===Es?z=i.DEPTH_COMPONENT24:y===vn?z=i.DEPTH_COMPONENT32F:y===Ts&&(z=i.DEPTH_COMPONENT16),z}function M(R,y){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ve&&R.minFilter!==Ye?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function T(R){const y=R.target;y.removeEventListener("dispose",T),E(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&d.delete(y)}function _(R){const y=R.target;y.removeEventListener("dispose",_),C(y)}function E(R){const y=n.get(R);if(y.__webglInit===void 0)return;const z=R.source,Y=f.get(z);if(Y){const J=Y[y.__cacheKey];J.usedTimes--,J.usedTimes===0&&P(R),Object.keys(Y).length===0&&f.delete(z)}n.remove(R)}function P(R){const y=n.get(R);i.deleteTexture(y.__webglTexture);const z=R.source,Y=f.get(z);delete Y[y.__cacheKey],a.memory.textures--}function C(R){const y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(y.__webglFramebuffer[Y]))for(let J=0;J<y.__webglFramebuffer[Y].length;J++)i.deleteFramebuffer(y.__webglFramebuffer[Y][J]);else i.deleteFramebuffer(y.__webglFramebuffer[Y]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[Y])}else{if(Array.isArray(y.__webglFramebuffer))for(let Y=0;Y<y.__webglFramebuffer.length;Y++)i.deleteFramebuffer(y.__webglFramebuffer[Y]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let Y=0;Y<y.__webglColorRenderbuffer.length;Y++)y.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[Y]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const z=R.textures;for(let Y=0,J=z.length;Y<J;Y++){const rt=n.get(z[Y]);rt.__webglTexture&&(i.deleteTexture(rt.__webglTexture),a.memory.textures--),n.remove(z[Y])}n.remove(R)}let L=0;function B(){L=0}function H(){return L}function O(R){L=R}function X(){const R=L;return R>=s.maxTextures&&It("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function D(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function q(R,y){const z=n.get(R);if(R.isVideoTexture&&U(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const Y=R.image;if(Y===null)It("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)It("WebGLRenderer: Texture marked for update but image is incomplete");else{Nt(z,R,y);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+y)}function V(R,y){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){Nt(z,R,y);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+y)}function K(R,y){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){Nt(z,R,y);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+y)}function it(R,y){const z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Bt(z,R,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+y)}const lt={[Za]:i.REPEAT,[zn]:i.CLAMP_TO_EDGE,[Qa]:i.MIRRORED_REPEAT},Et={[Ve]:i.NEAREST,[qu]:i.NEAREST_MIPMAP_NEAREST,[Us]:i.NEAREST_MIPMAP_LINEAR,[Ye]:i.LINEAR,[Yr]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},oe={[Zu]:i.NEVER,[nd]:i.ALWAYS,[Qu]:i.LESS,[Jo]:i.LEQUAL,[ju]:i.EQUAL,[Zo]:i.GEQUAL,[td]:i.GREATER,[ed]:i.NOTEQUAL};function Ht(R,y){if(y.type===vn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Ye||y.magFilter===Yr||y.magFilter===Us||y.magFilter===vi||y.minFilter===Ye||y.minFilter===Yr||y.minFilter===Us||y.minFilter===vi)&&It("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,lt[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,lt[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,lt[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Et[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Et[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,oe[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Ve||y.minFilter!==Us&&y.minFilter!==vi||y.type===vn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Z(R,y){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",T));const Y=y.source;let J=f.get(Y);J===void 0&&(J={},f.set(Y,J));const rt=D(y);if(rt!==R.__cacheKey){J[rt]===void 0&&(J[rt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),J[rt].usedTimes++;const ot=J[R.__cacheKey];ot!==void 0&&(J[R.__cacheKey].usedTimes--,ot.usedTimes===0&&P(y)),R.__cacheKey=rt,R.__webglTexture=J[rt].texture}return z}function st(R,y,z){return Math.floor(Math.floor(R/z)/y)}function nt(R,y,z,Y){const rt=R.updateRanges;if(rt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,z,Y,y.data);else{rt.sort((Rt,dt)=>Rt.start-dt.start);let ot=0;for(let Rt=1;Rt<rt.length;Rt++){const dt=rt[ot],ht=rt[Rt],Lt=dt.start+dt.count,Ut=st(ht.start,y.width,4),Gt=st(dt.start,y.width,4);ht.start<=Lt+1&&Ut===Gt&&st(ht.start+ht.count-1,y.width,4)===Ut?dt.count=Math.max(dt.count,ht.start+ht.count-dt.start):(++ot,rt[ot]=ht)}rt.length=ot+1;const Q=e.getParameter(i.UNPACK_ROW_LENGTH),tt=e.getParameter(i.UNPACK_SKIP_PIXELS),ct=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let Rt=0,dt=rt.length;Rt<dt;Rt++){const ht=rt[Rt],Lt=Math.floor(ht.start/4),Ut=Math.ceil(ht.count/4),Gt=Lt%y.width,N=Math.floor(Lt/y.width),at=Ut,j=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Gt),e.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,Gt,N,at,j,z,Y,y.data)}R.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,Q),e.pixelStorei(i.UNPACK_SKIP_PIXELS,tt),e.pixelStorei(i.UNPACK_SKIP_ROWS,ct)}}function Nt(R,y,z){let Y=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(Y=i.TEXTURE_3D);const J=Z(R,y),rt=y.source;e.bindTexture(Y,R.__webglTexture,i.TEXTURE0+z);const ot=n.get(rt);if(rt.version!==ot.__version||J===!0){if(e.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const j=te.getPrimaries(te.workingColorSpace),ut=y.colorSpace===ni?null:te.getPrimaries(y.colorSpace),vt=y.colorSpace===ni||j===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt)}e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment);let tt=m(y.image,!1,s.maxTextureSize);tt=He(y,tt);const ct=r.convert(y.format,y.colorSpace),Rt=r.convert(y.type);let dt=x(y.internalFormat,ct,Rt,y.normalized,y.colorSpace,y.isVideoTexture);Ht(Y,y);let ht;const Lt=y.mipmaps,Ut=y.isVideoTexture!==!0,Gt=ot.__version===void 0||J===!0,N=rt.dataReady,at=M(y,tt);if(y.isDepthTexture)dt=A(y.format===xi,y.type),Gt&&(Ut?e.texStorage2D(i.TEXTURE_2D,1,dt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,dt,tt.width,tt.height,0,ct,Rt,null));else if(y.isDataTexture)if(Lt.length>0){Ut&&Gt&&e.texStorage2D(i.TEXTURE_2D,at,dt,Lt[0].width,Lt[0].height);for(let j=0,ut=Lt.length;j<ut;j++)ht=Lt[j],Ut?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ht.width,ht.height,ct,Rt,ht.data):e.texImage2D(i.TEXTURE_2D,j,dt,ht.width,ht.height,0,ct,Rt,ht.data);y.generateMipmaps=!1}else Ut?(Gt&&e.texStorage2D(i.TEXTURE_2D,at,dt,tt.width,tt.height),N&&nt(y,tt,ct,Rt)):e.texImage2D(i.TEXTURE_2D,0,dt,tt.width,tt.height,0,ct,Rt,tt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ut&&Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,dt,Lt[0].width,Lt[0].height,tt.depth);for(let j=0,ut=Lt.length;j<ut;j++)if(ht=Lt[j],y.format!==ln)if(ct!==null)if(Ut){if(N)if(y.layerUpdates.size>0){const vt=Mc(ht.width,ht.height,y.format,y.type);for(const et of y.layerUpdates){const At=ht.data.subarray(et*vt/ht.data.BYTES_PER_ELEMENT,(et+1)*vt/ht.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,et,ht.width,ht.height,1,ct,At)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ht.width,ht.height,tt.depth,ct,ht.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,dt,ht.width,ht.height,tt.depth,0,ht.data,0,0);else It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ht.width,ht.height,tt.depth,ct,Rt,ht.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,dt,ht.width,ht.height,tt.depth,0,ct,Rt,ht.data)}else{Ut&&Gt&&e.texStorage2D(i.TEXTURE_2D,at,dt,Lt[0].width,Lt[0].height);for(let j=0,ut=Lt.length;j<ut;j++)ht=Lt[j],y.format!==ln?ct!==null?Ut?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,ht.width,ht.height,ct,ht.data):e.compressedTexImage2D(i.TEXTURE_2D,j,dt,ht.width,ht.height,0,ht.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ht.width,ht.height,ct,Rt,ht.data):e.texImage2D(i.TEXTURE_2D,j,dt,ht.width,ht.height,0,ct,Rt,ht.data)}else if(y.isDataArrayTexture)if(Ut){if(Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,dt,tt.width,tt.height,tt.depth),N)if(y.layerUpdates.size>0){const j=Mc(tt.width,tt.height,y.format,y.type);for(const ut of y.layerUpdates){const vt=tt.data.subarray(ut*j/tt.data.BYTES_PER_ELEMENT,(ut+1)*j/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ut,tt.width,tt.height,1,ct,Rt,vt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ct,Rt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,dt,tt.width,tt.height,tt.depth,0,ct,Rt,tt.data);else if(y.isData3DTexture)Ut?(Gt&&e.texStorage3D(i.TEXTURE_3D,at,dt,tt.width,tt.height,tt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ct,Rt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,dt,tt.width,tt.height,tt.depth,0,ct,Rt,tt.data);else if(y.isFramebufferTexture){if(Gt)if(Ut)e.texStorage2D(i.TEXTURE_2D,at,dt,tt.width,tt.height);else{let j=tt.width,ut=tt.height;for(let vt=0;vt<at;vt++)e.texImage2D(i.TEXTURE_2D,vt,dt,j,ut,0,ct,Rt,null),j>>=1,ut>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in i){const j=i.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),tt.parentNode!==j){j.appendChild(tt),d.add(y),j.onpaint=ut=>{const vt=ut.changedElements;for(const et of d)vt.includes(et.image)&&(et.needsUpdate=!0)},j.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,tt);else{const vt=i.RGBA,et=i.RGBA,At=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,vt,et,At,tt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Lt.length>0){if(Ut&&Gt){const j=se(Lt[0]);e.texStorage2D(i.TEXTURE_2D,at,dt,j.width,j.height)}for(let j=0,ut=Lt.length;j<ut;j++)ht=Lt[j],Ut?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ct,Rt,ht):e.texImage2D(i.TEXTURE_2D,j,dt,ct,Rt,ht);y.generateMipmaps=!1}else if(Ut){if(Gt){const j=se(tt);e.texStorage2D(i.TEXTURE_2D,at,dt,j.width,j.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,Rt,tt)}else e.texImage2D(i.TEXTURE_2D,0,dt,ct,Rt,tt);g(y)&&b(Y),ot.__version=rt.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Bt(R,y,z){if(y.image.length!==6)return;const Y=Z(R,y),J=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+z);const rt=n.get(J);if(J.version!==rt.__version||Y===!0){e.activeTexture(i.TEXTURE0+z);const ot=te.getPrimaries(te.workingColorSpace),Q=y.colorSpace===ni?null:te.getPrimaries(y.colorSpace),tt=y.colorSpace===ni||ot===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);const ct=y.isCompressedTexture||y.image[0].isCompressedTexture,Rt=y.image[0]&&y.image[0].isDataTexture,dt=[];for(let et=0;et<6;et++)!ct&&!Rt?dt[et]=m(y.image[et],!0,s.maxCubemapSize):dt[et]=Rt?y.image[et].image:y.image[et],dt[et]=He(y,dt[et]);const ht=dt[0],Lt=r.convert(y.format,y.colorSpace),Ut=r.convert(y.type),Gt=x(y.internalFormat,Lt,Ut,y.normalized,y.colorSpace),N=y.isVideoTexture!==!0,at=rt.__version===void 0||Y===!0,j=J.dataReady;let ut=M(y,ht);Ht(i.TEXTURE_CUBE_MAP,y);let vt;if(ct){N&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Gt,ht.width,ht.height);for(let et=0;et<6;et++){vt=dt[et].mipmaps;for(let At=0;At<vt.length;At++){const St=vt[At];y.format!==ln?Lt!==null?N?j&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,St.width,St.height,Lt,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,Gt,St.width,St.height,0,St.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,St.width,St.height,Lt,Ut,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,Gt,St.width,St.height,0,Lt,Ut,St.data)}}}else{if(vt=y.mipmaps,N&&at){vt.length>0&&ut++;const et=se(dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Gt,et.width,et.height)}for(let et=0;et<6;et++)if(Rt){N?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,dt[et].width,dt[et].height,Lt,Ut,dt[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Gt,dt[et].width,dt[et].height,0,Lt,Ut,dt[et].data);for(let At=0;At<vt.length;At++){const Ae=vt[At].image[et].image;N?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,Ae.width,Ae.height,Lt,Ut,Ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,Gt,Ae.width,Ae.height,0,Lt,Ut,Ae.data)}}else{N?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Lt,Ut,dt[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Gt,Lt,Ut,dt[et]);for(let At=0;At<vt.length;At++){const St=vt[At];N?j&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,Lt,Ut,St.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,Gt,Lt,Ut,St.image[et])}}}g(y)&&b(i.TEXTURE_CUBE_MAP),rt.__version=J.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Dt(R,y,z,Y,J,rt){const ot=r.convert(z.format,z.colorSpace),Q=r.convert(z.type),tt=x(z.internalFormat,ot,Q,z.normalized,z.colorSpace),ct=n.get(y),Rt=n.get(z);if(Rt.__renderTarget=y,!ct.__hasExternalTextures){const dt=Math.max(1,y.width>>rt),ht=Math.max(1,y.height>>rt);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,rt,tt,dt,ht,y.depth,0,ot,Q,null):e.texImage2D(J,rt,tt,dt,ht,0,ot,Q,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),re(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,J,Rt.__webglTexture,0,fe(y)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,J,Rt.__webglTexture,rt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Se(R,y,z){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){const Y=y.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,rt=A(y.stencilBuffer,J),ot=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;re(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe(y),rt,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe(y),rt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,rt,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,R)}else{const Y=y.textures;for(let J=0;J<Y.length;J++){const rt=Y[J],ot=r.convert(rt.format,rt.colorSpace),Q=r.convert(rt.type),tt=x(rt.internalFormat,ot,Q,rt.normalized,rt.colorSpace);re(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe(y),tt,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe(y),tt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,tt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function $t(R,y,z){const Y=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(y.depthTexture);if(J.__renderTarget=y,(!J.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),Y){if(J.__webglInit===void 0&&(J.__webglInit=!0,y.depthTexture.addEventListener("dispose",T)),J.__webglTexture===void 0){J.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,y.depthTexture);const ct=r.convert(y.depthTexture.format),Rt=r.convert(y.depthTexture.type);let dt;y.depthTexture.format===Wn?dt=i.DEPTH_COMPONENT24:y.depthTexture.format===xi&&(dt=i.DEPTH24_STENCIL8);for(let ht=0;ht<6;ht++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,dt,y.width,y.height,0,ct,Rt,null)}}else q(y.depthTexture,0);const rt=J.__webglTexture,ot=fe(y),Q=Y?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,tt=y.depthTexture.format===xi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===Wn)re(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,Q,rt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,tt,Q,rt,0);else if(y.depthTexture.format===xi)re(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,Q,rt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,tt,Q,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(R){const y=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){const Y=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),Y){const J=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),y.__depthDisposeCallback=J}y.__boundDepthTexture=Y}if(R.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let Y=0;Y<6;Y++)$t(y.__webglFramebuffer[Y],R,Y);else{const Y=R.texture.mipmaps;Y&&Y.length>0?$t(y.__webglFramebuffer[0],R,0):$t(y.__webglFramebuffer,R,0)}else if(z){y.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[Y]),y.__webglDepthbuffer[Y]===void 0)y.__webglDepthbuffer[Y]=i.createRenderbuffer(),Se(y.__webglDepthbuffer[Y],R,!1);else{const J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=y.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,rt)}}else{const Y=R.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Se(y.__webglDepthbuffer,R,!1);else{const J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,rt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ee(R,y,z){const Y=n.get(R);y!==void 0&&Dt(Y.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&ie(R)}function Xt(R){const y=R.texture,z=n.get(R),Y=n.get(y);R.addEventListener("dispose",_);const J=R.textures,rt=R.isWebGLCubeRenderTarget===!0,ot=J.length>1;if(ot||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=y.version,a.memory.textures++),rt){z.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[Q]=[];for(let tt=0;tt<y.mipmaps.length;tt++)z.__webglFramebuffer[Q][tt]=i.createFramebuffer()}else z.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let Q=0;Q<y.mipmaps.length;Q++)z.__webglFramebuffer[Q]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(ot)for(let Q=0,tt=J.length;Q<tt;Q++){const ct=n.get(J[Q]);ct.__webglTexture===void 0&&(ct.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&re(R)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Q=0;Q<J.length;Q++){const tt=J[Q];z.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[Q]);const ct=r.convert(tt.format,tt.colorSpace),Rt=r.convert(tt.type),dt=x(tt.internalFormat,ct,Rt,tt.normalized,tt.colorSpace,R.isXRRenderTarget===!0),ht=fe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,dt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,z.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Se(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,y);for(let Q=0;Q<6;Q++)if(y.mipmaps&&y.mipmaps.length>0)for(let tt=0;tt<y.mipmaps.length;tt++)Dt(z.__webglFramebuffer[Q][tt],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,tt);else Dt(z.__webglFramebuffer[Q],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);g(y)&&b(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){for(let Q=0,tt=J.length;Q<tt;Q++){const ct=J[Q],Rt=n.get(ct);let dt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(dt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,Rt.__webglTexture),Ht(dt,ct),Dt(z.__webglFramebuffer,R,ct,i.COLOR_ATTACHMENT0+Q,dt,0),g(ct)&&b(dt)}e.unbindTexture()}else{let Q=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Q=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Q,Y.__webglTexture),Ht(Q,y),y.mipmaps&&y.mipmaps.length>0)for(let tt=0;tt<y.mipmaps.length;tt++)Dt(z.__webglFramebuffer[tt],R,y,i.COLOR_ATTACHMENT0,Q,tt);else Dt(z.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,Q,0);g(y)&&b(Q),e.unbindTexture()}R.depthBuffer&&ie(R)}function ce(R){const y=R.textures;for(let z=0,Y=y.length;z<Y;z++){const J=y[z];if(g(J)){const rt=S(R),ot=n.get(J).__webglTexture;e.bindTexture(rt,ot),b(rt),e.unbindTexture()}}}const we=[],yt=[];function zt(R){if(R.samples>0){if(re(R)===!1){const y=R.textures,z=R.width,Y=R.height;let J=i.COLOR_BUFFER_BIT;const rt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=n.get(R),Q=y.length>1;if(Q)for(let ct=0;ct<y.length;ct++)e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer);const tt=R.texture.mipmaps;tt&&tt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let ct=0;ct<y.length;ct++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ot.__webglColorRenderbuffer[ct]);const Rt=n.get(y[ct]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,z,Y,0,0,z,Y,J,i.NEAREST),l===!0&&(we.length=0,yt.length=0,we.push(i.COLOR_ATTACHMENT0+ct),R.depthBuffer&&R.resolveDepthBuffer===!1&&(we.push(rt),yt.push(rt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,yt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,we))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let ct=0;ct<y.length;ct++){e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,ot.__webglColorRenderbuffer[ct]);const Rt=n.get(y[ct]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function fe(R){return Math.min(s.maxSamples,R.samples)}function re(R){const y=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function U(R){const y=a.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function He(R,y){const z=R.colorSpace,Y=R.format,J=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==Tr&&z!==ni&&(te.getTransfer(z)===he?(Y!==ln||J!==on)&&It("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ft("WebGLTextures: Unsupported texture color space:",z)),y}function se(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.getTextureUnits=H,this.setTextureUnits=O,this.setTexture2D=q,this.setTexture2DArray=V,this.setTexture3D=K,this.setTextureCube=it,this.rebindTextures=ee,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Dt,this.useMultisampledRTT=re,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function k_(i,t){function e(n,s=ni){let r;const a=te.getTransfer(s);if(n===on)return i.UNSIGNED_BYTE;if(n===Wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===yh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===_h)return i.BYTE;if(n===vh)return i.SHORT;if(n===Ts)return i.UNSIGNED_SHORT;if(n===Go)return i.INT;if(n===Dn)return i.UNSIGNED_INT;if(n===vn)return i.FLOAT;if(n===Gn)return i.HALF_FLOAT;if(n===bh)return i.ALPHA;if(n===Mh)return i.RGB;if(n===ln)return i.RGBA;if(n===Wn)return i.DEPTH_COMPONENT;if(n===xi)return i.DEPTH_STENCIL;if(n===Sh)return i.RED;if(n===qo)return i.RED_INTEGER;if(n===Mi)return i.RG;if(n===Yo)return i.RG_INTEGER;if(n===$o)return i.RGBA_INTEGER;if(n===gr||n===_r||n===vr||n===xr)if(a===he)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ja||n===to||n===eo||n===no)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===to)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===Mr||n===lo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===io||n===so)return a===he?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ro)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ao)return r.COMPRESSED_R11_EAC;if(n===oo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Mr)return r.COMPRESSED_RG11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===vo||n===xo||n===yo||n===bo||n===Mo||n===So)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===co)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ho)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===uo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===po)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===go)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_o)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===yo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Mo)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===So)return a===he?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wo||n===Ao||n===To)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wo)return a===he?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Eo||n===Ro||n===Sr||n===Co)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Eo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Sr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const B_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class V_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Uh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new nn({vertexShader:B_,fragmentShader:z_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new k(new Is(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends ai{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",m=new V_,g={},b=e.getContextAttributes();let S=null,x=null;const A=[],M=[],T=new mt;let _=null;const E=new je;E.viewport=new ge;const P=new je;P.viewport=new ge;const C=[E,P],L=new kf;let B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let st=A[Z];return st===void 0&&(st=new ea,A[Z]=st),st.getTargetRaySpace()},this.getControllerGrip=function(Z){let st=A[Z];return st===void 0&&(st=new ea,A[Z]=st),st.getGripSpace()},this.getHand=function(Z){let st=A[Z];return st===void 0&&(st=new ea,A[Z]=st),st.getHandSpace()};function O(Z){const st=M.indexOf(Z.inputSource);if(st===-1)return;const nt=A[st];nt!==void 0&&(nt.update(Z.inputSource,Z.frame,c||a),nt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function X(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",D);for(let Z=0;Z<A.length;Z++){const st=M[Z];st!==null&&(M[Z]=null,A[Z].disconnect(st))}B=null,H=null,m.reset();for(const Z in g)delete g[Z];t.setRenderTarget(S),f=null,u=null,d=null,s=null,x=null,Ht.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&It("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&It("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(S=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",X),s.addEventListener("inputsourceschange",D),b.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let nt=null,Nt=null,Bt=null;b.depth&&(Bt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=b.stencil?xi:Wn,Nt=b.stencil?Es:Dn);const Dt={colorFormat:e.RGBA8,depthFormat:Bt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Dt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new In(u.textureWidth,u.textureHeight,{format:ln,type:on,depthTexture:new ts(u.textureWidth,u.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const nt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new In(f.framebufferWidth,f.framebufferHeight,{format:ln,type:on,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ht.setContext(s),Ht.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function D(Z){for(let st=0;st<Z.removed.length;st++){const nt=Z.removed[st],Nt=M.indexOf(nt);Nt>=0&&(M[Nt]=null,A[Nt].disconnect(nt))}for(let st=0;st<Z.added.length;st++){const nt=Z.added[st];let Nt=M.indexOf(nt);if(Nt===-1){for(let Dt=0;Dt<A.length;Dt++)if(Dt>=M.length){M.push(nt),Nt=Dt;break}else if(M[Dt]===null){M[Dt]=nt,Nt=Dt;break}if(Nt===-1)break}const Bt=A[Nt];Bt&&Bt.connect(nt)}}const q=new I,V=new I;function K(Z,st,nt){q.setFromMatrixPosition(st.matrixWorld),V.setFromMatrixPosition(nt.matrixWorld);const Nt=q.distanceTo(V),Bt=st.projectionMatrix.elements,Dt=nt.projectionMatrix.elements,Se=Bt[14]/(Bt[10]-1),$t=Bt[14]/(Bt[10]+1),ie=(Bt[9]+1)/Bt[5],ee=(Bt[9]-1)/Bt[5],Xt=(Bt[8]-1)/Bt[0],ce=(Dt[8]+1)/Dt[0],we=Se*Xt,yt=Se*ce,zt=Nt/(-Xt+ce),fe=zt*-Xt;if(st.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(fe),Z.translateZ(zt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Bt[10]===-1)Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const re=Se+zt,U=$t+zt,He=we-fe,se=yt+(Nt-fe),R=ie*$t/U*re,y=ee*$t/U*re;Z.projectionMatrix.makePerspective(He,se,R,y,re,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function it(Z,st){st===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(st.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let st=Z.near,nt=Z.far;m.texture!==null&&(m.depthNear>0&&(st=m.depthNear),m.depthFar>0&&(nt=m.depthFar)),L.near=P.near=E.near=st,L.far=P.far=E.far=nt,(B!==L.near||H!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),B=L.near,H=L.far),L.layers.mask=Z.layers.mask|6,E.layers.mask=L.layers.mask&-5,P.layers.mask=L.layers.mask&-3;const Nt=Z.parent,Bt=L.cameras;it(L,Nt);for(let Dt=0;Dt<Bt.length;Dt++)it(Bt[Dt],Nt);Bt.length===2?K(L,E,P):L.projectionMatrix.copy(E.projectionMatrix),lt(Z,L,Nt)};function lt(Z,st,nt){nt===null?Z.matrix.copy(st.matrixWorld):(Z.matrix.copy(nt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(st.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Cs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(Z){return g[Z]};let Et=null;function oe(Z,st){if(h=st.getViewerPose(c||a),p=st,h!==null){const nt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let Nt=!1;nt.length!==L.cameras.length&&(L.cameras.length=0,Nt=!0);for(let $t=0;$t<nt.length;$t++){const ie=nt[$t];let ee=null;if(f!==null)ee=f.getViewport(ie);else{const ce=d.getViewSubImage(u,ie);ee=ce.viewport,$t===0&&(t.setRenderTargetTextures(x,ce.colorTexture,ce.depthStencilTexture),t.setRenderTarget(x))}let Xt=C[$t];Xt===void 0&&(Xt=new je,Xt.layers.enable($t),Xt.viewport=new ge,C[$t]=Xt),Xt.matrix.fromArray(ie.transform.matrix),Xt.matrix.decompose(Xt.position,Xt.quaternion,Xt.scale),Xt.projectionMatrix.fromArray(ie.projectionMatrix),Xt.projectionMatrixInverse.copy(Xt.projectionMatrix).invert(),Xt.viewport.set(ee.x,ee.y,ee.width,ee.height),$t===0&&(L.matrix.copy(Xt.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Nt===!0&&L.cameras.push(Xt)}const Bt=s.enabledFeatures;if(Bt&&Bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const $t=d.getDepthInformation(nt[0]);$t&&$t.isValid&&$t.texture&&m.init($t,s.renderState)}if(Bt&&Bt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let $t=0;$t<nt.length;$t++){const ie=nt[$t].camera;if(ie){let ee=g[ie];ee||(ee=new Uh,g[ie]=ee);const Xt=d.getCameraImage(ie);ee.sourceTexture=Xt}}}}for(let nt=0;nt<A.length;nt++){const Nt=M[nt],Bt=A[nt];Nt!==null&&Bt!==void 0&&Bt.update(Nt,st,c||a)}Et&&Et(Z,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),p=null}const Ht=new Wh;Ht.setAnimationLoop(oe),this.setAnimationLoop=function(Z){Et=Z},this.dispose=function(){}}}const G_=new qt,Zh=new Vt;Zh.set(-1,0,0,0,1,0,0,0,1);function W_(i,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,kh(i)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,b,S,x){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&f(m,g,x)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),v(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,b,S):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Je&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Je&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const b=t.get(g),S=b.envMap,x=b.envMapRotation;S&&(m.envMap.value=S,m.envMapRotation.value.setFromMatrix4(G_.makeRotationFromEuler(x)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Zh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,b,S){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*b,m.scale.value=S*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,b){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Je&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const b=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function X_(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,A){const M=A.program;n.uniformBlockBinding(x,M)}function c(x,A){let M=s[x.id];M===void 0&&(m(x),M=h(x),s[x.id]=M,x.addEventListener("dispose",b));const T=A.program;n.updateUBOMapping(x,T);const _=t.render.frame;r[x.id]!==_&&(u(x),r[x.id]=_)}function h(x){const A=d();x.__bindingPointIndex=A;const M=i.createBuffer(),T=x.__size,_=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,T,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,M),M}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Ft("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const A=s[x.id],M=x.uniforms,T=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let _=0,E=M.length;_<E;_++){const P=M[_];if(Array.isArray(P))for(let C=0,L=P.length;C<L;C++)f(P[C],_,C,T);else f(P,_,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,A,M,T){if(v(x,A,M,T)===!0){const _=x.__offset,E=x.value;if(Array.isArray(E)){let P=0;for(let C=0;C<E.length;C++){const L=E[C],B=g(L);p(L,x.__data,P),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(P+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,x.__data)}}function p(x,A,M){typeof x=="number"||typeof x=="boolean"?A[0]=x:x.isMatrix3?(A[0]=x.elements[0],A[1]=x.elements[1],A[2]=x.elements[2],A[3]=0,A[4]=x.elements[3],A[5]=x.elements[4],A[6]=x.elements[5],A[7]=0,A[8]=x.elements[6],A[9]=x.elements[7],A[10]=x.elements[8],A[11]=0):ArrayBuffer.isView(x)?A.set(new x.constructor(x.buffer,x.byteOffset,A.length)):x.toArray(A,M)}function v(x,A,M,T){const _=x.value,E=A+"_"+M;if(T[E]===void 0)return typeof _=="number"||typeof _=="boolean"?T[E]=_:ArrayBuffer.isView(_)?T[E]=_.slice():T[E]=_.clone(),!0;{const P=T[E];if(typeof _=="number"||typeof _=="boolean"){if(P!==_)return T[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(P.equals(_)===!1)return P.copy(_),!0}}return!1}function m(x){const A=x.uniforms;let M=0;const T=16;for(let E=0,P=A.length;E<P;E++){const C=Array.isArray(A[E])?A[E]:[A[E]];for(let L=0,B=C.length;L<B;L++){const H=C[L],O=Array.isArray(H.value)?H.value:[H.value];for(let X=0,D=O.length;X<D;X++){const q=O[X],V=g(q),K=M%T,it=K%V.boundary,lt=K+it;M+=it,lt!==0&&T-lt<V.storage&&(M+=T-lt),H.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=M,M+=V.storage}}}const _=M%T;return _>0&&(M+=T-_),x.__size=M,x.__cache={},this}function g(x){const A={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(A.boundary=4,A.storage=4):x.isVector2?(A.boundary=8,A.storage=8):x.isVector3||x.isColor?(A.boundary=16,A.storage=12):x.isVector4?(A.boundary=16,A.storage=16):x.isMatrix3?(A.boundary=48,A.storage=48):x.isMatrix4?(A.boundary=64,A.storage=64):x.isTexture?It("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(A.boundary=16,A.storage=x.byteLength):It("WebGLRenderer: Unsupported uniform value type.",x),A}function b(x){const A=x.target;A.removeEventListener("dispose",b);const M=a.indexOf(A.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function S(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:S}}const q_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Tn=null;function Y_(){return Tn===null&&(Tn=new il(q_,16,16,Mi,Gn),Tn.name="DFG_LUT",Tn.minFilter=Ye,Tn.magFilter=Ye,Tn.wrapS=zn,Tn.wrapT=zn,Tn.generateMipmaps=!1,Tn.needsUpdate=!0),Tn}class $_{constructor(t={}){const{canvas:e=rd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=on}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const v=f,m=new Set([$o,Yo,qo]),g=new Set([on,Dn,Ts,Es,Wo,Xo]),b=new Uint32Array(4),S=new Int32Array(4),x=new I;let A=null,M=null;const T=[],_=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,L=null,B=null,H=null,O=null;this._outputColorSpace=un;let X=0,D=0,q=null,V=-1,K=null;const it=new ge,lt=new ge;let Et=null;const oe=new _t(0);let Ht=0,Z=e.width,st=e.height,nt=1,Nt=null,Bt=null;const Dt=new ge(0,0,Z,st),Se=new ge(0,0,Z,st);let $t=!1;const ie=new rl;let ee=!1,Xt=!1;const ce=new qt,we=new I,yt=new ge,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let fe=!1;function re(){return q===null?nt:1}let U=n;function He(w,F){return e.getContext(w,F)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ho}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",xe,!1),e.addEventListener("webglcontextcreationerror",Mn,!1),U===null){const F="webgl2";if(U=He(F,w),U===null)throw He(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(w){throw Ft("WebGLRenderer: "+w.message),w}let se,R,y,z,Y,J,rt,ot,Q,tt,ct,Rt,dt,ht,Lt,Ut,Gt,N,at,j,ut,vt,et;function At(){se=new Ym(U),se.init(),ut=new k_(U,se),R=new Bm(U,se,t,ut),y=new F_(U,se),R.reversedDepthBuffer&&u&&y.buffers.depth.setReversed(!0),B=U.createFramebuffer(),H=U.createFramebuffer(),O=U.createFramebuffer(),z=new Jm(U),Y=new M_,J=new O_(U,se,y,Y,R,ut,z),rt=new qm(P),ot=new tp(U),vt=new Om(U,ot),Q=new $m(U,ot,z,vt),tt=new Qm(U,Q,ot,vt,z),N=new Zm(U,R,J),Lt=new zm(Y),ct=new b_(P,rt,se,R,vt,Lt),Rt=new W_(P,Y),dt=new w_,ht=new P_(se),Gt=new Fm(P,rt,y,tt,p,l),Ut=new U_(P,tt,R),et=new X_(U,z,R,y),at=new km(U,se,z),j=new Km(U,se,z),z.programs=ct.programs,P.capabilities=R,P.extensions=se,P.properties=Y,P.renderLists=dt,P.shadowMap=Ut,P.state=y,P.info=z}At(),v!==on&&(E=new tg(v,e.width,e.height,o,s,r));const St=new H_(P,U);this.xr=St,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const w=se.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=se.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return nt},this.setPixelRatio=function(w){w!==void 0&&(nt=w,this.setSize(Z,st,!1))},this.getSize=function(w){return w.set(Z,st)},this.setSize=function(w,F,$=!0){if(St.isPresenting){It("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=w,st=F,e.width=Math.floor(w*nt),e.height=Math.floor(F*nt),$===!0&&(e.style.width=w+"px",e.style.height=F+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(Z*nt,st*nt).floor()},this.setDrawingBufferSize=function(w,F,$){Z=w,st=F,nt=$,e.width=Math.floor(w*$),e.height=Math.floor(F*$),this.setViewport(0,0,w,F)},this.setEffects=function(w){if(v===on){Ft("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let F=0;F<w.length;F++)if(w[F].isOutputPass===!0){It("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(it)},this.getViewport=function(w){return w.copy(Dt)},this.setViewport=function(w,F,$,G){w.isVector4?Dt.set(w.x,w.y,w.z,w.w):Dt.set(w,F,$,G),y.viewport(it.copy(Dt).multiplyScalar(nt).round())},this.getScissor=function(w){return w.copy(Se)},this.setScissor=function(w,F,$,G){w.isVector4?Se.set(w.x,w.y,w.z,w.w):Se.set(w,F,$,G),y.scissor(lt.copy(Se).multiplyScalar(nt).round())},this.getScissorTest=function(){return $t},this.setScissorTest=function(w){y.setScissorTest($t=w)},this.setOpaqueSort=function(w){Nt=w},this.setTransparentSort=function(w){Bt=w},this.getClearColor=function(w){return w.copy(Gt.getClearColor())},this.setClearColor=function(){Gt.setClearColor(...arguments)},this.getClearAlpha=function(){return Gt.getClearAlpha()},this.setClearAlpha=function(){Gt.setClearAlpha(...arguments)},this.clear=function(w=!0,F=!0,$=!0){let G=0;if(w){let W=!1;if(q!==null){const gt=q.texture.format;W=m.has(gt)}if(W){const gt=q.texture.type,Mt=g.has(gt),pt=Gt.getClearColor(),wt=Gt.getClearAlpha(),Ct=pt.r,Wt=pt.g,Kt=pt.b;Mt?(b[0]=Ct,b[1]=Wt,b[2]=Kt,b[3]=wt,U.clearBufferuiv(U.COLOR,0,b)):(S[0]=Ct,S[1]=Wt,S[2]=Kt,S[3]=wt,U.clearBufferiv(U.COLOR,0,S))}else G|=U.COLOR_BUFFER_BIT}F&&(G|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),L=w},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",Mn,!1),Gt.dispose(),dt.dispose(),ht.dispose(),Y.dispose(),rt.dispose(),tt.dispose(),vt.dispose(),et.dispose(),ct.dispose(),St.dispose(),St.removeEventListener("sessionstart",bl),St.removeEventListener("sessionend",Ml),ci.stop()};function Ae(w){w.preventDefault(),Cr("WebGLRenderer: Context Lost."),C=!0}function xe(){Cr("WebGLRenderer: Context Restored."),C=!1;const w=z.autoReset,F=Ut.enabled,$=Ut.autoUpdate,G=Ut.needsUpdate,W=Ut.type;At(),z.autoReset=w,Ut.enabled=F,Ut.autoUpdate=$,Ut.needsUpdate=G,Ut.type=W}function Mn(w){Ft("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Sn(w){const F=w.target;F.removeEventListener("dispose",Sn),mu(F)}function mu(w){gu(w),Y.remove(w)}function gu(w){const F=Y.get(w).programs;F!==void 0&&(F.forEach(function($){ct.releaseProgram($)}),w.isShaderMaterial&&ct.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,$,G,W,gt){F===null&&(F=zt);const Mt=W.isMesh&&W.matrixWorld.determinantAffine()<0,pt=xu(w,F,$,G,W);y.setMaterial(G,Mt);let wt=$.index,Ct=1;if(G.wireframe===!0){if(wt=Q.getWireframeAttribute($),wt===void 0)return;Ct=2}const Wt=$.drawRange,Kt=$.attributes.position;let Pt=Wt.start*Ct,pe=(Wt.start+Wt.count)*Ct;gt!==null&&(Pt=Math.max(Pt,gt.start*Ct),pe=Math.min(pe,(gt.start+gt.count)*Ct)),wt!==null?(Pt=Math.max(Pt,0),pe=Math.min(pe,wt.count)):Kt!=null&&(Pt=Math.max(Pt,0),pe=Math.min(pe,Kt.count));const Ce=pe-Pt;if(Ce<0||Ce===1/0)return;vt.setup(W,G,pt,$,wt);let Te,_e=at;if(wt!==null&&(Te=ot.get(wt),_e=j,_e.setIndex(Te)),W.isMesh)G.wireframe===!0?(y.setLineWidth(G.wireframeLinewidth*re()),_e.setMode(U.LINES)):_e.setMode(U.TRIANGLES);else if(W.isLine){let Ge=G.linewidth;Ge===void 0&&(Ge=1),y.setLineWidth(Ge*re()),W.isLineSegments?_e.setMode(U.LINES):W.isLineLoop?_e.setMode(U.LINE_LOOP):_e.setMode(U.LINE_STRIP)}else W.isPoints?_e.setMode(U.POINTS):W.isSprite&&_e.setMode(U.TRIANGLES);if(W.isBatchedMesh)if(se.get("WEBGL_multi_draw"))_e.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Ge=W._multiDrawStarts,bt=W._multiDrawCounts,sn=W._multiDrawCount,ne=wt?ot.get(wt).bytesPerElement:1,cn=Y.get(G).currentProgram.getUniforms();for(let wn=0;wn<sn;wn++)cn.setValue(U,"_gl_DrawID",wn),_e.render(Ge[wn]/ne,bt[wn])}else if(W.isInstancedMesh)_e.renderInstances(Pt,Ce,W.count);else if($.isInstancedBufferGeometry){const Ge=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,bt=Math.min($.instanceCount,Ge);_e.renderInstances(Pt,Ce,bt)}else _e.render(Pt,Ce)};function yl(w,F,$){w.transparent===!0&&w.side===tn&&w.forceSinglePass===!1?(w.side=Je,w.needsUpdate=!0,Ns(w,F,$),w.side=si,w.needsUpdate=!0,Ns(w,F,$),w.side=tn):Ns(w,F,$)}this.compile=function(w,F,$=null){$===null&&($=w),M=ht.get($),M.init(F),_.push(M),$.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),w!==$&&w.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights();const G=new Set;return w.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const gt=W.material;if(gt)if(Array.isArray(gt))for(let Mt=0;Mt<gt.length;Mt++){const pt=gt[Mt];yl(pt,$,W),G.add(pt)}else yl(gt,$,W),G.add(gt)}),M=_.pop(),G},this.compileAsync=function(w,F,$=null){const G=this.compile(w,F,$);return new Promise(W=>{function gt(){if(G.forEach(function(Mt){Y.get(Mt).currentProgram.isReady()&&G.delete(Mt)}),G.size===0){W(w);return}setTimeout(gt,10)}se.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let Gr=null;function _u(w){Gr&&Gr(w)}function bl(){ci.stop()}function Ml(){ci.start()}const ci=new Wh;ci.setAnimationLoop(_u),typeof self<"u"&&ci.setContext(self),this.setAnimationLoop=function(w){Gr=w,St.setAnimationLoop(w),w===null?ci.stop():ci.start()},St.addEventListener("sessionstart",bl),St.addEventListener("sessionend",Ml),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){Ft("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(w,F);const $=St.enabled===!0&&St.isPresenting===!0,G=E!==null&&(q===null||$)&&E.begin(P,q);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),St.enabled===!0&&St.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(St.cameraAutoUpdate===!0&&St.updateCamera(F),F=St.getCamera()),w.isScene===!0&&w.onBeforeRender(P,w,F,q),M=ht.get(w,_.length),M.init(F),M.state.textureUnits=J.getTextureUnits(),_.push(M),ce.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),ie.setFromProjectionMatrix(ce,Cn,F.reversedDepth),Xt=this.localClippingEnabled,ee=Lt.init(this.clippingPlanes,Xt),A=dt.get(w,T.length),A.init(),T.push(A),St.enabled===!0&&St.isPresenting===!0){const Mt=P.xr.getDepthSensingMesh();Mt!==null&&Wr(Mt,F,-1/0,P.sortObjects)}Wr(w,F,0,P.sortObjects),A.finish(),P.sortObjects===!0&&A.sort(Nt,Bt,F.reversedDepth),fe=St.enabled===!1||St.isPresenting===!1||St.hasDepthSensing()===!1,fe&&Gt.addToRenderList(A,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ee===!0&&Lt.beginShadows();const W=M.state.shadowsArray;if(Ut.render(W,w,F),ee===!0&&Lt.endShadows(),(G&&E.hasRenderPass())===!1){const Mt=A.opaque,pt=A.transmissive;if(M.setupLights(),F.isArrayCamera){const wt=F.cameras;if(pt.length>0)for(let Ct=0,Wt=wt.length;Ct<Wt;Ct++){const Kt=wt[Ct];wl(Mt,pt,w,Kt)}fe&&Gt.render(w);for(let Ct=0,Wt=wt.length;Ct<Wt;Ct++){const Kt=wt[Ct];Sl(A,w,Kt,Kt.viewport)}}else pt.length>0&&wl(Mt,pt,w,F),fe&&Gt.render(w),Sl(A,w,F)}q!==null&&D===0&&(J.updateMultisampleRenderTarget(q),J.updateRenderTargetMipmap(q)),G&&E.end(P),w.isScene===!0&&w.onAfterRender(P,w,F),vt.resetDefaultState(),V=-1,K=null,_.pop(),_.length>0?(M=_[_.length-1],J.setTextureUnits(M.state.textureUnits),ee===!0&&Lt.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,T.pop(),T.length>0?A=T[T.length-1]:A=null,L!==null&&L.renderEnd()};function Wr(w,F,$,G){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)$=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLightProbeGrid)M.pushLightProbeGrid(w);else if(w.isLight)M.pushLight(w),w.castShadow&&M.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||ie.intersectsSprite(w)){G&&yt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ce);const Mt=tt.update(w),pt=w.material;pt.visible&&A.push(w,Mt,pt,$,yt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||ie.intersectsObject(w))){const Mt=tt.update(w),pt=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),yt.copy(w.boundingSphere.center)):(Mt.boundingSphere===null&&Mt.computeBoundingSphere(),yt.copy(Mt.boundingSphere.center)),yt.applyMatrix4(w.matrixWorld).applyMatrix4(ce)),Array.isArray(pt)){const wt=Mt.groups;for(let Ct=0,Wt=wt.length;Ct<Wt;Ct++){const Kt=wt[Ct],Pt=pt[Kt.materialIndex];Pt&&Pt.visible&&A.push(w,Mt,Pt,$,yt.z,Kt)}}else pt.visible&&A.push(w,Mt,pt,$,yt.z,null)}}const gt=w.children;for(let Mt=0,pt=gt.length;Mt<pt;Mt++)Wr(gt[Mt],F,$,G)}function Sl(w,F,$,G){const{opaque:W,transmissive:gt,transparent:Mt}=w;M.setupLightsView($),ee===!0&&Lt.setGlobalState(P.clippingPlanes,$),G&&y.viewport(it.copy(G)),W.length>0&&Ds(W,F,$),gt.length>0&&Ds(gt,F,$),Mt.length>0&&Ds(Mt,F,$),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function wl(w,F,$,G){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[G.id]===void 0){const Pt=se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[G.id]=new In(1,1,{generateMipmaps:!0,type:Pt?Gn:on,minFilter:vi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace})}const gt=M.state.transmissionRenderTarget[G.id],Mt=G.viewport||it;gt.setSize(Mt.z*P.transmissionResolutionScale,Mt.w*P.transmissionResolutionScale);const pt=P.getRenderTarget(),wt=P.getActiveCubeFace(),Ct=P.getActiveMipmapLevel();P.setRenderTarget(gt),P.getClearColor(oe),Ht=P.getClearAlpha(),Ht<1&&P.setClearColor(16777215,.5),P.clear(),fe&&Gt.render($);const Wt=P.toneMapping;P.toneMapping=Pn;const Kt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),M.setupLightsView(G),ee===!0&&Lt.setGlobalState(P.clippingPlanes,G),Ds(w,$,G),J.updateMultisampleRenderTarget(gt),J.updateRenderTargetMipmap(gt),se.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let pe=0,Ce=F.length;pe<Ce;pe++){const Te=F[pe],{object:_e,geometry:Ge,material:bt,group:sn}=Te;if(bt.side===tn&&_e.layers.test(G.layers)){const ne=bt.side;bt.side=Je,bt.needsUpdate=!0,Al(_e,$,G,Ge,bt,sn),bt.side=ne,bt.needsUpdate=!0,Pt=!0}}Pt===!0&&(J.updateMultisampleRenderTarget(gt),J.updateRenderTargetMipmap(gt))}P.setRenderTarget(pt,wt,Ct),P.setClearColor(oe,Ht),Kt!==void 0&&(G.viewport=Kt),P.toneMapping=Wt}function Ds(w,F,$){const G=F.isScene===!0?F.overrideMaterial:null;for(let W=0,gt=w.length;W<gt;W++){const Mt=w[W],{object:pt,geometry:wt,group:Ct}=Mt;let Wt=Mt.material;Wt.allowOverride===!0&&G!==null&&(Wt=G),pt.layers.test($.layers)&&Al(pt,F,$,wt,Wt,Ct)}}function Al(w,F,$,G,W,gt){w.onBeforeRender(P,F,$,G,W,gt),w.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),W.onBeforeRender(P,F,$,G,w,gt),W.transparent===!0&&W.side===tn&&W.forceSinglePass===!1?(W.side=Je,W.needsUpdate=!0,P.renderBufferDirect($,F,G,W,w,gt),W.side=si,W.needsUpdate=!0,P.renderBufferDirect($,F,G,W,w,gt),W.side=tn):P.renderBufferDirect($,F,G,W,w,gt),w.onAfterRender(P,F,$,G,W,gt)}function Ns(w,F,$){F.isScene!==!0&&(F=zt);const G=Y.get(w),W=M.state.lights,gt=M.state.shadowsArray,Mt=W.state.version,pt=ct.getParameters(w,W.state,gt,F,$,M.state.lightProbeGridArray),wt=ct.getProgramCacheKey(pt);let Ct=G.programs;G.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?F.environment:null,G.fog=F.fog;const Wt=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;G.envMap=rt.get(w.envMap||G.environment,Wt),G.envMapRotation=G.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Ct===void 0&&(w.addEventListener("dispose",Sn),Ct=new Map,G.programs=Ct);let Kt=Ct.get(wt);if(Kt!==void 0){if(G.currentProgram===Kt&&G.lightsStateVersion===Mt)return El(w,pt),Kt}else pt.uniforms=ct.getUniforms(w),L!==null&&w.isNodeMaterial&&L.build(w,$,pt),w.onBeforeCompile(pt,P),Kt=ct.acquireProgram(pt,wt),Ct.set(wt,Kt),G.uniforms=pt.uniforms;const Pt=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pt.clippingPlanes=Lt.uniform),El(w,pt),G.needsLights=bu(w),G.lightsStateVersion=Mt,G.needsLights&&(Pt.ambientLightColor.value=W.state.ambient,Pt.lightProbe.value=W.state.probe,Pt.directionalLights.value=W.state.directional,Pt.directionalLightShadows.value=W.state.directionalShadow,Pt.spotLights.value=W.state.spot,Pt.spotLightShadows.value=W.state.spotShadow,Pt.rectAreaLights.value=W.state.rectArea,Pt.ltc_1.value=W.state.rectAreaLTC1,Pt.ltc_2.value=W.state.rectAreaLTC2,Pt.pointLights.value=W.state.point,Pt.pointLightShadows.value=W.state.pointShadow,Pt.hemisphereLights.value=W.state.hemi,Pt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Pt.spotLightMatrix.value=W.state.spotLightMatrix,Pt.spotLightMap.value=W.state.spotLightMap,Pt.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=M.state.lightProbeGridArray.length>0,G.currentProgram=Kt,G.uniformsList=null,Kt}function Tl(w){if(w.uniformsList===null){const F=w.currentProgram.getUniforms();w.uniformsList=yr.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function El(w,F){const $=Y.get(w);$.outputColorSpace=F.outputColorSpace,$.batching=F.batching,$.batchingColor=F.batchingColor,$.instancing=F.instancing,$.instancingColor=F.instancingColor,$.instancingMorph=F.instancingMorph,$.skinning=F.skinning,$.morphTargets=F.morphTargets,$.morphNormals=F.morphNormals,$.morphColors=F.morphColors,$.morphTargetsCount=F.morphTargetsCount,$.numClippingPlanes=F.numClippingPlanes,$.numIntersection=F.numClipIntersection,$.vertexAlphas=F.vertexAlphas,$.vertexTangents=F.vertexTangents,$.toneMapping=F.toneMapping}function vu(w,F){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;x.setFromMatrixPosition(F.matrixWorld);for(let $=0,G=w.length;$<G;$++){const W=w[$];if(W.texture!==null&&W.boundingBox.containsPoint(x))return W}return null}function xu(w,F,$,G,W){F.isScene!==!0&&(F=zt),J.resetTextureUnits();const gt=F.fog,Mt=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?F.environment:null,pt=q===null?P.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:te.workingColorSpace,wt=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ct=rt.get(G.envMap||Mt,wt),Wt=G.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Kt=!!$.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Pt=!!$.morphAttributes.position,pe=!!$.morphAttributes.normal,Ce=!!$.morphAttributes.color;let Te=Pn;G.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Te=P.toneMapping);const _e=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Ge=_e!==void 0?_e.length:0,bt=Y.get(G),sn=M.state.lights;if(ee===!0&&(Xt===!0||w!==K)){const ye=w===K&&G.id===V;Lt.setState(G,w,ye)}let ne=!1;G.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==sn.state.version||bt.outputColorSpace!==pt||W.isBatchedMesh&&bt.batching===!1||!W.isBatchedMesh&&bt.batching===!0||W.isBatchedMesh&&bt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&bt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&bt.instancing===!1||!W.isInstancedMesh&&bt.instancing===!0||W.isSkinnedMesh&&bt.skinning===!1||!W.isSkinnedMesh&&bt.skinning===!0||W.isInstancedMesh&&bt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&bt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&bt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&bt.instancingMorph===!1&&W.morphTexture!==null||bt.envMap!==Ct||G.fog===!0&&bt.fog!==gt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Lt.numPlanes||bt.numIntersection!==Lt.numIntersection)||bt.vertexAlphas!==Wt||bt.vertexTangents!==Kt||bt.morphTargets!==Pt||bt.morphNormals!==pe||bt.morphColors!==Ce||bt.toneMapping!==Te||bt.morphTargetsCount!==Ge||!!bt.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(ne=!0):(ne=!0,bt.__version=G.version);let cn=bt.currentProgram;ne===!0&&(cn=Ns(G,F,W),L&&G.isNodeMaterial&&L.onUpdateProgram(G,cn,bt));let wn=!1,Yn=!1,Ai=!1;const ve=cn.getUniforms(),Pe=bt.uniforms;if(y.useProgram(cn.program)&&(wn=!0,Yn=!0,Ai=!0),G.id!==V&&(V=G.id,Yn=!0),bt.needsLights){const ye=vu(M.state.lightProbeGridArray,W);bt.lightProbeGrid!==ye&&(bt.lightProbeGrid=ye,Yn=!0)}if(wn||K!==w){y.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),ve.setValue(U,"projectionMatrix",w.projectionMatrix),ve.setValue(U,"viewMatrix",w.matrixWorldInverse);const Kn=ve.map.cameraPosition;Kn!==void 0&&Kn.setValue(U,we.setFromMatrixPosition(w.matrixWorld)),R.logarithmicDepthBuffer&&ve.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ve.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),K!==w&&(K=w,Yn=!0,Ai=!0)}if(bt.needsLights&&(sn.state.directionalShadowMap.length>0&&ve.setValue(U,"directionalShadowMap",sn.state.directionalShadowMap,J),sn.state.spotShadowMap.length>0&&ve.setValue(U,"spotShadowMap",sn.state.spotShadowMap,J),sn.state.pointShadowMap.length>0&&ve.setValue(U,"pointShadowMap",sn.state.pointShadowMap,J)),W.isSkinnedMesh){ve.setOptional(U,W,"bindMatrix"),ve.setOptional(U,W,"bindMatrixInverse");const ye=W.skeleton;ye&&(ye.boneTexture===null&&ye.computeBoneTexture(),ve.setValue(U,"boneTexture",ye.boneTexture,J))}W.isBatchedMesh&&(ve.setOptional(U,W,"batchingTexture"),ve.setValue(U,"batchingTexture",W._matricesTexture,J),ve.setOptional(U,W,"batchingIdTexture"),ve.setValue(U,"batchingIdTexture",W._indirectTexture,J),ve.setOptional(U,W,"batchingColorTexture"),W._colorsTexture!==null&&ve.setValue(U,"batchingColorTexture",W._colorsTexture,J));const $n=$.morphAttributes;if(($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)&&N.update(W,$,cn),(Yn||bt.receiveShadow!==W.receiveShadow)&&(bt.receiveShadow=W.receiveShadow,ve.setValue(U,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&F.environment!==null&&(Pe.envMapIntensity.value=F.environmentIntensity),Pe.dfgLUT!==void 0&&(Pe.dfgLUT.value=Y_()),Yn){if(ve.setValue(U,"toneMappingExposure",P.toneMappingExposure),bt.needsLights&&yu(Pe,Ai),gt&&G.fog===!0&&Rt.refreshFogUniforms(Pe,gt),Rt.refreshMaterialUniforms(Pe,G,nt,st,M.state.transmissionRenderTarget[w.id]),bt.needsLights&&bt.lightProbeGrid){const ye=bt.lightProbeGrid;Pe.probesSH.value=ye.texture,Pe.probesMin.value.copy(ye.boundingBox.min),Pe.probesMax.value.copy(ye.boundingBox.max),Pe.probesResolution.value.copy(ye.resolution)}yr.upload(U,Tl(bt),Pe,J)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(yr.upload(U,Tl(bt),Pe,J),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ve.setValue(U,"center",W.center),ve.setValue(U,"modelViewMatrix",W.modelViewMatrix),ve.setValue(U,"normalMatrix",W.normalMatrix),ve.setValue(U,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){const ye=G.uniformsGroups;for(let Kn=0,Ti=ye.length;Kn<Ti;Kn++){const Rl=ye[Kn];et.update(Rl,cn),et.bind(Rl,cn)}}return cn}function yu(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function bu(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(w,F,$){const G=Y.get(w);G.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Y.get(w.texture).__webglTexture=F,Y.get(w.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:$,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,F){const $=Y.get(w);$.__webglFramebuffer=F,$.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,$=0){q=w,X=F,D=$;let G=null,W=!1,gt=!1;if(w){const pt=Y.get(w);if(pt.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(U.FRAMEBUFFER,pt.__webglFramebuffer),it.copy(w.viewport),lt.copy(w.scissor),Et=w.scissorTest,y.viewport(it),y.scissor(lt),y.setScissorTest(Et),V=-1;return}else if(pt.__webglFramebuffer===void 0)J.setupRenderTarget(w);else if(pt.__hasExternalTextures)J.rebindTextures(w,Y.get(w.texture).__webglTexture,Y.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Wt=w.depthTexture;if(pt.__boundDepthTexture!==Wt){if(Wt!==null&&Y.has(Wt)&&(w.width!==Wt.image.width||w.height!==Wt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(w)}}const wt=w.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(gt=!0);const Ct=Y.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ct[F])?G=Ct[F][$]:G=Ct[F],W=!0):w.samples>0&&J.useMultisampledRTT(w)===!1?G=Y.get(w).__webglMultisampledFramebuffer:Array.isArray(Ct)?G=Ct[$]:G=Ct,it.copy(w.viewport),lt.copy(w.scissor),Et=w.scissorTest}else it.copy(Dt).multiplyScalar(nt).floor(),lt.copy(Se).multiplyScalar(nt).floor(),Et=$t;if($!==0&&(G=B),y.bindFramebuffer(U.FRAMEBUFFER,G)&&y.drawBuffers(w,G),y.viewport(it),y.scissor(lt),y.setScissorTest(Et),W){const pt=Y.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,pt.__webglTexture,$)}else if(gt){const pt=F;for(let wt=0;wt<w.textures.length;wt++){const Ct=Y.get(w.textures[wt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+wt,Ct.__webglTexture,$,pt)}}else if(w!==null&&$!==0){const pt=Y.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,pt.__webglTexture,$)}V=-1},this.readRenderTargetPixels=function(w,F,$,G,W,gt,Mt,pt=0){if(!(w&&w.isWebGLRenderTarget)){Ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Y.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Mt!==void 0&&(wt=wt[Mt]),wt){y.bindFramebuffer(U.FRAMEBUFFER,wt);try{const Ct=w.textures[pt],Wt=Ct.format,Kt=Ct.type;if(w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+pt),!R.textureFormatReadable(Wt)){Ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Kt)){Ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-G&&$>=0&&$<=w.height-W&&U.readPixels(F,$,G,W,ut.convert(Wt),ut.convert(Kt),gt)}finally{const Ct=q!==null?Y.get(q).__webglFramebuffer:null;y.bindFramebuffer(U.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(w,F,$,G,W,gt,Mt,pt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=Y.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Mt!==void 0&&(wt=wt[Mt]),wt)if(F>=0&&F<=w.width-G&&$>=0&&$<=w.height-W){y.bindFramebuffer(U.FRAMEBUFFER,wt);const Ct=w.textures[pt],Wt=Ct.format,Kt=Ct.type;if(w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+pt),!R.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Pt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Pt),U.bufferData(U.PIXEL_PACK_BUFFER,gt.byteLength,U.STREAM_READ),U.readPixels(F,$,G,W,ut.convert(Wt),ut.convert(Kt),0);const pe=q!==null?Y.get(q).__webglFramebuffer:null;y.bindFramebuffer(U.FRAMEBUFFER,pe);const Ce=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ad(U,Ce,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Pt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,gt),U.deleteBuffer(Pt),U.deleteSync(Ce),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,F=null,$=0){const G=Math.pow(2,-$),W=Math.floor(w.image.width*G),gt=Math.floor(w.image.height*G),Mt=F!==null?F.x:0,pt=F!==null?F.y:0;J.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,$,0,0,Mt,pt,W,gt),y.unbindTexture()},this.copyTextureToTexture=function(w,F,$=null,G=null,W=0,gt=0){let Mt,pt,wt,Ct,Wt,Kt,Pt,pe,Ce;const Te=w.isCompressedTexture?w.mipmaps[gt]:w.image;if($!==null)Mt=$.max.x-$.min.x,pt=$.max.y-$.min.y,wt=$.isBox3?$.max.z-$.min.z:1,Ct=$.min.x,Wt=$.min.y,Kt=$.isBox3?$.min.z:0;else{const Pe=Math.pow(2,-W);Mt=Math.floor(Te.width*Pe),pt=Math.floor(Te.height*Pe),w.isDataArrayTexture?wt=Te.depth:w.isData3DTexture?wt=Math.floor(Te.depth*Pe):wt=1,Ct=0,Wt=0,Kt=0}G!==null?(Pt=G.x,pe=G.y,Ce=G.z):(Pt=0,pe=0,Ce=0);const _e=ut.convert(F.format),Ge=ut.convert(F.type);let bt;F.isData3DTexture?(J.setTexture3D(F,0),bt=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(J.setTexture2DArray(F,0),bt=U.TEXTURE_2D_ARRAY):(J.setTexture2D(F,0),bt=U.TEXTURE_2D),y.activeTexture(U.TEXTURE0),y.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),y.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),y.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const sn=y.getParameter(U.UNPACK_ROW_LENGTH),ne=y.getParameter(U.UNPACK_IMAGE_HEIGHT),cn=y.getParameter(U.UNPACK_SKIP_PIXELS),wn=y.getParameter(U.UNPACK_SKIP_ROWS),Yn=y.getParameter(U.UNPACK_SKIP_IMAGES);y.pixelStorei(U.UNPACK_ROW_LENGTH,Te.width),y.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Te.height),y.pixelStorei(U.UNPACK_SKIP_PIXELS,Ct),y.pixelStorei(U.UNPACK_SKIP_ROWS,Wt),y.pixelStorei(U.UNPACK_SKIP_IMAGES,Kt);const Ai=w.isDataArrayTexture||w.isData3DTexture,ve=F.isDataArrayTexture||F.isData3DTexture;if(w.isDepthTexture){const Pe=Y.get(w),$n=Y.get(F),ye=Y.get(Pe.__renderTarget),Kn=Y.get($n.__renderTarget);y.bindFramebuffer(U.READ_FRAMEBUFFER,ye.__webglFramebuffer),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,Kn.__webglFramebuffer);for(let Ti=0;Ti<wt;Ti++)Ai&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Y.get(w).__webglTexture,W,Kt+Ti),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Y.get(F).__webglTexture,gt,Ce+Ti)),U.blitFramebuffer(Ct,Wt,Mt,pt,Pt,pe,Mt,pt,U.DEPTH_BUFFER_BIT,U.NEAREST);y.bindFramebuffer(U.READ_FRAMEBUFFER,null),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(W!==0||w.isRenderTargetTexture||Y.has(w)){const Pe=Y.get(w),$n=Y.get(F);y.bindFramebuffer(U.READ_FRAMEBUFFER,H),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,O);for(let ye=0;ye<wt;ye++)Ai?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Pe.__webglTexture,W,Kt+ye):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Pe.__webglTexture,W),ve?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,$n.__webglTexture,gt,Ce+ye):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,$n.__webglTexture,gt),W!==0?U.blitFramebuffer(Ct,Wt,Mt,pt,Pt,pe,Mt,pt,U.COLOR_BUFFER_BIT,U.NEAREST):ve?U.copyTexSubImage3D(bt,gt,Pt,pe,Ce+ye,Ct,Wt,Mt,pt):U.copyTexSubImage2D(bt,gt,Pt,pe,Ct,Wt,Mt,pt);y.bindFramebuffer(U.READ_FRAMEBUFFER,null),y.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ve?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(bt,gt,Pt,pe,Ce,Mt,pt,wt,_e,Ge,Te.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(bt,gt,Pt,pe,Ce,Mt,pt,wt,_e,Te.data):U.texSubImage3D(bt,gt,Pt,pe,Ce,Mt,pt,wt,_e,Ge,Te):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,gt,Pt,pe,Mt,pt,_e,Ge,Te.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,gt,Pt,pe,Te.width,Te.height,_e,Te.data):U.texSubImage2D(U.TEXTURE_2D,gt,Pt,pe,Mt,pt,_e,Ge,Te);y.pixelStorei(U.UNPACK_ROW_LENGTH,sn),y.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ne),y.pixelStorei(U.UNPACK_SKIP_PIXELS,cn),y.pixelStorei(U.UNPACK_SKIP_ROWS,wn),y.pixelStorei(U.UNPACK_SKIP_IMAGES,Yn),gt===0&&F.generateMipmaps&&U.generateMipmap(bt),y.unbindTexture()},this.initRenderTarget=function(w){Y.get(w).__webglFramebuffer===void 0&&J.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?J.setTextureCube(w,0):w.isData3DTexture?J.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?J.setTexture2DArray(w,0):J.setTexture2D(w,0),y.unbindTexture()},this.resetState=function(){X=0,D=0,q=null,y.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}}var ze=class Qh{constructor(t=1){this.state=t>>>0||1}next(){this.state=this.state+1831565813>>>0;let t=this.state;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+this.next()*(e-t)}int(t,e){return t+Math.floor(this.next()*(e-t+1))}pick(t){return t[Math.floor(this.next()*t.length)]}jitter(t,e){return t+(this.next()*2-1)*e}fork(){return new Qh(Math.floor(this.next()*4294967295)||1)}},_l={meadow:{foliage:[3120727,3650154,2789199,4569208],trunk:7031347,rock:[9080728,7765126,10133672],wood:9070146,woodDark:7031347,metal:4015185,lampGlow:16767113,grassLow:4169050,grassHigh:7319142,cliff:8223346,peak:15265007,skyTop:4026552,skyBottom:12573160,fog:12111837,water:4161454,sand:13220234,path:10125663,wall:14273712,roof:11032126}},Re=_l.meadow,Tt=(i,t,e)=>new I(i,t,e),K_={plaster:{baseColor:14273712,roughness:.92,metalness:0,scale:3.4,albedoVar:.14,tint:10260340,tintAmount:.12,ao:.18,bump:.15,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},stone:{baseColor:9080728,roughness:.96,metalness:0,scale:2.6,albedoVar:.26,tint:6056772,tintAmount:.16,ao:.34,bump:.42,roughVar:.14,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},wood:{baseColor:9070146,roughness:.82,metalness:0,scale:5.5,albedoVar:.12,tint:3811868,tintAmount:.14,ao:.16,bump:.12,roughVar:.12,grain:.55,grainScale:3.2,grainAxis:Tt(0,1,0),flat:!0},plank:{baseColor:10123858,roughness:.78,metalness:0,scale:6.5,albedoVar:.1,tint:4206623,tintAmount:.1,ao:.12,bump:.1,roughVar:.1,grain:.4,grainScale:5,grainAxis:Tt(1,0,0),flat:!0},thatch:{baseColor:11770460,roughness:.98,metalness:0,scale:9,albedoVar:.3,tint:6968100,tintAmount:.2,ao:.28,bump:.3,roughVar:.08,grain:.35,grainScale:8,grainAxis:Tt(0,0,1),flat:!0},tile:{baseColor:11032126,roughness:.7,metalness:0,scale:4,albedoVar:.14,tint:7221026,tintAmount:.16,ao:.24,bump:.34,roughVar:.1,grain:.6,grainScale:6,grainAxis:Tt(1,0,0),flat:!0},metal:{baseColor:4015185,roughness:.52,metalness:.85,scale:4.5,albedoVar:.16,tint:2760984,tintAmount:.18,ao:.22,bump:.16,roughVar:.2,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},dirt:{baseColor:9075288,roughness:1,metalness:0,scale:2,albedoVar:.22,tint:4863268,tintAmount:.2,ao:.3,bump:.1,roughVar:.05,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},sand:{baseColor:13351306,roughness:1,metalness:0,scale:7,albedoVar:.16,tint:10256456,tintAmount:.14,ao:.14,bump:.14,roughVar:.06,grain:.18,grainScale:3,grainAxis:Tt(1,0,0),flat:!1},gravel:{baseColor:10130570,roughness:.95,metalness:0,scale:5.5,albedoVar:.3,tint:6314575,tintAmount:.18,ao:.32,bump:.5,roughVar:.16,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},mud:{baseColor:4864038,roughness:.6,metalness:0,scale:2.4,albedoVar:.2,tint:2365192,tintAmount:.3,ao:.34,bump:.16,roughVar:.24,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},sandstone:{baseColor:13213802,roughness:.9,metalness:0,scale:3.4,albedoVar:.18,tint:9071164,tintAmount:.16,ao:.22,bump:.24,roughVar:.1,grain:.22,grainScale:2.4,grainAxis:Tt(0,1,0),flat:!0},granite:{baseColor:9341588,roughness:.58,metalness:0,scale:9,albedoVar:.34,tint:4538701,tintAmount:.14,ao:.14,bump:.12,roughVar:.2,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},slate:{baseColor:5264990,roughness:.55,metalness:0,scale:3,albedoVar:.14,tint:2897216,tintAmount:.2,ao:.2,bump:.18,roughVar:.12,grain:.2,grainScale:3,grainAxis:Tt(1,0,0),flat:!0},bark:{baseColor:5915957,roughness:.92,metalness:0,scale:6,albedoVar:.2,tint:2759696,tintAmount:.2,ao:.26,bump:.45,roughVar:.12,grain:.7,grainScale:5.5,grainAxis:Tt(0,1,0),flat:!0},leather:{baseColor:6964784,roughness:.62,metalness:0,scale:5,albedoVar:.16,tint:3021327,tintAmount:.22,ao:.2,bump:.18,roughVar:.12,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},canvas:{baseColor:13286812,roughness:.95,metalness:0,scale:11,albedoVar:.14,tint:9075292,tintAmount:.12,ao:.14,bump:.12,roughVar:.06,grain:.3,grainScale:12,grainAxis:Tt(1,0,0),flat:!1},parchment:{baseColor:14734512,roughness:.9,metalness:0,scale:3,albedoVar:.12,tint:10126680,tintAmount:.18,ao:.16,bump:.08,roughVar:.06,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},terracotta:{baseColor:11887162,roughness:.72,metalness:0,scale:4,albedoVar:.12,tint:8010272,tintAmount:.16,ao:.16,bump:.14,roughVar:.08,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},bone:{baseColor:14471866,roughness:.55,metalness:0,scale:6,albedoVar:.14,tint:9076582,tintAmount:.2,ao:.22,bump:.12,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},rust:{baseColor:9062956,roughness:.85,metalness:.25,scale:4,albedoVar:.28,tint:5909010,tintAmount:.3,ao:.26,bump:.28,roughVar:.3,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},bronze:{baseColor:10119738,roughness:.44,metalness:.9,scale:4.5,albedoVar:.16,tint:3810320,tintAmount:.24,ao:.22,bump:.16,roughVar:.18,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},brass:{baseColor:13214282,roughness:.34,metalness:.95,scale:5,albedoVar:.12,tint:6965778,tintAmount:.16,ao:.16,bump:.1,roughVar:.14,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0},brick:{baseColor:10373684,roughness:.86,metalness:0,scale:6,albedoVar:.14,tint:5907480,tintAmount:.16,ao:.2,bump:.1,roughVar:.12,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,tile:1,tileW:.25,tileH:.085,mortar:.014,bond:1,round:0,tileJitter:.18,mortarColor:11774098,tileRelief:.06},cobblestone:{baseColor:9080728,roughness:.9,metalness:0,scale:5,albedoVar:.2,tint:4867126,tintAmount:.18,ao:.28,bump:.2,roughVar:.14,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,tile:1,tileW:.17,tileH:.15,mortar:.03,bond:1,round:1,tileJitter:.24,mortarColor:3486251,tileRelief:.13},ashlar:{baseColor:12169892,roughness:.9,metalness:0,scale:3,albedoVar:.16,tint:8024671,tintAmount:.16,ao:.2,bump:.12,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,tile:1,tileW:.55,tileH:.32,mortar:.02,bond:.5,round:0,tileJitter:.1,mortarColor:8748655,tileRelief:.05},floortile:{baseColor:6975090,roughness:.5,metalness:0,scale:4,albedoVar:.12,tint:3356218,tintAmount:.16,ao:.16,bump:.08,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,tile:1,tileW:.4,tileH:.4,mortar:.014,bond:0,round:0,tileJitter:.12,mortarColor:2763308,tileRelief:.045},shingle:{baseColor:7031347,roughness:.85,metalness:0,scale:6,albedoVar:.16,tint:3022866,tintAmount:.18,ao:.24,bump:.12,roughVar:.12,grain:.32,grainScale:6,grainAxis:Tt(0,1,0),flat:!0,tile:1,tileW:.2,tileH:.13,mortar:.012,bond:1,round:0,tileJitter:.2,mortarColor:2365457,tileRelief:.09},snow:{baseColor:10133672,roughness:.9,metalness:0,scale:4,albedoVar:.14,tint:6976128,tintAmount:.14,ao:.2,bump:.24,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,cap:.95,capColor:16054524,capUp:.12,capSharp:.32,capRough:.9},moss:{baseColor:9080712,roughness:.94,metalness:0,scale:3.5,albedoVar:.2,tint:4870720,tintAmount:.16,ao:.28,bump:.34,roughVar:.12,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,cap:.74,capColor:4217130,capUp:.34,capSharp:.3,capRough:.96},lava:{baseColor:2758418,roughness:.88,metalness:0,scale:3.2,albedoVar:.18,tint:1181702,tintAmount:.26,ao:.34,bump:.5,roughVar:.14,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,glow:2.6,glowColor:16734750,glowThreshold:.3},crystal:{baseColor:3824778,roughness:.22,metalness:0,scale:5,albedoVar:.14,tint:1716050,tintAmount:.2,ao:.16,bump:.3,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,glow:1.5,glowColor:7329535,glowThreshold:.72},concrete:{baseColor:11908012,roughness:.88,metalness:0,scale:3,albedoVar:.08,tint:9078911,tintAmount:.08,ao:.12,bump:.06,roughVar:.08,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,tile:1,tileW:1.2,tileH:.6,mortar:.006,bond:0,round:0,tileJitter:.05,mortarColor:10131601,tileRelief:.03},paint:{baseColor:14605266,roughness:.6,metalness:0,scale:6,albedoVar:.04,tint:12104872,tintAmount:.05,ao:.05,bump:.02,roughVar:.05,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},marble:{baseColor:15263456,roughness:.22,metalness:0,scale:1.6,albedoVar:.08,tint:8029332,tintAmount:.12,ao:.08,bump:.04,roughVar:.08,grain:.5,grainScale:.7,grainAxis:Tt(.35,1,.2),flat:!1},terrazzo:{baseColor:14209734,roughness:.35,metalness:0,scale:10,albedoVar:.1,tint:6971471,tintAmount:.04,ao:.06,bump:.03,roughVar:.08,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,tile:1,tileW:.045,tileH:.045,mortar:.01,bond:0,round:1,tileJitter:.35,mortarColor:13617597,tileRelief:.02,tileTint:.18},steel:{baseColor:11449532,roughness:.38,metalness:.92,scale:8,albedoVar:.06,tint:6975610,tintAmount:.08,ao:.06,bump:.03,roughVar:.18,grain:.3,grainScale:26,grainAxis:Tt(1,0,0),flat:!1},chrome:{baseColor:13225684,roughness:.08,metalness:1,scale:5,albedoVar:.04,tint:9080984,tintAmount:.05,ao:.04,bump:.01,roughVar:.05,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},paintedMetal:{baseColor:4477020,roughness:.42,metalness:.35,scale:14,albedoVar:.04,tint:2239024,tintAmount:.06,ao:.06,bump:.04,roughVar:.08,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},corten:{baseColor:10115636,roughness:.82,metalness:.18,scale:3.2,albedoVar:.16,tint:5910038,tintAmount:.22,ao:.16,bump:.1,roughVar:.18,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},teak:{baseColor:9067574,roughness:.3,metalness:0,scale:6,albedoVar:.08,tint:3941908,tintAmount:.12,ao:.1,bump:.05,roughVar:.08,grain:.45,grainScale:4.5,grainAxis:Tt(1,0,0),flat:!1},porcelain:{baseColor:14276303,roughness:.18,metalness:0,scale:3,albedoVar:.05,tint:10131084,tintAmount:.06,ao:.08,bump:.03,roughVar:.06,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,tile:1,tileW:1.2,tileH:.6,mortar:.005,bond:.5,round:0,tileJitter:.06,mortarColor:11578530,tileRelief:.03},glaze:{baseColor:15921386,roughness:.12,metalness:0,scale:5,albedoVar:.02,tint:13158078,tintAmount:.05,ao:.07,bump:.008,roughVar:.03,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1},mosaic:{baseColor:4161454,roughness:.25,metalness:0,scale:8,albedoVar:.08,tint:1920628,tintAmount:.05,ao:.08,bump:.04,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,tile:1,tileW:.055,tileH:.055,mortar:.006,bond:0,round:0,tileJitter:.3,mortarColor:14210248,tileRelief:.05,tileTint:.3},parquet:{baseColor:1012e4,roughness:.32,metalness:0,scale:6,albedoVar:.07,tint:4861720,tintAmount:.1,ao:.08,bump:.04,roughVar:.08,grain:.3,grainScale:7,grainAxis:Tt(1,0,0),flat:!1,tile:1,tileW:.5,tileH:.09,mortar:.006,bond:0,round:0,tileJitter:.14,mortarColor:5913378,tileRelief:.04,chevron:1},patternedTile:{baseColor:14473161,roughness:.3,metalness:0,scale:3,albedoVar:.05,tint:3563380,tintAmount:.04,ao:.08,bump:.03,roughVar:.06,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,tile:1,tileW:.33,tileH:.33,mortar:.008,bond:0,round:0,tileJitter:.05,mortarColor:11117462,tileRelief:.035,motif:.9},corrugatedIron:{baseColor:10134182,roughness:.58,metalness:.5,scale:9,albedoVar:.1,tint:6968645,tintAmount:.16,ao:.16,bump:.35,roughVar:.18,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,ribs:1,ribScale:5,crust:.3,crustColor:9062950,crustRough:.95},asphalt:{baseColor:3881790,roughness:.93,metalness:0,scale:14,albedoVar:.1,tint:1973792,tintAmount:.18,ao:.2,bump:.4,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,speck:.42,speckScale:40},diamondPlate:{baseColor:9278361,roughness:.44,metalness:.55,scale:12,albedoVar:.05,tint:6054246,tintAmount:.1,ao:.1,bump:.5,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,ribs:1,ribScale:6,ribCross:1},galvanised:{baseColor:11121077,roughness:.46,metalness:.5,scale:3.5,albedoVar:.04,tint:8226443,tintAmount:.06,ao:.05,bump:.1,roughVar:.05,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,cells:1,cellScale:6,cellEdge:.22,cellJitter:.4},copperPatina:{baseColor:10246964,roughness:.42,metalness:.75,scale:6,albedoVar:.08,tint:7027231,tintAmount:.12,ao:.14,bump:.2,roughVar:.12,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,crust:.95,crustColor:5220490,crustRough:.92},basalt:{baseColor:5527646,roughness:.86,metalness:.04,scale:3,albedoVar:.06,tint:2829875,tintAmount:.12,ao:.16,bump:.5,roughVar:.1,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,cells:1,cellScale:3.2,cellEdge:.85,cellJitter:.16,cellPlan:1},velvet:{baseColor:7149360,roughness:.92,metalness:0,scale:7,albedoVar:.05,tint:3803673,tintAmount:.14,ao:.12,bump:.015,roughVar:.03,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,physical:!0,sheen:1,sheenColor:14190236,sheenRough:.32},silk:{baseColor:13219800,roughness:.2,metalness:.05,scale:6,albedoVar:.04,tint:9404326,tintAmount:.08,ao:.06,bump:.01,roughVar:.02,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,physical:!0,anisotropy:.9,anisotropyRotation:0,sheen:.35,sheenColor:16777215,sheenRough:.2},brushedMetal:{baseColor:11844030,roughness:.34,metalness:.7,scale:5,albedoVar:.02,tint:9146774,tintAmount:.04,ao:.03,bump:.008,roughVar:.02,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,physical:!0,anisotropy:.95,anisotropyRotation:Math.PI/2},nacre:{baseColor:14473424,roughness:.12,metalness:.2,scale:4,albedoVar:.04,tint:11055296,tintAmount:.18,ao:.05,bump:.02,roughVar:.02,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,physical:!0,iridescence:1,iridescenceIOR:2.4,iridescenceThickness:[300,900]},ice:{baseColor:13625586,roughness:.13,metalness:0,scale:2.5,albedoVar:.05,tint:8369356,tintAmount:.14,ao:.08,bump:.06,roughVar:.03,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!1,cells:1,cellScale:1.8,cellEdge:.22,cellJitter:.08,physical:!0,transmission:.85,thickness:.5,ior:1.31,attenuationColor:10474728,attenuationDistance:1.4},gemstone:{baseColor:15135999,roughness:.03,metalness:0,scale:3.5,albedoVar:.03,tint:9421544,tintAmount:.08,ao:.02,bump:0,roughVar:.015,grain:0,grainScale:1,grainAxis:Tt(0,1,0),flat:!0,cells:.5,cellScale:2.2,cellEdge:.12,cellJitter:.25,physical:!0,transmission:1,thickness:.55,ior:2.2,dispersion:14,attenuationColor:12117247,attenuationDistance:2.4}},J_=`
// World-space coordinates get large (props far from the origin, plus the seed
// offset), and mobile GPUs default the fragment stage to mediump — where
// fract() of a big number loses precision and the noise/grain visibly swims.
// Force highp on the world varyings and the noise maths so it stays put.
varying highp vec3 vSurfWorldPos;
varying highp vec3 vSurfWorldNormal;
uniform highp vec3 uSurfSeed;
uniform float uSurfScale;
uniform float uSurfAlbedoVar;
uniform vec3  uSurfTint;
uniform float uSurfTintAmount;
uniform float uSurfAO;
uniform float uSurfBump;
uniform float uSurfRoughVar;
uniform float uSurfGrain;
uniform float uSurfGrainScale;
uniform vec3  uSurfGrainAxis;
uniform float uSurfTile;
uniform highp vec2 uSurfTileSize;
uniform float uSurfMortar;
uniform float uSurfTileBond;
uniform float uSurfTileRound;
uniform float uSurfTileJitter;
uniform vec3  uSurfMortarColor;
uniform float uSurfTileRelief;
uniform float uSurfTileTint;
uniform float uSurfTileChevron;
uniform float uSurfTileMotif;
uniform float uSurfCap;
uniform vec3  uSurfCapColor;
uniform float uSurfCapUp;
uniform float uSurfCapSharp;
uniform float uSurfCapRough;
uniform float uSurfGlow;
uniform vec3  uSurfGlowColor;
uniform float uSurfGlowThresh;
uniform float uSurfWet;
uniform float uSurfWetCling;
uniform float uSurfRibs;
uniform float uSurfRibScale;
uniform float uSurfRibTurn;
uniform float uSurfRibCross;
uniform float uSurfSpeck;
uniform float uSurfSpeckScale;
uniform float uSurfCells;
uniform float uSurfCellScale;
uniform float uSurfCellEdge;
uniform float uSurfCellJitter;
uniform float uSurfCellPlan;
uniform float uSurfCrust;
uniform vec3  uSurfCrustColor;
uniform float uSurfCrustRough;

float scenaHash13(highp vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float scenaVNoise(highp vec3 x){
  highp vec3 i = floor(x); highp vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = scenaHash13(i + vec3(0.0,0.0,0.0));
  float n100 = scenaHash13(i + vec3(1.0,0.0,0.0));
  float n010 = scenaHash13(i + vec3(0.0,1.0,0.0));
  float n110 = scenaHash13(i + vec3(1.0,1.0,0.0));
  float n001 = scenaHash13(i + vec3(0.0,0.0,1.0));
  float n101 = scenaHash13(i + vec3(1.0,0.0,1.0));
  float n011 = scenaHash13(i + vec3(0.0,1.0,1.0));
  float n111 = scenaHash13(i + vec3(1.0,1.0,1.0));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float scenaFbm(highp vec3 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++){ s += a * scenaVNoise(p); p *= 2.02; a *= 0.5; }
  return s;
}
// Triplanar fbm: blend three axis-projected samples by the world normal, so
// box faces need no UVs and adjacent boxes share one continuous field.
float scenaTri(highp vec3 wp, vec3 wn, float scale){
  highp vec3 p = wp * scale + uSurfSeed;
  vec3 w = abs(normalize(wn)); w = pow(w, vec3(4.0)); w /= (w.x + w.y + w.z + 1e-4);
  return scenaFbm(p.yzx) * w.x + scenaFbm(p.zxy) * w.y + scenaFbm(p.xyz) * w.z;
}
// Concentric grain rings around the grain axis, warped by noise.
float scenaGrain(highp vec3 wp){
  highp vec3 ax = normalize(uSurfGrainAxis);
  highp float along = dot(wp, ax);
  highp vec3 perp = wp - ax * along;
  highp float rings = length(perp) * uSurfGrainScale + scenaFbm(wp * uSurfGrainScale * 0.4) * 2.0;
  return abs(fract(rings) - 0.5) * 2.0; // triangle wave 0..1
}
// A masonry grid on the dominant-axis face (so box walls/floors/roofs get a
// clean 2D pattern and abutting boxes align). Running-bond rows, mortar bands
// and per-cell jitter. Returns: x = mortar mask (1 in the joint), y = per-cell
// hash (0..1), z = surface height (tile face high → joint low), w = the domed
// stone height for cobbles.
vec4 scenaTile(highp vec3 wp, vec3 wn){
  vec3 an = abs(normalize(wn));
  highp vec2 uv;
  if (an.x >= an.y && an.x >= an.z) uv = wp.zy;
  else if (an.y >= an.x && an.y >= an.z) uv = wp.xz;
  else uv = wp.xy;
  uv += uSurfSeed.xy;
  highp vec2 ts = max(uSurfTileSize, vec2(1e-3));
  // Chevron parquet: shear alternate column bands ±45° (about each band's own
  // centre, so the offset stays small and mediump-safe far from the origin).
  if (uSurfTileChevron > 0.5) {
    highp float band = floor(uv.x / ts.x);
    highp float local = uv.x - (band + 0.5) * ts.x;
    uv.y += (mod(band, 2.0) * 2.0 - 1.0) * local;
  }
  highp float row = floor(uv.y / ts.y);
  highp float bond = mod(row, 2.0) * uSurfTileBond * 0.5;
  highp float cxf = uv.x / ts.x + bond;
  highp float col = floor(cxf);
  highp vec2 cell = vec2(col, row);
  highp float fx = fract(cxf);
  highp float fy = fract(uv.y / ts.y);
  // Distance to the nearest cell edge, in world units → mortar band.
  float ex = min(fx, 1.0 - fx) * ts.x;
  float ey = min(fy, 1.0 - fy) * ts.y;
  float edge = min(ex, ey);
  float m = max(uSurfMortar, 1e-4);
  float mortar = 1.0 - smoothstep(m, m * 1.7, edge);
  // Domed profile for cobbles: peaks at the cell centre, falls to the joint.
  float dome = clamp(1.0 - length(vec2(fx - 0.5, fy - 0.5)) * 2.0, 0.0, 1.0);
  float flatH = 1.0 - mortar;
  float height = mix(flatH, dome * (1.0 - mortar), uSurfTileRound);
  float h = scenaHash13(vec3(cell + vec2(3.1, 7.3), 5.0));
  return vec4(mortar, h, height, dome);
}
// Snow / moss cap: settles on up-facing surfaces, its edge broken up by the
// noise the shader already sampled (no extra noise cost). Returns 0..1.
float scenaCapMask(vec3 wn, float breakup){
  float up = normalize(wn).y * 0.5 + 0.5;      // 0 (down) .. 1 (up)
  float s = max(uSurfCapSharp, 1e-3);
  return clamp(smoothstep(uSurfCapUp - s, uSurfCapUp + s, up + (breakup - 0.5) * 0.6), 0.0, 1.0);
}
// Parallel ridges along an axis — a corrugated sheet. Crossed with a second
// set, the two lattices intersect in isolated studs: tread plate.
float scenaRibs(highp vec3 wp, vec3 wn){
  if (uSurfRibs <= 0.0) return 0.0;
  // In the FACE's own plane, like the masonry grid. A world axis is no use
  // here: on a wall, two different world axes project onto the same
  // direction, which turns a crossed tread plate back into plain stripes.
  vec3 an = abs(normalize(wn));
  highp vec2 uv;
  if (an.x >= an.y && an.x >= an.z) uv = wp.zy;
  else if (an.y >= an.x && an.y >= an.z) uv = wp.xz;
  else uv = wp.xy;
  uv = (uSurfRibTurn > 0.5 ? uv.yx : uv) * uSurfRibScale;
  float r = abs(fract(uv.x) - 0.5) * 2.0;
  if (uSurfRibCross > 0.5) {
    // Two sets at ±45° IN THAT PLANE. MIN, not max: crossed ridges are high
    // together only where they actually cross, and that is a field of studs
    // rather than a waffle grid.
    highp vec2 d = vec2(uv.x + uv.y, uv.x - uv.y) * 0.7071;
    r = min(abs(fract(d.x) - 0.5), abs(fract(d.y) - 0.5)) * 2.0;
  }
  return r * r * (3.0 - 2.0 * r);   // round the triangle off
}
// Aggregate. Everything else in this shader runs on smooth fbm, which reads
// as mottling; asphalt is STONES IN TAR, and stones have edges.
float scenaSpeck(highp vec3 wp){
  if (uSurfSpeck <= 0.0) return 0.5;
  return scenaHash13(floor(wp * uSurfSpeckScale + uSurfSeed));
}
// Warped Voronoi. Returns x = per-cell hash, y = distance to the nearest
// seam (0 on it). Basalt's columnar jointing and the zinc spangle on
// galvanised steel are this one function two orders of magnitude apart.
vec2 scenaCells(highp vec3 wp, vec3 wn){
  if (uSurfCells <= 0.0) return vec2(0.5, 1.0);
  highp vec2 uv;
  if (uSurfCellPlan > 0.5) {
    // Columnar jointing is a crazy paving seen from ABOVE, pulled up into
    // columns — so it is laid out in plan whatever the face is pointing at.
    uv = wp.xz;
  } else {
    vec3 an = abs(normalize(wn));
    if (an.x >= an.y && an.x >= an.z) uv = wp.zy;
    else if (an.y >= an.x && an.y >= an.z) uv = wp.xz;
    else uv = wp.xy;
  }
  uv = uv * uSurfCellScale + uSurfSeed.xy;
  highp vec2 g = floor(uv);
  highp vec2 f = uv - g;
  float d1 = 8.0, d2 = 8.0, id = 0.5;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      float h = scenaHash13(vec3(g + o, 11.0));
      vec2 seed = o + vec2(h, fract(h * 37.31));
      float d = length(seed - f);
      if (d < d1) { d2 = d1; d1 = d; id = h; }
      else if (d < d2) { d2 = d; }
    }
  }
  // d2 - d1 is 0 exactly on the boundary between two cells and grows inward,
  // which is a seam that does not care how big the cells are.
  return vec2(id, clamp(d2 - d1, 0.0, 1.0));
}
// A mineral crust — verdigris, a rust bloom, lichen — taking hold in the
// cavities and on the up-facing side.
float scenaCrustMask(vec3 wn, float low){
  if (uSurfCrust <= 0.0) return 0.0;
  float up = normalize(wn).y * 0.5 + 0.5;
  return clamp(smoothstep(0.66, 0.28, low) * uSurfCrust * mix(0.5, 1.0, up), 0.0, 1.0);
}
// WATER FILLS FROM THE BOTTOM. Wetness is a LEVEL, not a multiply: every
// point has a height (the surface's own low-frequency band, with the
// mortar joints counted as the lowest ground there is), and it is wet when
// the level is above it. That is what makes a light shower read as dark
// glossy lines in the joints and hollows while the faces stay dry, and a
// downpour sheet the whole wall — from one scalar.
//
// The level is lower on a vertical face than a horizontal one, because
// rain falls down: a sill soaks while the wall beneath it is merely damp.
float scenaWetMask(vec3 wn, float low, float mortar){
  if (uSurfWet <= 0.0) return 0.0;
  float up = normalize(wn).y * 0.5 + 0.5;
  float level = uSurfWet * mix(clamp(uSurfWetCling, 0.0, 1.0), 1.0, up) * 1.4 - 0.2;
  float height = min(low, 1.0 - mortar);
  return clamp(smoothstep(height - 0.2, height + 0.2, level), 0.0, 1.0);
}
`;function Z_(i){return i.replace("#include <common>",`#include <common>
varying highp vec3 vSurfWorldPos;
varying highp vec3 vSurfWorldNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      {
        vec4 scenaWP = modelMatrix * vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          scenaWP = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        #endif
        vSurfWorldPos = scenaWP.xyz;
      }`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
      {
        vec3 scenaON = objectNormal;
        #ifdef USE_INSTANCING
          scenaON = mat3(instanceMatrix) * scenaON;
        #endif
        vSurfWorldNormal = normalize(mat3(modelMatrix) * scenaON);
      }`)}function Q_(i){return i.replace("#include <common>",`#include <common>
`+J_).replace("#include <map_fragment>",`#include <map_fragment>
      float scenaN   = scenaTri(vSurfWorldPos, vSurfWorldNormal, uSurfScale);
      float scenaLow = scenaTri(vSurfWorldPos, vSurfWorldNormal, uSurfScale * 0.25);
      float scenaG   = scenaGrain(vSurfWorldPos);
      float scenaRib = scenaRibs(vSurfWorldPos, vSurfWorldNormal);
      float scenaSp  = scenaSpeck(vSurfWorldPos);
      vec2  scenaC   = scenaCells(vSurfWorldPos, vSurfWorldNormal);
      // Seam mask: 1 on the join between two cells, 0 inside one.
      float scenaSeam = (1.0 - smoothstep(0.0, 0.085, scenaC.y)) * uSurfCells;
      // masonry grid (no-op when uSurfTile == 0)
      vec4  scenaT   = scenaTile(vSurfWorldPos, vSurfWorldNormal);
      float scenaMortar = scenaT.x * uSurfTile;
      // fine mottle
      diffuseColor.rgb *= 1.0 + (scenaN - 0.5) * uSurfAlbedoVar;
      // per-cell brightness jitter, so no two bricks/stones read the same
      diffuseColor.rgb *= 1.0 + uSurfTileJitter * (scenaT.y - 0.5) * uSurfTile;
      // cavity ambient occlusion (dark where the low band is low)
      diffuseColor.rgb *= 1.0 - uSurfAO * (1.0 - scenaLow);
      // cavity tint
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfTint, uSurfTintAmount * (1.0 - scenaLow));
      // grain darkening (no-op when uSurfGrain == 0)
      diffuseColor.rgb *= 1.0 - uSurfGrain * scenaG * 0.5;
      // aggregate chips — hard-edged, unlike everything else here
      diffuseColor.rgb *= 1.0 + (scenaSp - 0.5) * uSurfSpeck;
      // cells: each one its own shade, and the seams between them dark
      diffuseColor.rgb *= 1.0 + (scenaC.x - 0.5) * uSurfCellJitter * uSurfCells;
      diffuseColor.rgb *= 1.0 - scenaSeam * uSurfCellEdge;
      // the ridge valleys hold shadow the lighting alone will not give them
      diffuseColor.rgb *= 1.0 - uSurfRibs * (1.0 - scenaRib) * 0.22;
      // accent cells (mosaic chips) painted solid tint — a no-op at 0
      float scenaAccent = uSurfTile * uSurfTileTint;
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfTint, step(scenaT.y, scenaAccent) * uSurfTile);
      // per-cell ring + dot motif (patterned cement tiles) — a no-op at 0
      float scenaMotifM = smoothstep(0.40, 0.47, scenaT.w) - smoothstep(0.60, 0.68, scenaT.w)
        + smoothstep(0.86, 0.93, scenaT.w);
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfTint,
        clamp(scenaMotifM, 0.0, 1.0) * uSurfTileMotif * uSurfTile);
      // recessed mortar joint: to the mortar colour, shadowed in the groove
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfMortarColor, scenaMortar);
      diffuseColor.rgb *= 1.0 - 0.35 * scenaMortar;
      // snow / moss cap settling on the up-facing faces (over the mortar too)
      float scenaCapM = scenaCapMask(vSurfWorldNormal, scenaN) * uSurfCap;
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfCapColor, scenaCapM);
      // WET. Water darkens a surface because it fills the pores: light gets
      // in, scatters, and comes back out with less of it. So POROUS things
      // darken hard and sealed ones barely change — a wet flagstone is
      // almost black, wet chrome is just chrome — and metal, which has no
      // subsurface to wet, does not darken at all.
      // A CRUST, not a tint: verdigris, rust bloom, lichen. It goes over
      // everything above it, because it grew on top of all of it.
      float scenaCrustM = scenaCrustMask(vSurfWorldNormal, scenaLow);
      diffuseColor.rgb = mix(diffuseColor.rgb, uSurfCrustColor, scenaCrustM);
      float scenaWetM = scenaWetMask(vSurfWorldNormal, scenaLow, scenaMortar);
      float scenaPorous = (1.0 - clamp(metalness, 0.0, 1.0)) * clamp(roughness, 0.0, 1.0);
      diffuseColor.rgb *= mix(1.0, mix(0.93, 0.45, scenaPorous), scenaWetM);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
      roughnessFactor = clamp(roughnessFactor + (scenaN - 0.5) * uSurfRoughVar + uSurfGrain * scenaG * 0.12
        + scenaMortar * 0.25 + (scenaT.y - 0.5) * uSurfTileJitter * 0.3 * uSurfTile, 0.04, 1.0);
      roughnessFactor = clamp(roughnessFactor + (scenaSp - 0.5) * uSurfSpeck * 0.35
        + scenaSeam * 0.2, 0.04, 1.0);
      roughnessFactor = mix(roughnessFactor, uSurfCrustRough, scenaCrustM);
      roughnessFactor = mix(roughnessFactor, uSurfCapRough, scenaCapM);
      // A film of water is a mirror, whatever is underneath it.
      roughnessFactor = mix(roughnessFactor, 0.05, scenaWetM * 0.92);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
      // A mineral scab does not reflect like the metal it grew on, so where
      // the crust has taken hold the metal is simply not there any more.
      // This is the difference between patina and green paint.
      metalnessFactor = mix(metalnessFactor, 0.0, scenaCrustM);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
      {
        // three's perturbNormalArb, in view space, driven by the noise height
        // plus the tile relief (a step down into each mortar joint).
        // Standing water fills the micro-relief, so the bump flattens out
        // under it — the puddle is smooth even where the stone is not.
        float scenaH = (scenaN + uSurfGrain * scenaG * 0.5 + scenaT.z * uSurfTile * uSurfTileRelief
          + scenaRib * uSurfRibs * 0.9 + scenaC.y * uSurfCells * uSurfCellEdge * 0.5)
          * (1.0 - scenaWetM * 0.7);
        vec3 sX = dFdx(-vViewPosition);
        vec3 sY = dFdy(-vViewPosition);
        vec3 sN = normal;
        vec3 R1 = cross(sY, sN);
        vec3 R2 = cross(sN, sX);
        float det = dot(sX, R1);
        vec3 grad = sign(det) * (dFdx(scenaH) * R1 + dFdy(scenaH) * R2);
        normal = normalize(abs(det) * sN - uSurfBump * grad);
      }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      {
        // Procedural glow (lava cracks, crystal): drawn straight into the
        // emissive radiance, NOT via material.emissive — so it burns constant
        // and the day/night cycle (which scales emissiveIntensity) can't dim
        // it. A no-op when uSurfGlow == 0. Glow fills the low-noise areas.
        float scenaGlow = smoothstep(uSurfGlowThresh + 0.16, uSurfGlowThresh - 0.16, scenaLow) * uSurfGlow;
        totalEmissiveRadiance += uSurfGlowColor * scenaGlow;
      }`)}function jt(i,t={}){const e=K_[i],n={...e,...t},s=t.seed??0,r={color:t.color??e.baseColor??10132122,roughness:n.roughness,metalness:n.metalness,flatShading:n.flat},a=n.physical?new bf({...r,...n.sheen===void 0?{}:{sheen:n.sheen,sheenColor:new _t(n.sheenColor??16777215),sheenRoughness:n.sheenRough??.3},...n.anisotropy===void 0?{}:{anisotropy:n.anisotropy,anisotropyRotation:n.anisotropyRotation??0},...n.iridescence===void 0?{}:{iridescence:n.iridescence,iridescenceIOR:n.iridescenceIOR??1.3,iridescenceThicknessRange:n.iridescenceThickness??[100,400]},...n.transmission===void 0?{}:{transmission:n.transmission,thickness:n.thickness??.5,ior:n.ior??1.5,...n.dispersion?{dispersion:n.dispersion}:{},...n.attenuationColor===void 0?{}:{attenuationColor:new _t(n.attenuationColor),attenuationDistance:n.attenuationDistance??1}}}):new be(r),o={uSurfScale:{value:n.scale},uSurfAlbedoVar:{value:n.albedoVar},uSurfTint:{value:new _t(n.tint)},uSurfTintAmount:{value:n.tintAmount},uSurfAO:{value:n.ao},uSurfBump:{value:n.bump},uSurfRoughVar:{value:n.roughVar},uSurfGrain:{value:n.grain},uSurfGrainScale:{value:n.grainScale},uSurfGrainAxis:{value:n.grainAxis.clone().normalize()},uSurfSeed:{value:new I(Math.sin(s*12.9898)*43.75,Math.cos(s*78.233)*51.13,Math.sin(s*37.719)*29.41)},uSurfTile:{value:n.tile??0},uSurfTileSize:{value:new mt(n.tileW??.25,n.tileH??.1)},uSurfMortar:{value:n.mortar??.014},uSurfTileBond:{value:n.bond??1},uSurfTileRound:{value:n.round??0},uSurfTileJitter:{value:n.tileJitter??.12},uSurfMortarColor:{value:new _t(n.mortarColor??3815994)},uSurfTileRelief:{value:n.tileRelief??.06},uSurfTileTint:{value:n.tileTint??0},uSurfTileChevron:{value:n.chevron??0},uSurfTileMotif:{value:n.motif??0},uSurfCap:{value:n.cap??0},uSurfCapColor:{value:new _t(n.capColor??15922938)},uSurfCapUp:{value:n.capUp??.5},uSurfCapSharp:{value:n.capSharp??.28},uSurfCapRough:{value:n.capRough??.88},uSurfGlow:{value:n.glow??0},uSurfGlowColor:{value:new _t(n.glowColor??16738858)},uSurfGlowThresh:{value:n.glowThreshold??.45},uSurfWet:{value:n.wet??0},uSurfWetCling:{value:n.wetCling??.55},uSurfRibs:{value:n.ribs??0},uSurfRibScale:{value:n.ribScale??8},uSurfRibTurn:{value:n.ribTurn??0},uSurfRibCross:{value:n.ribCross??0},uSurfSpeck:{value:n.speck??0},uSurfSpeckScale:{value:n.speckScale??40},uSurfCells:{value:n.cells??0},uSurfCellScale:{value:n.cellScale??4},uSurfCellEdge:{value:n.cellEdge??.4},uSurfCellJitter:{value:n.cellJitter??.18},uSurfCellPlan:{value:n.cellPlan??0},uSurfCrust:{value:n.crust??0},uSurfCrustColor:{value:new _t(n.crustColor??5220490)},uSurfCrustRough:{value:n.crustRough??.9}};a.onBeforeCompile=c=>{Object.assign(c.uniforms,o),c.vertexShader=Z_(c.vertexShader),c.fragmentShader=Q_(c.fragmentShader),a.userData.scenaShader=c};const l=n.physical?"scena-surface-v5-physical":"scena-surface-v5";return a.customProgramCacheKey=()=>l,a.userData.scenaSurface=o,a}var jh=7;function Ot(i,...t){return{advance:i,strokes:t.map(e=>e.flat())}}var gs=(i,t)=>[[i-.25,t],[i+.25,t],[i+.25,t+.5],[i-.25,t+.5],[i-.25,t]],ko={" ":Ot(3),A:Ot(6,[[0,0],[2.75,7],[5.5,0]],[[1.15,2.6],[4.35,2.6]]),B:Ot(5.6,[[0,0],[0,7]],[[0,7],[3.5,7],[4.6,6.2],[4.6,4.7],[3.5,3.9],[0,3.9]],[[0,3.9],[3.9,3.9],[5,3],[5,.9],[3.9,0],[0,0]]),C:Ot(5.6,[[5.2,5.4],[4.1,6.7],[2.2,7],[.7,5.9],[0,4],[0,3],[.7,1.1],[2.2,0],[4.1,.3],[5.2,1.6]]),D:Ot(5.8,[[0,0],[0,7]],[[0,7],[2.8,7],[4.6,5.7],[5.2,3.5],[4.6,1.3],[2.8,0],[0,0]]),E:Ot(5.2,[[5,7],[0,7],[0,0],[5,0]],[[0,3.5],[3.6,3.5]]),F:Ot(5,[[5,7],[0,7],[0,0]],[[0,3.5],[3.4,3.5]]),G:Ot(6,[[5.2,5.4],[4.1,6.7],[2.2,7],[.7,5.9],[0,4],[0,3],[.7,1.1],[2.2,0],[4.2,.2],[5.2,1.4],[5.2,3],[3.2,3]]),H:Ot(5.6,[[0,0],[0,7]],[[5.4,0],[5.4,7]],[[0,3.6],[5.4,3.6]]),I:Ot(2,[[1,0],[1,7]]),J:Ot(4.6,[[4,7],[4,1.7],[3.2,.3],[1.9,0],[.7,.7],[0,2]]),K:Ot(5.4,[[0,0],[0,7]],[[5.2,7],[0,3.2]],[[1.7,4.3],[5.4,0]]),L:Ot(4.8,[[0,7],[0,0],[4.8,0]]),M:Ot(6.6,[[0,0],[0,7],[3.3,2.4],[6.6,7],[6.6,0]]),N:Ot(5.8,[[0,0],[0,7],[5.6,0],[5.6,7]]),O:Ot(6,[[2.3,7],[.8,6.1],[0,4],[0,3],[.8,.9],[2.3,0],[3.3,0],[4.8,.9],[5.6,3],[5.6,4],[4.8,6.1],[3.3,7],[2.3,7]]),P:Ot(5.4,[[0,0],[0,7]],[[0,7],[3.7,7],[4.8,6],[4.8,4.5],[3.7,3.6],[0,3.6]]),Q:Ot(6,[[2.3,7],[.8,6.1],[0,4],[0,3],[.8,.9],[2.3,0],[3.3,0],[4.8,.9],[5.6,3],[5.6,4],[4.8,6.1],[3.3,7],[2.3,7]],[[3.4,1.9],[5.8,-.5]]),R:Ot(5.6,[[0,0],[0,7]],[[0,7],[3.7,7],[4.8,6],[4.8,4.5],[3.7,3.6],[0,3.6]],[[2.7,3.6],[5.4,0]]),S:Ot(5.2,[[5,5.6],[3.9,6.8],[1.7,7],[.5,6],[.5,4.7],[1.5,3.9],[3.7,3.4],[4.7,2.6],[4.7,1],[3.5,0],[1.2,.2],[.2,1.4]]),T:Ot(5,[[0,7],[5,7]],[[2.5,7],[2.5,0]]),U:Ot(5.6,[[0,7],[0,2],[.8,.5],[2.6,0],[4.6,.5],[5.4,2],[5.4,7]]),V:Ot(5.6,[[0,7],[2.8,0],[5.6,7]]),W:Ot(7.4,[[0,7],[1.4,0],[3.7,5],[6,0],[7.4,7]]),X:Ot(5.4,[[0,0],[5.4,7]],[[0,7],[5.4,0]]),Y:Ot(5.4,[[0,7],[2.7,3.5],[5.4,7]],[[2.7,3.5],[2.7,0]]),Z:Ot(5.2,[[0,7],[5.2,7],[0,0],[5.2,0]]),0:Ot(5.4,[[2.1,7],[.7,6],[0,3.5],[.7,1],[2.1,0],[3.3,0],[4.7,1],[5.4,3.5],[4.7,6],[3.3,7],[2.1,7]],[[.9,1.3],[4.5,5.7]]),1:Ot(4,[[1,5.4],[2.6,7],[2.6,0]],[[.9,0],[4.2,0]]),2:Ot(5.2,[[.4,5.4],[1.1,6.5],[2.6,7],[4,6.7],[4.7,5.6],[4.6,4.3],[3.7,3.1],[.3,0],[5,0]]),3:Ot(5.2,[[.5,6.2],[2,7],[3.7,7],[4.7,6],[4.7,4.8],[3.6,3.8],[2.4,3.8]],[[3.6,3.8],[4.9,2.8],[4.9,1.1],[3.7,0],[1.8,0],[.3,1]]),4:Ot(5.2,[[3.7,0],[3.7,7],[0,2.4],[5,2.4]]),5:Ot(5.2,[[4.7,7],[.9,7],[.5,3.9],[1.6,4.5],[3.5,4.5],[4.7,3.5],[4.7,1.4],[3.5,.1],[1.6,.1],[.4,1.2]]),6:Ot(5.2,[[4.5,6],[3.1,7],[1.6,6.6],[.6,4.8],[.3,2.6],[.9,.8],[2.2,0],[3.6,.3],[4.6,1.5],[4.6,2.9],[3.6,4],[1.9,4.2],[.6,3.2]]),7:Ot(5.2,[[.4,7],[5,7],[2,0]]),8:Ot(5.4,[[2.6,3.8],[1.3,4.5],[1.3,5.9],[2.6,7],[3.9,7],[5.1,5.9],[5.1,4.5],[3.9,3.8],[2.6,3.8]],[[2.6,3.8],[1,3],[.5,1.6],[1.6,.2],[3.6,.2],[4.7,1.6],[4.2,3],[2.6,3.8]]),9:Ot(5.2,[[.7,1],[2.1,0],[3.6,.4],[4.6,2.2],[4.9,4.4],[4.3,6.2],[3,7],[1.6,6.7],[.6,5.5],[.6,4.1],[1.6,3],[3.3,2.8],[4.6,3.8]]),".":Ot(2,gs(.5,0)),",":Ot(2,[[.9,.6],[.9,0],[.2,-1]]),"'":Ot(2,[[.6,7],[.6,5.3]]),'"':Ot(3,[[.6,7],[.6,5.3]],[[1.9,7],[1.9,5.3]]),"!":Ot(2,[[.5,7],[.5,2]],gs(.5,0)),"?":Ot(4.8,[[.4,5.6],[1.1,6.6],[2.5,7],[3.7,6.6],[4.3,5.5],[4.1,4.3],[2.4,3.2],[2.4,2]],gs(2.4,0)),"-":Ot(4,[[.5,3.5],[3.5,3.5]]),"&":Ot(6,[[5.6,0],[2,3.6],[1,4.8],[1,5.9],[1.9,6.8],[3.1,6.6],[3.5,5.5],[3,4.4],[.6,1.6],[1.6,.1],[3.2,.1],[4.6,1.4],[5.2,2.9]]),":":Ot(2,gs(.5,3.9),gs(.5,.9)),"/":Ot(4,[[0,-.5],[3.6,7.2]]),"(":Ot(2.8,[[2.2,7.4],[.7,5],[.7,2],[2.2,-.4]]),")":Ot(2.8,[[.4,7.4],[1.9,5],[1.9,2],[.4,-.4]])},j_=ko[" "];function tu(i){return ko[i]??ko[i.toUpperCase()]??j_}function eu(i,t){let e=0;for(let n=0;n<i.length;n++)e+=tu(i[n]).advance+(n<i.length-1?t:0);return e}function vl(i,t={}){const e=t.size??.5,n=t.weight??.22,s=t.depth??e*.12,r=t.tracking??.6,a=t.align??"center",o=t.baseline??"center",l=e/jh,c=n*e/2,d=eu(i,r)*l,u=a==="center"?-d/2:a==="right"?-d:0,f=o==="center"?-e/2:0,p=[],v=[];let m=0;const g=(x,A)=>{const M=x.length/2;if(M<2)return;const T=new Float64Array(M),_=new Float64Array(M);for(let V=0;V<M;V++)T[V]=x[V*2]*l+A,_[V]=x[V*2+1]*l+f;const E=T[1]-T[0],P=_[1]-_[0],C=Math.hypot(E,P)||1e-6;T[0]-=E/C*c,_[0]-=P/C*c;const L=T[M-1]-T[M-2],B=_[M-1]-_[M-2],H=Math.hypot(L,B)||1e-6;T[M-1]+=L/H*c,_[M-1]+=B/H*c;const O=new Float64Array(M-1),X=new Float64Array(M-1);for(let V=0;V<M-1;V++){const K=T[V+1]-T[V],it=_[V+1]-_[V],lt=Math.hypot(K,it)||1e-6;O[V]=K/lt,X[V]=it/lt}for(let V=0;V<M;V++){const K=V===0?0:V-1,it=V===M-1?M-2:V;let lt=-X[K]-X[it],Et=O[K]+O[it],oe=Math.hypot(lt,Et);oe<1e-6&&(lt=-X[it],Et=O[it],oe=1),lt/=oe,Et/=oe;const Ht=c/Math.max(.35,lt*-X[it]+Et*O[it]),Z=T[V]+lt*Ht,st=_[V]+Et*Ht,nt=T[V]-lt*Ht,Nt=_[V]-Et*Ht;p.push(nt,Nt,s,Z,st,s,nt,Nt,0,Z,st,0)}const D=(V,K)=>m+V*4+K;for(let V=0;V<M-1;V++){const K=V+1;v.push(D(V,0),D(K,0),D(K,1),D(V,0),D(K,1),D(V,1)),v.push(D(V,2),D(K,3),D(K,2),D(V,2),D(V,3),D(K,3)),v.push(D(V,0),D(V,2),D(K,2),D(V,0),D(K,2),D(K,0)),v.push(D(V,1),D(K,3),D(V,3),D(V,1),D(K,1),D(K,3))}const q=M-1;v.push(D(0,0),D(0,1),D(0,3),D(0,0),D(0,3),D(0,2)),v.push(D(q,0),D(q,2),D(q,3),D(q,0),D(q,3),D(q,1)),m+=M*4};let b=0;for(let x=0;x<i.length;x++){const A=tu(i[x]),M=b*l+u;for(const T of A.strokes)g(T,M);b+=A.advance+r}const S=new le;return S.setAttribute("position",new Qt(new Float32Array(p),3)),S.setIndex(v),S.computeVertexNormals(),S.computeBoundingBox(),S.computeBoundingSphere(),{geometry:S,width:d,height:e}}function xl(i,t={}){const e=t.size??.5,n=t.tracking??.6;return eu(i,n)*(e/jh)}function me(i){return new be({color:i,flatShading:!0})}function ke(i,t,e){return new _t(i).lerp(new _t(t),e).getHex()}function tv(i,t,e,n,s,r){const o=e/7;let l=0;for(let c=0;c<7;c++){const h=c/7,d=n+(s-n)*h,u=n+(s-n)*((c+1)/7);l=r*h*h;const f=new k(new xt(u,d,o*1.04,6),t);f.position.set(l,o*(c+.5),0),f.rotation.z=-r*.12,i.add(f)}return{x:r,y:e}}function ev(i,t,e,n,s,r,a,o){const l=o*Math.PI/180;for(let c=0;c<r;c++){const h=c/r*Math.PI*2+e.range(-.12,.12),d=new Zt,u=a*.13,f=new k(new Ln(u,a,4),t);f.rotation.z=-Math.PI/2,f.position.x=a*.5,f.scale.z=.28,d.add(f),d.position.set(n,s,0),d.rotation.y=h,d.rotation.z=-(l+e.range(-.14,.14)),i.add(d)}}function nv(i,t,e,n,s,r,a,o){for(let l=0;l<r;l++){const c=l/r*Math.PI*2+e.range(-.12,.12),h=s*e.range(.78,1.02),d=Math.min(e.range(a,o),n-.4);if(d<=.3)continue;const u=new k(new kt(.12,d,.12),t);u.position.set(Math.cos(c)*h,n-d/2,Math.sin(c)*h),u.rotation.y=-c,u.rotation.z=e.range(-.08,.08),i.add(u)}}function iv(i,t,e,n,s,r){for(let a=0;a<s;a++){const o=a/s*Math.PI*2+e.range(-.25,.25),l=new k(new xt(.025,.055,r,5),t);l.position.set(Math.cos(o)*r*.28,n+r*.34,Math.sin(o)*r*.28),l.rotation.set(-Math.sin(o)*.7,0,Math.cos(o)*.7),i.add(l)}}function sv(i,t,e,n,s,r){const a=new k(new xt(r,s,n,9),t);a.position.y=n/2,i.add(a);const o=6;for(let l=0;l<o;l++){const c=l/o*Math.PI*2,h=new k(new Ln(s*.5,n*.16,4),t);h.position.set(Math.cos(c)*s*.65,n*.05,Math.sin(c)*s*.65),h.rotation.set(-Math.sin(c)*.35,0,Math.cos(c)*.35),h.scale.z=.5,i.add(h)}}function rv(i,t,e,n,s){const r=n*.68,a=new k(new xt(s*.62,s,r*.66,8),t);a.position.y=r*.33,i.add(a);const o=new k(new xt(s*.28,s*.62,r*.34,8),t);o.position.y=r*.66+r*.17,i.add(o);const l=e.int(3,5);for(let c=0;c<l;c++){const h=c/l*Math.PI*2+e.range(-.2,.2),d=new k(new xt(.05,.11,n*.22,5),t);d.position.set(Math.cos(h)*s*.3,r+n*.06,Math.sin(h)*s*.3),d.rotation.set(-Math.sin(h)*.9,0,Math.cos(h)*.9),i.add(d)}return r+n*.12}function av(i,t,e,n,s,r){for(let a=0;a<r;a++){const o=a/r*Math.PI*2+e.range(-.2,.2),l=s*e.range(.45,1),c=n-.02,h=new k(new xt(e.range(.04,.08),e.range(.07,.13),c,5),t);h.position.set(Math.cos(o)*l,c/2,Math.sin(o)*l),h.rotation.z=e.range(-.06,.06),h.rotation.x=e.range(-.06,.06),i.add(h)}}var ov={pine:{heightRange:[3.2,5.2],stiffness:2.4,anchorFrac:.22,obstacleRadius:.5,build(i,t,e,n){const s=me(e.trunk),r=me(t.pick(e.foliage)),a=n*.25,o=new k(new xt(.09,.14,a,6),s);o.position.y=a/2,i.add(o);const l=t.int(3,4);let c=a,h=n*t.range(.24,.3);const d=(n-a)/l+.15;for(let u=0;u<l;u++){const f=new k(new Ln(h,d*1.35,7),r);f.position.y=c+d*.55,f.rotation.y=t.range(0,Math.PI),i.add(f),c+=d*.8,h*=.72}return r}},oak:{heightRange:[3.2,5.2],stiffness:2.4,anchorFrac:.22,obstacleRadius:.6,build(i,t,e,n){const s=me(e.trunk),r=me(t.pick(e.foliage)),a=n*.45,o=new k(new xt(.12,.2,a,6),s);o.position.y=a/2,o.rotation.z=t.range(-.08,.08),i.add(o);const l=t.int(2,4);for(let c=0;c<l;c++){const h=n*t.range(.18,.28),d=new k(new De(h,0),r);d.position.set(t.jitter(0,n*.16),a+h*t.range(.5,.9)+c*h*.35,t.jitter(0,n*.16)),d.rotation.set(t.range(0,Math.PI),t.range(0,Math.PI),0),i.add(d)}return r}},cypress:{heightRange:[6,10],stiffness:3.4,anchorFrac:.32,obstacleRadius:.35,build(i,t,e,n){const s=me(e.trunk),r=me(ke(t.pick(e.foliage),1194532,.5)),a=n*.14,o=new k(new xt(.07,.11,a,6),s);o.position.y=a/2,i.add(o);const l=n*.075,c=a*.6,h=n-c,d=Math.max(7,Math.round(h/(l*1.4))),u=h/d;for(let p=0;p<d;p++){const v=p/(d-1),m=Math.max(.05,l*(.55+.7*Math.pow(1-v,.8))*(.6+.4*Math.sin(v*Math.PI))),g=new k(new De(m,0),r);g.position.set(t.jitter(0,l*.12),c+p*u+u*.5,t.jitter(0,l*.12)),g.scale.y=1.5,g.rotation.set(t.range(0,Math.PI),t.range(0,Math.PI),t.range(0,Math.PI)),i.add(g)}const f=new k(new Ln(l*.7,h*.22,6),r);return f.position.y=c+h+h*.02,i.add(f),r}},birch:{heightRange:[4,7],stiffness:1.5,anchorFrac:.45,obstacleRadius:.32,build(i,t,e,n){const s=me(15131350),r=me(4867390),a=me(ke(t.pick(e.foliage),13821594,.4)),o=n*.72,l=new k(new xt(.05,.08,o,6),s);l.position.y=o/2,l.rotation.z=t.range(-.04,.04),i.add(l);const c=t.int(2,4);for(let u=0;u<c;u++){const f=new k(new xt(.076,.076,.05,6),r);f.position.y=t.range(o*.15,o*.8),i.add(f)}const h=o*.85,d=t.int(3,5);for(let u=0;u<d;u++){const f=n*t.range(.12,.19),p=new k(new De(f,0),a);p.position.set(t.jitter(0,n*.14),h+t.range(0,n*.22),t.jitter(0,n*.14)),p.rotation.set(t.range(0,Math.PI),t.range(0,Math.PI),0),i.add(p)}return a}},cedar:{heightRange:[4,6],stiffness:2.8,anchorFrac:.3,obstacleRadius:.75,build(i,t,e,n){const s=me(e.trunk),r=me(ke(t.pick(e.foliage),3828568,.45)),a=n*.32,o=new k(new xt(.13,.22,a,6),s);o.position.y=a/2,i.add(o);const l=t.int(3,4),c=a*.8,h=n-c,d=n*t.range(.4,.5);for(let u=0;u<l;u++){const f=l>1?u/(l-1):0,p=d*(1-f*.45),v=new k(new De(p,0),r);v.position.set(t.jitter(0,d*.1),c+f*h*.9,t.jitter(0,d*.1)),v.scale.y=.3,v.rotation.y=t.range(0,Math.PI),i.add(v)}return r}},maple:{heightRange:[3.5,5.5],stiffness:2.2,anchorFrac:.24,obstacleRadius:.65,build(i,t,e,n){const s=me(e.trunk),r=me(ke(t.pick(e.foliage),8824890,.2)),a=n*.4,o=new k(new xt(.12,.19,a,6),s);o.position.y=a/2,o.rotation.z=t.range(-.05,.05),i.add(o);const l=a+n*.12,c=n*t.range(.28,.34),h=new k(new De(c,1),r);h.position.y=l,h.rotation.set(t.range(0,Math.PI),t.range(0,Math.PI),0),i.add(h);const d=t.int(4,6);for(let u=0;u<d;u++){const f=u/d*Math.PI*2+t.range(-.2,.2),p=c*t.range(.55,.75),v=new k(new De(p,0),r);v.position.set(Math.cos(f)*c*.75,l-c*.15+t.range(-.1,.2),Math.sin(f)*c*.75),v.rotation.set(t.range(0,Math.PI),t.range(0,Math.PI),0),i.add(v)}return r}},sakura:{heightRange:[3,4.6],stiffness:2,anchorFrac:.3,obstacleRadius:.7,build(i,t,e,n,s){const r=s??"spring",a=me(ke(e.trunk,3023648,.4)),o=n*.4,l=new k(new xt(.1,.16,o,6),a);l.position.y=o/2,l.rotation.z=t.range(-.06,.06),i.add(l),iv(i,a,t,o,t.int(4,6),n*.5);const c=r==="summer"?ke(t.pick(e.foliage),8368202,.2):r==="autumn"?ke(t.pick(e.foliage),14715450,.7):ke(15974870,16640753,t.range(0,.4)),h=me(c);if(r!=="winter"){const d=o+n*.16,u=n*t.range(.34,.4),f=new k(new De(u,1),h);f.position.y=d,f.scale.y=.55,i.add(f);const p=t.int(5,7);for(let v=0;v<p;v++){const m=v/p*Math.PI*2+t.range(-.2,.2),g=u*t.range(.5,.72),b=new k(new De(g,0),h);b.position.set(Math.cos(m)*u*.8,d-u*.1+t.range(-.05,.1),Math.sin(m)*u*.8),b.scale.y=.6,i.add(b)}}return h}},palm:{heightRange:[5,8],stiffness:1.2,anchorFrac:.7,obstacleRadius:.4,build(i,t,e,n){const s=me(ke(10255182,e.trunk,.3)),r=tv(i,s,n*.86,.16,.1,n*.12),a=me(ke(t.pick(e.foliage),5148474,.3));ev(i,a,t,r.x,r.y,t.int(9,13),n*.42,24);const o=me(7031343),l=t.int(2,4);for(let c=0;c<l;c++){const h=c/l*Math.PI*2,d=new k(new De(n*.045,0),o);d.position.set(r.x+Math.cos(h)*.12,r.y-.12,Math.sin(h)*.12),i.add(d)}return a}},willow:{heightRange:[4,6],stiffness:1.5,anchorFrac:.05,obstacleRadius:.7,build(i,t,e,n){const s=me(e.trunk),r=n*.42,a=new k(new xt(.12,.2,r,6),s);a.position.y=r/2,a.rotation.z=t.range(-.05,.05),i.add(a);const o=me(ke(t.pick(e.foliage),11980654,.4)),l=r+n*.22,c=n*t.range(.32,.4),h=new k(new De(c,1),o);return h.position.y=l,h.scale.y=.7,i.add(h),nv(i,o,t,l-c*.35,c*.95,t.int(30,38),n*.42,n*.72),o}},sequoia:{heightRange:[22,32],stiffness:4,anchorFrac:.5,obstacleRadius:i=>i*.06,build(i,t,e,n){const s=me(9063218),r=me(ke(t.pick(e.foliage),2050612,.5)),a=n*.075;sv(i,s,t,n*.55,a,a*.4);const o=t.int(5,7);let l=n*.42,c=n*t.range(.16,.2);const h=(n-l)/o+.4;for(let d=0;d<o;d++){const u=new k(new Ln(c,h*1.4,8),r);u.position.y=l+h*.55,u.rotation.y=t.range(0,Math.PI),i.add(u),l+=h*.82,c*=.74}return r}},banyan:{heightRange:[5,8],stiffness:3,anchorFrac:.3,obstacleRadius:i=>i*.3,build(i,t,e,n){const s=me(ke(e.trunk,4862752,.3)),r=me(ke(t.pick(e.foliage),1923642,.35)),a=n*.4,o=new k(new xt(n*.09,n*.15,a,8),s);o.position.y=a/2,i.add(o);const l=a+n*.2,c=n*t.range(.5,.62),h=new k(new De(c,1),r);h.position.y=l,h.scale.y=.62,i.add(h);const d=t.int(6,9);for(let u=0;u<d;u++){const f=u/d*Math.PI*2+t.range(-.15,.15),p=c*t.range(.45,.65),v=new k(new De(p,0),r);v.position.set(Math.cos(f)*c*.85,l-c*.12+t.range(-.1,.15),Math.sin(f)*c*.85),v.scale.y=.7,i.add(v)}return av(i,s,t,l-c*.3,c*.7,t.int(7,11)),r}},baobab:{heightRange:[5,8],stiffness:3.5,anchorFrac:.55,obstacleRadius:i=>i*.16,build(i,t,e,n){const s=me(ke(e.trunk,9405042,.5)),r=me(ke(t.pick(e.foliage),7309882,.3)),a=rv(i,s,t,n,n*.19),o=t.int(4,6);for(let l=0;l<o;l++){const c=l/o*Math.PI*2+t.range(-.3,.3),h=n*t.range(.12,.18),d=new k(new De(h,0),r);d.position.set(Math.cos(c)*n*.22,a+t.range(0,n*.1),Math.sin(c)*n*.22),d.scale.y=.7,i.add(d)}return r}},acacia:{heightRange:[4,6],stiffness:2.5,anchorFrac:.4,obstacleRadius:.5,build(i,t,e,n){const s=me(ke(e.trunk,6967344,.3)),r=me(ke(t.pick(e.foliage),9412682,.35)),a=n*.62,o=new k(new xt(.06,.13,a,6),s);o.position.y=a/2,o.rotation.z=t.range(-.05,.05),i.add(o);const l=a+n*.08,c=n*t.range(.5,.6),h=t.int(3,4);for(let d=0;d<h;d++){const u=c*(1-d*.16),f=new k(new De(u,0),r);f.position.set(t.jitter(0,c*.12),l+d*n*.05,t.jitter(0,c*.12)),f.scale.y=.22,f.rotation.y=t.range(0,Math.PI),i.add(f)}return r}}};function lv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.species??i.style??(t.next()<.6?"pine":"oak"),s=ov[n],r=i.height??t.range(s.heightRange[0],s.heightRange[1]),a=new Zt;a.name=`tree-${n}`;const o=s.build(a,t,e,r,i.season);(o.userData??(o.userData={})).scenaFoliage=!0,i.wind&&(i.wind.bind(o,{height:r,stiffness:s.stiffness,anchor:r*s.anchorFrac}),i.wind.attach(a));const l=typeof s.obstacleRadius=="function"?s.obstacleRadius(r):s.obstacleRadius;return{object:a,obstacleRadius:l}}function cv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.size??t.range(.4,1.1),s=new De(n,0),r=s.getAttribute("position"),a=new Map;for(let c=0;c<r.count;c++){const h=`${r.getX(c).toFixed(4)},${r.getY(c).toFixed(4)},${r.getZ(c).toFixed(4)}`;let d=a.get(h);d||(d=[t.jitter(0,n*.22),t.jitter(0,n*.16),t.jitter(0,n*.22)],a.set(h,d)),r.setXYZ(c,r.getX(c)+d[0],Math.max(r.getY(c)+d[1],-n*.15),r.getZ(c)+d[2])}s.computeVertexNormals();const o=new k(s,jt("stone",{color:t.pick(e.rock),seed:i.seed??1}));o.position.y=n*.15,o.scale.y=t.range(.6,.9);const l=new Zt;return l.name="rock",l.add(o),{object:l,obstacleRadius:n*1.05}}function nu(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.size??1,s=i.weathering??.3,r=new Zt;r.name="crate";const a=jt("plank",{color:e.wood,seed:i.seed??1});a.color.offsetHSL(0,0,-t.range(0,s*.18));const o=jt("wood",{color:e.woodDark,seed:(i.seed??1)+3}),l=new k(new kt(n*.92,n*.92,n*.92),a);l.position.y=n/2,r.add(l);const c=n*.12,h=n*1;for(const d of[c/2,n-c/2])for(const[u,f,p,v]of[[0,n/2-c/2,h,c],[0,-(n/2-c/2),h,c],[n/2-c/2,0,c,h],[-(n/2-c/2),0,c,h]]){const m=new k(new kt(p,c,v),o);m.position.set(u,d,f),r.add(m)}for(const d of[-1,1])for(const u of[-1,1]){const f=new k(new kt(c,n,c),o);f.position.set(d*(n/2-c/2),n/2,u*(n/2-c/2)),r.add(f)}return r.rotation.y=t.range(0,Math.PI/2),{object:r,obstacleRadius:n*.75,carry:"crate",grip:{y:-n/2,z:n/2}}}function hv(i={}){const t=i.seed??1,e=i.palette??Re,n=.86,s=.32,r=jt("wood",{color:i.color??e.wood,seed:t}),a=jt("steel",{seed:t+1}),o=new Zt;o.name="barrel";const l=new k(new xt(s*.86,s*.86,n,14),r);l.position.y=n/2;const c=new k(new xt(s,s,n*.5,14),r);c.position.y=n/2,o.add(l,c);for(const h of[n*.16,n*.5,n*.84]){const d=new k(new Xn(s*(h===n*.5?1.02:.9),.022,6,16),a);d.rotation.x=Math.PI/2,d.position.y=h,o.add(d)}return{object:o,obstacleRadius:s*1.1,carry:"crate",grip:{y:-n/2,z:s}}}function uv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.length??6,s=i.postSpacing??1.5,r=i.height??1.1,a=new Zt;a.name="fence";const o=new be({color:e.woodDark,flatShading:!0}),l=new be({color:e.wood,flatShading:!0}),c=Math.max(2,Math.round(n/s)+1),h=n/(c-1);for(let d=0;d<c;d++){const u=new k(new xt(.06,.075,r,5),o);u.position.set(-n/2+d*h,r/2,t.jitter(0,.03)),u.rotation.z=t.range(-.04,.04),a.add(u)}for(const d of[r*.55,r*.85]){const u=new k(new kt(n,.07,.05),l);u.position.y=t.jitter(d,.02),u.rotation.x=t.range(-.02,.02),a.add(u)}return{object:a,obstacleRadius:n/2}}function iu(i,t,e){const n=i/2,s=e/2,r=new Float32Array([-n,0,s,n,0,s,0,t,s,n,0,-s,-n,0,-s,0,t,-s,-n,0,-s,-n,0,s,0,t,s,-n,0,-s,0,t,s,0,t,-s,n,0,s,n,0,-s,0,t,-s,n,0,s,0,t,-s,0,t,s,-n,0,-s,n,0,-s,n,0,s,-n,0,-s,n,0,s,-n,0,s]),a=new le;return a.setAttribute("position",new Qt(r,3)),a.computeVertexNormals(),a}var dv=["plaster","plaster","plaster","brick","ashlar"],fv=["tile","tile","shingle","thatch"];function pv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.width??t.range(3.2,4.2),s=i.depth??n*t.range(.75,.9),r=i.wallHeight??t.range(2.1,2.4),a=new Zt;a.name="house";const o=i.seed??1,l=i.wall??t.pick(dv),c=i.roof??t.pick(fv),h=l==="brick"?10373684:l==="ashlar"?e.rock[0]:e.wall,d=jt(l,{color:h,seed:o});d.color.offsetHSL(0,0,t.range(-.03,.03));const u=c==="thatch"?11770460:c==="shingle"?e.woodDark:e.roof,f=jt(c,{color:u,seed:o+7});f.color.offsetHSL(0,0,t.range(-.04,.04));const p=jt("stone",{color:e.rock[0],seed:o+13}),v=jt("plank",{color:e.woodDark,seed:o+21}),m=new k(new kt(n+.3,1.6,s+.3),p);m.position.y=-.55,a.add(m);const g=new k(new kt(n,r,s),d);g.position.y=r/2,a.add(g);const b=n*t.range(.32,.4),S=new k(iu(n+.5,b,s+.6),f);S.position.y=r-.02,a.add(S);const x=new k(new kt(.34,b+.8,.34),p);x.position.set(t.pick([-1,1])*n*.22,r+b*.45,s*.12),a.add(x);const A=new k(new kt(.85,1.5,.08),v);A.position.set(t.range(-.4,.4),.75,s/2+.02),a.add(A);const M=new be({color:e.lampGlow,emissive:e.lampGlow,emissiveIntensity:1}),T=new kt(.6,.62,.08),_=new k(T,M);_.position.set(A.position.x<0?n*.28:-n*.28,1.35,s/2+.02),a.add(_);for(const E of[-1,1]){if(t.next()<.35)continue;const P=new k(T,M);P.position.set(E*(n/2+.02),1.35,t.range(-.3,.3)*s),P.rotation.y=Math.PI/2,a.add(P)}return{object:a,obstacleRadius:Math.hypot(n+.5,s+.5)/2}}function mv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=new Zt;n.name="well";const s=i.seed??1,r=jt("stone",{color:t.pick(e.rock),seed:s,cap:.4,capColor:4479534,capUp:.5}),a=jt("wood",{color:e.woodDark,seed:s+5}),o=jt("tile",{color:e.roof,seed:s+11}),l=new k(new xt(.85,.95,.75,10),r);l.position.y=.375,n.add(l);const c=new k(new xt(.62,.62,.05,10),new be({color:1450542}));c.position.y=.76,n.add(c);for(const p of[-1,1]){const v=new k(new xt(.06,.075,1.9,5),a);v.position.set(p*.72,.95,0),n.add(v)}const h=new k(new xt(.045,.045,1.5,5),a);h.rotation.z=Math.PI/2,h.position.y=1.72,n.add(h);const d=new k(iu(2,.55,.65),o);d.position.y=1.86,d.rotation.y=Math.PI/2,n.add(d);const u=new k(new xt(.012,.012,.6,4),a);u.position.y=1.42,n.add(u);const f=new k(new xt(.13,.1,.2,7),a);return f.position.y=1.05,n.add(f),{object:n,obstacleRadius:1}}var La=[11876143,3104680,4160074,13208111,8011626,3116938],gv=15260864,_v=[12597547,14713132,10138927,8011626,14729788,13654575],vv=[13081179,11896138,14201975],xv=["produce","pottery","bakery","textiles"];function yv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.goods??t.pick(xv),r=i.clothColor??t.pick(La),a=new Zt;a.name="stall";const o=jt("wood",{color:e.woodDark,seed:n}),l=jt("plank",{color:e.wood,seed:n+3}),c=new be({color:r,roughness:.95,flatShading:!0}),h=new be({color:gv,roughness:.95,flatShading:!0}),d=2.6,u=1.7,f=2.5,p=2.05;for(const D of[-1,1])for(const q of[-1,1]){const V=q<0?f:p,K=new k(new xt(.055,.07,V,6),o);K.position.set(D*(d/2-.1),V/2,q*(u/2-.1)),a.add(K)}const v=.32,m=-u/2+.05,g=u/2+v,b=g-m,S=p+.06-(f+.06),x=Math.hypot(b,S),A=Math.atan2(f-p,b),M=(m+g)/2,T=(f+p)/2+.06,_=11,E=(d+.5)/_;for(let D=0;D<_;D++){const q=new k(new kt(E*.97,.04,x),D%2===0?c:h);q.position.set(-1.55+E*(D+.5),T,M),q.rotation.x=A,a.add(q);const V=new k(new kt(E*.97,.2,.03),D%2===0?c:h);V.position.set(q.position.x,p-.04,g),a.add(V)}const P=new Zt,C=new k(new kt(d-.1,.09,.62),l);C.position.set(0,.96,u/2-.42),P.add(C);const L=new k(new kt(d-.1,.5,.05),l);L.position.set(0,.68,u/2-.12),P.add(L),a.add(P);const B=new k(new kt(d-.3,.07,.28),l);B.position.set(0,1.45,-u/2+.22),a.add(B);const H=1.05,O=d-.7,X=D=>Array.from({length:D},(q,V)=>-O/2+O*(V+.5)/D+t.jitter(0,.05));if(s==="produce")for(const D of X(3))a.add(qc(t,D,H,u/2-.42,e,n)),bv(t,D,H+.16,u/2-.42).forEach(q=>a.add(q));else if(s==="bakery")for(const D of X(3)){a.add(qc(t,D,H,u/2-.42,e,n));for(let q=0;q<t.int(3,5);q++){const V=new k(Mv(),br(t.pick(vv)));V.position.set(D+t.jitter(0,.09),H+.17,u/2-.42+t.jitter(0,.09)),V.rotation.y=t.range(0,Math.PI),a.add(V)}}else if(s==="pottery"){const D=jt("tile",{color:11887167,seed:n+5});for(const q of X(4))a.add(Yc(t,q,H,u/2-.42,D));for(let q=0;q<t.int(2,3);q++){const V=t.range(1.6,2.3),K=Yc(t,t.pick([-1,1])*(d/2+t.range(.2,.5)),0,t.range(-.3,.5),D);K.scale.setScalar(V),a.add(K)}}else{for(const D of X(3)){let q=H;for(let V=0,K=t.int(2,4);V<K;V++){const it=new k(new kt(.5,.12,.42),br(t.pick(La)));it.position.set(D+t.jitter(0,.04),q+.06,u/2-.42),it.rotation.y=t.jitter(0,.08),a.add(it),q+=.13}}for(let D=0;D<2;D++){const q=new k(new xt(.11,.11,.5,8),br(t.pick(La)));q.rotation.z=Math.PI/2,q.position.set(t.range(-O/2,O/2),1.52,-u/2+.22),a.add(q)}}return{object:a,obstacleRadius:Math.hypot(d,u)/2}}function br(i){return new be({color:i,roughness:.85,flatShading:!0})}function qc(i,t,e,n,s,r){const a=new k(new xt(.2,.16,.2,9),jt("wood",{color:s.wood,seed:r+Math.floor(t*100)}));return a.position.set(t,e+.1,n+i.jitter(0,.03)),a}function bv(i,t,e,n){const s=i.pick(_v),r=br(s),a=[],o=i.int(5,8);for(let l=0;l<o;l++){const c=i.range(.05,.075),h=new k(new De(c,0),r),d=l/o*Math.PI*2,u=l===0?0:i.range(.04,.13);h.position.set(t+Math.cos(d)*u,e+(l===0?.05:i.range(-.02,.02)),n+Math.sin(d)*u),a.push(h)}return a}function Mv(){return new kt(.22,.12,.14,1,1,1)}function Yc(i,t,e,n,s){const r=new Zt,a=i.range(.22,.34),o=new k(new xt(.1,.07,a,9),s);o.position.y=a/2,r.add(o);const l=new k(new xt(.06,.11,a*.35,9),s);l.position.y=a+a*.15,r.add(l);const c=new k(new xt(.055,.05,.06,8),s);return c.position.y=a+a*.35,r.add(c),r.position.set(t+i.jitter(0,.03),e,n+i.jitter(0,.03)),r.rotation.y=i.range(0,Math.PI),r}function su(i){const t=new be({color:i.color??16777215,vertexColors:i.vertexColors??!1,flatShading:!0,side:tn,roughness:i.roughness??.92,metalness:0}),e={uTime:{value:0},uAmp:{value:i.amp},uFreeLen:{value:i.freeLen},uCrossLen:{value:i.crossLen},uWaves:{value:i.waves},uSpeed:{value:i.speed},uSag:{value:i.sag}};i.perVertexPhase||(e.uPhase={value:i.phase??0});const n=i.perVertexPhase?"attribute float aPhase;":"",s=i.perVertexPhase?"uniform float uTime, uAmp, uFreeLen, uCrossLen, uWaves, uSpeed, uSag;":"uniform float uTime, uAmp, uFreeLen, uCrossLen, uWaves, uSpeed, uSag, uPhase;",r=i.perVertexPhase?"aPhase":"uPhase";return t.onBeforeCompile=a=>{Object.assign(a.uniforms,e),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
${n}
${s}`).replace("#include <begin_vertex>",`#include <begin_vertex>
        {
          float uf = clamp(position.x / uFreeLen, 0.0, 1.0);   // 0 fixed → 1 fly
          float vc = position.y / uCrossLen + 0.5;              // 0..1 across
          float base = uf * uWaves - uTime * uSpeed + ${r};
          float a = uAmp * uf;                                  // pinned at the fixed edge
          float z = a * (sin(base + vc * 1.7) + 0.35 * sin(base * 2.3 + vc * 3.1 + 1.0));
          transformed.z += z;
          transformed.y -= uSag * uf * uf;                      // gravity droop
          transformed.x -= uAmp * 0.25 * uf * (1.0 - cos(base));// slack shortening
        }`)},t.customProgramCacheKey=()=>i.cacheKey,t.userData.waveUniforms=e,t}var $c=[11876143,3104680,14199100,15260864,3111498,2763310,6963066],Sv=["flag","banner","pennant"],wv=["solid","bands","stripes","bicolor","cross","saltire","diamond"];function Av(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.style??t.pick(Sv),r=i.pattern??t.pick(wv),a=i.wind??1,o=i.poleHeight??t.range(3.2,3.8);let l=i.colors?.[0],c=i.colors?.[1];if(l===void 0||c===void 0){l=t.pick($c);do c=t.pick($c);while(c===l)}const h=new Zt;h.name="banner";const d=new k(new xt(.045,.06,o,8),jt("wood",{color:e.woodDark,seed:n}));d.position.y=o/2,h.add(d);const u=jt("metal",{color:14199100,tint:8018463,tintAmount:.3,seed:n+2}),f=new k(new Ln(.075,.28,8),u);f.position.y=o+.14,h.add(f);const p=new k(new yn(.06,8,6),u);p.position.y=o,h.add(p);let v,m,g;s==="pennant"?(v=t.range(2,2.6),m=t.range(.6,.8),g=Da(v,m,20,5,"taper")):s==="banner"?(v=t.range(1.9,2.4),m=t.range(1,1.3),g=Da(v,m,16,9,"swallow")):(v=t.range(1.5,1.9),m=t.range(.95,1.15),g=Da(v,m,16,9,"rect")),Tv(g,v,m,r,new _t(l),new _t(c));const b=Ev(v,m,a,s,n),S=new k(g,b),x=b.userData.waveUniforms;if(S.onBeforeRender=()=>{x.uTime.value=performance.now()*.001},s==="banner"){const A=new k(new xt(.035,.035,m+.3,7),jt("wood",{color:e.woodDark,seed:n+4}));A.rotation.z=Math.PI/2,A.position.y=o-.12,h.add(A),S.rotation.z=-Math.PI/2,S.position.set(0,o-.16,0)}else S.position.set(.05,o-.2-m/2,0);return h.add(S),{object:h,obstacleRadius:.4}}function Da(i,t,e,n,s){const r=new le,a=e+1,o=n+1,l=new Float32Array(a*o*3),c=new Float32Array(a*o*2);for(let d=0;d<a;d++){const u=d/e;let f=t/2;s==="taper"&&(f=t/2*(1-u*.94));for(let p=0;p<o;p++){const v=p/n,m=d*o+p;let g=u*i;if(s==="swallow"){const S=Math.abs(v-.5)*2,x=Math.max(0,(u-.7)/.3);g=u*i-x*x*(1-S)*t*.5}const b=(v-.5)*f*2;l[m*3]=g,l[m*3+1]=b,l[m*3+2]=0,c[m*2]=u,c[m*2+1]=v}}const h=[];for(let d=0;d<e;d++)for(let u=0;u<n;u++){const f=d*o+u,p=(d+1)*o+u,v=(d+1)*o+(u+1),m=d*o+(u+1);h.push(f,p,m,p,v,m)}return r.setAttribute("position",new Qt(l,3)),r.setAttribute("uv",new Qt(c,2)),r.setIndex(h),r.computeVertexNormals(),r}function Tv(i,t,e,n,s,r){const a=i.getAttribute("uv"),o=new Float32Array(a.count*3),l=(c,h)=>{switch(n){case"bicolor":return c<.5?s:r;case"bands":return Math.floor(h*3)%2===0?s:r;case"stripes":return Math.floor(c*5)%2===0?s:r;case"cross":return Math.abs(h-.5)<.16||Math.abs(c-.42)<.14?r:s;case"saltire":return Math.abs(c-h)<.17||Math.abs(c-(1-h))<.17?r:s;case"diamond":return Math.abs(c-.5)+Math.abs(h-.5)<.3?r:s;default:return s}};for(let c=0;c<a.count;c++){const h=l(a.getX(c),a.getY(c));o[c*3]=h.r,o[c*3+1]=h.g,o[c*3+2]=h.b}i.setAttribute("color",new Qt(o,3))}function Ev(i,t,e,n,s){return su({freeLen:i,crossLen:t,amp:(n==="pennant"?.16:.13)*e,waves:n==="pennant"?7:5,speed:3.4+s%7*.12,sag:n==="banner"?0:.14,phase:s%100*.183,cacheKey:"scena-banner-v1",vertexColors:!0})}function Rv(i,t=5){const e=[],n=[],s=[],r=[];for(const o of i){const l=e.length/3,c=[{y:0,rad:o.r},{y:o.h*.5,rad:o.r*.62}];for(const d of c)for(let u=0;u<t;u++){const f=u/t*Math.PI*2;e.push(o.cx+Math.cos(f)*d.rad,d.y,o.cz+Math.sin(f)*d.rad),n.push(d.y/o.h),s.push(o.phase)}const h=l+t*2;e.push(o.cx,o.h,o.cz),n.push(1),s.push(o.phase);for(let d=0;d<t;d++){const u=l+d,f=l+(d+1)%t,p=l+t+d,v=l+t+(d+1)%t;r.push(u,f,v,u,v,p),r.push(p,v,h)}}const a=new le;return a.setAttribute("position",new Qt(new Float32Array(e),3)),a.setAttribute("aY",new Qt(new Float32Array(n),1)),a.setAttribute("aPhase",new Qt(new Float32Array(s),1)),a.setIndex(r),a}var Cv=`
attribute float aY;
attribute float aPhase;
uniform float uTime;
varying float vY;
void main() {
  vY = aY;
  vec3 p = position;
  float w = aY * aY;                 // tips sway most, base is pinned
  p.x += sin(uTime * 7.0 + aPhase + aY * 4.0) * 0.09 * w;
  p.z += cos(uTime * 6.0 + aPhase * 1.3 + aY * 4.0) * 0.09 * w;
  p.y *= 0.82 + 0.18 * sin(uTime * 13.0 + aPhase * 2.0); // lick up and down
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`,Pv=`
uniform vec3 uHot;
uniform vec3 uCool;
varying float vY;
void main() {
  vec3 col = mix(uHot, uCool, vY);   // white-hot base → cool orange tip
  float alpha = 1.0 - vY;            // fade out toward the tip
  gl_FragColor = vec4(col * (1.2 - vY * 0.4), alpha);
}`,Iv=`
attribute float aPhase;
attribute float aSpeed;
attribute float aRad;
attribute float aAng;
uniform float uTime;
uniform float uRise;
uniform float uSize;
varying float vLife;
void main() {
  float life = fract(uTime * aSpeed + aPhase); // 0 born → 1 dead
  vLife = life;
  float ang = aAng + life * 2.2;
  float rad = aRad * (1.0 - life * 0.35);
  vec3 p = vec3(cos(ang) * rad, life * uRise, sin(ang) * rad);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (1.0 - life) * (260.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`,Lv=`
uniform vec3 uColor;
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, (1.0 - vLife) * (1.0 - d * 2.0));
}`;function Dv(i,t,e,n,s){const r=[];for(let b=0;b<e;b++){const S=b/e*Math.PI*2+i.range(0,1),x=b===0?0:i.range(.3,1)*n;r.push({cx:Math.cos(S)*x,cz:Math.sin(S)*x,r:i.range(.1,.16)*t,h:s*i.range(.7,1.15)*t,phase:i.range(0,Math.PI*2)})}const a=new nn({uniforms:{uTime:{value:0},uHot:{value:new _t(16771226)},uCool:{value:new _t(14696460)}},vertexShader:Cv,fragmentShader:Pv,transparent:!0,depthWrite:!1,blending:yi,side:tn}),o=new k(Rv(r),a),l=Math.round(10+e*2),c=new Float32Array(l*3),h=new Float32Array(l),d=new Float32Array(l),u=new Float32Array(l),f=new Float32Array(l);for(let b=0;b<l;b++)h[b]=i.next(),d[b]=i.range(.25,.5),u[b]=i.range(.02,n*.9),f[b]=i.range(0,Math.PI*2);const p=new le;p.setAttribute("position",new Qt(c,3)),p.setAttribute("aPhase",new Qt(h,1)),p.setAttribute("aSpeed",new Qt(d,1)),p.setAttribute("aRad",new Qt(u,1)),p.setAttribute("aAng",new Qt(f,1));const v=new nn({uniforms:{uTime:{value:0},uRise:{value:s*1.9*t},uSize:{value:3.2*t},uColor:{value:new _t(16747068)}},vertexShader:Iv,fragmentShader:Lv,transparent:!0,depthWrite:!1,blending:yi}),m=new Dh(p,v);m.frustumCulled=!1;const g=new Zt;return g.add(o,m),{group:g,flameU:a.uniforms,emberU:v.uniforms}}function Nv(i,t,e,n,s,r,a){i.onBeforeRender=()=>{const o=performance.now()*.001;t.uTime.value=o,e.uTime.value=o;const l=.74+.15*Math.sin(o*11)+.1*Math.sin(o*23.3+1.7)+.06*Math.sin(o*41+.5);n.emissiveIntensity=s*(.8+.3*(l-.74)*3),r&&(r.intensity=a*Math.max(.4,l))}}function Uv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.scale??1,r=i.light??!0,a=new Zt;a.name="brazier";const o=jt("metal",{color:e.metal,seed:n}),l=.9;for(let p=0;p<3;p++){const v=p/3*Math.PI*2+.5,m=new k(new xt(.03,.04,l,5),o);m.position.set(Math.cos(v)*.22,l/2,Math.sin(v)*.22),m.rotation.z=Math.cos(v)*.18,m.rotation.x=-Math.sin(v)*.18,a.add(m)}const c=new k(new xt(.42,.24,.32,12,1,!0),o);c.position.y=l+.02,a.add(c);const h=new k(new xt(.24,.24,.05,12),o);h.position.y=l-.13,a.add(h);const d=new be({color:1708297,emissive:16734750,emissiveIntensity:1.4,flatShading:!0});for(let p=0;p<5;p++){const v=new k(new De(t.range(.07,.12),0),d);v.position.set(t.jitter(0,.16),l+.06+t.range(0,.04),t.jitter(0,.16)),a.add(v)}const u=Dv(t,s,5,.2,.5);u.group.position.y=l+.1,a.add(u.group);let f=null;return r&&(f=new fl(16747066,7,9,2),f.position.set(0,l+.4,0),a.add(f)),Nv(u.group.children[0],u.flameU,u.emberU,d,1.4,f,7),{object:a,obstacleRadius:.45}}var Fv=[13777714,15260864,3108784,14726458,4164178,16777215];function Ov(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.span??t.range(4.5,6),r=i.poleHeight??t.range(2.6,3.2),a=i.flags??Math.max(5,Math.round(s*1.6)),o=i.colors??Fv,l=new Zt;l.name="bunting";const c=jt("wood",{color:e.woodDark,seed:n});for(const x of[-1,1]){const A=new k(new xt(.05,.06,r,7),c);A.position.set(x*(s/2),r/2,0),l.add(A)}const h=r-.1,d=s*t.range(.12,.18),u=24,f=[];for(let x=0;x<=u;x++){const A=x/u,M=-s/2+A*s,T=h-4*d*A*(1-A);f.push(new I(M,T,0))}const p=new cl(f),v=new k(new hl(p,u,.016,5,!1),new be({color:e.woodDark,roughness:.9,flatShading:!0}));l.add(v);const m=.42,g=.34,b=[];let S;for(let x=0;x<a;x++){const A=(x+1)/(a+1),M=p.getPoint(A),T=su({freeLen:m,crossLen:g,amp:.05,waves:2.4,speed:2.6+n%5*.1,sag:0,phase:x*.7+n%10*.3,cacheKey:"scena-bunting-v1",color:o[x%o.length],roughness:.9}),_=new k(kv(m,g),T);_.rotation.z=-Math.PI/2,_.position.set(M.x,M.y-.01,M.z),l.add(_),b.push(T.userData.waveUniforms),S||(S=_)}return S&&(S.onBeforeRender=()=>{const x=performance.now()*.001;for(const A of b)A.uTime.value=x}),{object:l,obstacleRadius:0}}function kv(i,t,e=4,n=2){const s=e+1,r=n+1,a=[];for(let c=0;c<s;c++){const h=c/e,d=t/2*(1-h*.92);for(let u=0;u<r;u++){const f=u/n;a.push(h*i,(f-.5)*d*2,0)}}const o=[];for(let c=0;c<e;c++)for(let h=0;h<n;h++){const d=c*r+h,u=(c+1)*r+h,f=(c+1)*r+(h+1),p=c*r+(h+1);o.push(d,u,p,u,f,p)}const l=new le;return l.setAttribute("position",new Qt(new Float32Array(a),3)),l.setIndex(o),l.computeVertexNormals(),l}function Kc(i={}){const t=i.level??.8,e=i.size??200,n=i.resolution??40,s=i.amplitude??.06,r=i.speed??1,a=i.palette??Re,o=new Is(e,e,n,n);o.rotateX(-Math.PI/2);const l=o.getAttribute("position"),c=new k(o,new be({color:a.water,transparent:!0,opacity:.85,flatShading:!0,metalness:.35,roughness:.4}));c.name="water",c.position.y=t;let h=0;const d=u=>{h+=u*r;for(let f=0;f<l.count;f++){const p=l.getX(f),v=l.getZ(f);l.setY(f,Math.sin(p*.35+h)*Math.cos(v*.3+h*.8)*s)}l.needsUpdate=!0,o.computeVertexNormals()};return d(0),{mesh:c,level:t,update:d,isUnderwater:u=>u<t}}var Bv=`
  float flowHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float flowNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(flowHash(i), flowHash(i + vec2(1.0, 0.0)), f.x),
               mix(flowHash(i + vec2(0.0, 1.0)), flowHash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
`,zv=`
  {
    // Cylinder UVs run v = 0 at the bottom, 1 at the top; down below is how
    // far the water has fallen.
    float down = 1.0 - vUv.y;

    // Falling water ACCELERATES, so equal spans of time cover longer spans of
    // distance further down: the pattern has to stretch, not merely scroll.
    // Scrolling at a constant rate is what makes a stream read as a barber's
    // pole.
    float stretched = down * down * 0.6 + down * 0.4;
    float travel = stretched * 6.0 - uFlowTime * uFlowSpeed;

    // Strands: bands around the column, wobbling as they fall.
    float across = vUv.x * uFlowStrands;
    float strand = flowNoise(vec2(across, travel));
    float fine = flowNoise(vec2(across * 2.7, travel * 1.9 + 4.0));
    float texture = strand * 0.65 + fine * 0.35;

    // Break-up grows with distance fallen. Above the threshold it is a
    // sheet; below it, holes open and it becomes separate ropes of water.
    float apart = smoothstep(uFlowBreak, 1.0, down);
    float mask = mix(1.0, smoothstep(0.28, 0.62, texture), apart);

    // The leading edges catch the light — the bright rim is most of what
    // makes water read as wet rather than as coloured glass. It has to be a
    // strong, LOCAL highlight: a uniformly pale tube is a rod, whatever it is
    // tinted, because what the eye reads as water is the variation along the
    // length and not the colour.
    float edge = smoothstep(0.38, 0.78, texture) * (0.4 + apart * 0.6);
    diffuseColor.rgb = mix(uFlowColor * 0.8, vec3(1.25), edge);

    // Fade in at the lip and out at the bottom, where it meets whatever it
    // is falling into. A stream with a hard end looks cut off.
    float ends = smoothstep(0.0, 0.06, down) * (1.0 - smoothstep(0.86, 1.0, down));
    // The body of the water is quite transparent and the lit edges are not —
    // that contrast is what separates a stream from a glass rod.
    float body = mix(0.45, 1.0, edge);
    diffuseColor.a *= uFlowOpacity * uFlowRate * mask * ends * body;
  }
`;function Vv(i={}){const t={uFlowTime:{value:0},uFlowRate:{value:1},uFlowSpeed:{value:i.speed??1.6},uFlowBreak:{value:i.breakUp??.35},uFlowStrands:{value:i.strands??7},uFlowOpacity:{value:i.opacity??.55},uFlowColor:{value:new _t(i.color??10473696)}},e=new be({color:16777215,transparent:!0,side:tn,depthWrite:!1,roughness:.12,metalness:.1});return e.defines={...e.defines??{},USE_UV:""},e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.fragmentShader=n.fragmentShader.replace("void main() {",`uniform float uFlowTime;
         uniform float uFlowRate;
         uniform float uFlowSpeed;
         uniform float uFlowBreak;
         uniform float uFlowStrands;
         uniform float uFlowOpacity;
         uniform vec3 uFlowColor;
         ${Bv}
         void main() {`).replace("#include <map_fragment>",`#include <map_fragment>
${zv}`)},e.customProgramCacheKey=()=>"scenaWaterFlow",e.userData.flowUniforms=t,e}var Hv=`
attribute float aPhase;
attribute float aSpeed;
attribute float aRad;
attribute float aAng;
uniform float uTime;
uniform float uRise;
uniform float uFall;
uniform float uSpread;
uniform float uSize;
uniform float uMaxPixels;
varying float vLife;
void main() {
  float life = fract(uTime * aSpeed + aPhase);
  vLife = life;
  // Up-then-down when uRise > 0; a straight accelerating fall when it is 0.
  // Gravity is what makes droplets read as droplets: constant-speed points
  // are a snow effect.
  float h = uRise > 0.0
    ? 4.0 * life * (1.0 - life) * uRise
    : -life * life * uFall;
  float rad = aRad * uSpread * (uRise > 0.0 ? life : 0.35 + life * 0.65);
  vec3 p = vec3(cos(aAng) * rad, h, sin(aAng) * rad);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  // Point sprites grow without bound as the camera closes in, and a splash
  // seen from 60 cm turns into a screenful of glowing beach balls. Cap it.
  gl_PointSize = min(uSize * (240.0 / -mv.z), uMaxPixels);
  gl_Position = projectionMatrix * mv;
}`,Gv=`
uniform vec3 uColor;
uniform float uRate;
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  // Fade in at birth, out at death; soft round dot; kept dim so many
  // droplets read as a fine spray rather than a blown-out bloom.
  float fade = max(0.0, 0.5 - abs(vLife - 0.5));
  gl_FragColor = vec4(uColor, (1.0 - d * 2.0) * fade * 0.8 * uRate);
}`;function ru(i={}){const t=new ze(i.seed??1),e=i.count??24,n=new Float32Array(e*3),s=new Float32Array(e),r=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e);for(let d=0;d<e;d++)s[d]=t.next(),r[d]=t.range(.35,.7),a[d]=t.range(.25,1),o[d]=t.range(0,Math.PI*2);const l=new le;l.setAttribute("position",new Qt(n,3)),l.setAttribute("aPhase",new Qt(s,1)),l.setAttribute("aSpeed",new Qt(r,1)),l.setAttribute("aRad",new Qt(a,1)),l.setAttribute("aAng",new Qt(o,1));const c=new nn({uniforms:{uTime:{value:0},uRise:{value:i.rise??0},uFall:{value:i.fall??.4},uSpread:{value:i.spread??.12},uSize:{value:i.size??.28},uMaxPixels:{value:i.maxPixels??22},uRate:{value:1},uColor:{value:new _t(i.color??12574958)}},vertexShader:Hv,fragmentShader:Gv,transparent:!0,depthWrite:!1,blending:yi}),h=new Dh(l,c);return h.frustumCulled=!1,{mesh:h,update(d){c.uniforms.uTime.value+=d},setRate(d){const u=Math.min(1,Math.max(0,d));c.uniforms.uRate.value=u,h.visible=u>.001}}}function Wv(i={}){const t=i.height??.25,e=i.radius??.012,n=i.palette??Re,s=i.seed??1,r=new Zt;r.name="stream";const a=Vv({color:i.color??new _t(n.water).lerp(new _t(16777215),.55).getHex(),breakUp:Math.min(.7,.08+e*14),strands:Math.max(3,Math.round(e*260)),speed:1.4+t}),o=new k(new xt(e,e*.62,t,8,1,!0),a);o.name="column",o.position.y=-t/2,r.add(o);let l=null;(i.splash??!0)&&(l=ru({count:12,spread:e*6,rise:e*4,fall:e*5,size:Math.max(.03,e*4),maxPixels:14,seed:s+3}),l.mesh.position.y=-t,r.add(l.mesh));const c=a.userData.flowUniforms;let h=i.flow??1;const d=()=>{c.uFlowRate.value=h,o.visible=h>.001,l?.setRate(h)};return d(),{object:r,obstacleRadius:0,height:t,get flow(){return h},setFlow(u){h=Math.min(1,Math.max(0,u)),d()},update(u){c.uFlowTime.value+=u,l?.update(u)}}}var Xv=["obelisk","figure","orb","bust","beast"];function au(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.figure??t.pick(Xv),r=i.material??(t.next()<.72?"stone":"bronze"),a=i.height??t.range(3.1,3.7),o=new Zt;o.name="statue";const l=jt("stone",{color:t.pick(e.rock),seed:n}),c=r==="bronze"?jt("metal",{color:10124102,tint:4153155,tintAmount:.34,seed:n+4}):jt("stone",{color:t.pick(e.rock),seed:n+7}),h=a*t.range(.32,.4),d=a*.34,u=3;let f=0;for(let x=0;x<u;x++){const A=x/(u-1),M=d*(1-A*.34),T=h*.42/u+(x===0?.06:0),_=new k(new kt(M,T,M),l);_.position.y=f+T/2,o.add(_),f+=T}const p=d*.5,v=h-f,m=new k(new kt(p,v,p),l);m.position.y=f+v/2,o.add(m);const g=h,b=a-h,S=new Zt;if(S.position.y=g,o.add(S),s==="obelisk"){const x=b*.86,A=new k(new xt(p*.24,p*.34,x,4),c);A.position.y=x/2,A.rotation.y=Math.PI/4,S.add(A);const M=new k(new Ln(p*.24*1.35,b*.16,4),c);M.position.y=x+b*.08,M.rotation.y=Math.PI/4,S.add(M)}else if(s==="orb"){const x=b*.62,A=new k(new xt(p*.2,p*.26,x,10),c);A.position.y=x/2,S.add(A);const M=new k(new yn(b*.22,16,12),c);M.position.y=x+b*.22,S.add(M);const T=new k(new xt(b*.28,b*.28,.04,20,1,!0),c);T.position.copy(M.position),T.rotation.set(Math.PI/2.4,0,.2),S.add(T)}else if(s==="bust"){const x=b*.52,A=new k(new xt(p*.22,p*.3,x,8),c);A.position.y=x/2,S.add(A);const M=new k(new xt(b*.2,b*.26,b*.2,7),c);M.position.y=x+b*.1,S.add(M),S.add(Jc(c,b*.13,x+b*.32,t))}else if(s==="beast"){const x=b*.5,A=new k(new kt(x*.78,x*.62,x*.9),c);A.position.set(0,x*.42,-x*.42),S.add(A);const M=new k(new kt(x*.62,x*.95,x*.5),c);M.position.set(0,x*.62,x*.32),S.add(M);const T=new k(new kt(x*.32,x*.78,x*.34),c);T.position.set(0,x*.3,x*.44),S.add(T);for(const C of[-1,1]){const L=new k(new kt(x*.26,x*.5,x*.7),c);L.position.set(C*x*.32,x*.34,-x*.34),S.add(L);const B=new k(new kt(x*.2,x*.62,x*.22),c);B.position.set(C*x*.2,x*.31,x*.5),S.add(B);const H=new k(new kt(x*.24,x*.14,x*.36),c);H.position.set(C*x*.2,x*.07,x*.62),S.add(H)}const _=new k(new yn(x*.36,10,8),c);_.position.set(0,x*1.16,x*.36),_.scale.set(1,1,.9),S.add(_);const E=new k(new kt(x*.22,x*.2,x*.28),c);E.position.set(0,x*1.08,x*.64),S.add(E);for(const C of[-1,1]){const L=new k(new kt(x*.09,x*.11,x*.05),c);L.position.set(C*x*.17,x*1.4,x*.32),S.add(L)}const P=new k(new xt(x*.045,x*.07,x*.9,6),c);P.position.set(x*.34,x*.42,-x*.62),P.rotation.set(.6,0,-.5),S.add(P)}else{const x=b*.62,A=new k(new xt(b*.14,b*.24,x,9),c);A.position.y=x/2,S.add(A);const M=new k(new xt(b*.13,b*.15,b*.18,8),c);M.position.y=x+b*.06,S.add(M);const T=t.next()<.5;for(const _ of[-1,1]){const E=new k(new xt(b*.045,b*.05,b*.34,6),c);T&&_===1?(E.position.set(_*b*.16,x+b*.12,b*.02),E.rotation.z=-.9):(E.position.set(_*b*.15,x-b*.04,0),E.rotation.z=_*.12),S.add(E)}S.add(Jc(c,b*.1,x+b*.24,t))}return{object:o,obstacleRadius:d*.72}}function Jc(i,t,e,n){const s=new Zt,r=new k(new yn(t,12,10),i);return r.scale.set(.92,1.08,.95),s.add(r),s.position.y=e,s.rotation.y=n.jitter(0,.15),s}var qv=["orb","figure","obelisk","bust"];function Yv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.size??t.range(3,3.6),r=i.figure??t.pick(qv),a=new Zt;a.name="fountain";const o=jt("stone",{color:e.rock[0],seed:n}),l=jt("stone",{color:e.rock[1]??e.rock[0],seed:n+5}),c=.55,h=.22,d=s/2,u=new k(new xt(d*.98,d*.98,.12,4),l);u.rotation.y=Math.PI/4,u.position.y=.06,a.add(u);const f=[[0,d-h/2,s,h],[0,-(d-h/2),s,h],[d-h/2,0,h,s],[-(d-h/2),0,h,s]];for(const[C,L,B,H]of f){const O=new k(new kt(B,c,H),o);O.position.set(C,c/2,L),a.add(O)}const p=c-.12,v=Kc({level:p,size:s-h*1.4,resolution:12,amplitude:.02,speed:1.4,palette:e});a.add(v.mesh);const m=s*.16,g=c+s*.24,b=new k(new xt(m*.8,m,g,10),o);b.position.y=g/2,a.add(b);const S=g,x=new k(new xt(s*.3,s*.14,.16,12),o);x.position.y=S,a.add(x);const A=Kc({level:S+.09,size:s*.34,resolution:6,amplitude:.012,speed:1.9,palette:e});a.add(A.mesh);const M=au({seed:n+3,figure:r,material:i.centrepiece??"stone",height:s*.62,palette:e});M.object.position.y=S+.08,M.object.scale.setScalar(.9),a.add(M.object);const T=S-p-.05,_=[];for(let C=0;C<8;C++){const L=C/8*Math.PI*2,B=Wv({height:T,radius:.022,splash:!1,seed:n+C,palette:e});B.object.position.set(Math.cos(L)*s*.28,S-.05,Math.sin(L)*s*.28),a.add(B.object),_.push(B)}const E=ru({count:22,spread:s*.14,rise:(S+s*.2)*.42,size:.28,seed:n});E.mesh.position.y=S+.12,a.add(E.mesh);let P=performance.now()*.001;return v.mesh.onBeforeRender=()=>{const C=performance.now()*.001,L=Math.min(.05,Math.max(0,C-P));P=C,v.update(L),A.update(L),E.update(L);for(const B of _)B.update(L)},{object:a,obstacleRadius:d+.1}}var $v=["cart","wagon"],Kv=["empty","crates","barrels","sacks","hay"];function Jv(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.style??t.pick($v),r=i.cargo??t.pick(Kv),a=new Zt;a.name="cart";const o=jt("plank",{color:e.wood,seed:n}),l=jt("wood",{color:e.woodDark,seed:n+2}),c=jt("metal",{color:e.metal,seed:n+4}),h=s==="wagon"?2.6:2,d=1.3,u=s==="wagon"?.5:.56,f=1.11,p=u*f+.18,v=new k(new kt(h,.12,d),o);v.position.y=p,a.add(v);const m=[[0,d/2-.04,h,.08],[0,-.61,h,.08],[h/2-.04,0,.08,d],[-(h/2-.04),0,.08,d]];for(const[x,A,M,T]of m){const _=new k(new kt(M,.32,T),o);_.position.set(x,p+.22,A),a.add(_)}const g=d/2+.09,b=s==="wagon"?[h*.32,-h*.32]:[-h*.05];for(const x of b){const A=s==="wagon"&&x>0?u*.82:u;for(const T of[1,-1]){const _=Zv(A,l,c,t);_.position.set(x,A*f,T*g),a.add(_)}const M=new k(new xt(.05,.05,g*2,6),l);M.rotation.x=Math.PI/2,M.position.set(x,A*f,0),a.add(M)}if(s==="cart")for(const x of[1,-1]){const A=new k(new xt(.045,.055,1.5,6),l);A.position.set(h/2+.55,p-.35,x*(d/2-.2)),A.rotation.z=Math.PI/2-.32,a.add(A)}Qv(a,r,t,n,e,h,d,p+.06);const S=Math.hypot(h,d)/2+.15;return{object:a,obstacleRadius:S}}function Zv(i,t,e,n){const s=new Zt,r=new k(new Xn(i,i*.11,6,16),e);s.add(r);const a=new k(new Xn(i*.84,i*.08,5,14),t);s.add(a);const o=new k(new xt(i*.16,i*.16,i*.3,8),t);o.rotation.x=Math.PI/2,s.add(o);const l=n.int(6,8);for(let c=0;c<l;c++){const h=c/l*Math.PI*2,d=new k(new xt(i*.03,i*.04,i*.72,5),t);d.position.set(Math.cos(h)*i*.44,Math.sin(h)*i*.44,0),d.rotation.z=h-Math.PI/2,s.add(d)}return s}function Qv(i,t,e,n,s,r,a,o,l){if(t==="empty")return;const c=()=>[e.jitter(0,r*.3),e.jitter(0,a*.28)];if(t==="crates"){const h=e.int(2,4);for(let d=0;d<h;d++){const u=nu({seed:n+d*7,size:e.range(.55,.7),palette:s}),[f,p]=c();u.object.position.set(f,o,p),i.add(u.object)}}else if(t==="barrels"){const h=jt("wood",{color:s.wood,seed:n+9}),d=e.int(3,5);for(let u=0;u<d;u++){const f=new Zt,p=new k(new xt(.24,.24,.62,10),h);p.scale.x=1.08,p.position.y=.31,f.add(p);for(const g of[.12,.5]){const b=new k(new xt(.255,.255,.05,10),jt("metal",{color:s.metal,seed:n+3}));b.position.y=g,f.add(b)}const[v,m]=c();f.position.set(v,o,m),i.add(f)}}else if(t==="sacks"){const h=jt("plaster",{color:12560504,seed:n+5}),d=e.int(4,6);for(let u=0;u<d;u++){const f=new k(new De(.22,1),h),[p,v]=c();f.position.set(p,o+.16,v),f.rotation.y=e.range(0,Math.PI),f.scale.set(e.range(.9,1.1),e.range(1,1.3),e.range(.9,1.1)),i.add(f)}}else{const h=jt("thatch",{color:13216074,seed:n+6});for(let d=0;d<3;d++){const u=new k(new kt(r*.7,.34,a*.7),h);u.position.set(e.jitter(0,.1),o+.17+d*.3,e.jitter(0,.05)),u.rotation.y=e.jitter(0,.1),u.scale.setScalar(1-d*.16),i.add(u)}}}var Zc=["HAVENBROOK","MILLFORD","OAKVALE","GREYMOOR","ASHFORD","WESTWATCH","THORNWICK"],Qc=["MARKET","HARBOUR","THE MILL","CASTLE","FORGE","CHAPEL","FERRY","THE INN"],jv=[15983272,16182473,15255146,15785134],tx=[2242862,1978441,4857634,2374176,2761501];function ex(i={}){const t=new ze(i.seed??1),e=i.palette??Re,n=i.seed??1,s=i.kind??"post",r=i.inkColor??t.pick(jv),a=i.panelColor??t.pick(tx),o=new Zt;o.name="sign";const l=()=>jt("plank",{color:i.boardColor??e.wood,seed:n}),c=jt("wood",{color:e.woodDark,seed:n+3}),h=jt("metal",{color:3093307,tint:1316378,tintAmount:.35,seed:n+5}),d=()=>new be({color:r,roughness:.55,metalness:0,emissive:new _t(r).multiplyScalar(.5),emissiveIntensity:.32});if(s==="milestone")return ix(o,i.text??t.pick(Zc),e,n),{object:o,obstacleRadius:.42};if(s==="fingerpost"){const M=i.directions??sx(t,i.text?[i.text,...Qc]:Qc),T=i.height??3.4,_=new k(new xt(.08,.1,T,10),c);_.position.y=T/2,o.add(_);const E=new k(new yn(.13,12,8),h);E.position.y=T+.03,o.add(E);const P=M.length;return M.forEach((C,L)=>{const B=C.angle??L/P*Math.PI*2+t.range(-.2,.2),H=C.height??T-.55-L*.66,O=nx(C.text,l(),d(),a,h);O.position.y=H,O.rotation.y=B,o.add(O)}),{object:o,obstacleRadius:.4}}const u=i.text??t.pick(Zc),f=.72,p=f*.5,m=Math.max(1.5,xl(u,{size:p})+.34*2),g=.1;if(s==="hanging"){const M=i.height??3,T=new k(new xt(.075,.09,M,10),c);T.position.y=M/2,o.add(T);const _=m*.5+.4,E=new k(new kt(_,.1,.1),h);E.position.set(_/2,M-.18,0),o.add(E);const P=new k(new Xn(.11,.022,7,12,Math.PI*1.4),h);P.position.set(_-.1,M-.32,0),P.rotation.z=-.4,o.add(P);const C=new k(new xt(.032,.032,.6,6),h);C.position.set(_*.4,M-.52,0),C.rotation.z=Math.PI/4,o.add(C);const L=_-.14,B=new Zt;B.name="signPivot",B.position.set(L,M-.24,0),o.add(B);for(const X of[-m*.34,m*.34]){const D=new k(new Xn(.055,.018,7,12),h);D.position.set(X,-.15,0),D.rotation.x=Math.PI/2,B.add(D);const q=new k(new xt(.014,.014,.28,6),h);q.position.set(X,-.16,0),B.add(q)}const H=jc(u,m,f,g,l(),d(),a,h,p);H.position.y=-.5,B.add(H);const O=n%100*.21;return H.children[0].onBeforeRender=()=>{const X=(typeof performance<"u"?performance.now():0)*.001;B.rotation.z=Math.sin(X*1.6+O)*.05,B.updateMatrixWorld(!0)},{object:o,obstacleRadius:.3}}const b=i.height??2.15,S=b-f/2-.06;for(const M of[-m*.33,m*.33]){const T=new k(new xt(.06,.075,b,9),c);T.position.set(M,b/2,0),o.add(T)}const x=jc(u,m,f,g,l(),d(),a,h,p);x.position.y=S,o.add(x);const A=new k(new kt(m+.14,.09,g+.14),c);return A.position.y=S+f/2+.07,o.add(A),{object:o,obstacleRadius:.3}}function jc(i,t,e,n,s,r,a,o,l,c){const h=new Zt,d=new k(new kt(t,e,n),s);h.add(d);const u=new be({color:a,roughness:.62,metalness:0}),f=[1,-1];for(const m of f){const g=new k(new kt(t-.18,e-.18,.03),u);g.position.z=m*(n/2+.012),h.add(g);const b=new k(vl(i,{size:l,align:"center"}).geometry,r);b.position.z=m*(n/2+.035),m<0&&(b.rotation.y=Math.PI),h.add(b)}const p=t/2-.11,v=e/2-.11;for(const m of[-p,p])for(const g of[-v,v]){const b=new k(new yn(.035,8,6),o);b.position.set(m,g,n/2+.01),h.add(b)}return h}function nx(i,t,e,n,s){const r=new Zt,a=.46,o=.08,l=a*.52,c=xl(i,{size:l}),h=Math.max(1.6,c+.8),d=ou([[0,-a/2],[h-a*.85,-a/2],[h,0],[h-a*.85,a/2],[0,a/2]],o),u=new k(d,t);r.add(u);const f=new be({color:n,roughness:.62}),p=new k(new kt(h-.16,a-.14,.03),f);p.position.set((h-.16)/2-.02,0,o/2+.012),r.add(p);const v=new k(vl(i,{size:l,align:"left"}).geometry,e);v.position.set(.24,0,o/2+.035),r.add(v);const m=new k(new Xn(.06,.02,6,10),s);return m.position.set(.03,0,0),m.rotation.y=Math.PI/2,r.add(m),r}function ix(i,t,e,n){const s=jt("stone",{color:e.rock[0],seed:n}),r=1,a=new k(ou([[-.44,0],[.44,0],[.44,r*.68],[.26,r],[-.26,r],[-.44,r*.68]],.28),s);i.add(a);const o=.74;let l=.19,c=xl(t,{size:l});c>o-.1&&(l*=(o-.1)/c,c=o-.1);const h=new k(new kt(Math.min(o,c+.14),l+.18,.02),new be({color:3158060,roughness:.8}));h.position.set(0,r*.56,.145),i.add(h);const d=new be({color:15262678,roughness:.6,emissive:2762788,emissiveIntensity:.15}),u=new k(vl(t,{size:l,align:"center",depth:.02}).geometry,d);u.position.set(0,r*.56,.16),i.add(u)}function ou(i,t){const e=i.length,n=t/2,s=[],r=[];for(const[o,l]of i)s.push(o,l,n);for(const[o,l]of i)s.push(o,l,-n);for(let o=1;o<e-1;o++)r.push(0,o,o+1),r.push(e,e+o+1,e+o);for(let o=0;o<e;o++){const l=(o+1)%e;r.push(o,e+o,l,l,e+o,e+l)}const a=new le;return a.setAttribute("position",new Qt(new Float32Array(s),3)),a.setIndex(r),a.computeVertexNormals(),a.computeBoundingBox(),a.computeBoundingSphere(),a}function sx(i,t){const e=[...t],n=[];for(let s=0;s<3&&e.length;s++){const r=Math.floor(i.next()*e.length);n.push({text:e.splice(r,1)[0]})}return n}function x1(i={}){const t=i.palette??Re,e=new nn({side:Je,depthWrite:!1,uniforms:{topColor:{value:new _t(i.topColor??t.skyTop)},bottomColor:{value:new _t(i.bottomColor??t.skyBottom)}},vertexShader:`
      varying vec3 vWorld;
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorld;
      void main() {
        float t = clamp(normalize(vWorld).y * 0.5 + 0.5, 0.0, 1.0);
        gl_FragColor = vec4(mix(bottomColor, topColor, pow(t, 0.8)), 1.0);
      }`}),n=new k(new yn(i.radius??400,16,12),e);return n.name="sky",{mesh:n,setColors(s,r){e.uniforms.topColor.value.setHex(s),e.uniforms.bottomColor.value.setHex(r)}}}var rx={day:{sun:16774368,sunIntensity:1.6,sunPos:[30,45,20],ambient:14674687,ambientIntensity:.35,skyTint:12376319,groundTint:6978918},"golden-hour":{sun:16758881,sunIntensity:1.7,sunPos:[40,14,-12],ambient:16768192,ambientIntensity:.3,skyTint:16764830,groundTint:8022616},overcast:{sun:14212840,sunIntensity:.7,sunPos:[12,40,8],ambient:13620960,ambientIntensity:.65,skyTint:13160668,groundTint:7371384},night:{sun:9348824,sunIntensity:.35,sunPos:[-20,30,-25],ambient:3818600,ambientIntensity:.35,skyTint:2897248,groundTint:1975344}};function y1(i="day"){const t=rx[i],e=new Zt;e.name=`lighting-${i}`;const n=new Uf(t.sun,t.sunIntensity);n.position.set(...t.sunPos);const s=new Ff(t.ambient,t.ambientIntensity),r=new Lf(t.skyTint,t.groundTint,.5);return e.add(n,s,r),{group:e,sun:n,ambient:s,hemisphere:r}}var ax={haze:{near:45,far:160},thick:{near:12,far:70},eerie:{near:6,far:42}};function b1(i,t,e=Re){const{near:n,far:s}=ax[t];i.fog=new el(e.fog,n,s)}function M1(i={}){const t=i.palette??Re,e=i.dayLength??60,n=[{t:0,skyTop:725030,skyBottom:1712960,sun:9348824,sunIntensity:.03,ambientIntensity:.06,fog:1317422},{t:.23,skyTop:2569052,skyBottom:6968432,sun:13605490,sunIntensity:.3,ambientIntensity:.12,fog:4866648},{t:.3,skyTop:4877216,skyBottom:15247738,sun:16758881,sunIntensity:1,ambientIntensity:.26,fog:11569778},{t:.5,skyTop:t.skyTop,skyBottom:t.skyBottom,sun:16774368,sunIntensity:1.9,ambientIntensity:.45,fog:t.fog},{t:.7,skyTop:4872852,skyBottom:14718302,sun:16752720,sunIntensity:1,ambientIntensity:.26,fog:10517096},{t:.78,skyTop:2304594,skyBottom:9065824,sun:14191194,sunIntensity:.25,ambientIntensity:.11,fog:4603476},{t:1,skyTop:725030,skyBottom:1712960,sun:9348824,sunIntensity:.03,ambientIntensity:.06,fog:1317422}],s=[],r=[];for(const u of i.lamps??[])(u.isObject3D?u:u.object).traverse(p=>{p instanceof fl&&s.push({light:p,base:p.intensity||6});const v=p.material;v?.emissive&&v.emissiveIntensity>.5&&r.push({material:v,base:v.emissiveIntensity})});const a=new _t,o=new _t;let l=i.timeOfDay??.5,c=0;const h=u=>{let f=n[0],p=n[n.length-1];for(let g=0;g<n.length-1;g++)if(u>=n[g].t&&u<=n[g+1].t){f=n[g],p=n[g+1];break}const v=p.t===f.t?0:(u-f.t)/(p.t-f.t),m=(g,b)=>a.setHex(g).lerp(o.setHex(b),v).getHex();return{t:u,skyTop:m(f.skyTop,p.skyTop),skyBottom:m(f.skyBottom,p.skyBottom),sun:m(f.sun,p.sun),sunIntensity:f.sunIntensity+(p.sunIntensity-f.sunIntensity)*v,ambientIntensity:f.ambientIntensity+(p.ambientIntensity-f.ambientIntensity)*v,fog:m(f.fog,p.fog)}},d=()=>{const u=l,f=h(u),p=(u-.25)*Math.PI*2;if(c=Math.sin(p),i.sky?.setColors(f.skyTop,f.skyBottom),i.rig){const{sun:m,ambient:g,hemisphere:b}=i.rig;m.color.setHex(f.sun),m.intensity=f.sunIntensity,m.position.set(Math.cos(p)*40,Math.max(c,-.2)*45+6,16),g.intensity=f.ambientIntensity,b.intensity=f.ambientIntensity*1.4}i.scene?.fog&&"color"in i.scene.fog&&i.scene.fog.color.setHex(f.fog);const v=Math.min(1,Math.max(0,(.06-c)/.16));for(const{light:m,base:g}of s)m.intensity=g*v;for(const{material:m,base:g}of r)m.emissiveIntensity=.15*g+.85*g*v};return d(),{get timeOfDay(){return l},set timeOfDay(u){l=(u%1+1)%1,d()},get sunElevation(){return c},get isNight(){return c<0},update(u){l=(l+u/e)%1,d()},set(u){l=(u%1+1)%1,d()}}}var Na=new I;function Ua(i,t){if(i.isObject3D)return i.getWorldPosition(t);const e=i;return t.set(e.x,e.y,e.z)}function S1(i={}){const t=Math.max(i.max??6,1),e=Math.max(i.hysteresis??1.35,1),n=new Zt;n.name="light-budget";const s=[];for(let l=0;l<t;l++){const c=new fl(16777215,0,1,2);n.add(c),s.push(c)}const r=[],a=new I;return{group:n,max:t,get active(){return r.filter(l=>l.light!==null).length},register(l){const c={claim:l,score:0,light:null,released:!1};return r.push(c),{claim:l,get granted(){return c.light!==null},release(){c.released=!0,c.light&&(c.light.intensity=0,c.light=null);const h=r.indexOf(c);h>=0&&r.splice(h,1)}}},update:l=>{Ua(l,a);for(const f of r){if(f.released||f.claim.isLit?.()===!1){f.score=-1;continue}const p=Ua(f.claim.anchor,Na).distanceTo(a);f.score=(f.claim.priority??1)/(1+p)}const c=r.filter(f=>f.score>0).sort((f,p)=>p.score-f.score),h=c.length>t?c[t-1].score:0,d=[];for(const f of r)f.light&&f.score>0&&f.score*e>=h?d.push(f):f.light&&(f.light.intensity=0,f.light=null);d.sort((f,p)=>p.score-f.score);for(const f of d.splice(t))f.light&&(f.light.intensity=0),f.light=null;const u=s.filter(f=>!d.some(p=>p.light===f));for(const f of c){if(d.length>=t)break;if(f.light)continue;const p=u.pop();if(!p)break;f.light=p,d.push(f)}for(const f of d){const p=f.light;Ua(f.claim.anchor,Na),p.position.copy(Na),p.color.setHex(f.claim.color),p.intensity=f.claim.intensity,p.distance=f.claim.radius}}}}new _t(13621503);new _t;new qt;new _t;var _s=null;function ox(){if(_s)return _s;const i=64,t=new Uint8Array(i*i*4);for(let e=0;e<i;e++)for(let n=0;n<i;n++){const s=(n+.5)/i-.5,r=(e+.5)/i-.5,a=Math.min(Math.sqrt(s*s+r*r)*2,1),o=Math.pow(1-a,2.2),l=(e*i+n)*4;t[l]=t[l+1]=t[l+2]=255,t[l+3]=Math.round(o*255)}return _s=new il(t,i,i,ln),_s.needsUpdate=!0,_s}function lx(i,t){const e=new Gd(new Ch({map:ox(),color:i,transparent:!0,opacity:.55,blending:yi,depthWrite:!1}));return e.scale.setScalar(t),e}function cx(i){let t=!0;return{lit:()=>t,setLit(e){t=e,i.bulbs.forEach((n,s)=>n.emissiveIntensity=e?i.baseEmissive[s]:.04);for(const n of i.halos)n.visible=e}}}function hx(i={}){const t=i.style??"village",e=new ze(i.seed??1),n=i.palette??Re,s=new Zt;s.name=`street-light-${t}`;const r=new be({color:t==="village"?2895668:9147292,flatShading:!0,roughness:.6}),a=t==="village"?n.lampGlow:14674175,o=i.height??(t==="village"?e.range(2.7,3.1):e.range(4.2,4.8)),l=new be({color:a,emissive:a,emissiveIntensity:1.8}),c=new Me;let h=1.6;if(t==="village"){const f=new k(new xt(.045,.075,o,6),r);f.position.y=o/2;const p=new k(new kt(.3,.34,.3),r);p.position.y=o+.12;const v=new k(new Ln(.26,.18,4),r);v.rotation.y=Math.PI/4,v.position.y=o+.36;const m=new k(new yn(.09,8,6),l);m.position.y=o+.1,c.position.set(0,o+.05,0),s.add(f,p,v,m)}else{const f=new k(new xt(.055,.08,o,8),r);f.position.y=o/2;const p=new k(new kt(1.3,.07,.09),r);p.position.set(.6,o-.03,0);const v=new k(new kt(.62,.09,.2),r);v.position.set(1.15,o-.08,0);const m=new k(new kt(.54,.03,.14),l);m.position.set(1.15,o-.13,0),c.position.set(1.15,o-.35,0),h=2,s.add(f,p,v,m)}const d=lx(a,h);d.position.copy(c.position),s.add(d,c);const u=cx({bulbs:[l],halos:[d],baseEmissive:[1.8]});return{object:s,obstacleRadius:.25,get lit(){return u.lit()},setLit:u.setLit,claim:{anchor:c,color:a,intensity:t==="village"?5:7,radius:t==="village"?10:14,priority:1,isLit:u.lit}}}function ux(i,t={}){const e=t.width??1.8,n=t.surface??0,s=typeof n=="number"?()=>n:(T,_)=>n(T,_),r=t.loop??!1,a=t.palette??Re,o=i.map(T=>new I(T.x,0,"z"in T?T.z:0)),l=new cl(o,r,"centripetal"),c=l.getLength(),h=Math.max(8,Math.ceil(c*(t.samplesPerUnit??1))),d=[];for(let T=0;T<=h&&!(r&&T===h);T++){const _=l.getPoint(T/h);d.push(new I(_.x,s(_.x,_.z),_.z))}const u=r?d.length+1:d.length,f=new Float32Array(u*2*3),p=new I,v=new I;for(let T=0;T<u;T++){const _=d[T%d.length],E=d[(T-1+d.length)%d.length],P=d[(T+1)%d.length];!r&&T===0?p.subVectors(P,_):!r&&T===u-1?p.subVectors(_,E):p.subVectors(P,E),v.set(-p.z,0,p.x).normalize().multiplyScalar(e/2);const C=T*6;f[C]=_.x-v.x,f[C+1]=s(_.x-v.x,_.z-v.z)+.05,f[C+2]=_.z-v.z,f[C+3]=_.x+v.x,f[C+4]=s(_.x+v.x,_.z+v.z)+.05,f[C+5]=_.z+v.z}const m=[];for(let T=0;T<u-1;T++){const _=T*2;m.push(_,_+1,_+2,_+1,_+3,_+2)}const g=new le;g.setAttribute("position",new Qt(f,3)),g.setIndex(m),g.computeVertexNormals();const b=new k(g,new be({color:a.path,flatShading:!0,polygonOffset:!0,polygonOffsetFactor:-1}));b.name="path";const S=t.keepOutMargin??.6,x=d.filter((T,_)=>_%2===0||_===d.length-1).map(T=>({center:{x:T.x,z:T.z},radius:e/2+S})),A=e/2;return{mesh:b,route:d,keepOut:x,contains:(T,_)=>{const E=r?d.length:d.length-1;for(let P=0;P<E;P++){const C=d[P],L=d[(P+1)%d.length],B=L.x-C.x,H=L.z-C.z,O=B*B+H*H||1e-9,X=Math.max(0,Math.min(1,((T-C.x)*B+(_-C.z)*H)/O)),D=T-(C.x+B*X),q=_-(C.z+H*X);if(D*D+q*q<=A*A)return!0}return!1},loop:r}}new qt().makeScale(0,0,0);function w1(i={}){const t=i.seed??1,e=i.radius??2.2,n=i.color??5490672,s=i.dashes??14,r=new Zt;r.name="zone";const a=new ji({color:n,transparent:!0,opacity:.75}),o=new Zt,l=new kt(2*Math.PI*e/s*.55,.04,.16);for(let f=0;f<s;f++){const p=new k(l,a),v=f/s*Math.PI*2;p.position.set(Math.cos(v)*e,.03,Math.sin(v)*e),p.rotation.y=-v+Math.PI/2,o.add(p)}r.add(o);const c=new ji({color:n,transparent:!0,opacity:.28,side:tn}),h=new k(new kr(.01,e*.92,40),c);h.rotation.x=-Math.PI/2,h.position.y=.02,h.scale.setScalar(.001),r.add(h);let d=new ze(t).range(0,6);const u={center:r.position,radius:e};return{group:r,trigger:u,setProgress(f){const p=Number.isFinite(f)?Math.min(Math.max(f,0),1):0;h.scale.setScalar(Math.max(p,.001)),c.opacity=.18+p*.25},update(f){const p=Number.isFinite(f)?Math.max(f,0):0;d+=p,o.rotation.y=d*.6,a.opacity=.6+.2*Math.sin(d*3)}}}function A1(i={}){const t=i.seed??1,e=i.height??9,n=i.color??15976782,s=new Zt;s.name="beacon";const r=new ji({color:n,transparent:!0,opacity:.4,blending:yi,depthWrite:!1,side:tn});for(const[c,h,d]of[[.5,.14,.35],[.28,.06,.55]]){const u=new k(new xt(h,c,e,12,1,!0),r.clone());u.material.opacity=d,u.position.y=e/2,s.add(u)}const a=new k(new Xn(.62,.05,8,24),new ji({color:n}));a.rotation.x=Math.PI/2,a.position.y=.06,s.add(a);let o=new ze(t).range(0,6);const l={center:s.position,radius:1.2};return{group:s,trigger:l,update(c){const h=Number.isFinite(c)?Math.max(c,0):0;o+=h;const d=.85+.15*Math.sin(o*1.7);s.children.forEach((u,f)=>{f<2&&u.scale.set(d,1,d)}),s.rotation.y=o*.4}}}var dx=Object.defineProperty,T1=(i,t)=>{for(var e in t)dx(i,e,{get:t[e],enumerable:!0})},th=class{constructor(){this.delta=0,this.rawDelta=0,this.elapsed=0,this.frame=0,this.scale=1,this.maxDelta=1/10,this.last=-1}tick(i){this.last<0&&(this.last=i),this.rawDelta=(i-this.last)/1e3,this.last=i,this.delta=Math.min(this.rawDelta,this.maxDelta)*this.scale,this.elapsed+=this.delta,this.frame++}reset(){this.last=-1,this.delta=0,this.rawDelta=0,this.elapsed=0,this.frame=0}},fx=class{constructor(){this.listeners=new Map}on(i,t){let e=this.listeners.get(i);return e||(e=new Set,this.listeners.set(i,e)),e.add(t),()=>this.off(i,t)}once(i,t){const e=this.on(i,n=>{e(),t(n)});return e}off(i,t){this.listeners.get(i)?.delete(t)}emit(i,t){const e=this.listeners.get(i);if(e)for(const n of[...e])n(t)}clear(){this.listeners.clear()}},px=class extends Me{constructor(i="GameObject"){super(),this.components=[],this.tags=new Set,this.events=new fx,this.world=null,this.destroyed=!1,this.name=i}addComponent(i){return i.owner=this,this.components.push(i),i.onAttach(),i}getComponent(i){return this.components.find(t=>t instanceof i)}requireComponent(i){const t=this.getComponent(i);if(!t)throw new Error(`${this.name} is missing required component ${i.name}`);return t}removeComponent(i){const t=this.components.indexOf(i);t>=0&&(this.components.splice(t,1),i.onDetach())}update(i){for(const t of this.components)t.enabled&&t.update(i)}fixedUpdate(i){for(const t of this.components)t.enabled&&t.fixedUpdate(i)}destroy(){this.destroyed||(this.destroyed=!0,this.events.emit("destroyed",this))}dispose(){for(const i of this.components)i.onDetach();this.components.length=0,this.events.clear(),this.removeFromParent()}},mx=class{constructor(i=1/50,t=5){this.fixedDelta=i,this.maxSubSteps=t,this.accumulator=0}advance(i,t){this.accumulator+=i;let e=0;for(;this.accumulator>=this.fixedDelta&&e<this.maxSubSteps;)t(this.fixedDelta),this.accumulator-=this.fixedDelta,e++;this.accumulator>=this.fixedDelta&&(this.accumulator=this.accumulator%this.fixedDelta)}get alpha(){return this.accumulator/this.fixedDelta}reset(){this.accumulator=0}},gx=class{constructor(){this.scene=new Od,this.objects=[]}add(i){return i.world=this,this.objects.push(i),this.scene.add(i),i}spawn(i){return this.add(new px(i))}findByName(i){return this.objects.find(t=>t.name===i)}findByTag(i){return this.objects.filter(t=>t.tags.has(i))}remove(i){const t=this.objects.indexOf(i);t>=0&&this.objects.splice(t,1),i.world=null,this.scene.remove(i)}fixedUpdate(i){for(const t of this.objects)t.destroyed||t.fixedUpdate(i)}update(i){for(const t of this.objects)t.destroyed||t.update(i);for(let t=this.objects.length-1;t>=0;t--){const e=this.objects[t];e.destroyed&&(this.objects.splice(t,1),e.world=null,e.dispose())}}clear(){for(const i of this.objects)i.dispose();this.objects.length=0}},_x=class{constructor(i){this.pointer=new mt,this.pointerNdc=new mt,this.pointerDelta=new mt,this.wheelDelta=0,this.pointerDown=!1,this.leftStick=new mt,this.rightStick=new mt,this.gamepadConnected=!1,this.deadzone=.15,this.virtualAxis=new mt,this.virtualDown=new Set,this.virtualPressed=new Set,this.gpDown=[],this.gpPressed=[],this.down=new Set,this.pressed=new Set,this.released=new Set,this.listeners=[],this.target=i,this.listen(window,"keydown",t=>{const e=t.code;this.down.has(e)||this.pressed.add(e),this.down.add(e)}),this.listen(window,"keyup",t=>{const e=t.code;this.down.delete(e),this.released.add(e)}),this.listen(window,"blur",()=>this.down.clear()),this.listen(i,"pointermove",t=>{const e=t;this.pointerDelta.x+=e.movementX??0,this.pointerDelta.y+=e.movementY??0,this.updatePointer(e)}),this.listen(i,"wheel",t=>this.wheelDelta+=t.deltaY),this.listen(i,"pointerdown",t=>{this.pointerDown=!0,this.updatePointer(t)}),this.listen(window,"pointerup",()=>this.pointerDown=!1)}pressVirtual(i){this.virtualDown.has(i)||this.virtualPressed.add(i),this.virtualDown.add(i)}releaseVirtual(i){this.virtualDown.delete(i)}isDown(i){return this.down.has(i)||this.virtualDown.has(i)}wasPressed(i){return this.pressed.has(i)||this.virtualPressed.has(i)}wasReleased(i){return this.released.has(i)}gamepadDown(i){return this.gpDown[i]===!0}gamepadPressed(i){return this.gpPressed[i]===!0}moveAxis(i=new mt){return i.set((this.isDown("KeyD")||this.isDown("ArrowRight")?1:0)-(this.isDown("KeyA")||this.isDown("ArrowLeft")?1:0),(this.isDown("KeyW")||this.isDown("ArrowUp")?1:0)-(this.isDown("KeyS")||this.isDown("ArrowDown")?1:0)),i.add(this.leftStick).add(this.virtualAxis),i.lengthSq()>1?i.normalize():i}update(){const i=typeof navigator<"u"&&navigator.getGamepads?navigator.getGamepads():[];let t=null;for(const e of i)if(e){t=e;break}if(this.gamepadConnected=t!==null,!t){this.leftStick.set(0,0),this.rightStick.set(0,0),this.gpDown.length=0,this.gpPressed.length=0;return}this.applyDeadzone(this.leftStick.set(t.axes[0]??0,-(t.axes[1]??0))),this.applyDeadzone(this.rightStick.set(t.axes[2]??0,-(t.axes[3]??0))),this.gpPressed.length=t.buttons.length;for(let e=0;e<t.buttons.length;e++){const n=t.buttons[e].pressed;this.gpPressed[e]=n&&!this.gpDown[e],this.gpDown[e]=n}}lateUpdate(){this.pressed.clear(),this.released.clear(),this.virtualPressed.clear(),this.pointerDelta.set(0,0),this.wheelDelta=0}applyDeadzone(i){i.length()<this.deadzone&&i.set(0,0)}dispose(){for(const[i,t,e]of this.listeners)i.removeEventListener(t,e);this.listeners.length=0}updatePointer(i){const t=this.target.getBoundingClientRect();this.pointer.set(i.clientX-t.left,i.clientY-t.top),this.pointerNdc.set(this.pointer.x/t.width*2-1,-(this.pointer.y/t.height)*2+1)}listen(i,t,e){i.addEventListener(t,e),this.listeners.push([i,t,e])}},E1=class{constructor(i={}){this.world=new gx,this.time=new th,this.fixedTime=new th,this.updateCallbacks=[],this.fixedCallbacks=[],this.running=!1,this.frameHandle=0;const{canvas:t,parent:e,antialias:n=!0,autoResize:s=!0,maxPixelRatio:r=2,fixedDelta:a=1/50}=i;this.stepper=new mx(a),this.renderer=new $_({canvas:t,antialias:n}),t||(e??document.body).appendChild(this.renderer.domElement),this.camera=new je(60,1,.1,1e3),this.input=new _x(this.renderer.domElement);const o=()=>{const l=window.innerWidth,c=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,r)),this.renderer.setSize(l,c),this.camera instanceof je&&(this.camera.aspect=l/c,this.camera.updateProjectionMatrix())};s&&(o(),window.addEventListener("resize",o))}onUpdate(i){return this.updateCallbacks.push(i),()=>{const t=this.updateCallbacks.indexOf(i);t>=0&&this.updateCallbacks.splice(t,1)}}onFixedUpdate(i){return this.fixedCallbacks.push(i),()=>{const t=this.fixedCallbacks.indexOf(i);t>=0&&this.fixedCallbacks.splice(t,1)}}get fixedAlpha(){return this.stepper.alpha}start(){if(this.running)return;this.running=!0;const i=t=>{this.running&&(this.time.tick(t),this.step(this.time),this.frameHandle=requestAnimationFrame(i))};this.frameHandle=requestAnimationFrame(i)}stop(){this.running=!1,cancelAnimationFrame(this.frameHandle)}step(i){this.input.update(),this.stepper.advance(i.delta,t=>{this.fixedTime.delta=t,this.fixedTime.elapsed+=t,this.fixedTime.frame++;for(const e of this.fixedCallbacks)e(this.fixedTime);this.world.fixedUpdate(this.fixedTime)});for(const t of this.updateCallbacks)t(i);this.world.update(i),this.input.lateUpdate(),this.renderer.render(this.world.scene,this.camera)}dispose(){this.stop(),this.input.dispose(),this.world.clear(),this.renderer.dispose()}},R1=class{constructor(i,t,e,n={}){this.camera=i,this.target=t,this.input=e,this.pivot=new I,this.distance=n.distance??10,this.minDistance=n.minDistance??2,this.maxDistance=n.maxDistance??40,this.minPitch=n.minPitch??.1,this.maxPitch=n.maxPitch??1.4,this.sensitivity=n.sensitivity??.005,this.zoomSpeed=n.zoomSpeed??1,this.stiffness=n.stiffness??10,this.requireDrag=n.requireDrag??!0,this.lookOffset=n.lookOffset??new I(0,1,0),this.yaw=n.yaw??0,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,n.pitch??.8)),this.currentYaw=this.yaw,this.currentPitch=this.pitch,this.currentDistance=this.distance,this.apply()}update(i){(!this.requireDrag||this.input.pointerDown)&&(this.yaw-=this.input.pointerDelta.x*this.sensitivity,this.pitch+=this.input.pointerDelta.y*this.sensitivity,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch))),this.input.wheelDelta!==0&&(this.distance*=Math.exp(this.input.wheelDelta*.001*this.zoomSpeed),this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance)));const t=Math.min(1,this.stiffness*i);this.currentYaw+=(this.yaw-this.currentYaw)*t,this.currentPitch+=(this.pitch-this.currentPitch)*t,this.currentDistance+=(this.distance-this.currentDistance)*t,this.apply()}snap(){this.currentYaw=this.yaw,this.currentPitch=this.pitch,this.currentDistance=this.distance,this.apply()}apply(){this.pivot.copy(this.target.position).add(this.lookOffset);const i=this.currentDistance,t=Math.cos(this.currentPitch);this.camera.position.set(this.pivot.x+i*t*Math.sin(this.currentYaw),this.pivot.y+i*Math.sin(this.currentPitch),this.pivot.z+i*t*Math.cos(this.currentYaw)),this.camera.lookAt(this.pivot)}},Xi=1,gn=(i,t=4)=>{const e=10**t,n=Math.round(i*e)/e;return Object.is(n,-0)?0:n},Bn=(i,t,e=1e-4)=>Math.abs(i-t)<e;function vx(i,t){let e=(i^2654435769)>>>0;for(let n=0;n<t.length;n++)e=Math.imul(e^t.charCodeAt(n),16777619)>>>0;return e%2147483647||1}var C1=class lu{constructor(t={}){this.name=t.name,this.seed=t.seed??1,this.meta=t.meta,this.entities=cu(t.entities??[])}static parse(t,e={}){if(!t||typeof t!="object")throw new Error("Level.parse: not an object");const n={...t};if(n.format!=="gama.level")throw new Error(`Level.parse: not a gama level (format: ${String(n.format)})`);let s=Number(n.version??0);if(s>Xi)throw new Error(`Level.parse: file is version ${s}, this build understands ${Xi}`);let r=n;for(;s<Xi;){const a=e.migrations?.[s];if(!a)throw new Error(`Level.parse: no migration from version ${s}`);r=a(r),s+=1}return new lu({...r,version:Xi})}toJSON(){return nh({format:"gama.level",version:Xi,name:this.name,seed:this.seed,meta:this.meta,entities:this.entities})}instantiate(t,e,n={}){const s=this.seed,r=this,a=n.release!==!1,o=[];let l=[];const c=(f,p,v,m)=>{const g=t.expand(f),b=g.id??f.id??`${v}${f.kind}-${m}`,S=t.build(g,{id:b,kind:g.kind,seed:vx(s,b)});if(!S)return null;xx(S.object,g),p.add(S.object);const x={id:b,kind:f.kind,object:S.object,tags:g.tags??[],source:S.source,children:[]};return g.children?.forEach((A,M)=>{const T=c(A,S.object,`${b}/`,M);T&&x.children.push(T)}),x},h=()=>{l=[];const f=p=>{l.push(p);for(const v of p.children)f(v)};for(const p of o)p.placed&&f(p.placed)};this.entities.forEach((f,p)=>{o.push({spec:f,placed:c(f,e,"",p)})}),h();const d=f=>{let p=f;for(;o.some(v=>v.spec.id===p);)p=`${p}_`;return p};return{get objects(){return l},get specs(){return r.entities},byId:f=>l.find(p=>p.id===f),byTag:f=>l.filter(p=>p.tags.includes(f)),indexOf:f=>o.findIndex(p=>p.spec.id===f),add(f,p){const v={...f,id:d(f.id??`${f.kind}-${o.length}`)},m=p===void 0?o.length:Math.max(0,Math.min(p,o.length)),g=c(v,e,"",m);return o.splice(m,0,{spec:v,placed:g}),r.entities.splice(m,0,v),h(),g},remove(f){const p=o.findIndex(g=>g.placed?.id===f||g.spec.id===f);if(p<0)return null;const[v]=o.splice(p,1);v.placed?.object.removeFromParent(),v.placed&&a&&Bo(v.placed);const m=r.entities.indexOf(v.spec);return m>=0&&r.entities.splice(m,1),h(),v.spec},serialize(){return nh({format:"gama.level",version:Xi,name:r.name,seed:r.seed,meta:r.meta,entities:o.map(f=>f.placed?hu(f.placed,f.spec):f.spec)})},dispose(){for(const f of o)f.placed?.object.removeFromParent(),f.placed&&a&&Bo(f.placed);o.length=0,l=[]}}}};function Bo(i){for(const e of i.children)Bo(e);const t=i.source;if(t&&typeof t.dispose=="function"){t.dispose();return}i.object.traverse(e=>{const n=e;n.geometry?.dispose?.();const s=n.material;Array.isArray(s)?s.forEach(eh):s&&eh(s)})}function eh(i){const t=e=>{const n=e;n?.isTexture&&n.dispose?.()};for(const e of Object.values(i))t(e);for(const e of Object.values(i.uniforms??{}))t(e?.value);i.dispose?.()}function cu(i,t=""){const e=new Set;return i.map((n,s)=>{let r=n.id??`${t}${n.kind}-${s}`;for(;e.has(r);)r=`${r}_`;return e.add(r),{...n,id:r,children:n.children?cu(n.children,`${r}/`):void 0}})}function xx(i,t){t.at&&i.position.set(t.at[0],t.at[1],t.at[2]),typeof t.rot=="number"?i.rotation.set(0,t.rot,0):t.rot&&i.rotation.set(t.rot[0],t.rot[1],t.rot[2]),typeof t.scale=="number"?i.scale.setScalar(t.scale):t.scale&&i.scale.set(t.scale[0],t.scale[1],t.scale[2])}function hu(i,t){const e=i.object,n={id:i.id,kind:t.kind};(!Bn(e.position.x,0)||!Bn(e.position.y,0)||!Bn(e.position.z,0))&&(n.at=[gn(e.position.x),gn(e.position.y),gn(e.position.z)]);const{x:s,y:r,z:a}=e.rotation;Bn(s,0)&&Bn(a,0)?Bn(r,0)||(n.rot=gn(r,5)):n.rot=[gn(s,5),gn(r,5),gn(a,5)];const{x:o,y:l,z:c}=e.scale;return Bn(o,l)&&Bn(l,c)?Bn(o,1)||(n.scale=gn(o)):n.scale=[gn(o),gn(l),gn(c)],t.props&&Object.keys(t.props).length&&(n.props=t.props),i.tags.length&&(n.tags=[...i.tags]),t.children?.length&&(n.children=t.children.map((h,d)=>i.children[d]?hu(i.children[d],h):h)),n}function nh(i){const t={...i};for(const e of Object.keys(t))t[e]===void 0&&delete t[e];return t}var uu=i=>({p:[i.position.x,i.position.y,i.position.z],r:[i.rotation.x,i.rotation.y,i.rotation.z],s:[i.scale.x,i.scale.y,i.scale.z]}),yx=(i,t)=>{i.position.set(t.p[0],t.p[1],t.p[2]),i.rotation.set(t.r[0],t.r[1],t.r[2]),i.scale.set(t.s[0],t.s[1],t.s[2])},pi=(i,t)=>t>0?Math.round(i/t)*t:i,bx=class{constructor(i,t,e,n){this.label=i,this.level=e,this.before=n,this.after=new Map,this.key=t,this.capture()}capture(){for(const i of this.before.keys()){const t=this.level.byId(i);t&&this.after.set(i,uu(t.object))}}merge(i){i.after.forEach((t,e)=>this.after.set(e,t))}applyAll(i){i.forEach((t,e)=>{const n=this.level.byId(e);n&&yx(n.object,t)})}undo(){this.applyAll(this.before)}redo(){this.applyAll(this.after)}},Fa=class{constructor(i,t,e,n){this.label=i,this.level=t,this.specs=e,this.adding=n,this.key=null}place(){for(const i of[...this.specs].sort((t,e)=>t.index-e.index))this.level.add(i.spec,i.index)}pull(){for(const i of this.specs)this.level.remove(i.spec.id)}undo(){this.adding?this.pull():this.place()}redo(){this.adding?this.place():this.pull()}},P1=class{constructor(i,t={}){this.level=i,this.past=[],this.future=[],this.ids=[],this.openKey=null,this.ray=new Qf,this.pointer=new mt,this.snap=t.snap??0,this.snapAngle=t.snapAngle??0,this.limit=t.historyLimit??200,this.notify=t.onChange}get editable(){const i=new Set(this.level.specs.map(t=>t.id));return this.level.objects.filter(t=>i.has(t.id))}get selection(){return[...this.ids]}get selected(){return this.ids.map(i=>this.level.byId(i)).filter(i=>!!i)}get focused(){return this.ids.length===1?this.level.byId(this.ids[0]):void 0}isSelected(i){return this.ids.includes(i)}select(i,t={}){const e=i===null?[]:Array.isArray(i)?i:[i],n=new Set(this.editable.map(a=>a.id)),s=e.filter(a=>n.has(a));let r;if(t.toggle){r=[...this.ids];for(const a of s){const o=r.indexOf(a);o>=0?r.splice(o,1):r.push(a)}}else t.add?r=[...new Set([...this.ids,...s])]:r=s;r.length===this.ids.length&&r.every((a,o)=>a===this.ids[o])||(this.ids=r,this.endRun(),this.notify?.(this,"select"))}selectAll(){this.select(this.editable.map(i=>i.id))}selectNext(i=1){const t=this.editable;if(!t.length)return;const n=((t.findIndex(s=>s.id===this.ids[this.ids.length-1])+i)%t.length+t.length)%t.length;this.select(t[n].id)}resolve(i){const t=this.editable;for(let e=i??null;e;e=e.parent){const n=t.find(s=>s.object===e);if(n)return n}}pick(i,t,e){const n=this.editable;if(n.length){for(const s of n)s.object.updateWorldMatrix(!0,!0);this.ray.setFromCamera(this.pointer.set(i,t),e);for(const s of this.ray.intersectObjects(n.map(r=>r.object),!0)){const r=this.resolve(s.object);if(r)return r}}}move(i,t,e){this.transform("move","Move",n=>{const{position:s}=n;s.set(pi(s.x+i,this.snap),pi(s.y+t,this.snap),pi(s.z+e,this.snap))})}moveTo(i,t,e){this.transform("move","Move",n=>{n.position.set(pi(i,this.snap),pi(t,this.snap),pi(e,this.snap))})}rotate(i){this.transform("rotate","Rotate",t=>{t.rotation.y=pi(t.rotation.y+i,this.snapAngle)})}scaleBy(i){this.transform("scale","Scale",t=>{t.scale.multiplyScalar(i)})}setScale(i){this.transform("scale","Scale",t=>{t.scale.setScalar(i)})}ground(){this.transform("ground","Ground",i=>{i.position.y=0})}transform(i,t,e){const n=this.selected;if(!n.length)return;const s=new Map;for(const a of n)s.set(a.id,uu(a.object));for(const a of n)e(a.object);const r=`${i}:${this.ids.join(",")}`;this.push(new bx(t,r,this.level,s),"edit")}place(i,t={}){const e=this.level.add(i),n=this.level.specs[this.level.specs.length-1];return this.push(new Fa(`Add ${i.kind}`,this.level,[{spec:n,index:this.level.specs.length-1}],!0),"structure"),t.select!==!1&&this.select(n.id),e}duplicate(i=this.snap||1){const t=this.selected;if(!t.length)return[];const e=this.level.serialize().entities,n=[],s=[];for(const r of t){const a=e.find(d=>d.id===r.id);if(!a)continue;const o=Mx(a),l={...o,children:o.children?du(o.children):void 0,id:`${r.id}-copy`,at:[(a.at?.[0]??0)+i,a.at?.[1]??0,(a.at?.[2]??0)+i]},c=this.level.add(l),h=this.level.specs[this.level.specs.length-1];s.push({spec:h,index:this.level.specs.length-1}),c&&n.push(c)}return s.length?(this.push(new Fa(`Duplicate ${s.length}`,this.level,s,!0),"structure"),this.select(s.map(r=>r.spec.id)),n):[]}remove(){const i=this.ids.length?[...this.ids]:[];if(!i.length)return[];const t=this.level.serialize().entities,e=i.map(n=>({spec:t.find(s=>s.id===n),index:this.level.indexOf(n)})).filter(n=>n.spec&&n.index>=0);for(const n of e)this.level.remove(n.spec.id);return e.length?(this.ids=[],this.push(new Fa(`Delete ${e.length}`,this.level,e,!1),"structure"),e.map(n=>n.spec)):[]}setTags(i){const t=this.focused;if(!t)return;const e=this.level.specs.find(a=>a.id===t.id),n=[...t.tags],s=[...i],r=a=>{t.tags=[...a],e&&(e.tags=a.length?[...a]:void 0)};r(s),this.push({label:"Tag",key:null,undo:()=>r(n),redo:()=>r(s)},"edit")}setProps(i){const t=this.focused;if(!t)return null;const e=this.level.indexOf(t.id),n=this.level.serialize().entities.find(h=>h.id===t.id);if(e<0||!n)return null;const s={...n,props:Sx({...n.props,...i})},r={spec:n,index:e},a={spec:s,index:e},o=this.level,l=(h,d)=>{o.remove(h.spec.id),o.add(d.spec,d.index)};o.remove(n.id);const c=o.add(s,e);return this.push({label:"Edit props",key:null,undo:()=>l(a,r),redo:()=>l(r,a)},"structure"),this.select(t.id),c}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}get undoLabel(){return this.past[this.past.length-1]?.label??null}get redoLabel(){return this.future[this.future.length-1]?.label??null}undo(){const i=this.past.pop();return i?(i.undo(),this.future.push(i),this.endRun(),this.prune(),this.notify?.(this,"history"),!0):!1}redo(){const i=this.future.pop();return i?(i.redo(),this.past.push(i),this.endRun(),this.prune(),this.notify?.(this,"history"),!0):!1}commit(){this.endRun()}clearHistory(){this.past.length=0,this.future.length=0,this.endRun()}get historyLength(){return this.past.length}push(i,t){this.future.length=0;const e=this.past[this.past.length-1];i.key&&i.key===this.openKey&&e?.key===i.key&&e.merge?e.merge(i):(this.past.push(i),this.past.length>this.limit&&this.past.shift()),this.openKey=i.key,this.notify?.(this,t)}endRun(){this.openKey=null}prune(){const i=new Set(this.editable.map(e=>e.id)),t=this.ids.filter(e=>i.has(e));t.length!==this.ids.length&&(this.ids=t)}toJSON(){return this.level.serialize()}toText(){return`${JSON.stringify(this.toJSON(),null,2)}
`}};function du(i){return i.map(({id:t,...e})=>({...e,children:e.children?du(e.children):void 0}))}function Mx(i){return JSON.parse(JSON.stringify(i))}function Sx(i){const t={};for(const[e,n]of Object.entries(i))n!==void 0&&(t[e]=n);return t}var I1=class{constructor(i,t={}){this.root=null,this.cleanup=[];const e=t.show??"auto",n=typeof window<"u"&&("ontouchstart"in window||(navigator.maxTouchPoints??0)>0);if(e==="never"||e==="auto"&&!n||typeof document>"u")return;const s=t.parent??document.body,r=document.createElement("div");r.className="gama-touch",r.style.cssText="position:fixed;inset:0;z-index:20;pointer-events:none;touch-action:none;user-select:none;-webkit-user-select:none",s.appendChild(r),this.root=r,(t.joystick??!0)&&this.addJoystick(i,r,t.color);for(const a of t.buttons??[])this.addButton(i,r,a)}addJoystick(i,t,e="rgba(255,255,255,.16)"){const n=document.createElement("div");n.style.cssText=`position:absolute;left:26px;bottom:26px;width:132px;height:132px;border-radius:50%;background:${e};border:1px solid rgba(255,255,255,.32);pointer-events:auto;touch-action:none`;const s=document.createElement("div");s.style.cssText="position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.6);transition:transform .04s linear",n.appendChild(s),t.appendChild(n);const r=50;let a=-1;const o=(f,p)=>{const v=Math.hypot(f,p),m=v>r?r/v:1,g=f*m,b=p*m;s.style.transform=`translate(${g}px, ${b}px)`,i.virtualAxis.set(g/r,-b/r)},l=()=>{a=-1,s.style.transform="translate(0,0)",i.virtualAxis.set(0,0)},c=()=>n.getBoundingClientRect(),h=f=>{f.preventDefault(),a=f.pointerId;const p=c();o(f.clientX-(p.left+p.width/2),f.clientY-(p.top+p.height/2))},d=f=>{if(f.pointerId!==a)return;const p=c();o(f.clientX-(p.left+p.width/2),f.clientY-(p.top+p.height/2))},u=f=>{f.pointerId===a&&l()};n.addEventListener("pointerdown",h),window.addEventListener("pointermove",d),window.addEventListener("pointerup",u),window.addEventListener("pointercancel",u),this.cleanup.push(()=>{n.removeEventListener("pointerdown",h),window.removeEventListener("pointermove",d),window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",u),l()})}addButton(i,t,e){const n=document.createElement("div");n.textContent=e.label,n.style.cssText="position:absolute;width:68px;height:68px;border-radius:50%;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.36);color:#fff;font:700 22px system-ui;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;"+e.css,t.appendChild(n);const s=a=>{a.preventDefault(),i.pressVirtual(e.code),n.style.background="rgba(255,255,255,.34)"},r=()=>{i.releaseVirtual(e.code),n.style.background="rgba(255,255,255,.16)"};n.addEventListener("pointerdown",s),n.addEventListener("pointerup",r),n.addEventListener("pointercancel",r),n.addEventListener("pointerleave",r),this.cleanup.push(()=>{n.removeEventListener("pointerdown",s),n.removeEventListener("pointerup",r),n.removeEventListener("pointercancel",r),n.removeEventListener("pointerleave",r)})}get mounted(){return this.root!==null}dispose(){for(const i of this.cleanup)i();this.cleanup.length=0,this.root?.remove()}};function fu(i){return typeof i=="function"?i():i}var wx=class{constructor(i){this.target=i,this.force=new I}calculate(i){const t=this.force.copy(fu(this.target)).sub(i.position);return t.lengthSq()<1e-8?t.set(0,0,0):(t.setLength(i.maxSpeed),t.sub(i.velocity))}},Ax=class{constructor(i,t=3,e=.05){this.target=i,this.slowRadius=t,this.stopRadius=e,this.force=new I}calculate(i){const t=this.force.copy(fu(this.target)).sub(i.position),e=t.length();if(e<this.stopRadius)return t.copy(i.velocity).multiplyScalar(-8);const n=e<this.slowRadius?i.maxSpeed*(e/this.slowRadius):i.maxSpeed;return t.setLength(n),t.sub(i.velocity)}},L1=class{constructor(i,t=2){this.neighbors=i,this.radius=t,this.force=new I,this.push=new I}calculate(i){this.force.set(0,0,0);let t=0;for(const e of this.neighbors()){if(e===i)continue;const n=i.position.distanceTo(e.position);n>0&&n<this.radius&&(this.push.copy(i.position).sub(e.position).divideScalar(n*n),this.force.add(this.push),t++)}return t===0?this.force:(this.force.divideScalar(t),this.force.lengthSq()>1e-8&&this.force.setLength(i.maxSpeed).sub(i.velocity),this.force)}},D1=class{constructor(i,t=.5){this.path=i,this.waypointRadius=t,this.arrive=new Ax(()=>this.path.current()),this.seek=new wx(()=>this.path.current())}calculate(i){return this.path.isEmpty()?new I:(i.position.distanceTo(this.path.current())<this.waypointRadius&&this.path.advance(),!this.path.loop&&this.path.isAtLast()?this.arrive.calculate(i):this.seek.calculate(i))}},N1=class{constructor(i=[],t=!1){this.waypoints=i,this.loop=t,this.index=0}add(i){return this.waypoints.push(i),this}isEmpty(){return this.waypoints.length===0}current(){return this.waypoints[this.index]}isAtLast(){return this.index===this.waypoints.length-1}advance(){this.isEmpty()||(this.index<this.waypoints.length-1?this.index++:this.loop&&(this.index=0))}reset(){this.index=0}},U1=class{constructor(i,t,e={}){this.camera=i,this.target=t,this.desired=new I,this.lookTarget=new I,this.offset=e.offset??new I(0,8,12),this.lookOffset=e.lookOffset??new I(0,1,0),this.stiffness=e.stiffness??5,this.snap()}snap(){this.camera.position.copy(this.target.position).add(this.offset),this.look()}update(i){this.desired.copy(this.target.position).add(this.offset),this.camera.position.lerp(this.desired,Math.min(1,this.stiffness*i)),this.look()}look(){this.lookTarget.copy(this.target.position).add(this.lookOffset),this.camera.lookAt(this.lookTarget)}};function Tx(i){let t=i>>>0||1;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Ne=(i,t,e=.003)=>[[0,0],[e,i],[t,0]],Ex=(i,t,e=.35)=>[[0,0],[t*e,i],[t,0]],en=i=>[[0,i]],Ie=(i,t,e)=>t*(1+(i()*2-1)*e),li=i=>i>0?i<1?i:1:0,Rx={grass:{filter:"lowpass",freq:750,q:.7,duration:.09,gain:.5},dirt:{filter:"lowpass",freq:950,q:.8,duration:.08,gain:.55},sand:{filter:"bandpass",freq:1400,q:.6,duration:.15,gain:.45},wood:{filter:"bandpass",freq:1100,q:1.1,duration:.1,gain:.6},stone:{filter:"highpass",freq:2100,q:.7,duration:.055,gain:.65},metal:{filter:"highpass",freq:2600,q:.9,duration:.06,gain:.55},water:{filter:"bandpass",freq:1600,q:.9,duration:.28,gain:.55}};function Cx(i,t="grass",e=1){const n=Rx[t],s=Ie(i,n.freq,.12)/Math.sqrt(Math.max(e,.25)),r=Ie(i,n.gain,.18)*Math.sqrt(Math.max(e,.25)),a=Ie(i,n.duration,.1)*(e>1?1.15:1),o=t==="water"?[[0,s*1.4],[a,s*.45]]:en(s),l=[{kind:"noise",color:t==="water"?"white":"pink",filter:{type:n.filter,freq:o,q:n.q},gain:Ne(r,a)}];if(t==="wood"){const h=Ie(i,120,.15);l.push({kind:"osc",wave:"sine",freq:[[0,h*1.3],[.06,h]],gain:Ne(r*.7,Math.min(a*1.2,.12))})}else t==="metal"&&l.push({kind:"osc",wave:"triangle",freq:en(Ie(i,1700,.2)),gain:Ne(r*.25,.22)});return{duration:Math.max(...l.map(h=>h.gain[h.gain.length-1][0])),layers:l,caption:`footstep on ${t}`}}var Px={soft:{thump:120,noiseFilter:"lowpass",noiseFreq:500,ring:[]},wood:{thump:175,noiseFilter:"bandpass",noiseFreq:900,ring:[]},stone:{thump:220,noiseFilter:"highpass",noiseFreq:1500,ring:[]},metal:{thump:250,noiseFilter:"highpass",noiseFreq:1800,ring:[4.2,11.6]}};function Ix(i,t="wood",e=.7){const n=Px[t],s=li(e),r=Math.sqrt(s)*.85,a=Ie(i,n.thump,.12),o=.09+s*.08,l=[{kind:"osc",wave:"sine",freq:[[0,a],[o,a*.4]],gain:Ne(r,o)},{kind:"noise",color:"white",filter:{type:n.noiseFilter,freq:en(Ie(i,n.noiseFreq,.15)),q:.8},gain:Ne(r*.7,.03+s*.03)}];for(const h of n.ring)l.push({kind:"osc",wave:"triangle",freq:en(Ie(i,a*h,.05)),gain:Ne(r*.22,.25+s*.3)});return{duration:Math.max(...l.map(h=>h.gain[h.gain.length-1][0])),layers:l,caption:`${t} impact`}}function Lx(i,t=.9){const e=li(t),n=.4+Math.sqrt(e)*.55;return{duration:.24,caption:"sharp crack",layers:[{kind:"noise",color:"white",filter:{type:"highpass",freq:en(Ie(i,2300,.1)),q:.7},gain:Ne(n,.028,.001)},{kind:"noise",color:"white",filter:{type:"bandpass",freq:en(Ie(i,1250,.12)),q:1.4},gain:Ne(n*.7,.07,.002)},{kind:"osc",wave:"triangle",freq:en(Ie(i,2500,.15)),gain:Ne(n*.3,.09,.002)},{kind:"osc",wave:"sine",freq:[[0,150],[.07,62]],gain:Ne(n*.8,.09,.002)}]}}function Dx(i,t=.7){const e=li(t),n=.4-e*.18,s=Ie(i,550+e*900,.12);return{duration:n,caption:"whoosh",layers:[{kind:"noise",color:"pink",filter:{type:"bandpass",freq:[[0,s*.45],[n*.45,s],[n,s*.5]],q:1.6},gain:Ex(.3+e*.4,n)}]}}function Nx(i,t=.6){const e=li(t),n=.25+e*.35;return{duration:n,caption:"splash",layers:[{kind:"noise",color:"white",filter:{type:"bandpass",freq:[[0,Ie(i,2300,.15)],[n,480]],q:.9},gain:Ne(.35+e*.4,n,.008)},{kind:"osc",wave:"sine",freq:[[0,220],[n*.6,90]],gain:Ne(.25*e,n*.6,.01)}]}}function Ux(i){const t=1+(i()*2-1)*.02,e=988*t,n=1319*t;return{duration:.38,caption:"coin",layers:[{kind:"osc",wave:"square",freq:[[0,e],[.07,e],[.0701,n]],gain:[[0,0],[.004,.16],[.07,.14],[.38,0]]},{kind:"osc",wave:"sine",freq:en(n*2),gain:[[0,0],[.075,0],[.08,.05],[.34,0]]}]}}function Fx(i){const t=Ie(i,900,.1);return{duration:.12,caption:"pop",layers:[{kind:"osc",wave:"sine",freq:[[0,t*.35],[.06,t]],gain:Ne(.35,.09,.004)},{kind:"noise",color:"white",filter:{type:"highpass",freq:en(3e3),q:.7},gain:Ne(.12,.03,.001)}]}}function Ox(i){const t=Ie(i,230,.12);return{duration:.42,caption:"boing",layers:[{kind:"osc",wave:"sine",freq:[[0,t*.8],[.07,t*1.6],[.16,t*.9],[.26,t*1.15],[.42,t]],gain:Ne(.5,.42,.005)},{kind:"osc",wave:"triangle",freq:[[0,t*1.6],[.07,t*3.2],[.16,t*1.8],[.42,t*2]],gain:Ne(.12,.3,.005)}]}}var zo=[523.25,587.33,659.25,783.99,880];function kx(i,t=0){const e=zo[Math.abs(Math.round(t))%zo.length],n=Ie(i,e,.004);return{duration:.6,caption:"chime",layers:[{kind:"osc",wave:"triangle",freq:en(n),gain:Ne(.3,.6,.004)},{kind:"osc",wave:"sine",freq:en(n*2),gain:Ne(.1,.45,.004)}]}}function Bx(i){const t=[];return[0,2,3].forEach((e,n)=>{const s=n*.11,r=Ie(i,zo[e],.004),a=(o,l)=>[[0,0],...s>0?[[s,0]]:[],[s+.006,o],[s+l,0]];t.push({kind:"osc",wave:"triangle",freq:en(r),gain:a(.26,.55)}),t.push({kind:"osc",wave:"sine",freq:en(r*2),gain:a(.08,.4)})}),{duration:.22+.55,layers:t,caption:"success"}}function zx(i){const t=Ie(i,392,.004),e=Ie(i,311.1,.004);return{duration:.55,caption:"fail",layers:[{kind:"osc",wave:"triangle",freq:[[0,t],[.16,t],[.1601,e]],gain:[[0,0],[.006,.22],[.16,.18],[.55,0]]}]}}function Vx(i){return{duration:.03,caption:"tick",layers:[{kind:"osc",wave:"sine",freq:en(Ie(i,2e3,.05)),gain:Ne(.12,.03,.001)}]}}function Hx(i){const t=Ie(i,700,.05);return{duration:.08,caption:"blip",layers:[{kind:"osc",wave:"square",freq:[[0,t],[.06,t*1.35]],gain:Ne(.1,.08,.002)}]}}function Gx(i,t=.5){const e=Number.isFinite(i)?Math.min(Math.max(i,500),8e3):800,n=li(t),s=e/60*2;return{fundamentals:[s,s/2,s*1.98],gains:[.16+n*.1,.2+n*.06,.05+n*.09],noiseGain:.02+n*.1+e/8e3*.05,noiseFreq:700+e*.16}}function Wx(i){const t=li(i);return{gain:Math.pow(t,1.4)*.5,cutoff:240+t*660,gustDepth:t*180,gustRate:.1+t*.3}}function Xx(i){const t=li(i);return{gain:Math.pow(t,1.2)*.4,cutoff:1400-t*700,patterGain:t*.14}}function Oa(i){const t=li(i);return{gain:.08+Math.pow(t,1.5)*.5,formants:[620+t*160,1200+t*320,2600+t*300],q:4,chatterRate:.35+t*1.3}}function qx(i,t,e){if(e==="white"){for(let a=0;a<i.length;a++)i[a]=t()*2-1;return}let n=0,s=0,r=0;for(let a=0;a<i.length;a++){const o=t()*2-1;n=.99765*n+o*.099046,s=.963*s+o*.2965164,r=.57*r+o*1.0526913,i[a]=(n+s+r+o*.1848)*.28}}var F1=class{constructor(i={}){this.ctx=null,this.master=null,this.comp=null,this.buses=null,this.busVolume={sfx:1,ambient:1,ui:1},this.noise=new Map,this.captionListeners=new Set,this.captionLog=[],this.live=new Set,this.unlockCleanup=null,this.rand=Tx(i.seed??1),this.masterVolume=i.volume??.8,this.ownsContext=!i.context,i.context&&(this.ctx=i.context)}get context(){if(!this.ctx){const i=globalThis.AudioContext??globalThis.webkitAudioContext;if(!i)throw new Error("Soundboard: no AudioContext in this environment — pass one in options (an OfflineAudioContext works for headless rendering).");this.ctx=new i}return this.ctx}unlock(i=null){const t=i??(typeof window>"u"?null:window);if(!t||this.unlockCleanup)return;const e=()=>{this.unlockCleanup?.(),this.resume()};for(const n of["pointerdown","keydown","touchstart"])t.addEventListener(n,e);this.unlockCleanup=()=>{for(const n of["pointerdown","keydown","touchstart"])t.removeEventListener(n,e);this.unlockCleanup=null}}async resume(){const i=this.context;i.state==="suspended"&&typeof i.resume=="function"&&await i.resume()}setVolume(i){this.masterVolume=i,this.master&&this.master.gain.setTargetAtTime(i,this.context.currentTime,.03)}setBusVolume(i,t){this.busVolume[i]=t,this.buses&&this.buses[i].gain.setTargetAtTime(t,this.context.currentTime,.03)}duck(i="ambient",t=.3,e=.8){const n=this.ensureGraph().buses[i].gain,s=this.context.currentTime,r=this.busVolume[i];n.cancelScheduledValues(s),n.setValueAtTime(n.value,s),n.linearRampToValueAtTime(r*t,s+.06),n.setValueAtTime(r*t,s+Math.max(e-.25,.06)),n.linearRampToValueAtTime(r,s+Math.max(e,.1))}createAnalyser(i=128){this.ensureGraph();const t=this.context.createAnalyser();return t.fftSize=i,this.comp?.connect(t),t}onCaption(i){return this.captionListeners.add(i),()=>this.captionListeners.delete(i)}captions(){return this.captionLog}footstep(i="grass",t={}){this.play(Cx(this.rand,i,t.weight??1),t)}impact(i="wood",t=.7,e){this.play(Ix(this.rand,i,t),e)}crack(i=.9,t){this.play(Lx(this.rand,i),t)}whoosh(i=.7,t){this.play(Dx(this.rand,i),t)}splash(i=.6,t){this.play(Nx(this.rand,i),t)}coin(i){this.play(Ux(this.rand),i)}pop(i){this.play(Fx(this.rand),i)}boing(i){this.play(Ox(this.rand),i)}chime(i=0,t){this.play(kx(this.rand,i),{bus:"ui",...t})}success(i){this.play(Bx(this.rand),{bus:"ui",...i})}fail(i){this.play(zx(this.rand),{bus:"ui",...i})}tick(i){this.play(Vx(this.rand),{bus:"ui",...i})}blip(i){this.play(Hx(this.rand),{bus:"ui",...i})}play(i,t={}){const e=t.bus??"sfx",{buses:n}=this.ensureGraph(),s=this.context,r=s.currentTime+.005,a=this.route(t.at,n[e]),o=t.volume??1;for(const l of i.layers){const c=s.createGain();if(this.schedule(c.gain,l.gain,r,o,!1),c.connect(a),l.kind==="osc"){const h=s.createOscillator();h.type=l.wave,this.schedule(h.frequency,l.freq,r,1,!0),h.connect(c),h.start(r),h.stop(r+i.duration+.05)}else{const h=s.createBufferSource();h.buffer=this.noiseBuffer(l.color),h.loop=!0;const d=s.createBiquadFilter();d.type=l.filter.type,d.Q.value=l.filter.q,this.schedule(d.frequency,l.filter.freq,r,1,!0),h.connect(d),d.connect(c),h.start(r,this.rand()*(h.buffer.duration-.5)),h.stop(r+i.duration+.05)}}t.caption!==!1&&this.emitCaption(t.caption??i.caption,e,t.at)}createEngine(i={}){const t=new Yx(this,i);return this.live.add(t),this.emitCaption("engine running","sfx",i.at),t}createWind(i={}){const t=new ih(this,"wind",i.volume??1);return this.live.add(t),this.emitCaption("wind","ambient"),t}createRain(i={}){const t=new ih(this,"rain",i.volume??1);return this.live.add(t),this.emitCaption("rain","ambient"),t}createCrowd(i={}){const t=new $x(this,i.volume??1);return this.live.add(t),this.emitCaption("crowd murmur","ambient"),t}updateListener(i,t={x:0,y:0,z:-1},e={x:0,y:1,z:0}){const n=this.context.listener;if(!n)return;const s=this.context.currentTime;"positionX"in n&&n.positionX?(n.positionX.setTargetAtTime(i.x,s,.02),n.positionY.setTargetAtTime(i.y,s,.02),n.positionZ.setTargetAtTime(i.z,s,.02),n.forwardX.setTargetAtTime(t.x,s,.02),n.forwardY.setTargetAtTime(t.y,s,.02),n.forwardZ.setTargetAtTime(t.z,s,.02),n.upX.setTargetAtTime(e.x,s,.02),n.upY.setTargetAtTime(e.y,s,.02),n.upZ.setTargetAtTime(e.z,s,.02)):"setPosition"in n&&(n.setPosition(i.x,i.y,i.z),n.setOrientation(t.x,t.y,t.z,e.x,e.y,e.z))}dispose(){this.unlockCleanup?.();for(const t of[...this.live])t.stop(.05);this.live.clear();const i=this.ctx;i&&this.ownsContext&&typeof i.close=="function"&&i.close()}ensureGraph(){if(this.master&&this.buses)return{master:this.master,buses:this.buses};const i=this.context,t=i.createGain();t.gain.value=this.masterVolume;const e=i.createDynamicsCompressor();t.connect(e),e.connect(i.destination),this.comp=e;const n=()=>{const s=i.createGain();return s.connect(t),s};return this.master=t,this.buses={sfx:n(),ambient:n(),ui:n()},{master:t,buses:this.buses}}route(i,t){if(!i)return t;const n=this.context.createPanner();return n.panningModel="equalpower",n.distanceModel="inverse",n.refDistance=4,"positionX"in n&&n.positionX?(n.positionX.value=i.x,n.positionY.value=i.y,n.positionZ.value=i.z):"setPosition"in n&&n.setPosition(i.x,i.y,i.z),n.connect(t),n}schedule(i,t,e,n,s){const r=a=>s?Math.max(a*n,1e-4):a*n;i.setValueAtTime(r(t[0][1]),e+t[0][0]);for(let a=1;a<t.length;a++){const[o,l]=t[a];s?i.exponentialRampToValueAtTime(r(l),e+o):i.linearRampToValueAtTime(r(l),e+o)}}noiseBuffer(i){const t=this.noise.get(i);if(t)return t;const e=this.context,n=e.createBuffer(1,Math.floor(e.sampleRate*2),e.sampleRate);return qx(n.getChannelData(0),this.rand,i),this.noise.set(i,n),n}emitCaption(i,t,e){const n={text:i,bus:t,at:e,time:this.ctx?this.ctx.currentTime:0};this.captionLog.push(n),this.captionLog.length>32&&this.captionLog.shift();for(const s of this.captionListeners)s(n)}forget(i){this.live.delete(i)}random(){return this.rand()}},Yx=class{constructor(i,t){this.board=i,this.stopped=!1,this.rpm=800;const e=i.context,{buses:n}=i.ensureGraph();this.out=e.createGain(),this.out.gain.value=t.volume??1,this.out.connect(i.route(t.at,n.sfx));const s=["sawtooth","sine","square"];this.oscs=s.map(o=>{const l=e.createOscillator();return l.type=o,l}),this.oscGains=this.oscs.map(o=>{const l=e.createGain();return l.gain.value=0,o.connect(l),l.connect(this.out),l});const r=e.createBufferSource();r.buffer=i.noiseBuffer("white"),r.loop=!0,this.noiseFilter=e.createBiquadFilter(),this.noiseFilter.type="bandpass",this.noiseFilter.Q.value=.8,this.noiseGain=e.createGain(),this.noiseGain.gain.value=0,r.connect(this.noiseFilter),this.noiseFilter.connect(this.noiseGain),this.noiseGain.connect(this.out);const a=e.currentTime;for(const o of this.oscs)o.start(a);r.start(a,i.random()),this.sources=[...this.oscs,r],this.set(this.rpm,.2)}set(i,t=.5){if(this.stopped)return;this.rpm=i;const e=this.board.context.currentTime,n=Gx(i,t);n.fundamentals.forEach((s,r)=>{this.oscs[r].frequency.setTargetAtTime(s,e,.04),this.oscGains[r].gain.setTargetAtTime(n.gains[r],e,.08)}),this.noiseFilter.frequency.setTargetAtTime(n.noiseFreq,e,.08),this.noiseGain.gain.setTargetAtTime(n.noiseGain,e,.08)}stop(i=.4){if(this.stopped)return;this.stopped=!0;const t=this.board.context.currentTime;this.out.gain.setTargetAtTime(0,t,Math.max(i/4,.01));for(const e of this.sources)e.stop(t+i+.1);this.board.forget(this)}},ih=class{constructor(i,t,e){this.board=i,this.kind=t,this.volume=e,this.patter=null,this.lfoDepth=null,this.lfo=null,this.sources=[],this.stopped=!1;const n=i.context,{buses:s}=i.ensureGraph();this.gain=n.createGain(),this.gain.gain.value=0,this.gain.connect(s.ambient),this.filter=n.createBiquadFilter(),this.filter.type=t==="wind"?"lowpass":"highpass",this.filter.Q.value=.6;const r=n.createBufferSource();if(r.buffer=i.noiseBuffer(t==="wind"?"pink":"white"),r.loop=!0,r.connect(this.filter),this.filter.connect(this.gain),r.start(n.currentTime,i.random()),this.sources.push(r),t==="wind")this.lfo=n.createOscillator(),this.lfo.frequency.value=.15,this.lfoDepth=n.createGain(),this.lfoDepth.gain.value=0,this.lfo.connect(this.lfoDepth),this.lfoDepth.connect(this.filter.frequency),this.lfo.start(n.currentTime),this.sources.push(this.lfo);else{const a=n.createBufferSource();a.buffer=i.noiseBuffer("white"),a.loop=!0;const o=n.createBiquadFilter();o.type="bandpass",o.frequency.value=4200,o.Q.value=2.2,this.patter=n.createGain(),this.patter.gain.value=0,a.connect(o),o.connect(this.patter),this.patter.connect(this.gain),a.start(n.currentTime,i.random()),this.sources.push(a)}this.set(.4)}set(i){if(this.stopped)return;const t=this.board.context.currentTime;if(this.kind==="wind"){const e=Wx(i);this.gain.gain.setTargetAtTime(e.gain*this.volume,t,.8),this.filter.frequency.setTargetAtTime(e.cutoff,t,.8),this.lfoDepth?.gain.setTargetAtTime(e.gustDepth,t,.8),this.lfo?.frequency.setTargetAtTime(e.gustRate,t,.8)}else{const e=Xx(i);this.gain.gain.setTargetAtTime(e.gain*this.volume,t,.8),this.filter.frequency.setTargetAtTime(e.cutoff,t,.8),this.patter?.gain.setTargetAtTime(e.patterGain,t,.8)}}stop(i=1.2){if(this.stopped)return;this.stopped=!0;const t=this.board.context.currentTime;this.gain.gain.setTargetAtTime(0,t,Math.max(i/4,.01));for(const e of this.sources)e.stop(t+i+.1);this.board.forget(this)}},$x=class{constructor(i,t){this.board=i,this.volume=t,this.sources=[],this.excitement=.25,this.stopped=!1;const e=i.context,{buses:n}=i.ensureGraph();this.gain=e.createGain(),this.gain.gain.value=0,this.gain.connect(n.ambient);const s=e.createBufferSource();s.buffer=i.noiseBuffer("pink"),s.loop=!0,this.formants=[0,1,2].map(()=>{const r=e.createBiquadFilter();return r.type="bandpass",s.connect(r),r.connect(this.gain),r}),s.start(e.currentTime,i.random()),this.sources.push(s),this.lfo=e.createOscillator(),this.lfoDepth=e.createGain(),this.lfo.connect(this.lfoDepth),this.lfoDepth.connect(this.gain.gain),this.lfo.start(e.currentTime),this.sources.push(this.lfo),this.set(this.excitement)}set(i){if(this.stopped)return;this.excitement=i;const t=this.board.context.currentTime,e=Oa(i);this.gain.gain.setTargetAtTime(e.gain*this.volume,t,1.2),e.formants.forEach((n,s)=>{this.formants[s].frequency.setTargetAtTime(n,t,1.2),this.formants[s].Q.setTargetAtTime(e.q,t,1.2)}),this.lfo.frequency.setTargetAtTime(e.chatterRate,t,1.2),this.lfoDepth.gain.setTargetAtTime(e.gain*this.volume*.35,t,1.2)}swell(i=1,t=2.5){if(this.stopped)return;const e=this.board.context.currentTime,n=Oa(i),s=Oa(this.excitement),r=this.gain.gain;r.cancelScheduledValues(e),r.setValueAtTime(r.value,e),r.linearRampToValueAtTime(n.gain*this.volume,e+t*.25),r.setValueAtTime(n.gain*this.volume,e+t*.55),r.linearRampToValueAtTime(s.gain*this.volume,e+t),this.board.emitCaption("crowd roars","ambient")}stop(i=1.2){if(this.stopped)return;this.stopped=!0;const t=this.board.context.currentTime;this.gain.gain.setTargetAtTime(0,t,Math.max(i/4,.01));for(const e of this.sources)e.stop(t+i+.1);this.board.forget(this)}},Kx={title:["playing"],playing:["paused","results","title"],paused:["playing","title"],results:["title","playing"]},Jx=class{constructor(i={}){this.options=i,this.current=i.initial??"title"}get state(){return this.current}get playing(){return this.current==="playing"}to(i){return i===this.current||!Kx[this.current].includes(i)?!1:(this.options.onExit?.[this.current]?.(),this.current=i,this.options.onEnter?.[i]?.(),!0)}togglePause(){return this.current==="playing"?this.to("paused"):this.current==="paused"?this.to("playing"):!1}gate(i){return this.playing&&Number.isFinite(i)?Math.max(i,0):0}},Zx=class{constructor(){this.map=new Map}getItem(i){return this.map.get(i)??null}setItem(i,t){this.map.set(i,t)}removeItem(i){this.map.delete(i)}},sh=class{constructor(i,t={}){this.key=`gama:${i}`,this.version=t.version??1,this.storage=t.storage??(typeof localStorage>"u"?new Zx:localStorage)}get exists(){return this.load()!==null}save(i){const t={v:this.version,savedAt:Date.now(),data:i};this.storage.setItem(this.key,JSON.stringify(t))}load(){const i=this.storage.getItem(this.key);if(i===null)return null;try{const t=JSON.parse(i);return!t||t.v!==this.version?null:t.data??null}catch{return null}}savedAt(){const i=this.storage.getItem(this.key);if(i===null)return null;try{const t=JSON.parse(i);return t.v===this.version?t.savedAt:null}catch{return null}}clear(){this.storage.removeItem(this.key)}};new _t;new qt;new qt().makeScale(0,0,0);var Qx=class{constructor(){this.factories=new Map,this.prefabs=new Map}define(i,t,e={}){return this.factories.set(i,{factory:t,options:e}),this}defineAll(i){for(const[t,e]of Object.entries(i))this.define(t,e);return this}prefab(i,t,e={}){return this.prefabs.set(i,{spec:t,options:e}),this}has(i){return this.factories.has(i)||this.prefabs.has(i)}get kinds(){return[...new Set([...this.factories.keys(),...this.prefabs.keys()])].sort()}info(i){const t=this.factories.get(i);if(t)return{kind:i,label:t.options.label??i,group:t.options.group,fields:t.options.fields??[],defaults:t.options.defaults??{},prefab:!1};const e=this.prefabs.get(i);if(!e)return;const n=this.info(this.expand({kind:i}).kind);return{kind:i,label:e.options.label??i,group:e.options.group??n?.group,fields:e.options.fields??n?.fields??[],defaults:{...n?.defaults,...this.expand({kind:i}).props},prefab:!0}}list(){return[...this.factories.keys(),...this.prefabs.keys()].map(i=>this.info(i))}expand(i){const t=this.prefabs.get(i.kind);if(!t)return i;const e=t.spec,n=this.expand({...e,id:i.id??e.id});return{...n,id:i.id??n.id,at:i.at??n.at,rot:i.rot??n.rot,scale:i.scale??n.scale,props:{...n.props,...i.props},tags:[...n.tags??[],...i.tags??[]],children:[...n.children??[],...i.children??[]]}}build(i,t){const e=this.factories.get(i.kind);if(!e)return null;const n={...e.options.defaults,...i.props},s=e.factory(n,t);if(!s)return null;const r=s instanceof Me?s:s.object;return r?{object:r,source:s}:null}},jx='button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',O1=class{constructor(i={}){this.screens=new Map,this.cleanups=[],this.current="title",this.starting=!1,this.options=i;const t=i.document??(typeof document>"u"?null:document);if(!t)throw new Error("Shell: no document in this environment — pass one in options.");this.doc=t,this.root=i.root??t.body;const e=i.name??"game",n=i.version??1;this.settingsSlot=i.settings?new sh(`${e}.settings`,{version:n,storage:i.storage}):null,this.settings={...i.settings??{},...this.settingsSlot?.load()??{}},this.flow=new Jx({initial:"title",onEnter:{title:()=>this.show("title"),playing:()=>this.show("playing"),paused:()=>{this.show("paused"),i.onPause?.(!0)},results:()=>this.show("results")},onExit:{paused:()=>i.onPause?.(!1)}}),this.collectScreens(),this.bindControls(),this.bindSettings(),this.bindKeys(),this.show("title")}get state(){return this.flow.state}gate(i){return this.flow.gate(i)}show(i){this.current=i;for(const[t,e]of this.screens){const n=t===i;e.hidden=!n,e.classList?.toggle("hidden",!n),e.setAttribute&&e.setAttribute("aria-hidden",n?"false":"true")}this.focusInto(this.screens.get(String(i)))}get screen(){return this.current}async start(){if(!this.starting){this.starting=!0;try{this.show("loading"),await this.breathe(),this.options.onTeardown?.(),await this.options.onStart?.(),this.flow.to("playing")}catch(i){this.options.onError?.(i),this.flow.to("title"),this.show("title")}finally{this.starting=!1}}}pause(i){const t=this.flow.state==="paused";i!==t&&this.flow.togglePause()}finish(){this.flow.state==="paused"&&this.flow.togglePause(),this.options.onFinish?.(),this.flow.to("results")}toTitle(){this.options.onTeardown?.(),this.flow.to("title"),this.show("title")}saveSettings(){this.settingsSlot?.save(this.settings),this.options.onSettings?.(this.settings)}record(i,t=1){return new sh(`${this.options.name??"game"}.${i}`,{version:t,storage:this.options.storage})}dispose(){for(const i of this.cleanups)i();this.cleanups.length=0}collectScreens(){const i=this.root.querySelectorAll?.("[data-screen]")??[];for(const t of Array.from(i)){const e=t.getAttribute("data-screen");e&&this.screens.set(e,t)}}on(i,t,e){i?.addEventListener&&(i.addEventListener(t,e),this.cleanups.push(()=>i.removeEventListener?.(t,e)))}bindControls(){const i={play:()=>void this.start(),again:()=>void this.start(),resume:()=>this.pause(!1),pause:()=>this.pause(),quit:()=>this.finish(),title:()=>this.toTitle()};for(const t of this.queryAll("[data-shell]")){const e=i[t.getAttribute("data-shell")??""];e&&this.on(t,"click",e)}for(const t of this.queryAll("[data-screen-open]")){const e=t.getAttribute("data-screen-open")??"title";this.on(t,"click",()=>this.show(e))}}bindSettings(){for(const i of this.queryAll("[data-setting]")){const t=i.getAttribute("data-setting");if(!t||!(t in this.settings))continue;const e=this.settings[t],n=i;typeof e=="boolean"?n.checked=e:n.value=String(e),this.on(i,"change",()=>{const s=typeof e=="boolean"?n.checked:typeof e=="number"?Number(n.value):n.value;this.settings[t]=s,this.saveSettings()})}}bindKeys(){const i=this.options.pauseKeys??["Escape","KeyP"],t=this.doc.defaultView??this.doc;this.on(t,"keydown",e=>{const n=e;(i.includes(n.code)||i.includes(n.key))&&this.pause()}),this.options.pauseOnBlur!==!1&&this.on(this.doc,"visibilitychange",()=>{this.doc.hidden&&this.flow.state==="playing"&&this.pause(!0)})}queryAll(i){return Array.from(this.root.querySelectorAll?.(i)??[])}focusInto(i){if(!i){this.doc.activeElement?.blur?.();return}(i.querySelector?.("[data-autofocus]")??i.querySelector?.(jx))?.focus?.()}breathe(){const i=(this.doc.defaultView??globalThis)?.requestAnimationFrame;return typeof i!="function"?new Promise(t=>setTimeout(t,0)):new Promise(t=>i(()=>i(()=>t())))}};function ka(i){const t=e=>{let n=e*374761393+i*668265263>>>0;return n=Math.imul(n^n>>>13,1274126177)>>>0,((n^n>>>16)>>>0)/4294967296*2-1};return e=>{const n=Math.floor(e),s=e-n,r=(1-Math.cos(s*Math.PI))/2;return t(n)*(1-r)+t(n+1)*r}}var k1=class{constructor(i={}){this.traumaLevel=0,this.clock=0,this.stopLeft=0,this.slowRate=1,this.slowLeft=0,this.slowRamp=0,this.appliedX=0,this.appliedY=0,this.appliedZ=0,this.appliedRoll=0,this.slowRampTotal=.5,this.decay=i.decay??1.4,this.amplitude=i.amplitude??.35,this.rollMax=i.roll??.06,this.frequency=i.frequency??9;const t=i.seed??1;this.noiseX=ka(t),this.noiseY=ka(t+101),this.noiseR=ka(t+211)}get trauma(){return this.traumaLevel}get timeScale(){return this.stopLeft>0?0:this.slowLeft>0?this.slowRate:this.slowRamp>0?this.slowRate+(1-this.slowRate)*(1-this.slowRamp):1}shake(i){Number.isFinite(i)&&(this.traumaLevel=Math.min(Math.max(this.traumaLevel+i,0),1))}hitStop(i=.08){Number.isFinite(i)&&(this.stopLeft=Math.max(this.stopLeft,Math.max(i,0)))}slowMo(i=.3,t=1.2,e=.5){!Number.isFinite(i)||!Number.isFinite(t)||(this.slowRate=Math.min(Math.max(i,.02),1),this.slowLeft=Math.max(t,0),this.slowRampTotal=Math.max(e,.01),this.slowRamp=0)}rumble(i=.5,t=80){const e=globalThis.navigator;e?.vibrate&&(e.userActivation&&!e.userActivation.hasBeenActive||e.vibrate(Math.round(t*Math.min(Math.max(i,0),1))))}update(i){const t=Number.isFinite(i)?Math.min(Math.max(i,0),1):0;if(this.clock+=t,this.traumaLevel=Math.max(this.traumaLevel-this.decay*t,0),this.stopLeft>0)return this.stopLeft=Math.max(this.stopLeft-t,0),0;if(this.slowLeft>0)return this.slowLeft=Math.max(this.slowLeft-t,0),this.slowLeft===0&&(this.slowRamp=this.slowRampTotal),t*this.slowRate;if(this.slowRamp>0){this.slowRamp=Math.max(this.slowRamp-t,0);const e=1-this.slowRamp/this.slowRampTotal;return t*(this.slowRate+(1-this.slowRate)*e)}return t}apply(i){i.position.x-=this.appliedX,i.position.y-=this.appliedY,i.position.z-=this.appliedZ,i.rotation.z-=this.appliedRoll;const t=this.traumaLevel*this.traumaLevel,e=this.clock*this.frequency;this.appliedX=this.noiseX(e)*this.amplitude*t,this.appliedY=this.noiseY(e)*this.amplitude*t,this.appliedZ=0,this.appliedRoll=this.noiseR(e)*this.rollMax*t,i.position.x+=this.appliedX,i.position.y+=this.appliedY,i.position.z+=this.appliedZ,i.rotation.z+=this.appliedRoll}},Nr=class pu{constructor(t){this.state=t>>>0||1}next(){let t=this.state+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+this.next()*(e-t)}int(t,e){return Math.floor(this.range(t,e+1))}pick(t){return t[Math.floor(this.next()*t.length)]}jitter(t,e){return t+this.range(-e,e)}fork(){return new pu(Math.floor(this.next()*4294967296))}},Vo={villager:{skin:[15250828,13802350,12091220,9396031,1578e4],hair:[3811870,6111280,9070146,12105912,1972758],eyes:[3813158,3033707,4021306,6048302,2367774],shirt:[8232542,11040318,7243432,11557968,13220234],pants:[6113850,4608606,7035461,4082238],boots:[3812900,4864556,3025446]},guard:{skin:[15250828,13802350,12091220,9396031],hair:[3811870,6111280,1972758],eyes:[3813158,3033707,2367774],shirt:[4608606,4015185,5914174,3752013],pants:[3028032,3814960],boots:[2499102,3025446]}},t1=Vo.villager,e1={feminine:{shoulders:.88,waist:.85,hips:1.08,chest:.85},masculine:{shoulders:1.09,waist:1,hips:.94,chest:0},neutral:{shoulders:1,waist:.94,hips:1,chest:0}};function n1(i={}){const t=i.seed??1,e=new Nr(t),n=i.palette??t1,s=P=>e.pick(P),r=i.height??e.range(1.6,1.85),a=i.build??e.range(.9,1.12),o=s(n.skin),l=s(n.hair),c=s(n.shirt),h=s(n.pants),d=s(n.boots),u={skin:i.colors?.skin??o,hair:i.colors?.hair??l,top:i.colors?.top??c,bottom:i.colors?.bottom??h,boots:i.colors?.boots??d};let f;i.accessories==="none"?f=[]:Array.isArray(i.accessories)?f=[...i.accessories]:(f=[],e.next()<.35&&f.push(e.pick(["cap","hat"])),e.next()<.3&&f.push("backpack"),e.next()<.35&&f.push("pouch"),e.next()<.15&&f.push("shoulderPads"));const p=i.face??{},v={eyes:{size:p.eyes?.size??e.range(.85,1.2),spacing:p.eyes?.spacing??e.range(.9,1.15),color:p.eyes?.color??s(n.eyes)},brows:{angle:p.brows?.angle??e.range(-.3,.3),thickness:p.brows?.thickness??e.range(.8,1.4)},nose:{width:p.nose?.width??e.range(.8,1.3),length:p.nose?.length??e.range(.8,1.35)},mouth:{width:p.mouth?.width??e.range(.8,1.2),smile:p.mouth?.smile??e.range(-.5,1)},ears:{size:p.ears?.size??e.range(.85,1.25)},facialHair:p.facialHair??(e.next()<.18?"mustache":e.next()<.14?"beard":e.next()<.1?"full":"none")},m=new Nr((t^1370193453)>>>0);let g;if(typeof i.bodyType=="object")g={...i.bodyType};else{const P=m.next(),C=i.bodyType??(P<.42?"masculine":P<.84?"feminine":"neutral"),L=e1[C];g={shoulders:L.shoulders*m.range(.97,1.03),waist:L.waist*m.range(.97,1.03),hips:L.hips*m.range(.97,1.03),chest:L.chest===0?0:Math.min(1,L.chest*m.range(.85,1.15))}}const b=g.chest>.3,S=m.next(),x=i.outfit?.top??(b?S<.34?"shirt":S<.5?"tunic":S<.78?"dress":S<.9?"jacket":"apron":S<.48?"shirt":S<.7?"tunic":S<.82?"jacket":S<.92?"apron":"dress"),A=m.next(),M=i.outfit?.bottom??(A<.6?"pants":A<.78?"shorts":"skirt"),T=i.outfit?.sleeves??(m.next()<.5?"long":"short"),_=i.outfit?.collar??m.next()<.3,E=i.outfit?.belt??m.next()<.35;return{seed:t,palette:n,height:r,build:a,bodyType:g,outfit:{top:x,bottom:M,sleeves:T,collar:_,belt:E},colors:u,accessories:f,face:v,hair:{style:i.hair?.style??i1(e,f),color:i.hair?.color??u.hair}}}function i1(i,t){const e=i.next();let n=e<.1?"bald":e<.35?"cap":e<.5?"side-part":e<.62?"bob":e<.74?"ponytail":e<.82?"bun":e<.92?"long":"spiky";return(t.includes("hat")||t.includes("cap"))&&n!=="bald"&&(n="cap"),n}function s1(i={}){const t=n1(i),{height:e,build:n,bodyType:s,outfit:r,colors:a,accessories:o}=t,l=s.shoulders,c=s.waist,h=s.hips,d=new Nr((t.seed^795745093)>>>0),u=new Nr((t.seed^2090050817)>>>0),f=.24*e,p=.22*e,v=.045*e,m=f+p+v+.02*e,g=f+p,b=.15*e,S=.13*e,x=[["Hips",null,[0,m,0]],["Spine","Hips",[0,.055*e,0]],["Chest","Spine",[0,.07*e,0]],["Neck","Chest",[0,.115*e,0]],["Head","Neck",[0,.035*e,0]],["LeftShoulder","Chest",[.075*e*n*l,.095*e,0]],["LeftArm","LeftShoulder",[.04*e,0,0]],["LeftForeArm","LeftArm",[b,0,0]],["LeftHand","LeftForeArm",[S,0,0]],["RightShoulder","Chest",[-.075*e*n*l,.095*e,0]],["RightArm","RightShoulder",[-.04*e,0,0]],["RightForeArm","RightArm",[-b,0,0]],["RightHand","RightForeArm",[-S,0,0]],["LeftUpLeg","Hips",[.055*e*n*h,-.02*e,0]],["LeftLeg","LeftUpLeg",[0,-f,0]],["LeftFoot","LeftLeg",[0,-p,0]],["RightUpLeg","Hips",[-.055*e*n*h,-.02*e,0]],["RightLeg","RightUpLeg",[0,-f,0]],["RightFoot","RightLeg",[0,-p,0]]],A={},M={},T=[];for(const[yt,zt,fe]of x){const re=new Ih;re.name=yt,re.position.set(...fe),A[yt]=re,T.push(re),zt?(A[zt].add(re),M[yt]=M[zt].clone().add(new I(...fe))):M[yt]=new I(...fe)}const{skin:_,boots:E}=a,P=t.hair.color,C=a.top,L=a.bottom,B=r.top==="dress",H=B||r.top==="tunic"?C:(r.bottom==="skirt",L),O=B||r.bottom==="skirt"?_:L,X=B||r.bottom==="skirt"||r.bottom==="shorts"?_:L,D=r.sleeves==="long"?C:_,q=yt=>{const zt=yt==="Left"?1:-1;return[{bone:`${yt}Shoulder`,size:[.055*e,.055*e,.06*e],offset:[zt*.012*e,.004*e,0],color:C},{bone:`${yt}Arm`,size:[b,.048*e*n,.052*e*n],offset:[zt*b*.5,0,0],color:C},{bone:`${yt}ForeArm`,size:[S,.04*e,.044*e],offset:[zt*S*.5,0,0],color:D},{bone:`${yt}Hand`,size:[.055*e,.036*e,.05*e],offset:[zt*.027*e,0,0],color:_}]},V=yt=>[{bone:`${yt}UpLeg`,size:[.062*e*n,f,.068*e*n],offset:[0,-f*.5,0],color:O},{bone:`${yt}Leg`,size:[.052*e*n,p,.058*e*n],offset:[0,-p*.5,0],color:X},{bone:`${yt}Foot`,size:[.058*e,v,.115*e],offset:[0,-v*.5,.026*e],color:E}],K=[{bone:"Hips",size:[.16*e*n*h,.075*e,.095*e*n*h],offset:[0,.012*e,0],color:H},{bone:"Spine",size:[.15*e*n*c,.085*e,.088*e*n*c],offset:[0,.035*e,0],color:C},{bone:"Chest",size:[.17*e*n*l,.125*e,.098*e*n],offset:[0,.055*e,0],color:C},{bone:"Neck",size:[.042*e,.05*e,.042*e],offset:[0,.014*e,0],color:_},{bone:"Head",size:[.11*e,.115*e,.115*e],offset:[0,.065*e,0],color:_},...q("Left"),...q("Right"),...V("Left"),...V("Right")];if(s.chest>.05&&K.push({bone:"Chest",size:[.125*e*n,.052*e,.05*e*s.chest],offset:[0,.045*e,.049*e*n],color:C}),r.top==="tunic"?K.push({bone:"Hips",size:[.15*e*n*h,.06*e,.1*e*n],offset:[0,-.048*e,0],color:C}):B?K.push({bone:"Hips",size:[.17*e*n*h,.1*e,.115*e*n],offset:[0,-.075*e,0],color:C},{bone:"Hips",size:[.2*e*n*h,.1*e,.14*e*n],offset:[0,-.165*e,0],color:C}):r.top==="jacket"?K.push({bone:"Chest",size:[.05*e,.115*e,.01*e],offset:[0,.05*e,.05*e*n],color:a.bottom}):r.top==="apron"&&K.push({bone:"Chest",size:[.09*e,.1*e,.01*e],offset:[0,.045*e,.051*e*n],color:14209730},{bone:"Hips",size:[.13*e,.095*e,.01*e],offset:[0,-.04*e,.05*e*n],color:14209730}),!B&&r.bottom==="skirt"&&K.push({bone:"Hips",size:[.18*e*n*h,.095*e,.125*e*n],offset:[0,-.072*e,0],color:L}),r.collar||r.top==="jacket"){const yt=new _t(C).offsetHSL(0,0,-.09).getHex();K.push({bone:"Neck",size:[.058*e,.02*e,.052*e],offset:[0,.006*e,.004*e],color:yt})}r.belt&&K.push({bone:"Hips",size:[.164*e*n*h,.024*e,.099*e*n*h],offset:[0,.05*e,0],color:E},{bone:"Hips",size:[.024*e,.02*e,.012*e],offset:[0,.05*e,.05*e*n*h],color:13217888});const it=E,lt=C;for(const yt of o)if(yt==="cap")K.push({bone:"Head",size:[.122*e,.032*e,.126*e],offset:[0,.132*e,-.002*e],color:lt},{bone:"Head",size:[.08*e,.012*e,.05*e],offset:[0,.122*e,.075*e],color:lt});else if(yt==="hat")K.push({bone:"Head",size:[.19*e,.014*e,.19*e],offset:[0,.126*e,0],color:it},{bone:"Head",size:[.1*e,.06*e,.1*e],offset:[0,.16*e,0],color:it});else if(yt==="backpack")K.push({bone:"Chest",size:[.14*e,.155*e,.07*e],offset:[0,.045*e,-.085*e],color:it},{bone:"Chest",size:[.1*e,.04*e,.05*e],offset:[0,.135*e,-.08*e],color:lt});else if(yt==="pouch")K.push({bone:"Hips",size:[.055*e,.06*e,.045*e],offset:[d.pick([-1,1])*.095*e,-.005*e,.02*e],color:it});else for(const zt of[-1,1])K.push({bone:zt===1?"LeftShoulder":"RightShoulder",size:[.07*e,.03*e,.075*e],offset:[zt*.015*e,.035*e,0],color:it});const Et=t.face,oe=new _t(_).offsetHSL(.005,.1,-.13).getHex(),Ht=.0565*e;for(const yt of[1,-1]){const zt=yt*.027*e*Et.eyes.spacing;K.push({bone:"Head",size:[.026*e*Et.eyes.size,.02*e*Et.eyes.size,.008*e],offset:[zt,.078*e,Ht],color:16052972},{bone:"Head",size:[.012*e*Et.eyes.size,.013*e*Et.eyes.size,.007*e],offset:[zt,.076*e,Ht+.004*e],color:Et.eyes.color},{bone:"Head",size:[.033*e,.008*e*Et.brows.thickness,.008*e],offset:[zt*1.05,.098*e,Ht+.001*e],color:P,rotation:[0,0,yt*Et.brows.angle]},{bone:"Head",size:[.012*e,.03*e*Et.ears.size,.024*e],offset:[yt*.0605*e,.062*e,-.004*e],color:_})}K.push({bone:"Head",size:[.015*e*Et.nose.width,.032*e*Et.nose.length,.016*e],offset:[0,.057*e,.059*e],color:_},{bone:"Head",size:[.038*e*Et.mouth.width,.008*e,.006*e],offset:[0,.03*e,Ht+.001*e],color:oe});for(const yt of[1,-1])K.push({bone:"Head",size:[.009*e,.008*e,.006*e],offset:[yt*.022*e*Et.mouth.width,.03*e+Et.mouth.smile*.008*e,Ht+.001*e],color:oe});(Et.facialHair==="mustache"||Et.facialHair==="full")&&K.push({bone:"Head",size:[.044*e,.013*e,.012*e],offset:[0,.044*e,Ht+.002*e],color:P}),(Et.facialHair==="beard"||Et.facialHair==="full")&&K.push({bone:"Head",size:[.098*e,.042*e,.02*e],offset:[0,.008*e,.05*e],color:P},{bone:"Head",size:[.06*e,.032*e,.032*e],offset:[0,-.004*e,.042*e],color:P});const Z=t.hair.style,st=t.hair.color;if(Z!=="bald"&&K.push({bone:"Head",size:[.116*e,.038*e,.121*e],offset:[0,.128*e,-.004*e],color:st}),Z==="side-part")K.push({bone:"Head",size:[.062*e,.02*e,.016*e],offset:[.024*e,.114*e,.054*e],color:st});else if(Z==="bob"||Z==="long"){for(const yt of[1,-1])K.push({bone:"Head",size:[.015*e,.072*e,.11*e],offset:[yt*.063*e,.078*e,-.01*e],color:st});K.push(Z==="bob"?{bone:"Head",size:[.11*e,.085*e,.018*e],offset:[0,.072*e,-.062*e],color:st}:{bone:"Head",size:[.112*e,.155*e,.022*e],offset:[0,.026*e,-.064*e],color:st})}else if(Z==="ponytail")K.push({bone:"Head",size:[.03*e,.098*e,.03*e],offset:[0,.072*e,-.077*e],color:st,rotation:[.22,0,0]});else if(Z==="bun")K.push({bone:"Head",size:[.042*e,.042*e,.042*e],offset:[0,.136*e,-.056*e],color:st});else if(Z==="spiky")for(let yt=0;yt<5;yt++)K.push({bone:"Head",size:[.022*e,.038*e,.022*e],offset:[d.range(-.04,.04)*e,.152*e,d.range(-.045,.035)*e],color:st,rotation:[d.range(-.35,.35),0,d.range(-.35,.35)]});const nt=[],Nt=[],Bt=[],Dt=[],Se=[],$t=[],ie=new _t,ee=new Map(T.map((yt,zt)=>[yt.name,zt]));for(const yt of K){const zt=new kt(...yt.size);yt.rotation&&(zt.rotateX(yt.rotation[0]),zt.rotateY(yt.rotation[1]),zt.rotateZ(yt.rotation[2])),zt.translate(yt.offset[0]+M[yt.bone].x,yt.offset[1]+M[yt.bone].y,yt.offset[2]+M[yt.bone].z);const fe=nt.length/3,re=zt.getAttribute("position"),U=zt.getAttribute("normal");ie.setHex(yt.color).offsetHSL(0,0,u.range(-.015,.015));const He=ee.get(yt.bone);for(let R=0;R<re.count;R++)nt.push(re.getX(R),re.getY(R),re.getZ(R)),Nt.push(U.getX(R),U.getY(R),U.getZ(R)),Bt.push(ie.r,ie.g,ie.b),Dt.push(He,0,0,0),Se.push(1,0,0,0);const se=zt.getIndex();for(let R=0;R<se.count;R++)$t.push(fe+se.getX(R));zt.dispose()}const Xt=new le;Xt.setAttribute("position",new Qt(new Float32Array(nt),3)),Xt.setAttribute("normal",new Qt(new Float32Array(Nt),3)),Xt.setAttribute("color",new Qt(new Float32Array(Bt),3)),Xt.setAttribute("skinIndex",new nl(Dt,4)),Xt.setAttribute("skinWeight",new Qt(new Float32Array(Se),4)),Xt.setIndex($t);const ce=new qd(Xt,new be({vertexColors:!0,flatShading:!0}));ce.name="humanoid",ce.frustumCulled=!1,ce.add(A.Hips),ce.updateMatrixWorld(!0),ce.bind(new sl(T));const we=new Zt;return we.name="humanoid-rig",we.add(ce),{object:we,mesh:ce,skeleton:ce.skeleton,bones:A,height:e,legLength:g,obstacleRadius:.34*(e/1.7)*n,description:t}}var r1={handLeft:{bone:"LeftHand",offset:[.04,-.008,0]},handRight:{bone:"RightHand",offset:[-.04,-.008,0]},back:{bone:"Chest",offset:[0,.045,-.07],rotationY:Math.PI},hipLeft:{bone:"Hips",offset:[.095,0,.01]},hipRight:{bone:"Hips",offset:[-.095,0,.01]},head:{bone:"Head",offset:[0,.135,0]}};function a1(i,t){const e=r1[t],n=i.bones[e.bone],s=n.children.find(o=>o.name===`socket:${t}`);if(s)return s;const r=new Me;r.name=`socket:${t}`;const a=i.height;return r.position.set(e.offset[0]*a,e.offset[1]*a,e.offset[2]*a),e.rotationY&&(r.rotation.y=e.rotationY),n.add(r),r}function B1(i,t,e){const n=a1(i,t);return n.add(e),n}var Qe=new I(1,0,0),vs=new I(0,1,0),fr=new I(0,0,1),rh=class{constructor(){this.rotations=new Map,this.hipsY=0}rotate(i,...t){const e=new Ee,n=new Ee;for(const[s,r]of t)e.multiply(n.setFromAxisAngle(s,r));this.rotations.set(i,e)}};function Ba(i,t,e,n,s){const r=Math.max(8,Math.round(e*n)),a=new Float32Array(r+1),o=new rh;s(0,o);const l=[...o.rotations.keys()],c=new Map(l.map(u=>[u,new Float32Array((r+1)*4)])),h=new Float32Array((r+1)*3);for(let u=0;u<=r;u++){a[u]=u*e/r;const f=new rh;s(u===r?0:u/r,f);for(const p of l){const v=f.rotations.get(p)??new Ee;c.get(p).set([v.x,v.y,v.z,v.w],u*4)}h.set([i.bones.Hips.position.x,f.hipsY,i.bones.Hips.position.z],u*3)}const d=l.map(u=>new Br(`${u}.quaternion`,a,c.get(u)));return d.push(new dl("Hips.position",a,h)),new Dr(t,e,d)}var En=Math.PI*2,ah=i=>Math.max(0,i);function o1(i,t={}){const e=t.fps??30,n=i.bones.Hips.position.y,s=Math.PI/2-.14,r=(v,m,g,b,S,x,A,M,T)=>{for(const _ of["Left","Right"]){const E=_==="Left"?1:-1,P=g*Math.sin(En*m+(E===1?0:Math.PI)),C=b*ah(Math.sin(En*m+.35+(E===1?0:Math.PI)));v.rotate(`${_}UpLeg`,[Qe,-P]),v.rotate(`${_}Leg`,[Qe,C]),v.rotate(`${_}Foot`,[Qe,.7*(P-C)]);const L=S*Math.sin(En*m+(E===1?Math.PI:0));v.rotate(`${_}Arm`,[Qe,-L],[fr,-E*s]),v.rotate(`${_}ForeArm`,[vs,-E*(x+.25*ah(L))])}v.hipsY=n-.012*i.height+A*Math.sin(En*2*m+.4),v.rotate("Hips",[vs,T*Math.sin(En*m)],[fr,.03*Math.sin(En*m)]),v.rotate("Spine",[Qe,M*.45]),v.rotate("Chest",[Qe,M*.55],[vs,-T*1.4*Math.sin(En*m)]),v.rotate("Head",[Qe,-M*.5])},a=t.walkDuration??1,o=t.walkHipSwing??.55,l=Ba(i,"walk",a,e,(v,m)=>{r(m,v,o,.95,.45,.3,.014*i.height,.04,.07)}),c=t.runDuration??.62,h=t.runHipSwing??.85,d=Ba(i,"run",c,e,(v,m)=>{r(m,v,h,1.55,.85,1.05,.028*i.height,.24,.1)}),u=Ba(i,"idle",3.4,e,(v,m)=>{const g=Math.sin(En*v);for(const b of["Left","Right"]){const S=b==="Left"?1:-1;m.rotate(`${b}Arm`,[Qe,.02*g],[fr,-S*(s-.03*g)]),m.rotate(`${b}ForeArm`,[vs,-S*.16]),m.rotate(`${b}UpLeg`,[Qe,0]),m.rotate(`${b}Leg`,[Qe,.03]),m.rotate(`${b}Foot`,[Qe,0])}m.hipsY=n-.004*i.height*(1+.4*g),m.rotate("Hips",[fr,.012*Math.sin(En*v+1)]),m.rotate("Spine",[Qe,.015*g]),m.rotate("Chest",[Qe,.025*g]),m.rotate("Head",[vs,.05*Math.sin(En*v+2)],[Qe,-.01*g])}),f=2*1.35*i.legLength*Math.sin(o)/a,p=2*1.6*i.legLength*Math.sin(h)/c;return{idle:u,walk:l,run:d,walkSpeed:f,runSpeed:p}}function l1(i,t){const e=new Set(t),n=i.tracks.filter(s=>e.has(s.name.split(".")[0]));return new Dr(`${i.name}#masked`,i.duration,n)}var z1=class{constructor(i,t={}){this.smoothedSpeed=0,this.weights={idle:1,walk:0,run:0},this.influence=1,this.footstepListeners=new Set,this.previousPhase=0,this.clips=t.clips??o1(i),this.idleThreshold=t.idleThreshold??.12,this.smoothing=t.smoothing??10,this.mixer=new Zf(i.mesh);const e=n=>{const s=this.mixer.clipAction(n);return s.setLoop(Po,1/0),s.play(),s};this.idleAction=e(this.clips.idle),this.walkAction=e(this.clips.walk),this.runAction=e(this.clips.run),this.apply(0)}get speed(){return this.smoothedSpeed}update(i,t=0){const e=typeof t=="number"?Math.abs(t):Math.hypot(t.x,t.z),n=1-Math.exp(-this.smoothing*i);this.smoothedSpeed+=(e-this.smoothedSpeed)*n,this.apply(this.smoothedSpeed),this.mixer.update(i),this.emitFootsteps()}overlay(i,t={}){const e=t.bones?l1(i,t.bones):i,n=this.mixer.clipAction(e);return n.setLoop(t.loop===!1?wh:Po,1/0),n.clampWhenFinished=!1,n.reset(),n.fadeIn(t.fadeIn??.25),n.setEffectiveWeight(t.weight??1),n.play(),n}stopOverlay(i,t=.25){i.fadeOut(t)}onFootstep(i){return this.footstepListeners.add(i),()=>this.footstepListeners.delete(i)}emitFootsteps(){if(this.footstepListeners.size===0||this.weights.walk+this.weights.run<.35)return;const i=this.walkAction.time%this.clips.walk.duration/this.clips.walk.duration,t=e=>this.previousPhase<e&&i>=e||this.previousPhase>i&&(i>=e||this.previousPhase<e);if(t(.25))for(const e of this.footstepListeners)e("Left");if(t(.75))for(const e of this.footstepListeners)e("Right");this.previousPhase=i}apply(i){const{walkSpeed:t,runSpeed:e}=this.clips;let n=0,s=0,r=0;i<=this.idleThreshold?n=1:i<t?(s=(i-this.idleThreshold)/(t-this.idleThreshold),n=1-s):i<e?(r=(i-t)/(e-t),s=1-r):r=1,this.weights.idle=n,this.weights.walk=s,this.weights.run=r,this.idleAction.weight=n*this.influence,this.walkAction.weight=s*this.influence,this.runAction.weight=r*this.influence;const a=s+r>0?(s*t+r*e)/(s+r):t,o=Math.min(1.7,Math.max(.4,i/a));if(this.walkAction.timeScale=o,this.runAction.timeScale=o,s>0&&r>0){const l=this.walkAction.time%this.clips.walk.duration/this.clips.walk.duration;this.runAction.time=l*this.clips.run.duration}}},za=new I(1,0,0),V1=class{constructor(i,t){this.world=new I,this.local=new I,this.q=new Ee,this.rig=i;const e=t.ground;this.groundAt=typeof e=="number"?()=>e:e,this.hipsAdapt=t.hipsAdapt??.6,this.weight=t.weight??1,this.upLegLen=Math.abs(i.bones.LeftLeg.position.y),this.loLegLen=Math.abs(i.bones.LeftFoot.position.y),this.deadzone=t.deadzone??.025}update(){if(this.weight<=0)return;const{object:i,bones:t}=this.rig;i.updateMatrixWorld(!0);const e=this.groundAt(i.getWorldPosition(this.world).x,this.world.z);let n=0;const s=[];for(const a of["Left","Right"]){t[`${a}Foot`].getWorldPosition(this.world);const o=this.groundAt(this.world.x,this.world.z)-e,l=Math.sign(o)*Math.max(0,Math.abs(o)-this.deadzone);s.push({side:a,delta:l}),n=Math.min(n,l)}const r=t.Hips;r.position.y+=n*this.hipsAdapt*this.weight,r.updateMatrixWorld(!0);for(const{side:a,delta:o}of s)this.solveLeg(a,o*this.weight)}solveLeg(i,t){const{object:e,bones:n}=this.rig,s=n[`${i}UpLeg`];n[`${i}Foot`].getWorldPosition(this.world),this.local.copy(this.world),e.worldToLocal(this.local);const a=s.getWorldPosition(this.world),o=e.worldToLocal(a.clone()),l=this.local.y+t,c=this.local.z-o.z,h=this.upLegLen,d=this.loLegLen,u=l-o.y;let f=Math.hypot(u,c);f=Math.min(f,(h+d)*.9999),f=Math.max(f,Math.abs(h-d)*1.0001);const p=Math.atan2(c,-u),v=Math.acos(Math.min(1,Math.max(-1,(h*h+f*f-d*d)/(2*h*f)))),m=Math.PI-Math.acos(Math.min(1,Math.max(-1,(h*h+d*d-f*f)/(2*h*d))));s.quaternion.copy(this.q.setFromAxisAngle(za,-(p+v))),n[`${i}Leg`].quaternion.copy(this.q.setFromAxisAngle(za,m)),n[`${i}Foot`].quaternion.copy(this.q.setFromAxisAngle(za,.7*(p+v-m))),s.updateMatrixWorld(!0)}};function c1(i,t){return Math.abs(i.dot(t))>1-1e-7}var H1=class{constructor(i,t={}){this.target=null,this.weight=1,this.glanceTarget=null,this.glanceLeft=0,this.glanced=null,this.yaw=0,this.pitch=0,this.targetWorld=new I,this.headWorld=new I,this.localDir=new I,this.q=new Ee,this.qYaw=new Ee,this.up=new I(0,1,0),this.right=new I(1,0,0),this.base=[new Ee,new Ee,new Ee],this.written=[null,null,null],this.rig=i,this.maxYaw=t.maxYaw??1.15,this.maxPitch=t.maxPitch??.55,this.smoothing=t.smoothing??7,this.distribution=t.distribution??[.15,.25,.6],this.minDistance=t.minDistance??.5}glance(i,t=1.2){this.glanceTarget=i,this.glanceLeft=t}get glancing(){return this.glanceLeft>0}endGlance(){this.glanceLeft=0,this.glanceTarget=null}update(i){const{bones:t,object:e}=this.rig;let n=0,s=0;if(this.glanceLeft>0&&(this.glanceLeft-=i,this.glanceLeft<=0&&(this.glanceTarget=null)),this.glanced=this.glanceTarget??this.target,this.glanced&&this.weight>0)if(this.glanced.isObject3D?this.glanced.getWorldPosition(this.targetWorld):this.targetWorld.copy(this.glanced),e.updateMatrixWorld(!0),t.Head.getWorldPosition(this.headWorld),this.localDir.copy(this.targetWorld).sub(this.headWorld),e.worldToLocal(this.localDir.add(e.getWorldPosition(this.headWorld))),this.localDir.length()<this.minDistance)n=this.yaw,s=this.pitch;else{const l=Math.atan2(this.localDir.x,this.localDir.z),c=Math.hypot(this.localDir.x,this.localDir.z),h=Math.atan2(this.localDir.y,c),d=Kr.clamp((this.maxYaw*1.3-Math.abs(l))/(this.maxYaw*.3),0,1);n=Kr.clamp(l,-this.maxYaw,this.maxYaw)*this.weight*d,s=Kr.clamp(h,-this.maxPitch,this.maxPitch)*this.weight*d}const r=1-Math.exp(-this.smoothing*i);this.yaw+=(n-this.yaw)*r,this.pitch+=(s-this.pitch)*r,[t.Chest,t.Neck,t.Head].forEach((o,l)=>{var c;const h=this.distribution[l],d=this.written[l];d&&c1(o.quaternion,d)?o.quaternion.copy(this.base[l]):this.base[l].copy(o.quaternion),this.qYaw.setFromAxisAngle(this.up,this.yaw*h),this.q.setFromAxisAngle(this.right,-this.pitch*h),o.quaternion.multiply(this.qYaw).multiply(this.q),((c=this.written)[l]??(c[l]=new Ee)).copy(o.quaternion)})}},As=i=>i*i*(3-2*i),Ur=i=>Math.max(0,Math.min(1,i)),oh=i=>As(Ur(i/.25))*As(Ur((1-i)/.5)),Be=new I(1,0,0),pr=new I(0,1,0),Fr=new I(0,0,1),h1=[["LeftUpLeg",Be,-1.85],["RightUpLeg",Be,-1.75],["LeftLeg",Be,2.25],["RightLeg",Be,2.2],["LeftFoot",Be,-.5],["RightFoot",Be,-.55],["Spine",Be,.42],["Chest",Be,.38],["Neck",Be,.3],["Head",Be,.22],["LeftShoulder",Be,.2],["RightShoulder",Be,.2],["LeftArm",Fr,-.5],["RightArm",Fr,.5],["LeftForeArm",Be,.25],["RightForeArm",Be,.25]],G1=class{constructor(i,t={}){this.flinchLeft=0,this.flinchTotal=1,this.flinchAmp=0,this.recoilAxis=new I(1,0,0),this.celebrateLeft=0,this.celebrateTotal=1,this.dejectedLeft=0,this.dejectedTotal=1,this.koWeight=0,this.koTarget=0,this.scratchQ=new Ee,this.scratchV=new I,this.touched=new Map,this.rig=i,this.intensity=t.intensity??1,this.foldTime=Math.max(t.foldTime??.55,.05),this.riseTime=Math.max(t.riseTime??.75,.05),this.restHips=i.bones.Hips.position.y}get down(){return this.koTarget>0||this.koWeight>.02}flinch(i,t=1){this.impulse(i,.32,Math.min(Math.max(t,.2),2)*.45)}stagger(i,t=1){this.impulse(i,.7,Math.min(Math.max(t,.2),2)*.9)}knockOut(){this.koTarget=1}getUp(){this.koTarget=0}celebrate(i=1.4){this.down||(this.celebrateTotal=Math.max(i,.4),this.celebrateLeft=this.celebrateTotal)}dejected(i=2){this.down||(this.dejectedTotal=Math.max(i,.5),this.dejectedLeft=this.dejectedTotal)}impulse(i,t,e){if(this.down)return;const n=this.scratchV;i?(n.set(this.rig.object.position.x-i.x,0,this.rig.object.position.z-i.z),n.lengthSq()<1e-8&&n.set(0,0,1),n.normalize(),n.applyQuaternion(this.scratchQ.copy(this.rig.object.quaternion).invert())):n.set(0,0,-1),this.recoilAxis.set(n.z,0,-n.x).normalize(),this.flinchTotal=t,this.flinchLeft=t,this.flinchAmp=e*this.intensity}rotate(i,t,e){const n=this.rig.bones[i];this.capture(i,!1),n.quaternion.multiply(this.scratchQ.setFromAxisAngle(t,e))}shift(i,t,e,n){const s=this.rig.bones[i];this.capture(i,!0),s.position.x+=t,s.position.y+=e,s.position.z+=n}capture(i,t){const e=this.rig.bones[i];let n=this.touched.get(i);n||(n={preQ:e.quaternion.clone(),postQ:new Ee,preP:null,postP:null},this.touched.set(i,n)),t&&!n.preP&&(n.preP=e.position.clone())}update(i){const t=Number.isFinite(i)?Math.max(i,0):0,e=this.rig.bones;for(const[s,r]of this.touched){const a=e[s];r.postQ&&a.quaternion.equals(r.postQ)&&a.quaternion.copy(r.preQ),r.preP&&r.postP&&a.position.equals(r.postP)&&a.position.copy(r.preP)}this.touched.clear();const n=this.koTarget>this.koWeight?t/this.foldTime:t/this.riseTime;if(this.koWeight=this.koTarget>this.koWeight?Math.min(this.koWeight+n,this.koTarget):Math.max(this.koWeight-n,this.koTarget),this.koWeight>0){const s=As(this.koWeight);for(const[r,a,o]of h1)this.rotate(r,a,o*s);this.shift("Hips",0,-(this.restHips-this.restHips*.42)*s,0)}if(this.flinchLeft>0){this.flinchLeft=Math.max(this.flinchLeft-t,0);const s=1-this.flinchLeft/this.flinchTotal,r=oh(s)*this.flinchAmp;r>1e-4&&(this.rotate("Spine",this.recoilAxis,r*.5),this.rotate("Chest",this.recoilAxis,r*.35),this.rotate("Head",this.recoilAxis,r*.45),this.flinchAmp>.5&&this.shift("Hips",this.recoilAxis.z*r*.12,0,-this.recoilAxis.x*r*.12))}if(this.celebrateLeft>0){this.celebrateLeft=Math.max(this.celebrateLeft-t,0);const s=1-this.celebrateLeft/this.celebrateTotal,r=oh(s);this.rotate("LeftArm",Fr,r*2.4),this.rotate("RightArm",Fr,-r*2.4),this.rotate("LeftForeArm",pr,-r*.3),this.rotate("RightForeArm",pr,r*.3),this.rotate("Head",Be,-r*.25),this.shift("Hips",0,Math.sin(Math.min(s*2,1)*Math.PI)*.05*r,0)}if(this.dejectedLeft>0){this.dejectedLeft=Math.max(this.dejectedLeft-t,0);const s=1-this.dejectedLeft/this.dejectedTotal,r=As(Ur(s/.2))*As(Ur((1-s)/.25));this.rotate("Spine",Be,r*.22),this.rotate("Chest",Be,r*.18),this.rotate("Head",Be,r*.38),this.rotate("LeftShoulder",pr,r*.18),this.rotate("RightShoulder",pr,-r*.18),this.shift("Hips",0,-r*.02,0)}for(const[s,r]of this.touched){const a=e[s];r.postQ.copy(a.quaternion),r.preP&&(r.postP=(r.postP??new I).copy(a.position))}}};new Array(12).fill({}),new Array(8).fill({}),new Array(8).fill({});const qe=i=>(t,e)=>i({seed:e.seed,palette:_l.meadow,...t});function W1(i={}){const t=new Qx;return t.define("house",qe(pv),{label:"House",group:"Buildings",defaults:{width:5,depth:4},fields:[{key:"width",type:"number",min:3,max:12,step:.25},{key:"depth",type:"number",min:3,max:12,step:.25},{key:"wallHeight",type:"number",min:2,max:8,step:.25},{key:"wall",type:"select",options:["plaster","brick","ashlar"]},{key:"roof",type:"select",options:["tile","shingle","thatch"]}]}),t.define("well",qe(mv),{label:"Well",group:"Buildings"}),t.define("fountain",qe(Yv),{label:"Fountain",group:"Buildings",fields:[{key:"size",type:"number",min:1,max:6,step:.25},{key:"figure",type:"select",options:["obelisk","figure","orb","bust","beast"]},{key:"centrepiece",type:"select",options:["stone","bronze"]}]}),t.define("stall",qe(yv),{label:"Market stall",group:"Buildings",fields:[{key:"goods",type:"select",options:["produce","pottery","bakery","textiles"]},{key:"clothColor",type:"color",label:"cloth"}]}),t.define("statue",qe(au),{label:"Statue",group:"Buildings",fields:[{key:"figure",type:"select",options:["obelisk","figure","orb","bust","beast"]},{key:"material",type:"select",options:["stone","bronze"]},{key:"height",type:"number",min:1,max:8,step:.25}]}),t.define("tree",qe(lv),{label:"Tree",group:"Nature",fields:[{key:"height",type:"number",min:2,max:18,step:.5},{key:"species",type:"select",options:["oak","pine","birch","cypress","cedar","maple","willow","sakura"]},{key:"season",type:"select",options:["spring","summer","autumn","winter"]}]}),t.define("rock",qe(cv),{label:"Rock",group:"Nature",fields:[{key:"size",type:"number",min:.3,max:5,step:.1}]}),t.define("fence",qe(uv),{label:"Fence",group:"Nature",defaults:{length:6},fields:[{key:"length",type:"number",min:2,max:24,step:.5},{key:"height",type:"number",min:.5,max:3,step:.1}]}),t.define("crate",qe(nu),{label:"Crate",group:"Dressing",fields:[{key:"size",type:"number",min:.4,max:2.5,step:.1},{key:"weathering",type:"number",min:0,max:1,step:.05}]}),t.define("barrel",qe(hv),{label:"Barrel",group:"Dressing"}),t.define("cart",qe(Jv),{label:"Cart",group:"Dressing",fields:[{key:"style",type:"select",options:["cart","wagon"]},{key:"cargo",type:"select",options:["empty","crates","barrels","sacks","hay"]}]}),t.define("banner",qe(Av),{label:"Banner",group:"Dressing",fields:[{key:"style",type:"select",options:["flag","banner","pennant"]},{key:"poleHeight",type:"number",min:1.5,max:8,step:.25}]}),t.define("bunting",qe(Ov),{label:"Bunting",group:"Dressing",defaults:{span:9,poleHeight:3.2},fields:[{key:"span",type:"number",min:3,max:20,step:.5},{key:"poleHeight",type:"number",min:2,max:6,step:.2}]}),t.define("sign",qe(ex),{label:"Sign",group:"Dressing",defaults:{kind:"post",text:"HAVENBROOK"},fields:[{key:"text",type:"text"},{key:"kind",type:"select",options:["post","hanging","fingerpost","milestone"]}]}),t.define("road",e=>{const n=Number(e.length??8),s=ux([{x:0,z:-n/2},{x:0,z:n/2}],{width:Number(e.width??3.6),palette:_l.meadow});return s.mesh.position.y=.01,{object:s.mesh,obstacleRadius:0}},{label:"Road",group:"Nature",defaults:{length:8,width:3.6},fields:[{key:"length",type:"number",min:2,max:40,step:.5},{key:"width",type:"number",min:1,max:8,step:.2}]}),t.define("lamp",qe(hx),{label:"Street lamp",group:"Light",defaults:{style:"village"},fields:[{key:"style",type:"select",options:["village","modern"]},{key:"height",type:"number",min:1.5,max:8,step:.25}]}),t.define("brazier",qe(Uv),{label:"Brazier",group:"Light"}),t.define("address",()=>Va(5082623,1.1),{label:"Delivery door",group:"Markers",fields:[{key:"number",type:"number",min:1,max:99,step:1}]}),t.define("depot",()=>Va(16761165,1.5),{label:"Depot",group:"Markers"}),t.define("waypoint",()=>Va(9429903,.8),{label:"Route point",group:"Markers",fields:[{key:"order",type:"number",min:0,max:99,step:1}]}),t.define("villager",(e,n)=>s1({seed:n.seed,palette:e.role==="guard"?Vo.guard:Vo.villager}),{label:"Villager",group:"People",defaults:{role:"villager"},fields:[{key:"role",type:"select",options:["villager","guard"]}]}),t.prefab("cottage-lot",{kind:"house",props:{width:5,depth:4,roof:"thatch"},children:[{kind:"address",at:[0,0,2.9],props:{number:1},tags:["address"]},{kind:"lamp",at:[2.8,0,3.4]},{kind:"fence",at:[0,0,4.6],props:{length:6}}]},{label:"Cottage + door",group:"Recipes"}),t.prefab("market-corner",{kind:"stall",props:{goods:"produce"},children:[{kind:"crate",at:[1.9,0,.7]},{kind:"barrel",at:[-1.7,0,.5]},{kind:"villager",at:[0,0,-1.2],props:{role:"villager"}}]},{label:"Stall + keeper",group:"Recipes"}),i.preview,t}function Va(i,t){const e=new Zt;e.name="marker";const n=new k(new kr(t*.72,t,24),new be({color:i,emissive:i,emissiveIntensity:.7}));n.rotation.x=-Math.PI/2,n.position.y=.03;const s=new k(new yn(t*.22,10,8),new be({color:i,emissive:i,emissiveIntensity:.9}));return s.position.y=t*.9,e.add(n,s),e}const u1="gama.level",d1=1,f1="Havenbrook",p1=7,m1={bounds:62,timeOfDay:.42},g1=[{id:"fountain",kind:"fountain",props:{size:2.6,figure:"figure"}},{id:"well",kind:"well",at:[-7.5,0,5.5]},{id:"signpost",kind:"sign",at:[-2.6,0,11.4],rot:.35,props:{text:"HAVENBROOK"}},{id:"bunting",kind:"bunting",at:[0,3.4,-9],props:{span:11,poleHeight:3.2}},{id:"stall-1",kind:"stall",at:[8.47,0,4.31],rot:2.042,props:{goods:"produce"}},{id:"stall-2",kind:"stall",at:[4.9,0,-8.14],rot:.542,props:{goods:"pottery"}},{id:"stall-3",kind:"stall",at:[-7.77,0,-5.46],rot:-.958,props:{goods:"bakery"}},{id:"depot-cart",kind:"cart",at:[6.5,0,7],rot:-.7,props:{style:"cart",cargo:"crates"},children:[{id:"depot",kind:"depot",at:[-1.6,0,.6],tags:["depot"]}]},{id:"depot-sign",kind:"sign",at:[8.7,0,8.4],rot:-2.393,props:{text:"DEPOT",kind:"post"}},{id:"clutter-1",kind:"barrel",at:[.4,0,5.42],rot:3.069},{id:"clutter-2",kind:"crate",at:[-8.21,0,-2.72],rot:1.274},{id:"clutter-3",kind:"barrel",at:[1.41,0,-6.53],rot:1.738},{id:"clutter-4",kind:"crate",at:[-6.75,0,-.86],rot:.49},{id:"clutter-5",kind:"barrel",at:[-8.6,0,.76],rot:.619},{id:"clutter-6",kind:"crate",at:[5.2,0,-4.76],rot:1.68},{id:"clutter-7",kind:"barrel",at:[11.35,0,-3.4],rot:.778},{id:"house-1",kind:"house",at:[9.4,0,35.34],rot:-2.882,props:{width:4.9,depth:4,roof:"thatch",wall:"plaster"},children:[{id:"door-1",kind:"address",at:[0,0,3.2],props:{number:1},tags:["address"]}]},{id:"lamp-1",kind:"lamp",at:[8.01,0,30.12]},{id:"house-2",kind:"house",at:[27.48,0,22.34],rot:-2.253,props:{width:5.8,depth:3.9,roof:"shingle",wall:"brick"},children:[{id:"door-2",kind:"address",at:[0,0,3.2],props:{number:2},tags:["address"]}]},{id:"house-3",kind:"house",at:[35.62,0,1.93],rot:-1.625,props:{width:5.7,depth:5,roof:"tile",wall:"ashlar"},children:[{id:"door-3",kind:"address",at:[0,0,3.2],props:{number:3},tags:["address"]}]},{id:"lamp-3",kind:"lamp",at:[30.23,0,1.64]},{id:"house-4",kind:"house",at:[30.56,0,-19.77],rot:-.997,props:{width:4.7,depth:4,roof:"tile",wall:"brick"},children:[{id:"door-4",kind:"address",at:[0,0,3.2],props:{number:4},tags:["address"]}]},{id:"house-5",kind:"house",at:[12.09,0,-31.32],rot:-.368,props:{width:4.7,depth:4.7,roof:"tile",wall:"brick"},children:[{id:"door-5",kind:"address",at:[0,0,3.2],props:{number:5},tags:["address"]}]},{id:"lamp-5",kind:"lamp",at:[10.14,0,-26.28]},{id:"house-6",kind:"house",at:[-9.03,0,-33.96],rot:.26,props:{width:6.1,depth:4.6,roof:"shingle",wall:"plaster"},children:[{id:"door-6",kind:"address",at:[0,0,3.2],props:{number:6},tags:["address"]}]},{id:"house-7",kind:"house",at:[-26.96,0,-21.92],rot:.888,props:{width:4.8,depth:4,roof:"shingle",wall:"plaster"},children:[{id:"door-7",kind:"address",at:[0,0,3.2],props:{number:7},tags:["address"]}]},{id:"lamp-7",kind:"lamp",at:[-22.77,0,-18.51]},{id:"house-8",kind:"house",at:[-34.12,0,-1.85],rot:1.517,props:{width:5.6,depth:4.2,roof:"thatch",wall:"ashlar"},children:[{id:"door-8",kind:"address",at:[0,0,3.2],props:{number:8},tags:["address"]}]},{id:"house-9",kind:"house",at:[-30.84,0,19.95],rot:2.145,props:{width:5.5,depth:4.8,roof:"tile",wall:"ashlar"},children:[{id:"door-9",kind:"address",at:[0,0,3.2],props:{number:9},tags:["address"]}]},{id:"lamp-9",kind:"lamp",at:[-26.3,0,17.01]},{id:"house-10",kind:"house",at:[-12.21,0,31.64],rot:2.773,props:{width:5.4,depth:4.6,roof:"shingle",wall:"ashlar"},children:[{id:"door-10",kind:"address",at:[0,0,3.2],props:{number:10},tags:["address"]}]},{id:"road-1",kind:"road",at:[5.79,0,25.35],rot:1.795,props:{length:12.2,width:4.2}},{id:"road-2",kind:"road",at:[16.21,0,20.33],rot:2.244,props:{length:12.2,width:4.2}},{id:"road-3",kind:"road",at:[23.43,0,11.28],rot:2.693,props:{length:12.2,width:4.2}},{id:"road-4",kind:"road",at:[26,0,0],rot:3.142,props:{length:12.2,width:4.2}},{id:"road-5",kind:"road",at:[23.43,0,-11.28],rot:3.59,props:{length:12.2,width:4.2}},{id:"road-6",kind:"road",at:[16.21,0,-20.33],rot:4.039,props:{length:12.2,width:4.2}},{id:"road-7",kind:"road",at:[5.79,0,-25.35],rot:4.488,props:{length:12.2,width:4.2}},{id:"road-8",kind:"road",at:[-5.79,0,-25.35],rot:4.937,props:{length:12.2,width:4.2}},{id:"road-9",kind:"road",at:[-16.21,0,-20.33],rot:5.386,props:{length:12.2,width:4.2}},{id:"road-10",kind:"road",at:[-23.43,0,-11.28],rot:5.834,props:{length:12.2,width:4.2}},{id:"road-11",kind:"road",at:[-26,0,0],rot:6.283,props:{length:12.2,width:4.2}},{id:"road-12",kind:"road",at:[-23.43,0,11.28],rot:6.732,props:{length:12.2,width:4.2}},{id:"road-13",kind:"road",at:[-16.21,0,20.33],rot:7.181,props:{length:12.2,width:4.2}},{id:"road-14",kind:"road",at:[-5.79,0,25.35],rot:7.63,props:{length:12.2,width:4.2}},{id:"spoke-1",kind:"road",at:[9.9,0,9.9],rot:.785,props:{length:22,width:2.8}},{id:"spoke-2",kind:"road",at:[9.9,0,-9.9],rot:2.356,props:{length:22,width:2.8}},{id:"spoke-3",kind:"road",at:[-9.9,0,-9.9],rot:3.927,props:{length:22,width:2.8}},{id:"spoke-4",kind:"road",at:[-9.9,0,9.9],rot:5.498,props:{length:22,width:2.8}},{id:"way-0",kind:"waypoint",at:[0,0,26.7],props:{order:0},tags:["waypoint"]},{id:"way-1",kind:"waypoint",at:[13.1,0,22.69],props:{order:1},tags:["waypoint"]},{id:"way-2",kind:"waypoint",at:[23.35,0,13.48],props:{order:2},tags:["waypoint"]},{id:"way-3",kind:"waypoint",at:[26.97,0,0],props:{order:3},tags:["waypoint"]},{id:"way-4",kind:"waypoint",at:[22.6,0,-13.05],props:{order:4},tags:["waypoint"]},{id:"way-5",kind:"waypoint",at:[13.33,0,-23.09],props:{order:5},tags:["waypoint"]},{id:"way-6",kind:"waypoint",at:[0,0,-24.97],props:{order:6},tags:["waypoint"]},{id:"way-7",kind:"waypoint",at:[-13.02,0,-22.55],props:{order:7},tags:["waypoint"]},{id:"way-8",kind:"waypoint",at:[-22.21,0,-12.82],props:{order:8},tags:["waypoint"]},{id:"way-9",kind:"waypoint",at:[-26.47,0,0],props:{order:9},tags:["waypoint"]},{id:"way-10",kind:"waypoint",at:[-22.61,0,13.05],props:{order:10},tags:["waypoint"]},{id:"way-11",kind:"waypoint",at:[-13.27,0,22.98],props:{order:11},tags:["waypoint"]},{id:"tree-1",kind:"tree",at:[-7.84,0,53.7],rot:5.172,props:{species:"birch",height:8.2}},{id:"tree-2",kind:"tree",at:[-54,0,-3.89],rot:1.963,props:{species:"pine",height:5}},{id:"tree-3",kind:"tree",at:[9.46,0,62.04],rot:5.236,props:{species:"cedar",height:5.1}},{id:"tree-4",kind:"tree",at:[-37.43,0,-40.42],rot:4.504,props:{species:"maple",height:6.4}},{id:"tree-5",kind:"tree",at:[-4.85,0,56.09],rot:5.057,props:{species:"cedar",height:9.2}},{id:"tree-6",kind:"tree",at:[48.97,0,41],rot:3.185,props:{species:"birch",height:5.8}},{id:"tree-7",kind:"tree",at:[28.31,0,-37.06],rot:5.112,props:{species:"maple",height:8.7}},{id:"tree-8",kind:"tree",at:[-53.52,0,-34.7],rot:3.828,props:{species:"cedar",height:9.8}},{id:"tree-9",kind:"tree",at:[3.18,0,-46.95],rot:3.669,props:{species:"cedar",height:9.3}},{id:"tree-10",kind:"tree",at:[50.39,0,19.98],rot:3.002,props:{species:"birch",height:5.9}},{id:"tree-11",kind:"tree",at:[51.66,0,-.21],rot:3,props:{species:"oak",height:5}},{id:"tree-12",kind:"tree",at:[37.67,0,19.75],rot:.674,props:{species:"maple",height:9.9}},{id:"tree-13",kind:"tree",at:[16.91,0,42.61],rot:2.545,props:{species:"birch",height:8.7}},{id:"tree-14",kind:"tree",at:[36.76,0,-33.77],rot:4.973,props:{species:"cedar",height:9}},{id:"tree-15",kind:"tree",at:[-11.16,0,-58.51],rot:2.59,props:{species:"birch",height:6.5}},{id:"tree-16",kind:"tree",at:[-10.07,0,-58.22],rot:.503,props:{species:"pine",height:9.1}},{id:"tree-17",kind:"tree",at:[-52.2,0,27.59],rot:2.701,props:{species:"pine",height:9.6}},{id:"tree-18",kind:"tree",at:[49.95,0,-.42],rot:2.997,props:{species:"maple",height:7}},{id:"tree-19",kind:"tree",at:[-8.61,0,53.44],rot:2.741,props:{species:"pine",height:7.7}},{id:"tree-20",kind:"tree",at:[59.2,0,-16.5],rot:3.596,props:{species:"maple",height:9.2}},{id:"tree-21",kind:"tree",at:[1.41,0,-51.59],rot:4.384,props:{species:"maple",height:7.8}},{id:"tree-22",kind:"tree",at:[-38.07,0,-25.05],rot:4.356,props:{species:"pine",height:8}},{id:"tree-23",kind:"tree",at:[-39.66,0,31.17],rot:1.856,props:{species:"oak",height:8.4}},{id:"tree-24",kind:"tree",at:[-62.82,0,-7.08],rot:1.994,props:{species:"pine",height:5.3}},{id:"tree-25",kind:"tree",at:[-61.3,0,-11.55],rot:4.927,props:{species:"maple",height:9.8}},{id:"tree-26",kind:"tree",at:[62.84,0,9.34],rot:1.776,props:{species:"birch",height:7}},{id:"tree-27",kind:"tree",at:[-57.19,0,-13.33],rot:3.919,props:{species:"cedar",height:8.1}},{id:"tree-28",kind:"tree",at:[-26.77,0,-39.82],rot:5.227,props:{species:"birch",height:5.7}},{id:"tree-29",kind:"tree",at:[-51.43,0,-8.96],rot:3.516,props:{species:"birch",height:9.4}},{id:"tree-30",kind:"tree",at:[-13.2,0,43.41],rot:.639,props:{species:"pine",height:7.6}},{id:"tree-31",kind:"tree",at:[38.7,0,-48.47],rot:5.386,props:{species:"birch",height:9.5}},{id:"tree-32",kind:"tree",at:[51.99,0,-9.49],rot:5.818,props:{species:"cedar",height:9}},{id:"tree-33",kind:"tree",at:[53.66,0,-31.07],rot:6.092,props:{species:"maple",height:5}},{id:"tree-34",kind:"tree",at:[50.86,0,29.02],rot:.657,props:{species:"oak",height:9.6}},{id:"fence-1",kind:"fence",at:[12.12,0,39.17],rot:-.3,props:{length:6}},{id:"fence-2",kind:"fence",at:[36.26,0,19.13],rot:-1.085,props:{length:6}},{id:"fence-3",kind:"fence",at:[39.17,0,-12.12],rot:-1.871,props:{length:6}},{id:"fence-4",kind:"fence",at:[19.13,0,-36.26],rot:-2.656,props:{length:6}},{id:"fence-5",kind:"fence",at:[-12.12,0,-39.17],rot:-3.442,props:{length:6}},{id:"fence-6",kind:"fence",at:[-36.26,0,-19.13],rot:-4.227,props:{length:6}},{id:"fence-7",kind:"fence",at:[-39.17,0,12.12],rot:-5.012,props:{length:6}},{id:"fence-8",kind:"fence",at:[-19.13,0,36.26],rot:-5.798,props:{length:6}}],X1={format:u1,version:d1,name:f1,seed:p1,meta:m1,entities:g1};export{L1 as $,yv as A,v1 as B,_t as C,Uf as D,P1 as E,el as F,E1 as G,Lf as H,hv as I,Ov as J,Jv as K,C1 as L,k as M,ex as N,Me as O,mi as P,pv as Q,Qf as R,F1 as S,hx as T,lv as U,mt as V,uv as W,M1 as X,D1 as Y,N1 as Z,T1 as _,Zt as a,H1 as a0,je as a1,k1 as a2,O1 as a3,U1 as a4,I1 as a5,R1 as b,I as c,Is as d,be as e,_1 as f,W1 as g,X1 as h,x1 as i,y1 as j,jt as k,_l as l,s1 as m,Vo as n,z1 as o,G1 as p,V1 as q,nu as r,B1 as s,w1 as t,A1 as u,b1 as v,S1 as w,ux as x,Yv as y,mv as z};
