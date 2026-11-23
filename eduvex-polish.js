/* EDUVEX add-on: notebook-style dark blue layout.
   Load AFTER the main script:  <script src="eduvex-polish.js?v=1"></script>  (just before </body>) */
(function () {
  'use strict';
  if (window.__evPolish) return; window.__evPolish = 1;

  /* ---------- 0) Update notice for THIS file (the old "new version" bar only watches index.html) ---------- */
  var ADDON_BUILD = '2026-11-22.7';
  var selfSrc = (document.currentScript && document.currentScript.src) || '';
  async function checkAddon(auto) {
    if (!selfSrc || !navigator.onLine) return;
    try {
      var t = await (await fetch(selfSrc, { cache: 'reload' })).text();
      var m = t.match(/ADDON_BUILD = '([^']+)'/);
      if (!m || m[1] === ADDON_BUILD) return;
      if (auto && sessionStorage.getItem('ev_upd2') !== m[1]) { sessionStorage.setItem('ev_upd2', m[1]); location.reload(); return; }   // when the app is just being opened: reload by itself, once
      var bar = document.getElementById('updBar'); if (bar) bar.classList.remove('hidden');                                      // app already open (or still old after a reload): show the Update button
    } catch (e) {}
  }
  setTimeout(function () { checkAddon(true); }, 3000);
  setInterval(function () { checkAddon(false); }, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkAddon(false); });

  /* ---------- 1) Notebook look: dark blue, thick outlines, hard shadows (CSS only, every feature stays) ---------- */
  var css = `
:root{--ink:#020617;--paper:#0a1122;--card:#101a30;--edge:#3b4a66}
html[data-theme]{--ink:rgb(var(--s950r))}
html{scroll-behavior:smooth}
*{scrollbar-width:thin;scrollbar-color:#334155 transparent}
html body{font-family:'Bricolage Grotesque',Inter,system-ui,sans-serif;-webkit-tap-highlight-color:transparent}

/* graph-paper notebook background (dark blue) */
html:not([data-theme]) body.bg-slate-950{background-color:var(--paper)}
body.bg-slate-950{background-image:linear-gradient(rgba(148,163,184,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.075) 1px,transparent 1px);background-size:26px 26px}
html[data-theme] body.bg-slate-950{background-image:linear-gradient(rgba(var(--ar),.12) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--ar),.12) 1px,transparent 1px)}

/* header */
body>header{padding:.7rem 1rem;border-bottom:3px solid var(--ink);box-shadow:0 4px 0 rgba(0,0,0,.35)}
html:not([data-theme]) body>header{background:#0b1a3d}
body>header>div>span{font-size:1.5rem;font-weight:800;letter-spacing:-.02em}
body>header #hdrTools{gap:.45rem}
body>header #hdrTools>button{border:2px solid var(--ink);border-radius:.65rem;box-shadow:2px 2px 0 var(--ink);transition:transform .08s,box-shadow .08s}
body>header #hdrTools>button:active{transform:translate(2px,2px);box-shadow:none}
body main{padding:1.1rem .9rem 2rem}
body>footer{border-top:2px dashed rgba(148,163,184,.25);padding:.9rem;opacity:.85}

/* rhythm */
body #app>*+*{margin-top:1.1rem!important}
body .tab.space-y-6>*+*{margin-top:1.1rem!important}
body .grid.gap-6{gap:1.1rem}
body .card.space-y-3>*+*{margin-top:.75rem!important}
body .card.space-y-4>*+*{margin-top:.95rem!important}

/* cards: bold border + hard shadow */
body .card{padding:1.15rem;border-width:2px;border-radius:1.1rem;box-shadow:5px 5px 0 var(--ink)}
html:not([data-theme]) body .card{background-color:var(--card);border-color:var(--edge)}
body .card>h3:first-child,body .card h4{font-size:.95rem;font-weight:800;letter-spacing:-.01em;margin-bottom:.8rem}

/* tabs */
#tabBar{position:sticky;z-index:30;gap:.5rem;padding:.65rem .2rem;margin:0 -.2rem;background:rgba(10,17,34,.93);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);scrollbar-width:none;scroll-snap-type:x proximity;border-bottom:2px dashed rgba(148,163,184,.25)}
html[data-theme] #tabBar{background:rgba(var(--s950r),.93)}
#tabBar::-webkit-scrollbar{display:none}
body .tab-btn{padding:.5rem 1rem;border:2px solid transparent;border-radius:.7rem;font-weight:700;font-size:.8rem;scroll-snap-align:start;transition:transform .08s,box-shadow .08s}
body .tab-btn:not(.on){border-color:rgba(148,163,184,.22);background:rgba(15,23,42,.55)}
body .tab-btn:not(.on):hover{color:#e2e8f0;border-color:rgba(148,163,184,.45)}
body .tab-btn.on{border-color:var(--ink);box-shadow:3px 3px 0 var(--ink)}

/* inputs + buttons */
body .inp{border-width:2px;border-radius:.7rem;padding:.62rem .8rem;min-height:2.7rem}
html:not([data-theme]) body .inp{background-color:var(--paper);border-color:var(--edge)}
body .inp:focus{box-shadow:3px 3px 0 rgba(var(--ar,59,130,246),.55)}
body .lbl{font-weight:600;margin-bottom:.3rem}
body .btn{padding:.7rem 1rem;border:2px solid var(--ink);border-radius:.75rem;font-weight:700;box-shadow:3px 3px 0 var(--ink);transition:transform .08s,box-shadow .08s,background .15s}
body .btn:active:not(:disabled){transform:translate(3px,3px);box-shadow:0 0 0 var(--ink)}
body .btn:disabled{box-shadow:none;opacity:.55;cursor:not-allowed}
body .row{padding:.65rem .8rem;border-width:2px;border-radius:.75rem;gap:.6rem}

/* timer ticket */
#swDisplay{font-size:clamp(2.6rem,10vw,3.6rem);font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.02em;padding:.5rem 0;margin:1rem 0 .5rem;border:2px dashed rgba(148,163,184,.3);border-radius:1rem;background:rgba(0,0,0,.25)}
#swStatus{font-weight:600;letter-spacing:.03em}
#swBreak{max-height:9rem;overflow-y:auto}

/* goal + streak */
#goalTrack{height:14px!important;border:2px solid var(--ink);border-radius:999px;background:rgba(0,0,0,.3)}
#goalBar{border-radius:999px}
#goalText{white-space:nowrap}
#streakBtn{width:6rem;border-width:2px;box-shadow:4px 4px 0 var(--ink)}
html:not([data-theme]) #streakBtn{background:var(--card)}

/* warning boxes: solid yellow note like the notebook app */
body .bg-amber-500\\/10{background:#facc15!important;border:2px solid var(--ink)!important;border-radius:.8rem;box-shadow:3px 3px 0 var(--ink)}
body .bg-amber-500\\/10,body .bg-amber-500\\/10 *{color:#1c1917!important}

/* modals */
body .modal{background-color:rgba(2,6,23,.78);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
body .modal>.card{max-height:90vh;overflow-y:auto;box-shadow:7px 7px 0 var(--ink)}
body .modal.show>*{animation:evPop .18s ease-out}
@keyframes evPop{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}

/* settings sections + theme dots */
#settings .card>div{padding-bottom:1rem;border-bottom:2px dashed rgba(148,163,184,.2)}
#settings .card>div:last-of-type{border-bottom:0;padding-bottom:0}
.thc{width:30px;height:30px;border-width:3px;border-color:var(--ink);box-shadow:2px 2px 0 var(--ink)}
.thc.on{border-color:#f8fafc}

@media(max-width:480px){
  body main{padding:.8rem .6rem 1.5rem}
  body .card{padding:.95rem;box-shadow:4px 4px 0 var(--ink)}
  #connText{display:none}
  body>header #hdrTools>button{padding:.4rem .55rem}
  #focus .absolute{font-size:.7rem}
}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;
  var st = document.createElement('style');
  st.id = 'evPolish'; st.textContent = css; document.head.appendChild(st);
  var fl = document.createElement('link'); fl.rel = 'stylesheet';
  fl.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(fl);

  // notebook font + goal track hook
  var fl = document.createElement('link');
  fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&display=swap';
  document.head.appendChild(fl);
  var gb = document.getElementById('goalBar'); if (gb && gb.parentElement) gb.parentElement.id = 'goalTrack';

  // sticky tab bar sits right under the header
  var first = document.querySelector('.tab-btn'), bar = first && first.parentElement;
  if (bar) {
    bar.id = 'tabBar';
    var hdr = document.querySelector('body>header');
    var fit = function () { bar.style.top = (hdr ? hdr.offsetHeight : 56) + 'px'; };
    fit(); addEventListener('resize', fit); addEventListener('load', fit);
  }

  /* ---------- 2) Find the spot in Settings ---------- */
  var key = document.querySelector('#settings .fa-key');
  var anchor = key && key.closest('#settings .card>div');

  /* ---------- 2b) Style switch: two round swatches above Theme (Solid = original look, Grid = notebook look) ---------- */
  var tRow = document.getElementById('themeRow'), tBox = tRow && tRow.parentNode;
  if (tBox && !document.getElementById('styG')) {
    var sw = document.createElement('div');
    sw.className = 'flex items-center gap-3';
    var gridBg = 'background-color:#0a1128;background-image:linear-gradient(rgba(96,165,250,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.6) 1px,transparent 1px);background-size:7px 7px';
    sw.innerHTML = '<span class="text-xs font-semibold text-slate-300">Style <span class="text-[9px] text-slate-500 font-normal">v4</span></span>' +
      '<div class="flex items-center gap-4">' +
      '<span class="flex items-center gap-1.5"><button id="styS" type="button" onclick="setUiStyle(\'solid\')" title="Solid" aria-label="Solid style" class="thc" style="background:#334155"></button><span class="text-[10px] text-slate-400">Solid</span></span>' +
      '<span class="flex items-center gap-1.5"><button id="styG" type="button" onclick="setUiStyle(\'grid\')" title="Grid" aria-label="Grid style" class="thc" style="' + gridBg + '"></button><span class="text-[10px] text-slate-400">Grid</span></span>' +
      '</div>';
    tBox.parentNode.insertBefore(sw, tBox);
  }
  var uiStyle = function () { return localStorage.getItem('ev_style') === 'solid' ? 'solid' : 'grid'; };
  function applyStyle() {
    var grid = uiStyle() === 'grid';
    st.disabled = !grid; fl.disabled = !grid;
    var a = document.getElementById('styS'), b = document.getElementById('styG');
    if (a) a.classList.toggle('on', !grid);
    if (b) b.classList.toggle('on', grid);
    if (typeof fit === 'function') fit();
  }
  window.setUiStyle = function (k) { localStorage.setItem('ev_style', k); applyStyle(); };
  applyStyle();

  /* ---------- 2c) Drawers (Subjects, Account) ---------- */
  function drawerize(box, key, openDef) {
    var head = box && box.firstElementChild;
    if (!head || box.dataset.drawer) return;
    box.dataset.drawer = '1';
    var body = document.createElement('div'); body.className = 'mt-3';
    while (head.nextSibling) body.appendChild(head.nextSibling);
    box.appendChild(body);
    var k = 'ev_dr_' + key, ch = document.createElement('i');
    ch.className = 'fa-solid fa-chevron-down text-sm'; ch.style.transition = 'transform .2s';
    head.style.cssText += ';display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:0;font-size:1rem;font-weight:700;color:#e2e8f0;padding:.75rem .9rem;border:2px solid rgba(148,163,184,.3);border-radius:.8rem;background:rgba(148,163,184,.08)';
    head.appendChild(ch);
    var set = function (o) { body.style.display = o ? '' : 'none'; ch.style.transform = o ? '' : 'rotate(-90deg)'; };
    var saved = localStorage.getItem(k); set(saved === null ? openDef : saved === '1');
    head.onclick = function () { var o = body.style.display === 'none'; localStorage.setItem(k, o ? '1' : '0'); set(o); };
  }
  var subjList = document.getElementById('subjList');
  if (subjList) drawerize(subjList.parentNode, 'subj', false);
  var ex = document.createElement('style'); ex.id = 'evExtra';
  ex.textContent = '#settings .row{font-size:.9rem}#subjList .row{font-size:1rem;padding:.8rem .95rem}#subjList .row i{font-size:1.05rem}#subjList .row button{padding:.3rem .4rem}#newSubj{font-size:1rem}';
  document.head.appendChild(ex);

  if (anchor && !document.getElementById('acUser')) {
    var acct = document.createElement('div');
    acct.innerHTML =
      '<p class="lbl"><i class="fa-solid fa-user mr-1"></i> Account</p>' +
      '<div class="space-y-2">' +
        '<div class="row"><span class="text-slate-400">Username :</span><b id="acUser">-</b></div>' +
        '<div class="row"><span class="text-slate-400">Password :</span><span class="flex items-center gap-3 min-w-0">' +
          '<span id="acPw" class="font-mono break-all">••••••••</span>' +
          '<button type="button" id="acEye" class="text-slate-400 hover:text-slate-200" title="Show / hide"><i class="fa-solid fa-eye"></i></button>' +
          '<button type="button" id="acForget" class="text-red-400 hover:text-red-300" title="Forget saved password"><i class="fa-solid fa-trash"></i></button></span></div>' +
        '<p id="acNote" class="text-[11px] text-slate-500"></p>' +
        '<div id="pwSlot" class="pt-3"></div>' +
      '</div>';
    anchor.parentNode.insertBefore(acct, anchor);
    document.getElementById('pwSlot').appendChild(anchor);      // the original "Change password" block moves in here
    drawerize(acct, 'acct', false);
  }

  // The password is only known at the moment you type it, so it is remembered on THIS device when you sign in.
  var pwShow = false, pwKey = function () { return user ? 'ev_pw_' + user.id : ''; };
  function acRefresh() {
    var u = document.getElementById('acUser'); if (!u || typeof user === 'undefined' || !user) return;
    u.textContent = user.email.split('@')[0];
    var pw = localStorage.getItem(pwKey());
    document.getElementById('acPw').textContent = pw ? (pwShow ? pw : '•'.repeat(Math.min(pw.length, 12))) : '(not saved on this device)';
    document.getElementById('acEye').style.display = document.getElementById('acForget').style.display = pw ? '' : 'none';
    document.getElementById('acNote').textContent = pw
      ? 'Saved only on this device, as plain text. Anyone who opens this device could see it here. Tap the trash icon to forget it. It is also removed when you log out.'
      : 'The server never keeps your password in a readable form. Log out and sign in once more on this device and it will show up here.';
  }
  var eye = document.getElementById('acEye'), fg = document.getElementById('acForget');
  if (eye) eye.onclick = function () { pwShow = !pwShow; eye.innerHTML = '<i class="fa-solid fa-eye' + (pwShow ? '-slash' : '') + '"></i>'; acRefresh(); };
  if (fg) fg.onclick = function () { if (user) localStorage.removeItem(pwKey()); pwShow = false; acRefresh(); };
  setInterval(acRefresh, 1500);

  var wrap = function (name, make) { var o = window[name]; if (typeof o === 'function') window[name] = make(o); };
  var onSign = function (o) { return async function () {
    var pw = document.getElementById('aPass').value, r = await o.apply(this, arguments);
    if (user && pw) localStorage.setItem(pwKey(), pw); acRefresh(); return r; }; };
  wrap('login', onSign); wrap('signup', onSign);
  wrap('changePassword', function (o) { return async function () {
    var n = document.getElementById('cpNew').value, r = await o.apply(this, arguments);
    if (user && n.length >= 6 && document.getElementById('cpNew').value === '') localStorage.setItem(pwKey(), n);   // the app clears the box only on success
    acRefresh(); return r; }; });
  wrap('logout', function (o) { return function () { try { if (user) localStorage.removeItem(pwKey()); } catch (e) {} return o.apply(this, arguments); }; });

  /* ---------- 4) A running stopwatch belongs to ONE account ---------- */
  var tOwn = function (v) { return v === undefined ? localStorage.getItem('ev_timer_owner') : (v ? localStorage.setItem('ev_timer_owner', v) : localStorage.removeItem('ev_timer_owner')); };
  function guardTimer() {
    if (!user) return;
    var uid = user.id, owner = tOwn(), cur = localStorage.getItem('ev_timer');
    if (cur && owner && owner !== uid) {          // the saved stopwatch is from ANOTHER account on this device
      try { var o = JSON.parse(cur); o.running = false; cur = JSON.stringify(o); } catch (e) {}
      localStorage.setItem('ev_timer_of_' + owner, cur);   // keep it for that account, paused
      try { abandon(); } catch (e) { localStorage.removeItem('ev_timer'); }
      tOwn('');
    }
    if (!localStorage.getItem('ev_timer')) {      // this account had a stopwatch parked on this device: bring it back
      var mine = localStorage.getItem('ev_timer_of_' + uid);
      if (mine) { localStorage.setItem('ev_timer', mine); localStorage.removeItem('ev_timer_of_' + uid); try { restoreTimer(); } catch (e) {} }
    }
    if (localStorage.getItem('ev_timer')) tOwn(uid);
  }
  var _ol = window.onLogin;
  if (typeof _ol === 'function') window.onLogin = function () { try { guardTimer(); } catch (e) { console.error(e); } return _ol.apply(this, arguments); };
  var _t2 = window.toggleTimer;
  if (typeof _t2 === 'function') window.toggleTimer = function () {
    var r = _t2.apply(this, arguments);
    try { if (user && localStorage.getItem('ev_timer')) tOwn(user.id); } catch (e) {}
    return r;
  };

  // an X button on the "other device" bar: drop that stopwatch without saving it
  var rbtns = document.querySelector('#remBar .shrink-0');
  if (rbtns && !document.getElementById('remDiscard')) {
    var dbtn = document.createElement('button');
    dbtn.id = 'remDiscard'; dbtn.type = 'button'; dbtn.title = 'Discard without saving';
    dbtn.className = 'btn bg-slate-800 hover:bg-slate-700 !py-1.5 !px-3 text-xs';
    dbtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    dbtn.onclick = async function () {
      if (!remote || !confirm('Discard this stopwatch WITHOUT saving it? If it is really running on another device, it will stop there too.')) return;
      var id = remote.id || ('discard-' + Date.now());
      remote = null; remBar(); await remotePush(id);
    };
    rbtns.appendChild(dbtn);
  }

})();
