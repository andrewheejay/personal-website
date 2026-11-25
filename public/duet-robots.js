/* Duet robots: two arms working together, ray-marched in WebGL at a tiny
   resolution, then drawn as ASCII characters on a 2d canvas. Shared by the
   two robot pages. Call DuetRobots.start(canvas, options); it returns
   { toggle(), stop() }. */
(function(){
const RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const LOOP = 10.0;
const SCENES = [[0.0, 3.6, "handover"], [3.6, 3.2, "assembly"], [6.8, 3.2, "stacking"]];

function start(out, opt){
  opt = opt || {};
  const COLS = opt.cols || 196, ROWS = opt.rows || 66;
  const COLORS = opt.colors || ['#4a3c2c', '#a3434a', '#4f4fa0'];
  const FONT = opt.font || 'ui-monospace,"JetBrains Mono","SF Mono",Menlo,Consolas,monospace';
  const ramp = opt.ramp || RAMP;
  const glitch = opt.glitch !== false;
  const onTick = opt.onTick || function(){};

  const glc = document.createElement('canvas');
  glc.width = COLS; glc.height = ROWS;
  const gl = glc.getContext('webgl', {antialias:false, preserveDrawingBuffer:true});
  if (!gl) { if (opt.onFail) opt.onFail(); return { toggle(){}, stop(){} }; }

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FS = `
precision highp float;
uniform vec2 uRes; uniform float uAR; uniform float uZoom; uniform float uS; uniform float uT;
uniform vec3 uCam, uTgt; uniform float uFloorY; uniform float uScroll;
// scene 1
uniform vec3 uAT, uBT, uBar; uniform float uAO, uBO;
// scene 2
uniform vec3 uP1, uP2; uniform float uATw, uSpin;
// scene 3
uniform vec4 uBlk[4];   // xyz + yaw

float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float sdRBox(vec3 p, vec3 b, float r){ return sdBox(p,b-r)-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float sdCylY(vec3 p, float h, float r){ vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h); return min(max(d.x,d.y),0.)+length(max(d,0.)); }

vec3 ik(vec3 s, vec3 w, float L1, float L2, vec3 pole){
  vec3 d=w-s; float l=clamp(length(d),0.05,L1+L2-0.002);
  vec3 f=normalize(d);
  float a=(l*l+L1*L1-L2*L2)/(2.*l);
  float h=sqrt(max(L1*L1-a*a,0.));
  vec3 u=pole-f*dot(pole,f);
  u = length(u)<1e-3 ? vec3(0.,0.,1.) : normalize(u);
  return s+f*a+u*h;
}

// industrial arm on a base, gripper pointing down at tgt
float arm(vec3 p, vec3 base, vec3 tgt, float open, float LL, float tw){
  float bb = length(p-base-vec3(0.,.6,0.))-1.75;
  if(bb>.2) return bb;
  float d = sdCylY(p-base-vec3(0.,.04,0.), .04, .21);
  d = min(d, sdCylY(p-base-vec3(0.,.17,0.), .13, .11));
  vec3 s = base+vec3(0.,.34,0.);
  vec3 w = tgt+vec3(0.,.21,0.);
  vec3 e = ik(s,w,LL,LL,vec3(0.,1.,0.));
  d = min(d, length(p-s)-.105);
  d = min(d, sdCap(p,s,e,.08));
  d = min(d, length(p-e)-.092);
  d = min(d, sdCap(p,e,w,.066));
  d = min(d, length(p-w)-.068);
  vec2 hh = normalize(vec2(tgt.x-base.x, tgt.z-base.z)+vec2(1e-4,0.));
  float ph = atan(hh.y,hh.x)+tw;
  vec3 side = vec3(-sin(ph),0.,cos(ph));
  vec3 palm = w-vec3(0.,.07,0.);
  d = min(d, sdCap(p, palm-side*(open+.035), palm+side*(open+.035), .034));
  d = min(d, sdCap(p, palm+side*open, tgt+side*open-vec3(0.,.03,0.), .024));
  d = min(d, sdCap(p, palm-side*open, tgt-side*open-vec3(0.,.03,0.), .024));
  return d;
}

vec2 opU(vec2 a, vec2 b){ return a.x<b.x?a:b; }

/* ---- scene 1: two arms hand a bar across a table ---- */
float table(vec3 p){
  float tb = sdBox(p-vec3(0.,-.035,0.), vec3(1.35,.035,.72));
  vec3 q = vec3(abs(p.x)-1.25, p.y, abs(p.z)-.62);
  return min(tb, sdBox(q-vec3(0.,(uFloorY-.07)*.5,0.), vec3(.04,(-.07-uFloorY)*.5,.04)));
}
vec2 map1(vec3 p){
  vec2 r = vec2(p.y-uFloorY, 0.);
  float tb = table(p);
  tb = min(tb, sdCylY(p-vec3(-.42,.002,.3),.002,.15));
  tb = min(tb, sdCylY(p-vec3(.42,.002,-.3),.002,.15));
  r = opU(r, vec2(tb,1.));
  r = opU(r, vec2(arm(p, vec3(-.95,0.,0.), uAT, uAO, .56, uATw), 2.));
  r = opU(r, vec2(arm(p, vec3( .95,0.,0.), uBT, uBO, .56, 0.), 3.));
  r = opU(r, vec2(sdRBox(p-uBar, vec3(.26,.05,.05), .015), 4.));
  return r;
}

/* ---- scene 2: A holds a wheel, B slides an axle through its hub ---- */
vec2 map2(vec3 p){
  vec2 r = vec2(p.y-uFloorY, 0.);
  float tb = min(table(p), sdBox(p-vec3(-.45,.02,.3), vec3(.06,.02,.14)));   // wheel cradle
  tb = min(tb, sdCylY(p-vec3(.5,.002,-.3),.002,.14));
  r = opU(r, vec2(tb,1.));
  r = opU(r, vec2(arm(p, vec3(-.95,0.,0.), uAT, uAO, .56, uATw), 2.));
  r = opU(r, vec2(arm(p, vec3( .95,0.,0.), uBT, uBO, .56, 0.), 3.));
  // wheel: axis along x, spins about x
  vec3 q = p-uP1;
  float c = cos(uSpin), sn = sin(uSpin);
  q.yz = vec2(c*q.y-sn*q.z, sn*q.y+c*q.z);
  float wh = length(vec2(length(q.yz)-.3, q.x))-.04;                 // rim
  wh = min(wh, length(vec2(length(q.yz)-.055, q.x))-.025);             // hub ring (open hole)
  vec3 qa = vec3(q.x, abs(q.y), abs(q.z));
  wh = min(wh, sdCap(qa, vec3(0.,.07,0.), vec3(0.,.29,0.), .022));     // spokes
  wh = min(wh, sdCap(qa, vec3(0.,0.,.07), vec3(0.,0.,.29), .022));
  // axle: rod along x
  float ax = sdCap(p, uP2-vec3(.36,0.,0.), uP2+vec3(.36,0.,0.), .024);
  ax = min(ax, sdCylY((p-uP2-vec3(.36,0.,0.)).yxz, .02, .05));         // end cap
  r = opU(r, vec2(min(wh,ax),4.));
  return r;
}

/* ---- scene 3: two arms take turns stacking one tower ---- */
vec2 map3(vec3 p){
  vec2 r = vec2(p.y, 0.);
  r = opU(r, vec2(arm(p, vec3(-.85,0.,0.), uAT, uAO, .6, 0.), 2.));
  r = opU(r, vec2(arm(p, vec3( .85,0.,0.), uBT, uBO, .6, 0.), 3.));
  float mk = sdCylY(p-vec3(0.,.002,0.), .002, .24);                // tower footprint
  mk = min(mk, sdCylY(p-vec3(-.45,.002,.5), .002, .2));
  mk = min(mk, sdCylY(p-vec3(.45,.002,-.5), .002, .2));
  r = opU(r, vec2(mk,1.));
  for(int i=0;i<4;i++){
    vec4 b = uBlk[i];
    vec3 q = p-b.xyz;
    float c = cos(b.w), sn = sin(b.w);
    q.xz = vec2(c*q.x+sn*q.z, -sn*q.x+c*q.z);
    float m = (i==0 || i==2) ? 5. : 6.;                              // tinted by the arm that places it
    r = opU(r, vec2(sdRBox(q, vec3(.12), .016), m));
  }
  return r;
}

vec2 map(vec3 p){
  if(uS<.5) return map1(p);
  if(uS<1.5) return map2(p);
  return map3(p);
}

vec3 nrm(vec3 p){
  const vec2 e = vec2(1.,-1.)*.0015;
  return normalize(e.xyy*map(p+e.xyy).x + e.yyx*map(p+e.yyx).x + e.yxy*map(p+e.yxy).x + e.xxx*map(p+e.xxx).x);
}
float shadow(vec3 ro, vec3 rd){
  float res=1., t=.03;
  for(int i=0;i<28;i++){
    float h = map(ro+rd*t).x;
    res = min(res, 10.*h/t);
    t += clamp(h,.02,.25);
    if(res<.01 || t>6.) break;
  }
  return clamp(res,0.,1.);
}

void main(){
  vec2 uv = (gl_FragCoord.xy/uRes)*2.-1.; uv.x *= uAR;
  vec3 ro = uCam;
  vec3 f = normalize(uTgt-ro), r = normalize(cross(f,vec3(0.,1.,0.))), u = cross(r,f);
  vec3 rd = normalize(f*2.5*uZoom + r*uv.x + u*uv.y);
  float t = 0., m = -1.;
  for(int i=0;i<110;i++){
    vec2 h = map(ro+rd*t);
    if(h.x < .0015*t){ m = h.y; break; }
    t += h.x*.9;
    if(t>24.) break;
  }
  vec3 L = normalize(vec3(-.45,.85,.45));
  float dens; float mat = 0.;
  if(m<0.){
    dens = .015 + .03*(1.-uv.y)*.5;      // empty air: faint
  } else {
    vec3 p = ro+rd*t;
    vec3 n = nrm(p);
    float sh = shadow(p+n*.01, L);
    float fog = exp(-max(t-3.,0.)*.12);
    if(m<.5){                            // floor with grid
      vec2 g = (p.xz+vec2(uScroll,0.))*2.;
      vec2 gl2 = abs(fract(g)-.5);
      float line = smoothstep(.43,.5,max(gl2.x,gl2.y));
      dens = .035 + .12*line + .24*(1.-sh);
      dens *= fog;
    } else {
      float dif = clamp(dot(n,L),0.,1.)*(.35+.65*sh);
      float amb = .5+.5*n.y;
      float rim = pow(1.-abs(dot(n,-rd)),3.);
      float lit = .3*amb + .7*dif;
      dens = .48 + .45*lit + .12*rim;
      if(m<1.5) dens = .16 + .34*lit;     // props: lighter
      if(m>3.5) dens = .62 + .38*lit;     // cargo: darker ink
      dens *= mix(.55,1.,fog);
      mat = m;
    }
  }
  gl_FragColor = vec4(clamp(dens,0.,1.), mat/8., 0., 1.);
}`;


  function sh(type, src){
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.viewport(0,0,COLS,ROWS);
  const U = {};
  ['uRes','uAR','uZoom','uS','uT','uCam','uTgt','uFloorY','uScroll','uAT','uBT','uBar','uAO','uBO','uP1','uP2','uATw','uSpin','uBlk']
    .forEach(n => U[n] = gl.getUniformLocation(prog, n==='uBlk' ? 'uBlk[0]' : n));
  const pix = new Uint8Array(COLS*ROWS*4);

/* ---------------- choreography ---------------- */
const ease = x => x<=0?0:x>=1?1:x*x*(3-2*x);
const seg = (t,a,b) => ease((t-a)/(b-a));
const lerp = (a,b,k) => a+(b-a)*k;
const L3 = (a,b,k) => [lerp(a[0],b[0],k), lerp(a[1],b[1],k), lerp(a[2],b[2],k)];
const add = (a,b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const arc = (a,b,k,h) => { const p = L3(a,b,k); p[1] += Math.sin(Math.PI*k)*h; return p; };

function scene1(t){
  const GO=.17, OPEN=.12, CLOSED=.074, UP=[0,.26,0];
  const P0=[-.42,.05,.3], H=[0,.6,0], P1=[.42,.05,-.3];
  const aP0=add(P0,[-GO,0,0]), aH=add(H,[-GO,0,0]);
  const bH=add(H,[GO,0,0]), bP1=add(P1,[GO,0,0]);
  const RA=[-.52,.62,.06], RB=[.52,.62,-.06];
  let A, aO=OPEN, B, bO=OPEN, bar;
  if(t<.45)      A = L3(RA, add(aP0,UP), seg(t,0,.45));
  else if(t<.7)  A = L3(add(aP0,UP), aP0, seg(t,.45,.7));
  else if(t<.85){A = aP0; aO = lerp(OPEN,CLOSED,seg(t,.7,.85));}
  else if(t<1.55){A = arc(aP0,aH,seg(t,.85,1.55),.12); aO=CLOSED;}
  else if(t<1.75){A = aH; aO=CLOSED;}
  else if(t<1.9){A = aH; aO = lerp(CLOSED,OPEN,seg(t,1.75,1.9));}
  else if(t<2.7) A = arc(aH, RA, seg(t,1.9,2.7), .08);
  else A = RA;
  if(t<1.1)      B = RB;
  else if(t<1.55) B = L3(RB, bH, seg(t,1.1,1.55));
  else if(t<1.75){B = bH; bO = lerp(OPEN,CLOSED,seg(t,1.55,1.72));}
  else if(t<2.6){B = arc(bH, add(bP1,UP), seg(t,1.75,2.6), .1); bO=CLOSED;}
  else if(t<2.85){B = L3(add(bP1,UP), bP1, seg(t,2.6,2.85)); bO=CLOSED;}
  else if(t<3.0){B = bP1; bO = lerp(CLOSED,OPEN,seg(t,2.85,3.0));}
  else B = arc(bP1, RB, seg(t,3.0,3.6), .2);
  if(t<.85) bar=P0;
  else if(t<1.55) bar=add(A,[GO,0,0]);
  else if(t<1.9) bar=H;
  else if(t<2.85) bar=add(B,[-GO,0,0]);
  else bar=P1;
  const a = -.55 + .4*(t/3.6), rad = lerp(3.2,2.8,ease(t/3.6));
  gl.uniform3fv(U.uAT, A); gl.uniform3fv(U.uBT, B); gl.uniform3fv(U.uBar, bar);
  gl.uniform1f(U.uAO, aO); gl.uniform1f(U.uBO, bO);
  gl.uniform3f(U.uCam, rad*Math.sin(a), 1.55, rad*Math.cos(a));
  gl.uniform3f(U.uTgt, 0, .48, 0);
  gl.uniform1f(U.uFloorY, -.75); gl.uniform1f(U.uScroll, 0);
}

function scene2(t){
  const UP=[0,.24,0];
  const R=.3, W0=[-.45,.34,.3], H=[-.05,.4,0];     // wheel: in its cradle, then held up at H
  const ROD0=[.5,.035,-.3], GO=.25;                  // axle lying on B's side; B grips near its right end
  const RA=[-.52,.66,.06], RB=[.52,.66,-.06];
  const aOPEN=.1, aCL=.06, bOPEN=.09, bCL=.05;
  const gA0 = add(W0,[0,R,0]), gAH = add(H,[0,R,0]);
  const align=[.55,.4,0], seated=[-.1,.4,0];
  const lift=[0, .14*seg(t,2.35,2.95), 0];
  let A, aO=aOPEN, B, bO=bOPEN, wc, rod;
  // A: picks the wheel up by its rim and holds it steady, hub facing B
  if(t<.4)        A = L3(RA, add(gA0,UP), seg(t,0,.4));
  else if(t<.6)   A = L3(add(gA0,UP), gA0, seg(t,.4,.6));
  else if(t<.72){ A = gA0; aO = lerp(aOPEN,aCL,seg(t,.6,.72)); }
  else if(t<1.3){ A = arc(gA0, gAH, seg(t,.72,1.3), .1); aO=aCL; }
  else if(t<2.1){ A = gAH; aO=aCL; }
  else if(t<2.25){A = gAH; aO = lerp(aCL,aOPEN,seg(t,2.1,2.25)); }
  else            A = arc(gAH, RA, seg(t,2.25,2.9), .1);
  // B: picks up the axle and slides it through the hub
  const g = c => add(c,[GO,0,0]);
  if(t<.45)        B = L3(RB, add(g(ROD0),UP), seg(t,0,.45));
  else if(t<.65)   B = L3(add(g(ROD0),UP), g(ROD0), seg(t,.45,.65));
  else if(t<.78){  B = g(ROD0); bO = lerp(bOPEN,bCL,seg(t,.65,.78)); }
  else if(t<1.4){  B = arc(g(ROD0), g(align), seg(t,.78,1.4), .15); bO=bCL; }
  else if(t<2.1){  B = L3(g(align), g(seated), seg(t,1.4,2.1)); bO=bCL; }   // the insertion
  else {           B = add(g(seated), lift); bO=bCL; }
  rod = t<.78 ? ROD0 : add(B,[-GO,0,0]);
  wc  = t<.72 ? W0 : t<1.3 ? add(A,[0,-R,0]) : add(H,lift);
  const spin = t<2.2 ? 0 : 7*(t-2.2)*(t-2.2);         // let go, and it turns freely on the axle
  gl.uniform3fv(U.uAT, A); gl.uniform3fv(U.uBT, B);
  gl.uniform1f(U.uAO, aO); gl.uniform1f(U.uBO, bO);
  gl.uniform1f(U.uATw, Math.PI/2);                    // A's fingers turned to pinch the rim
  gl.uniform3fv(U.uP1, wc); gl.uniform3fv(U.uP2, rod); gl.uniform1f(U.uSpin, spin);
  const a = -.72 + .2*(t/3.2), rad = lerp(3.0,2.35,ease(t/3.2));
  gl.uniform3f(U.uCam, rad*Math.sin(a), 1.05, rad*Math.cos(a));
  gl.uniform3f(U.uTgt, .1, .42, 0);
  gl.uniform1f(U.uFloorY, -.75); gl.uniform1f(U.uScroll, 0);
}

function scene3(t){
  const UP=[0,.26,0], OPEN=.19, CL=.145;
  const BA=[-.85,0,0], BB=[.85,0,0];
  const PA=[-.45,0,.5], PB=[.45,0,-.5];
  const slot = k => [0, .12+.245*k, 0];
  const pileA = [[PA[0],.36,PA[2]], [PA[0],.12,PA[2]]];
  const pileB = [[PB[0],.36,PB[2]], [PB[0],.12,PB[2]]];
  // [start, pick point, slot, block id]; A places blocks 0 and 2, B places 1 and 3
  const plansA = [[.0, pileA[0], slot(0), 0], [1.3, pileA[1], slot(2), 2]];
  const plansB = [[.65, pileB[0], slot(1), 1], [1.82, pileB[1], slot(3), 3]];
  function path(t, plans, R){
    let last = add(plans[0][1],UP), lastT = -9;
    for(const [t0,pile,sl,id] of plans){
      const pu = add(pile,UP), su = add(sl,UP);
      if(t < t0){ const a = Math.max(lastT, t0-.4);
        return {p: t<a ? last : arc(last,pu,seg(t,a,t0),.1), o:OPEN, c:-1}; }
      const u = t-t0;
      if(u<.18)  return {p:L3(pu,pile,seg(u,0,.18)), o:OPEN, c:-1};
      if(u<.28)  return {p:pile, o:lerp(OPEN,CL,seg(u,.18,.28)), c:id};
      if(u<.75)  return {p:arc(pile,su,seg(u,.28,.75),.18), o:CL, c:id};
      if(u<.9)   return {p:L3(su,sl,seg(u,.75,.9)), o:CL, c:id};
      if(u<1.0)  return {p:sl, o:lerp(CL,OPEN,seg(u,.9,1.0)), c:-1};
      if(u<1.15) return {p:L3(sl,su,seg(u,1.0,1.15)), o:OPEN, c:-1};
      last = su; lastT = t0+1.15;
    }
    return {p: arc(last, R, seg(t,lastT,lastT+.5), .1), o:OPEN, c:-1};
  }
  const A = path(t, plansA, [-.66,.62,-.3]), B = path(t, plansB, [.66,.62,-.3]);
  const yawOf = (base,p) => Math.atan2(p[2]-base[2], p[0]-base[0]);
  const blk = new Float32Array(16);
  for(const [plans, arm, base] of [[plansA,A,BA],[plansB,B,BB]]){
    for(const [t0,pile,sl,id] of plans){
      let p, y;
      if(arm.c===id){ p = arm.p; y = yawOf(base, arm.p); }
      else if(t < t0+.2){ p = pile; y = yawOf(base, pile); }
      else { p = sl; y = 0; }
      blk.set([p[0],p[1],p[2],y], id*4);
    }
  }
  gl.uniform4fv(U.uBlk, blk);
  gl.uniform3fv(U.uAT, A.p); gl.uniform3fv(U.uBT, B.p);
  gl.uniform1f(U.uAO, A.o); gl.uniform1f(U.uBO, B.o);
  const a = .75 - .72*ease(t/3.2), rad = lerp(2.9,2.6,ease(t/3.2));
  gl.uniform3f(U.uCam, rad*Math.sin(a), lerp(1.15,1.5,ease(t/3.2)), rad*Math.cos(a));
  gl.uniform3f(U.uTgt, 0, .45, 0);
  gl.uniform1f(U.uFloorY, 0); gl.uniform1f(U.uScroll, 0);
}


  const ctx = out.getContext('2d');
  let cw=4, lh=6, fs=6.5, AR=1.78;
  function layout(){
    const W = out.parentElement.clientWidth || 600;
    ctx.font = '100px ' + FONT;
    const ratio = ctx.measureText('M').width/100;
    fs = W/(COLS*ratio); cw = W/COLS; lh = fs*(opt.lineHeight || 1.02);
    const H = ROWS*lh, dpr = window.devicePixelRatio||1;
    out.width = Math.round(W*dpr); out.height = Math.round(H*dpr);
    out.style.width = W+'px'; out.style.height = H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.font = fs + 'px ' + FONT;
    ctx.textBaseline = 'top';
    AR = (COLS*cw)/(ROWS*lh);
  }
  layout();
  const ro = new ResizeObserver(layout); ro.observe(out.parentElement);

  const hash = (a,b) => { let h = (a*374761393 + b*668265263) | 0; h = (h^(h>>>13))*1274126177 | 0; return ((h^(h>>>16))>>>0)/4294967296; };
  const NB = 10;
  const buckets = Array.from({length:3*NB}, () => []);
  const RL = ramp.length-1;
  const chars = new Array(COLS*ROWS);

  function draw(T, frame){
    const si = T<SCENES[1][0] ? 0 : T<SCENES[2][0] ? 1 : 2;
    const st = T-SCENES[si][0];
    gl.uniform2f(U.uRes, COLS, ROWS); gl.uniform1f(U.uAR, AR); gl.uniform1f(U.uZoom, opt.zoom || 1);
    gl.uniform1f(U.uS, si); gl.uniform1f(U.uT, st);
    [scene1,scene2,scene3][si](st);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.readPixels(0,0,COLS,ROWS,gl.RGBA,gl.UNSIGNED_BYTE,pix);

    let g = 0;
    if (glitch) for(const c of [0, 3.6, 6.8, 10]) g = Math.max(g, 1-Math.abs(T-c)/.22);
    g = Math.max(0,g);
    const fb = frame>>1;

    for(const b of buckets) b.length = 0;
    ctx.clearRect(0,0,out.width,out.height);
    for(let y=0;y<ROWS;y++){
      let shift = 0;
      if(g>0 && hash(y,fb+7) < g*.35) shift = Math.round((hash(y,fb)-.5)*18*g);
      for(let x=0;x<COLS;x++){
        const sx = Math.min(COLS-1, Math.max(0, x+shift));
        const i = ((ROWS-1-y)*COLS + sx)*4;
        let d = pix[i]/255; const m = Math.round(pix[i+1]/255*8);
        d += (hash(x*31+y, fb>>1)-.5)*.07;
        if(g>0 && hash(x+y*COLS, fb) < g*.55) d = hash(y*COLS+x, fb+3)*.9;
        d = Math.min(1, Math.max(0, d));
        const ci = Math.round(d*RL);
        if(ci===0) continue;
        const col = (m===2||m===5) ? 1 : (m===3||m===6) ? 2 : 0;
        const a = Math.min(NB-1, Math.floor((.12 + d*.95)*NB));
        chars[y*COLS+x] = ramp[ci];
        buckets[col*NB+a].push(y*COLS+x);
      }
    }
    for(let c=0;c<3;c++){
      ctx.fillStyle = COLORS[c];
      for(let a=0;a<NB;a++){
        const list = buckets[c*NB+a]; if(!list.length) continue;
        ctx.globalAlpha = (a+1)/NB;
        for(const k of list) ctx.fillText(chars[k], (k%COLS)*cw, ((k/COLS)|0)*lh);
      }
    }
    ctx.globalAlpha = 1;
    onTick(T, LOOP, si, SCENES[si][2]);
  }

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = reduce, t0 = performance.now(), held = reduce ? 1.6 : 0, frame = 0, raf = 0, alive = true;
  function tick(now){
    if(!alive) return;
    if(!paused){ held = ((now - t0)/1000) % LOOP; frame++; }
    draw(held, frame);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return {
    toggle(){ if(paused){ t0 = performance.now() - held*1000; paused = false; } else paused = true; return paused; },
    stop(){ alive = false; cancelAnimationFrame(raf); ro.disconnect(); }
  };
}
window.DuetRobots = { start, LOOP, SCENES };
})();
