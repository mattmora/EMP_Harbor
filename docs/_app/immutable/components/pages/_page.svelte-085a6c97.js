import{S as Ht,i as jt,s as Bt,k as Q,l as Z,m as $,h as W,n as b,b as mt,I as it,B as xt,J as Ot,K as kt,o as Vt,A as Ft,L as Kt,a as ut,c as dt,G as U,q as Ut,r as Jt,u as Xt}from"../../chunks/index-a6ab4251.js";function It(t,e,a){var u=a||{},n=u.noTrailing,s=n===void 0?!1:n,r=u.noLeading,l=r===void 0?!1:r,d=u.debounceMode,y=d===void 0?void 0:d,v,M=!1,c=0;function k(){v&&clearTimeout(v)}function N(x){var A=x||{},D=A.upcomingOnly,L=D===void 0?!1:D;k(),M=!L}function _(){for(var x=arguments.length,A=new Array(x),D=0;D<x;D++)A[D]=arguments[D];var L=this,R=Date.now()-c;if(M)return;function q(){c=Date.now(),e.apply(L,A)}function T(){v=void 0}!l&&y&&!v&&q(),k(),y===void 0&&R>t?l?(c=Date.now(),s||(v=setTimeout(y?T:q,t))):q():s!==!0&&(v=setTimeout(y?T:q,y===void 0?t-R:t))}return _.cancel=N,_}function Yt(t,e){return Math.sqrt(at(t,e))}function at(t,e){return Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2)}function Gt(t,e,a){const u=at(e,a);if(u===0)return at(t,e);let n=((t[0]-e[0])*(a[0]-e[0])+(t[1]-e[1])*(a[1]-e[1]))/u;return n=Math.max(0,Math.min(1,n)),at(t,O(e,a,n))}function O(t,e,a){return[t[0]+(e[0]-t[0])*a,t[1]+(e[1]-t[1])*a]}function Qt(t,e){const a=t[e+0],u=t[e+1],n=t[e+2],s=t[e+3];let r=3*u[0]-2*a[0]-s[0];r*=r;let l=3*u[1]-2*a[1]-s[1];l*=l;let d=3*n[0]-2*s[0]-a[0];d*=d;let y=3*n[1]-2*s[1]-a[1];return y*=y,r<d&&(r=d),l<y&&(l=y),r+l}function gt(t,e,a,u){const n=u||[];if(Qt(t,e)<a){const s=t[e+0];n.length?Yt(n[n.length-1],s)>1&&n.push(s):n.push(s),n.push(t[e+3])}else{const r=t[e+0],l=t[e+1],d=t[e+2],y=t[e+3],v=O(r,l,.5),M=O(l,d,.5),c=O(d,y,.5),k=O(v,M,.5),N=O(M,c,.5),_=O(k,N,.5);gt([r,v,k,_],0,a,n),gt([_,N,c,y],0,a,n)}return n}function pt(t,e,a,u,n){const s=n||[],r=t[e],l=t[a-1];let d=0,y=1;for(let v=e+1;v<a-1;++v){const M=Gt(t[v],r,l);M>d&&(d=M,y=v)}return Math.sqrt(d)>u?(pt(t,e,y+1,u,s),pt(t,y,a,u,s)):(s.length||s.push(r),s.push(l)),s}function Zt(t,e=.15,a){const u=[],n=(t.length-1)/3;for(let s=0;s<n;s++){const r=s*3;gt(t,r,e,u)}return a&&a>0?pt(u,0,u.length,a):u}function G(t){return[...t]}function $t(t,e=0){const a=t.length;if(a<3)throw new Error("A curve must have at least three points.");const u=[];if(a===3)u.push(G(t[0]),G(t[1]),G(t[2]),G(t[2]));else{const n=[];n.push(t[0],t[0]);for(let l=1;l<t.length;l++)n.push(t[l]),l===t.length-1&&n.push(t[l]);const s=[],r=1-e;u.push(G(n[0]));for(let l=1;l+2<n.length;l++){const d=n[l];s[0]=[d[0],d[1]],s[1]=[d[0]+(r*n[l+1][0]-r*n[l-1][0])/6,d[1]+(r*n[l+1][1]-r*n[l-1][1])/6],s[2]=[n[l+1][0]+(r*n[l][0]-r*n[l+2][0])/6,n[l+1][1]+(r*n[l][1]-r*n[l+2][1])/6],s[3]=[n[l+1][0],n[l+1][1]],u.push(s[1],s[2],s[3])}}return u}const St=[[[500,500],[2500,3280]],[[4500,500],[2500,3280]],[[500,6060],[2500,3280]],[[4500,6060],[2500,3280]]],st=(t,e,a,u)=>{var n=e-t,s=u-a;return Math.sqrt(n*n+s*s)};const{window:Ct}=Kt;function Pt(t,e,a){const u=t.slice();return u[39]=e[a],u[41]=a,u}function bt(t){let e,a=t[2][t[41]].pathString+"",u;return{c(){e=Q("pre"),u=Ut(a),this.h()},l(n){e=Z(n,"PRE",{class:!0});var s=$(e);u=Jt(s,a),s.forEach(W),this.h()},h(){b(e,"class","svelte-cedt8j")},m(n,s){mt(n,e,s),U(e,u)},p(n,s){s[0]&4&&a!==(a=n[2][n[41]].pathString+"")&&Xt(u,a)},d(n){n&&W(e)}}}function qt(t){let e,a,u,n,s,r,l,d,y,v,M,c=t[3]&&bt(t);function k(..._){return t[15](t[41],..._)}function N(..._){return t[16](t[41],..._)}return{c(){e=Q("div"),c&&c.c(),a=ut(),u=Q("canvas"),s=ut(),r=Q("canvas"),d=ut(),this.h()},l(_){e=Z(_,"DIV",{id:!0,class:!0,style:!0});var x=$(e);c&&c.l(x),a=dt(x),u=Z(x,"CANVAS",{id:!0,class:!0,style:!0}),$(u).forEach(W),s=dt(x),r=Z(x,"CANVAS",{id:!0,class:!0,style:!0}),$(r).forEach(W),d=dt(x),x.forEach(W),this.h()},h(){b(u,"id","map"+t[41]),b(u,"class","map svelte-cedt8j"),b(u,"style",n=t[1][t[41]]+(t[3]?"height: 95%;":"")),b(r,"id","view"+t[41]),b(r,"class","view svelte-cedt8j"),b(r,"style",l=t[3]?"height: 95%;":""),b(e,"id","viewport"+t[41]),b(e,"class","viewport svelte-cedt8j"),b(e,"style",y=t[0]<0||t[0]==t[41]?"":"display: none")},m(_,x){mt(_,e,x),c&&c.m(e,null),U(e,a),U(e,u),U(e,s),U(e,r),U(e,d),v||(M=[it(r,"mousedown",k),it(r,"mousemove",It(40,N))],v=!0)},p(_,x){t=_,t[3]?c?c.p(t,x):(c=bt(t),c.c(),c.m(e,a)):c&&(c.d(1),c=null),x[0]&10&&n!==(n=t[1][t[41]]+(t[3]?"height: 95%;":""))&&b(u,"style",n),x[0]&8&&l!==(l=t[3]?"height: 95%;":"")&&b(r,"style",l),x[0]&1&&y!==(y=t[0]<0||t[0]==t[41]?"":"display: none")&&b(e,"style",y)},d(_){_&&W(e),c&&c.d(),v=!1,kt(M)}}}function te(t){let e,a,u,n=t[4],s=[];for(let r=0;r<n.length;r+=1)s[r]=qt(Pt(t,n,r));return{c(){e=Q("div");for(let r=0;r<s.length;r+=1)s[r].c();this.h()},l(r){e=Z(r,"DIV",{class:!0,style:!0});var l=$(e);for(let d=0;d<s.length;d+=1)s[d].l(l);l.forEach(W),this.h()},h(){b(e,"class","views svelte-cedt8j"),b(e,"style",t[5])},m(r,l){mt(r,e,l);for(let d=0;d<s.length;d+=1)s[d].m(e,null);a||(u=[it(Ct,"keydown",t[6]),it(Ct,"keyup",t[7])],a=!0)},p(r,l){if(l[0]&799){n=r[4];let d;for(d=0;d<n.length;d+=1){const y=Pt(r,n,d);s[d]?s[d].p(y,l):(s[d]=qt(y),s[d].c(),s[d].m(e,null))}for(;d<s.length;d+=1)s[d].d(1);s.length=n.length}l[0]&32&&b(e,"style",r[5])},i:xt,o:xt,d(r){r&&W(e),Ot(s,r),a=!1,kt(u)}}}const ee=.2,Et=400;let ne=180,oe=100,se=1;const ft=20;function ae(t,e,a){let u,n,s,r,l,d,y;const v=[],M=[],c=[];let k,N,_,x,A,D,L,R;const q={},T={};let rt=10,lt=.03,z=-1;const Lt=f=>{var i,h,o,S,w,m;for(let g=0;g<M.length;g++){if(z>=0&&g!=z)continue;const C=M[g],p=c[g];let{x:E,y:P,zoom:H}=C;const V=(i=q.e)!=null?i:0,J=(h=q.q)!=null?h:0,X=V-J,Nt=Math.pow(1+X*ee,f);if(H*=Nt,q.r&&(p.pathIndex=0,p.x=p.path[0][0],p.y=p.path[0][1]),T.v&&p.pathIndex<p.path.length-1){let Y=p.pathLength/rt*f;for(;Y>0&&p.pathIndex<p.path.length-1;){let et=p.pathIndex,nt=p.path[et+1][0],F=p.path[et+1][1];const B=st(p.x,nt,p.y,F);if(B>0&&(p.course=Math.atan2(F-p.y,nt-p.x)),B==0){p.pathIndex++;continue}const K=Math.min(Y,B),ot=Math.cos(p.course),Wt=Math.sin(p.course);p.x+=ot*K,p.y+=Wt*K,Y-=K}}if(T.f){const j=lt;E=p.x*j+E*(1-j),P=p.y*j+P*(1-j)}else{const j=(o=q.a)!=null?o:0,Y=(S=q.d)!=null?S:0,et=(w=q.s)!=null?w:0,nt=(m=q.w)!=null?m:0,F=Y-j,B=nt-et,K=Math.sqrt(F*F+B*B),ot=K>0?1/K:0;E+=ot*F*Et*f,P-=ot*B*Et*f}C.x=E,C.y=P,C.zoom=H}q.r=!1},Rt=()=>{const f=k.width/_.width;R.clearRect(0,0,L.width,L.height),c.forEach(i=>{R.beginPath(),R.fillStyle=i.color;const h=i.x+Math.cos(i.course)*20,o=i.y+Math.sin(i.course)*20,S=i.x+Math.cos(i.course+Math.PI/1.5)*20,w=i.y+Math.sin(i.course+Math.PI/1.5)*20,m=i.x+Math.cos(i.course-Math.PI/1.5)*20,g=i.y+Math.sin(i.course-Math.PI/1.5)*20;R.moveTo(h,o),R.lineTo(S,w),R.lineTo(i.x,i.y),R.lineTo(m,g),R.fill()}),M.forEach(({x:i,y:h,zoom:o,canvas:S,context:w,map:m})=>{const g=m.canvas.width=S.width=S.offsetWidth,C=m.canvas.height=S.height=S.offsetHeight;o*=z>=0?Math.ceil(Math.sqrt(I)):1;const p=o>.8,E=p?k:_,P=p?f:1,H=g/o,V=C/o,J=i-H*.5,X=h-V*.5;y&&w.drawImage(A,J,X,H,V,0,0,g,C),w.drawImage(L,J,X,H,V,0,0,g,C),m.context.drawImage(E,J*P,X*P,H*P,V*P,0,0,g,C)})};let yt;const wt=It(0,f=>{const i=f-yt;i>0&&(Lt(i/1e3),Rt()),yt=f,requestAnimationFrame(wt)}),Tt=f=>{q[f.key.toLowerCase()]=1,a(10,T[f.key.toLowerCase()]=!T[f.key.toLowerCase()],T);let i=parseInt(f.key)-1;i==z||i>=I?a(0,z=-1):a(0,z=isNaN(i)?z:i),tt()},At=f=>{q[f.key.toLowerCase()]=0};let I=4,ct;Vt(async()=>{const f={views:parseInt(new URLSearchParams(window.location.search).get("views")),follow:parseFloat(new URLSearchParams(window.location.search).get("follow")),duration:parseFloat(new URLSearchParams(window.location.search).get("duration"))};a(11,I=isNaN(f.views)?I:f.views),a(4,u=[...Array(I).keys()]),lt=isNaN(f.follow)?lt:f.follow,rt=isNaN(f.duration)?rt:f.duration,await Ft(),k=document.createElement("canvas"),N=k.getContext("2d"),_=document.createElement("canvas"),x=_.getContext("2d"),A=document.createElement("canvas"),D=A.getContext("2d"),L=document.createElement("canvas"),R=L.getContext("2d");for(let o=0;o<I;o++){v.push({}),v[o].canvas=document.getElementById(`map${o}`),v[o].context=v[o].canvas.getContext("2d"),c.push({points:St[o%St.length],path:[],pathIndex:0,pathLength:0,pathString:"",editing:-1,color:vt[o%vt.length]}),ht(o,!0),a(2,c[o].x=c[o].path[0]?c[o].path[0][0]:-1,c),a(2,c[o].y=c[o].path[0]?c[o].path[0][1]:-1,c);const S=c[o].path[1]?c[o].path[1][0]:c[o].x,w=c[o].path[1]?c[o].path[1][1]:c[o].y;a(2,c[o].course=Math.atan2(w-c[o].y,S-c[o].x),c),M.push({x:c[o].x,y:c[o].y,map:v[o],ship:c[o]}),M[o].canvas=document.getElementById(`view${o}`),M[o].context=M[o].canvas.getContext("2d"),M[o].zoom=L.width/M[o].canvas.width,M.forEach(m=>{const{canvas:g,map:C,zoom:p}=m;C.canvas.width=g.width=g.offsetWidth,C.canvas.height=g.height=g.offsetHeight,m.x=m.x<0?g.width/p*.5:m.x,m.y=m.y<0?g.height/p*.5:m.y})}const i=new Image;i.src="/harbor/chart-5000.png",i.onload=()=>{_.width=i.naturalWidth,_.height=i.naturalHeight,A.width=i.naturalWidth,A.height=i.naturalHeight,L.width=i.naturalWidth,L.height=i.naturalHeight,x.drawImage(i,0,0),v.forEach(({canvas:o,context:S})=>{const w=o.width,m=o.height;S.drawImage(_,0,0,w,m,0,0,w,m)}),tt()};const h=new Image;h.src="/harbor/chart-10000.png",h.onload=()=>{k.width=h.naturalWidth,k.height=h.naturalHeight,N.drawImage(h,0,0)},requestAnimationFrame(wt)});const vt=["#ff00dd","#ff9900","#11ff00","#1188ff"],tt=()=>{const f=A,i=D;i.clearRect(0,0,f.width,f.height),c.forEach(({points:h,path:o,color:S})=>{if(o.length>0){i.beginPath(),i.lineWidth=3,i.strokeStyle=S,i.setLineDash([12,3]);let w=o[0][0],m=o[0][1];i.moveTo(w,m);for(let g=1;g<o.length;g++)w=o[g][0],m=o[g][1],i.lineTo(w,m);i.stroke();for(let g=0;g<h.length;g++)w=h[g][0],m=h[g][1],i.beginPath(),(!T.o||g==0||g==h.length-1)&&i.arc(w,m,ft,0,2*Math.PI),i.stroke()}})},ht=(f,i)=>{const h=c[f];if(h.points.length>3){const o=$t(h.points);h.path=Zt(o,.8,1)}else h.path=h.points;h.pathLength=0;for(let o=1;o<h.path.length;o++)h.pathLength+=st(h.path[o-1][0],h.path[o][0],h.path[o-1][1],h.path[o][1]);i&&(h.pathString=JSON.stringify(h.points))},_t=(f,i)=>{if(!y)return;const h=c[i];let{x:o,y:S,zoom:w,canvas:m}=M[i];w*=z>=0?Math.ceil(Math.sqrt(I)):1;const g=o+(f.offsetX-m.width*.5)/w,C=S+(f.offsetY-m.height*.5)/w;if(f.button==0){if(h.editing>=0){let E=-1;for(let P=0;P<h.points.length;P++)if(Math.abs(P-h.editing)==1){var p=st(h.points[P][0],g,h.points[P][1],C);p<ft&&(E=P)}E<0?h.points[h.editing]=[g,C]:h.points.splice(h.editing,1),h.editing=-1}else{for(let E=0;E<h.points.length;E++){var p=st(h.points[E][0],g,h.points[E][1],C);p<ft&&(h.editing=E)}h.editing<0&&h.points.push([g,C])}ht(i,!0),tt()}},Mt=(f,i)=>{if(!y)return;const h=c[i];let{x:o,y:S,zoom:w,canvas:m}=M[i];w*=z>=0?Math.ceil(Math.sqrt(I)):1;const g=o+(f.offsetX-m.width*.5)/w,C=S+(f.offsetY-m.height*.5)/w;h.editing>=0&&(h.points[h.editing]=[g,C],ht(i),tt())},zt=(f,i)=>_t(i,f),Dt=(f,i)=>Mt(i,f);return t.$$.update=()=>{if(t.$$.dirty[0]&2048&&a(4,u=[...Array(I).keys()]),t.$$.dirty[0]&2049&&a(12,n=z>=0?1:Math.ceil(Math.sqrt(I))),t.$$.dirty[0]&4096&&a(14,s=100/n),t.$$.dirty[0]&16384&&a(13,r=`${s}% `),t.$$.dirty[0]&12288&&a(5,l=`
	grid-template-columns: ${r.repeat(n)};
	grid-template-rows: ${r.repeat(n)};`),t.$$.dirty[0]&2050){a(1,ct=[]);for(let f=0;f<I;f++)ct.push(`filter: hue-rotate(${ne+f*(360/I)*1}deg) invert(${oe}%) saturate(${se});`)}t.$$.dirty[0]&1024&&a(3,d=T.c),t.$$.dirty[0]&1024&&(y=!T.p)},[z,ct,c,d,u,l,Tt,At,_t,Mt,T,I,n,r,s,zt,Dt]}class re extends Ht{constructor(e){super(),jt(this,e,ae,te,Bt,{},null,[-1,-1])}}export{re as default};