import"./modulepreload-polyfill-B5Qt9EMX.js";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ga="185",tc=0,$a=1,nc=2,gr=1,ic=2,Fi=3,On=0,Ft=1,vn=2,Sn=0,gi=1,Za=2,Ja=3,Qa=4,rc=5,qn=100,sc=101,ac=102,oc=103,lc=104,cc=200,dc=201,uc=202,hc=203,ys=204,Es=205,fc=206,pc=207,mc=208,gc=209,_c=210,xc=211,vc=212,Mc=213,Sc=214,Ts=0,As=1,ws=2,vi=3,Rs=4,Cs=5,Ps=6,Ds=7,al=0,bc=1,yc=2,cn=0,ol=1,ll=2,cl=3,dl=4,ul=5,hl=6,fl=7,pl=300,Zn=301,Mi=302,kr=303,Gr=304,Lr=306,Ls=1e3,Mn=1001,Is=1002,At=1003,Ec=1004,Xi=1005,Dt=1006,Vr=1007,Kn=1008,Gt=1009,ml=1010,gl=1011,Bi=1012,_a=1013,un=1014,on=1015,yn=1016,xa=1017,va=1018,zi=1020,_l=35902,xl=35899,vl=1021,Ml=1022,Qt=1023,En=1026,$n=1027,Sl=1028,Ma=1029,Jn=1030,Sa=1031,ba=1033,_r=33776,xr=33777,vr=33778,Mr=33779,Us=35840,Ns=35841,Fs=35842,Os=35843,Bs=36196,zs=37492,ks=37496,Gs=37488,Vs=37489,br=37490,Hs=37491,Ws=37808,Xs=37809,qs=37810,Ys=37811,Ks=37812,$s=37813,Zs=37814,Js=37815,Qs=37816,js=37817,ea=37818,ta=37819,na=37820,ia=37821,ra=36492,sa=36494,aa=36495,oa=36283,la=36284,yr=36285,ca=36286,Tc=3200,da=0,Ac=1,Nn="",Xt="srgb",Er="srgb-linear",Tr="linear",Je="srgb",ti=7680,ja=519,wc=512,Rc=513,Cc=514,ya=515,Pc=516,Dc=517,Ea=518,Lc=519,eo=35044,to="300 es",ln=2e3,ki=2001;function Ic(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Uc(){const i=Ar("canvas");return i.style.display="block",i}const no={};function io(...i){const e="THREE."+i.shift();console.log(e,...i)}function bl(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ce(...i){i=bl(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function He(...i){i=bl(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function _i(...i){const e=i.join(" ");e in no||(no[e]=!0,Ce(...i))}function Nc(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Fc={[Ts]:As,[ws]:Ps,[Rs]:Ds,[vi]:Cs,[As]:Ts,[Ps]:ws,[Ds]:Rs,[Cs]:vi};class Qn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hr=Math.PI/180,ua=180/Math.PI;function Gi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function Ve(i,e,t){return Math.max(e,Math.min(t,i))}function Oc(i,e){return(i%e+e)%e}function Wr(i,e,t){return(1-t)*i+t*e}function Ri(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Na=class Na{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Na.prototype.isVector2=!0;let Pe=Na;class yi{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],h=n[r+2],p=n[r+3],d=s[a+0],f=s[a+1],x=s[a+2],S=s[a+3];if(p!==S||l!==d||c!==f||h!==x){let g=l*d+c*f+h*x+p*S;g<0&&(d=-d,f=-f,x=-x,S=-S,g=-g);let u=1-o;if(g<.9995){const y=Math.acos(g),A=Math.sin(y);u=Math.sin(u*y)/A,o=Math.sin(o*y)/A,l=l*u+d*o,c=c*u+f*o,h=h*u+x*o,p=p*u+S*o}else{l=l*u+d*o,c=c*u+f*o,h=h*u+x*o,p=p*u+S*o;const y=1/Math.sqrt(l*l+c*c+h*h+p*p);l*=y,c*=y,h*=y,p*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],p=s[a],d=s[a+1],f=s[a+2],x=s[a+3];return e[t]=o*x+h*p+l*f-c*d,e[t+1]=l*x+h*d+c*p-o*f,e[t+2]=c*x+h*f+o*d-l*p,e[t+3]=h*x-o*p-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),p=o(s/2),d=l(n/2),f=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=d*h*p+c*f*x,this._y=c*f*p-d*h*x,this._z=c*h*x+d*f*p,this._w=c*h*p-d*f*x;break;case"YXZ":this._x=d*h*p+c*f*x,this._y=c*f*p-d*h*x,this._z=c*h*x-d*f*p,this._w=c*h*p+d*f*x;break;case"ZXY":this._x=d*h*p-c*f*x,this._y=c*f*p+d*h*x,this._z=c*h*x+d*f*p,this._w=c*h*p-d*f*x;break;case"ZYX":this._x=d*h*p-c*f*x,this._y=c*f*p+d*h*x,this._z=c*h*x-d*f*p,this._w=c*h*p+d*f*x;break;case"YZX":this._x=d*h*p+c*f*x,this._y=c*f*p+d*h*x,this._z=c*h*x-d*f*p,this._w=c*h*p-d*f*x;break;case"XZY":this._x=d*h*p-c*f*x,this._y=c*f*p-d*h*x,this._z=c*h*x+d*f*p,this._w=c*h*p+d*f*x;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],p=t[10],d=n+o+p;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(n>o&&n>p){const f=2*Math.sqrt(1+n-o-p);this._w=(h-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>p){const f=2*Math.sqrt(1+o-n-p);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+p-n-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-r*o,this._w=a*h-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Fa=class Fa{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ro.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ro.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),h=2*(o*t-s*r),p=2*(s*n-a*t);return this.x=t+l*c+a*p-o*h,this.y=n+l*h+o*c-s*p,this.z=r+l*p+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Xr.copy(this).projectOnVector(e),this.sub(Xr)}reflect(e){return this.sub(Xr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Fa.prototype.isVector3=!0;let N=Fa;const Xr=new N,ro=new yi,Oa=class Oa{constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],p=n[7],d=n[2],f=n[5],x=n[8],S=r[0],g=r[3],u=r[6],y=r[1],A=r[4],M=r[7],w=r[2],b=r[5],C=r[8];return s[0]=a*S+o*y+l*w,s[3]=a*g+o*A+l*b,s[6]=a*u+o*M+l*C,s[1]=c*S+h*y+p*w,s[4]=c*g+h*A+p*b,s[7]=c*u+h*M+p*C,s[2]=d*S+f*y+x*w,s[5]=d*g+f*A+x*b,s[8]=d*u+f*M+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=h*a-o*c,d=o*l-h*s,f=c*s-a*l,x=t*p+n*d+r*f;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/x;return e[0]=p*S,e[1]=(r*c-h*n)*S,e[2]=(o*n-r*a)*S,e[3]=d*S,e[4]=(h*t-r*l)*S,e[5]=(r*s-o*t)*S,e[6]=f*S,e[7]=(n*l-c*t)*S,e[8]=(a*t-n*s)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return _i("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(qr.makeScale(e,t)),this}rotate(e){return _i("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(qr.makeRotation(-e)),this}translate(e,t){return _i("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(qr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Oa.prototype.isMatrix3=!0;let Ie=Oa;const qr=new Ie,so=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ao=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bc(){const i={enabled:!0,workingColorSpace:Er,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Je&&(r.r=bn(r.r),r.g=bn(r.g),r.b=bn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(r.r=xi(r.r),r.g=xi(r.g),r.b=xi(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Nn?Tr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return _i("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return _i("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Er]:{primaries:e,whitePoint:n,transfer:Tr,toXYZ:so,fromXYZ:ao,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:n,transfer:Je,toXYZ:so,fromXYZ:ao,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),i}const Ge=Bc();function bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function xi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ni;class zc{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ni===void 0&&(ni=Ar("canvas")),ni.width=e.width,ni.height=e.height;const r=ni.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=ni}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ar("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=bn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(bn(t[n]/255)*255):t[n]=bn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let kc=0;class Ta{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kc++}),this.uuid=Gi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Yr(r[a].image)):s.push(Yr(r[a]))}else s=Yr(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Yr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?zc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let Gc=0;const Kr=new N;class It extends Qn{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,n=Mn,r=Mn,s=Dt,a=Kn,o=Qt,l=Gt,c=It.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gc++}),this.uuid=Gi(),this.name="",this.source=new Ta(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Kr).x}get height(){return this.source.getSize(Kr).y}get depth(){return this.source.getSize(Kr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ls:e.x=e.x-Math.floor(e.x);break;case Mn:e.x=e.x<0?0:1;break;case Is:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ls:e.y=e.y-Math.floor(e.y);break;case Mn:e.y=e.y<0?0:1;break;case Is:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=pl;It.DEFAULT_ANISOTROPY=1;const Ba=class Ba{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],h=l[4],p=l[8],d=l[1],f=l[5],x=l[9],S=l[2],g=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(p-S)<.01&&Math.abs(x-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(p+S)<.1&&Math.abs(x+g)<.1&&Math.abs(c+f+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,M=(f+1)/2,w=(u+1)/2,b=(h+d)/4,C=(p+S)/4,_=(x+g)/4;return A>M&&A>w?A<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(A),r=b/n,s=C/n):M>w?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=b/r,s=_/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=C/s,r=_/s),this.set(n,r,s,t),this}let y=Math.sqrt((g-x)*(g-x)+(p-S)*(p-S)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-x)/y,this.y=(p-S)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ba.prototype.isVector4=!0;let ct=Ba;class Vc extends Qn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:n.depth},s=new It(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Dt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Ta(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends Vc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class yl extends It{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hc extends It{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Dr=class Dr{constructor(e,t,n,r,s,a,o,l,c,h,p,d,f,x,S,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,h,p,d,f,x,S,g)}set(e,t,n,r,s,a,o,l,c,h,p,d,f,x,S,g){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=p,u[14]=d,u[3]=f,u[7]=x,u[11]=S,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dr().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,r=1/ii.setFromMatrixColumn(e,0).length(),s=1/ii.setFromMatrixColumn(e,1).length(),a=1/ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const d=a*h,f=a*p,x=o*h,S=o*p;t[0]=l*h,t[4]=-l*p,t[8]=c,t[1]=f+x*c,t[5]=d-S*c,t[9]=-o*l,t[2]=S-d*c,t[6]=x+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*p,x=c*h,S=c*p;t[0]=d+S*o,t[4]=x*o-f,t[8]=a*c,t[1]=a*p,t[5]=a*h,t[9]=-o,t[2]=f*o-x,t[6]=S+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*p,x=c*h,S=c*p;t[0]=d-S*o,t[4]=-a*p,t[8]=x+f*o,t[1]=f+x*o,t[5]=a*h,t[9]=S-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*p,x=o*h,S=o*p;t[0]=l*h,t[4]=x*c-f,t[8]=d*c+S,t[1]=l*p,t[5]=S*c+d,t[9]=f*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,x=o*l,S=o*c;t[0]=l*h,t[4]=S-d*p,t[8]=x*p+f,t[1]=p,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*p+x,t[10]=d-S*p}else if(e.order==="XZY"){const d=a*l,f=a*c,x=o*l,S=o*c;t[0]=l*h,t[4]=-p,t[8]=c*h,t[1]=d*p+S,t[5]=a*h,t[9]=f*p-x,t[2]=x*p-f,t[6]=o*h,t[10]=S*p+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wc,e,Xc)}lookAt(e,t,n){const r=this.elements;return Bt.subVectors(e,t),Bt.lengthSq()===0&&(Bt.z=1),Bt.normalize(),Rn.crossVectors(n,Bt),Rn.lengthSq()===0&&(Math.abs(n.z)===1?Bt.x+=1e-4:Bt.z+=1e-4,Bt.normalize(),Rn.crossVectors(n,Bt)),Rn.normalize(),qi.crossVectors(Bt,Rn),r[0]=Rn.x,r[4]=qi.x,r[8]=Bt.x,r[1]=Rn.y,r[5]=qi.y,r[9]=Bt.y,r[2]=Rn.z,r[6]=qi.z,r[10]=Bt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],p=n[5],d=n[9],f=n[13],x=n[2],S=n[6],g=n[10],u=n[14],y=n[3],A=n[7],M=n[11],w=n[15],b=r[0],C=r[4],_=r[8],E=r[12],D=r[1],P=r[5],R=r[9],q=r[13],K=r[2],B=r[6],W=r[10],X=r[14],ne=r[3],re=r[7],le=r[11],pe=r[15];return s[0]=a*b+o*D+l*K+c*ne,s[4]=a*C+o*P+l*B+c*re,s[8]=a*_+o*R+l*W+c*le,s[12]=a*E+o*q+l*X+c*pe,s[1]=h*b+p*D+d*K+f*ne,s[5]=h*C+p*P+d*B+f*re,s[9]=h*_+p*R+d*W+f*le,s[13]=h*E+p*q+d*X+f*pe,s[2]=x*b+S*D+g*K+u*ne,s[6]=x*C+S*P+g*B+u*re,s[10]=x*_+S*R+g*W+u*le,s[14]=x*E+S*q+g*X+u*pe,s[3]=y*b+A*D+M*K+w*ne,s[7]=y*C+A*P+M*B+w*re,s[11]=y*_+A*R+M*W+w*le,s[15]=y*E+A*q+M*X+w*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],p=e[6],d=e[10],f=e[14],x=e[3],S=e[7],g=e[11],u=e[15],y=l*f-c*d,A=o*f-c*p,M=o*d-l*p,w=a*f-c*h,b=a*d-l*h,C=a*p-o*h;return t*(S*y-g*A+u*M)-n*(x*y-g*w+u*b)+r*(x*A-S*w+u*C)-s*(x*M-S*b+g*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(s*h-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=e[9],d=e[10],f=e[11],x=e[12],S=e[13],g=e[14],u=e[15],y=t*o-n*a,A=t*l-r*a,M=t*c-s*a,w=n*l-r*o,b=n*c-s*o,C=r*c-s*l,_=h*S-p*x,E=h*g-d*x,D=h*u-f*x,P=p*g-d*S,R=p*u-f*S,q=d*u-f*g,K=y*q-A*R+M*P+w*D-b*E+C*_;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/K;return e[0]=(o*q-l*R+c*P)*B,e[1]=(r*R-n*q-s*P)*B,e[2]=(S*C-g*b+u*w)*B,e[3]=(d*b-p*C-f*w)*B,e[4]=(l*D-a*q-c*E)*B,e[5]=(t*q-r*D+s*E)*B,e[6]=(g*M-x*C-u*A)*B,e[7]=(h*C-d*M+f*A)*B,e[8]=(a*R-o*D+c*_)*B,e[9]=(n*D-t*R-s*_)*B,e[10]=(x*b-S*M+u*y)*B,e[11]=(p*M-h*b-f*y)*B,e[12]=(o*E-a*P-l*_)*B,e[13]=(t*P-n*E+r*_)*B,e[14]=(S*A-x*w-g*y)*B,e[15]=(h*w-p*A+d*y)*B,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,p=o+o,d=s*c,f=s*h,x=s*p,S=a*h,g=a*p,u=o*p,y=l*c,A=l*h,M=l*p,w=n.x,b=n.y,C=n.z;return r[0]=(1-(S+u))*w,r[1]=(f+M)*w,r[2]=(x-A)*w,r[3]=0,r[4]=(f-M)*b,r[5]=(1-(d+u))*b,r[6]=(g+y)*b,r[7]=0,r[8]=(x+A)*C,r[9]=(g-y)*C,r[10]=(1-(d+S))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=ii.set(r[0],r[1],r[2]).length();const o=ii.set(r[4],r[5],r[6]).length(),l=ii.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Yt.copy(this);const c=1/a,h=1/o,p=1/l;return Yt.elements[0]*=c,Yt.elements[1]*=c,Yt.elements[2]*=c,Yt.elements[4]*=h,Yt.elements[5]*=h,Yt.elements[6]*=h,Yt.elements[8]*=p,Yt.elements[9]*=p,Yt.elements[10]*=p,t.setFromRotationMatrix(Yt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=ln,l=!1){const c=this.elements,h=2*s/(t-e),p=2*s/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r);let x,S;if(l)x=s/(a-s),S=a*s/(a-s);else if(o===ln)x=-(a+s)/(a-s),S=-2*a*s/(a-s);else if(o===ki)x=-a/(a-s),S=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=p,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=ln,l=!1){const c=this.elements,h=2/(t-e),p=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r);let x,S;if(l)x=1/(a-s),S=a/(a-s);else if(o===ln)x=-2/(a-s),S=-(a+s)/(a-s);else if(o===ki)x=-1/(a-s),S=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=p,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Dr.prototype.isMatrix4=!0;let ot=Dr;const ii=new N,Yt=new ot,Wc=new N(0,0,0),Xc=new N(1,1,1),Rn=new N,qi=new N,Bt=new N,oo=new ot,lo=new yi;class Bn{constructor(e=0,t=0,n=0,r=Bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],p=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-p,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ve(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return oo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(oo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return lo.setFromEuler(this),this.setFromQuaternion(lo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bn.DEFAULT_ORDER="XYZ";class Aa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qc=0;const co=new N,ri=new yi,fn=new ot,Yi=new N,Ci=new N,Yc=new N,Kc=new yi,uo=new N(1,0,0),ho=new N(0,1,0),fo=new N(0,0,1),po={type:"added"},$c={type:"removed"},si={type:"childadded",child:null},$r={type:"childremoved",child:null};class _t extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qc++}),this.uuid=Gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new N,t=new Bn,n=new yi,r=new N(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new Ie}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Aa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ri.setFromAxisAngle(e,t),this.quaternion.multiply(ri),this}rotateOnWorldAxis(e,t){return ri.setFromAxisAngle(e,t),this.quaternion.premultiply(ri),this}rotateX(e){return this.rotateOnAxis(uo,e)}rotateY(e){return this.rotateOnAxis(ho,e)}rotateZ(e){return this.rotateOnAxis(fo,e)}translateOnAxis(e,t){return co.copy(e).applyQuaternion(this.quaternion),this.position.add(co.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(uo,e)}translateY(e){return this.translateOnAxis(ho,e)}translateZ(e){return this.translateOnAxis(fo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Yi.copy(e):Yi.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Ci.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(Ci,Yi,this.up):fn.lookAt(Yi,Ci,this.up),this.quaternion.setFromRotationMatrix(fn),r&&(fn.extractRotation(r.matrixWorld),ri.setFromRotationMatrix(fn),this.quaternion.premultiply(ri.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(He("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(po),si.child=e,this.dispatchEvent(si),si.child=null):He("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($c),$r.child=e,this.dispatchEvent($r),$r.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(po),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ci,e,Yc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ci,Kc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const p=l[c];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),p=a(e.shapes),d=a(e.skeletons),f=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),p.length>0&&(n.shapes=p),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),x.length>0&&(n.nodes=x)}return n.object=r,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}_t.DEFAULT_UP=new N(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class St extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zc={type:"move"};class Zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new St,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new St,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new St,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const S of e.hand.values()){const g=t.getJointPose(S,n),u=this._getHandJoint(c,S);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const h=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],d=h.position.distanceTo(p.position),f=.02,x=.005;c.inputState.pinching&&d>f+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Zc)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new St;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const El={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cn={h:0,s:0,l:0},Ki={h:0,s:0,l:0};function Jr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Be{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ge.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Ge.workingColorSpace){if(e=Oc(e,1),t=Ve(t,0,1),n=Ve(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Jr(a,s,e+1/3),this.g=Jr(a,s,e),this.b=Jr(a,s,e-1/3)}return Ge.colorSpaceToWorking(this,r),this}setStyle(e,t=Xt){function n(s){s!==void 0&&parseFloat(s)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const n=El[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bn(e.r),this.g=bn(e.g),this.b=bn(e.b),this}copyLinearToSRGB(e){return this.r=xi(e.r),this.g=xi(e.g),this.b=xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return Ge.workingToColorSpace(Pt.copy(this),e),Math.round(Ve(Pt.r*255,0,255))*65536+Math.round(Ve(Pt.g*255,0,255))*256+Math.round(Ve(Pt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.workingToColorSpace(Pt.copy(this),t);const n=Pt.r,r=Pt.g,s=Pt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=h<=.5?p/(a+o):p/(2-a-o),a){case n:l=(r-s)/p+(r<s?6:0);break;case r:l=(s-n)/p+2;break;case s:l=(n-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.workingToColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Xt){Ge.workingToColorSpace(Pt.copy(this),e);const t=Pt.r,n=Pt.g,r=Pt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Cn),this.setHSL(Cn.h+e,Cn.s+t,Cn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Cn),e.getHSL(Ki);const n=Wr(Cn.h,Ki.h,t),r=Wr(Cn.s,Ki.s,t),s=Wr(Cn.l,Ki.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new Be;Be.NAMES=El;class wa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Be(e),this.near=t,this.far=n}clone(){return new wa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Jc extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Kt=new N,pn=new N,Qr=new N,mn=new N,ai=new N,oi=new N,mo=new N,jr=new N,es=new N,ts=new N,ns=new ct,is=new ct,rs=new ct;class Jt{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Kt.subVectors(e,t),r.cross(Kt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Kt.subVectors(r,t),pn.subVectors(n,t),Qr.subVectors(e,t);const a=Kt.dot(Kt),o=Kt.dot(pn),l=Kt.dot(Qr),c=pn.dot(pn),h=pn.dot(Qr),p=a*c-o*o;if(p===0)return s.set(0,0,0),null;const d=1/p,f=(c*l-o*h)*d,x=(a*h-o*l)*d;return s.set(1-f-x,x,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mn.x),l.addScaledVector(a,mn.y),l.addScaledVector(o,mn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return ns.setScalar(0),is.setScalar(0),rs.setScalar(0),ns.fromBufferAttribute(e,t),is.fromBufferAttribute(e,n),rs.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ns,s.x),a.addScaledVector(is,s.y),a.addScaledVector(rs,s.z),a}static isFrontFacing(e,t,n,r){return Kt.subVectors(n,t),pn.subVectors(e,t),Kt.cross(pn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kt.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Kt.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Jt.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;ai.subVectors(r,n),oi.subVectors(s,n),jr.subVectors(e,n);const l=ai.dot(jr),c=oi.dot(jr);if(l<=0&&c<=0)return t.copy(n);es.subVectors(e,r);const h=ai.dot(es),p=oi.dot(es);if(h>=0&&p<=h)return t.copy(r);const d=l*p-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ai,a);ts.subVectors(e,s);const f=ai.dot(ts),x=oi.dot(ts);if(x>=0&&f<=x)return t.copy(s);const S=f*c-l*x;if(S<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(oi,o);const g=h*x-f*p;if(g<=0&&p-h>=0&&f-x>=0)return mo.subVectors(s,r),o=(p-h)/(p-h+(f-x)),t.copy(r).addScaledVector(mo,o);const u=1/(g+S+d);return a=S*u,o=d*u,t.copy(n).addScaledVector(ai,a).addScaledVector(oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ei{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($t.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($t.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=$t.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,$t):$t.fromBufferAttribute(s,a),$t.applyMatrix4(e.matrixWorld),this.expandByPoint($t);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$i.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$i.copy(n.boundingBox)),$i.applyMatrix4(e.matrixWorld),this.union($i)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$t),$t.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pi),Zi.subVectors(this.max,Pi),li.subVectors(e.a,Pi),ci.subVectors(e.b,Pi),di.subVectors(e.c,Pi),Pn.subVectors(ci,li),Dn.subVectors(di,ci),Gn.subVectors(li,di);let t=[0,-Pn.z,Pn.y,0,-Dn.z,Dn.y,0,-Gn.z,Gn.y,Pn.z,0,-Pn.x,Dn.z,0,-Dn.x,Gn.z,0,-Gn.x,-Pn.y,Pn.x,0,-Dn.y,Dn.x,0,-Gn.y,Gn.x,0];return!ss(t,li,ci,di,Zi)||(t=[1,0,0,0,1,0,0,0,1],!ss(t,li,ci,di,Zi))?!1:(Ji.crossVectors(Pn,Dn),t=[Ji.x,Ji.y,Ji.z],ss(t,li,ci,di,Zi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$t).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($t).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const gn=[new N,new N,new N,new N,new N,new N,new N,new N],$t=new N,$i=new Ei,li=new N,ci=new N,di=new N,Pn=new N,Dn=new N,Gn=new N,Pi=new N,Zi=new N,Ji=new N,Vn=new N;function ss(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Vn.fromArray(i,s);const o=r.x*Math.abs(Vn.x)+r.y*Math.abs(Vn.y)+r.z*Math.abs(Vn.z),l=e.dot(Vn),c=t.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const vt=new N,Qi=new Pe;let Qc=0;class qt extends Qn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=eo,this.updateRanges=[],this.gpuType=on,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Qi.fromBufferAttribute(this,t),Qi.applyMatrix3(e),this.setXY(t,Qi.x,Qi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix3(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix4(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyNormalMatrix(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.transformDirection(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ri(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ri(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ri(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ri(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==eo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Tl extends qt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Al extends qt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ut extends qt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const jc=new Ei,Di=new N,as=new N;class Ir{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):jc.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Di.subVectors(e,this.center);const t=Di.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Di,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(as.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Di.copy(e.center).add(as)),this.expandByPoint(Di.copy(e.center).sub(as))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ed=0;const Wt=new ot,os=new _t,ui=new N,zt=new Ei,Li=new Ei,Et=new N;class Ut extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ic(e)?Al:Tl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ie().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Wt.makeRotationFromQuaternion(e),this.applyMatrix4(Wt),this}rotateX(e){return Wt.makeRotationX(e),this.applyMatrix4(Wt),this}rotateY(e){return Wt.makeRotationY(e),this.applyMatrix4(Wt),this}rotateZ(e){return Wt.makeRotationZ(e),this.applyMatrix4(Wt),this}translate(e,t,n){return Wt.makeTranslation(e,t,n),this.applyMatrix4(Wt),this}scale(e,t,n){return Wt.makeScale(e,t,n),this.applyMatrix4(Wt),this}lookAt(e){return os.lookAt(e),os.updateMatrix(),this.applyMatrix4(os.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ui).negate(),this.translate(ui.x,ui.y,ui.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ut(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ei);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];zt.setFromBufferAttribute(s),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,zt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,zt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(zt.min),this.boundingBox.expandByPoint(zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&He('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ir);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(zt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Li.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(zt.min,Li.min),zt.expandByPoint(Et),Et.addVectors(zt.max,Li.max),zt.expandByPoint(Et)):(zt.expandByPoint(Li.min),zt.expandByPoint(Li.max))}zt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Et.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Et));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Et.fromBufferAttribute(o,c),l&&(ui.fromBufferAttribute(e,c),Et.add(ui)),r=Math.max(r,n.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&He('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){He("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new N,l[_]=new N;const c=new N,h=new N,p=new N,d=new Pe,f=new Pe,x=new Pe,S=new N,g=new N;function u(_,E,D){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),p.fromBufferAttribute(n,D),d.fromBufferAttribute(s,_),f.fromBufferAttribute(s,E),x.fromBufferAttribute(s,D),h.sub(c),p.sub(c),f.sub(d),x.sub(d);const P=1/(f.x*x.y-x.x*f.y);isFinite(P)&&(S.copy(h).multiplyScalar(x.y).addScaledVector(p,-f.y).multiplyScalar(P),g.copy(p).multiplyScalar(f.x).addScaledVector(h,-x.x).multiplyScalar(P),o[_].add(S),o[E].add(S),o[D].add(S),l[_].add(g),l[E].add(g),l[D].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let _=0,E=y.length;_<E;++_){const D=y[_],P=D.start,R=D.count;for(let q=P,K=P+R;q<K;q+=3)u(e.getX(q+0),e.getX(q+1),e.getX(q+2))}const A=new N,M=new N,w=new N,b=new N;function C(_){w.fromBufferAttribute(r,_),b.copy(w);const E=o[_];A.copy(E),A.sub(w.multiplyScalar(w.dot(E))).normalize(),M.crossVectors(b,E);const P=M.dot(l[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,P)}for(let _=0,E=y.length;_<E;++_){const D=y[_],P=D.start,R=D.count;for(let q=P,K=P+R;q<K;q+=3)C(e.getX(q+0)),C(e.getX(q+1)),C(e.getX(q+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new qt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new N,s=new N,a=new N,o=new N,l=new N,c=new N,h=new N,p=new N;if(e)for(let d=0,f=e.count;d<f;d+=3){const x=e.getX(d+0),S=e.getX(d+1),g=e.getX(d+2);r.fromBufferAttribute(t,x),s.fromBufferAttribute(t,S),a.fromBufferAttribute(t,g),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,p=o.normalized,d=new c.constructor(l.length*h);let f=0,x=0;for(let S=0,g=l.length;S<g;S++){o.isInterleavedBufferAttribute?f=l[S]*o.data.stride+o.offset:f=l[S]*h;for(let u=0;u<h;u++)d[x++]=c[f++]}return new qt(d,h,p)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,p=c.length;h<p;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let p=0,d=c.length;p<d;p++){const f=c[p];h.push(f.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],p=s[c];for(let d=0,f=p.length;d<f;d++)h.push(p[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let td=0;class Ti extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=Gi(),this.name="",this.type="Material",this.blending=gi,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ys,this.blendDst=Es,this.blendEquation=qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ja,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ti,this.stencilZFail=ti,this.stencilZPass=ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ys&&(n.blendSrc=this.blendSrc),this.blendDst!==Es&&(n.blendDst=this.blendDst),this.blendEquation!==qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ja&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ti&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ti&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ti&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Be().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Pe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Pe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const _n=new N,ls=new N,ji=new N,Ln=new N,cs=new N,er=new N,ds=new N;class Ra{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ls.copy(e).add(t).multiplyScalar(.5),ji.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(ls);const s=e.distanceTo(t)*.5,a=-this.direction.dot(ji),o=Ln.dot(this.direction),l=-Ln.dot(ji),c=Ln.lengthSq(),h=Math.abs(1-a*a);let p,d,f,x;if(h>0)if(p=a*l-o,d=a*o-l,x=s*h,p>=0)if(d>=-x)if(d<=x){const S=1/h;p*=S,d*=S,f=p*(p+a*d+2*o)+d*(a*p+d+2*l)+c}else d=s,p=Math.max(0,-(a*d+o)),f=-p*p+d*(d+2*l)+c;else d=-s,p=Math.max(0,-(a*d+o)),f=-p*p+d*(d+2*l)+c;else d<=-x?(p=Math.max(0,-(-a*s+o)),d=p>0?-s:Math.min(Math.max(-s,-l),s),f=-p*p+d*(d+2*l)+c):d<=x?(p=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(p=Math.max(0,-(a*s+o)),d=p>0?s:Math.min(Math.max(-s,-l),s),f=-p*p+d*(d+2*l)+c);else d=a>0?-s:s,p=Math.max(0,-(a*d+o)),f=-p*p+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(ls).addScaledVector(ji,d),f}intersectSphere(e,t){_n.subVectors(e.center,this.origin);const n=_n.dot(this.direction),r=_n.dot(_n)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-d.z)*p,l=(e.max.z-d.z)*p):(o=(e.max.z-d.z)*p,l=(e.min.z-d.z)*p),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,r,s){cs.subVectors(t,e),er.subVectors(n,e),ds.crossVectors(cs,er);let a=this.direction.dot(ds),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ln.subVectors(this.origin,e);const l=o*this.direction.dot(er.crossVectors(Ln,er));if(l<0)return null;const c=o*this.direction.dot(cs.cross(Ln));if(c<0||l+c>a)return null;const h=-o*Ln.dot(ds);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wl extends Ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const go=new ot,Hn=new Ra,tr=new Ir,_o=new N,nr=new N,ir=new N,rr=new N,us=new N,sr=new N,xo=new N,ar=new N;class jt extends _t{constructor(e=new Ut,t=new wl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){sr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],p=s[l];h!==0&&(us.fromBufferAttribute(p,e),a?sr.addScaledVector(us,h):sr.addScaledVector(us.sub(t),h))}t.add(sr)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(s),Hn.copy(e.ray).recast(e.near),!(tr.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(tr,_o)===null||Hn.origin.distanceToSquared(_o)>(e.far-e.near)**2))&&(go.copy(s).invert(),Hn.copy(e.ray).applyMatrix4(go),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,p=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,S=d.length;x<S;x++){const g=d[x],u=a[g.materialIndex],y=Math.max(g.start,f.start),A=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=y,w=A;M<w;M+=3){const b=o.getX(M),C=o.getX(M+1),_=o.getX(M+2);r=or(this,u,e,n,c,h,p,b,C,_),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const x=Math.max(0,f.start),S=Math.min(o.count,f.start+f.count);for(let g=x,u=S;g<u;g+=3){const y=o.getX(g),A=o.getX(g+1),M=o.getX(g+2);r=or(this,a,e,n,c,h,p,y,A,M),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,S=d.length;x<S;x++){const g=d[x],u=a[g.materialIndex],y=Math.max(g.start,f.start),A=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=y,w=A;M<w;M+=3){const b=M,C=M+1,_=M+2;r=or(this,u,e,n,c,h,p,b,C,_),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const x=Math.max(0,f.start),S=Math.min(l.count,f.start+f.count);for(let g=x,u=S;g<u;g+=3){const y=g,A=g+1,M=g+2;r=or(this,a,e,n,c,h,p,y,A,M),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}}function nd(i,e,t,n,r,s,a,o){let l;if(e.side===Ft?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===On,o),l===null)return null;ar.copy(o),ar.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ar);return c<t.near||c>t.far?null:{distance:c,point:ar.clone(),object:i}}function or(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,nr),i.getVertexPosition(l,ir),i.getVertexPosition(c,rr);const h=nd(i,e,t,n,nr,ir,rr,xo);if(h){const p=new N;Jt.getBarycoord(xo,nr,ir,rr,p),r&&(h.uv=Jt.getInterpolatedAttribute(r,o,l,c,p,new Pe)),s&&(h.uv1=Jt.getInterpolatedAttribute(s,o,l,c,p,new Pe)),a&&(h.normal=Jt.getInterpolatedAttribute(a,o,l,c,p,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new N,materialIndex:0};Jt.getNormal(nr,ir,rr,d.normal),h.face=d,h.barycoord=p}return h}class id extends It{constructor(e=null,t=1,n=1,r,s,a,o,l,c=At,h=At,p,d){super(null,a,o,l,c,h,r,s,p,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hs=new N,rd=new N,sd=new Ie;class Un{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=hs.subVectors(n,t).cross(rd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const r=e.delta(hs),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sd.getNormalMatrix(e),r=this.coplanarPoint(hs).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wn=new Ir,ad=new Pe(.5,.5),lr=new N;class Ca{constructor(e=new Un,t=new Un,n=new Un,r=new Un,s=new Un,a=new Un){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ln,n=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],p=s[5],d=s[6],f=s[7],x=s[8],S=s[9],g=s[10],u=s[11],y=s[12],A=s[13],M=s[14],w=s[15];if(r[0].setComponents(c-a,f-h,u-x,w-y).normalize(),r[1].setComponents(c+a,f+h,u+x,w+y).normalize(),r[2].setComponents(c+o,f+p,u+S,w+A).normalize(),r[3].setComponents(c-o,f-p,u-S,w-A).normalize(),n)r[4].setComponents(l,d,g,M).normalize(),r[5].setComponents(c-l,f-d,u-g,w-M).normalize();else if(r[4].setComponents(c-l,f-d,u-g,w-M).normalize(),t===ln)r[5].setComponents(c+l,f+d,u+g,w+M).normalize();else if(t===ki)r[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){Wn.center.set(0,0,0);const t=ad.distanceTo(e.center);return Wn.radius=.7071067811865476+t,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(lr.x=r.normal.x>0?e.max.x:e.min.x,lr.y=r.normal.y>0?e.max.y:e.min.y,lr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(lr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Pa extends Ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const wr=new N,Rr=new N,vo=new ot,Ii=new Ra,cr=new Ir,fs=new N,Mo=new N;class od extends _t{constructor(e=new Ut,t=new Pa){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)wr.fromBufferAttribute(t,r-1),Rr.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=wr.distanceTo(Rr);e.setAttribute("lineDistance",new ut(n,1))}else Ce("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(r),cr.radius+=s,e.ray.intersectsSphere(cr)===!1)return;vo.copy(r).invert(),Ii.copy(e.ray).applyMatrix4(vo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let S=f,g=x-1;S<g;S+=c){const u=h.getX(S),y=h.getX(S+1),A=dr(this,e,Ii,l,u,y,S);A&&t.push(A)}if(this.isLineLoop){const S=h.getX(x-1),g=h.getX(f),u=dr(this,e,Ii,l,S,g,x-1);u&&t.push(u)}}else{const f=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let S=f,g=x-1;S<g;S+=c){const u=dr(this,e,Ii,l,S,S+1,S);u&&t.push(u)}if(this.isLineLoop){const S=dr(this,e,Ii,l,x-1,f,x-1);S&&t.push(S)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function dr(i,e,t,n,r,s,a){const o=i.geometry.attributes.position;if(wr.fromBufferAttribute(o,r),Rr.fromBufferAttribute(o,s),t.distanceSqToSegment(wr,Rr,fs,Mo)>n)return;fs.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(fs);if(!(c<e.near||c>e.far))return{distance:c,point:Mo.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const So=new N,bo=new N;class Rl extends od{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)So.fromBufferAttribute(t,r),bo.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+So.distanceTo(bo);e.setAttribute("lineDistance",new ut(n,1))}else Ce("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Cl extends It{constructor(e=[],t=Zn,n,r,s,a,o,l,c,h){super(e,t,n,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Si extends It{constructor(e,t,n=un,r,s,a,o=At,l=At,c,h=En,p=1){if(h!==En&&h!==$n)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:p};super(d,r,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ta(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ld extends Si{constructor(e,t=un,n=Zn,r,s,a=At,o=At,l,c=En){const h={width:e,height:e,depth:1},p=[h,h,h,h,h,h];super(e,e,t,n,r,s,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Pl extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class gt extends Ut{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],p=[];let d=0,f=0;x("z","y","x",-1,-1,n,t,e,a,s,0),x("z","y","x",1,-1,n,t,-e,a,s,1),x("x","z","y",1,1,e,n,t,r,a,2),x("x","z","y",1,-1,e,n,-t,r,a,3),x("x","y","z",1,-1,e,t,n,r,s,4),x("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new ut(c,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(p,2));function x(S,g,u,y,A,M,w,b,C,_,E){const D=M/C,P=w/_,R=M/2,q=w/2,K=b/2,B=C+1,W=_+1;let X=0,ne=0;const re=new N;for(let le=0;le<W;le++){const pe=le*P-q;for(let Se=0;Se<B;Se++){const We=Se*D-R;re[S]=We*y,re[g]=pe*A,re[u]=K,c.push(re.x,re.y,re.z),re[S]=0,re[g]=0,re[u]=b>0?1:-1,h.push(re.x,re.y,re.z),p.push(Se/C),p.push(1-le/_),X+=1}}for(let le=0;le<_;le++)for(let pe=0;pe<C;pe++){const Se=d+pe+B*le,We=d+pe+B*(le+1),st=d+(pe+1)+B*(le+1),Le=d+(pe+1)+B*le;l.push(Se,We,Le),l.push(We,st,Le),ne+=6}o.addGroup(f,ne,E),f+=ne,d+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Vt extends Ut{constructor(e=1,t=1,n=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],p=[],d=[],f=[];let x=0;const S=[],g=n/2;let u=0;y(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new ut(p,3)),this.setAttribute("normal",new ut(d,3)),this.setAttribute("uv",new ut(f,2));function y(){const M=new N,w=new N;let b=0;const C=(t-e)/n;for(let _=0;_<=s;_++){const E=[],D=_/s,P=D*(t-e)+e;for(let R=0;R<=r;R++){const q=R/r,K=q*l+o,B=Math.sin(K),W=Math.cos(K);w.x=P*B,w.y=-D*n+g,w.z=P*W,p.push(w.x,w.y,w.z),M.set(B,C,W).normalize(),d.push(M.x,M.y,M.z),f.push(q,1-D),E.push(x++)}S.push(E)}for(let _=0;_<r;_++)for(let E=0;E<s;E++){const D=S[E][_],P=S[E+1][_],R=S[E+1][_+1],q=S[E][_+1];(e>0||E!==0)&&(h.push(D,P,q),b+=3),(t>0||E!==s-1)&&(h.push(P,R,q),b+=3)}c.addGroup(u,b,0),u+=b}function A(M){const w=x,b=new Pe,C=new N;let _=0;const E=M===!0?e:t,D=M===!0?1:-1;for(let R=1;R<=r;R++)p.push(0,g*D,0),d.push(0,D,0),f.push(.5,.5),x++;const P=x;for(let R=0;R<=r;R++){const K=R/r*l+o,B=Math.cos(K),W=Math.sin(K);C.x=E*W,C.y=g*D,C.z=E*B,p.push(C.x,C.y,C.z),d.push(0,D,0),b.x=B*.5+.5,b.y=W*.5*D+.5,f.push(b.x,b.y),x++}for(let R=0;R<r;R++){const q=w+R,K=P+R;M===!0?h.push(K,K+1,q):h.push(K+1,K,q),_+=3}c.addGroup(u,_,M===!0?1:2),u+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ai extends Vt{constructor(e=1,t=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ai(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Da extends Ut{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};const s=[],a=[];o(r),c(n),h(),this.setAttribute("position",new ut(s,3)),this.setAttribute("normal",new ut(s.slice(),3)),this.setAttribute("uv",new ut(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const A=new N,M=new N,w=new N;for(let b=0;b<t.length;b+=3)f(t[b+0],A),f(t[b+1],M),f(t[b+2],w),l(A,M,w,y)}function l(y,A,M,w){const b=w+1,C=[];for(let _=0;_<=b;_++){C[_]=[];const E=y.clone().lerp(M,_/b),D=A.clone().lerp(M,_/b),P=b-_;for(let R=0;R<=P;R++)R===0&&_===b?C[_][R]=E:C[_][R]=E.clone().lerp(D,R/P)}for(let _=0;_<b;_++)for(let E=0;E<2*(b-_)-1;E++){const D=Math.floor(E/2);E%2===0?(d(C[_][D+1]),d(C[_+1][D]),d(C[_][D])):(d(C[_][D+1]),d(C[_+1][D+1]),d(C[_+1][D]))}}function c(y){const A=new N;for(let M=0;M<s.length;M+=3)A.x=s[M+0],A.y=s[M+1],A.z=s[M+2],A.normalize().multiplyScalar(y),s[M+0]=A.x,s[M+1]=A.y,s[M+2]=A.z}function h(){const y=new N;for(let A=0;A<s.length;A+=3){y.x=s[A+0],y.y=s[A+1],y.z=s[A+2];const M=g(y)/2/Math.PI+.5,w=u(y)/Math.PI+.5;a.push(M,1-w)}x(),p()}function p(){for(let y=0;y<a.length;y+=6){const A=a[y+0],M=a[y+2],w=a[y+4],b=Math.max(A,M,w),C=Math.min(A,M,w);b>.9&&C<.1&&(A<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),w<.2&&(a[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,A){const M=y*3;A.x=e[M+0],A.y=e[M+1],A.z=e[M+2]}function x(){const y=new N,A=new N,M=new N,w=new N,b=new Pe,C=new Pe,_=new Pe;for(let E=0,D=0;E<s.length;E+=9,D+=6){y.set(s[E+0],s[E+1],s[E+2]),A.set(s[E+3],s[E+4],s[E+5]),M.set(s[E+6],s[E+7],s[E+8]),b.set(a[D+0],a[D+1]),C.set(a[D+2],a[D+3]),_.set(a[D+4],a[D+5]),w.copy(y).add(A).add(M).divideScalar(3);const P=g(w);S(b,D+0,y,P),S(C,D+2,A,P),S(_,D+4,M,P)}}function S(y,A,M,w){w<0&&y.x===1&&(a[A]=y.x-1),M.x===0&&M.z===0&&(a[A]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Da(e.vertices,e.indices,e.radius,e.detail)}}class La extends Da{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new La(e.radius,e.detail)}}class Vi extends Ut{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,p=e/o,d=t/l,f=[],x=[],S=[],g=[];for(let u=0;u<h;u++){const y=u*d-a;for(let A=0;A<c;A++){const M=A*p-s;x.push(M,-y,0),S.push(0,0,1),g.push(A/o),g.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<o;y++){const A=y+c*u,M=y+c*(u+1),w=y+1+c*(u+1),b=y+1+c*u;f.push(A,M,b),f.push(M,w,b)}this.setIndex(f),this.setAttribute("position",new ut(x,3)),this.setAttribute("normal",new ut(S,3)),this.setAttribute("uv",new ut(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ur extends Ut{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],p=new N,d=new N,f=[],x=[],S=[],g=[];for(let u=0;u<=n;u++){const y=[],A=u/n,M=a+A*o,w=e*Math.cos(M),b=Math.sqrt(e*e-w*w);let C=0;u===0&&a===0?C=.5/t:u===n&&l===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){const E=_/t,D=r+E*s;p.x=-b*Math.cos(D),p.y=w,p.z=b*Math.sin(D),x.push(p.x,p.y,p.z),d.copy(p).normalize(),S.push(d.x,d.y,d.z),g.push(E+C,1-A),y.push(c++)}h.push(y)}for(let u=0;u<n;u++)for(let y=0;y<t;y++){const A=h[u][y+1],M=h[u][y],w=h[u+1][y],b=h[u+1][y+1];(u!==0||a>0)&&f.push(A,M,b),(u!==n-1||l<Math.PI)&&f.push(M,w,b)}this.setIndex(f),this.setAttribute("position",new ut(x,3)),this.setAttribute("normal",new ut(S,3)),this.setAttribute("uv",new ut(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ur(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function bi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];if(yo(r))r.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(yo(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function Lt(i){const e={};for(let t=0;t<i.length;t++){const n=bi(i[t]);for(const r in n)e[r]=n[r]}return e}function yo(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function cd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Dl(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const dd={clone:bi,merge:Lt};var ud=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends Ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ud,this.fragmentShader=hd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bi(e.uniforms),this.uniformsGroups=cd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new Be().setHex(r.value);break;case"v2":this.uniforms[n].value=new Pe().fromArray(r.value);break;case"v3":this.uniforms[n].value=new N().fromArray(r.value);break;case"v4":this.uniforms[n].value=new ct().fromArray(r.value);break;case"m3":this.uniforms[n].value=new Ie().fromArray(r.value);break;case"m4":this.uniforms[n].value=new ot().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class fd extends hn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zn extends Ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=da,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class pd extends Ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class md extends Ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ll extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class gd extends Ll{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Be(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const ps=new ot,Eo=new N,To=new N;class _d{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.mapType=Gt,this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ca,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Eo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Eo),To.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(To),t.updateMatrixWorld(),ps.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ps,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ki||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ps)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ur=new N,hr=new yi,rn=new N;class Il extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ur,hr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,hr,rn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ur,hr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,hr,rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const In=new N,Ao=new Pe,wo=new Pe;class kt extends Il{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ua*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ua*2*Math.atan(Math.tan(Hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,Ao,wo),t.subVectors(wo,Ao)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Hr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ia extends Il{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class xd extends _d{constructor(){super(new Ia(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class vd extends Ll{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new xd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const hi=-90,fi=1;class Md extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new kt(hi,fi,e,t);r.layers=this.layers,this.add(r);const s=new kt(hi,fi,e,t);s.layers=this.layers,this.add(s);const a=new kt(hi,fi,e,t);a.layers=this.layers,this.add(a);const o=new kt(hi,fi,e,t);o.layers=this.layers,this.add(o);const l=new kt(hi,fi,e,t);l.layers=this.layers,this.add(l);const c=new kt(hi,fi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===ln)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ki)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,p=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(p,d,f),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Sd extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Ro=new ot;class Ul{constructor(e,t,n=0,r=1/0){this.ray=new Ra(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Aa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):He("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ro.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ro),this}intersectObject(e,t=!0,n=[]){return ha(e,this,n,t),n.sort(Co),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)ha(e[r],this,n,t);return n.sort(Co),n}}function Co(i,e){return i.distance-e.distance}function ha(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let a=0,o=s.length;a<o;a++)ha(s[a],e,t,!0)}}const za=class za{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}};za.prototype.isMatrix2=!0;let Po=za;class bd extends Rl{constructor(e=10,t=10,n=4473924,r=8947848){n=new Be(n),r=new Be(r);const s=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,x=-o;d<=t;d++,x+=a){l.push(-o,0,x,o,0,x),l.push(x,0,-o,x,0,o);const S=d===s?n:r;S.toArray(c,f),f+=3,S.toArray(c,f),f+=3,S.toArray(c,f),f+=3,S.toArray(c,f),f+=3}const h=new Ut;h.setAttribute("position",new ut(l,3)),h.setAttribute("color",new ut(c,3));const p=new Pa({vertexColors:!0,toneMapped:!1});super(h,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const fr=new Ei;class yd extends Rl{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=new Float32Array(8*3),s=new Ut;s.setIndex(new qt(n,1)),s.setAttribute("position",new qt(r,3)),super(s,new Pa({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&fr.setFromObject(this.object),fr.isEmpty())return;const e=fr.min,t=fr.max,n=this.geometry.attributes.position,r=n.array;r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=e.x,r[4]=t.y,r[5]=t.z,r[6]=e.x,r[7]=e.y,r[8]=t.z,r[9]=t.x,r[10]=e.y,r[11]=t.z,r[12]=t.x,r[13]=t.y,r[14]=e.z,r[15]=e.x,r[16]=t.y,r[17]=e.z,r[18]=e.x,r[19]=e.y,r[20]=e.z,r[21]=t.x,r[22]=e.y,r[23]=e.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function Do(i,e,t,n){const r=Ed(n);switch(t){case vl:return i*e;case Sl:return i*e/r.components*r.byteLength;case Ma:return i*e/r.components*r.byteLength;case Jn:return i*e*2/r.components*r.byteLength;case Sa:return i*e*2/r.components*r.byteLength;case Ml:return i*e*3/r.components*r.byteLength;case Qt:return i*e*4/r.components*r.byteLength;case ba:return i*e*4/r.components*r.byteLength;case _r:case xr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case vr:case Mr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ns:case Os:return Math.max(i,16)*Math.max(e,8)/4;case Us:case Fs:return Math.max(i,8)*Math.max(e,8)/2;case Bs:case zs:case Gs:case Vs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ks:case br:case Hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ws:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xs:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case qs:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ys:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ks:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case $s:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Zs:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Js:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Qs:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case js:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ea:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ta:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case na:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ia:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ra:case sa:case aa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case oa:case la:return Math.ceil(i/4)*Math.ceil(e/4)*8;case yr:case ca:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ed(i){switch(i){case Gt:case ml:return{byteLength:1,components:1};case Bi:case gl:case yn:return{byteLength:2,components:1};case xa:case va:return{byteLength:2,components:4};case un:case _a:case on:return{byteLength:4,components:1};case _l:case xl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ga}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ga);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Nl(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Td(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,p=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,l,c){const h=l.array,p=l.updateRanges;if(i.bindBuffer(c,o),p.length===0)i.bufferSubData(c,0,h);else{p.sort((f,x)=>f.start-x.start);let d=0;for(let f=1;f<p.length;f++){const x=p[d],S=p[f];S.start<=x.start+x.count+1?x.count=Math.max(x.count,S.start+S.count-x.start):(++d,p[d]=S)}p.length=d+1;for(let f=0,x=p.length;f<x;f++){const S=p[f];i.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var Ad=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wd=`#ifdef USE_ALPHAHASH
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
#endif`,Rd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Cd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ld=`#ifdef USE_AOMAP
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
#endif`,Id=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ud=`#ifdef USE_BATCHING
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
#endif`,Nd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Od=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,zd=`#ifdef USE_IRIDESCENCE
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
#endif`,kd=`#ifdef USE_BUMPMAP
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
#endif`,Gd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Yd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,$d=`#define PI 3.141592653589793
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
} // validated`,Zd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Jd=`vec3 transformedNormal = objectNormal;
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
#endif`,Qd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,eu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nu="gl_FragColor = linearToOutputTexel( gl_FragColor );",iu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ru=`#ifdef USE_ENVMAP
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
#endif`,su=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,au=`#ifdef USE_ENVMAP
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
#endif`,ou=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lu=`#ifdef USE_ENVMAP
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
#endif`,cu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,uu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fu=`#ifdef USE_GRADIENTMAP
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
}`,pu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_u=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,xu=`#ifdef USE_ENVMAP
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
#endif`,vu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Su=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yu=`PhysicalMaterial material;
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
#endif`,Eu=`uniform sampler2D dfgLUT;
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
}`,Tu=`
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
#endif`,Au=`#if defined( RE_IndirectDiffuse )
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
#endif`,wu=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ru=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Cu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Du=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Iu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Uu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fu=`#if defined( USE_POINTS_UV )
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
#endif`,Ou=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ku=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vu=`#ifdef USE_MORPHTARGETS
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
#endif`,Hu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Xu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,qu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ku=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$u=`#ifdef USE_NORMALMAP
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
#endif`,Zu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ju=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ju=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,th=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,nh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ih=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sh=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ah=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,oh=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lh=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ch=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dh=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,uh=`float getShadowMask() {
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
}`,hh=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fh=`#ifdef USE_SKINNING
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
#endif`,ph=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mh=`#ifdef USE_SKINNING
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
#endif`,gh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_h=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vh=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mh=`#ifdef USE_TRANSMISSION
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
#endif`,Sh=`#ifdef USE_TRANSMISSION
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
#endif`,bh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Eh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Th=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ah=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wh=`uniform sampler2D t2D;
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
}`,Rh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ch=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ph=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lh=`#include <common>
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
}`,Ih=`#if DEPTH_PACKING == 3200
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
}`,Uh=`#define DISTANCE
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
}`,Nh=`#define DISTANCE
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
}`,Fh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Oh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bh=`uniform float scale;
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
}`,zh=`uniform vec3 diffuse;
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
}`,kh=`#include <common>
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
}`,Gh=`uniform vec3 diffuse;
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
}`,Vh=`#define LAMBERT
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
}`,Hh=`#define LAMBERT
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
}`,Wh=`#define MATCAP
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
}`,Xh=`#define MATCAP
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
}`,qh=`#define NORMAL
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
}`,Yh=`#define NORMAL
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
}`,Kh=`#define PHONG
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
}`,$h=`#define PHONG
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
}`,Zh=`#define STANDARD
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
}`,Jh=`#define STANDARD
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
}`,Qh=`#define TOON
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
}`,jh=`#define TOON
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
}`,ef=`uniform float size;
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
}`,tf=`uniform vec3 diffuse;
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
}`,nf=`#include <common>
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
}`,rf=`uniform vec3 color;
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
}`,sf=`uniform float rotation;
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
}`,af=`uniform vec3 diffuse;
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
}`,Ne={alphahash_fragment:Ad,alphahash_pars_fragment:wd,alphamap_fragment:Rd,alphamap_pars_fragment:Cd,alphatest_fragment:Pd,alphatest_pars_fragment:Dd,aomap_fragment:Ld,aomap_pars_fragment:Id,batching_pars_vertex:Ud,batching_vertex:Nd,begin_vertex:Fd,beginnormal_vertex:Od,bsdfs:Bd,iridescence_fragment:zd,bumpmap_pars_fragment:kd,clipping_planes_fragment:Gd,clipping_planes_pars_fragment:Vd,clipping_planes_pars_vertex:Hd,clipping_planes_vertex:Wd,color_fragment:Xd,color_pars_fragment:qd,color_pars_vertex:Yd,color_vertex:Kd,common:$d,cube_uv_reflection_fragment:Zd,defaultnormal_vertex:Jd,displacementmap_pars_vertex:Qd,displacementmap_vertex:jd,emissivemap_fragment:eu,emissivemap_pars_fragment:tu,colorspace_fragment:nu,colorspace_pars_fragment:iu,envmap_fragment:ru,envmap_common_pars_fragment:su,envmap_pars_fragment:au,envmap_pars_vertex:ou,envmap_physical_pars_fragment:xu,envmap_vertex:lu,fog_vertex:cu,fog_pars_vertex:du,fog_fragment:uu,fog_pars_fragment:hu,gradientmap_pars_fragment:fu,lightmap_pars_fragment:pu,lights_lambert_fragment:mu,lights_lambert_pars_fragment:gu,lights_pars_begin:_u,lights_toon_fragment:vu,lights_toon_pars_fragment:Mu,lights_phong_fragment:Su,lights_phong_pars_fragment:bu,lights_physical_fragment:yu,lights_physical_pars_fragment:Eu,lights_fragment_begin:Tu,lights_fragment_maps:Au,lights_fragment_end:wu,lightprobes_pars_fragment:Ru,logdepthbuf_fragment:Cu,logdepthbuf_pars_fragment:Pu,logdepthbuf_pars_vertex:Du,logdepthbuf_vertex:Lu,map_fragment:Iu,map_pars_fragment:Uu,map_particle_fragment:Nu,map_particle_pars_fragment:Fu,metalnessmap_fragment:Ou,metalnessmap_pars_fragment:Bu,morphinstance_vertex:zu,morphcolor_vertex:ku,morphnormal_vertex:Gu,morphtarget_pars_vertex:Vu,morphtarget_vertex:Hu,normal_fragment_begin:Wu,normal_fragment_maps:Xu,normal_pars_fragment:qu,normal_pars_vertex:Yu,normal_vertex:Ku,normalmap_pars_fragment:$u,clearcoat_normal_fragment_begin:Zu,clearcoat_normal_fragment_maps:Ju,clearcoat_pars_fragment:Qu,iridescence_pars_fragment:ju,opaque_fragment:eh,packing:th,premultiplied_alpha_fragment:nh,project_vertex:ih,dithering_fragment:rh,dithering_pars_fragment:sh,roughnessmap_fragment:ah,roughnessmap_pars_fragment:oh,shadowmap_pars_fragment:lh,shadowmap_pars_vertex:ch,shadowmap_vertex:dh,shadowmask_pars_fragment:uh,skinbase_vertex:hh,skinning_pars_vertex:fh,skinning_vertex:ph,skinnormal_vertex:mh,specularmap_fragment:gh,specularmap_pars_fragment:_h,tonemapping_fragment:xh,tonemapping_pars_fragment:vh,transmission_fragment:Mh,transmission_pars_fragment:Sh,uv_pars_fragment:bh,uv_pars_vertex:yh,uv_vertex:Eh,worldpos_vertex:Th,background_vert:Ah,background_frag:wh,backgroundCube_vert:Rh,backgroundCube_frag:Ch,cube_vert:Ph,cube_frag:Dh,depth_vert:Lh,depth_frag:Ih,distance_vert:Uh,distance_frag:Nh,equirect_vert:Fh,equirect_frag:Oh,linedashed_vert:Bh,linedashed_frag:zh,meshbasic_vert:kh,meshbasic_frag:Gh,meshlambert_vert:Vh,meshlambert_frag:Hh,meshmatcap_vert:Wh,meshmatcap_frag:Xh,meshnormal_vert:qh,meshnormal_frag:Yh,meshphong_vert:Kh,meshphong_frag:$h,meshphysical_vert:Zh,meshphysical_frag:Jh,meshtoon_vert:Qh,meshtoon_frag:jh,points_vert:ef,points_frag:tf,shadow_vert:nf,shadow_frag:rf,sprite_vert:sf,sprite_frag:af},me={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new N},probesMax:{value:new N},probesResolution:{value:new N}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},an={basic:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Be(0)},envMapIntensity:{value:1}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Lt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Lt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Be(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Lt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Lt([me.points,me.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Lt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Lt([me.common,me.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Lt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Lt([me.sprite,me.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distance:{uniforms:Lt([me.common,me.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distance_vert,fragmentShader:Ne.distance_frag},shadow:{uniforms:Lt([me.lights,me.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};an.physical={uniforms:Lt([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const pr={r:0,b:0,g:0},of=new ot,Fl=new Ie;Fl.set(-1,0,0,0,1,0,0,0,1);function lf(i,e,t,n,r,s){const a=new Be(0);let o=r===!0?0:1,l,c,h=null,p=0,d=null;function f(y){let A=y.isScene===!0?y.background:null;if(A&&A.isTexture){const M=y.backgroundBlurriness>0;A=e.get(A,M)}return A}function x(y){let A=!1;const M=f(y);M===null?g(a,o):M&&M.isColor&&(g(M,1),A=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(y,A){const M=f(A);M&&(M.isCubeTexture||M.mapping===Lr)?(c===void 0&&(c=new jt(new gt(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:bi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(of.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Fl),c.material.toneMapped=Ge.getTransfer(M.colorSpace)!==Je,(h!==M||p!==M.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,p=M.version,d=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new jt(new Vi(2,2),new hn({name:"BackgroundMaterial",uniforms:bi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=Ge.getTransfer(M.colorSpace)!==Je,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||p!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,p=M.version,d=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,A){y.getRGB(pr,Dl(i)),t.buffers.color.setClear(pr.r,pr.g,pr.b,A,s)}function u(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,A=1){a.set(y),o=A,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(a,o)},render:x,addToRenderList:S,dispose:u}}function cf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(P,R,q,K,B){let W=!1;const X=p(P,K,q,R);s!==X&&(s=X,c(s.object)),W=f(P,K,q,B),W&&x(P,K,q,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,M(P,R,q,K),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function p(P,R,q,K){const B=K.wireframe===!0;let W=n[R.id];W===void 0&&(W={},n[R.id]=W);const X=P.isInstancedMesh===!0?P.id:0;let ne=W[X];ne===void 0&&(ne={},W[X]=ne);let re=ne[q.id];re===void 0&&(re={},ne[q.id]=re);let le=re[B];return le===void 0&&(le=d(l()),re[B]=le),le}function d(P){const R=[],q=[],K=[];for(let B=0;B<t;B++)R[B]=0,q[B]=0,K[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:q,attributeDivisors:K,object:P,attributes:{},index:null}}function f(P,R,q,K){const B=s.attributes,W=R.attributes;let X=0;const ne=q.getAttributes();for(const re in ne)if(ne[re].location>=0){const pe=B[re];let Se=W[re];if(Se===void 0&&(re==="instanceMatrix"&&P.instanceMatrix&&(Se=P.instanceMatrix),re==="instanceColor"&&P.instanceColor&&(Se=P.instanceColor)),pe===void 0||pe.attribute!==Se||Se&&pe.data!==Se.data)return!0;X++}return s.attributesNum!==X||s.index!==K}function x(P,R,q,K){const B={},W=R.attributes;let X=0;const ne=q.getAttributes();for(const re in ne)if(ne[re].location>=0){let pe=W[re];pe===void 0&&(re==="instanceMatrix"&&P.instanceMatrix&&(pe=P.instanceMatrix),re==="instanceColor"&&P.instanceColor&&(pe=P.instanceColor));const Se={};Se.attribute=pe,pe&&pe.data&&(Se.data=pe.data),B[re]=Se,X++}s.attributes=B,s.attributesNum=X,s.index=K}function S(){const P=s.newAttributes;for(let R=0,q=P.length;R<q;R++)P[R]=0}function g(P){u(P,0)}function u(P,R){const q=s.newAttributes,K=s.enabledAttributes,B=s.attributeDivisors;q[P]=1,K[P]===0&&(i.enableVertexAttribArray(P),K[P]=1),B[P]!==R&&(i.vertexAttribDivisor(P,R),B[P]=R)}function y(){const P=s.newAttributes,R=s.enabledAttributes;for(let q=0,K=R.length;q<K;q++)R[q]!==P[q]&&(i.disableVertexAttribArray(q),R[q]=0)}function A(P,R,q,K,B,W,X){X===!0?i.vertexAttribIPointer(P,R,q,B,W):i.vertexAttribPointer(P,R,q,K,B,W)}function M(P,R,q,K){S();const B=K.attributes,W=q.getAttributes(),X=R.defaultAttributeValues;for(const ne in W){const re=W[ne];if(re.location>=0){let le=B[ne];if(le===void 0&&(ne==="instanceMatrix"&&P.instanceMatrix&&(le=P.instanceMatrix),ne==="instanceColor"&&P.instanceColor&&(le=P.instanceColor)),le!==void 0){const pe=le.normalized,Se=le.itemSize,We=e.get(le);if(We===void 0)continue;const st=We.buffer,Le=We.type,J=We.bytesPerElement,ce=Le===i.INT||Le===i.UNSIGNED_INT||le.gpuType===_a;if(le.isInterleavedBufferAttribute){const se=le.data,we=se.stride,De=le.offset;if(se.isInstancedInterleavedBuffer){for(let Ae=0;Ae<re.locationSize;Ae++)u(re.location+Ae,se.meshPerAttribute);P.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Ae=0;Ae<re.locationSize;Ae++)g(re.location+Ae);i.bindBuffer(i.ARRAY_BUFFER,st);for(let Ae=0;Ae<re.locationSize;Ae++)A(re.location+Ae,Se/re.locationSize,Le,pe,we*J,(De+Se/re.locationSize*Ae)*J,ce)}else{if(le.isInstancedBufferAttribute){for(let se=0;se<re.locationSize;se++)u(re.location+se,le.meshPerAttribute);P.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let se=0;se<re.locationSize;se++)g(re.location+se);i.bindBuffer(i.ARRAY_BUFFER,st);for(let se=0;se<re.locationSize;se++)A(re.location+se,Se/re.locationSize,Le,pe,Se*J,Se/re.locationSize*se*J,ce)}}else if(X!==void 0){const pe=X[ne];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(re.location,pe);break;case 3:i.vertexAttrib3fv(re.location,pe);break;case 4:i.vertexAttrib4fv(re.location,pe);break;default:i.vertexAttrib1fv(re.location,pe)}}}}y()}function w(){E();for(const P in n){const R=n[P];for(const q in R){const K=R[q];for(const B in K){const W=K[B];for(const X in W)h(W[X].object),delete W[X];delete K[B]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const R=n[P.id];for(const q in R){const K=R[q];for(const B in K){const W=K[B];for(const X in W)h(W[X].object),delete W[X];delete K[B]}}delete n[P.id]}function C(P){for(const R in n){const q=n[R];for(const K in q){const B=q[K];if(B[P.id]===void 0)continue;const W=B[P.id];for(const X in W)h(W[X].object),delete W[X];delete B[P.id]}}}function _(P){for(const R in n){const q=n[R],K=P.isInstancedMesh===!0?P.id:0,B=q[K];if(B!==void 0){for(const W in B){const X=B[W];for(const ne in X)h(X[ne].object),delete X[ne];delete B[W]}delete q[K],Object.keys(q).length===0&&delete n[R]}}}function E(){D(),a=!0,s!==r&&(s=r,c(s.object))}function D(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:E,resetDefaultState:D,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:g,disableUnusedAttributes:y}}function df(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function uf(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Qt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const _=C===yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Gt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==on&&!_)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const p=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:x,maxTextureSize:S,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:M,maxSamples:w,samples:b}}function hf(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new Un,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,d){const f=p.length!==0||d||n!==0||r;return r=d,n=p.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,d){t=h(p,d,0)},this.setState=function(p,d,f){const x=p.clippingPlanes,S=p.clipIntersection,g=p.clipShadows,u=i.get(p);if(!r||x===null||x.length===0||s&&!g)s?h(null):c();else{const y=s?0:n,A=y*4;let M=u.clippingState||null;l.value=M,M=h(x,d,A,f);for(let w=0;w!==A;++w)M[w]=t[w];u.clippingState=M,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(p,d,f,x){const S=p!==null?p.length:0;let g=null;if(S!==0){if(g=l.value,x!==!0||g===null){const u=f+S*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<u)&&(g=new Float32Array(u));for(let A=0,M=f;A!==S;++A,M+=4)a.copy(p[A]).applyMatrix4(y,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,g}}const Fn=4,Lo=[.125,.215,.35,.446,.526,.582],Yn=20,ff=256,Ui=new Ia,Io=new Be;let ms=null,gs=0,_s=0,xs=!1;const pf=new N;class Uo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=pf}=s;ms=this._renderer.getRenderTarget(),gs=this._renderer.getActiveCubeFace(),_s=this._renderer.getActiveMipmapLevel(),xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ms,gs,_s),this._renderer.xr.enabled=xs,e.scissorTest=!1,pi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Zn||e.mapping===Mi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ms=this._renderer.getRenderTarget(),gs=this._renderer.getActiveCubeFace(),_s=this._renderer.getActiveMipmapLevel(),xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:yn,format:Qt,colorSpace:Er,depthBuffer:!1},r=No(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=No(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=mf(s)),this._blurMaterial=_f(s,e,t),this._ggxMaterial=gf(s,e,t)}return r}_compileMaterial(e){const t=new jt(new Ut,e);this._renderer.compile(t,Ui)}_sceneToCubeUV(e,t,n,r,s){const l=new kt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],p=this._renderer,d=p.autoClear,f=p.toneMapping;p.getClearColor(Io),p.toneMapping=cn,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(r),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new jt(new gt,new wl({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,g=S.material;let u=!1;const y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,u=!0):(g.color.copy(Io),u=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(l.up.set(0,c[A],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[A],s.y,s.z)):M===1?(l.up.set(0,0,c[A]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[A],s.z)):(l.up.set(0,c[A],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[A]));const w=this._cubeSize;pi(r,M*w,A>2?w:0,w,w),p.setRenderTarget(r),u&&p.render(S,l),p.render(e,l)}p.toneMapping=f,p.autoClear=d,e.background=y}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===Zn||e.mapping===Mi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fo());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;pi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ui)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),p=Math.sqrt(c*c-h*h),d=0+c*1.25,f=p*d,{_lodMax:x}=this,S=this._sizeLods[n],g=3*S*(n>x-Fn?n-x+Fn:0),u=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=x-t,pi(s,g,u,3*S,2*S),r.setRenderTarget(s),r.render(o,Ui),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=x-n,pi(e,g,u,3*S,2*S),r.setRenderTarget(e),r.render(o,Ui)}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&He("blur direction must be either latitudinal or longitudinal!");const h=3,p=this._lodMeshes[r];p.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,x=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Yn-1),S=s/x,g=isFinite(s)?1+Math.floor(h*S):Yn;g>Yn&&Ce(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Yn}`);const u=[];let y=0;for(let C=0;C<Yn;++C){const _=C/S,E=Math.exp(-_*_/2);u.push(E),C===0?y+=E:C<g&&(y+=2*E)}for(let C=0;C<u.length;C++)u[C]=u[C]/y;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=u,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:A}=this;d.dTheta.value=x,d.mipInt.value=A-n;const M=this._sizeLods[r],w=3*M*(r>A-Fn?r-A+Fn:0),b=4*(this._cubeSize-M);pi(t,w,b,3*M,2*M),l.setRenderTarget(t),l.render(p,Ui)}}function mf(i){const e=[],t=[],n=[];let r=i;const s=i-Fn+1+Lo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>i-Fn?l=Lo[a-i+Fn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,p=1+c,d=[h,h,p,h,p,p,h,h,p,p,h,p],f=6,x=6,S=3,g=2,u=1,y=new Float32Array(S*x*f),A=new Float32Array(g*x*f),M=new Float32Array(u*x*f);for(let b=0;b<f;b++){const C=b%3*2/3-1,_=b>2?0:-1,E=[C,_,0,C+2/3,_,0,C+2/3,_+1,0,C,_,0,C+2/3,_+1,0,C,_+1,0];y.set(E,S*x*b),A.set(d,g*x*b);const D=[b,b,b,b,b,b];M.set(D,u*x*b)}const w=new Ut;w.setAttribute("position",new qt(y,S)),w.setAttribute("uv",new qt(A,g)),w.setAttribute("faceIndex",new qt(M,u)),n.push(new jt(w,null)),r>Fn&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function No(i,e,t){const n=new dn(i,e,t);return n.texture.mapping=Lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pi(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function gf(i,e,t){return new hn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ff,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Nr(),fragmentShader:`

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
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function _f(i,e,t){const n=new Float32Array(Yn),r=new N(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:Yn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Nr(),fragmentShader:`

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
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Fo(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nr(),fragmentShader:`

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
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Oo(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Nr(){return`

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
	`}class Ol extends dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Cl(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new gt(5,5,5),s=new hn({name:"CubemapFromEquirect",uniforms:bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:Sn});s.uniforms.tEquirect.value=t;const a=new jt(r,s),o=t.minFilter;return t.minFilter===Kn&&(t.minFilter=Dt),new Md(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}function xf(i){let e=new WeakMap,t=new WeakMap,n=null;function r(d,f=!1){return d==null?null:f?a(d):s(d)}function s(d){if(d&&d.isTexture){const f=d.mapping;if(f===kr||f===Gr)if(e.has(d)){const x=e.get(d).texture;return o(x,d.mapping)}else{const x=d.image;if(x&&x.height>0){const S=new Ol(x.height);return S.fromEquirectangularTexture(i,d),e.set(d,S),d.addEventListener("dispose",c),o(S.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,x=f===kr||f===Gr,S=f===Zn||f===Mi;if(x||S){let g=t.get(d);const u=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==u)return n===null&&(n=new Uo(i)),g=x?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const y=d.image;return x&&y&&y.height>0||S&&y&&l(y)?(n===null&&(n=new Uo(i)),g=x?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===kr?d.mapping=Zn:f===Gr&&(d.mapping=Mi),d}function l(d){let f=0;const x=6;for(let S=0;S<x;S++)d[S]!==void 0&&f++;return f===x}function c(d){const f=d.target;f.removeEventListener("dispose",c);const x=e.get(f);x!==void 0&&(e.delete(f),x.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const x=t.get(f);x!==void 0&&(t.delete(f),x.dispose())}function p(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:p}}function vf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&_i("WebGLRenderer: "+n+" extension not supported."),r}}}function Mf(i,e,t,n){const r={},s=new WeakMap;function a(p){const d=p.target;d.index!==null&&e.remove(d.index);for(const x in d.attributes)e.remove(d.attributes[x]);d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(p,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(p){const d=p.attributes;for(const f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(p){const d=[],f=p.index,x=p.attributes.position;let S=0;if(x===void 0)return;if(f!==null){const y=f.array;S=f.version;for(let A=0,M=y.length;A<M;A+=3){const w=y[A+0],b=y[A+1],C=y[A+2];d.push(w,b,b,C,C,w)}}else{const y=x.array;S=x.version;for(let A=0,M=y.length/3-1;A<M;A+=3){const w=A+0,b=A+1,C=A+2;d.push(w,b,b,C,C,w)}}const g=new(x.count>=65535?Al:Tl)(d,1);g.version=S;const u=s.get(p);u&&e.remove(u),s.set(p,g)}function h(p){const d=s.get(p);if(d){const f=p.index;f!==null&&d.version<f.version&&c(p)}else c(p);return s.get(p)}return{get:o,update:l,getWireframeAttribute:h}}function Sf(i,e,t){let n;function r(p){n=p}let s,a;function o(p){s=p.type,a=p.bytesPerElement}function l(p,d){i.drawElements(n,d,s,p*a),t.update(d,n,1)}function c(p,d,f){f!==0&&(i.drawElementsInstanced(n,d,s,p*a,f),t.update(d,n,f))}function h(p,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,p,0,f);let S=0;for(let g=0;g<f;g++)S+=d[g];t.update(S,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function bf(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:He("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function yf(i,e,t){const n=new WeakMap,r=new ct;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==p){let E=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let A=0;f===!0&&(A=1),x===!0&&(A=2),S===!0&&(A=3);let M=o.attributes.position.count*A,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const b=new Float32Array(M*w*4*p),C=new yl(b,M,w,p);C.type=on,C.needsUpdate=!0;const _=A*4;for(let D=0;D<p;D++){const P=g[D],R=u[D],q=y[D],K=M*w*4*D;for(let B=0;B<P.count;B++){const W=B*_;f===!0&&(r.fromBufferAttribute(P,B),b[K+W+0]=r.x,b[K+W+1]=r.y,b[K+W+2]=r.z,b[K+W+3]=0),x===!0&&(r.fromBufferAttribute(R,B),b[K+W+4]=r.x,b[K+W+5]=r.y,b[K+W+6]=r.z,b[K+W+7]=0),S===!0&&(r.fromBufferAttribute(q,B),b[K+W+8]=r.x,b[K+W+9]=r.y,b[K+W+10]=r.z,b[K+W+11]=q.itemSize===4?r.w:1)}}d={count:p,texture:C,size:new Pe(M,w)},n.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let S=0;S<c.length;S++)f+=c[S];const x=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Ef(i,e,t,n,r){let s=new WeakMap;function a(c){const h=r.render.frame,p=c.geometry,d=e.get(c,p);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Tf={[ol]:"LINEAR_TONE_MAPPING",[ll]:"REINHARD_TONE_MAPPING",[cl]:"CINEON_TONE_MAPPING",[dl]:"ACES_FILMIC_TONE_MAPPING",[hl]:"AGX_TONE_MAPPING",[fl]:"NEUTRAL_TONE_MAPPING",[ul]:"CUSTOM_TONE_MAPPING"};function Af(i,e,t,n,r,s){const a=new dn(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,depthTexture:r?new Si(e,t):void 0}),o=new dn(e,t,{type:yn,depthBuffer:!1,stencilBuffer:!1}),l=new Ut;l.setAttribute("position",new ut([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ut([0,2,0,0,2,0],2));const c=new fd({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new jt(l,c),p=new Ia(-1,1,1,-1,0,1);let d=null,f=null,x=!1,S,g=null,u=[],y=!1;this.setSize=function(A,M){a.setSize(A,M),o.setSize(A,M);for(let w=0;w<u.length;w++){const b=u[w];b.setSize&&b.setSize(A,M)}},this.setEffects=function(A){u=A,y=u.length>0&&u[0].isRenderPass===!0;const M=a.width,w=a.height;for(let b=0;b<u.length;b++){const C=u[b];C.setSize&&C.setSize(M,w)}},this.begin=function(A,M){if(x||A.toneMapping===cn&&u.length===0)return!1;if(g=M,M!==null){const w=M.width,b=M.height;(a.width!==w||a.height!==b)&&this.setSize(w,b)}return y===!1&&A.setRenderTarget(a),S=A.toneMapping,A.toneMapping=cn,!0},this.hasRenderPass=function(){return y},this.end=function(A,M){A.toneMapping=S,x=!0;let w=a,b=o;for(let C=0;C<u.length;C++){const _=u[C];if(_.enabled!==!1&&(_.render(A,b,w,M),_.needsSwap!==!1)){const E=w;w=b,b=E}}if(d!==A.outputColorSpace||f!==A.toneMapping){d=A.outputColorSpace,f=A.toneMapping,c.defines={},Ge.getTransfer(d)===Je&&(c.defines.SRGB_TRANSFER="");const C=Tf[f];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,A.setRenderTarget(g),A.render(h,p),g=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Bl=new It,fa=new Si(1,1),zl=new yl,kl=new Hc,Gl=new Cl,Bo=[],zo=[],ko=new Float32Array(16),Go=new Float32Array(9),Vo=new Float32Array(4);function wi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Bo[r];if(s===void 0&&(s=new Float32Array(r),Bo[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function bt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Fr(i,e){let t=zo[e];t===void 0&&(t=new Int32Array(e),zo[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function wf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Rf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function Cf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function Pf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function Df(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(bt(t,n))return;Vo.set(n),i.uniformMatrix2fv(this.addr,!1,Vo),yt(t,n)}}function Lf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(bt(t,n))return;Go.set(n),i.uniformMatrix3fv(this.addr,!1,Go),yt(t,n)}}function If(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(bt(t,n))return;ko.set(n),i.uniformMatrix4fv(this.addr,!1,ko),yt(t,n)}}function Uf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Nf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function Ff(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function Of(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Bf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function Vf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(fa.compareFunction=t.isReversedDepthBuffer()?Ea:ya,s=fa):s=Bl,t.setTexture2D(e||s,r)}function Hf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||kl,r)}function Wf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Gl,r)}function Xf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||zl,r)}function qf(i){switch(i){case 5126:return wf;case 35664:return Rf;case 35665:return Cf;case 35666:return Pf;case 35674:return Df;case 35675:return Lf;case 35676:return If;case 5124:case 35670:return Uf;case 35667:case 35671:return Nf;case 35668:case 35672:return Ff;case 35669:case 35673:return Of;case 5125:return Bf;case 36294:return zf;case 36295:return kf;case 36296:return Gf;case 35678:case 36198:case 36298:case 36306:case 35682:return Vf;case 35679:case 36299:case 36307:return Hf;case 35680:case 36300:case 36308:case 36293:return Wf;case 36289:case 36303:case 36311:case 36292:return Xf}}function Yf(i,e){i.uniform1fv(this.addr,e)}function Kf(i,e){const t=wi(e,this.size,2);i.uniform2fv(this.addr,t)}function $f(i,e){const t=wi(e,this.size,3);i.uniform3fv(this.addr,t)}function Zf(i,e){const t=wi(e,this.size,4);i.uniform4fv(this.addr,t)}function Jf(i,e){const t=wi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Qf(i,e){const t=wi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function jf(i,e){const t=wi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ep(i,e){i.uniform1iv(this.addr,e)}function tp(i,e){i.uniform2iv(this.addr,e)}function np(i,e){i.uniform3iv(this.addr,e)}function ip(i,e){i.uniform4iv(this.addr,e)}function rp(i,e){i.uniform1uiv(this.addr,e)}function sp(i,e){i.uniform2uiv(this.addr,e)}function ap(i,e){i.uniform3uiv(this.addr,e)}function op(i,e){i.uniform4uiv(this.addr,e)}function lp(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=fa:a=Bl;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function cp(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||kl,s[a])}function dp(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Gl,s[a])}function up(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||zl,s[a])}function hp(i){switch(i){case 5126:return Yf;case 35664:return Kf;case 35665:return $f;case 35666:return Zf;case 35674:return Jf;case 35675:return Qf;case 35676:return jf;case 5124:case 35670:return ep;case 35667:case 35671:return tp;case 35668:case 35672:return np;case 35669:case 35673:return ip;case 5125:return rp;case 36294:return sp;case 36295:return ap;case 36296:return op;case 35678:case 36198:case 36298:case 36306:case 35682:return lp;case 35679:case 36299:case 36307:return cp;case 35680:case 36300:case 36308:case 36293:return dp;case 36289:case 36303:case 36311:case 36292:return up}}class fp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qf(t.type)}}class pp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=hp(t.type)}}class mp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const vs=/(\w+)(\])?(\[|\.)?/g;function Ho(i,e){i.seq.push(e),i.map[e.id]=e}function gp(i,e,t){const n=i.name,r=n.length;for(vs.lastIndex=0;;){const s=vs.exec(n),a=vs.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Ho(t,c===void 0?new fp(o,i,e):new pp(o,i,e));break}else{let p=t.map[o];p===void 0&&(p=new mp(o),Ho(t,p)),t=p}}}class Sr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);gp(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function Wo(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const _p=37297;let xp=0;function vp(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Xo=new Ie;function Mp(i){Ge._getMatrix(Xo,Ge.workingColorSpace,i);const e=`mat3( ${Xo.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(i)){case Tr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function qo(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+vp(i.getShaderSource(e),o)}else return s}function Sp(i,e){const t=Mp(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const bp={[ol]:"Linear",[ll]:"Reinhard",[cl]:"Cineon",[dl]:"ACESFilmic",[hl]:"AgX",[fl]:"Neutral",[ul]:"Custom"};function yp(i,e){const t=bp[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const mr=new N;function Ep(){Ge.getLuminanceCoefficients(mr);const i=mr.x.toFixed(4),e=mr.y.toFixed(4),t=mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Oi).join(`
`)}function Ap(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function wp(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Oi(i){return i!==""}function Yo(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ko(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rp=/^[ \t]*#include +<([\w\d./]+)>/gm;function pa(i){return i.replace(Rp,Pp)}const Cp=new Map;function Pp(i,e){let t=Ne[e];if(t===void 0){const n=Cp.get(e);if(n!==void 0)t=Ne[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return pa(t)}const Dp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $o(i){return i.replace(Dp,Lp)}function Lp(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Zo(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ip={[gr]:"SHADOWMAP_TYPE_PCF",[Fi]:"SHADOWMAP_TYPE_VSM"};function Up(i){return Ip[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Np={[Zn]:"ENVMAP_TYPE_CUBE",[Mi]:"ENVMAP_TYPE_CUBE",[Lr]:"ENVMAP_TYPE_CUBE_UV"};function Fp(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Np[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Op={[Mi]:"ENVMAP_MODE_REFRACTION"};function Bp(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Op[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const zp={[al]:"ENVMAP_BLENDING_MULTIPLY",[bc]:"ENVMAP_BLENDING_MIX",[yc]:"ENVMAP_BLENDING_ADD"};function kp(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":zp[i.combine]||"ENVMAP_BLENDING_NONE"}function Gp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Vp(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Up(t),c=Fp(t),h=Bp(t),p=kp(t),d=Gp(t),f=Tp(t),x=Ap(s),S=r.createProgram();let g,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Oi).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Oi).join(`
`),u.length>0&&(u+=`
`)):(g=[Zo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Oi).join(`
`),u=[Zo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+p:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==cn?"#define TONE_MAPPING":"",t.toneMapping!==cn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==cn?yp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,Sp("linearToOutputTexel",t.outputColorSpace),Ep(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Oi).join(`
`)),a=pa(a),a=Yo(a,t),a=Ko(a,t),o=pa(o),o=Yo(o,t),o=Ko(o,t),a=$o(a),o=$o(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",t.glslVersion===to?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===to?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const A=y+g+a,M=y+u+o,w=Wo(r,r.VERTEX_SHADER,A),b=Wo(r,r.FRAGMENT_SHADER,M);r.attachShader(S,w),r.attachShader(S,b),t.index0AttributeName!==void 0?r.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function C(P){if(i.debug.checkShaderErrors){const R=r.getProgramInfoLog(S)||"",q=r.getShaderInfoLog(w)||"",K=r.getShaderInfoLog(b)||"",B=R.trim(),W=q.trim(),X=K.trim();let ne=!0,re=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,S,w,b);else{const le=qo(r,w,"vertex"),pe=qo(r,b,"fragment");He("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+le+`
`+pe)}else B!==""?Ce("WebGLProgram: Program Info Log:",B):(W===""||X==="")&&(re=!1);re&&(P.diagnostics={runnable:ne,programLog:B,vertexShader:{log:W,prefix:g},fragmentShader:{log:X,prefix:u}})}r.deleteShader(w),r.deleteShader(b),_=new Sr(r,S),E=wp(r,S)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=r.getProgramParameter(S,_p)),D},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=xp++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=w,this.fragmentShader=b,this}let Hp=0;class Wp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Xp(e),t.set(e,n)),n}}class Xp{constructor(e){this.id=Hp++,this.code=e,this.usedTimes=0}}function qp(i){return i===Jn||i===br||i===yr}function Yp(i,e,t,n,r,s){const a=new Aa,o=new Wp,l=new Set,c=[],h=new Map,p=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return l.add(_),_===0?"uv":`uv${_}`}function S(_,E,D,P,R,q){const K=P.fog,B=R.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ne=e.get(_.envMap||W,X),re=ne&&ne.mapping===Lr?ne.image.height:null,le=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Ce("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const pe=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Se=pe!==void 0?pe.length:0;let We=0;B.morphAttributes.position!==void 0&&(We=1),B.morphAttributes.normal!==void 0&&(We=2),B.morphAttributes.color!==void 0&&(We=3);let st,Le,J,ce;if(le){const ae=an[le];st=ae.vertexShader,Le=ae.fragmentShader}else{st=_.vertexShader,Le=_.fragmentShader;const ae=o.getVertexShaderStage(_),et=o.getFragmentShaderStage(_);o.update(_,ae,et),J=ae.id,ce=et.id}const se=i.getRenderTarget(),we=i.state.buffers.depth.getReversed(),De=R.isInstancedMesh===!0,Ae=R.isBatchedMesh===!0,at=!!_.map,Fe=!!_.matcap,Ye=!!ne,ze=!!_.aoMap,ke=!!_.lightMap,Qe=!!_.bumpMap&&_.wireframe===!1,$e=!!_.normalMap,ht=!!_.displacementMap,ft=!!_.emissiveMap,rt=!!_.metalnessMap,lt=!!_.roughnessMap,U=_.anisotropy>0,wt=_.clearcoat>0,Ke=_.dispersion>0,T=_.iridescence>0,m=_.sheen>0,O=_.transmission>0,G=U&&!!_.anisotropyMap,Y=wt&&!!_.clearcoatMap,oe=wt&&!!_.clearcoatNormalMap,he=wt&&!!_.clearcoatRoughnessMap,$=T&&!!_.iridescenceMap,j=T&&!!_.iridescenceThicknessMap,L=m&&!!_.sheenColorMap,z=m&&!!_.sheenRoughnessMap,Z=!!_.specularMap,te=!!_.specularColorMap,de=!!_.specularIntensityMap,be=O&&!!_.transmissionMap,Re=O&&!!_.thicknessMap,I=!!_.gradientMap,ue=!!_.alphaMap,Q=_.alphaTest>0,fe=!!_.alphaHash,ie=!!_.extensions;let ee=cn;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(ee=i.toneMapping);const _e={shaderID:le,shaderType:_.type,shaderName:_.name,vertexShader:st,fragmentShader:Le,defines:_.defines,customVertexShaderID:J,customFragmentShaderID:ce,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Ae,batchingColor:Ae&&R._colorsTexture!==null,instancing:De,instancingColor:De&&R.instanceColor!==null,instancingMorph:De&&R.morphTexture!==null,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Ge.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:at,matcap:Fe,envMap:Ye,envMapMode:Ye&&ne.mapping,envMapCubeUVHeight:re,aoMap:ze,lightMap:ke,bumpMap:Qe,normalMap:$e,displacementMap:ht,emissiveMap:ft,normalMapObjectSpace:$e&&_.normalMapType===Ac,normalMapTangentSpace:$e&&_.normalMapType===da,packedNormalMap:$e&&_.normalMapType===da&&qp(_.normalMap.format),metalnessMap:rt,roughnessMap:lt,anisotropy:U,anisotropyMap:G,clearcoat:wt,clearcoatMap:Y,clearcoatNormalMap:oe,clearcoatRoughnessMap:he,dispersion:Ke,iridescence:T,iridescenceMap:$,iridescenceThicknessMap:j,sheen:m,sheenColorMap:L,sheenRoughnessMap:z,specularMap:Z,specularColorMap:te,specularIntensityMap:de,transmission:O,transmissionMap:be,thicknessMap:Re,gradientMap:I,opaque:_.transparent===!1&&_.blending===gi&&_.alphaToCoverage===!1,alphaMap:ue,alphaTest:Q,alphaHash:fe,combine:_.combine,mapUv:at&&x(_.map.channel),aoMapUv:ze&&x(_.aoMap.channel),lightMapUv:ke&&x(_.lightMap.channel),bumpMapUv:Qe&&x(_.bumpMap.channel),normalMapUv:$e&&x(_.normalMap.channel),displacementMapUv:ht&&x(_.displacementMap.channel),emissiveMapUv:ft&&x(_.emissiveMap.channel),metalnessMapUv:rt&&x(_.metalnessMap.channel),roughnessMapUv:lt&&x(_.roughnessMap.channel),anisotropyMapUv:G&&x(_.anisotropyMap.channel),clearcoatMapUv:Y&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:oe&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:j&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:L&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:z&&x(_.sheenRoughnessMap.channel),specularMapUv:Z&&x(_.specularMap.channel),specularColorMapUv:te&&x(_.specularColorMap.channel),specularIntensityMapUv:de&&x(_.specularIntensityMap.channel),transmissionMapUv:be&&x(_.transmissionMap.channel),thicknessMapUv:Re&&x(_.thicknessMap.channel),alphaMapUv:ue&&x(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&($e||U),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!B.attributes.uv&&(at||ue),fog:!!K,useFog:_.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&$e===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:we,skinning:R.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:We,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:q.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:at&&_.map.isVideoTexture===!0&&Ge.getTransfer(_.map.colorSpace)===Je,decodeVideoTextureEmissive:ft&&_.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(_.emissiveMap.colorSpace)===Je,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===vn,flipSided:_.side===Ft,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ie&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&_.extensions.multiDraw===!0||Ae)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return _e.vertexUv1s=l.has(1),_e.vertexUv2s=l.has(2),_e.vertexUv3s=l.has(3),l.clear(),_e}function g(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const D in _.defines)E.push(D),E.push(_.defines[D]);return _.isRawShaderMaterial===!1&&(u(E,_),y(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function u(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function y(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){const E=f[_.type];let D;if(E){const P=an[E];D=dd.clone(P.uniforms)}else D=_.uniforms;return D}function M(_,E){let D=h.get(E);return D!==void 0?++D.usedTimes:(D=new Vp(i,E,_,r),c.push(D),h.set(E,D)),D}function w(_){if(--_.usedTimes===0){const E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){o.remove(_)}function C(){o.dispose()}return{getParameters:S,getProgramCacheKey:g,getUniforms:A,acquireProgram:M,releaseProgram:w,releaseShaderCache:b,programs:c,dispose:C}}function Kp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function $p(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Jo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Qo(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,x,S,g,u){let y=i[e];return y===void 0?(y={id:d.id,object:d,geometry:f,material:x,materialVariant:a(d),groupOrder:S,renderOrder:d.renderOrder,z:g,group:u},i[e]=y):(y.id=d.id,y.object=d,y.geometry=f,y.material=x,y.materialVariant=a(d),y.groupOrder=S,y.renderOrder=d.renderOrder,y.z=g,y.group=u),e++,y}function l(d,f,x,S,g,u){const y=o(d,f,x,S,g,u);x.transmission>0?n.push(y):x.transparent===!0?r.push(y):t.push(y)}function c(d,f,x,S,g,u){const y=o(d,f,x,S,g,u);x.transmission>0?n.unshift(y):x.transparent===!0?r.unshift(y):t.unshift(y)}function h(d,f,x){t.length>1&&t.sort(d||$p),n.length>1&&n.sort(f||Jo),r.length>1&&r.sort(f||Jo),x&&(t.reverse(),n.reverse(),r.reverse())}function p(){for(let d=e,f=i.length;d<f;d++){const x=i[d];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:p,sort:h}}function Zp(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Qo,i.set(n,[a])):r>=s.length?(a=new Qo,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Jp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Be};break;case"SpotLight":t={position:new N,direction:new N,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function Qp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let jp=0;function em(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function tm(i){const e=new Jp,t=Qp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const r=new N,s=new ot,a=new ot;function o(c){let h=0,p=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,x=0,S=0,g=0,u=0,y=0,A=0,M=0,w=0,b=0,C=0;c.sort(em);for(let E=0,D=c.length;E<D;E++){const P=c[E],R=P.color,q=P.intensity,K=P.distance;let B=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Jn?B=P.shadow.map.texture:B=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=R.r*q,p+=R.g*q,d+=R.b*q;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],q);C++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,ne=t.get(P);ne.shadowIntensity=X.intensity,ne.shadowBias=X.bias,ne.shadowNormalBias=X.normalBias,ne.shadowRadius=X.radius,ne.shadowMapSize=X.mapSize,n.directionalShadow[f]=ne,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=P.shadow.matrix,y++}n.directional[f]=W,f++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(R).multiplyScalar(q),W.distance=K,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[S]=W;const X=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,X.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[S]=X.matrix,P.castShadow){const ne=t.get(P);ne.shadowIntensity=X.intensity,ne.shadowBias=X.bias,ne.shadowNormalBias=X.normalBias,ne.shadowRadius=X.radius,ne.shadowMapSize=X.mapSize,n.spotShadow[S]=ne,n.spotShadowMap[S]=B,M++}S++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(R).multiplyScalar(q),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=W,g++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const X=P.shadow,ne=t.get(P);ne.shadowIntensity=X.intensity,ne.shadowBias=X.bias,ne.shadowNormalBias=X.normalBias,ne.shadowRadius=X.radius,ne.shadowMapSize=X.mapSize,ne.shadowCameraNear=X.camera.near,ne.shadowCameraFar=X.camera.far,n.pointShadow[x]=ne,n.pointShadowMap[x]=B,n.pointShadowMatrix[x]=P.shadow.matrix,A++}n.point[x]=W,x++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(q),W.groundColor.copy(P.groundColor).multiplyScalar(q),n.hemi[u]=W,u++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=p,n.ambient[2]=d;const _=n.hash;(_.directionalLength!==f||_.pointLength!==x||_.spotLength!==S||_.rectAreaLength!==g||_.hemiLength!==u||_.numDirectionalShadows!==y||_.numPointShadows!==A||_.numSpotShadows!==M||_.numSpotMaps!==w||_.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=S,n.rectArea.length=g,n.point.length=x,n.hemi.length=u,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=A,n.pointShadowMap.length=A,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=A,n.spotLightMatrix.length=M+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=C,_.directionalLength=f,_.pointLength=x,_.spotLength=S,_.rectAreaLength=g,_.hemiLength=u,_.numDirectionalShadows=y,_.numPointShadows=A,_.numSpotShadows=M,_.numSpotMaps=w,_.numLightProbes=C,n.version=jp++)}function l(c,h){let p=0,d=0,f=0,x=0,S=0;const g=h.matrixWorldInverse;for(let u=0,y=c.length;u<y;u++){const A=c[u];if(A.isDirectionalLight){const M=n.directional[p];M.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),p++}else if(A.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(A.isRectAreaLight){const M=n.rectArea[x];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(g),a.identity(),s.copy(A.matrixWorld),s.premultiply(g),a.extractRotation(s),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),x++}else if(A.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(g),d++}else if(A.isHemisphereLight){const M=n.hemi[S];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(g),S++}}}return{setup:o,setupView:l,state:n}}function jo(i){const e=new tm(i),t=[],n=[],r=[];function s(d){p.camera=d,t.length=0,n.length=0,r.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){r.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const p={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:p,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function nm(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new jo(i),e.set(r,[o])):s>=a.length?(o=new jo(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const im=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rm=`uniform sampler2D shadow_pass;
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
}`,sm=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],am=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],el=new ot,Ni=new N,Ms=new N;function om(i,e,t){let n=new Ca;const r=new Pe,s=new Pe,a=new ct,o=new pd,l=new md,c={},h=t.maxTextureSize,p={[On]:Ft,[Ft]:On,[vn]:vn},d=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:im,fragmentShader:rm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const x=new Ut;x.setAttribute("position",new qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new jt(x,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let u=this.type;this.render=function(b,C,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===ic&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=gr);const E=i.getRenderTarget(),D=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),R=i.state;R.setBlending(Sn),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const q=u!==this.type;q&&C.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(B=>B.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,B=b.length;K<B;K++){const W=b[K],X=W.shadow;if(X===void 0){Ce("WebGLShadowMap:",W,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const ne=X.getFrameExtents();r.multiply(ne),s.copy(X.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/ne.x),r.x=s.x*ne.x,X.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/ne.y),r.y=s.y*ne.y,X.mapSize.y=s.y));const re=i.state.buffers.depth.getReversed();if(X.camera._reversedDepth=re,X.map===null||q===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Fi){if(W.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new dn(r.x,r.y,{format:Jn,type:yn,minFilter:Dt,magFilter:Dt,generateMipmaps:!1}),X.map.texture.name=W.name+".shadowMap",X.map.depthTexture=new Si(r.x,r.y,on),X.map.depthTexture.name=W.name+".shadowMapDepth",X.map.depthTexture.format=En,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=At,X.map.depthTexture.magFilter=At}else W.isPointLight?(X.map=new Ol(r.x),X.map.depthTexture=new ld(r.x,un)):(X.map=new dn(r.x,r.y),X.map.depthTexture=new Si(r.x,r.y,un)),X.map.depthTexture.name=W.name+".shadowMap",X.map.depthTexture.format=En,this.type===gr?(X.map.depthTexture.compareFunction=re?Ea:ya,X.map.depthTexture.minFilter=Dt,X.map.depthTexture.magFilter=Dt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=At,X.map.depthTexture.magFilter=At);X.camera.updateProjectionMatrix()}const le=X.map.isWebGLCubeRenderTarget?6:1;for(let pe=0;pe<le;pe++){if(X.map.isWebGLCubeRenderTarget)i.setRenderTarget(X.map,pe),i.clear();else{pe===0&&(i.setRenderTarget(X.map),i.clear());const Se=X.getViewport(pe);a.set(s.x*Se.x,s.y*Se.y,s.x*Se.z,s.y*Se.w),R.viewport(a)}if(W.isPointLight){const Se=X.camera,We=X.matrix,st=W.distance||Se.far;st!==Se.far&&(Se.far=st,Se.updateProjectionMatrix()),Ni.setFromMatrixPosition(W.matrixWorld),Se.position.copy(Ni),Ms.copy(Se.position),Ms.add(sm[pe]),Se.up.copy(am[pe]),Se.lookAt(Ms),Se.updateMatrixWorld(),We.makeTranslation(-Ni.x,-Ni.y,-Ni.z),el.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),X._frustum.setFromProjectionMatrix(el,Se.coordinateSystem,Se.reversedDepth)}else X.updateMatrices(W);n=X.getFrustum(),M(C,_,X.camera,W,this.type)}X.isPointLightShadow!==!0&&this.type===Fi&&y(X,_),X.needsUpdate=!1}u=this.type,g.needsUpdate=!1,i.setRenderTarget(E,D,P)};function y(b,C){const _=e.update(S);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new dn(r.x,r.y,{format:Jn,type:yn})),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(C,null,_,d,S,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(C,null,_,f,S,null)}function A(b,C,_,E){let D=null;const P=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)D=P;else if(D=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const R=D.uuid,q=C.uuid;let K=c[R];K===void 0&&(K={},c[R]=K);let B=K[q];B===void 0&&(B=D.clone(),K[q]=B,C.addEventListener("dispose",w)),D=B}if(D.visible=C.visible,D.wireframe=C.wireframe,E===Fi?D.side=C.shadowSide!==null?C.shadowSide:C.side:D.side=C.shadowSide!==null?C.shadowSide:p[C.side],D.alphaMap=C.alphaMap,D.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,D.map=C.map,D.clipShadows=C.clipShadows,D.clippingPlanes=C.clippingPlanes,D.clipIntersection=C.clipIntersection,D.displacementMap=C.displacementMap,D.displacementScale=C.displacementScale,D.displacementBias=C.displacementBias,D.wireframeLinewidth=C.wireframeLinewidth,D.linewidth=C.linewidth,_.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const R=i.properties.get(D);R.light=_}return D}function M(b,C,_,E,D){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&D===Fi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);const q=e.update(b),K=b.material;if(Array.isArray(K)){const B=q.groups;for(let W=0,X=B.length;W<X;W++){const ne=B[W],re=K[ne.materialIndex];if(re&&re.visible){const le=A(b,re,E,D);b.onBeforeShadow(i,b,C,_,q,le,ne),i.renderBufferDirect(_,null,q,le,b,ne),b.onAfterShadow(i,b,C,_,q,le,ne)}}}else if(K.visible){const B=A(b,K,E,D);b.onBeforeShadow(i,b,C,_,q,B,null),i.renderBufferDirect(_,null,q,B,b,null),b.onAfterShadow(i,b,C,_,q,B,null)}}const R=b.children;for(let q=0,K=R.length;q<K;q++)M(R[q],C,_,E,D)}function w(b){b.target.removeEventListener("dispose",w);for(const _ in c){const E=c[_],D=b.target.uuid;D in E&&(E[D].dispose(),delete E[D])}}}function lm(i,e){function t(){let I=!1;const ue=new ct;let Q=null;const fe=new ct(0,0,0,0);return{setMask:function(ie){Q!==ie&&!I&&(i.colorMask(ie,ie,ie,ie),Q=ie)},setLocked:function(ie){I=ie},setClear:function(ie,ee,_e,ae,et){et===!0&&(ie*=ae,ee*=ae,_e*=ae),ue.set(ie,ee,_e,ae),fe.equals(ue)===!1&&(i.clearColor(ie,ee,_e,ae),fe.copy(ue))},reset:function(){I=!1,Q=null,fe.set(-1,0,0,0)}}}function n(){let I=!1,ue=!1,Q=null,fe=null,ie=null;return{setReversed:function(ee){if(ue!==ee){const _e=e.get("EXT_clip_control");ee?_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.ZERO_TO_ONE_EXT):_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.NEGATIVE_ONE_TO_ONE_EXT),ue=ee;const ae=ie;ie=null,this.setClear(ae)}},getReversed:function(){return ue},setTest:function(ee){ee?se(i.DEPTH_TEST):we(i.DEPTH_TEST)},setMask:function(ee){Q!==ee&&!I&&(i.depthMask(ee),Q=ee)},setFunc:function(ee){if(ue&&(ee=Fc[ee]),fe!==ee){switch(ee){case Ts:i.depthFunc(i.NEVER);break;case As:i.depthFunc(i.ALWAYS);break;case ws:i.depthFunc(i.LESS);break;case vi:i.depthFunc(i.LEQUAL);break;case Rs:i.depthFunc(i.EQUAL);break;case Cs:i.depthFunc(i.GEQUAL);break;case Ps:i.depthFunc(i.GREATER);break;case Ds:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}fe=ee}},setLocked:function(ee){I=ee},setClear:function(ee){ie!==ee&&(ie=ee,ue&&(ee=1-ee),i.clearDepth(ee))},reset:function(){I=!1,Q=null,fe=null,ie=null,ue=!1}}}function r(){let I=!1,ue=null,Q=null,fe=null,ie=null,ee=null,_e=null,ae=null,et=null;return{setTest:function(Ze){I||(Ze?se(i.STENCIL_TEST):we(i.STENCIL_TEST))},setMask:function(Ze){ue!==Ze&&!I&&(i.stencilMask(Ze),ue=Ze)},setFunc:function(Ze,en,tn){(Q!==Ze||fe!==en||ie!==tn)&&(i.stencilFunc(Ze,en,tn),Q=Ze,fe=en,ie=tn)},setOp:function(Ze,en,tn){(ee!==Ze||_e!==en||ae!==tn)&&(i.stencilOp(Ze,en,tn),ee=Ze,_e=en,ae=tn)},setLocked:function(Ze){I=Ze},setClear:function(Ze){et!==Ze&&(i.clearStencil(Ze),et=Ze)},reset:function(){I=!1,ue=null,Q=null,fe=null,ie=null,ee=null,_e=null,ae=null,et=null}}}const s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap;let h={},p={},d={},f=new WeakMap,x=[],S=null,g=!1,u=null,y=null,A=null,M=null,w=null,b=null,C=null,_=new Be(0,0,0),E=0,D=!1,P=null,R=null,q=null,K=null,B=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,ne=0;const re=i.getParameter(i.VERSION);re.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(re)[1]),X=ne>=1):re.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),X=ne>=2);let le=null,pe={};const Se=i.getParameter(i.SCISSOR_BOX),We=i.getParameter(i.VIEWPORT),st=new ct().fromArray(Se),Le=new ct().fromArray(We);function J(I,ue,Q,fe){const ie=new Uint8Array(4),ee=i.createTexture();i.bindTexture(I,ee),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let _e=0;_e<Q;_e++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(ue,0,i.RGBA,1,1,fe,0,i.RGBA,i.UNSIGNED_BYTE,ie):i.texImage2D(ue+_e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ie);return ee}const ce={};ce[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(i.DEPTH_TEST),a.setFunc(vi),Qe(!1),$e($a),se(i.CULL_FACE),ze(Sn);function se(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function we(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function De(I,ue){return d[I]!==ue?(i.bindFramebuffer(I,ue),d[I]=ue,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ue),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ue),!0):!1}function Ae(I,ue){let Q=x,fe=!1;if(I){Q=f.get(ue),Q===void 0&&(Q=[],f.set(ue,Q));const ie=I.textures;if(Q.length!==ie.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,_e=ie.length;ee<_e;ee++)Q[ee]=i.COLOR_ATTACHMENT0+ee;Q.length=ie.length,fe=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,fe=!0);fe&&i.drawBuffers(Q)}function at(I){return S!==I?(i.useProgram(I),S=I,!0):!1}const Fe={[qn]:i.FUNC_ADD,[sc]:i.FUNC_SUBTRACT,[ac]:i.FUNC_REVERSE_SUBTRACT};Fe[oc]=i.MIN,Fe[lc]=i.MAX;const Ye={[cc]:i.ZERO,[dc]:i.ONE,[uc]:i.SRC_COLOR,[ys]:i.SRC_ALPHA,[_c]:i.SRC_ALPHA_SATURATE,[mc]:i.DST_COLOR,[fc]:i.DST_ALPHA,[hc]:i.ONE_MINUS_SRC_COLOR,[Es]:i.ONE_MINUS_SRC_ALPHA,[gc]:i.ONE_MINUS_DST_COLOR,[pc]:i.ONE_MINUS_DST_ALPHA,[xc]:i.CONSTANT_COLOR,[vc]:i.ONE_MINUS_CONSTANT_COLOR,[Mc]:i.CONSTANT_ALPHA,[Sc]:i.ONE_MINUS_CONSTANT_ALPHA};function ze(I,ue,Q,fe,ie,ee,_e,ae,et,Ze){if(I===Sn){g===!0&&(we(i.BLEND),g=!1);return}if(g===!1&&(se(i.BLEND),g=!0),I!==rc){if(I!==u||Ze!==D){if((y!==qn||w!==qn)&&(i.blendEquation(i.FUNC_ADD),y=qn,w=qn),Ze)switch(I){case gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Za:i.blendFunc(i.ONE,i.ONE);break;case Ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qa:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:He("WebGLState: Invalid blending: ",I);break}else switch(I){case gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Za:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ja:He("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qa:He("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:He("WebGLState: Invalid blending: ",I);break}A=null,M=null,b=null,C=null,_.set(0,0,0),E=0,u=I,D=Ze}return}ie=ie||ue,ee=ee||Q,_e=_e||fe,(ue!==y||ie!==w)&&(i.blendEquationSeparate(Fe[ue],Fe[ie]),y=ue,w=ie),(Q!==A||fe!==M||ee!==b||_e!==C)&&(i.blendFuncSeparate(Ye[Q],Ye[fe],Ye[ee],Ye[_e]),A=Q,M=fe,b=ee,C=_e),(ae.equals(_)===!1||et!==E)&&(i.blendColor(ae.r,ae.g,ae.b,et),_.copy(ae),E=et),u=I,D=!1}function ke(I,ue){I.side===vn?we(i.CULL_FACE):se(i.CULL_FACE);let Q=I.side===Ft;ue&&(Q=!Q),Qe(Q),I.blending===gi&&I.transparent===!1?ze(Sn):ze(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const fe=I.stencilWrite;o.setTest(fe),fe&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ft(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):we(i.SAMPLE_ALPHA_TO_COVERAGE)}function Qe(I){P!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),P=I)}function $e(I){I!==tc?(se(i.CULL_FACE),I!==R&&(I===$a?i.cullFace(i.BACK):I===nc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):we(i.CULL_FACE),R=I}function ht(I){I!==q&&(X&&i.lineWidth(I),q=I)}function ft(I,ue,Q){I?(se(i.POLYGON_OFFSET_FILL),(K!==ue||B!==Q)&&(K=ue,B=Q,a.getReversed()&&(ue=-ue),i.polygonOffset(ue,Q))):we(i.POLYGON_OFFSET_FILL)}function rt(I){I?se(i.SCISSOR_TEST):we(i.SCISSOR_TEST)}function lt(I){I===void 0&&(I=i.TEXTURE0+W-1),le!==I&&(i.activeTexture(I),le=I)}function U(I,ue,Q){Q===void 0&&(le===null?Q=i.TEXTURE0+W-1:Q=le);let fe=pe[Q];fe===void 0&&(fe={type:void 0,texture:void 0},pe[Q]=fe),(fe.type!==I||fe.texture!==ue)&&(le!==Q&&(i.activeTexture(Q),le=Q),i.bindTexture(I,ue||ce[I]),fe.type=I,fe.texture=ue)}function wt(){const I=pe[le];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Ke(){try{i.compressedTexImage2D(...arguments)}catch(I){He("WebGLState:",I)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(I){He("WebGLState:",I)}}function m(){try{i.texSubImage2D(...arguments)}catch(I){He("WebGLState:",I)}}function O(){try{i.texSubImage3D(...arguments)}catch(I){He("WebGLState:",I)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(I){He("WebGLState:",I)}}function Y(){try{i.compressedTexSubImage3D(...arguments)}catch(I){He("WebGLState:",I)}}function oe(){try{i.texStorage2D(...arguments)}catch(I){He("WebGLState:",I)}}function he(){try{i.texStorage3D(...arguments)}catch(I){He("WebGLState:",I)}}function $(){try{i.texImage2D(...arguments)}catch(I){He("WebGLState:",I)}}function j(){try{i.texImage3D(...arguments)}catch(I){He("WebGLState:",I)}}function L(I){return p[I]!==void 0?p[I]:i.getParameter(I)}function z(I,ue){p[I]!==ue&&(i.pixelStorei(I,ue),p[I]=ue)}function Z(I){st.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),st.copy(I))}function te(I){Le.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Le.copy(I))}function de(I,ue){let Q=c.get(ue);Q===void 0&&(Q=new WeakMap,c.set(ue,Q));let fe=Q.get(I);fe===void 0&&(fe=i.getUniformBlockIndex(ue,I.name),Q.set(I,fe))}function be(I,ue){const fe=c.get(ue).get(I);l.get(ue)!==fe&&(i.uniformBlockBinding(ue,fe,I.__bindingPointIndex),l.set(ue,fe))}function Re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},p={},le=null,pe={},d={},f=new WeakMap,x=[],S=null,g=!1,u=null,y=null,A=null,M=null,w=null,b=null,C=null,_=new Be(0,0,0),E=0,D=!1,P=null,R=null,q=null,K=null,B=null,st.set(0,0,i.canvas.width,i.canvas.height),Le.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:se,disable:we,bindFramebuffer:De,drawBuffers:Ae,useProgram:at,setBlending:ze,setMaterial:ke,setFlipSided:Qe,setCullFace:$e,setLineWidth:ht,setPolygonOffset:ft,setScissorTest:rt,activeTexture:lt,bindTexture:U,unbindTexture:wt,compressedTexImage2D:Ke,compressedTexImage3D:T,texImage2D:$,texImage3D:j,pixelStorei:z,getParameter:L,updateUBOMapping:de,uniformBlockBinding:be,texStorage2D:oe,texStorage3D:he,texSubImage2D:m,texSubImage3D:O,compressedTexSubImage2D:G,compressedTexSubImage3D:Y,scissor:Z,viewport:te,reset:Re}}function cm(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pe,h=new WeakMap,p=new Set;let d;const f=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(T,m){return x?new OffscreenCanvas(T,m):Ar("canvas")}function g(T,m,O){let G=1;const Y=Ke(T);if((Y.width>O||Y.height>O)&&(G=O/Math.max(Y.width,Y.height)),G<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const oe=Math.floor(G*Y.width),he=Math.floor(G*Y.height);d===void 0&&(d=S(oe,he));const $=m?S(oe,he):d;return $.width=oe,$.height=he,$.getContext("2d").drawImage(T,0,0,oe,he),Ce("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+oe+"x"+he+")."),$}else return"data"in T&&Ce("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),T;return T}function u(T){return T.generateMipmaps}function y(T){i.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(T,m,O,G,Y,oe=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let he;G&&(he=e.get("EXT_texture_norm16"),he||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=m;if(m===i.RED&&(O===i.FLOAT&&($=i.R32F),O===i.HALF_FLOAT&&($=i.R16F),O===i.UNSIGNED_BYTE&&($=i.R8),O===i.UNSIGNED_SHORT&&he&&($=he.R16_EXT),O===i.SHORT&&he&&($=he.R16_SNORM_EXT)),m===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.R8UI),O===i.UNSIGNED_SHORT&&($=i.R16UI),O===i.UNSIGNED_INT&&($=i.R32UI),O===i.BYTE&&($=i.R8I),O===i.SHORT&&($=i.R16I),O===i.INT&&($=i.R32I)),m===i.RG&&(O===i.FLOAT&&($=i.RG32F),O===i.HALF_FLOAT&&($=i.RG16F),O===i.UNSIGNED_BYTE&&($=i.RG8),O===i.UNSIGNED_SHORT&&he&&($=he.RG16_EXT),O===i.SHORT&&he&&($=he.RG16_SNORM_EXT)),m===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RG8UI),O===i.UNSIGNED_SHORT&&($=i.RG16UI),O===i.UNSIGNED_INT&&($=i.RG32UI),O===i.BYTE&&($=i.RG8I),O===i.SHORT&&($=i.RG16I),O===i.INT&&($=i.RG32I)),m===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGB8UI),O===i.UNSIGNED_SHORT&&($=i.RGB16UI),O===i.UNSIGNED_INT&&($=i.RGB32UI),O===i.BYTE&&($=i.RGB8I),O===i.SHORT&&($=i.RGB16I),O===i.INT&&($=i.RGB32I)),m===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGBA8UI),O===i.UNSIGNED_SHORT&&($=i.RGBA16UI),O===i.UNSIGNED_INT&&($=i.RGBA32UI),O===i.BYTE&&($=i.RGBA8I),O===i.SHORT&&($=i.RGBA16I),O===i.INT&&($=i.RGBA32I)),m===i.RGB&&(O===i.UNSIGNED_SHORT&&he&&($=he.RGB16_EXT),O===i.SHORT&&he&&($=he.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),m===i.RGBA){const j=oe?Tr:Ge.getTransfer(Y);O===i.FLOAT&&($=i.RGBA32F),O===i.HALF_FLOAT&&($=i.RGBA16F),O===i.UNSIGNED_BYTE&&($=j===Je?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&he&&($=he.RGBA16_EXT),O===i.SHORT&&he&&($=he.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function w(T,m){let O;return T?m===null||m===un||m===zi?O=i.DEPTH24_STENCIL8:m===on?O=i.DEPTH32F_STENCIL8:m===Bi&&(O=i.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):m===null||m===un||m===zi?O=i.DEPTH_COMPONENT24:m===on?O=i.DEPTH_COMPONENT32F:m===Bi&&(O=i.DEPTH_COMPONENT16),O}function b(T,m){return u(T)===!0||T.isFramebufferTexture&&T.minFilter!==At&&T.minFilter!==Dt?Math.log2(Math.max(m.width,m.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?m.mipmaps.length:1}function C(T){const m=T.target;m.removeEventListener("dispose",C),E(m),m.isVideoTexture&&h.delete(m),m.isHTMLTexture&&p.delete(m)}function _(T){const m=T.target;m.removeEventListener("dispose",_),P(m)}function E(T){const m=n.get(T);if(m.__webglInit===void 0)return;const O=T.source,G=f.get(O);if(G){const Y=G[m.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&D(T),Object.keys(G).length===0&&f.delete(O)}n.remove(T)}function D(T){const m=n.get(T);i.deleteTexture(m.__webglTexture);const O=T.source,G=f.get(O);delete G[m.__cacheKey],a.memory.textures--}function P(T){const m=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(m.__webglFramebuffer[G]))for(let Y=0;Y<m.__webglFramebuffer[G].length;Y++)i.deleteFramebuffer(m.__webglFramebuffer[G][Y]);else i.deleteFramebuffer(m.__webglFramebuffer[G]);m.__webglDepthbuffer&&i.deleteRenderbuffer(m.__webglDepthbuffer[G])}else{if(Array.isArray(m.__webglFramebuffer))for(let G=0;G<m.__webglFramebuffer.length;G++)i.deleteFramebuffer(m.__webglFramebuffer[G]);else i.deleteFramebuffer(m.__webglFramebuffer);if(m.__webglDepthbuffer&&i.deleteRenderbuffer(m.__webglDepthbuffer),m.__webglMultisampledFramebuffer&&i.deleteFramebuffer(m.__webglMultisampledFramebuffer),m.__webglColorRenderbuffer)for(let G=0;G<m.__webglColorRenderbuffer.length;G++)m.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(m.__webglColorRenderbuffer[G]);m.__webglDepthRenderbuffer&&i.deleteRenderbuffer(m.__webglDepthRenderbuffer)}const O=T.textures;for(let G=0,Y=O.length;G<Y;G++){const oe=n.get(O[G]);oe.__webglTexture&&(i.deleteTexture(oe.__webglTexture),a.memory.textures--),n.remove(O[G])}n.remove(T)}let R=0;function q(){R=0}function K(){return R}function B(T){R=T}function W(){const T=R;return T>=r.maxTextures&&Ce("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),R+=1,T}function X(T){const m=[];return m.push(T.wrapS),m.push(T.wrapT),m.push(T.wrapR||0),m.push(T.magFilter),m.push(T.minFilter),m.push(T.anisotropy),m.push(T.internalFormat),m.push(T.format),m.push(T.type),m.push(T.generateMipmaps),m.push(T.premultiplyAlpha),m.push(T.flipY),m.push(T.unpackAlignment),m.push(T.colorSpace),m.join()}function ne(T,m){const O=n.get(T);if(T.isVideoTexture&&U(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const G=T.image;if(G===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{we(O,T,m);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+m)}function re(T,m){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){we(O,T,m);return}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+m)}function le(T,m){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){we(O,T,m);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+m)}function pe(T,m){const O=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&O.__version!==T.version){De(O,T,m);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+m)}const Se={[Ls]:i.REPEAT,[Mn]:i.CLAMP_TO_EDGE,[Is]:i.MIRRORED_REPEAT},We={[At]:i.NEAREST,[Ec]:i.NEAREST_MIPMAP_NEAREST,[Xi]:i.NEAREST_MIPMAP_LINEAR,[Dt]:i.LINEAR,[Vr]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},st={[wc]:i.NEVER,[Lc]:i.ALWAYS,[Rc]:i.LESS,[ya]:i.LEQUAL,[Cc]:i.EQUAL,[Ea]:i.GEQUAL,[Pc]:i.GREATER,[Dc]:i.NOTEQUAL};function Le(T,m){if(m.type===on&&e.has("OES_texture_float_linear")===!1&&(m.magFilter===Dt||m.magFilter===Vr||m.magFilter===Xi||m.magFilter===Kn||m.minFilter===Dt||m.minFilter===Vr||m.minFilter===Xi||m.minFilter===Kn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Se[m.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Se[m.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Se[m.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,We[m.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,We[m.minFilter]),m.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,st[m.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(m.magFilter===At||m.minFilter!==Xi&&m.minFilter!==Kn||m.type===on&&e.has("OES_texture_float_linear")===!1)return;if(m.anisotropy>1||n.get(m).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(m.anisotropy,r.getMaxAnisotropy())),n.get(m).__currentAnisotropy=m.anisotropy}}}function J(T,m){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,m.addEventListener("dispose",C));const G=m.source;let Y=f.get(G);Y===void 0&&(Y={},f.set(G,Y));const oe=X(m);if(oe!==T.__cacheKey){Y[oe]===void 0&&(Y[oe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[oe].usedTimes++;const he=Y[T.__cacheKey];he!==void 0&&(Y[T.__cacheKey].usedTimes--,he.usedTimes===0&&D(m)),T.__cacheKey=oe,T.__webglTexture=Y[oe].texture}return O}function ce(T,m,O){return Math.floor(Math.floor(T/O)/m)}function se(T,m,O,G){const oe=T.updateRanges;if(oe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,m.width,m.height,O,G,m.data);else{oe.sort((z,Z)=>z.start-Z.start);let he=0;for(let z=1;z<oe.length;z++){const Z=oe[he],te=oe[z],de=Z.start+Z.count,be=ce(te.start,m.width,4),Re=ce(Z.start,m.width,4);te.start<=de+1&&be===Re&&ce(te.start+te.count-1,m.width,4)===be?Z.count=Math.max(Z.count,te.start+te.count-Z.start):(++he,oe[he]=te)}oe.length=he+1;const $=t.getParameter(i.UNPACK_ROW_LENGTH),j=t.getParameter(i.UNPACK_SKIP_PIXELS),L=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,m.width);for(let z=0,Z=oe.length;z<Z;z++){const te=oe[z],de=Math.floor(te.start/4),be=Math.ceil(te.count/4),Re=de%m.width,I=Math.floor(de/m.width),ue=be,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Re),t.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,Re,I,ue,Q,O,G,m.data)}T.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,j),t.pixelStorei(i.UNPACK_SKIP_ROWS,L)}}function we(T,m,O){let G=i.TEXTURE_2D;(m.isDataArrayTexture||m.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),m.isData3DTexture&&(G=i.TEXTURE_3D);const Y=J(T,m),oe=m.source;t.bindTexture(G,T.__webglTexture,i.TEXTURE0+O);const he=n.get(oe);if(oe.version!==he.__version||Y===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&m.image instanceof ImageBitmap)===!1){const Q=Ge.getPrimaries(Ge.workingColorSpace),fe=m.colorSpace===Nn?null:Ge.getPrimaries(m.colorSpace),ie=m.colorSpace===Nn||Q===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,m.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,m.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie)}t.pixelStorei(i.UNPACK_ALIGNMENT,m.unpackAlignment);let j=g(m.image,!1,r.maxTextureSize);j=wt(m,j);const L=s.convert(m.format,m.colorSpace),z=s.convert(m.type);let Z=M(m.internalFormat,L,z,m.normalized,m.colorSpace,m.isVideoTexture);Le(G,m);let te;const de=m.mipmaps,be=m.isVideoTexture!==!0,Re=he.__version===void 0||Y===!0,I=oe.dataReady,ue=b(m,j);if(m.isDepthTexture)Z=w(m.format===$n,m.type),Re&&(be?t.texStorage2D(i.TEXTURE_2D,1,Z,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,Z,j.width,j.height,0,L,z,null));else if(m.isDataTexture)if(de.length>0){be&&Re&&t.texStorage2D(i.TEXTURE_2D,ue,Z,de[0].width,de[0].height);for(let Q=0,fe=de.length;Q<fe;Q++)te=de[Q],be?I&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,te.width,te.height,L,z,te.data):t.texImage2D(i.TEXTURE_2D,Q,Z,te.width,te.height,0,L,z,te.data);m.generateMipmaps=!1}else be?(Re&&t.texStorage2D(i.TEXTURE_2D,ue,Z,j.width,j.height),I&&se(m,j,L,z)):t.texImage2D(i.TEXTURE_2D,0,Z,j.width,j.height,0,L,z,j.data);else if(m.isCompressedTexture)if(m.isCompressedArrayTexture){be&&Re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,Z,de[0].width,de[0].height,j.depth);for(let Q=0,fe=de.length;Q<fe;Q++)if(te=de[Q],m.format!==Qt)if(L!==null)if(be){if(I)if(m.layerUpdates.size>0){const ie=Do(te.width,te.height,m.format,m.type);for(const ee of m.layerUpdates){const _e=te.data.subarray(ee*ie/te.data.BYTES_PER_ELEMENT,(ee+1)*ie/te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,ee,te.width,te.height,1,L,_e)}m.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,te.width,te.height,j.depth,L,te.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Z,te.width,te.height,j.depth,0,te.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else be?I&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,te.width,te.height,j.depth,L,z,te.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,Z,te.width,te.height,j.depth,0,L,z,te.data)}else{be&&Re&&t.texStorage2D(i.TEXTURE_2D,ue,Z,de[0].width,de[0].height);for(let Q=0,fe=de.length;Q<fe;Q++)te=de[Q],m.format!==Qt?L!==null?be?I&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,te.width,te.height,L,te.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,Z,te.width,te.height,0,te.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?I&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,te.width,te.height,L,z,te.data):t.texImage2D(i.TEXTURE_2D,Q,Z,te.width,te.height,0,L,z,te.data)}else if(m.isDataArrayTexture)if(be){if(Re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,Z,j.width,j.height,j.depth),I)if(m.layerUpdates.size>0){const Q=Do(j.width,j.height,m.format,m.type);for(const fe of m.layerUpdates){const ie=j.data.subarray(fe*Q/j.data.BYTES_PER_ELEMENT,(fe+1)*Q/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,fe,j.width,j.height,1,L,z,ie)}m.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,L,z,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Z,j.width,j.height,j.depth,0,L,z,j.data);else if(m.isData3DTexture)be?(Re&&t.texStorage3D(i.TEXTURE_3D,ue,Z,j.width,j.height,j.depth),I&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,L,z,j.data)):t.texImage3D(i.TEXTURE_3D,0,Z,j.width,j.height,j.depth,0,L,z,j.data);else if(m.isFramebufferTexture){if(Re)if(be)t.texStorage2D(i.TEXTURE_2D,ue,Z,j.width,j.height);else{let Q=j.width,fe=j.height;for(let ie=0;ie<ue;ie++)t.texImage2D(i.TEXTURE_2D,ie,Z,Q,fe,0,L,z,null),Q>>=1,fe>>=1}}else if(m.isHTMLTexture){if("texElementImage2D"in i){const Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),p.add(m),Q.onpaint=fe=>{const ie=fe.changedElements;for(const ee of p)ie.includes(ee.image)&&(ee.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,j);else{const ie=i.RGBA,ee=i.RGBA,_e=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ie,ee,_e,j)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(de.length>0){if(be&&Re){const Q=Ke(de[0]);t.texStorage2D(i.TEXTURE_2D,ue,Z,Q.width,Q.height)}for(let Q=0,fe=de.length;Q<fe;Q++)te=de[Q],be?I&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,L,z,te):t.texImage2D(i.TEXTURE_2D,Q,Z,L,z,te);m.generateMipmaps=!1}else if(be){if(Re){const Q=Ke(j);t.texStorage2D(i.TEXTURE_2D,ue,Z,Q.width,Q.height)}I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,L,z,j)}else t.texImage2D(i.TEXTURE_2D,0,Z,L,z,j);u(m)&&y(G),he.__version=oe.version,m.onUpdate&&m.onUpdate(m)}T.__version=m.version}function De(T,m,O){if(m.image.length!==6)return;const G=J(T,m),Y=m.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const oe=n.get(Y);if(Y.version!==oe.__version||G===!0){t.activeTexture(i.TEXTURE0+O);const he=Ge.getPrimaries(Ge.workingColorSpace),$=m.colorSpace===Nn?null:Ge.getPrimaries(m.colorSpace),j=m.colorSpace===Nn||he===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,m.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,m.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,m.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const L=m.isCompressedTexture||m.image[0].isCompressedTexture,z=m.image[0]&&m.image[0].isDataTexture,Z=[];for(let ee=0;ee<6;ee++)!L&&!z?Z[ee]=g(m.image[ee],!0,r.maxCubemapSize):Z[ee]=z?m.image[ee].image:m.image[ee],Z[ee]=wt(m,Z[ee]);const te=Z[0],de=s.convert(m.format,m.colorSpace),be=s.convert(m.type),Re=M(m.internalFormat,de,be,m.normalized,m.colorSpace),I=m.isVideoTexture!==!0,ue=oe.__version===void 0||G===!0,Q=Y.dataReady;let fe=b(m,te);Le(i.TEXTURE_CUBE_MAP,m);let ie;if(L){I&&ue&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Re,te.width,te.height);for(let ee=0;ee<6;ee++){ie=Z[ee].mipmaps;for(let _e=0;_e<ie.length;_e++){const ae=ie[_e];m.format!==Qt?de!==null?I?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e,0,0,ae.width,ae.height,de,ae.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e,Re,ae.width,ae.height,0,ae.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e,0,0,ae.width,ae.height,de,be,ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e,Re,ae.width,ae.height,0,de,be,ae.data)}}}else{if(ie=m.mipmaps,I&&ue){ie.length>0&&fe++;const ee=Ke(Z[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Re,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(z){I?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Z[ee].width,Z[ee].height,de,be,Z[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Re,Z[ee].width,Z[ee].height,0,de,be,Z[ee].data);for(let _e=0;_e<ie.length;_e++){const et=ie[_e].image[ee].image;I?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e+1,0,0,et.width,et.height,de,be,et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e+1,Re,et.width,et.height,0,de,be,et.data)}}else{I?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,de,be,Z[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Re,de,be,Z[ee]);for(let _e=0;_e<ie.length;_e++){const ae=ie[_e];I?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e+1,0,0,de,be,ae.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,_e+1,Re,de,be,ae.image[ee])}}}u(m)&&y(i.TEXTURE_CUBE_MAP),oe.__version=Y.version,m.onUpdate&&m.onUpdate(m)}T.__version=m.version}function Ae(T,m,O,G,Y,oe){const he=s.convert(O.format,O.colorSpace),$=s.convert(O.type),j=M(O.internalFormat,he,$,O.normalized,O.colorSpace),L=n.get(m),z=n.get(O);if(z.__renderTarget=m,!L.__hasExternalTextures){const Z=Math.max(1,m.width>>oe),te=Math.max(1,m.height>>oe);Y===i.TEXTURE_3D||Y===i.TEXTURE_2D_ARRAY?t.texImage3D(Y,oe,j,Z,te,m.depth,0,he,$,null):t.texImage2D(Y,oe,j,Z,te,0,he,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),lt(m)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,Y,z.__webglTexture,0,rt(m)):(Y===i.TEXTURE_2D||Y>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,Y,z.__webglTexture,oe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function at(T,m,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),m.depthBuffer){const G=m.depthTexture,Y=G&&G.isDepthTexture?G.type:null,oe=w(m.stencilBuffer,Y),he=m.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;lt(m)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt(m),oe,m.width,m.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt(m),oe,m.width,m.height):i.renderbufferStorage(i.RENDERBUFFER,oe,m.width,m.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,he,i.RENDERBUFFER,T)}else{const G=m.textures;for(let Y=0;Y<G.length;Y++){const oe=G[Y],he=s.convert(oe.format,oe.colorSpace),$=s.convert(oe.type),j=M(oe.internalFormat,he,$,oe.normalized,oe.colorSpace);lt(m)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt(m),j,m.width,m.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt(m),j,m.width,m.height):i.renderbufferStorage(i.RENDERBUFFER,j,m.width,m.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Fe(T,m,O){const G=m.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(m.depthTexture&&m.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Y=n.get(m.depthTexture);if(Y.__renderTarget=m,(!Y.__webglTexture||m.depthTexture.image.width!==m.width||m.depthTexture.image.height!==m.height)&&(m.depthTexture.image.width=m.width,m.depthTexture.image.height=m.height,m.depthTexture.needsUpdate=!0),G){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,m.depthTexture.addEventListener("dispose",C)),Y.__webglTexture===void 0){Y.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Le(i.TEXTURE_CUBE_MAP,m.depthTexture);const L=s.convert(m.depthTexture.format),z=s.convert(m.depthTexture.type);let Z;m.depthTexture.format===En?Z=i.DEPTH_COMPONENT24:m.depthTexture.format===$n&&(Z=i.DEPTH24_STENCIL8);for(let te=0;te<6;te++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Z,m.width,m.height,0,L,z,null)}}else ne(m.depthTexture,0);const oe=Y.__webglTexture,he=rt(m),$=G?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,j=m.depthTexture.format===$n?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(m.depthTexture.format===En)lt(m)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,$,oe,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,j,$,oe,0);else if(m.depthTexture.format===$n)lt(m)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,$,oe,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,j,$,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ye(T){const m=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(m.__boundDepthTexture!==T.depthTexture){const G=T.depthTexture;if(m.__depthDisposeCallback&&m.__depthDisposeCallback(),G){const Y=()=>{delete m.__boundDepthTexture,delete m.__depthDisposeCallback,G.removeEventListener("dispose",Y)};G.addEventListener("dispose",Y),m.__depthDisposeCallback=Y}m.__boundDepthTexture=G}if(T.depthTexture&&!m.__autoAllocateDepthBuffer)if(O)for(let G=0;G<6;G++)Fe(m.__webglFramebuffer[G],T,G);else{const G=T.texture.mipmaps;G&&G.length>0?Fe(m.__webglFramebuffer[0],T,0):Fe(m.__webglFramebuffer,T,0)}else if(O){m.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer[G]),m.__webglDepthbuffer[G]===void 0)m.__webglDepthbuffer[G]=i.createRenderbuffer(),at(m.__webglDepthbuffer[G],T,!1);else{const Y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=m.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,oe)}}else{const G=T.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer),m.__webglDepthbuffer===void 0)m.__webglDepthbuffer=i.createRenderbuffer(),at(m.__webglDepthbuffer,T,!1);else{const Y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=m.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,oe)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(T,m,O){const G=n.get(T);m!==void 0&&Ae(G.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ye(T)}function ke(T){const m=T.texture,O=n.get(T),G=n.get(m);T.addEventListener("dispose",_);const Y=T.textures,oe=T.isWebGLCubeRenderTarget===!0,he=Y.length>1;if(he||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=m.version,a.memory.textures++),oe){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(m.mipmaps&&m.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let j=0;j<m.mipmaps.length;j++)O.__webglFramebuffer[$][j]=i.createFramebuffer()}else O.__webglFramebuffer[$]=i.createFramebuffer()}else{if(m.mipmaps&&m.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<m.mipmaps.length;$++)O.__webglFramebuffer[$]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(he)for(let $=0,j=Y.length;$<j;$++){const L=n.get(Y[$]);L.__webglTexture===void 0&&(L.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&lt(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<Y.length;$++){const j=Y[$];O.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[$]);const L=s.convert(j.format,j.colorSpace),z=s.convert(j.type),Z=M(j.internalFormat,L,z,j.normalized,j.colorSpace,T.isXRRenderTarget===!0),te=rt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,te,Z,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,O.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),at(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(oe){t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),Le(i.TEXTURE_CUBE_MAP,m);for(let $=0;$<6;$++)if(m.mipmaps&&m.mipmaps.length>0)for(let j=0;j<m.mipmaps.length;j++)Ae(O.__webglFramebuffer[$][j],T,m,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,j);else Ae(O.__webglFramebuffer[$],T,m,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);u(m)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let $=0,j=Y.length;$<j;$++){const L=Y[$],z=n.get(L);let Z=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Z=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,z.__webglTexture),Le(Z,L),Ae(O.__webglFramebuffer,T,L,i.COLOR_ATTACHMENT0+$,Z,0),u(L)&&y(Z)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&($=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,G.__webglTexture),Le($,m),m.mipmaps&&m.mipmaps.length>0)for(let j=0;j<m.mipmaps.length;j++)Ae(O.__webglFramebuffer[j],T,m,i.COLOR_ATTACHMENT0,$,j);else Ae(O.__webglFramebuffer,T,m,i.COLOR_ATTACHMENT0,$,0);u(m)&&y($),t.unbindTexture()}T.depthBuffer&&Ye(T)}function Qe(T){const m=T.textures;for(let O=0,G=m.length;O<G;O++){const Y=m[O];if(u(Y)){const oe=A(T),he=n.get(Y).__webglTexture;t.bindTexture(oe,he),y(oe),t.unbindTexture()}}}const $e=[],ht=[];function ft(T){if(T.samples>0){if(lt(T)===!1){const m=T.textures,O=T.width,G=T.height;let Y=i.COLOR_BUFFER_BIT;const oe=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=n.get(T),$=m.length>1;if($)for(let L=0;L<m.length;L++)t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);const j=T.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let L=0;L<m.length;L++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Y|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Y|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,he.__webglColorRenderbuffer[L]);const z=n.get(m[L]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,z,0)}i.blitFramebuffer(0,0,O,G,0,0,O,G,Y,i.NEAREST),l===!0&&($e.length=0,ht.length=0,$e.push(i.COLOR_ATTACHMENT0+L),T.depthBuffer&&T.resolveDepthBuffer===!1&&($e.push(oe),ht.push(oe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ht)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,$e))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let L=0;L<m.length;L++){t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.RENDERBUFFER,he.__webglColorRenderbuffer[L]);const z=n.get(m[L]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.TEXTURE_2D,z,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const m=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[m])}}}function rt(T){return Math.min(r.maxSamples,T.samples)}function lt(T){const m=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&m.__useRenderToTexture!==!1}function U(T){const m=a.render.frame;h.get(T)!==m&&(h.set(T,m),T.update())}function wt(T,m){const O=T.colorSpace,G=T.format,Y=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==Er&&O!==Nn&&(Ge.getTransfer(O)===Je?(G!==Qt||Y!==Gt)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):He("WebGLTextures: Unsupported texture color space:",O)),m}function Ke(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=q,this.getTextureUnits=K,this.setTextureUnits=B,this.setTexture2D=ne,this.setTexture2DArray=re,this.setTexture3D=le,this.setTextureCube=pe,this.rebindTextures=ze,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=lt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function dm(i,e){function t(n,r=Nn){let s;const a=Ge.getTransfer(r);if(n===Gt)return i.UNSIGNED_BYTE;if(n===xa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===va)return i.UNSIGNED_SHORT_5_5_5_1;if(n===_l)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===xl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ml)return i.BYTE;if(n===gl)return i.SHORT;if(n===Bi)return i.UNSIGNED_SHORT;if(n===_a)return i.INT;if(n===un)return i.UNSIGNED_INT;if(n===on)return i.FLOAT;if(n===yn)return i.HALF_FLOAT;if(n===vl)return i.ALPHA;if(n===Ml)return i.RGB;if(n===Qt)return i.RGBA;if(n===En)return i.DEPTH_COMPONENT;if(n===$n)return i.DEPTH_STENCIL;if(n===Sl)return i.RED;if(n===Ma)return i.RED_INTEGER;if(n===Jn)return i.RG;if(n===Sa)return i.RG_INTEGER;if(n===ba)return i.RGBA_INTEGER;if(n===_r||n===xr||n===vr||n===Mr)if(a===Je)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===_r)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===_r)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Us||n===Ns||n===Fs||n===Os)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Us)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ns)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fs)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Os)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Bs||n===zs||n===ks||n===Gs||n===Vs||n===br||n===Hs)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Bs||n===zs)return a===Je?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ks)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Gs)return s.COMPRESSED_R11_EAC;if(n===Vs)return s.COMPRESSED_SIGNED_R11_EAC;if(n===br)return s.COMPRESSED_RG11_EAC;if(n===Hs)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ws||n===Xs||n===qs||n===Ys||n===Ks||n===$s||n===Zs||n===Js||n===Qs||n===js||n===ea||n===ta||n===na||n===ia)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ws)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Xs)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qs)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ys)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ks)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$s)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zs)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Js)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qs)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===js)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ea)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ta)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===na)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ia)return a===Je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ra||n===sa||n===aa)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===ra)return a===Je?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===sa)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===aa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===oa||n===la||n===yr||n===ca)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===oa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===la)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ca)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const um=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hm=`
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

}`;class fm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Pl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new hn({vertexShader:um,fragmentShader:hm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new jt(new Vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class pm extends Qn{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,p=null,d=null,f=null,x=null;const S=typeof XRWebGLBinding<"u",g=new fm,u={},y=t.getContextAttributes();let A=null,M=null;const w=[],b=[],C=new Pe;let _=null;const E=new kt;E.viewport=new ct;const D=new kt;D.viewport=new ct;const P=[E,D],R=new Sd;let q=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ce=w[J];return ce===void 0&&(ce=new Zr,w[J]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(J){let ce=w[J];return ce===void 0&&(ce=new Zr,w[J]=ce),ce.getGripSpace()},this.getHand=function(J){let ce=w[J];return ce===void 0&&(ce=new Zr,w[J]=ce),ce.getHandSpace()};function B(J){const ce=b.indexOf(J.inputSource);if(ce===-1)return;const se=w[ce];se!==void 0&&(se.update(J.inputSource,J.frame,c||a),se.dispatchEvent({type:J.type,data:J.inputSource}))}function W(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",X);for(let J=0;J<w.length;J++){const ce=b[J];ce!==null&&(b[J]=null,w[J].disconnect(ce))}q=null,K=null,g.reset();for(const J in u)delete u[J];e.setRenderTarget(A),f=null,d=null,p=null,r=null,M=null,Le.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return p===null&&S&&(p=new XRWebGLBinding(r,t)),p},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(A=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",W),r.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let se=null,we=null,De=null;y.depth&&(De=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=y.stencil?$n:En,we=y.stencil?zi:un);const Ae={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:s};p=this.getBinding(),d=p.createProjectionLayer(Ae),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new dn(d.textureWidth,d.textureHeight,{format:Qt,type:Gt,depthTexture:new Si(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const se={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,se),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new dn(f.framebufferWidth,f.framebufferHeight,{format:Qt,type:Gt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Le.setContext(r),Le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(J){for(let ce=0;ce<J.removed.length;ce++){const se=J.removed[ce],we=b.indexOf(se);we>=0&&(b[we]=null,w[we].disconnect(se))}for(let ce=0;ce<J.added.length;ce++){const se=J.added[ce];let we=b.indexOf(se);if(we===-1){for(let Ae=0;Ae<w.length;Ae++)if(Ae>=b.length){b.push(se),we=Ae;break}else if(b[Ae]===null){b[Ae]=se,we=Ae;break}if(we===-1)break}const De=w[we];De&&De.connect(se)}}const ne=new N,re=new N;function le(J,ce,se){ne.setFromMatrixPosition(ce.matrixWorld),re.setFromMatrixPosition(se.matrixWorld);const we=ne.distanceTo(re),De=ce.projectionMatrix.elements,Ae=se.projectionMatrix.elements,at=De[14]/(De[10]-1),Fe=De[14]/(De[10]+1),Ye=(De[9]+1)/De[5],ze=(De[9]-1)/De[5],ke=(De[8]-1)/De[0],Qe=(Ae[8]+1)/Ae[0],$e=at*ke,ht=at*Qe,ft=we/(-ke+Qe),rt=ft*-ke;if(ce.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(rt),J.translateZ(ft),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),De[10]===-1)J.projectionMatrix.copy(ce.projectionMatrix),J.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const lt=at+ft,U=Fe+ft,wt=$e-rt,Ke=ht+(we-rt),T=Ye*Fe/U*lt,m=ze*Fe/U*lt;J.projectionMatrix.makePerspective(wt,Ke,T,m,lt,U),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function pe(J,ce){ce===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ce.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let ce=J.near,se=J.far;g.texture!==null&&(g.depthNear>0&&(ce=g.depthNear),g.depthFar>0&&(se=g.depthFar)),R.near=D.near=E.near=ce,R.far=D.far=E.far=se,(q!==R.near||K!==R.far)&&(r.updateRenderState({depthNear:R.near,depthFar:R.far}),q=R.near,K=R.far),R.layers.mask=J.layers.mask|6,E.layers.mask=R.layers.mask&-5,D.layers.mask=R.layers.mask&-3;const we=J.parent,De=R.cameras;pe(R,we);for(let Ae=0;Ae<De.length;Ae++)pe(De[Ae],we);De.length===2?le(R,E,D):R.projectionMatrix.copy(E.projectionMatrix),Se(J,R,we)};function Se(J,ce,se){se===null?J.matrix.copy(ce.matrixWorld):(J.matrix.copy(se.matrixWorld),J.matrix.invert(),J.matrix.multiply(ce.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ce.projectionMatrix),J.projectionMatrixInverse.copy(ce.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=ua*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(R)},this.getCameraTexture=function(J){return u[J]};let We=null;function st(J,ce){if(h=ce.getViewerPose(c||a),x=ce,h!==null){const se=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let we=!1;se.length!==R.cameras.length&&(R.cameras.length=0,we=!0);for(let Fe=0;Fe<se.length;Fe++){const Ye=se[Fe];let ze=null;if(f!==null)ze=f.getViewport(Ye);else{const Qe=p.getViewSubImage(d,Ye);ze=Qe.viewport,Fe===0&&(e.setRenderTargetTextures(M,Qe.colorTexture,Qe.depthStencilTexture),e.setRenderTarget(M))}let ke=P[Fe];ke===void 0&&(ke=new kt,ke.layers.enable(Fe),ke.viewport=new ct,P[Fe]=ke),ke.matrix.fromArray(Ye.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Ye.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(ze.x,ze.y,ze.width,ze.height),Fe===0&&(R.matrix.copy(ke.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),we===!0&&R.cameras.push(ke)}const De=r.enabledFeatures;if(De&&De.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){p=n.getBinding();const Fe=p.getDepthInformation(se[0]);Fe&&Fe.isValid&&Fe.texture&&g.init(Fe,r.renderState)}if(De&&De.includes("camera-access")&&S){e.state.unbindTexture(),p=n.getBinding();for(let Fe=0;Fe<se.length;Fe++){const Ye=se[Fe].camera;if(Ye){let ze=u[Ye];ze||(ze=new Pl,u[Ye]=ze);const ke=p.getCameraImage(Ye);ze.sourceTexture=ke}}}}for(let se=0;se<w.length;se++){const we=b[se],De=w[se];we!==null&&De!==void 0&&De.update(we,ce,c||a)}We&&We(J,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),x=null}const Le=new Nl;Le.setAnimationLoop(st),this.setAnimationLoop=function(J){We=J},this.dispose=function(){}}}const mm=new ot,Vl=new Ie;Vl.set(-1,0,0,0,1,0,0,0,1);function gm(i,e){function t(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function n(g,u){u.color.getRGB(g.fogColor.value,Dl(i)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function r(g,u,y,A,M){u.isNodeMaterial?u.uniformsNeedUpdate=!1:u.isMeshBasicMaterial?s(g,u):u.isMeshLambertMaterial?(s(g,u),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)):u.isMeshToonMaterial?(s(g,u),p(g,u)):u.isMeshPhongMaterial?(s(g,u),h(g,u),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)):u.isMeshStandardMaterial?(s(g,u),d(g,u),u.isMeshPhysicalMaterial&&f(g,u,M)):u.isMeshMatcapMaterial?(s(g,u),x(g,u)):u.isMeshDepthMaterial?s(g,u):u.isMeshDistanceMaterial?(s(g,u),S(g,u)):u.isMeshNormalMaterial?s(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?l(g,u,y,A):u.isSpriteMaterial?c(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,t(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===Ft&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,t(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===Ft&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,t(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,t(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const y=e.get(u),A=y.envMap,M=y.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(mm.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Vl),g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function l(g,u,y,A){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*y,g.scale.value=A*.5,u.map&&(g.map.value=u.map,t(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function c(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,t(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,t(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function p(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function d(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function f(g,u,y){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ft&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function S(g,u){const y=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function _m(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){const b=w.program;n.uniformBlockBinding(M,b)}function c(M,w){let b=r[M.id];b===void 0&&(g(M),b=h(M),r[M.id]=b,M.addEventListener("dispose",y));const C=w.program;n.updateUBOMapping(M,C);const _=e.render.frame;s[M.id]!==_&&(d(M),s[M.id]=_)}function h(M){const w=p();M.__bindingPointIndex=w;const b=i.createBuffer(),C=M.__size,_=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,b),b}function p(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return He("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const w=r[M.id],b=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let _=0,E=b.length;_<E;_++){const D=b[_];if(Array.isArray(D))for(let P=0,R=D.length;P<R;P++)f(D[P],_,P,C);else f(D,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,w,b,C){if(S(M,w,b,C)===!0){const _=M.__offset,E=M.value;if(Array.isArray(E)){let D=0;for(let P=0;P<E.length;P++){const R=E[P],q=u(R);x(R,M.__data,D),typeof R!="number"&&typeof R!="boolean"&&!R.isMatrix3&&!ArrayBuffer.isView(R)&&(D+=q.storage/Float32Array.BYTES_PER_ELEMENT)}}else x(E,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,M.__data)}}function x(M,w,b){typeof M=="number"||typeof M=="boolean"?w[0]=M:M.isMatrix3?(w[0]=M.elements[0],w[1]=M.elements[1],w[2]=M.elements[2],w[3]=0,w[4]=M.elements[3],w[5]=M.elements[4],w[6]=M.elements[5],w[7]=0,w[8]=M.elements[6],w[9]=M.elements[7],w[10]=M.elements[8],w[11]=0):ArrayBuffer.isView(M)?w.set(new M.constructor(M.buffer,M.byteOffset,w.length)):M.toArray(w,b)}function S(M,w,b,C){const _=M.value,E=w+"_"+b;if(C[E]===void 0)return typeof _=="number"||typeof _=="boolean"?C[E]=_:ArrayBuffer.isView(_)?C[E]=_.slice():C[E]=_.clone(),!0;{const D=C[E];if(typeof _=="number"||typeof _=="boolean"){if(D!==_)return C[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(D.equals(_)===!1)return D.copy(_),!0}}return!1}function g(M){const w=M.uniforms;let b=0;const C=16;for(let E=0,D=w.length;E<D;E++){const P=Array.isArray(w[E])?w[E]:[w[E]];for(let R=0,q=P.length;R<q;R++){const K=P[R],B=Array.isArray(K.value)?K.value:[K.value];for(let W=0,X=B.length;W<X;W++){const ne=B[W],re=u(ne),le=b%C,pe=le%re.boundary,Se=le+pe;b+=pe,Se!==0&&C-Se<re.storage&&(b+=C-Se),K.__data=new Float32Array(re.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=b,b+=re.storage}}}const _=b%C;return _>0&&(b+=C-_),M.__size=b,M.__cache={},this}function u(M){const w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(w.boundary=16,w.storage=M.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",M),w}function y(M){const w=M.target;w.removeEventListener("dispose",y);const b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function A(){for(const M in r)i.deleteBuffer(r[M]);a=[],r={},s={}}return{bind:l,update:c,dispose:A}}const xm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let sn=null;function vm(){return sn===null&&(sn=new id(xm,16,16,Jn,yn),sn.name="DFG_LUT",sn.minFilter=Dt,sn.magFilter=Dt,sn.wrapS=Mn,sn.wrapT=Mn,sn.generateMipmaps=!1,sn.needsUpdate=!0),sn}class Mm{constructor(e={}){const{canvas:t=Uc(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Gt}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;const S=f,g=new Set([ba,Sa,Ma]),u=new Set([Gt,un,Bi,zi,xa,va]),y=new Uint32Array(4),A=new Int32Array(4),M=new N;let w=null,b=null;const C=[],_=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=cn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let P=!1,R=null,q=null,K=null,B=null;this._outputColorSpace=Xt;let W=0,X=0,ne=null,re=-1,le=null;const pe=new ct,Se=new ct;let We=null;const st=new Be(0);let Le=0,J=t.width,ce=t.height,se=1,we=null,De=null;const Ae=new ct(0,0,J,ce),at=new ct(0,0,J,ce);let Fe=!1;const Ye=new Ca;let ze=!1,ke=!1;const Qe=new ot,$e=new N,ht=new ct,ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let rt=!1;function lt(){return ne===null?se:1}let U=n;function wt(v,F){return t.getContext(v,F)}try{const v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ga}`),t.addEventListener("webglcontextlost",et,!1),t.addEventListener("webglcontextrestored",Ze,!1),t.addEventListener("webglcontextcreationerror",en,!1),U===null){const F="webgl2";if(U=wt(F,v),U===null)throw wt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(v){throw He("WebGLRenderer: "+v.message),v}let Ke,T,m,O,G,Y,oe,he,$,j,L,z,Z,te,de,be,Re,I,ue,Q,fe,ie,ee;function _e(){Ke=new vf(U),Ke.init(),fe=new dm(U,Ke),T=new uf(U,Ke,e,fe),m=new lm(U,Ke),T.reversedDepthBuffer&&d&&m.buffers.depth.setReversed(!0),q=U.createFramebuffer(),K=U.createFramebuffer(),B=U.createFramebuffer(),O=new bf(U),G=new Kp,Y=new cm(U,Ke,m,G,T,fe,O),oe=new xf(D),he=new Td(U),ie=new cf(U,he),$=new Mf(U,he,O,ie),j=new Ef(U,$,he,ie,O),I=new yf(U,T,Y),de=new hf(G),L=new Yp(D,oe,Ke,T,ie,de),z=new gm(D,G),Z=new Zp,te=new nm(Ke),Re=new lf(D,oe,m,j,x,l),be=new om(D,j,T),ee=new _m(U,O,T,m),ue=new df(U,Ke,O),Q=new Sf(U,Ke,O),O.programs=L.programs,D.capabilities=T,D.extensions=Ke,D.properties=G,D.renderLists=Z,D.shadowMap=be,D.state=m,D.info=O}_e(),S!==Gt&&(E=new Af(S,t.width,t.height,o,r,s));const ae=new pm(D,U);this.xr=ae,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const v=Ke.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ke.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(v){v!==void 0&&(se=v,this.setSize(J,ce,!1))},this.getSize=function(v){return v.set(J,ce)},this.setSize=function(v,F,H=!0){if(ae.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}J=v,ce=F,t.width=Math.floor(v*se),t.height=Math.floor(F*se),H===!0&&(t.style.width=v+"px",t.style.height=F+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,v,F)},this.getDrawingBufferSize=function(v){return v.set(J*se,ce*se).floor()},this.setDrawingBufferSize=function(v,F,H){J=v,ce=F,se=H,t.width=Math.floor(v*H),t.height=Math.floor(F*H),this.setViewport(0,0,v,F)},this.setEffects=function(v){if(S===Gt){He("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let F=0;F<v.length;F++)if(v[F].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(pe)},this.getViewport=function(v){return v.copy(Ae)},this.setViewport=function(v,F,H,k){v.isVector4?Ae.set(v.x,v.y,v.z,v.w):Ae.set(v,F,H,k),m.viewport(pe.copy(Ae).multiplyScalar(se).round())},this.getScissor=function(v){return v.copy(at)},this.setScissor=function(v,F,H,k){v.isVector4?at.set(v.x,v.y,v.z,v.w):at.set(v,F,H,k),m.scissor(Se.copy(at).multiplyScalar(se).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(v){m.setScissorTest(Fe=v)},this.setOpaqueSort=function(v){we=v},this.setTransparentSort=function(v){De=v},this.getClearColor=function(v){return v.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(v=!0,F=!0,H=!0){let k=0;if(v){let V=!1;if(ne!==null){const xe=ne.texture.format;V=g.has(xe)}if(V){const xe=ne.texture.type,Me=u.has(xe),ge=Re.getClearColor(),ye=Re.getClearAlpha(),Ee=ge.r,Ue=ge.g,Oe=ge.b;Me?(y[0]=Ee,y[1]=Ue,y[2]=Oe,y[3]=ye,U.clearBufferuiv(U.COLOR,0,y)):(A[0]=Ee,A[1]=Ue,A[2]=Oe,A[3]=ye,U.clearBufferiv(U.COLOR,0,A))}else k|=U.COLOR_BUFFER_BIT}F&&(k|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),H&&(k|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&U.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),R=v},this.dispose=function(){t.removeEventListener("webglcontextlost",et,!1),t.removeEventListener("webglcontextrestored",Ze,!1),t.removeEventListener("webglcontextcreationerror",en,!1),Re.dispose(),Z.dispose(),te.dispose(),G.dispose(),oe.dispose(),j.dispose(),ie.dispose(),ee.dispose(),L.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Ga),ae.removeEventListener("sessionend",Va),kn.stop()};function et(v){v.preventDefault(),io("WebGLRenderer: Context Lost."),P=!0}function Ze(){io("WebGLRenderer: Context Restored."),P=!1;const v=O.autoReset,F=be.enabled,H=be.autoUpdate,k=be.needsUpdate,V=be.type;_e(),O.autoReset=v,be.enabled=F,be.autoUpdate=H,be.needsUpdate=k,be.type=V}function en(v){He("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function tn(v){const F=v.target;F.removeEventListener("dispose",tn),Kl(F)}function Kl(v){$l(v),G.remove(v)}function $l(v){const F=G.get(v).programs;F!==void 0&&(F.forEach(function(H){L.releaseProgram(H)}),v.isShaderMaterial&&L.releaseShaderCache(v))}this.renderBufferDirect=function(v,F,H,k,V,xe){F===null&&(F=ft);const Me=V.isMesh&&V.matrixWorld.determinantAffine()<0,ge=Ql(v,F,H,k,V);m.setMaterial(k,Me);let ye=H.index,Ee=1;if(k.wireframe===!0){if(ye=$.getWireframeAttribute(H),ye===void 0)return;Ee=2}const Ue=H.drawRange,Oe=H.attributes.position;let Te=Ue.start*Ee,je=(Ue.start+Ue.count)*Ee;xe!==null&&(Te=Math.max(Te,xe.start*Ee),je=Math.min(je,(xe.start+xe.count)*Ee)),ye!==null?(Te=Math.max(Te,0),je=Math.min(je,ye.count)):Oe!=null&&(Te=Math.max(Te,0),je=Math.min(je,Oe.count));const pt=je-Te;if(pt<0||pt===1/0)return;ie.setup(V,k,ge,H,ye);let dt,tt=ue;if(ye!==null&&(dt=he.get(ye),tt=Q,tt.setIndex(dt)),V.isMesh)k.wireframe===!0?(m.setLineWidth(k.wireframeLinewidth*lt()),tt.setMode(U.LINES)):tt.setMode(U.TRIANGLES);else if(V.isLine){let Rt=k.linewidth;Rt===void 0&&(Rt=1),m.setLineWidth(Rt*lt()),V.isLineSegments?tt.setMode(U.LINES):V.isLineLoop?tt.setMode(U.LINE_LOOP):tt.setMode(U.LINE_STRIP)}else V.isPoints?tt.setMode(U.POINTS):V.isSprite&&tt.setMode(U.TRIANGLES);if(V.isBatchedMesh)if(Ke.get("WEBGL_multi_draw"))tt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Rt=V._multiDrawStarts,ve=V._multiDrawCounts,Ot=V._multiDrawCount,Xe=ye?he.get(ye).bytesPerElement:1,Ht=G.get(k).currentProgram.getUniforms();for(let nn=0;nn<Ot;nn++)Ht.setValue(U,"_gl_DrawID",nn),tt.render(Rt[nn]/Xe,ve[nn])}else if(V.isInstancedMesh)tt.renderInstances(Te,pt,V.count);else if(H.isInstancedBufferGeometry){const Rt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,ve=Math.min(H.instanceCount,Rt);tt.renderInstances(Te,pt,ve)}else tt.render(Te,pt)};function ka(v,F,H){v.transparent===!0&&v.side===vn&&v.forceSinglePass===!1?(v.side=Ft,v.needsUpdate=!0,Wi(v,F,H),v.side=On,v.needsUpdate=!0,Wi(v,F,H),v.side=vn):Wi(v,F,H)}this.compile=function(v,F,H=null){H===null&&(H=v),b=te.get(H),b.init(F),_.push(b),H.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),v!==H&&v.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights();const k=new Set;return v.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const xe=V.material;if(xe)if(Array.isArray(xe))for(let Me=0;Me<xe.length;Me++){const ge=xe[Me];ka(ge,H,V),k.add(ge)}else ka(xe,H,V),k.add(xe)}),b=_.pop(),k},this.compileAsync=function(v,F,H=null){const k=this.compile(v,F,H);return new Promise(V=>{function xe(){if(k.forEach(function(Me){G.get(Me).currentProgram.isReady()&&k.delete(Me)}),k.size===0){V(v);return}setTimeout(xe,10)}Ke.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let Br=null;function Zl(v){Br&&Br(v)}function Ga(){kn.stop()}function Va(){kn.start()}const kn=new Nl;kn.setAnimationLoop(Zl),typeof self<"u"&&kn.setContext(self),this.setAnimationLoop=function(v){Br=v,ae.setAnimationLoop(v),v===null?kn.stop():kn.start()},ae.addEventListener("sessionstart",Ga),ae.addEventListener("sessionend",Va),this.render=function(v,F){if(F!==void 0&&F.isCamera!==!0){He("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;R!==null&&R.renderStart(v,F);const H=ae.enabled===!0&&ae.isPresenting===!0,k=E!==null&&(ne===null||H)&&E.begin(D,ne);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(F),F=ae.getCamera()),v.isScene===!0&&v.onBeforeRender(D,v,F,ne),b=te.get(v,_.length),b.init(F),b.state.textureUnits=Y.getTextureUnits(),_.push(b),Qe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ye.setFromProjectionMatrix(Qe,ln,F.reversedDepth),ke=this.localClippingEnabled,ze=de.init(this.clippingPlanes,ke),w=Z.get(v,C.length),w.init(),C.push(w),ae.enabled===!0&&ae.isPresenting===!0){const Me=D.xr.getDepthSensingMesh();Me!==null&&zr(Me,F,-1/0,D.sortObjects)}zr(v,F,0,D.sortObjects),w.finish(),D.sortObjects===!0&&w.sort(we,De,F.reversedDepth),rt=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,rt&&Re.addToRenderList(w,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ze===!0&&de.beginShadows();const V=b.state.shadowsArray;if(be.render(V,v,F),ze===!0&&de.endShadows(),(k&&E.hasRenderPass())===!1){const Me=w.opaque,ge=w.transmissive;if(b.setupLights(),F.isArrayCamera){const ye=F.cameras;if(ge.length>0)for(let Ee=0,Ue=ye.length;Ee<Ue;Ee++){const Oe=ye[Ee];Wa(Me,ge,v,Oe)}rt&&Re.render(v);for(let Ee=0,Ue=ye.length;Ee<Ue;Ee++){const Oe=ye[Ee];Ha(w,v,Oe,Oe.viewport)}}else ge.length>0&&Wa(Me,ge,v,F),rt&&Re.render(v),Ha(w,v,F)}ne!==null&&X===0&&(Y.updateMultisampleRenderTarget(ne),Y.updateRenderTargetMipmap(ne)),k&&E.end(D),v.isScene===!0&&v.onAfterRender(D,v,F),ie.resetDefaultState(),re=-1,le=null,_.pop(),_.length>0?(b=_[_.length-1],Y.setTextureUnits(b.state.textureUnits),ze===!0&&de.setGlobalState(D.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?w=C[C.length-1]:w=null,R!==null&&R.renderEnd()};function zr(v,F,H,k){if(v.visible===!1)return;if(v.layers.test(F.layers)){if(v.isGroup)H=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(F);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Ye.intersectsSprite(v)){k&&ht.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Qe);const Me=j.update(v),ge=v.material;ge.visible&&w.push(v,Me,ge,H,ht.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Ye.intersectsObject(v))){const Me=j.update(v),ge=v.material;if(k&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ht.copy(v.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),ht.copy(Me.boundingSphere.center)),ht.applyMatrix4(v.matrixWorld).applyMatrix4(Qe)),Array.isArray(ge)){const ye=Me.groups;for(let Ee=0,Ue=ye.length;Ee<Ue;Ee++){const Oe=ye[Ee],Te=ge[Oe.materialIndex];Te&&Te.visible&&w.push(v,Me,Te,H,ht.z,Oe)}}else ge.visible&&w.push(v,Me,ge,H,ht.z,null)}}const xe=v.children;for(let Me=0,ge=xe.length;Me<ge;Me++)zr(xe[Me],F,H,k)}function Ha(v,F,H,k){const{opaque:V,transmissive:xe,transparent:Me}=v;b.setupLightsView(H),ze===!0&&de.setGlobalState(D.clippingPlanes,H),k&&m.viewport(pe.copy(k)),V.length>0&&Hi(V,F,H),xe.length>0&&Hi(xe,F,H),Me.length>0&&Hi(Me,F,H),m.buffers.depth.setTest(!0),m.buffers.depth.setMask(!0),m.buffers.color.setMask(!0),m.setPolygonOffset(!1)}function Wa(v,F,H,k){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[k.id]===void 0){const Te=Ke.has("EXT_color_buffer_half_float")||Ke.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[k.id]=new dn(1,1,{generateMipmaps:!0,type:Te?yn:Gt,minFilter:Kn,samples:Math.max(4,T.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace})}const xe=b.state.transmissionRenderTarget[k.id],Me=k.viewport||pe;xe.setSize(Me.z*D.transmissionResolutionScale,Me.w*D.transmissionResolutionScale);const ge=D.getRenderTarget(),ye=D.getActiveCubeFace(),Ee=D.getActiveMipmapLevel();D.setRenderTarget(xe),D.getClearColor(st),Le=D.getClearAlpha(),Le<1&&D.setClearColor(16777215,.5),D.clear(),rt&&Re.render(H);const Ue=D.toneMapping;D.toneMapping=cn;const Oe=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),b.setupLightsView(k),ze===!0&&de.setGlobalState(D.clippingPlanes,k),Hi(v,H,k),Y.updateMultisampleRenderTarget(xe),Y.updateRenderTargetMipmap(xe),Ke.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let je=0,pt=F.length;je<pt;je++){const dt=F[je],{object:tt,geometry:Rt,material:ve,group:Ot}=dt;if(ve.side===vn&&tt.layers.test(k.layers)){const Xe=ve.side;ve.side=Ft,ve.needsUpdate=!0,Xa(tt,H,k,Rt,ve,Ot),ve.side=Xe,ve.needsUpdate=!0,Te=!0}}Te===!0&&(Y.updateMultisampleRenderTarget(xe),Y.updateRenderTargetMipmap(xe))}D.setRenderTarget(ge,ye,Ee),D.setClearColor(st,Le),Oe!==void 0&&(k.viewport=Oe),D.toneMapping=Ue}function Hi(v,F,H){const k=F.isScene===!0?F.overrideMaterial:null;for(let V=0,xe=v.length;V<xe;V++){const Me=v[V],{object:ge,geometry:ye,group:Ee}=Me;let Ue=Me.material;Ue.allowOverride===!0&&k!==null&&(Ue=k),ge.layers.test(H.layers)&&Xa(ge,F,H,ye,Ue,Ee)}}function Xa(v,F,H,k,V,xe){v.onBeforeRender(D,F,H,k,V,xe),v.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),V.onBeforeRender(D,F,H,k,v,xe),V.transparent===!0&&V.side===vn&&V.forceSinglePass===!1?(V.side=Ft,V.needsUpdate=!0,D.renderBufferDirect(H,F,k,V,v,xe),V.side=On,V.needsUpdate=!0,D.renderBufferDirect(H,F,k,V,v,xe),V.side=vn):D.renderBufferDirect(H,F,k,V,v,xe),v.onAfterRender(D,F,H,k,V,xe)}function Wi(v,F,H){F.isScene!==!0&&(F=ft);const k=G.get(v),V=b.state.lights,xe=b.state.shadowsArray,Me=V.state.version,ge=L.getParameters(v,V.state,xe,F,H,b.state.lightProbeGridArray),ye=L.getProgramCacheKey(ge);let Ee=k.programs;k.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const Ue=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;k.envMap=oe.get(v.envMap||k.environment,Ue),k.envMapRotation=k.environment!==null&&v.envMap===null?F.environmentRotation:v.envMapRotation,Ee===void 0&&(v.addEventListener("dispose",tn),Ee=new Map,k.programs=Ee);let Oe=Ee.get(ye);if(Oe!==void 0){if(k.currentProgram===Oe&&k.lightsStateVersion===Me)return Ya(v,ge),Oe}else ge.uniforms=L.getUniforms(v),R!==null&&v.isNodeMaterial&&R.build(v,H,ge),v.onBeforeCompile(ge,D),Oe=L.acquireProgram(ge,ye),Ee.set(ye,Oe),k.uniforms=ge.uniforms;const Te=k.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Te.clippingPlanes=de.uniform),Ya(v,ge),k.needsLights=ec(v),k.lightsStateVersion=Me,k.needsLights&&(Te.ambientLightColor.value=V.state.ambient,Te.lightProbe.value=V.state.probe,Te.directionalLights.value=V.state.directional,Te.directionalLightShadows.value=V.state.directionalShadow,Te.spotLights.value=V.state.spot,Te.spotLightShadows.value=V.state.spotShadow,Te.rectAreaLights.value=V.state.rectArea,Te.ltc_1.value=V.state.rectAreaLTC1,Te.ltc_2.value=V.state.rectAreaLTC2,Te.pointLights.value=V.state.point,Te.pointLightShadows.value=V.state.pointShadow,Te.hemisphereLights.value=V.state.hemi,Te.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Te.spotLightMatrix.value=V.state.spotLightMatrix,Te.spotLightMap.value=V.state.spotLightMap,Te.pointShadowMatrix.value=V.state.pointShadowMatrix),k.lightProbeGrid=b.state.lightProbeGridArray.length>0,k.currentProgram=Oe,k.uniformsList=null,Oe}function qa(v){if(v.uniformsList===null){const F=v.currentProgram.getUniforms();v.uniformsList=Sr.seqWithValue(F.seq,v.uniforms)}return v.uniformsList}function Ya(v,F){const H=G.get(v);H.outputColorSpace=F.outputColorSpace,H.batching=F.batching,H.batchingColor=F.batchingColor,H.instancing=F.instancing,H.instancingColor=F.instancingColor,H.instancingMorph=F.instancingMorph,H.skinning=F.skinning,H.morphTargets=F.morphTargets,H.morphNormals=F.morphNormals,H.morphColors=F.morphColors,H.morphTargetsCount=F.morphTargetsCount,H.numClippingPlanes=F.numClippingPlanes,H.numIntersection=F.numClipIntersection,H.vertexAlphas=F.vertexAlphas,H.vertexTangents=F.vertexTangents,H.toneMapping=F.toneMapping}function Jl(v,F){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;M.setFromMatrixPosition(F.matrixWorld);for(let H=0,k=v.length;H<k;H++){const V=v[H];if(V.texture!==null&&V.boundingBox.containsPoint(M))return V}return null}function Ql(v,F,H,k,V){F.isScene!==!0&&(F=ft),Y.resetTextureUnits();const xe=F.fog,Me=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,ge=ne===null?D.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Ge.workingColorSpace,ye=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ee=oe.get(k.envMap||Me,ye),Ue=k.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Oe=!!H.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Te=!!H.morphAttributes.position,je=!!H.morphAttributes.normal,pt=!!H.morphAttributes.color;let dt=cn;k.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(dt=D.toneMapping);const tt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Rt=tt!==void 0?tt.length:0,ve=G.get(k),Ot=b.state.lights;if(ze===!0&&(ke===!0||v!==le)){const it=v===le&&k.id===re;de.setState(k,v,it)}let Xe=!1;k.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==Ot.state.version||ve.outputColorSpace!==ge||V.isBatchedMesh&&ve.batching===!1||!V.isBatchedMesh&&ve.batching===!0||V.isBatchedMesh&&ve.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&ve.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&ve.instancing===!1||!V.isInstancedMesh&&ve.instancing===!0||V.isSkinnedMesh&&ve.skinning===!1||!V.isSkinnedMesh&&ve.skinning===!0||V.isInstancedMesh&&ve.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ve.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ve.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ve.instancingMorph===!1&&V.morphTexture!==null||ve.envMap!==Ee||k.fog===!0&&ve.fog!==xe||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==de.numPlanes||ve.numIntersection!==de.numIntersection)||ve.vertexAlphas!==Ue||ve.vertexTangents!==Oe||ve.morphTargets!==Te||ve.morphNormals!==je||ve.morphColors!==pt||ve.toneMapping!==dt||ve.morphTargetsCount!==Rt||!!ve.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Xe=!0):(Xe=!0,ve.__version=k.version);let Ht=ve.currentProgram;Xe===!0&&(Ht=Wi(k,F,V),R&&k.isNodeMaterial&&R.onUpdateProgram(k,Ht,ve));let nn=!1,Tn=!1,jn=!1;const nt=Ht.getUniforms(),mt=ve.uniforms;if(m.useProgram(Ht.program)&&(nn=!0,Tn=!0,jn=!0),k.id!==re&&(re=k.id,Tn=!0),ve.needsLights){const it=Jl(b.state.lightProbeGridArray,V);ve.lightProbeGrid!==it&&(ve.lightProbeGrid=it,Tn=!0)}if(nn||le!==v){m.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),nt.setValue(U,"projectionMatrix",v.projectionMatrix),nt.setValue(U,"viewMatrix",v.matrixWorldInverse);const wn=nt.map.cameraPosition;wn!==void 0&&wn.setValue(U,$e.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&nt.setValue(U,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&nt.setValue(U,"isOrthographic",v.isOrthographicCamera===!0),le!==v&&(le=v,Tn=!0,jn=!0)}if(ve.needsLights&&(Ot.state.directionalShadowMap.length>0&&nt.setValue(U,"directionalShadowMap",Ot.state.directionalShadowMap,Y),Ot.state.spotShadowMap.length>0&&nt.setValue(U,"spotShadowMap",Ot.state.spotShadowMap,Y),Ot.state.pointShadowMap.length>0&&nt.setValue(U,"pointShadowMap",Ot.state.pointShadowMap,Y)),V.isSkinnedMesh){nt.setOptional(U,V,"bindMatrix"),nt.setOptional(U,V,"bindMatrixInverse");const it=V.skeleton;it&&(it.boneTexture===null&&it.computeBoneTexture(),nt.setValue(U,"boneTexture",it.boneTexture,Y))}V.isBatchedMesh&&(nt.setOptional(U,V,"batchingTexture"),nt.setValue(U,"batchingTexture",V._matricesTexture,Y),nt.setOptional(U,V,"batchingIdTexture"),nt.setValue(U,"batchingIdTexture",V._indirectTexture,Y),nt.setOptional(U,V,"batchingColorTexture"),V._colorsTexture!==null&&nt.setValue(U,"batchingColorTexture",V._colorsTexture,Y));const An=H.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&I.update(V,H,Ht),(Tn||ve.receiveShadow!==V.receiveShadow)&&(ve.receiveShadow=V.receiveShadow,nt.setValue(U,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(mt.envMapIntensity.value=F.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=vm()),Tn){if(nt.setValue(U,"toneMappingExposure",D.toneMappingExposure),ve.needsLights&&jl(mt,jn),xe&&k.fog===!0&&z.refreshFogUniforms(mt,xe),z.refreshMaterialUniforms(mt,k,se,ce,b.state.transmissionRenderTarget[v.id]),ve.needsLights&&ve.lightProbeGrid){const it=ve.lightProbeGrid;mt.probesSH.value=it.texture,mt.probesMin.value.copy(it.boundingBox.min),mt.probesMax.value.copy(it.boundingBox.max),mt.probesResolution.value.copy(it.resolution)}Sr.upload(U,qa(ve),mt,Y)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Sr.upload(U,qa(ve),mt,Y),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&nt.setValue(U,"center",V.center),nt.setValue(U,"modelViewMatrix",V.modelViewMatrix),nt.setValue(U,"normalMatrix",V.normalMatrix),nt.setValue(U,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){const it=k.uniformsGroups;for(let wn=0,ei=it.length;wn<ei;wn++){const Ka=it[wn];ee.update(Ka,Ht),ee.bind(Ka,Ht)}}return Ht}function jl(v,F){v.ambientLightColor.needsUpdate=F,v.lightProbe.needsUpdate=F,v.directionalLights.needsUpdate=F,v.directionalLightShadows.needsUpdate=F,v.pointLights.needsUpdate=F,v.pointLightShadows.needsUpdate=F,v.spotLights.needsUpdate=F,v.spotLightShadows.needsUpdate=F,v.rectAreaLights.needsUpdate=F,v.hemisphereLights.needsUpdate=F}function ec(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(v,F,H){const k=G.get(v);k.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),G.get(v.texture).__webglTexture=F,G.get(v.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:H,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,F){const H=G.get(v);H.__webglFramebuffer=F,H.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(v,F=0,H=0){ne=v,W=F,X=H;let k=null,V=!1,xe=!1;if(v){const ge=G.get(v);if(ge.__useDefaultFramebuffer!==void 0){m.bindFramebuffer(U.FRAMEBUFFER,ge.__webglFramebuffer),pe.copy(v.viewport),Se.copy(v.scissor),We=v.scissorTest,m.viewport(pe),m.scissor(Se),m.setScissorTest(We),re=-1;return}else if(ge.__webglFramebuffer===void 0)Y.setupRenderTarget(v);else if(ge.__hasExternalTextures)Y.rebindTextures(v,G.get(v.texture).__webglTexture,G.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Ue=v.depthTexture;if(ge.__boundDepthTexture!==Ue){if(Ue!==null&&G.has(Ue)&&(v.width!==Ue.image.width||v.height!==Ue.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(v)}}const ye=v.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(xe=!0);const Ee=G.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ee[F])?k=Ee[F][H]:k=Ee[F],V=!0):v.samples>0&&Y.useMultisampledRTT(v)===!1?k=G.get(v).__webglMultisampledFramebuffer:Array.isArray(Ee)?k=Ee[H]:k=Ee,pe.copy(v.viewport),Se.copy(v.scissor),We=v.scissorTest}else pe.copy(Ae).multiplyScalar(se).floor(),Se.copy(at).multiplyScalar(se).floor(),We=Fe;if(H!==0&&(k=q),m.bindFramebuffer(U.FRAMEBUFFER,k)&&m.drawBuffers(v,k),m.viewport(pe),m.scissor(Se),m.setScissorTest(We),V){const ge=G.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,ge.__webglTexture,H)}else if(xe){const ge=F;for(let ye=0;ye<v.textures.length;ye++){const Ee=G.get(v.textures[ye]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+ye,Ee.__webglTexture,H,ge)}}else if(v!==null&&H!==0){const ge=G.get(v.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ge.__webglTexture,H)}re=-1},this.readRenderTargetPixels=function(v,F,H,k,V,xe,Me,ge=0){if(!(v&&v.isWebGLRenderTarget)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=G.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye){m.bindFramebuffer(U.FRAMEBUFFER,ye);try{const Ee=v.textures[ge],Ue=Ee.format,Oe=Ee.type;if(v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!T.textureFormatReadable(Ue)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!T.textureTypeReadable(Oe)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=v.width-k&&H>=0&&H<=v.height-V&&U.readPixels(F,H,k,V,fe.convert(Ue),fe.convert(Oe),xe)}finally{const Ee=ne!==null?G.get(ne).__webglFramebuffer:null;m.bindFramebuffer(U.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(v,F,H,k,V,xe,Me,ge=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=G.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye)if(F>=0&&F<=v.width-k&&H>=0&&H<=v.height-V){m.bindFramebuffer(U.FRAMEBUFFER,ye);const Ee=v.textures[ge],Ue=Ee.format,Oe=Ee.type;if(v.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!T.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!T.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Te),U.bufferData(U.PIXEL_PACK_BUFFER,xe.byteLength,U.STREAM_READ),U.readPixels(F,H,k,V,fe.convert(Ue),fe.convert(Oe),0);const je=ne!==null?G.get(ne).__webglFramebuffer:null;m.bindFramebuffer(U.FRAMEBUFFER,je);const pt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Nc(U,pt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Te),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,xe),U.deleteBuffer(Te),U.deleteSync(pt),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,F=null,H=0){const k=Math.pow(2,-H),V=Math.floor(v.image.width*k),xe=Math.floor(v.image.height*k),Me=F!==null?F.x:0,ge=F!==null?F.y:0;Y.setTexture2D(v,0),U.copyTexSubImage2D(U.TEXTURE_2D,H,0,0,Me,ge,V,xe),m.unbindTexture()},this.copyTextureToTexture=function(v,F,H=null,k=null,V=0,xe=0){let Me,ge,ye,Ee,Ue,Oe,Te,je,pt;const dt=v.isCompressedTexture?v.mipmaps[xe]:v.image;if(H!==null)Me=H.max.x-H.min.x,ge=H.max.y-H.min.y,ye=H.isBox3?H.max.z-H.min.z:1,Ee=H.min.x,Ue=H.min.y,Oe=H.isBox3?H.min.z:0;else{const mt=Math.pow(2,-V);Me=Math.floor(dt.width*mt),ge=Math.floor(dt.height*mt),v.isDataArrayTexture?ye=dt.depth:v.isData3DTexture?ye=Math.floor(dt.depth*mt):ye=1,Ee=0,Ue=0,Oe=0}k!==null?(Te=k.x,je=k.y,pt=k.z):(Te=0,je=0,pt=0);const tt=fe.convert(F.format),Rt=fe.convert(F.type);let ve;F.isData3DTexture?(Y.setTexture3D(F,0),ve=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Y.setTexture2DArray(F,0),ve=U.TEXTURE_2D_ARRAY):(Y.setTexture2D(F,0),ve=U.TEXTURE_2D),m.activeTexture(U.TEXTURE0),m.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),m.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),m.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const Ot=m.getParameter(U.UNPACK_ROW_LENGTH),Xe=m.getParameter(U.UNPACK_IMAGE_HEIGHT),Ht=m.getParameter(U.UNPACK_SKIP_PIXELS),nn=m.getParameter(U.UNPACK_SKIP_ROWS),Tn=m.getParameter(U.UNPACK_SKIP_IMAGES);m.pixelStorei(U.UNPACK_ROW_LENGTH,dt.width),m.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dt.height),m.pixelStorei(U.UNPACK_SKIP_PIXELS,Ee),m.pixelStorei(U.UNPACK_SKIP_ROWS,Ue),m.pixelStorei(U.UNPACK_SKIP_IMAGES,Oe);const jn=v.isDataArrayTexture||v.isData3DTexture,nt=F.isDataArrayTexture||F.isData3DTexture;if(v.isDepthTexture){const mt=G.get(v),An=G.get(F),it=G.get(mt.__renderTarget),wn=G.get(An.__renderTarget);m.bindFramebuffer(U.READ_FRAMEBUFFER,it.__webglFramebuffer),m.bindFramebuffer(U.DRAW_FRAMEBUFFER,wn.__webglFramebuffer);for(let ei=0;ei<ye;ei++)jn&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,G.get(v).__webglTexture,V,Oe+ei),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,G.get(F).__webglTexture,xe,pt+ei)),U.blitFramebuffer(Ee,Ue,Me,ge,Te,je,Me,ge,U.DEPTH_BUFFER_BIT,U.NEAREST);m.bindFramebuffer(U.READ_FRAMEBUFFER,null),m.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(V!==0||v.isRenderTargetTexture||G.has(v)){const mt=G.get(v),An=G.get(F);m.bindFramebuffer(U.READ_FRAMEBUFFER,K),m.bindFramebuffer(U.DRAW_FRAMEBUFFER,B);for(let it=0;it<ye;it++)jn?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.__webglTexture,V,Oe+it):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,mt.__webglTexture,V),nt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,An.__webglTexture,xe,pt+it):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,An.__webglTexture,xe),V!==0?U.blitFramebuffer(Ee,Ue,Me,ge,Te,je,Me,ge,U.COLOR_BUFFER_BIT,U.NEAREST):nt?U.copyTexSubImage3D(ve,xe,Te,je,pt+it,Ee,Ue,Me,ge):U.copyTexSubImage2D(ve,xe,Te,je,Ee,Ue,Me,ge);m.bindFramebuffer(U.READ_FRAMEBUFFER,null),m.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else nt?v.isDataTexture||v.isData3DTexture?U.texSubImage3D(ve,xe,Te,je,pt,Me,ge,ye,tt,Rt,dt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(ve,xe,Te,je,pt,Me,ge,ye,tt,dt.data):U.texSubImage3D(ve,xe,Te,je,pt,Me,ge,ye,tt,Rt,dt):v.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,xe,Te,je,Me,ge,tt,Rt,dt.data):v.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,xe,Te,je,dt.width,dt.height,tt,dt.data):U.texSubImage2D(U.TEXTURE_2D,xe,Te,je,Me,ge,tt,Rt,dt);m.pixelStorei(U.UNPACK_ROW_LENGTH,Ot),m.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Xe),m.pixelStorei(U.UNPACK_SKIP_PIXELS,Ht),m.pixelStorei(U.UNPACK_SKIP_ROWS,nn),m.pixelStorei(U.UNPACK_SKIP_IMAGES,Tn),xe===0&&F.generateMipmaps&&U.generateMipmap(ve),m.unbindTexture()},this.initRenderTarget=function(v){G.get(v).__webglFramebuffer===void 0&&Y.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Y.setTextureCube(v,0):v.isData3DTexture?Y.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Y.setTexture2DArray(v,0):Y.setTexture2D(v,0),m.unbindTexture()},this.resetState=function(){W=0,X=0,ne=null,m.reset(),ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}class Sm{constructor(e=1/50,t=5){this.fixedDelta=e,this.maxSubSteps=t,this.accumulator=0}advance(e,t){this.accumulator+=e;let n=0;for(;this.accumulator>=this.fixedDelta&&n<this.maxSubSteps;)t(this.fixedDelta),this.accumulator-=this.fixedDelta,n++;this.accumulator>=this.fixedDelta&&(this.accumulator=this.accumulator%this.fixedDelta)}get alpha(){return this.accumulator/this.fixedDelta}reset(){this.accumulator=0}}class tl{constructor(){this.delta=0,this.rawDelta=0,this.elapsed=0,this.frame=0,this.scale=1,this.maxDelta=1/10,this.last=-1}tick(e){this.last<0&&(this.last=e),this.rawDelta=(e-this.last)/1e3,this.last=e,this.delta=Math.min(this.rawDelta,this.maxDelta)*this.scale,this.elapsed+=this.delta,this.frame++}reset(){this.last=-1,this.delta=0,this.rawDelta=0,this.elapsed=0,this.frame=0}}class bm{constructor(){this.listeners=new Map}on(e,t){let n=this.listeners.get(e);return n||(n=new Set,this.listeners.set(e,n)),n.add(t),()=>this.off(e,t)}once(e,t){const n=this.on(e,r=>{n(),t(r)});return n}off(e,t){var n;(n=this.listeners.get(e))==null||n.delete(t)}emit(e,t){const n=this.listeners.get(e);if(n)for(const r of[...n])r(t)}clear(){this.listeners.clear()}}class ym extends _t{constructor(e="GameObject"){super(),this.components=[],this.tags=new Set,this.events=new bm,this.world=null,this.destroyed=!1,this.name=e}addComponent(e){return e.owner=this,this.components.push(e),e.onAttach(),e}getComponent(e){return this.components.find(t=>t instanceof e)}requireComponent(e){const t=this.getComponent(e);if(!t)throw new Error(`${this.name} is missing required component ${e.name}`);return t}removeComponent(e){const t=this.components.indexOf(e);t>=0&&(this.components.splice(t,1),e.onDetach())}update(e){for(const t of this.components)t.enabled&&t.update(e)}fixedUpdate(e){for(const t of this.components)t.enabled&&t.fixedUpdate(e)}destroy(){this.destroyed||(this.destroyed=!0,this.events.emit("destroyed",this))}dispose(){for(const e of this.components)e.onDetach();this.components.length=0,this.events.clear(),this.removeFromParent()}}class Em{constructor(){this.scene=new Jc,this.objects=[]}add(e){return e.world=this,this.objects.push(e),this.scene.add(e),e}spawn(e){return this.add(new ym(e))}findByName(e){return this.objects.find(t=>t.name===e)}findByTag(e){return this.objects.filter(t=>t.tags.has(e))}remove(e){const t=this.objects.indexOf(e);t>=0&&this.objects.splice(t,1),e.world=null,this.scene.remove(e)}fixedUpdate(e){for(const t of this.objects)t.destroyed||t.fixedUpdate(e)}update(e){for(const t of this.objects)t.destroyed||t.update(e);for(let t=this.objects.length-1;t>=0;t--){const n=this.objects[t];n.destroyed&&(this.objects.splice(t,1),n.world=null,n.dispose())}}clear(){for(const e of this.objects)e.dispose();this.objects.length=0}}class Tm{constructor(e){this.pointer=new Pe,this.pointerNdc=new Pe,this.pointerDelta=new Pe,this.wheelDelta=0,this.pointerDown=!1,this.leftStick=new Pe,this.rightStick=new Pe,this.gamepadConnected=!1,this.deadzone=.15,this.virtualAxis=new Pe,this.virtualDown=new Set,this.virtualPressed=new Set,this.gpDown=[],this.gpPressed=[],this.down=new Set,this.pressed=new Set,this.released=new Set,this.listeners=[],this.target=e,this.listen(window,"keydown",t=>{const n=t.code;this.down.has(n)||this.pressed.add(n),this.down.add(n)}),this.listen(window,"keyup",t=>{const n=t.code;this.down.delete(n),this.released.add(n)}),this.listen(window,"blur",()=>this.down.clear()),this.listen(e,"pointermove",t=>{const n=t;this.pointerDelta.x+=n.movementX??0,this.pointerDelta.y+=n.movementY??0,this.updatePointer(n)}),this.listen(e,"wheel",t=>this.wheelDelta+=t.deltaY),this.listen(e,"pointerdown",t=>{this.pointerDown=!0,this.updatePointer(t)}),this.listen(window,"pointerup",()=>this.pointerDown=!1)}pressVirtual(e){this.virtualDown.has(e)||this.virtualPressed.add(e),this.virtualDown.add(e)}releaseVirtual(e){this.virtualDown.delete(e)}isDown(e){return this.down.has(e)||this.virtualDown.has(e)}wasPressed(e){return this.pressed.has(e)||this.virtualPressed.has(e)}wasReleased(e){return this.released.has(e)}gamepadDown(e){return this.gpDown[e]===!0}gamepadPressed(e){return this.gpPressed[e]===!0}moveAxis(e=new Pe){return e.set((this.isDown("KeyD")||this.isDown("ArrowRight")?1:0)-(this.isDown("KeyA")||this.isDown("ArrowLeft")?1:0),(this.isDown("KeyW")||this.isDown("ArrowUp")?1:0)-(this.isDown("KeyS")||this.isDown("ArrowDown")?1:0)),e.add(this.leftStick).add(this.virtualAxis),e.lengthSq()>1?e.normalize():e}update(){const e=typeof navigator<"u"&&navigator.getGamepads?navigator.getGamepads():[];let t=null;for(const n of e)if(n){t=n;break}if(this.gamepadConnected=t!==null,!t){this.leftStick.set(0,0),this.rightStick.set(0,0),this.gpDown.length=0,this.gpPressed.length=0;return}this.applyDeadzone(this.leftStick.set(t.axes[0]??0,-(t.axes[1]??0))),this.applyDeadzone(this.rightStick.set(t.axes[2]??0,-(t.axes[3]??0))),this.gpPressed.length=t.buttons.length;for(let n=0;n<t.buttons.length;n++){const r=t.buttons[n].pressed;this.gpPressed[n]=r&&!this.gpDown[n],this.gpDown[n]=r}}lateUpdate(){this.pressed.clear(),this.released.clear(),this.virtualPressed.clear(),this.pointerDelta.set(0,0),this.wheelDelta=0}applyDeadzone(e){e.length()<this.deadzone&&e.set(0,0)}dispose(){for(const[e,t,n]of this.listeners)e.removeEventListener(t,n);this.listeners.length=0}updatePointer(e){const t=this.target.getBoundingClientRect();this.pointer.set(e.clientX-t.left,e.clientY-t.top),this.pointerNdc.set(this.pointer.x/t.width*2-1,-(this.pointer.y/t.height)*2+1)}listen(e,t,n){e.addEventListener(t,n),this.listeners.push([e,t,n])}}class Am{constructor(e={}){this.world=new Em,this.time=new tl,this.fixedTime=new tl,this.updateCallbacks=[],this.fixedCallbacks=[],this.running=!1,this.frameHandle=0;const{canvas:t,parent:n,antialias:r=!0,autoResize:s=!0,maxPixelRatio:a=2,fixedDelta:o=1/50}=e;this.stepper=new Sm(o),this.renderer=new Mm({canvas:t,antialias:r}),t||(n??document.body).appendChild(this.renderer.domElement),this.camera=new kt(60,1,.1,1e3),this.input=new Tm(this.renderer.domElement);const l=()=>{const c=window.innerWidth,h=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,a)),this.renderer.setSize(c,h),this.camera instanceof kt&&(this.camera.aspect=c/h,this.camera.updateProjectionMatrix())};s&&(l(),window.addEventListener("resize",l))}onUpdate(e){return this.updateCallbacks.push(e),()=>{const t=this.updateCallbacks.indexOf(e);t>=0&&this.updateCallbacks.splice(t,1)}}onFixedUpdate(e){return this.fixedCallbacks.push(e),()=>{const t=this.fixedCallbacks.indexOf(e);t>=0&&this.fixedCallbacks.splice(t,1)}}get fixedAlpha(){return this.stepper.alpha}start(){if(this.running)return;this.running=!0;const e=t=>{this.running&&(this.time.tick(t),this.step(this.time),this.frameHandle=requestAnimationFrame(e))};this.frameHandle=requestAnimationFrame(e)}stop(){this.running=!1,cancelAnimationFrame(this.frameHandle)}step(e){this.input.update(),this.stepper.advance(e.delta,t=>{this.fixedTime.delta=t,this.fixedTime.elapsed+=t,this.fixedTime.frame++;for(const n of this.fixedCallbacks)n(this.fixedTime);this.world.fixedUpdate(this.fixedTime)});for(const t of this.updateCallbacks)t(e);this.world.update(e),this.input.lateUpdate(),this.renderer.render(this.world.scene,this.camera)}dispose(){this.stop(),this.input.dispose(),this.world.clear(),this.renderer.dispose()}}class wm{constructor(e,t,n,r={}){this.camera=e,this.target=t,this.input=n,this.pivot=new N,this.distance=r.distance??10,this.minDistance=r.minDistance??2,this.maxDistance=r.maxDistance??40,this.minPitch=r.minPitch??.1,this.maxPitch=r.maxPitch??1.4,this.sensitivity=r.sensitivity??.005,this.zoomSpeed=r.zoomSpeed??1,this.stiffness=r.stiffness??10,this.requireDrag=r.requireDrag??!0,this.lookOffset=r.lookOffset??new N(0,1,0),this.yaw=r.yaw??0,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,r.pitch??.8)),this.currentYaw=this.yaw,this.currentPitch=this.pitch,this.currentDistance=this.distance,this.apply()}update(e){(!this.requireDrag||this.input.pointerDown)&&(this.yaw-=this.input.pointerDelta.x*this.sensitivity,this.pitch+=this.input.pointerDelta.y*this.sensitivity,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch))),this.input.wheelDelta!==0&&(this.distance*=Math.exp(this.input.wheelDelta*.001*this.zoomSpeed),this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance)));const t=Math.min(1,this.stiffness*e);this.currentYaw+=(this.yaw-this.currentYaw)*t,this.currentPitch+=(this.pitch-this.currentPitch)*t,this.currentDistance+=(this.distance-this.currentDistance)*t,this.apply()}snap(){this.currentYaw=this.yaw,this.currentPitch=this.pitch,this.currentDistance=this.distance,this.apply()}apply(){this.pivot.copy(this.target.position).add(this.lookOffset);const e=this.currentDistance,t=Math.cos(this.currentPitch);this.camera.position.set(this.pivot.x+e*t*Math.sin(this.currentYaw),this.pivot.y+e*Math.sin(this.currentPitch),this.pivot.z+e*t*Math.cos(this.currentYaw)),this.camera.lookAt(this.pivot)}}function Rm(i){return typeof(i==null?void 0:i.dispose)=="function"}function Cm(i){i.traverse(e=>{var r,s;const t=e;(s=(r=t.geometry)==null?void 0:r.dispose)==null||s.call(r);const n=t.material;Array.isArray(n)?n.forEach(nl):n&&nl(n)})}function nl(i){var t;const e=n=>{var s;const r=n;r!=null&&r.isTexture&&((s=r.dispose)==null||s.call(r))};for(const n of Object.values(i))e(n);for(const n of Object.values(i.uniforms??{}))e(n==null?void 0:n.value);(t=i.dispose)==null||t.call(i)}const mi=1,Zt=(i,e=4)=>{const t=10**e,n=Math.round(i*t)/t;return Object.is(n,-0)?0:n},xn=(i,e,t=1e-4)=>Math.abs(i-e)<t;function Pm(i,e){let t=(i^2654435769)>>>0;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619)>>>0;return t%2147483647||1}class Ua{constructor(e={}){this.name=e.name,this.seed=e.seed??1,this.meta=e.meta,this.entities=Hl(e.entities??[])}static parse(e,t={}){var a;if(!e||typeof e!="object")throw new Error("Level.parse: not an object");const n={...e};if(n.format!=="gama.level")throw new Error(`Level.parse: not a gama level (format: ${String(n.format)})`);let r=Number(n.version??0);if(r>mi)throw new Error(`Level.parse: file is version ${r}, this build understands ${mi}`);let s=n;for(;r<mi;){const o=(a=t.migrations)==null?void 0:a[r];if(!o)throw new Error(`Level.parse: no migration from version ${r}`);s=o(s),r+=1}return new Ua({...s,version:mi})}toJSON(){return il({format:"gama.level",version:mi,name:this.name,seed:this.seed,meta:this.meta,entities:this.entities})}instantiate(e,t,n={}){const r=this.seed,s=this,a=n.release!==!1,o=[];let l=[];const c=(f,x,S,g)=>{var w;const u=e.expand(f),y=u.id??f.id??`${S}${f.kind}-${g}`,A=e.build(u,{id:y,kind:u.kind,seed:Pm(r,y)});if(!A)return null;Dm(A.object,u),x.add(A.object);const M={id:y,kind:f.kind,object:A.object,tags:u.tags??[],source:A.source,children:[]};return(w=u.children)==null||w.forEach((b,C)=>{const _=c(b,A.object,`${y}/`,C);_&&M.children.push(_)}),M},h=()=>{l=[];const f=x=>{l.push(x);for(const S of x.children)f(S)};for(const x of o)x.placed&&f(x.placed)};this.entities.forEach((f,x)=>{o.push({spec:f,placed:c(f,t,"",x)})}),h();const p=f=>{let x=f;for(;o.some(S=>S.spec.id===x);)x=`${x}_`;return x};return{get objects(){return l},get specs(){return s.entities},byId:f=>l.find(x=>x.id===f),byTag:f=>l.filter(x=>x.tags.includes(f)),indexOf:f=>o.findIndex(x=>x.spec.id===f),add(f,x){const S={...f,id:p(f.id??`${f.kind}-${o.length}`)},g=x===void 0?o.length:Math.max(0,Math.min(x,o.length)),u=c(S,t,"",g);return o.splice(g,0,{spec:S,placed:u}),s.entities.splice(g,0,S),h(),u},remove(f){var u;const x=o.findIndex(y=>{var A;return((A=y.placed)==null?void 0:A.id)===f||y.spec.id===f});if(x<0)return null;const[S]=o.splice(x,1);(u=S.placed)==null||u.object.removeFromParent(),S.placed&&a&&ma(S.placed);const g=s.entities.indexOf(S.spec);return g>=0&&s.entities.splice(g,1),h(),S.spec},serialize(){return il({format:"gama.level",version:mi,name:s.name,seed:s.seed,meta:s.meta,entities:o.map(f=>f.placed?Wl(f.placed,f.spec):f.spec)})},dispose(){var f;for(const x of o)(f=x.placed)==null||f.object.removeFromParent(),x.placed&&a&&ma(x.placed);o.length=0,l=[]}}}}function ma(i){for(const e of i.children)ma(e);if(Rm(i.source)){i.source.dispose();return}Cm(i.object)}function Hl(i,e=""){const t=new Set;return i.map((n,r)=>{let s=n.id??`${e}${n.kind}-${r}`;for(;t.has(s);)s=`${s}_`;return t.add(s),{...n,id:s,children:n.children?Hl(n.children,`${s}/`):void 0}})}function Dm(i,e){e.at&&i.position.set(e.at[0],e.at[1],e.at[2]),typeof e.rot=="number"?i.rotation.set(0,e.rot,0):e.rot&&i.rotation.set(e.rot[0],e.rot[1],e.rot[2]),typeof e.scale=="number"?i.scale.setScalar(e.scale):e.scale&&i.scale.set(e.scale[0],e.scale[1],e.scale[2])}function Wl(i,e){var h;const t=i.object,n={id:i.id,kind:e.kind};(!xn(t.position.x,0)||!xn(t.position.y,0)||!xn(t.position.z,0))&&(n.at=[Zt(t.position.x),Zt(t.position.y),Zt(t.position.z)]);const{x:r,y:s,z:a}=t.rotation;xn(r,0)&&xn(a,0)?xn(s,0)||(n.rot=Zt(s,5)):n.rot=[Zt(r,5),Zt(s,5),Zt(a,5)];const{x:o,y:l,z:c}=t.scale;return xn(o,l)&&xn(l,c)?xn(o,1)||(n.scale=Zt(o)):n.scale=[Zt(o),Zt(l),Zt(c)],e.props&&Object.keys(e.props).length&&(n.props=e.props),i.tags.length&&(n.tags=[...i.tags]),(h=e.children)!=null&&h.length&&(n.children=e.children.map((p,d)=>i.children[d]?Wl(i.children[d],p):p)),n}function il(i){const e={...i};for(const t of Object.keys(e))e[t]===void 0&&delete e[t];return e}const Xl=i=>({p:[i.position.x,i.position.y,i.position.z],r:[i.rotation.x,i.rotation.y,i.rotation.z],s:[i.scale.x,i.scale.y,i.scale.z]}),Lm=(i,e)=>{i.position.set(e.p[0],e.p[1],e.p[2]),i.rotation.set(e.r[0],e.r[1],e.r[2]),i.scale.set(e.s[0],e.s[1],e.s[2])},Xn=(i,e)=>e>0?Math.round(i/e)*e:i;class Im{constructor(e,t,n,r){this.label=e,this.level=n,this.before=r,this.after=new Map,this.key=t,this.capture()}capture(){for(const e of this.before.keys()){const t=this.level.byId(e);t&&this.after.set(e,Xl(t.object))}}merge(e){e.after.forEach((t,n)=>this.after.set(n,t))}applyAll(e){e.forEach((t,n)=>{const r=this.level.byId(n);r&&Lm(r.object,t)})}undo(){this.applyAll(this.before)}redo(){this.applyAll(this.after)}}class Ss{constructor(e,t,n,r){this.label=e,this.level=t,this.specs=n,this.adding=r,this.key=null}place(){for(const e of[...this.specs].sort((t,n)=>t.index-n.index))this.level.add(e.spec,e.index)}pull(){for(const e of this.specs)this.level.remove(e.spec.id)}undo(){this.adding?this.pull():this.place()}redo(){this.adding?this.place():this.pull()}}class Um{constructor(e,t={}){this.level=e,this.past=[],this.future=[],this.ids=[],this.openKey=null,this.ray=new Ul,this.pointer=new Pe,this.snap=t.snap??0,this.snapAngle=t.snapAngle??0,this.limit=t.historyLimit??200,this.notify=t.onChange}get editable(){const e=new Set(this.level.specs.map(t=>t.id));return this.level.objects.filter(t=>e.has(t.id))}get selection(){return[...this.ids]}get selected(){return this.ids.map(e=>this.level.byId(e)).filter(e=>!!e)}get focused(){return this.ids.length===1?this.level.byId(this.ids[0]):void 0}isSelected(e){return this.ids.includes(e)}select(e,t={}){var o;const n=e===null?[]:Array.isArray(e)?e:[e],r=new Set(this.editable.map(l=>l.id)),s=n.filter(l=>r.has(l));let a;if(t.toggle){a=[...this.ids];for(const l of s){const c=a.indexOf(l);c>=0?a.splice(c,1):a.push(l)}}else t.add?a=[...new Set([...this.ids,...s])]:a=s;a.length===this.ids.length&&a.every((l,c)=>l===this.ids[c])||(this.ids=a,this.endRun(),(o=this.notify)==null||o.call(this,this,"select"))}selectAll(){this.select(this.editable.map(e=>e.id))}selectNext(e=1){const t=this.editable;if(!t.length)return;const r=((t.findIndex(s=>s.id===this.ids[this.ids.length-1])+e)%t.length+t.length)%t.length;this.select(t[r].id)}resolve(e){const t=this.editable;for(let n=e??null;n;n=n.parent){const r=t.find(s=>s.object===n);if(r)return r}}pick(e,t,n){const r=this.editable;if(r.length){for(const s of r)s.object.updateWorldMatrix(!0,!0);this.ray.setFromCamera(this.pointer.set(e,t),n);for(const s of this.ray.intersectObjects(r.map(a=>a.object),!0)){const a=this.resolve(s.object);if(a)return a}}}move(e,t,n){this.transform("move","Move",r=>{const{position:s}=r;s.set(Xn(s.x+e,this.snap),Xn(s.y+t,this.snap),Xn(s.z+n,this.snap))})}moveTo(e,t,n){this.transform("move","Move",r=>{r.position.set(Xn(e,this.snap),Xn(t,this.snap),Xn(n,this.snap))})}rotate(e){this.transform("rotate","Rotate",t=>{t.rotation.y=Xn(t.rotation.y+e,this.snapAngle)})}scaleBy(e){this.transform("scale","Scale",t=>{t.scale.multiplyScalar(e)})}setScale(e){this.transform("scale","Scale",t=>{t.scale.setScalar(e)})}ground(){this.transform("ground","Ground",e=>{e.position.y=0})}transform(e,t,n){const r=this.selected;if(!r.length)return;const s=new Map;for(const o of r)s.set(o.id,Xl(o.object));for(const o of r)n(o.object);const a=`${e}:${this.ids.join(",")}`;this.push(new Im(t,a,this.level,s),"edit")}place(e,t={}){const n=this.level.add(e),r=this.level.specs[this.level.specs.length-1];return this.push(new Ss(`Add ${e.kind}`,this.level,[{spec:r,index:this.level.specs.length-1}],!0),"structure"),t.select!==!1&&this.select(r.id),n}duplicate(e=this.snap||1){var a,o,l;const t=this.selected;if(!t.length)return[];const n=this.level.serialize().entities,r=[],s=[];for(const c of t){const h=n.find(S=>S.id===c.id);if(!h)continue;const p=Nm(h),d={...p,children:p.children?ql(p.children):void 0,id:`${c.id}-copy`,at:[(((a=h.at)==null?void 0:a[0])??0)+e,((o=h.at)==null?void 0:o[1])??0,(((l=h.at)==null?void 0:l[2])??0)+e]},f=this.level.add(d),x=this.level.specs[this.level.specs.length-1];s.push({spec:x,index:this.level.specs.length-1}),f&&r.push(f)}return s.length?(this.push(new Ss(`Duplicate ${s.length}`,this.level,s,!0),"structure"),this.select(s.map(c=>c.spec.id)),r):[]}remove(){const e=this.ids.length?[...this.ids]:[];if(!e.length)return[];const t=this.level.serialize().entities,n=e.map(r=>({spec:t.find(s=>s.id===r),index:this.level.indexOf(r)})).filter(r=>r.spec&&r.index>=0);for(const r of n)this.level.remove(r.spec.id);return n.length?(this.ids=[],this.push(new Ss(`Delete ${n.length}`,this.level,n,!1),"structure"),n.map(r=>r.spec)):[]}setTags(e){const t=this.focused;if(!t)return;const n=this.level.specs.find(o=>o.id===t.id),r=[...t.tags],s=[...e],a=o=>{t.tags=[...o],n&&(n.tags=o.length?[...o]:void 0)};a(s),this.push({label:"Tag",key:null,undo:()=>a(r),redo:()=>a(s)},"edit")}setProps(e){const t=this.focused;if(!t)return null;const n=this.level.indexOf(t.id),r=this.level.serialize().entities.find(p=>p.id===t.id);if(n<0||!r)return null;const s={...r,props:Fm({...r.props,...e})},a={spec:r,index:n},o={spec:s,index:n},l=this.level,c=(p,d)=>{l.remove(p.spec.id),l.add(d.spec,d.index)};l.remove(r.id);const h=l.add(s,n);return this.push({label:"Edit props",key:null,undo:()=>c(o,a),redo:()=>c(a,o)},"structure"),this.select(t.id),h}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}get undoLabel(){var e;return((e=this.past[this.past.length-1])==null?void 0:e.label)??null}get redoLabel(){var e;return((e=this.future[this.future.length-1])==null?void 0:e.label)??null}undo(){var t;const e=this.past.pop();return e?(e.undo(),this.future.push(e),this.endRun(),this.prune(),(t=this.notify)==null||t.call(this,this,"history"),!0):!1}redo(){var t;const e=this.future.pop();return e?(e.redo(),this.past.push(e),this.endRun(),this.prune(),(t=this.notify)==null||t.call(this,this,"history"),!0):!1}commit(){this.endRun()}clearHistory(){this.past.length=0,this.future.length=0,this.endRun()}get historyLength(){return this.past.length}push(e,t){var r;this.future.length=0;const n=this.past[this.past.length-1];e.key&&e.key===this.openKey&&(n==null?void 0:n.key)===e.key&&n.merge?n.merge(e):(this.past.push(e),this.past.length>this.limit&&this.past.shift()),this.openKey=e.key,(r=this.notify)==null||r.call(this,this,t)}endRun(){this.openKey=null}prune(){const e=new Set(this.editable.map(n=>n.id)),t=this.ids.filter(n=>e.has(n));t.length!==this.ids.length&&(this.ids=t)}toJSON(){return this.level.serialize()}toText(){return`${JSON.stringify(this.toJSON(),null,2)}
`}}function ql(i){return i.map(({id:e,...t})=>({...t,children:t.children?ql(t.children):void 0}))}function Nm(i){return JSON.parse(JSON.stringify(i))}function Fm(i){const e={};for(const[t,n]of Object.entries(i))n!==void 0&&(e[t]=n);return e}const Om=`
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
`,Bm=`
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
`,bs=i=>Math.round(i*1e3)/1e3,zm=i=>`#${(i&16777215).toString(16).padStart(6,"0")}`;let rl=!1;function km(i){const{catalog:e,container:t=document.body,storageKey:n="gama.editor.level",brand:r="GAMA",subtitle:s="Level editor",release:a}=i;if(!rl){const L=document.createElement("style");L.textContent=Om,document.head.append(L),rl=!0}const o=document.createElement("div");o.className="gama-ed",o.innerHTML=Bm,getComputedStyle(t).position==="static"&&(t.style.position="relative"),t.append(o);const l=L=>o.querySelector(`[data-ed="${L}"]`);l("brand").textContent=r,l("subtitle").textContent=s;const c=l("viewport"),h=l("palette"),p=l("inspector"),d=l("hint"),f=l("status"),x=l("snap"),S=l("angle"),g=l("file");i.snap!==void 0&&(x.value=String(i.snap)),i.snapAngle!==void 0&&(S.value=String(i.snapAngle));const u=new Am({parent:c,autoResize:!1,antialias:!0}),y=u.world.scene,A=u.camera;u.renderer.shadowMap.enabled=!0;const M=new St;M.name="gizmos",y.add(M);let w=new St;w.name="level",y.add(w);const b=new _t;y.add(b);const C={pointerDelta:new Pe,wheelDelta:0,pointerDown:!1},_=new wm(A,b,C,{distance:i.distance??30,minDistance:4,maxDistance:Math.max(160,(i.distance??30)*3),pitch:i.pitch??.72,yaw:i.yaw??.5,maxPitch:1.45,stiffness:14,lookOffset:new N(0,1.5,0)}),E=()=>{const L=c.clientWidth||1,z=c.clientHeight||1;u.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),u.renderer.setSize(L,z,!0),A.aspect=L/z,A.updateProjectionMatrix()},D=new ResizeObserver(E);D.observe(c),E();let P,R,q="Untitled",K=1,B,W=null,X=null;const ne={get game(){return u},get editor(){return R},get level(){return P},get root(){return w},pivot:b,load:le,toJSON:re,download:Y,refresh:pe,dispose:$};function re(){return{...R.toJSON(),name:q,seed:K,meta:B}}function le(L){P==null||P.dispose(),y.remove(w),w=new St,w.name="level",y.add(w);const z=Ua.parse(L);q=z.name??"Untitled",K=z.seed,B=z.meta,P=z.instantiate(e,w,{release:a}),R=new Um(P,{snap:Number(x.value),snapAngle:Number(S.value)*Math.PI/180,onChange:()=>pe()}),W=null,pe()}function pe(){var L;if(X){we(),G();return}Se(),se(),we(),st(),G(),(L=i.onChange)==null||L.call(i,ne,re())}function Se(){for(const L of M.children){const z=L;z.geometry.dispose(),z.material.dispose()}M.clear();for(const L of R.selected){L.object.updateWorldMatrix(!0,!0);const z=new yd(L.object,5082623);z.material.depthTest=!1,z.renderOrder=2,M.add(z)}}function We(){const L=new Map;for(const z of e.list()){const Z=z.group??"Other";let te=L.get(Z);if(!te){const be=document.createElement("h4");be.textContent=Z,h.append(be),te=document.createElement("div"),h.append(te),L.set(Z,te)}const de=document.createElement("button");de.textContent=z.label,de.dataset.kind=z.kind,de.title=z.prefab?`recipe — expands to ${z.kind}`:z.kind,de.addEventListener("click",()=>{W=W===z.kind?null:z.kind,pe()}),te.append(de)}}function st(){for(const L of h.querySelectorAll("button"))L.setAttribute("aria-pressed",String(L.dataset.kind===W));d.classList.toggle("armed",!!W),d.innerHTML=W?`Click the ground to place <b>${W}</b> — <kbd>Esc</kbd> to put it down`:R.selection.length?`<b>${R.selection.join(", ")}</b> — drag to move · <b>Q</b>/<b>E</b> turn · <b>[</b>/<b>]</b> scale · <b>Del</b>`:"Click a thing to select it, or pick something from the palette"}function Le(L,z){const Z=document.createElement("div");Z.className="ed-row";const te=document.createElement("label");return te.textContent=L,Z.append(te,z),Z}function J(L,z,Z){const te=document.createElement("input");return te.type="number",te.step=String(z),te.value=String(bs(L)),te.addEventListener("change",()=>{const de=Number(te.value);Number.isFinite(de)&&Z(de)}),te}function ce(L){const[z,Z]=[R.snap,R.snapAngle];R.snap=0,R.snapAngle=0,L(),R.commit(),R.snap=z,R.snapAngle=Z}function se(){var Q,fe;p.replaceChildren();const L=R.focused;if(!L){const ie=document.createElement("h4");ie.textContent="Level",p.append(ie);const ee=document.createElement("input");ee.value=q,ee.addEventListener("change",()=>{q=ee.value,G(),we()}),p.append(Le("name",ee)),p.append(Le("seed",J(K,1,ae=>le({...re(),seed:Math.round(ae)}))));const _e=document.createElement("div");_e.className="ed-empty",_e.textContent=R.selection.length?`${R.selection.length} selected — pick one to edit its props.`:"Nothing selected.",p.append(_e);return}const z=L.object,Z=e.info(L.kind),te=document.createElement("h4");te.textContent=(Z==null?void 0:Z.label)??L.kind,p.append(te);const de=document.createElement("div");de.className="ed-readonly",de.textContent=`${L.id}  ·  ${L.kind}`,p.append(Le("id",de));const be=document.createElement("div");be.className="ed-triple";for(const ie of["x","y","z"])be.append(J(z.position[ie],.1,ee=>{const _e=z.position.clone();_e[ie]=ee,ce(()=>R.moveTo(_e.x,_e.y,_e.z))}));p.append(Le("position",be)),p.append(Le("yaw°",J(z.rotation.y*180/Math.PI,5,ie=>ce(()=>R.rotate(ie*Math.PI/180-z.rotation.y))))),p.append(Le("scale",J(z.scale.x,.1,ie=>R.setScale(Math.max(.01,ie)))));const Re=document.createElement("input");if(Re.value=L.tags.join(", "),Re.placeholder="spawn, pickup…",Re.addEventListener("change",()=>R.setTags(Re.value.split(",").map(ie=>ie.trim()).filter(Boolean))),p.append(Le("tags",Re)),!(Z!=null&&Z.fields.length))return;const I=document.createElement("h4");I.textContent="Props",p.append(I);const ue={...Z.defaults,...((Q=P.specs.find(ie=>ie.id===L.id))==null?void 0:Q.props)??{}};for(const ie of Z.fields){const ee=ue[ie.key],_e=ie.label??ie.key;if(ie.type==="color"){const ae=document.createElement("input");ae.type="color",ae.value=zm(typeof ee=="number"?ee:16777215),ae.addEventListener("change",()=>R.setProps({[ie.key]:parseInt(ae.value.slice(1),16)})),p.append(Le(_e,ae))}else if(ie.type==="select"){const ae=document.createElement("select");for(const et of ie.options??[]){const Ze=document.createElement("option");Ze.value=et,Ze.textContent=et,ae.append(Ze)}ae.value=String(ee??((fe=ie.options)==null?void 0:fe[0])??""),ae.addEventListener("change",()=>R.setProps({[ie.key]:ae.value})),p.append(Le(_e,ae))}else if(ie.type==="boolean"){const ae=document.createElement("input");ae.type="checkbox",ae.checked=!!ee,ae.addEventListener("change",()=>R.setProps({[ie.key]:ae.checked})),p.append(Le(_e,ae))}else if(ie.type==="number"){const ae=J(typeof ee=="number"?ee:0,ie.step??.1,et=>R.setProps({[ie.key]:et}));ie.min!==void 0&&(ae.min=String(ie.min)),ie.max!==void 0&&(ae.max=String(ie.max)),p.append(Le(_e,ae))}else{const ae=document.createElement("input");ae.value=String(ee??""),ae.addEventListener("change",()=>R.setProps({[ie.key]:ae.value})),p.append(Le(_e,ae))}}}function we(){const L=R.toJSON(),z=L.entities.filter(de=>!e.has(de.kind)).length;f.innerHTML=`<span><b>${q}</b></span><span><b>${L.entities.length}</b> entities · <b>${P.objects.length}</b> built`+(z?` · <b style="color:var(--ed-warn)">${z}</b> unknown kind`:"")+`</span><span>selection <b>${R.selection.length||"—"}</b></span><span>undo <b>${R.undoLabel??"—"}</b></span><span>${JSON.stringify(L).length} bytes</span>`;const Z=l("undo"),te=l("redo");Z.disabled=!R.canUndo,te.disabled=!R.canRedo,Z.textContent=R.canUndo?`Undo ${R.undoLabel}`:"Undo",te.textContent=R.canRedo?`Redo ${R.redoLabel}`:"Redo"}const De=new Ul,Ae=new Pe,at=new Un(new N(0,1,0),0),Fe=new N;let Ye=new N,ze=!1,ke=!1;const Qe=new Pe,$e=u.renderer.domElement,ht=L=>{const z=$e.getBoundingClientRect();return Ae.set((L.clientX-z.left)/z.width*2-1,-((L.clientY-z.top)/z.height)*2+1)};function ft(L,z=0,Z=!0){if(De.setFromCamera(ht(L),A),Z){const te=De.intersectObject(w,!0);if(te.length)return te[0].point.clone()}return at.constant=-z,De.ray.intersectPlane(at,Fe)?Fe.clone():null}const rt=L=>R.snap>0?Math.round(L/R.snap)*R.snap:bs(L);$e.addEventListener("contextmenu",L=>L.preventDefault()),$e.addEventListener("pointerdown",L=>{if($e.setPointerCapture(L.pointerId),Qe.set(L.clientX,L.clientY),L.button===2||L.button===1){ze=!L.shiftKey&&L.button===2,ke=!ze,C.pointerDown=ze;return}if(L.button!==0)return;if(W){const de=ft(L);de&&(R.place({kind:W,at:[rt(de.x),bs(de.y),rt(de.z)]}),L.shiftKey||(W=null),pe());return}const z=ht(L),Z=R.pick(z.x,z.y,A);if(!Z){L.shiftKey||R.select(null);return}L.shiftKey?R.select(Z.id,{toggle:!0}):R.isSelected(Z.id)||R.select(Z.id);const te=ft(L,Z.object.position.y,!1);!te||!R.selection.length||(Ye=te,X=new Map(R.selected.map(de=>[de.id,de.object.position.clone()])))}),$e.addEventListener("pointermove",L=>{var Z;if(ze){C.pointerDelta.set(L.clientX-Qe.x,L.clientY-Qe.y),Qe.set(L.clientX,L.clientY);return}if(ke){const te=(L.clientX-Qe.x)*_.distance*.0016,de=(L.clientY-Qe.y)*_.distance*.0016,be=new N().setFromMatrixColumn(A.matrixWorld,0).setY(0).normalize(),Re=new N().crossVectors(new N(0,1,0),be);b.position.addScaledVector(be,-te).addScaledVector(Re,-de),Qe.set(L.clientX,L.clientY);return}if(!X)return;const z=ft(L,Ye.y,!1);if(z){for(const[te,de]of X)(Z=P.byId(te))==null||Z.object.position.copy(de);R.move(z.x-Ye.x,0,z.z-Ye.z)}});const lt=L=>{var z;X&&(X=null,R.commit(),pe()),ze=ke=!1,C.pointerDown=!1,C.pointerDelta.set(0,0),(z=$e.releasePointerCapture)==null||z.call($e,L.pointerId)};$e.addEventListener("pointerup",lt),$e.addEventListener("pointercancel",lt),$e.addEventListener("wheel",L=>{L.preventDefault(),C.wheelDelta=L.deltaY},{passive:!1});const U=new Set,wt=L=>{var z,Z;return(Z=(z=L.target)==null?void 0:z.matches)==null?void 0:Z.call(z,"input, select, textarea")},Ke=L=>{if(wt(L))return;U.add(L.code);const z=L.ctrlKey||L.metaKey;if(z&&L.code==="KeyZ")return L.shiftKey?R.redo():R.undo(),L.preventDefault();if(z&&L.code==="KeyY")return R.redo(),L.preventDefault();if(z&&L.code==="KeyD")return R.duplicate(),L.preventDefault();if(z&&L.code==="KeyS")return Y(),L.preventDefault();if(z&&L.code==="KeyA")return R.selectAll(),L.preventDefault();if(z)return;const Z=L.shiftKey?.05:R.snap||.25;switch(L.code){case"Escape":W?W=null:R.select(null),pe();break;case"Tab":R.selectNext(L.shiftKey?-1:1);break;case"Delete":case"Backspace":R.remove();break;case"ArrowLeft":R.move(-Z,0,0);break;case"ArrowRight":R.move(Z,0,0);break;case"ArrowUp":R.move(0,0,-Z);break;case"ArrowDown":R.move(0,0,Z);break;case"PageUp":R.move(0,Z,0);break;case"PageDown":R.move(0,-Z,0);break;case"KeyQ":R.rotate(R.snapAngle||.08);break;case"KeyE":R.rotate(-(R.snapAngle||.08));break;case"BracketRight":R.scaleBy(1.1);break;case"BracketLeft":R.scaleBy(1/1.1);break;case"KeyG":R.ground();break;default:return}L.preventDefault()},T=L=>{U.delete(L.code),R.commit()},m=()=>U.clear();window.addEventListener("keydown",Ke),window.addEventListener("keyup",T),window.addEventListener("blur",m);let O=0;function G(){n&&(clearTimeout(O),O=window.setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(re()))}catch{}},400))}function Y(){const L=new Blob([`${JSON.stringify(re(),null,2)}
`],{type:"application/json"}),z=document.createElement("a");z.href=URL.createObjectURL(L),z.download=`${q.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"level"}.json`,z.click(),setTimeout(()=>URL.revokeObjectURL(z.href),1e3)}g.addEventListener("change",async()=>{var z;const L=(z=g.files)==null?void 0:z[0];if(L){try{le(JSON.parse(await L.text()))}catch(Z){alert(`That did not load: ${Z.message}`)}g.value=""}});const oe=l("extras");for(const L of i.actions??[]){const z=document.createElement("button");z.textContent=L.label,L.title&&(z.title=L.title),z.addEventListener("click",()=>L.run(ne)),oe.append(z)}o.querySelector(".ed-tools").addEventListener("click",L=>{var Z,te;const z=(Z=L.target.closest("[data-act]"))==null?void 0:Z.dataset.act;z==="new"?le({format:"gama.level",version:1,name:"Untitled",entities:[]}):z==="open"?g.click():z==="save"?Y():z==="copy"?(te=navigator.clipboard)==null||te.writeText(JSON.stringify(re(),null,2)):z==="undo"?R.undo():z==="redo"?R.redo():z==="help"&&l("help").showModal()}),x.addEventListener("change",()=>{R.snap=Number(x.value)}),S.addEventListener("change",()=>{R.snapAngle=Number(S.value)*Math.PI/180});const he=u.onUpdate(L=>{if(U.size){const z=26*L.delta,Z=new N().setFromMatrixColumn(A.matrixWorld,0).setY(0).normalize(),te=new N().crossVectors(new N(0,1,0),Z);U.has("KeyA")&&b.position.addScaledVector(Z,-z),U.has("KeyD")&&b.position.addScaledVector(Z,z),U.has("KeyW")&&b.position.addScaledVector(te,z),U.has("KeyS")&&b.position.addScaledVector(te,-z)}_.update(L.delta),C.pointerDelta.set(0,0),C.wheelDelta=0;for(const z of M.children)z.update()});function $(){for(const L of M.children){const z=L;z.geometry.dispose(),z.material.dispose()}M.clear(),he(),u.stop(),D.disconnect(),window.removeEventListener("keydown",Ke),window.removeEventListener("keyup",T),window.removeEventListener("blur",m),P==null||P.dispose(),o.remove()}We(),i.decorate?i.decorate(y,ne):Gm(y);let j=i.level;if(n)try{const L=localStorage.getItem(n);L&&(j=JSON.parse(L))}catch{}try{le(j??{format:"gama.level",version:1,name:"Untitled",entities:[]})}catch{le(i.level??{format:"gama.level",version:1,name:"Untitled",entities:[]})}return u.start(),ne}function Gm(i){i.background=new Be(988192),i.fog=new wa(988192,70,200);const e=new vd(16773852,2.5);e.position.set(24,34,16),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-50,e.shadow.camera.right=50,e.shadow.camera.top=50,e.shadow.camera.bottom=-50,e.shadow.camera.far=120,e.shadow.bias=-8e-4,i.add(e,new gd(11060968,4871488,1.7));const t=new jt(new Vi(400,400),new zn({color:4478266,roughness:1}));t.rotation.x=-Math.PI/2,t.position.y=-.01,t.receiveShadow=!0,i.add(t);const n=new bd(120,120,7053567,3360094);n.material.transparent=!0,n.material.opacity=.4,i.add(n)}class Vm{constructor(){this.factories=new Map,this.prefabs=new Map}define(e,t,n={}){return this.factories.set(e,{factory:t,options:n}),this}defineAll(e){for(const[t,n]of Object.entries(e))this.define(t,n);return this}prefab(e,t,n={}){return this.prefabs.set(e,{spec:t,options:n}),this}has(e){return this.factories.has(e)||this.prefabs.has(e)}get kinds(){return[...new Set([...this.factories.keys(),...this.prefabs.keys()])].sort()}info(e){const t=this.factories.get(e);if(t)return{kind:e,label:t.options.label??e,group:t.options.group,fields:t.options.fields??[],defaults:t.options.defaults??{},prefab:!1};const n=this.prefabs.get(e);if(!n)return;const r=this.info(this.expand({kind:e}).kind);return{kind:e,label:n.options.label??e,group:n.options.group??(r==null?void 0:r.group),fields:n.options.fields??(r==null?void 0:r.fields)??[],defaults:{...r==null?void 0:r.defaults,...this.expand({kind:e}).props},prefab:!0}}list(){return[...this.factories.keys(),...this.prefabs.keys()].map(e=>this.info(e))}expand(e){const t=this.prefabs.get(e.kind);if(!t)return e;const n=t.spec,r=this.expand({...n,id:e.id??n.id});return{...r,id:e.id??r.id,at:e.at??r.at,rot:e.rot??r.rot,scale:e.scale??r.scale,props:{...r.props,...e.props},tags:[...r.tags??[],...e.tags??[]],children:[...r.children??[],...e.children??[]]}}build(e,t){const n=this.factories.get(e.kind);if(!n)return null;const r={...n.options.defaults,...e.props},s=n.factory(r,t);if(!s)return null;const a=s instanceof _t?s:s.object;return a?{object:a,source:s}:null}}const Or=i=>{let e=i>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296},xt=(i,e)=>typeof i=="number"&&Number.isFinite(i)?i:e,Tt=(i,e,t=.85)=>new zn({color:xt(i,e),roughness:t}),qe=(i,e,t=0)=>{const n=new jt(i,e);return n.position.y=t,n.castShadow=!0,n.receiveShadow=!0,n},Cr=9069122,Pr=12827561,sl=4881480,Mt=new Vm;Mt.define("wall",i=>{const e=xt(i.length,4),t=xt(i.height,2.2);return qe(new gt(e,t,.35),Tt(i.color,Pr),t/2)},{label:"Wall",group:"Structures",defaults:{length:4,height:2.2,color:Pr},fields:[{key:"length",type:"number",min:1,max:20,step:.5},{key:"height",type:"number",min:.5,max:8,step:.1},{key:"color",type:"color"}]});Mt.define("pillar",i=>{const e=xt(i.height,3),t=new St,n=Tt(i.color,Pr);return t.add(qe(new Vt(.34,.4,e,12),n,e/2)),t.add(qe(new gt(1,.24,1),n,.12)),t.add(qe(new gt(.9,.22,.9),n,e-.11)),t},{label:"Pillar",group:"Structures",defaults:{height:3,color:Pr},fields:[{key:"height",type:"number",min:1,max:10,step:.2},{key:"color",type:"color"}]});Mt.define("house",(i,e)=>{const t=Or(e.seed),n=xt(i.width,4),r=xt(i.depth,3.4),s=Math.max(1,Math.round(xt(i.storeys,1))),a=2.4*s,o=new St,l=Tt(i.color,14273972),c=Tt(i.roofColor,9194298,.9);if(o.add(qe(new gt(n,a,r),l,a/2)),i.roof==="flat")o.add(qe(new gt(n+.3,.24,r+.3),c,a+.12));else{const d=qe(new Ai(Math.hypot(n,r)*.55,1.5,4),c,a+.75);d.rotation.y=Math.PI/4,o.add(d)}const h=new zn({color:4010534,roughness:.6}),p=qe(new gt(.8,1.5,.12),h,.75);p.position.z=r/2+.01,o.add(p);for(let d=0;d<s*2;d++){const f=qe(new gt(.62,.62,.1),h,1.4+Math.floor(d/2)*2.4);f.position.x=(d%2?1:-1)*(n*.26+t()*.2),f.position.z=r/2+.01,o.add(f)}return o},{label:"House",group:"Structures",defaults:{width:4,depth:3.4,storeys:1,roof:"gable",color:14273972,roofColor:9194298},fields:[{key:"width",type:"number",min:2,max:12,step:.2},{key:"depth",type:"number",min:2,max:12,step:.2},{key:"storeys",type:"number",min:1,max:4,step:1},{key:"roof",type:"select",options:["gable","flat"]},{key:"color",type:"color"},{key:"roofColor",type:"color",label:"roof colour"}]});Mt.define("tower",i=>{const e=xt(i.height,9),t=xt(i.radius,1.5),n=new St,r=Tt(i.color,12169376);n.add(qe(new Vt(t,t*1.12,e,14),r,e/2)),n.add(qe(new Vt(t*1.2,t*1.2,.4,14),r,e));const s=qe(new Ai(t*1.25,2.2,14),Tt(i.roofColor,4872811,.7),e+1.3);return n.add(s),n},{label:"Tower",group:"Structures",defaults:{height:9,radius:1.5,color:12169376,roofColor:4872811},fields:[{key:"height",type:"number",min:3,max:30,step:.5},{key:"radius",type:"number",min:.6,max:5,step:.1},{key:"color",type:"color"},{key:"roofColor",type:"color",label:"roof colour"}]});Mt.define("platform",i=>{const e=xt(i.width,5),t=xt(i.depth,5),n=xt(i.height,.4);return qe(new gt(e,n,t),Tt(i.color,10130047),n/2)},{label:"Platform",group:"Structures",defaults:{width:5,depth:5,height:.4,color:10130047},fields:[{key:"width",type:"number",min:1,max:24,step:.5},{key:"depth",type:"number",min:1,max:24,step:.5},{key:"height",type:"number",min:.1,max:4,step:.1},{key:"color",type:"color"}]});Mt.define("tree",(i,e)=>{const t=Or(e.seed),n=xt(i.height,4.5),r=new St,s=qe(new Vt(.14,.22,n*.45,7),Tt(i.trunkColor,7031602),n*.22);s.rotation.z=(t()-.5)*.08,r.add(s);const a=Tt(i.color,sl,.95),o=3;for(let l=0;l<o;l++){const c=l/(o-1),h=qe(new Ai(n*(.32-c*.14),n*.4,8),a,n*(.42+c*.22));h.rotation.y=t()*Math.PI,r.add(h)}return r},{label:"Tree",group:"Nature",defaults:{height:4.5,color:sl,trunkColor:7031602},fields:[{key:"height",type:"number",min:1.5,max:14,step:.25},{key:"color",type:"color",label:"leaves"},{key:"trunkColor",type:"color",label:"trunk"}]});Mt.define("bush",(i,e)=>{const t=Or(e.seed),n=xt(i.radius,.7),r=new St,s=Tt(i.color,5536063,.95);for(let a=0;a<3;a++){const o=qe(new Ur(n*(.7+t()*.4),8,6),s,n*.7);o.position.x=(t()-.5)*n,o.position.z=(t()-.5)*n,r.add(o)}return r},{label:"Bush",group:"Nature",defaults:{radius:.7,color:5536063},fields:[{key:"radius",type:"number",min:.2,max:3,step:.1},{key:"color",type:"color"}]});Mt.define("rock",(i,e)=>{const t=Or(e.seed),n=xt(i.size,1),r=qe(new La(n,0),Tt(i.color,9145222,.95),n*.55);return r.scale.set(1+t()*.5,.6+t()*.5,1+t()*.5),r.rotation.set(t(),t()*Math.PI,t()),r},{label:"Rock",group:"Nature",defaults:{size:1,color:9145222},fields:[{key:"size",type:"number",min:.2,max:6,step:.1},{key:"color",type:"color"}]});Mt.define("crate",i=>{const e=xt(i.size,1),t=new St,n=Tt(i.color,12159814,.8);t.add(qe(new gt(e,e,e),n,e/2));const r=new zn({color:7163688,roughness:.7});return t.add(qe(new gt(e*1.02,e*.12,e*1.02),r,e*.78)),t},{label:"Crate",group:"Props",defaults:{size:1,color:12159814},fields:[{key:"size",type:"number",min:.3,max:3,step:.1},{key:"color",type:"color"}]});Mt.define("barrel",i=>{const e=xt(i.height,1.1),t=new St,n=Tt(i.color,8215093,.8);t.add(qe(new Vt(.44,.38,e,12),n,e/2));const r=new zn({color:4868682,metalness:.4,roughness:.5});return t.add(qe(new Vt(.46,.46,.08,12),r,e*.28)),t.add(qe(new Vt(.46,.46,.08,12),r,e*.74)),t},{label:"Barrel",group:"Props",defaults:{height:1.1,color:8215093},fields:[{key:"height",type:"number",min:.4,max:3,step:.1},{key:"color",type:"color"}]});Mt.define("bench",i=>{const e=xt(i.length,2),t=new St,n=Tt(i.color,Cr,.8);t.add(qe(new gt(e,.12,.5),n,.45));const r=qe(new gt(e,.5,.1),n,.75);r.position.z=-.2,t.add(r);for(const s of[-1,1]){const a=qe(new gt(.12,.45,.45),n,.22);a.position.x=s*(e/2-.2),t.add(a)}return t},{label:"Bench",group:"Props",defaults:{length:2,color:Cr},fields:[{key:"length",type:"number",min:.8,max:6,step:.2},{key:"color",type:"color"}]});Mt.define("lamp",i=>{const e=xt(i.height,2.8),t=new St;t.add(qe(new Vt(.07,.11,e,8),Tt(i.color,3752010,.6),e/2));const n=new zn({color:16770728,emissive:xt(i.glow,16764006),emissiveIntensity:1.5});return t.add(qe(new Ur(.2,10,8),n,e+.1)),t},{label:"Lamp",group:"Props",defaults:{height:2.8,color:3752010,glow:16764006},fields:[{key:"height",type:"number",min:1,max:8,step:.2},{key:"color",type:"color",label:"post"},{key:"glow",type:"color"}]});Mt.define("fence",i=>{const e=xt(i.length,4),t=new St,n=Tt(i.color,8020290,.9),r=Math.max(2,Math.round(e/1.2)+1);for(let s=0;s<r;s++){const a=qe(new gt(.12,1.1,.12),n,.55);a.position.x=-e/2+s*e/(r-1),t.add(a)}for(const s of[.45,.85])t.add(qe(new gt(e,.08,.07),n,s));return t},{label:"Fence",group:"Props",defaults:{length:4,color:8020290},fields:[{key:"length",type:"number",min:1,max:20,step:.5},{key:"color",type:"color"}]});Mt.define("signpost",i=>{const e=new St,t=Tt(i.color,Cr,.85);e.add(qe(new Vt(.08,.09,2.2,8),t,1.1));const n=qe(new gt(1.4,.5,.08),Tt(i.boardColor,14207395),1.9);return n.position.x=.5,e.add(n),e},{label:"Signpost",group:"Props",defaults:{color:Cr,boardColor:14207395},fields:[{key:"color",type:"color",label:"post"},{key:"boardColor",type:"color",label:"board"}]});Mt.define("spawn",()=>{const i=new St,e=qe(new Vt(.7,.7,.06,20),new zn({color:2845951,emissive:1720222,emissiveIntensity:.8}),.03);return i.add(e),i.add(qe(new Ai(.28,.9,8),new zn({color:9421055,emissive:2845951,emissiveIntensity:.5}),.75)),i},{label:"Spawn point",group:"Markers"});Mt.prefab("lit-corner",{kind:"pillar",props:{height:2.6},children:[{kind:"lamp",at:[0,2.6,0],props:{height:.6}}]},{label:"Lit corner",group:"Recipes"});Mt.prefab("grove",{kind:"tree",props:{height:5},children:[{kind:"tree",at:[2.6,0,1.4],props:{height:3.6}},{kind:"tree",at:[-1.8,0,2.2],props:{height:4.2}},{kind:"bush",at:[1.2,0,-1.6]}]},{label:"Grove",group:"Recipes"});Mt.prefab("cottage-lot",{kind:"house",props:{width:4.2,depth:3.6},children:[{kind:"fence",at:[0,0,3.4],props:{length:5}},{kind:"barrel",at:[2.6,0,2.2]},{kind:"tree",at:[-3.4,0,1.6],props:{height:4}}]},{label:"Cottage lot",group:"Recipes"});const Hm={format:"gama.level",version:1,name:"Millbrook",seed:31,entities:[{id:"green",kind:"platform",at:[0,0,0],props:{width:14,depth:14,height:.2,color:7307090}},{id:"cottage",kind:"cottage-lot",at:[-6,.2,-4],rot:.5},{id:"hall",kind:"house",at:[5.5,.2,-5],rot:-.35,props:{width:6,depth:4.4,storeys:2,roofColor:6253430}},{id:"watchtower",kind:"tower",at:[11,0,-13],props:{height:8,radius:1.4}},{id:"lamp-a",kind:"lit-corner",at:[-2.5,.2,2.5]},{id:"lamp-b",kind:"lit-corner",at:[3.5,.2,2.5]},{id:"bench-a",kind:"bench",at:[.5,.2,3.4],rot:3.1416},{id:"well-rocks",kind:"rock",at:[.5,.2,-1.5],props:{size:1.2}},{id:"grove-w",kind:"grove",at:[-11,0,3]},{id:"crate-a",kind:"crate",at:[-3.4,.2,-.6]},{id:"crate-b",kind:"crate",at:[-2.6,.2,-1.2],rot:.6,props:{size:.8}},{id:"barrel-a",kind:"barrel",at:[-3.9,.2,-1.6]},{id:"start",kind:"spawn",at:[0,.2,5.5],tags:["spawn"]}]},Yl=km({catalog:Mt,container:document.getElementById("app"),level:Hm,storageKey:"gama.editor.level",subtitle:"Level editor",snap:.5,snapAngle:15});window.editorDebug=()=>{const{editor:i,level:e,game:t}=Yl;return{entities:i.toJSON().entities.length,built:e.objects.length,editable:i.editable.length,kinds:Mt.kinds.length,selection:i.selection,undo:i.undoLabel,historyLength:i.historyLength,paletteButtons:document.querySelectorAll(".ed-palette button").length,inspectorRows:document.querySelectorAll(".ed-inspector .ed-row").length,draws:t.renderer.info.render.calls,triangles:t.renderer.info.render.triangles}};window.editorSelfTest=()=>{const{editor:i}=Yl,e=i.historyLength,t=JSON.stringify(i.toJSON());i.select(i.editable[0].id),i.move(3,0,-2),i.commit(),i.rotate(.4),i.commit();const n=i.place({kind:"barrel",at:[2,0,2]}),r=i.duplicate();i.remove();const s=JSON.stringify(i.toJSON());let a=0;for(;i.historyLength>e&&i.undo();)a++;return{placed:!!n,duplicated:r.length,changed:s!==t,steps:a,restored:JSON.stringify(i.toJSON())===t,entities:i.toJSON().entities.length}};
