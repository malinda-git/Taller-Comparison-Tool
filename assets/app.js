(function(){
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var COLORS=['#2E86AB','#E4572E','#76B041','#F3A712','#8E6BBF','#2BB3A3','#D1478C','#6B7A8F'];
var P=function(d){return '<path d="'+d+'"/>'};
var R=function(x,y,w,h,e){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(e||'')+'/>'};
var CUT=' fill="var(--panel)"';

/* ---------- people: role -> look ---------- */
var ROLES={
  man:{l:'Man',cm:175,s:'m',hr:6.5},
  father:{l:'Father',cm:178,s:'m',hr:6.5,sx:1.1},
  uncle:{l:'Uncle',cm:174,s:'m',hr:6.5,sx:1.05,belly:1},
  grandfather:{l:'Grandfather',cm:166,s:'m',hr:6.5,stoop:1,cane:1},
  teenboy:{l:'Teen boy',cm:170,s:'m',hr:7,sx:.92},
  boy:{l:'Boy',cm:128,s:'m',hr:8.4,sx:.85},
  woman:{l:'Woman',cm:162,s:'f',hr:6.5},
  wife:{l:'Wife / mother',cm:163,s:'f',hr:6.5,hair:'long'},
  aunt:{l:'Aunt',cm:160,s:'f',hr:6.5,hair:'bob'},
  grandmother:{l:'Grandmother',cm:154,s:'f',hr:6.5,hair:'bun',stoop:1,cane:1},
  teengirl:{l:'Teen girl',cm:160,s:'f',hr:6.8,sx:.9,hair:'pony'},
  girl:{l:'Girl',cm:126,s:'f',hr:8.4,sx:.85,hair:'pig'},
  toddler:{l:'Toddler',cm:90,s:'t',hr:11}
};
var MP='M12 18.5Q20 15.5 28 18.5L34 21L35 50L30 50L29 34L28.5 56L27.5 100L21.5 100L20 62L18.5 100L12.5 100L11.5 56L11 34L10 50L5 50L6 21Z';
var FP='M13 17Q20 14.5 27 17L31 21L32 46L29 46L28.5 32L33 62L7 62L11.5 32L11 46L8 46L9 21Z'+
      'M14 61H18.6V100H14ZM21.4 61H26V100H21.4Z';
var TP='M12 26Q20 22 28 26L30 62L26 62L25 100L21 100L20 70L19 100L15 100L14 62L10 62Z';
function person(role){
  var r=ROLES[role]||ROLES.man,cy=r.hr+0.5,s='';
  var body=r.s==='f'?FP:(r.s==='t'?TP:MP);
  s+=P(body);
  if(r.belly)s+='<ellipse cx="20" cy="44" rx="9" ry="8"/>';
  s+='<circle cx="20" cy="'+cy+'" r="'+r.hr+'"/>';
  var k=r.hr/6.5,hg='';
  if(r.hair==='long')hg=P('M13.2 7C13-1 27-1 26.8 7L27.6 24L24 24L24 12L16 12L16 24L12.4 24Z');
  if(r.hair==='bob')hg=P('M13.2 7C13-1 27-1 26.8 7L27.2 15L12.8 15Z');
  if(r.hair==='bun')hg='<circle cx="20" cy="-1.5" r="3.2"/>'+P('M13.4 7C13.4 0 26.6 0 26.6 7L26 11L14 11Z');
  if(r.hair==='pony')hg=P('M24.5 3Q33 6 30 20Q28 11 24 8Z');
  if(r.hair==='pig')hg='<circle cx="11.6" cy="10" r="2.8"/><circle cx="28.4" cy="10" r="2.8"/>';
  if(hg)s+='<g transform="translate(20 '+cy+') scale('+k+') translate(-20 -7)">'+hg+'</g>';
  if(r.cane)s+='<path d="M31.5 52L34 100" stroke="currentColor" stroke-width="1.4" fill="none"/>';
  var tf=[];
  if(r.sx&&r.sx!==1)tf.push('translate(20 0) scale('+r.sx+' 1) translate(-20 0)');
  var g='<g'+(tf.length?' transform="'+tf.join(' ')+'"':'')+'>'+s+'</g>';
  if(r.stoop)g='<g transform="rotate(6 20 100)">'+g+'</g>';
  return g;
}

/* ---------- building drawings (unit box: height 100, width w) ---------- */
function petr(cx){var a=[[-6,100],[-6,72],[-5,72],[-5,52],[-4,52],[-4,34],[-3,34],[-3,20],[-1.8,14],[-.5,4],[-.3,0],[.3,0],[.5,4],[1.8,14],[3,20],[3,34],[4,34],[4,52],[5,52],[5,72],[6,72],[6,100]];
  return P('M'+a.map(function(p){return (cx+p[0])+' '+p[1]}).join('L')+'Z')}
function sail(x,wd,hh){return P('M'+x+' 100C'+x+' '+(100-hh*.7)+' '+(x+wd*.35)+' '+(100-hh)+' '+(x+wd)+' '+(100-hh*.55)+'L'+(x+wd)+' 100Z')}
var DRAW={
  burj:{w:24,d:function(){return P('M4 100L4 82L5.5 82L5.5 68L7 68L7 56L8 56L8 46L9 46L9 37L10 37L10 29L10.8 29L10.8 22L11.4 22L11.4 14L11.8 14L11.8 0L12.2 0L12.2 14L12.6 14L12.6 22L13.2 22L13.2 29L14 29L14 37L15 37L15 46L16 46L16 56L17 56L17 68L18.5 68L18.5 82L20 82L20 100Z')}},
  merdeka:{w:22,d:function(){return P('M5 100L7.5 30L9.5 14L10.7 10L10.7 0L11.3 0L11.3 10L12.5 14L14.5 30L17 100Z')}},
  shanghai:{w:22,d:function(){return P('M5.5 100C6.5 72 8 42 9.5 20L11 5L13.5 0C14.2 14 15.5 42 16.5 72L17.5 100Z')}},
  clock:{w:34,d:function(){return R(0,55,9,45)+R(25,55,9,45)+R(0,50,9,6)+R(25,50,9,6)+R(12,28,10,72)+R(8.5,24,17,12)+'<circle cx="17" cy="30" r="4.2"'+CUT+'/>'+R(11,12,12,12)+P('M12 12L17 3L22 12Z')+R(16.6,0,.8,4)}},
  taipei:{w:22,d:function(){var s=R(3.5,87,15,13);for(var i=0;i<8;i++){var y0=87-i*7.2,y1=y0-6.6;s+=P('M7.6 '+y0+'L6.4 '+y1+'L15.6 '+y1+'L14.4 '+y0+'Z')}
    return s+P('M9.6 30L9.6 22L10.6 18L10.6 6L11 0L11.4 6L11.4 18L12.4 22L12.4 30Z')}},
  petronas:{w:34,d:function(){return petr(8)+petr(26)+R(13,60,10,2.6)+R(13,64.5,10,.8)+R(2,94,30,6)}},
  empire:{w:20,d:function(){return P('M3 100L3 78L5 78L5 66L6.5 66L6.5 52L8 52L8 38L9 38L9 22L9.6 22L9.6 16L9.85 16L9.85 0L10.15 0L10.15 16L10.4 16L10.4 22L11 22L11 38L12 38L12 52L13.5 52L13.5 66L15 66L15 78L17 78L17 100Z')}},
  alarab:{w:26,d:function(){return P('M5 100L5 9C15 20 25 56 23 100Z')+P('M3.6 100L3.6 6L4.4 0L5 6L5 100Z')+R(0,97,26,3)}},
  owtc:{w:20,d:function(){return P('M3 100L3 24L9.6 20L9.6 0L10.4 0L10.4 20L17 24L17 100Z')}},
  eiffel:{w:26,d:function(){return P('M1 100C4 90 8 70 10.8 52C11.8 40 12.4 20 13 0C13.6 20 14.2 40 15.2 52C18 70 22 90 25 100L21 100C20 92 17 86 13 86C9 86 6 92 5 100Z')+R(6.8,63,12.4,2.2)+R(10.4,37,5.2,1.6)}},
  cn:{w:14,d:function(){return P('M4.8 100L6.3 40L6.5 20L6.9 0L7.1 0L7.5 20L7.7 40L9.2 100Z')+'<ellipse cx="7" cy="38" rx="4.4" ry="2.4"/><ellipse cx="7" cy="21" rx="1.5" ry="1"/>'}},
  liberty:{w:18,d:function(){return R(2,88,14,12)+R(4,50,10,38)+P('M6.5 50L7 28L11 28L11.5 50Z')+'<circle cx="9" cy="23" r="3"/>'+P('M10.5 28L12.8 10L13.8 10.6L11.6 29Z')+P('M12.4 10L13.2 0L14.2 10Z')+R(5,32,2.2,6)+P('M6.4 21L4.6 18L7 19.6ZM9 19.8L9 16.6L9.8 19.8ZM11.6 19.6L13.4 18L11.6 21Z')}},
  pyramid:{w:166,d:function(){return P('M0 100L83 0L166 100Z')}},
  taj:{w:130,d:function(){return R(0,94,130,6)+R(40,52,50,42)+R(58,64,14,30,CUT)+P('M48 52C45 38 55 26 65 16C75 26 85 38 82 52Z')+R(64.4,2,1.2,14)+P('M42 52L42 44Q46 38 50 44L50 52Z')+P('M80 52L80 44Q84 38 88 44L88 52Z')+R(8,34,4,60)+P('M7 34L10 26L13 34Z')+R(118,34,4,60)+P('M117 34L120 26L123 34Z')}},
  opera:{w:185,d:function(){return sail(10,48,100)+sail(40,42,78)+sail(64,38,56)+sail(112,40,80)+sail(138,34,58)+R(0,92,185,8)}},
  bigben:{w:14,d:function(){return R(3,36,8,64)+R(2.5,22,9,14)+'<circle cx="7" cy="29" r="3.2"'+CUT+'/>'+P('M3.5 22L7 6L10.5 22Z')+R(6.8,0,.4,7)}},
  colosseum:{w:390,d:function(){var s=R(0,0,390,100),i,x;for(i=0;i<38;i++){x=6+i*10;s+=R(x,5,2.6,8,CUT)+R(x,26,5.5,18,' rx="2.7"'+CUT)+R(x,50,5.5,18,' rx="2.7"'+CUT)+R(x,74,5.5,26,' rx="2.7"'+CUT)}return s}},
  pisa:{w:22,d:function(){var s=R(4,90,14,10,' stroke="var(--panel)" stroke-width=".6"'),i;for(i=0;i<6;i++)s+=R(5,90-(i+1)*11.5,12,10.9,' stroke="var(--panel)" stroke-width=".6"');
    return '<g transform="rotate(-4 11 100)">'+s+R(7.5,2,7,19)+'</g>'}},
  lotte:{w:22,d:function(){return P('M5 100C6 60 8 30 9.5 16C10 10 10.6 5 11 0C11.4 5 12 10 12.5 16C14 30 16 60 17 100Z')}},
  willis:{w:26,d:function(){return P('M0 100L0 34L8.7 34L8.7 0L17.3 0L17.3 18L26 18L26 100Z')+R(8.5,34,.5,66,CUT)+R(17.1,18,.5,82,CUT)}}
};
var GEN={
  tower:{l:'Tower',w:16,d:function(){return R(2,10,12,90)+P('M7.6 10L8 0L8.4 10Z')}},
  spire:{l:'Tapered spire',w:16,d:function(){return P('M3 100L7 8L8 0L9 8L13 100Z')}},
  stepped:{l:'Stepped tower',w:20,d:DRAW.empire.d},
  block:{l:'Office block',w:40,d:function(){var s=R(0,0,40,100),r,c;for(r=0;r<12;r++)for(c=0;c<6;c++)s+=R(3+c*6,4+r*7.8,3.6,4.6,CUT);return s}},
  house:{l:'House',w:70,d:function(){return R(0,48,70,52)+P('M-4 48L35 8L74 48Z')+R(10,62,12,14,CUT)+R(48,62,12,14,CUT)+R(30,70,10,30,CUT)}}
};

/* ---------- building facts (v = checked against public sources) ---------- */
var BUILD=[
 {k:'burj',n:'Burj Khalifa',cm:82800,city:'Dubai',country:'United Arab Emirates',year:2009,floors:'154 habitable (+9 service)',architect:'Adrian Smith (SOM)',contractor:'Samsung C&T / BESIX / Arabtec',client:'Emaar Properties',note:'Architectural height including spire. Completed 2009, opened January 2010.',v:1},
 {k:'merdeka',n:'Merdeka 118',cm:67890,city:'Kuala Lumpur',country:'Malaysia',year:2023,floors:'118 (+5 basements)',architect:'Fender Katsalidis with RSP',contractor:'Samsung C&T / UEM Group',client:'PNB Merdeka Ventures (PNB)',note:'Second tallest building in the world.',v:1},
 {k:'shanghai',n:'Shanghai Tower',cm:63200,city:'Shanghai',country:'China',year:2014,floors:'128 (+5 basements)',architect:'Gensler; TJAD',contractor:'Shanghai Construction Group',client:'Shanghai Tower Construction & Development',note:'Completed 2014, opened to the public in 2015. Sources differ on the exact owner company name.',v:1},
 {k:'clock',n:'Makkah Royal Clock Tower',cm:60100,city:'Mecca',country:'Saudi Arabia',year:2011,floors:'120',architect:'SL Rasch; Dar Al-Handasah',contractor:'Saudi Binladin Group',client:'Government-owned (Abraj Al Bait complex)',note:'Sources list 601 m or 607 m. Opened 2012.',v:1},
 {k:'taipei',n:'Taipei 101',cm:50820,city:'Taipei',country:'Taiwan',year:2004,floors:'101',architect:'C.Y. Lee & Partners',contractor:'KTRT Joint Venture (Kumagai Gumi, RSEA, Ta-Yo-Wei, Samsung C&T)',client:'Taipei Financial Center Corporation',note:'Eight stacked modules inspired by pagoda forms.',v:1},
 {k:'petronas',n:'Petronas Twin Towers',cm:45190,city:'Kuala Lumpur',country:'Malaysia',year:1996,floors:'88',architect:'Cesar Pelli; Adamson Associates',contractor:'Tower 1: Hazama Corp. Tower 2: Samsung C&T',client:'KLCC Holdings',note:'Completion is often quoted as 1996 (structure) and 1998 (opening).',v:1},
 {k:'empire',n:'Empire State Building',cm:44320,city:'New York City',country:'United States',year:1931,floors:'102',architect:'Shreve, Lamb & Harmon',contractor:'Starrett Brothers & Eken',client:'Empire State Inc. (developer); now Empire State Realty Trust',note:'Height shown is to the antenna tip. Roof height is 381 m.',v:1},
 {k:'alarab',n:'Burj Al Arab',cm:32100,city:'Dubai',country:'United Arab Emirates',year:1999,floors:'56 (incl. 3 below ground)',architect:'Tom Wright (Atkins)',contractor:'Murray & Roberts / Concor',client:'Jumeirah Group',note:'Built on an artificial island.',v:1},
 {k:'owtc',n:'One World Trade Center',cm:54130,city:'New York City',country:'United States',year:2014,floors:'94 (+5 basements)',architect:'David Childs (SOM)',contractor:'Tishman Construction',client:'Port Authority of New York and New Jersey',note:'Symbolic height of 1,776 ft (541.3 m) to the top of the spire.',v:1},
 {k:'eiffel',n:'Eiffel Tower',cm:33000,city:'Paris',country:'France',year:1889,floors:'3 public levels',architect:'Stephen Sauvestre (design); Koechlin & Nouguier (engineers)',contractor:'Compagnie des Etablissements Eiffel',client:'City of Paris',note:'Height shown includes antennas. Architectural height is 300 m.',v:1},
 {k:'cn',n:'CN Tower',cm:55330,city:'Toronto',country:'Canada',year:1976,floors:'Observation levels',architect:'—',contractor:'—',client:'Canadian National Railway (original)',note:'Basic details only. Verify before relying on them.',v:0},
 {k:'lotte',n:'Lotte World Tower',cm:55450,city:'Seoul',country:'South Korea',year:2017,floors:'123',architect:'—',contractor:'—',client:'Lotte Group',note:'Basic details only. Verify before relying on them.',v:0},
 {k:'willis',n:'Willis Tower',cm:44200,city:'Chicago',country:'United States',year:1973,floors:'108',architect:'SOM',contractor:'—',client:'Sears, Roebuck and Co. (original)',note:'Roof height shown. Antennas bring it to about 527 m. Basic details only.',v:0},
 {k:'pyramid',n:'Great Pyramid of Giza',cm:13850,city:'Giza',country:'Egypt',year:'c. 2560 BC',floors:'—',architect:'—',contractor:'—',client:'Pharaoh Khufu',note:'Current height. Original height was about 146.6 m. Basic details only.',v:0},
 {k:'taj',n:'Taj Mahal',cm:7300,city:'Agra',country:'India',year:1653,floors:'—',architect:'Ustad Ahmad Lahori (commonly credited)',contractor:'—',client:'Emperor Shah Jahan',note:'Height from plinth to finial. Basic details only.',v:0},
 {k:'opera',n:'Sydney Opera House',cm:6500,city:'Sydney',country:'Australia',year:1973,floors:'—',architect:'Jorn Utzon',contractor:'—',client:'New South Wales Government',note:'Basic details only. Verify before relying on them.',v:0},
 {k:'liberty',n:'Statue of Liberty',cm:9300,city:'New York City',country:'United States',year:1886,floors:'—',architect:'Frederic Auguste Bartholdi (sculptor)',contractor:'—',client:'—',note:'Ground to torch, including the pedestal. Basic details only.',v:0},
 {k:'bigben',n:'Elizabeth Tower (Big Ben)',cm:9600,city:'London',country:'United Kingdom',year:1859,floors:'—',architect:'Charles Barry; A.W.N. Pugin',contractor:'—',client:'Parliament',note:'Basic details only. Verify before relying on them.',v:0},
 {k:'colosseum',n:'Colosseum',cm:4800,city:'Rome',country:'Italy',year:'AD 80',floors:'4 storeys',architect:'—',contractor:'—',client:'Emperors Vespasian and Titus',note:'Roughly 188 m long. Basic details only.',v:0},
 {k:'pisa',n:'Leaning Tower of Pisa',cm:5590,city:'Pisa',country:'Italy',year:1372,floors:'8 levels',architect:'—',contractor:'—',client:'—',note:'Leans about 4 degrees. Basic details only.',v:0}
];
var BMAP={};BUILD.forEach(function(b){BMAP[b.k]=b});

var CELEBS=[
  {n:'Michael Jordan',cm:198,role:'man'},{n:'LeBron James',cm:206,role:'man'},{n:'Shaquille O’Neal',cm:216,role:'man'},
  {n:'Yao Ming',cm:229,role:'man'},{n:'Dwayne Johnson',cm:196,role:'man'},{n:'Usain Bolt',cm:195,role:'man'},
  {n:'Cristiano Ronaldo',cm:187,role:'man'},{n:'Lionel Messi',cm:170,role:'man'},{n:'Tom Cruise',cm:170,role:'man'},
  {n:'Kevin Hart',cm:163,role:'man'},{n:'Taylor Swift',cm:180,role:'woman'},{n:'Zendaya',cm:178,role:'woman'},
  {n:'Robert Wadlow (record)',cm:272,role:'man'}
];
var THINGS=[
  {n:'Door',cm:203,w:90},{n:'Fridge',cm:180,w:70},{n:'Soccer goal',cm:244,w:732},{n:'Basketball hoop',cm:305,w:60},
  {n:'Sedan car',cm:145,w:450},{n:'African elephant',cm:330,w:350},{n:'Giraffe',cm:550,w:160},{n:'Double-decker bus',cm:440,w:1000}
];

/* ---------- state ---------- */
var unit='cm',items=[],uid=1,sorted=false,tab='people',sel=null,zi=0,Q='',cmp=false,pair=[];
var ZS=[1,1.6,2.5,4,7,12,20,35];
var mine=[];
try{var su=localStorage.getItem('hl-unit');if(su==='cm'||su==='m'||su==='ftin')unit=su}catch(e){}
try{mine=JSON.parse(localStorage.getItem('hl-mine')||'[]');if(!Array.isArray(mine))mine=[]}catch(e){mine=[]}

/* ---------- formatting ---------- */
function ftS(cm){var t=Math.round(cm/2.54);if(cm>=3000)return Math.round(cm/30.48).toLocaleString()+' ft';return Math.floor(t/12)+'′ '+(t%12)+'″'}
function fmt(cm,u){u=u||unit;
  if(u==='cm')return (Math.round(cm*10)/10).toLocaleString()+' cm';
  if(u==='m')return (cm>=10000?(cm/100).toFixed(1):(cm/100).toFixed(2))+' m';
  return ftS(cm)}
function alt(cm){return unit==='ftin'?fmt(cm,'m'):ftS(cm)}
function fmtDiff(cm,u){u=u||unit;
  if(u==='cm')return (Math.round(cm*10)/10).toLocaleString()+' cm';
  if(u==='m')return (cm>=10000?(cm/100).toFixed(1):(cm/100).toFixed(2))+' m';
  if(cm>=3000)return Math.round(cm/30.48).toLocaleString()+' ft';
  var t=Math.round(cm/2.54),f=Math.floor(t/12),i=t%12;
  if(t===0)return cm>0?'under 1\u2033':'0\u2033';
  return f?f+'\u2032'+(i?' '+i+'\u2033':''):i+'\u2033';
}

/* ---------- items ---------- */
function msg(t){var m=$('#cmsg');if(m)m.textContent=t||''}
function add(o){
  if(items.length>=24){msg('Up to 24 items fit on one chart.');return}
  var it={id:uid,t:o.t||'p',n:o.n,cm:o.cm,role:o.role||'man',bid:o.bid||null,gs:o.gs||null,info:o.info||null,w:o.w||0,img:o.img||null,aspect:o.aspect||0.5,color:COLORS[uid%COLORS.length]};
  uid++;items.push(it);sel=it.id;renderRows();drawChart();renderInfo();
}
function view(){return sorted?items.slice().sort(function(a,b){return a.cm-b.cm}):items}
function byId(id){return items.filter(function(i){return i.id==id})[0]}
function kindOf(it){return it.img?'i':(it.bid||it.gs)?'b':it.t==='o'?'o':'p'}
function drawOf(it){return it.bid?DRAW[it.bid]:GEN[it.gs]}

function fig(it,cx,base,s){
  var h=it.cm*s,c=it.color,k=kindOf(it),sc=h/100;
  if(k==='i'){var w=h*it.aspect;return '<image href="'+it.img+'" x="'+(cx-w/2)+'" y="'+(base-h)+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMax meet"/>'}
  if(k==='o'){var bw=Math.max(it.w*s,16);return '<rect x="'+(cx-bw/2)+'" y="'+(base-h)+'" width="'+bw+'" height="'+h+'" rx="4" fill="'+c+'" fill-opacity=".82"/>'}
  if(k==='b'){var d=drawOf(it);return '<g transform="translate('+(cx-d.w*sc/2)+' '+(base-h)+') scale('+sc+')" fill="'+c+'" fill-opacity=".92">'+d.d()+'</g>'}
  return '<g transform="translate('+(cx-20*sc)+' '+(base-h)+') scale('+sc+')" fill="'+c+'" style="color:'+c+'">'+person(it.role)+'</g>';
}
function widthPx(it,s){
  var h=it.cm*s,k=kindOf(it);
  if(k==='i')return h*it.aspect;
  if(k==='o')return Math.max(it.w*s,16);
  if(k==='b')return drawOf(it).w*h/100;
  return 0.4*h;
}
function ticks(maxCm,s){
  var steps,lab;
  if(unit==='cm'){steps=[5,10,20,25,50,100,200,500,1000,2000,5000,10000,20000,50000];lab=function(v){return Math.round(v).toLocaleString()}}
  else if(unit==='m'){steps=[10,20,25,50,100,200,500,1000,2000,5000,10000,20000];lab=function(v){return String(+(v/100).toFixed(2))}}
  else{steps=[1,2,3,6,12,24,36,60,120,240,600,1200,2400,6000].map(function(i){return i*2.54});
    lab=function(v){var t=Math.round(v/2.54),f=Math.floor(t/12),i=t%12;return i?f+'′ '+i+'″':f+'′'}}
  var step=steps[steps.length-1],i;
  for(i=0;i<steps.length;i++){if(steps[i]*s>=30){step=steps[i];break}}
  var out=[];for(var v=0;v<=maxCm;v+=step)out.push({v:v,l:lab(v)});
  return out;
}
function short(n){return n.length>18?n.slice(0,17)+'…':n}

function drawChart(){
  var arr=view(),bh=window.innerWidth<600?380:500,z=ZS[zi],H=bh*z,top=34,bot=58;
  var sc=$('#scroll'),cw=Math.max((sc.clientWidth||600)-62,200);
  var maxCm=Math.max.apply(null,[100].concat(arr.map(function(i){return i.cm})))*1.03;
  var minCm=Math.min.apply(null,[1e9].concat(arr.map(function(i){return i.cm})));
  var s=(H-top-bot)/maxCm,base=H-bot;
  $('#hint').hidden=!(arr.length>1&&maxCm/minCm>25&&zi===0);
  var slots=arr.map(function(it){var w=widthPx(it,s);return{it:it,sw:Math.max(w,64)+26}});
  var pr2=pair.length===2,pos={};
  var total=slots.reduce(function(a,x){return a+x.sw},0)+20+(pr2?90:0);
  var W=Math.max(total,cw),x=(W-total)/2+10;
  var tk=ticks(maxCm,s),g='',r='';
  tk.forEach(function(t){var y=base-t.v*s;
    g+='<line class="gl" x1="0" x2="'+W+'" y1="'+y+'" y2="'+y+'"/>';
    r+='<line class="gl" style="stroke:var(--line)" x1="52" x2="60" y1="'+y+'" y2="'+y+'"/><text class="tk" x="48" y="'+(y+3.5)+'" text-anchor="end">'+esc(t.l)+'</text>'});
  var body='';
  if(!arr.length)body='<text class="empty-t" x="'+(W/2)+'" y="'+(H/2)+'" text-anchor="middle">Add someone from the list to start</text>';
  slots.forEach(function(sl){
    var cx=x+sl.sw/2,it=sl.it,ty=base-it.cm*s;
    pos[it.id]={cx:cx,sw:sl.sw};
    body+='<g class="fig'+(sel===it.id?' hl':'')+(pair.indexOf(it.id)>-1?' pr':'')+'" data-id="'+it.id+'"><title>'+esc(it.n)+', '+esc(fmt(it.cm))+'</title>'+
      '<rect x="'+(cx-sl.sw/2)+'" y="'+Math.max(ty-6,0)+'" width="'+sl.sw+'" height="'+(base-Math.max(ty-6,0)+50)+'" fill="transparent"/>'+
      '<line class="top" x1="0" x2="'+W+'" y1="'+ty+'" y2="'+ty+'"/>'+fig(it,cx,base,s)+
      '<text class="nm" x="'+cx+'" y="'+(base+18)+'" text-anchor="middle">'+esc(short(it.n))+'</text>'+
      '<text class="ht" x="'+cx+'" y="'+(base+34)+'" text-anchor="middle">'+esc(fmt(it.cm))+'</text></g>';
    x+=sl.sw});
  if(pr2){
    var A=byId(pair[0]),B=byId(pair[1]);
    if(A&&B&&pos[A.id]&&pos[B.id]){
      var hi=A.cm>=B.cm?A:B,lo=hi===A?B:A,yh=base-hi.cm*s,yl=base-lo.cm*s;
      var pr=pos[A.id].cx>=pos[B.id].cx?pos[A.id]:pos[B.id];
      var bx=pr.cx+pr.sw/2-8,dy=yl-yh,ym=(yh+yl)/2,a=Math.min(8,dy/4);
      var d=dy>=12?'M'+bx+' '+yh+'Q'+(bx+6)+' '+yh+' '+(bx+6)+' '+(yh+a)+'L'+(bx+6)+' '+(ym-a)+'Q'+(bx+6)+' '+ym+' '+(bx+12)+' '+ym+
        'Q'+(bx+6)+' '+ym+' '+(bx+6)+' '+(ym+a)+'L'+(bx+6)+' '+(yl-a)+'Q'+(bx+6)+' '+yl+' '+bx+' '+yl:'M'+bx+' '+yh+'L'+bx+' '+yl;
      body+='<line class="cl" x1="'+pos[hi.id].cx+'" x2="'+bx+'" y1="'+yh+'" y2="'+yh+'"/>'+
        '<line class="cl" x1="'+pos[lo.id].cx+'" x2="'+bx+'" y1="'+yl+'" y2="'+yl+'"/>'+
        '<path class="brace" d="'+d+'"/><text class="dl" x="'+(bx+18)+'" y="'+(ym+4)+'">'+esc(fmtDiff(Math.abs(A.cm-B.cm)))+'</text>';
    }
  }
  var c=$('#chart');c.setAttribute('width',W);c.setAttribute('height',H);c.setAttribute('viewBox','0 0 '+W+' '+H);
  c.innerHTML=g+'<line class="base" x1="0" x2="'+W+'" y1="'+base+'" y2="'+base+'"/>'+body;
  var rl=$('#ruler');rl.setAttribute('width',62);rl.setAttribute('height',H);rl.setAttribute('viewBox','0 0 62 '+H);
  rl.innerHTML=r+'<text class="tk" x="48" y="16" text-anchor="end">'+(unit==='ftin'?'ft':unit)+'</text>';
  if(zi>0)sc.scrollTop=sc.scrollHeight;else sc.scrollTop=0;
}

/* ---------- info panel ---------- */
function renderInfo(){
  var it=byId(sel),el=$('#info');
  if(!it){el.innerHTML='<h2>Details</h2><p class="note">Add a building and select it to see its country, year, contractor and client. Select a person to see their height in both units.</p>';return}
  var inf=it.info||(it.bid&&BMAP[it.bid]);
  var both=fmt(it.cm,'m')+' &nbsp;/&nbsp; '+ftS(it.cm)+(unit==='cm'?' &nbsp;/&nbsp; '+fmt(it.cm,'cm'):'');
  if(!inf){
    var rl=it.t==='p'&&ROLES[it.role]?ROLES[it.role].l:(it.img?'Custom image':'Object');
    el.innerHTML='<h2>'+esc(it.n)+'</h2><dl class="facts"><dt>Type</dt><dd>'+esc(rl)+'</dd><dt>Height</dt><dd class="mono">'+both+'</dd></dl>';return}
  var f=function(l,v){return '<dt>'+l+'</dt><dd>'+(v&&String(v)!=='—'?esc(v):'<span class="note">Not added</span>')+'</dd>'};
  var place=[inf.city,inf.country].filter(Boolean).join(', ');
  el.innerHTML='<h2>'+esc(it.n)+'</h2>'+
    '<div class="grp"><span class="badge '+(inf.v?'ok':'')+'">'+(inf.v?'Checked against public sources':(inf.mine?'Added by you':'Basic details only'))+'</span></div>'+
    '<dl class="facts">'+f('Location',place)+f('Completed',inf.year)+'<dt>Height</dt><dd class="mono">'+both+'</dd>'+f('Floors',inf.floors)+
    f('Architect',inf.architect)+f('Main contractor',inf.contractor)+f('Client / owner',inf.client)+f('Notes',inf.note)+'</dl>';
}

/* ---------- rows ---------- */
function hInputs(it){
  if(unit==='cm')return '<input type="number" inputmode="decimal" data-f="cm" step="0.5" min="10" max="100000" value="'+(Math.round(it.cm*10)/10)+'" aria-label="Height in cm">cm';
  if(unit==='m')return '<input type="number" inputmode="decimal" data-f="m" step="0.01" min="0.1" max="1000" value="'+(Math.round(it.cm)/100)+'" aria-label="Height in metres">m';
  var t=Math.round(it.cm/2.54*2)/2,f=Math.floor(t/12),i=t-f*12;
  return '<input type="number" inputmode="numeric" data-f="ft" step="1" min="0" max="3300" value="'+f+'" aria-label="Feet">ft '+
    '<input type="number" inputmode="decimal" data-f="in" step="0.5" min="0" max="11.5" value="'+i+'" aria-label="Inches">in';
}
function roleSel(it){
  return '<select class="rsel" data-f="role" aria-label="Who is this">'+Object.keys(ROLES).map(function(k){return '<option value="'+k+'"'+(it.role===k?' selected':'')+'>'+ROLES[k].l+'</option>'}).join('')+'</select>';
}
function renderRows(){
  var arr=view();
  $('#rows').innerHTML=arr.length?arr.map(function(it){
    return '<li data-id="'+it.id+'" class="'+(sel===it.id?'sel':'')+(pair.indexOf(it.id)>-1?' pair':'')+'"><span class="dot" style="background:'+it.color+'"></span>'+
      '<input class="nm-in" data-f="n" value="'+esc(it.n)+'" aria-label="Name">'+
      (kindOf(it)==='p'?roleSel(it):'')+
      '<span class="hin">'+hInputs(it)+'</span><span class="alt" data-alt>'+esc(alt(it.cm))+'</span>'+
      '<button class="x" type="button" data-del aria-label="Remove '+esc(it.n)+'">×</button></li>'}).join('')
    :'<li class="empty">Nothing on the chart yet.</li>';
  $('#count').textContent=items.length+' of 24';
}
function readH(li){
  var q=function(f){var e=li.querySelector('[data-f="'+f+'"]');return e?parseFloat(e.value):NaN};
  if(unit==='cm')return q('cm');
  if(unit==='m')return q('m')*100;
  return ((q('ft')||0)*12+(q('in')||0))*2.54;
}
function setSel(id){sel=id;[].forEach.call(document.querySelectorAll('#rows li'),function(l){l.classList.toggle('sel',l.dataset.id==id)});drawChart();renderInfo()}
var rows=$('#rows');
rows.addEventListener('input',function(e){
  var li=e.target.closest('li[data-id]');if(!li)return;
  var it=byId(li.dataset.id);if(!it)return;
  var f=e.target.dataset.f;
  if(f==='n')it.n=e.target.value||'Unnamed';
  else if(f==='role')it.role=e.target.value;
  else{var cm=readH(li);if(!(cm>=10))return;it.cm=Math.min(cm,100000);li.querySelector('[data-alt]').textContent=alt(it.cm)}
  drawChart();renderInfo();renderCmp();
});
rows.addEventListener('change',function(e){var f=e.target.dataset.f;if(f&&f!=='n'&&f!=='role')renderRows()});
rows.addEventListener('click',function(e){
  var li=e.target.closest('li[data-id]');if(!li)return;
  if(e.target.closest('[data-del]')){
    var id=+li.dataset.id;items=items.filter(function(i){return i.id!==id});pair=pair.filter(function(p){return p!==id});if(sel===id)sel=null;renderRows();drawChart();renderInfo();renderCmp();return}
  if(cmp){if(!e.target.closest('input,select,button'))togglePair(+li.dataset.id);return}
  if(sel!=li.dataset.id)setSel(+li.dataset.id);
});
rows.addEventListener('focusin',function(e){var li=e.target.closest('li[data-id]');if(li&&sel!=li.dataset.id)setSel(+li.dataset.id)});
$('#chart').addEventListener('click',function(e){var g=e.target.closest('.fig');if(!g)return;
  if(cmp){togglePair(+g.dataset.id);return}
  setSel(+g.dataset.id);
  var li=document.querySelector('#rows li[data-id="'+g.dataset.id+'"]');if(li&&li.scrollIntoView)li.scrollIntoView({block:'nearest'})});

/* ---------- compare two items ---------- */
function togglePair(id){
  var i=pair.indexOf(id);
  if(i>-1)pair.splice(i,1);else{pair.push(id);if(pair.length>2)pair.shift()}
  sel=id;renderRows();drawChart();renderInfo();renderCmp();
}
function renderCmp(){
  var el=$('#cmp');
  if(!cmp){el.hidden=true;return}
  el.hidden=false;
  if(pair.length<2){
    el.innerHTML='<h2>Compare</h2><p class="note">'+(pair.length?'Pick one more item on the chart.':'Pick two items on the chart (or in the list) to see how far apart their heights are.')+'</p>';return}
  var A=byId(pair[0]),B=byId(pair[1]);
  if(!A||!B){el.innerHTML='';return}
  var hi=A.cm>=B.cm?A:B,lo=hi===A?B:A,d=hi.cm-lo.cm,o=unit==='ftin'?'m':'ftin';
  var head=d===0?'Same height':esc(fmtDiff(d))+' <span class="alt">('+esc(fmtDiff(d,o))+')</span>';
  var line=d===0?esc(A.n)+' and '+esc(B.n)+' are the same height.':esc(hi.n)+' is '+esc(fmtDiff(d))+' taller than '+esc(lo.n)+'.';
  var ratio=lo.cm?hi.cm/lo.cm:1;
  el.innerHTML='<h2>Difference</h2><div class="big mono">'+head+'</div><p>'+line+'</p>'+
    '<dl class="facts"><dt>'+esc(hi.n)+'</dt><dd class="mono">'+esc(fmt(hi.cm))+' / '+esc(fmt(hi.cm,unit==='ftin'?'cm':'ftin'))+'</dd>'+
    '<dt>'+esc(lo.n)+'</dt><dd class="mono">'+esc(fmt(lo.cm))+' / '+esc(fmt(lo.cm,unit==='ftin'?'cm':'ftin'))+'</dd>'+
    '<dt>Ratio</dt><dd class="mono">'+(ratio>=10?ratio.toFixed(1):ratio.toFixed(2))+' \u00d7</dd></dl>'+
    '<div><button class="btn" type="button" id="cmp-clear">Choose different items</button></div>';
}
$('#cmp').addEventListener('click',function(e){if(e.target.id==='cmp-clear'){pair=[];renderRows();drawChart();renderCmp()}});
$('#cmpbtn').addEventListener('click',function(){
  cmp=!cmp;this.setAttribute('aria-pressed',cmp);$('#chint').hidden=!cmp;$('#scroll').classList.toggle('cmpmode',cmp);
  if(!cmp)pair=[];
  renderRows();drawChart();renderCmp();
});

/* ---------- library ---------- */
var TABS=[['people','People'],['celebs','Celebrities'],['buildings','Buildings'],['things','Objects'],['mine','Saved'],['custom','Create']];
function renderTabs(){
  $('#tabs').innerHTML=TABS.map(function(t){return '<button type="button" role="tab" data-t="'+t[0]+'" aria-selected="'+(tab===t[0])+'">'+t[1]+'</button>'}).join('');
  $('#q').hidden=(tab==='custom'||tab==='people');
}
function icon(role){
  return '<svg class="ic" viewBox="0 0 40 100" preserveAspectRatio="xMidYMax meet" width="30" height="48" fill="currentColor" style="color:var(--fg)">'+person(role)+'</svg>';
}
function match(n){return !Q||n.toLowerCase().indexOf(Q)>-1}
function renderPanel(){
  var p=$('#panel'),h='';
  if(tab==='custom'){p.innerHTML=customHtml();syncForm();return}
  if(tab==='people'){
    h='<div class="lib">'+Object.keys(ROLES).map(function(k){var r=ROLES[k];
      return '<button type="button" data-role="'+k+'"><span class="ic">'+icon(k)+'</span>'+esc(r.l)+'<small>'+esc(fmt(r.cm))+'</small></button>'}).join('')+'</div>'+
      '<p class="note" style="margin-top:8px">Typical heights. Change the height or the role on the chart row afterwards.</p>';
  }else if(tab==='celebs'){
    h='<div class="lib">'+CELEBS.map(function(o,i){return match(o.n)?'<button type="button" data-c="'+i+'">'+esc(o.n)+'<small>'+esc(fmt(o.cm))+'</small></button>':''}).join('')+'</div>'+
      '<p class="note" style="margin-top:8px">Heights of public figures are approximate, as commonly reported.</p>';
  }else if(tab==='buildings'){
    h='<div class="lib">'+BUILD.map(function(b,i){return match(b.n)?'<button type="button" data-b="'+i+'">'+esc(b.n)+'<small>'+esc(fmt(b.cm))+' &middot; '+esc(b.city)+'</small></button>':''}).join('')+'</div>'+
      '<p class="note" style="margin-top:8px">Can’t find one? Use Create to add your own building with its details.</p>';
  }else if(tab==='things'){
    h='<div class="lib">'+THINGS.map(function(o,i){return match(o.n)?'<button type="button" data-o="'+i+'">'+esc(o.n)+'<small>'+esc(fmt(o.cm))+'</small></button>':''}).join('')+'</div>';
  }else if(tab==='mine'){
    h=mine.length?'<div class="lib">'+mine.map(function(o,i){return match(o.n)?'<button type="button" data-m="'+i+'">'+esc(o.n)+'<small>'+esc(fmt(o.cm))+'</small></button>':''}).join('')+'</div>'+
      '<p class="note" style="margin-top:8px"><button class="btn" type="button" id="clrmine">Remove all saved</button></p>'
      :'<p class="note">Nothing saved yet. Things you create can be saved here, in this browser.</p>';
  }
  p.innerHTML=h;
}
$('#tabs').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(!b)return;tab=b.dataset.t;Q='';$('#q').value='';renderTabs();renderPanel()});
$('#q').addEventListener('input',function(){Q=this.value.trim().toLowerCase();renderPanel()});
$('#panel').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  if(b.dataset.role){var r=ROLES[b.dataset.role];add({t:'p',n:r.l,cm:r.cm,role:b.dataset.role});return}
  if(b.dataset.c){var c=CELEBS[+b.dataset.c];add({t:'p',n:c.n,cm:c.cm,role:c.role});return}
  if(b.dataset.b){var d=BUILD[+b.dataset.b];add({t:'b',n:d.n,cm:d.cm,bid:d.k});return}
  if(b.dataset.o){var o=THINGS[+b.dataset.o];add({t:'o',n:o.n,cm:o.cm,w:o.w});return}
  if(b.dataset.m){var m=mine[+b.dataset.m];add(JSON.parse(JSON.stringify(m)));return}
  if(b.id==='clrmine'){mine=[];saveMine();renderPanel();return}
  if(b.id==='cf-add')addCustom();
});
$('#panel').addEventListener('change',function(e){if(e.target.id==='cf-type')syncForm()});
function saveMine(){try{localStorage.setItem('hl-mine',JSON.stringify(mine))}catch(e){msg('This browser could not save the item. It is still on the chart.')}}

function customHtml(){
  var h=unit==='cm'?'<input id="cf-cm" type="number" step="0.5" value="170">cm':
        unit==='m'?'<input id="cf-m" type="number" step="0.01" value="1.70">m':
        '<input id="cf-ft" type="number" value="5">ft <input id="cf-in" type="number" step="0.5" value="7">in';
  var roles=Object.keys(ROLES).map(function(k){return '<option value="'+k+'">'+ROLES[k].l+'</option>'}).join('');
  var gens=Object.keys(GEN).map(function(k){return '<option value="'+k+'">'+GEN[k].l+'</option>'}).join('');
  return '<div class="form">'+
    '<label class="wide">What is it<select id="cf-type"><option value="p">A person</option><option value="b">A building</option><option value="o">A block or object</option><option value="i">My own image</option></select></label>'+
    '<label class="wide">Name<input id="cf-n" placeholder="e.g. My brother, Office tower"></label>'+
    '<label class="wide">Height<span class="hin">'+h+'</span></label>'+
    '<label class="wide" data-for="p">Who<select id="cf-role">'+roles+'</select></label>'+
    '<label class="wide" data-for="b">Building shape<select id="cf-gs">'+gens+'</select></label>'+
    '<label data-for="b">City<input id="cf-city"></label><label data-for="b">Country<input id="cf-country"></label>'+
    '<label data-for="b">Year completed<input id="cf-year"></label><label data-for="b">Floors<input id="cf-floors"></label>'+
    '<label class="wide" data-for="b">Architect<input id="cf-arch"></label>'+
    '<label data-for="b">Main contractor<input id="cf-con"></label><label data-for="b">Client<input id="cf-cli"></label>'+
    '<label data-for="o">Width (cm)<input id="cf-w" type="number" value="60"></label>'+
    '<label class="wide" data-for="i">Image file<input id="cf-img" type="file" accept="image/*"></label>'+
    '<label class="wide"><span><input id="cf-save" type="checkbox" checked> Save in this browser for next time</span></label>'+
    '<div class="wide"><button class="btn pri" type="button" id="cf-add">Add to chart</button></div>'+
    '<p class="note wide" id="cmsg"></p></div>';
}
function syncForm(){
  var t=$('#cf-type');if(!t)return;
  [].forEach.call(document.querySelectorAll('.form [data-for]'),function(l){l.hidden=l.dataset.for!==t.value});
}
function addCustom(){
  var g=function(i){return $('#'+i)};
  var cm=unit==='cm'?parseFloat(g('cf-cm').value):unit==='m'?parseFloat(g('cf-m').value)*100:
    ((parseFloat(g('cf-ft').value)||0)*12+(parseFloat(g('cf-in').value)||0))*2.54;
  if(!(cm>=10&&cm<=100000)){msg('Enter a height between 10 cm and 1,000 m.');return}
  var type=g('cf-type').value,nm=g('cf-n').value.trim();
  var o={t:type==='i'?'p':type,n:nm||'Custom',cm:cm};
  if(type==='p')o.role=g('cf-role').value;
  if(type==='b'){o.gs=g('cf-gs').value;
    o.info={city:g('cf-city').value.trim(),country:g('cf-country').value.trim(),year:g('cf-year').value.trim(),floors:g('cf-floors').value.trim(),
      architect:g('cf-arch').value.trim(),contractor:g('cf-con').value.trim(),client:g('cf-cli').value.trim(),note:'',mine:1}}
  if(type==='o')o.w=parseFloat(g('cf-w').value)||60;
  var keep=g('cf-save').checked;
  var done=function(){add(o);if(keep){mine.push(JSON.parse(JSON.stringify(o)));saveMine()}msg('Added.')};
  if(type!=='i'){done();return}
  var f=g('cf-img').files[0];
  if(!f){msg('Choose an image file first.');return}
  if(f.size>1.5*1024*1024&&keep){keep=false;msg('Image is large, so it will not be saved for next time.')}
  if(f.size>4*1024*1024){msg('Image is over 4 MB. Use a smaller file.');return}
  var fr=new FileReader();
  fr.onload=function(){var im=new Image();
    im.onload=function(){o.img=fr.result;o.aspect=im.naturalWidth/im.naturalHeight;done()};
    im.onerror=function(){msg('That file could not be read as an image.')};
    im.src=fr.result};
  fr.readAsDataURL(f);
}

/* ---------- toolbar ---------- */
$('#units').addEventListener('click',function(e){
  var b=e.target.closest('[data-u]');if(!b)return;unit=b.dataset.u;
  try{localStorage.setItem('hl-unit',unit)}catch(err){}
  syncUnits();renderRows();renderPanel();drawChart();renderInfo();renderCmp();
});
function syncUnits(){[].forEach.call(document.querySelectorAll('#units button'),function(b){b.setAttribute('aria-pressed',b.dataset.u===unit)})}
$('#zin').addEventListener('click',function(){if(zi<ZS.length-1){zi++;drawChart()}});
$('#zout').addEventListener('click',function(){if(zi>0){zi--;drawChart()}});
$('#zfit').addEventListener('click',function(){zi=0;drawChart()});
$('#sort').addEventListener('click',function(){
  sorted=!sorted;this.textContent=sorted?'Order: short to tall':'Order: as added';renderRows();drawChart();
});
$('#clear').addEventListener('click',function(){items=[];sel=null;pair=[];renderRows();drawChart();renderInfo();renderCmp()});
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(drawChart,120)});

/* ---------- start with an example family ---------- */
syncUnits();renderTabs();renderPanel();
[['Grandmother','grandmother',154],['Mother','wife',163],['Father','father',178],['Girl','girl',126],['Boy','boy',128],['Toddler','toddler',90]].forEach(function(a){
  items.push({id:uid,t:'p',n:a[0],cm:a[2],role:a[1],bid:null,gs:null,info:null,w:0,img:null,aspect:.5,color:COLORS[uid%COLORS.length]});uid++});
renderRows();drawChart();renderInfo();
})();
