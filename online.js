/* أصول ديني — اللعب أونلاين: أصدقاء برمز، تحدٍّ مباشر، غرفة سريعة، لوحة الأبطال.
   بلا محادثة وبلا أسماء حقيقية: اللقب يُركَّب من كلمات جاهزة. */
(function () {
  'use strict';
  const FB_CONFIG = {
    apiKey: 'AIzaSyD-nHen8g6f5hF1vgS_HYhqCzSyl5XUfJw',
    authDomain: 'usool-deeni.firebaseapp.com',
    databaseURL: 'https://usool-deeni-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'usool-deeni',
    storageBucket: 'usool-deeni.firebasestorage.app',
    messagingSenderId: '1017863256932',
    appId: '1:1017863256932:web:d5381aeafb4e216b055871'
  };
  const N_Q = 8, Q_MS = 15000, REVEAL_MS = 4000, ROUND = Q_MS + REVEAL_MS, LEAD_MS = 5000;
  // صور الطفل: شخصيات أولاد وبنات بألوان متنوّعة (من v6.3 بدل الحيوانات)
  const AV_B = ['👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '🧒', '🧒🏻', '🧒🏽'];
  const AV_G = ['👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '🧕', '🧕🏻', '🧕🏽'];
  const isGirl = () => !!(window.Cups && Cups.sex === 'g');
  let afterProf = null; // من «ملفّي»: بعد الحفظ نرجع إليه
  const W1 = ['نجم', 'بطل', 'فارس', 'قمر', 'نور', 'سراج', 'غيث', 'زهرة'];
  const W2 = ['التوحيد', 'العدل', 'الهدى', 'الإيمان', 'العلم', 'الصدق', 'الصبر', 'اليقين'];
  const CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let fb = null, db = null, me = null, off = 0, profile = null, ready = null;
  let room = null, roomRef = null, roomOff = null, loop = null, invOff = null, pinTimer = null;

  const now = () => Date.now() + off;
  const esc = (v) => String(v == null ? '' : v).replace(/[<>&"]/g, '');
  const week = () => Math.floor((now() - Date.UTC(2024, 0, 5)) / (7 * 864e5)); // يبدأ كل جمعة
  const body = () => $('#onBody');
  const maxStage = () => { let m = 0; STAGES.forEach((s, i) => { if (unlocked(i)) m = i; }); return m; };

  function loadScript(src) {
    return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
  }
  const withTimeout = (p, ms, step) => Promise.race([p, new Promise((_, bad) => setTimeout(() => bad(new Error('timeout:' + step)), ms))]);
  let lastErr = '';
  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!navigator.onLine) throw new Error('offline');
      if (!window.firebase || !firebase.database) {
        await withTimeout(loadScript('vendor/firebase-app-compat.js'), 20000, 'scripts');
        await withTimeout(loadScript('vendor/firebase-auth-compat.js'), 20000, 'scripts');
        await withTimeout(loadScript('vendor/firebase-database-compat.js'), 20000, 'scripts');
      }
      fb = firebase.apps.length ? firebase.app() : firebase.initializeApp(FB_CONFIG);
      const cred = await withTimeout((async () => {
        const u0 = fb.auth().currentUser || (await new Promise(r => { const u = fb.auth().onAuthStateChanged(x => { u(); r(x); }); }));
        return u0 || (await fb.auth().signInAnonymously()).user;
      })(), 20000, 'auth');
      me = cred.uid;
      db = fb.database();
      db.goOnline();
      db.ref('.info/serverTimeOffset').on('value', s => { off = s.val() || 0; });
      const p = await withTimeout(db.ref('profiles/' + me).once('value'), 20000, 'db');
      profile = p.val();
      if (profile && profile.nick && (state.nick !== profile.nick || state.av !== profile.av)) { state.nick = profile.nick; state.av = profile.av; save(); }
      if (profile) { startPresence(); db.ref('profiles/' + me).update({ seen: firebase.database.ServerValue.TIMESTAMP }).catch(() => {}); }
      try { ban = (await db.ref('bans/' + me).get()).val(); } catch (e) { ban = null; }
      return true;
    })();
    ready.catch(e => { lastErr = (e && (e.code || e.message)) || String(e); ready = null; try { if (db) db.goOffline(); } catch (x) {} });
    return ready;
  }
  function startPresence() {
    const pr = db.ref('presence/' + me);
    db.ref('.info/connected').on('value', s => {
      if (!s.val()) return;
      pr.onDisconnect().remove().then(() => pr.set({ on: true, t: firebase.database.ServerValue.TIMESTAMP }));
    });
    listenInvites();
  }

  /* ---------- screens ---------- */
  function setHead(t) { $('#onTitle').textContent = t; }
  async function openOnline() {
    show('online'); setHead('🌐 العب أونلاين');
    document.documentElement.style.setProperty('--sc', '#2f6fd0');
    body().innerHTML = `<div class="handoff"><div class="big spin">🌐</div><p>جارٍ الاتصال…</p></div>`;
    try { await init(); } catch (e) {
      body().innerHTML = `<div class="handoff"><div class="big">📡</div><h2>لا يوجد اتصال</h2><p>تعذّر الاتصال بخادم اللعب. تأكّد من الإنترنت ثم حاول مرة أخرى.</p><button class="btn gold" id="onRetry" style="flex:none;min-width:200px">حاول مرة أخرى</button><p class="tip" dir="ltr" style="opacity:.7">${esc(lastErr)}</p></div>`;
      $('#onRetry').onclick = openOnline; return;
    }
    if (banned()) return bannedScreen();
    if (!profile) return setupProfile();
    hub();
  }
  // ⛔ الحظر: يمنع اللعب أونلاين فقط (التعلّم والبيت يبقيان مفتوحين). قواعد Firebase تمنعه أيضًا.
  let ban = null;
  const banned = () => !!(ban && ban.until && ban.until > now());
  function bannedScreen() {
    setHead('⛔ اللعب أونلاين موقوف');
    const d = new Date(ban.until);
    body().innerHTML = `<div class="handoff"><div class="big">⛔</div><h2>اللعب أونلاين موقوف مؤقتًا</h2>
      <p>أوقفت الإدارة لعبك أونلاين حتى<br><b>${d.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' })} · ${d.toLocaleTimeString('ar-IQ', { hour: 'numeric', minute: '2-digit' })}</b></p>
      ${ban.why ? `<p class="tip">السبب: ${esc(ban.why)}</p>` : ''}
      <p>تستطيع أن تتعلّم وتحفظ وتبني بيتك كالعادة 🤍<br>العب بصدق وأمانة، فالله يحبّ الصادقين.</p>
      <button class="btn gold" id="banHome" style="flex:none;min-width:200px">الرئيسية</button></div>`;
    $('#banHome').onclick = () => { renderHome(); show('home'); };
  }

  function setupProfile() {
    setHead('✏️ اسمي وصورتي');
    // الطفل يكتب اسمه المستعار بنفسه، واللقب (شاطر العقيدة، نجم الصلاة...) يأتي تلقائيًا من مستواه (alqab.js)
    let av = (profile && profile.av) || (isGirl() ? AV_G[0] : AV_B[0]), own = (profile && profile.nick) || '';
    const draw = () => {
      body().innerHTML = `<div class="card" style="flex:none">
        <h2 style="text-align:center">مرحبًا يا بطل! 👋</h2>
        <p style="text-align:center;color:var(--muted)">اختر صورتك واكتب اسمك الذي يراه أصدقاؤك.<br>ولقبك يأتي وحده من شطارتك: بالعقيدة، بالصلاة، بالقرآن، بالتحديات… 🌟</p>
        <div class="preview"><span class="av">${av}</span><b id="nickPrev">${esc(own || 'اسمك هنا')}</b></div>
        <div class="pick-h">صورتك 👦 أولاد</div><div class="chips">${AV_B.map(a => `<button class="pk ${a === av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
        <div class="pick-h">صورتك 👧 بنات</div><div class="chips">${AV_G.map(a => `<button class="pk ${a === av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
        <div class="pick-h">✏️ اسمك</div>
        <input class="inp" id="ownNick" maxlength="16" placeholder="مثل: حيدر، زهراء، أبو علي الصغير" value="${esc(own)}" autocomplete="off">
        <div class="fb" id="nickMsg" style="font-size:14px">اسمك الأول أو اسم تحبّه، بلا اسم العائلة 🤍 حروف عربية فقط (٣ إلى ١٦ حرفًا)</div>
        <div class="nav"><button class="btn gold" id="saveProf">هذا اسمي ✓</button></div></div>`;
      body().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { av = b.dataset.av; draw(); });
      $('#ownNick').oninput = e => { own = e.target.value; $('#nickPrev').textContent = own.trim() || 'اسمك هنا'; };
      $('#saveProf').onclick = async () => {
        $('#saveProf').disabled = true;
        try {
          const why = badNick(own); if (why) { $('#nickMsg').className = 'fb bad'; $('#nickMsg').textContent = why; $('#saveProf').disabled = false; $('#ownNick').focus(); return; }
          const nick = own.trim().replace(/\s+/g, ' '), isOwn = true;
          const code = (profile && profile.code) || await claimCode();
          profile = Object.assign({ wins: 0, games: 0 }, profile || {}, { nick, av, code, own: isOwn });
          await db.ref('profiles/' + me).set(profile);
          state.online = true; state.nick = nick; state.av = av; save();
          startPresence();
          if (afterProf) { const f = afterProf; afterProf = null; window.onlineReturn = null; toast('حُفظ اسمك وصورتك ✓'); f(); } else hub();
        } catch (e) { $('#saveProf').disabled = false; toast('تعذّر الحفظ، حاول مرة أخرى'); }
      };
    };
    draw();
  }
  // لقب يكتبه الطفل: حروف عربية ومسافات فقط (بلا أرقام هواتف ولا روابط)، وبلا كلمات غير لائقة
  const BAD = ['غبي', 'حمار', 'كلب', 'زبال', 'قذر', 'حقير', 'تافه', 'لعن', 'منيوك', 'طيز', 'شرموط', 'عاهر', 'قحب', 'خنزير', 'وسخ', 'سافل', 'جحش', 'زمال'];
  function badNick(t) {
    t = t.trim().replace(/\s+/g, ' ');
    if (t.length < 3) return 'اللقب قصير، اكتب ٣ حروف على الأقل';
    if (!/^[\u0621-\u064A\u0660-\u0669\u064B-\u0652 ]+$/.test(t) || /[\u0660-\u0669]/.test(t)) return 'حروف عربية فقط، بلا أرقام ولا رموز';
    const plain = t.replace(/[\u064B-\u0652]/g, '').replace(/[أإآ]/g, 'ا');
    if (BAD.some(w => plain.includes(w.replace(/[أإآ]/g, 'ا')))) return 'اختر لقبًا جميلًا 🌷';
    return '';
  }
  async function claimCode() {
    for (let i = 0; i < 8; i++) {
      let c = ''; for (let k = 0; k < 6; k++) c += CODE_CH[Math.floor(Math.random() * CODE_CH.length)];
      const r = await db.ref('codes/' + c).transaction(v => (v === null ? me : undefined));
      if (r.committed) return c;
    }
    throw new Error('code');
  }

  function hub() {
    leaveRoom(); setHead('🌐 العب أونلاين');
    body().innerHTML = `<div class="me-card"><span class="av">${profile.av}</span><span class="who-n"><b>${esc(profile.nick)}</b><small>${profile.tt ? esc(profile.tt) + ' · ' : ''}🏆 ${ar(profile.wins || 0)} فوز · ${ar(profile.games || 0)} مباراة</small></span></div>
      <div class="modes">
        <button class="mode" id="oQuick"><span class="e">🔢</span><span><b>غرفة سريعة</b><small>لصديق بجانبك: رمز من ٤ أرقام.</small></span></button>
      </div>
      <p class="tip">👥 لتحدّي صديقك أو إضافة صديق: من الواجهة ← «أصدقائي»<br>🏅 وأبطال هذا الأسبوع في أسفل الواجهة</p>`;
    $('#oQuick').onclick = quick;
  }

  async function friends() {
    setHead('👥 أصدقائي');
    body().innerHTML = `<div class="handoff"><div class="big spin">👥</div></div>`;
    const ids = Object.keys((await db.ref('friends/' + me).get()).val() || {});
    if (!ids.length) {
      body().innerHTML = `<div class="handoff"><div class="big">🤝</div><h2>لا أصدقاء بعد</h2><p>أعطِ رمزك لصديقك، أو اكتب رمزه.</p><button class="btn gold" id="goAdd" style="flex:none;min-width:200px">➕ أضف صديقًا</button></div>`;
      $('#goAdd').onclick = addFriend; return;
    }
    const rows = await Promise.all(ids.map(async id => {
      const [p, pr] = await Promise.all([db.ref('profiles/' + id).get(), db.ref('presence/' + id).get()]);
      return { id, p: p.val() || { nick: '؟', av: '❔' }, on: !!pr.val() };
    }));
    rows.sort((a, b) => b.on - a.on);
    body().innerHTML = `<div class="flist">${rows.map(r => `<div class="frow"><span class="av">${r.p.av}</span><span class="who-n"><b>${esc(r.p.nick)}</b><small>${r.on ? '🟢 متصل الآن' : '⚪ غير متصل'}</small></span>
      <button class="mini go" data-ch="${r.id}" ${r.on ? '' : 'disabled'}>⚔️ تحدَّ</button></div>`).join('')}</div>
      <button class="btn sec" id="backHub" style="margin-top:12px">رجوع</button>`;
    body().querySelectorAll('[data-ch]').forEach(b => b.onclick = () => challenge(b.dataset.ch));
    $('#backHub').onclick = hub;
  }

  function addFriend() {
    setHead('➕ أضف صديقًا');
    body().innerHTML = `<div class="card" style="flex:none;text-align:center"><h2>رمز صديقك</h2>
      <input class="inp" id="fcode" maxlength="6" dir="ltr" autocomplete="off" placeholder="مثل K7M2QA" style="text-transform:uppercase;letter-spacing:4px">
      <div class="fb" id="fmsg"></div><div class="nav"><button class="btn gold" id="fAdd">أضف</button></div>
      <button class="btn sec" id="backHub" style="margin-top:10px">رجوع</button></div>`;
    $('#backHub').onclick = hub;
    $('#fAdd').onclick = async () => {
      const c = $('#fcode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const msg = $('#fmsg');
      if (c.length !== 6) { msg.className = 'fb bad'; msg.textContent = 'الرمز ٦ خانات'; return; }
      if (c === profile.code) { msg.className = 'fb bad'; msg.textContent = 'هذا رمزك أنت 😊'; return; }
      const uid = (await db.ref('codes/' + c).get()).val();
      if (!uid) { msg.className = 'fb bad'; msg.textContent = 'لا يوجد لاعب بهذا الرمز'; return; }
      await db.ref().update({ [`friends/${me}/${uid}`]: true, [`friends/${uid}/${me}`]: true });
      const p = (await db.ref('profiles/' + uid).get()).val() || {};
      msg.className = 'fb ok'; msg.textContent = `أُضيف ${p.av || ''} ${esc(p.nick || '')} ✓`;
      tone(784, .12, 'sine');
    };
  }

  /* ---------- rooms ---------- */
  async function createRoom(guest) {
    const ref = db.ref('rooms').push();
    await ref.set({ host: me, guest: guest || null, state: 'wait', t: firebase.database.ServerValue.TIMESTAMP,
      players: { [me]: { nick: profile.nick, av: profile.av, ms: maxStage(), on: true } } });
    return ref.key;
  }
  async function challenge(uid) {
    const id = await createRoom(uid);
    await db.ref(`invites/${uid}/${me}`).set({ room: id, nick: profile.nick, av: profile.av, t: firebase.database.ServerValue.TIMESTAMP });
    enterRoom(id, true, uid);
  }
  function quick() {
    setHead('🔢 غرفة سريعة');
    body().innerHTML = `<div class="modes"><button class="mode" id="qNew"><span class="e">🏠</span><span><b>أنشئ غرفة</b><small>تحصل على رمز من ٤ أرقام تعطيه لصديقك.</small></span></button>
      <button class="mode" id="qJoin"><span class="e">🚪</span><span><b>ادخل غرفة</b><small>اكتب الرمز الذي أعطاك إياه صديقك.</small></span></button></div>
      <button class="btn sec" id="backHub" style="margin-top:12px">رجوع</button>`;
    $('#backHub').onclick = hub;
    $('#qNew').onclick = async () => {
      const id = await createRoom(null);
      let pin;
      for (let i = 0; i < 8; i++) {
        pin = String(1000 + Math.floor(Math.random() * 9000));
        const r = await db.ref('quick/' + pin).transaction(v => (!v || now() - v.t > 10 * 60000 ? { room: id, t: now() } : undefined));
        if (r.committed) break;
      }
      db.ref('quick/' + pin).onDisconnect().remove();
      enterRoom(id, true, null, pin);
    };
    $('#qJoin').onclick = () => {
      body().innerHTML = `<div class="card" style="flex:none;text-align:center"><h2>رمز الغرفة</h2>
        <input class="inp" id="qpin" maxlength="4" inputmode="numeric" dir="ltr" placeholder="٤ أرقام" style="letter-spacing:8px;font-size:28px">
        <div class="fb" id="qmsg"></div><div class="nav"><button class="btn gold" id="qGo">ادخل</button></div>
        <button class="btn sec" id="backHub" style="margin-top:10px">رجوع</button></div>`;
      $('#backHub').onclick = hub;
      $('#qGo').onclick = async () => {
        const pin = $('#qpin').value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g, '');
        const v = (await db.ref('quick/' + pin).get()).val();
        if (!v || now() - v.t > 10 * 60000) { $('#qmsg').className = 'fb bad'; $('#qmsg').textContent = 'لا توجد غرفة بهذا الرمز'; return; }
        joinRoom(v.room);
      };
    };
  }
  async function joinRoom(id) {
    const r = (await db.ref('rooms/' + id).get()).val();
    if (!r || r.state !== 'wait' || (r.guest && r.guest !== me) || r.host === me) { toast('انتهت هذه الدعوة'); return hub(); }
    await db.ref('rooms/' + id).update({ guest: me, [`players/${me}`]: { nick: profile.nick, av: profile.av, ms: maxStage(), on: true } });
    enterRoom(id, false);
  }

  function enterRoom(id, isHost, invited, pin) {
    leaveRoom();
    room = { id, isHost, scored: false, answered: {}, cut: 1 };
    roomRef = db.ref('rooms/' + id);
    roomRef.child(`players/${me}/on`).onDisconnect().set(false);
    setHead('⚔️ التحدّي');
    body().innerHTML = `<div class="handoff"><div class="big spin">⏳</div>
      ${pin ? `<p>أعطِ صديقك هذا الرمز:</p><div class="pin" dir="ltr">${pin}</div>` : ''}
      <h2>${invited ? 'ننتظر صديقك يقبل التحدّي…' : 'ننتظر الخصم…'}</h2>
      <button class="btn sec" id="cancelRoom" style="flex:none;min-width:200px">إلغاء</button></div>`;
    $('#cancelRoom').onclick = async () => { if (invited) db.ref(`invites/${invited}/${me}`).remove(); if (pin) db.ref('quick/' + pin).remove(); roomRef.update({ state: 'gone' }); hub(); };
    const cb = roomRef.on('value', s => onRoom(s.val(), pin));
    roomOff = () => roomRef.off('value', cb);
  }
  function leaveRoom() {
    if (roomOff) roomOff(); roomOff = null;
    if (loop) clearInterval(loop); loop = null;
    if (roomRef && room && !room.done) { roomRef.child(`players/${me}/on`).set(false); }
    if (roomRef) roomRef.child(`players/${me}/on`).onDisconnect().cancel();
    room = null; roomRef = null;
  }
  function onRoom(r, pin) {
    if (!room || !r) return;
    room.data = r;
    const ids = Object.keys(r.players || {});
    if (r.state === 'gone') { if (!room.done) { toast('أُلغي التحدّي'); hub(); } return; }
    if (r.state === 'wait' && room.isHost && ids.length === 2) {
      if (pin) db.ref('quick/' + pin).remove();
      const lim = Math.min(...ids.map(i => r.players[i].ms || 0));
      const qs = pickFresh(ALLQ.filter(q => q.st <= lim && PLAYABLE(q)), N_Q).map(q => { const p = toPlay(q); return { q: p.q, verse: p.verse || '', src: p.src || '', o: p.o, a: p.a, fixed: !!p.fixed, st: q.st }; });
      roomRef.update({ qs, start: now() + LEAD_MS, state: 'play' });
      return;
    }
    if (r.state === 'play' && !loop) { room.opp = ids.find(i => i !== me); loop = setInterval(tick, 150); tick(); }
  }

  /* scoring is computed from the answers on both phones, so both see the same numbers */
  function scoreOf(r, uid) {
    const ans = (r.players[uid] && r.players[uid].ans) || {};
    let sc = 0, st = 0, right = 0;
    for (let i = 0; i < N_Q; i++) {
      const a = ans[i];
      if (a && a.ok) { st++; right++; sc += (10 + a.left) * (st >= 5 ? 3 : st >= 3 ? 2 : 1) * (i === N_Q - 1 ? 2 : 1); } else st = 0;
    }
    return { sc, right, st };
  }

  function tick() {
    const r = room && room.data; if (!r) return;
    const t = now() - r.start;
    const opp = r.players[room.opp] || {};
    if (opp.on === false && !room.done && t < N_Q * ROUND) { return finish(r, true); }
    if (t < 0) {
      const n = Math.ceil(-t / 1000);
      if (room.cd !== n) { room.cd = n; tone(n <= 3 ? 523 : 392, .12, 'square', .1);
        body().innerHTML = `<div class="vs"><div><span class="av">${r.players[me].av}</span><b>${esc(r.players[me].nick)}</b></div><span class="vs-x">⚔️</span><div><span class="av">${opp.av || '❔'}</span><b>${esc(opp.nick || '')}</b></div></div><div class="countdown-in">${ar(n)}</div>`; }
      return;
    }
    const idx = Math.floor(t / ROUND);
    if (idx >= N_Q) return finish(r, false);
    const inQ = (t % ROUND) < Q_MS;
    const left = Math.max(0, Math.ceil((Q_MS - (t % ROUND)) / 1000));
    if (room.idx !== idx) { room.idx = idx; room.phase = null; }
    if (inQ && room.phase !== 'q') { room.phase = 'q'; drawQ(r, idx); }
    if (!inQ && room.phase !== 'r') { room.phase = 'r'; drawReveal(r, idx); }
    if (inQ) {
      const tl = document.getElementById('tleft'), bar = document.getElementById('tbar');
      if (tl && tl.textContent !== ar(left)) { tl.textContent = ar(left); if (left <= 5 && left > 0) { tone(left <= 2 ? 1200 : 900, .06, 'square', .08); const tb = document.getElementById('tbox'); if (tb) tb.classList.add('hot'); } }
      if (bar) bar.style.transform = `scaleX(${Math.max(0, (Q_MS - (t % ROUND)) / Q_MS)})`;
      const od = document.getElementById('oppState');
      const oa = (opp.ans || {})[idx];
      if (od) od.textContent = oa ? '✅ جاوب' : '🤔 يفكّر…';
    }
    updScores(r);
  }
  function updScores(r) {
    const a = scoreOf(r, me), b = scoreOf(r, room.opp);
    const s = document.getElementById('liveScore');
    if (s) s.innerHTML = `<span>${r.players[me].av} ${ar(a.sc)}</span><span>${ar(b.sc)} ${(r.players[room.opp] || {}).av || ''}</span>`;
  }
  function qOpts(idx) {
    room.opts = room.opts || {};
    if (!room.opts[idx]) { const q = room.data.qs[idx]; room.opts[idx] = { q, si: q.st, opts: withOpts(q).opts }; }
    return room.opts[idx];
  }
  function drawQ(r, idx) {
    const { q, si, opts } = qOpts(idx), golden = idx === N_Q - 1;
    const mine = ((r.players[me].ans) || {})[idx];
    body().innerHTML = `<div class="live" id="liveScore"></div>
      <div class="turn"><span class="pts">سؤال ${ar(idx + 1)} من ${ar(N_Q)}</span><span class="pts">الخصم: <b id="oppState">🤔 يفكّر…</b></span></div>
      <div class="timer" id="tbox"><i id="tbar"></i></div>
      <div class="helps"><button class="help" id="hCut" ${room.cut && !mine ? '' : 'disabled'}>✂️<small>احذف جوابًا</small></button></div>
      <div class="qcard ${golden ? 'golden' : ''}" style="--sc:${golden ? '#d4a017' : STAGES[si].color}"><div class="qn">${golden ? '⭐ السؤال الذهبي — نقاطه مضاعفة! · ' : ''}⏱️ <b id="tleft">${ar(15)}</b></div>${qHead(q)}
      ${opts.map((o, k) => `<button class="opt" data-k="${k}" ${mine ? 'disabled' : ''}><span class="l">${LET[k]}</span><span>${o.t}</span></button>`).join('')}<div class="fb" id="cfb">${mine ? 'انتظر الخصم…' : ''}</div></div>`;
    if (golden) { tone(784, .12, 'sine', .12); tone(1175, .3, 'sine', .12, .12); }
    const btns = [...body().querySelectorAll('.opt')];
    btns.forEach((b, k) => b.onclick = () => {
      if (room.answered[idx]) return; room.answered[idx] = true;
      const t = now() - r.start, left = Math.max(0, Math.ceil((Q_MS - (t % ROUND)) / 1000));
      const ok = opts[k].ok;
      roomRef.child(`players/${me}/ans/${idx}`).set({ ok, left, k: opts[k].t });
      btns.forEach(x => x.disabled = true); b.classList.add('sel');
      $('#hCut').disabled = true; $('#cfb').textContent = 'تم! انتظر الخصم…';
      tone(660, .08, 'sine');
    });
    $('#hCut').onclick = () => {
      if (!room.cut || room.answered[idx]) return; room.cut = 0; $('#hCut').disabled = true; tone(660, .12, 'sine');
      const wrong = btns.filter((b, i) => !opts[i].ok && !b.disabled); const w = wrong[Math.floor(Math.random() * wrong.length)]; if (w) { w.disabled = true; w.classList.add('gone'); }
    };
    updScores(r);
  }
  function drawReveal(r, idx) {
    const { opts } = qOpts(idx);
    const mine = ((r.players[me].ans) || {})[idx], his = (((r.players[room.opp] || {}).ans) || {})[idx];
    const btns = [...body().querySelectorAll('.opt')];
    btns.forEach((b, i) => { b.disabled = true; b.classList.remove('sel'); if (opts[i].ok) b.classList.add('ok'); else if (mine && mine.k === opts[i].t) b.classList.add('bad'); });
    const tb = document.getElementById('tbox'); if (tb) tb.classList.remove('hot');
    const s = scoreOf(r, me);
    const f = $('#cfb');
    if (f) {
      if (mine && mine.ok) { f.className = 'fb ok'; f.textContent = s.st >= 3 ? `🔥 سلسلة ${ar(s.st)}!` : 'أحسنت! ✓'; beep(true); if (s.st === 3) ctBanner('🔥 رائع! النقاط ×٢'); if (s.st === 5) { ctBanner('⚡ لا يُوقَف! ×٣', 'b2'); } }
      else { f.className = 'fb bad'; f.textContent = mine ? 'ليست هذه الإجابة 💪' : '⏰ انتهى الوقت!'; beep(false); try { navigator.vibrate && navigator.vibrate(150); } catch (e) {} }
      f.textContent += his ? (his.ok ? ' · الخصم: ✓' : ' · الخصم: ✗') : ' · الخصم لم يجب';
    }
    updScores(r);
  }

  async function finish(r, forfeit) {
    if (room.done) return; room.done = true;
    if (loop) clearInterval(loop); loop = null;
    const a = scoreOf(r, me), b = scoreOf(r, room.opp), opp = r.players[room.opp] || {};
    const win = forfeit || a.sc > b.sc, tie = !forfeit && a.sc === b.sc;
    body().innerHTML = `<div class="result"><div class="big">${forfeit ? '🏳️' : tie ? '🤝' : win ? '🏆' : '💪'}</div>
      <h2>${forfeit ? 'خرج خصمك — الفوز لك!' : tie ? 'تعادل! كلاكما بطل' : win ? 'فزت يا بطل!' : 'أحسنت المحاولة!'}</h2>
      <div class="board"><div class="${win && !tie ? 'win' : ''}"><span class="av">${r.players[me].av}</span><small class="nk">أنت</small><b>${ar(a.sc)}</b><small>${ar(a.right)} صحيحة</small></div>
      <div class="${!win && !tie ? 'win' : ''}"><span class="av">${opp.av || '❔'}</span><small class="nk">${esc(opp.nick || '')}</small><b>${ar(b.sc)}</b><small>${ar(b.right)} صحيحة</small></div></div>
      ${!win && !tie ? '<p class="tip">المرة القادمة لك إن شاء الله! 💪</p>' : ''}
      <div class="nav"><button class="btn gold" id="again">تحدٍّ جديد</button></div><div class="nav"><button class="btn sec" id="toHub">الرئيسية أونلاين</button></div></div>`;
    if (win || tie) { fanfare(); confetti(); }
    if (window.Deco) { const jw = Deco.challenge(win && !tie ? 30 : tie ? 20 : 10, 'online'); if (jw) $('#onBody .result h2').insertAdjacentHTML('afterend', jw); }
    $('#again').onclick = () => (room && room.opp && !forfeit ? challenge(room.opp) : hub());
    $('#toHub').onclick = hub;
    if (room.isHost) roomRef.update({ state: 'done' });
    // own stats only
    const w = week(), winInc = win && !tie ? 1 : 0;
    profile.wins = (profile.wins || 0) + winInc; profile.games = (profile.games || 0) + 1;
    // دقّة الإجابات: تساعد الإدارة على معرفة من يتعمّد الإجابات الخاطئة
    const acc = profile.acc || {}; profile.acc = { r: (acc.r | 0) + a.right, q: (acc.q | 0) + N_Q, z: (acc.z | 0) + (a.right === 0 ? 1 : 0) };
    db.ref('profiles/' + me).update({ wins: profile.wins, games: profile.games, acc: profile.acc, seen: firebase.database.ServerValue.TIMESTAMP });
    db.ref(`leader/${w}/${me}`).transaction(v => { v = v || { wins: 0, pts: 0 }; return Object.assign({}, v, { nick: profile.nick, av: profile.av, wins: (v.wins || 0) + winInc, pts: (v.pts || 0) + a.sc }); });
    if (winInc && window.Aamal) Aamal.grow('win');
    if (window.Alqab) Alqab.soon();
  }

  async function board() {
    setHead('🏅 لوحة الأبطال');
    body().innerHTML = `<div class="handoff"><div class="big spin">🏅</div></div>`;
    const s = await db.ref('leader/' + week()).get();
    const rows = []; s.forEach(c => { rows.push({ id: c.key, ...c.val() }); });
    const key = r => Math.max(r.xp || 0, (r.wins || 0) * 10);
    rows.sort((x, y) => (key(y) - key(x)) || ((y.wins || 0) - (x.wins || 0)) || ((y.pts || 0) - (x.pts || 0))); rows.splice(30);
    const medal = i => ['🥇', '🥈', '🥉'][i] || ar(i + 1);
    body().innerHTML = rows.length ? `<p class="tip">أبطال هذا الأسبوع: بالأعمال الصالحة والتعلّم ✨ والانتصارات 🏆 · يبدأ من جديد كل جمعة</p><div class="flist">${rows.map((r, i) => `<div class="frow ${r.id === me ? 'mine' : ''}"><span class="rk">${medal(i)}</span><span class="av">${esc(r.av)}</span><span class="who-n"><b>${esc(r.nick)}</b><small>✨ ${ar(r.xp || 0)} · ${ar(r.pts || 0)} نقطة</small></span><span class="wn">🏆 ${ar(r.wins || 0)}</span></div>`).join('')}</div>
      <button class="btn sec" id="backHub" style="margin-top:12px">رجوع</button>`
      : `<div class="handoff"><div class="big">🏅</div><h2>اللوحة فارغة هذا الأسبوع</h2><p>كن أول بطل! العب تحدّيًا واربح.</p><button class="btn sec" id="backHub" style="flex:none;min-width:200px">رجوع</button></div>`;
    $('#backHub').onclick = hub;
  }

  /* ---------- incoming challenges ---------- */
  function listenInvites() {
    if (invOff) return;
    const ref = db.ref('invites/' + me);
    const cb = ref.on('child_added', async s => {
      const v = s.val(), from = s.key;
      if (!v || now() - (v.t || 0) > 120000 || (room && room.data && room.data.state === 'play')) { s.ref.remove(); return; }
      tone(880, .1, 'sine'); tone(1320, .15, 'sine', .16, .12);
      const isBayt = v.kind === 'bayt';
      modal(`<div style="font-size:52px">${v.av}</div><h3 style="margin:4px 0">${esc(v.nick)}</h3><p>${isBayt ? 'يدعوك إلى سباق بناء البيت! 🏗️🏁' : 'يتحدّاك الآن! ⚔️'}</p>
        <div class="nav"><button class="btn sec" id="invNo">لاحقًا</button><button class="btn gold" id="invYes">قبول التحدّي</button></div>`, () => {
        $('#invNo').onclick = () => { closeModal(); s.ref.remove(); db.ref('rooms/' + v.room).update({ state: 'gone' }); };
        $('#invYes').onclick = () => { closeModal(); s.ref.remove(); if (isBayt && window.BaytRace) return BaytRace.join(v.room); show('online'); joinRoom(v.room); };
      });
    });
    invOff = () => ref.off('child_added', cb);
  }

  function toast(t) { const d = document.createElement('div'); d.className = 'ctbanner b2'; d.style.fontSize = '18px'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1400); }

  window.openOnline = openOnline;
  // for «بيتك في الجنة»: friends' houses, gifts and likes
  window.OnlineAPI = {
    init: () => init(), get db() { return db; }, get me() { return me; }, get profile() { return profile; },
    get lastErr() { return lastErr; }, now, esc, toast, get busy() { return !!(room && room.data && room.data.state === 'play'); },
    friendIds: async () => Object.keys((await db.ref('friends/' + me).get()).val() || {}),
    week, get banned() { return banned(); }, get ban() { return ban; },
    challenge: async (uid) => { show('online'); try { await init(); } catch (e) { return openOnline(); } if (banned()) return bannedScreen(); if (!profile) return setupProfile(); challenge(uid); },
    openBoard: async () => { show('online'); try { await init(); } catch (e) { return openOnline(); } if (!profile) return setupProfile(); board(); },
    editProfile: async (back) => { afterProf = back || null; window.onlineReturn = back || null; show('online'); setHead('✏️ اسمي وصورتي');
      body().innerHTML = `<div class="handoff"><div class="big spin">🌐</div><p>جارٍ الاتصال…</p></div>`;
      try { await init(); } catch (e) { afterProf = null; return openOnline(); } setupProfile(); },
    openAdd: async () => { show('online'); try { await init(); } catch (e) { return openOnline(); } if (banned()) return bannedScreen(); if (!profile) return setupProfile(); addFriend(); }
  };
  window.onlineBack = () => { if (room && room.data && room.data.state === 'play' && !room.done) {
      modal(`<h3 style="margin:4px 0">تريد الانسحاب؟</h3><p>إذا خرجت يفوز خصمك.</p><div class="nav"><button class="btn sec" data-close>أكمل</button><button class="btn" id="mQuit">انسحاب</button></div>`,
        () => { $('#mQuit').onclick = () => { closeModal(); room.done = true; leaveRoom(); renderHome(); show('home'); }; });
    } else { leaveRoom(); if (window.onlineReturn) { const f = window.onlineReturn; window.onlineReturn = null; f(); return; } renderHome(); show('home'); } };
  // reconnect quietly for invites if the child played online before
  window.addEventListener('load', () => { try { if (state.online && navigator.onLine) init().catch(() => {}); } catch (e) {} });
  window.markOnline = () => { state.online = true; save(); };
})();
