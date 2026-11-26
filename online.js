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
  // (v21.7) صور أكثر بكل ألوان البشرة + أمير/أميرة للقصر؛ الطفل في المدينة المجسّمة يُرسم بنفس الصورة (mujassam.js kidLook)
  const AV_B = ['👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '🧒', '🧒🏻', '🧒🏽', '👲', '👲🏻', '👲🏽', '🤴', '🤴🏻', '🤴🏽'];
  const ADM_AV = '🏙️';
  const AV_G = ['👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '🧕', '🧕🏻', '🧕🏼', '🧕🏽', '🧕🏾', '🧕🏿', '👸', '👸🏻', '👸🏽'];
  const isGirl = () => !!(window.Cups && Cups.sex === 'g');
  let afterProf = null; // من «ملفّي»: بعد الحفظ نرجع إليه
  const W1 = ['نجم', 'بطل', 'فارس', 'قمر', 'نور', 'سراج', 'غيث', 'زهرة'];
  const W2 = ['التوحيد', 'العدل', 'الهدى', 'الإيمان', 'العلم', 'الصدق', 'الصبر', 'اليقين'];
  const CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let fb = null, db = null, me = null, off = 0, profile = null, ready = null;
  let room = null, roomRef = null, roomOff = null, loop = null, invOff = null, pinTimer = null;

  const now = () => Date.now() + off;
  // 👑 حساب المدير (v8.4): اسمه مزخرف ويُعرف أنه المدير، وجواهره بلا حدود. admins/$uid يُضبط من لوحة Firebase فقط، والقواعد تمنع غيره من وضع adm.
  window.isAdm = () => { try { return localStorage.getItem('usul5_adm') === '1'; } catch (e) { return false; } };
  window.nameTag = (nick, adm) => adm ? `<span class="admn">👑 ${esc(nick)}</span> <span class="admb">مدير التطبيق</span>` : esc(nick);
  { const st = document.createElement('style'); st.textContent = `.admn{font-weight:900;background:linear-gradient(90deg,#b9851a,#f2b632 40%,#e0731f 70%,#b9851a);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}
.admb{display:inline-block;font-size:11px;font-weight:800;color:#fff;background:linear-gradient(160deg,#1fa463,#0b5a32);border-radius:10px;padding:0 7px;line-height:1.7;vertical-align:middle;box-shadow:0 2px 0 #0a3d27;white-space:nowrap}
.lobby{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:6px 0 10px}
.lseat{width:76px;background:#fff;border:3px dashed var(--line);border-radius:16px;padding:6px 2px;text-align:center;opacity:.6}
.lseat.on{border-style:solid;border-color:var(--gold);opacity:1}
.lseat .av{font-size:34px;display:block;line-height:1.2}.lseat small{display:block;font-weight:800;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vs.many{flex-wrap:wrap}.vs.many .av{font-size:44px}.vs.many .vs-x{font-size:26px}
.live.many{justify-content:space-around;font-size:17px;flex-wrap:wrap}
.board.many{flex-wrap:wrap}.board.many div{flex:1 1 40%;padding:6px}.board.many b{font-size:24px}.board .md{display:block;font-size:22px}`; document.head.appendChild(st); }
  const esc = (v) => String(v == null ? '' : v).replace(/[<>&"'`]/g, '');
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
      // v23.4: ولد/بنت يؤخذ دائمًا مما اختاره الطفل في «اسمي وصورتي» (كان زرّ في «اختبر نفسك» يقلبه بالخطأ)
      if (profile && profile.sx && window.Cups && Cups.sex !== profile.sx) Cups.setSex(profile.sx);
      if (profile) { startPresence(); db.ref('profiles/' + me).update({ seen: firebase.database.ServerValue.TIMESTAMP }).catch(() => {}); }
      try { ban = (await db.ref('bans/' + me).get()).val(); } catch (e) { ban = null; }
      try { const a = (await db.ref('admins/' + me).get()).val() === true; localStorage.setItem('usul5_adm', a ? '1' : '');
        if (profile && a && !profile.adm) { profile.adm = true; db.ref('profiles/' + me).update({ adm: true }).catch(() => {}); }
        // (v22.0) طلب صاحب التطبيق: صورة المدير صورة مدينة 🏙️ وليست صورة طفل — في كل مكان (بطاقته، الأصدقاء، البيوت…)
        if (profile && a && profile.av !== ADM_AV) { profile.av = ADM_AV; db.ref('profiles/' + me).update({ av: ADM_AV }).catch(() => {}); }
        if (a && state.av !== ADM_AV) { state.av = ADM_AV; save(); }
        if (a && !(profile && profile.sx) && window.Cups && Cups.sex !== 'b') Cups.setSex('b'); // v23.4: حساب المدير (الشيخ) ولد دائمًا ما لم يختر غيره
        if (profile && !a && profile.adm) { delete profile.adm; db.ref('profiles/' + me + '/adm').remove().catch(() => {}); } } catch (e) {}
      return true;
    })();
    ready.catch(e => { lastErr = (e && (e.code || e.message)) || String(e); ready = null; try { if (db) db.goOffline(); } catch (x) {} });
    return ready;
  }
  function startPresence() {
    const pr = db.ref('presence/' + me);
    // v17.7: الإدارة ترى «أونلاين» = داخل التطبيق الآن: profiles/$me/on = وقت آخر نبضة (كل ٤ دقائق والتطبيق ظاهر)،
    // يُحذف عند إخفاء التطبيق أو انقطاع الاتصال
    const onR = db.ref('profiles/' + me + '/on'), TS = () => firebase.database.ServerValue.TIMESTAMP;
    const beat = () => { if (document.visibilityState !== 'hidden') onR.set(TS()).catch(() => {}); };
    db.ref('.info/connected').on('value', s => {
      if (!s.val()) return;
      pr.onDisconnect().remove().then(() => pr.set({ on: true, t: TS() }));
      onR.onDisconnect().remove().then(beat).catch(() => {});
    });
    setInterval(beat, 240000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onR.remove().catch(() => {});
      else { beat(); db.ref('profiles/' + me).update({ seen: TS() }).catch(() => {}); }
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
    // ولد أو بنت: يختاره الطفل عند التسجيل، والصور تظهر حسب اختياره
    let sx = (window.Cups && Cups.sex) || (profile && profile.sx) || '';
    if (!sx && profile && profile.av) sx = AV_G.includes(profile.av) ? 'g' : AV_B.includes(profile.av) ? 'b' : '';
    let av = (profile && profile.av) || state.av || '', own = (profile && profile.nick) || state.nick || '';
    const list = () => sx === 'g' ? AV_G : AV_B;
    const draw = () => {
      if (sx && !list().includes(av)) av = list()[0];
      body().innerHTML = `<div class="card" style="flex:none">
        <h2 style="text-align:center">${sx === 'g' ? 'مرحبًا يا بطلة! 👋' : 'مرحبًا يا بطل! 👋'}</h2>
        ${!profile && window.Ramz ? `<div style="text-align:center"><button class="rzlink" id="rzOld">🔑 عندي رمز حفظ من موبايل قديم</button></div>` : ''}
        <div class="pick-h">أنا…</div>
        <div class="sxpick"><button class="${sx === 'b' ? 'on' : ''}" data-sx="b"><span>👦</span>ولد</button><button class="${sx === 'g' ? 'on' : ''}" data-sx="g"><span>👧</span>بنت</button></div>
        ${sx ? `<p style="text-align:center;color:var(--muted)">اختر${sx === 'g' ? 'ي' : ''} صورتك واكتب${sx === 'g' ? 'ي' : ''} اسمك الذي يراه أصدقاؤك.<br>ولقبك يأتي وحده من شطارتك: بالعقيدة، بالصلاة، بالقرآن، بالتحديات… 🌟</p>
        <div class="preview"><span class="av">${av}</span><b id="nickPrev">${esc(own || 'اسمك هنا')}</b></div>
        <div class="pick-h">صورتك</div><div class="chips">${list().map(a => `<button class="pk ${a === av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
        <div class="pick-h">✏️ اسمك</div>
        <input class="inp" id="ownNick" maxlength="16" placeholder="${sx === 'g' ? 'مثل: زهراء، فاطمة، مريم' : 'مثل: حيدر، علي، أبو علي الصغير'}" value="${esc(own)}" autocomplete="off">
        <div class="fb" id="nickMsg" style="font-size:14px">اسمك الأول أو اسم تحبّه، بلا اسم العائلة 🤍 حروف عربية فقط (٣ إلى ١٦ حرفًا)</div>
        ${profile && profile.nick ? `<p style="text-align:center;font-size:14px;color:var(--muted);margin:4px 0">${(profile.nc | 0) < 1 ? '✏️ يمكنك تغيير اسمك مرة واحدة فقط' : '📨 تغيير اسمك مرة أخرى يحتاج موافقة الإدارة'}</p>` : ''}
        <div class="nav"><button class="btn gold" id="saveProf">هذا اسمي ✓</button></div>` : `<p style="text-align:center;color:var(--muted)">اختر: ولد أو بنت 👆</p>`}</div>`;
      const lk = locked();
      if (lk && sx) { own = profile.nick; const i = $('#ownNick'); i.value = own; i.disabled = true; $('#nickPrev').textContent = own;
        $('#nickMsg').className = 'fb'; $('#nickMsg').textContent = `🔒 الإدارة ثبّتت اسمك حتى ${new Date(lk).toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' })}، وتقدر تغيّر صورتك 🤍`; }
      if ($('#rzOld')) $('#rzOld').onclick = () => Ramz.openRestore();
      body().querySelectorAll('[data-sx]').forEach(b => b.onclick = () => { sx = b.dataset.sx; draw(); });
      if (!sx) return;
      body().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { av = b.dataset.av; draw(); });
      $('#ownNick').oninput = e => { own = e.target.value; $('#nickPrev').textContent = own.trim() || 'اسمك هنا'; };
      $('#saveProf').onclick = async () => {
        $('#saveProf').disabled = true;
        try {
          const why = locked() ? '' : badNick(own); if (why) { $('#nickMsg').className = 'fb bad'; $('#nickMsg').textContent = why; $('#saveProf').disabled = false; $('#ownNick').focus(); return; }
          let nick = own.trim().replace(/\s+/g, ' '), reqTo = '';
          const isOwn = true;
          // v21.2: تغيير الاسم مرة واحدة فقط؛ التغيير الثاني يصير طلبًا للإدارة (nreq/$uid) والاسم الجديد يُحجز له
          const old0 = profile && profile.nick, changing = !!old0 && old0 !== nick && !locked();
          if (changing && (profile.nc | 0) >= 1) {
            let ok = true; try { ok = (await db.ref('nicks/' + nickKey(nick)).transaction(v => (v === null || v === me ? me : undefined))).committed; } catch (e) {}
            if (!ok) { $('#nickMsg').className = 'fb bad'; $('#nickMsg').textContent = 'هذا الاسم أخذه طفل آخر 🙂 غيّره قليلًا، مثل: «' + nick + ' الصغير» أو أضف اسمًا ثانيًا'; $('#saveProf').disabled = false; $('#ownNick').focus(); return; }
            try { const pr = (await db.ref('nreq/' + me).get()).val(); if (pr && pr.to && nickKey(pr.to) !== nickKey(nick) && nickKey(pr.to) !== nickKey(old0)) releaseNick(pr.to); } catch (e) {}
            await db.ref('nreq/' + me).set({ from: old0, to: nick, av, t: firebase.database.ServerValue.TIMESTAMP });
            reqTo = nick; nick = old0;   // الاسم يبقى كما هو حتى توافق الإدارة، والصورة تُحفظ الآن
          }
          if (!locked() && !(await claimNick(nick))) { $('#nickMsg').className = 'fb bad'; $('#nickMsg').textContent = 'هذا الاسم أخذه طفل آخر 🙂 غيّره قليلًا، مثل: «' + nick + ' الصغير» أو أضف اسمًا ثانيًا'; $('#saveProf').disabled = false; $('#ownNick').focus(); return; }
          const code = (profile && profile.code) || await claimCode();
          // سجلّ الأسماء السابقة (تراه الإدارة): آخر ٥ أسماء ووقت آخر تغيير
          const old = profile && profile.nick, extra = {};
          if (old && old !== nick) { extra.hist = [old].concat(String(profile.hist || '').split('|').filter(Boolean)).filter(x => x !== nick).slice(0, 5).join('|'); extra.nts = now(); extra.nc = (profile.nc | 0) + 1; }
          const isNew = !profile || !profile.nick;
          if (window.isAdm && isAdm()) av = ADM_AV; // (v22.0) المدير صورته مدينة دائمًا
          if (!profile || !profile.since) extra.since = now();
          profile = Object.assign({ wins: 0, games: 0 }, profile || {}, { nick, av, sx, code, own: isOwn }, extra);
          if (window.Cups && Cups.setSex) Cups.setSex(sx);
          await db.ref('profiles/' + me).set(Object.assign({}, profile, { tg: firebase.database.ServerValue.TIMESTAMP })); // v21.0: tg لازم يبقى (قواعد ضد الغش)
          state.online = true; state.nick = nick; state.av = av; save();
          startPresence(); refreshLeader();
          if (isNew && window.Idara && Idara.welcome) Idara.welcome(nick);
          const fin = () => { if (afterProf) { const f = afterProf; afterProf = null; window.onlineReturn = null; toast('حُفظ اسمك وصورتك ✓'); f(); } else hub(); };
          if (reqTo) { modal(`<div style="font-size:54px">📨</div><h3 style="margin:4px 0">وصل طلبك إلى الإدارة</h3><p>طلبت تغيير اسمك إلى «${esc(reqTo)}».<br>عندما توافق الإدارة يتغيّر اسمك وحده 🌷<br>إلى ذلك الوقت يبقى اسمك «${esc(nick)}».</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`); hub(); }
          else fin();
        } catch (e) { $('#saveProf').disabled = false; toast('تعذّر الحفظ، حاول مرة أخرى'); }
      };
    };
    draw();
  }
  // الإدارة تستطيع تثبيت اسم الطفل أسبوعًا بعد أن تغيّره (idara.js)
  const locked = () => { const t = window.Aamal && Aamal.d && Aamal.d.nickLock; return profile && profile.nick && t && t > Date.now() ? t : 0; };
  // الاسم والصورة الجديدان يظهران فورًا في أبطال الأسبوع (إن كان الطفل فيهم)
  function refreshLeader() { const lr = db.ref(`leader/${week()}/${me}`); lr.once('value').then(s => { if (s.exists()) return lr.update({ nick: profile.nick, av: profile.av }); }).catch(() => {}); }
  // لقب يكتبه الطفل: حروف عربية ومسافات فقط (بلا أرقام هواتف ولا روابط)، وبلا كلمات غير لائقة
  // كلمات ممنوعة أينما جاءت داخل الاسم (حتى لو فُصلت حروفها بمسافات أو كُرّرت: «ن ع ا ل»، «نعاااال»)
  const BAD = ['غبي', 'حمار', 'كلب', 'زبال', 'قذر', 'حقير', 'تافه', 'لعن', 'منيوك', 'نيوك', 'طيز', 'شرموط', 'عاهر', 'قحب', 'خنزير', 'وسخ', 'سافل', 'جحش', 'زمال',
    'نعال', 'قندره', 'صرمايه', 'كواد', 'قواد', 'ديوث', 'زرب', 'خرا', 'خره', 'منغول', 'معفن', 'حيوان', 'بهيم', 'ملعون', 'لوطي', 'ابليس', 'شيطان', 'مخنث', 'عرص', 'كحبه', 'سكس', 'نياك', 'اثول', 'دايح', 'خايس', 'ممسوخ', 'جريذي', 'جرذي', 'كيرك'];
  // كلمات تُمنع فقط إذا جاءت كلمة كاملة (لأنها جزء من أسماء بريئة: مطيع، كسّار، زقاق…)
  const BAD_W = ['كس', 'طز', 'تفو', 'تف', 'زفت', 'جلب', 'كير', 'عير', 'قرد', 'بقره', 'ثور', 'نجس', 'مطي', 'زق', 'فرخ', 'نيك', 'زنا', 'زاني', 'عرس'];
  // إزالة التشكيل وتوحيد الهمزات والتاء المربوطة والياء — نفس الاسم بأشكال مختلفة يُعدّ اسمًا واحدًا
  const normNick = t => String(t || '').trim().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ');
  const nickKey = t => normNick(t).replace(/ /g, '');
  // كل اسم لطفل واحد فقط: nicks/{مفتاح الاسم} = uid (يُحجز بمعاملة، ويُحرَّر الاسم القديم عند التغيير)
  async function claimNick(nick) {
    const k = nickKey(nick), oldK = profile && profile.nick ? nickKey(profile.nick) : '';
    if (k === oldK) return true;                       // نفس اسمه الحالي (غيّر صورته فقط)
    try {
      const r = await db.ref('nicks/' + k).transaction(v => (v === null || v === me ? me : undefined));
      if (!r.committed) return false;
      if (oldK) db.ref('nicks/' + oldK).transaction(v => (v === me ? null : undefined)).catch(() => {});
      return true;
    } catch (e) { return true; }                       // إن لم تُنشر القواعد بعد: لا نمنع الطفل من الحفظ
  }
  const releaseNick = n => db.ref('nicks/' + nickKey(n)).transaction(v => (v === me ? null : undefined)).catch(() => {});
  function badNick(t) {
    t = t.trim().replace(/\s+/g, ' ');
    if (t.length < 3) return 'الاسم قصير، اكتب ٣ حروف على الأقل';
    if (!/^[\u0621-\u064A\u0660-\u0669\u064B-\u0652 ]+$/.test(t) || /[\u0660-\u0669]/.test(t)) return 'حروف عربية فقط، بلا أرقام ولا رموز';
    const plain = normNick(t), words = plain.split(' ').map(w => w.replace(/(.)\1+/g, '$1'));
    // الحروف المفصولة بمسافات تُجمع: «ن ع ا ل» ← «نعال»، والحرف المكرّر يُختصر: «نعااال» ← «نعال»
    const glued = plain.split(' ').reduce((a, w) => { const L = a.length - 1; if (w.length <= 2 && L >= 0 && a[L].sh) a[L].s += w; else a.push({ s: w, sh: w.length <= 2 }); return a; }, []).map(p => p.s.replace(/(.)\1+/g, '$1'));
    if (BAD.some(w => glued.some(p => p.includes(w))) || BAD_W.some(w => words.includes(w) || words.includes('ال' + w))) return 'هذا الاسم غير لائق 🌷 اختر اسمًا جميلًا يليق بك';
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
    body().innerHTML = `<div class="me-card"><span class="av">${profile.av}</span><span class="who-n"><b>${nameTag(profile.nick, profile.adm)}</b><small>${profile.tt ? esc(profile.tt) + ' · ' : ''}🏆 ${ar(profile.wins || 0)} فوز · ${ar(profile.games || 0)} مباراة</small></span></div>
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
    body().innerHTML = `<div class="flist">${rows.map(r => `<div class="frow"><span class="av">${esc(r.p.av)}</span><span class="who-n"><b>${nameTag(r.p.nick, r.p.adm)}</b><small>${r.on ? '🟢 متصل الآن' : '⚪ غير متصل'}</small></span>
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
      await db.ref().update({ [`friends/${me}/${uid}`]: true, [`friends/${uid}/${me}`]: c }); // v22.7: الرمز إثبات أنك تعرف رمز صديقك (القواعد تتحقق)
      const p = (await db.ref('profiles/' + uid).get()).val() || {};
      msg.className = 'fb ok'; msg.textContent = `أُضيف ${p.av || ''} ${esc(p.nick || '')} ✓`;
      tone(784, .12, 'sine');
    };
  }

  /* ---------- rooms ----------
     v22.7: الغرفة تتسع ٢ أو ٣ أو ٤ لاعبين (طلب صاحب التطبيق). المقاعد: guest (الثاني) ثم s2 (الثالث) ثم s3 (الرابع).
     كل لاعب يحجز مقعدًا فارغًا بنفسه، والقواعد لا تسمح بأخذ مقعد محجوز ولا بأكثر من max.
     يبدأ المضيف تلقائيًا عند امتلاء الغرفة، أو بزر «ابدأ الآن» إذا حضر لاعبان أو أكثر.
     ids = قائمة اللاعبين ساعة البدء (يكتبها المضيف) حتى ترى كل الهواتف نفس اللاعبين. */
  const SEATS = ['guest', 's2', 's3'];
  const clean = v => String(v == null ? '' : v).replace(/[<>]/g, '');
  const meP = () => ({ nick: profile.nick, av: profile.av, ms: maxStage(), on: true });
  async function createRoom(guest, max) {
    const ref = db.ref('rooms').push();
    await ref.set({ host: me, guest: guest || null, max: max || 2, state: 'wait', t: firebase.database.ServerValue.TIMESTAMP,
      players: { [me]: meP() } });
    return ref.key;
  }
  async function challenge(uid) {
    const id = await createRoom(uid, 2);
    await db.ref(`invites/${uid}/${me}`).set({ room: id, nick: profile.nick, av: profile.av, t: firebase.database.ServerValue.TIMESTAMP });
    enterRoom(id, true, uid);
  }
  function quick() {
    setHead('🔢 غرفة سريعة');
    body().innerHTML = `<div class="modes"><button class="mode" id="qNew"><span class="e">🏠</span><span><b>أنشئ غرفة</b><small>تحصل على رمز من ٤ أرقام تعطيه لأصدقائك.</small></span></button>
      <button class="mode" id="qJoin"><span class="e">🚪</span><span><b>ادخل غرفة</b><small>اكتب الرمز الذي أعطاك إياه صديقك.</small></span></button></div>
      <button class="btn sec" id="backHub" style="margin-top:12px">رجوع</button>`;
    $('#backHub').onclick = hub;
    $('#qNew').onclick = () => {
      body().innerHTML = `<div class="card" style="flex:none;text-align:center"><h2>كم لاعبًا في الغرفة؟</h2>
        <div class="modes">${[2, 3, 4].map(n => `<button class="mode" data-n="${n}"><span class="e">${['', '', '👥', '👨‍👩‍👦', '👨‍👩‍👧‍👦'][n]}</span><span><b>${ar(n)} لاعبين</b><small>${['', '', 'أنت وصديق واحد', 'أنت وصديقان', 'أنت و٣ أصدقاء'][n]}</small></span></button>`).join('')}</div>
        <button class="btn sec" id="backQ" style="margin-top:10px">رجوع</button></div>`;
      $('#backQ').onclick = quick;
      body().querySelectorAll('[data-n]').forEach(b => b.onclick = async () => {
        body().querySelectorAll('[data-n]').forEach(x => x.disabled = true);
        const max = +b.dataset.n;
        const id = await createRoom(null, max);
        let pin;
        for (let i = 0; i < 8; i++) {
          pin = String(1000 + Math.floor(Math.random() * 9000));
          const r = await db.ref('quick/' + pin).transaction(v => (!v || now() - v.t > 10 * 60000 ? { room: id, t: now() } : undefined));
          if (r.committed) break;
        }
        db.ref('quick/' + pin).onDisconnect().remove();
        enterRoom(id, true, null, pin);
      });
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
    const ref = db.ref('rooms/' + id);
    const r = (await ref.get()).val();
    if (!r || r.state !== 'wait' || r.host === me) { toast('انتهت هذه الدعوة'); return hub(); }
    const seats = SEATS.slice(0, Math.max(1, (r.max || 2) - 1));
    let seat = seats.find(s => r[s] === me);
    if (!seat && r.guest && seats.length === 1) { toast('انتهت هذه الدعوة'); return hub(); }
    for (const s of seat ? [seat] : seats.filter(s => !r[s])) {
      try { await ref.update({ [s]: me, [`players/${me}`]: meP() }); seat = s; break; } catch (e) { seat = null; }
    }
    if (!seat) { toast('الغرفة ممتلئة 🙂'); return hub(); }
    enterRoom(id, false, null, null, seat);
  }

  function enterRoom(id, isHost, invited, pin, seat) {
    leaveRoom();
    room = { id, isHost, seat, scored: false, answered: {}, cut: 1, pin, invited };
    roomRef = db.ref('rooms/' + id);
    roomRef.child(`players/${me}/on`).onDisconnect().set(false);
    setHead('⚔️ التحدّي');
    body().innerHTML = `<div class="handoff"><div class="big spin">⏳</div>
      ${pin ? `<p>أعطِ أصدقاءك هذا الرمز:</p><div class="pin" dir="ltr">${pin}</div>` : ''}
      <h2 id="waitH">${invited ? 'ننتظر صديقك يقبل التحدّي…' : isHost ? 'ننتظر الأصدقاء…' : 'ننتظر بدء اللعبة…'}</h2>
      <div class="lobby" id="lobby"></div>
      <button class="btn gold" id="startNow" style="flex:none;min-width:200px" hidden>▶️ ابدأ الآن</button>
      <button class="btn sec" id="cancelRoom" style="flex:none;min-width:200px">إلغاء</button></div>`;
    $('#cancelRoom').onclick = () => {
      if (room && !room.data) { // لم تصل بيانات الغرفة بعد
        if (invited) db.ref(`invites/${invited}/${me}`).remove(); if (pin) db.ref('quick/' + pin).remove();
        if (isHost) roomRef.update({ state: 'gone' }).catch(() => {}); room.done = true;
      }
      quitWait(); hub();
    };
    $('#startNow').onclick = () => { if (room && room.data && room.data.state === 'wait') startGame(room.data); };
    const cb = roomRef.on('value', s => onRoom(s.val(), pin));
    // v23.3: انقطع الإنترنت لحظة (أو ذهب الطفل إلى واتساب ليرسل الرمز) → يرجع للغرفة تلقائيًا بدل أن يُحسب خارجًا
    const myRef = roomRef, conR = db.ref('.info/connected');
    const ccb = conR.on('value', c => {
      if (c.val() !== true || !room || room.id !== id || room.done) return;
      const d = room.data, mine = d && d.players && d.players[me];
      if (!isHost && d && !mine) return; // خرج فعلًا (أو أُخرج): لا نعيد إنشاءه
      myRef.child(`players/${me}/on`).onDisconnect().set(false);
      if (!d || !mine || mine.on === false) myRef.child(`players/${me}/on`).set(true).catch(() => {});
      // المضيف: الانقطاع يحذف رمز الغرفة (onDisconnect)، فنعيده ما دامت الغرفة تنتظر
      if (isHost && pin && (!d || d.state === 'wait')) { const qr = db.ref('quick/' + pin);
        qr.transaction(v => (!v || v.room === id || now() - v.t > 10 * 60000 ? { room: id, t: now() } : undefined))
          .then(x => { if (x && x.committed) qr.onDisconnect().remove(); }).catch(() => {}); }
    });
    roomOff = () => { myRef.off('value', cb); conR.off('value', ccb); };
  }
  // v10.8: الإدارة ترى من «يلعب أونلاين الآن»: profiles/$me/pl = وقت بدء المباراة، ويُحذف عند انتهائها أو انقطاع الاتصال
  function playing(on) {
    if (!db || !me || !profile) return;
    const r = db.ref('profiles/' + me + '/pl');
    try { if (on) { r.set(firebase.database.ServerValue.TIMESTAMP).catch(() => {}); r.onDisconnect().remove(); }
      else { r.remove().catch(() => {}); r.onDisconnect().cancel(); } } catch (e) {}
  }
  // v23.3: الخروج من غرفة الانتظار (زر الرجوع أو الإلغاء): المضيف يلغي الغرفة، والضيف في غرفة جماعية يترك مقعده لغيره
  function quitWait() {
    const r = room && room.data; if (!room || room.done || !roomRef || !r || r.state !== 'wait') return;
    room.done = true;
    if (room.isHost || (r.max || 2) <= 2) {
      if (room.invited) db.ref(`invites/${room.invited}/${me}`).remove().catch(() => {}); if (room.pin) db.ref('quick/' + room.pin).remove().catch(() => {});
      roomRef.update({ state: 'gone' }).catch(() => {});
    } else {
      const seat = room.seat || SEATS.find(k => r[k] === me);
      roomRef.child(`players/${me}/on`).onDisconnect().cancel();
      if (seat) roomRef.update({ [seat]: null, [`players/${me}`]: null }).catch(() => {});
    }
  }
  function leaveRoom() {
    quitWait();
    playing(false);
    if (roomOff) roomOff(); roomOff = null;
    if (loop) clearInterval(loop); loop = null;
    if (roomRef && room && !room.done) { roomRef.child(`players/${me}/on`).set(false); }
    if (roomRef) roomRef.child(`players/${me}/on`).onDisconnect().cancel();
    room = null; roomRef = null;
  }
  const liveIds = r => Object.keys(r.players || {}).filter(i => r.players[i] && r.players[i].on !== false);
  function startGame(r) {
    if (!room || !room.isHost || room.starting) return;
    const ids = liveIds(r); if (!ids.includes(me)) ids.unshift(me); if (ids.length < 2) return;
    room.starting = true;
    if (room.pin) db.ref('quick/' + room.pin).remove();
    const lim = Math.min(...ids.map(i => r.players[i].ms || 0));
    const qs = pickFresh(ALLQ.filter(q => q.st <= lim && PLAYABLE(q)), N_Q).map(q => { const p = toPlay(q); return { q: clean(p.q), verse: clean(p.verse), src: clean(p.src), o: p.o.map(clean), a: p.a, fixed: !!p.fixed, st: q.st }; });
    roomRef.update({ qs, ids, start: now() + LEAD_MS, state: 'play' }).catch(() => { room && (room.starting = false); });
  }
  function drawLobby(r) {
    const lb = document.getElementById('lobby'); if (!lb) return;
    const max = r.max || 2, ids = liveIds(r); if (r.players && r.players[me] && !ids.includes(me)) ids.unshift(me);
    const seats = [];
    for (let i = 0; i < max; i++) { const id = ids[i], p = id && r.players[id]; seats.push(p ? `<span class="lseat on"><span class="av">${esc(p.av)}</span><small>${id === me ? 'أنت' : esc(p.nick)}</small></span>` : `<span class="lseat"><span class="av">❔</span><small>ننتظر…</small></span>`); }
    lb.innerHTML = max > 2 || ids.length > 1 ? seats.join('') : '';
    const sb = document.getElementById('startNow');
    if (sb) sb.hidden = !(room.isHost && max > 2 && ids.length >= 2 && ids.length < max);
    if (sb && !sb.hidden) sb.textContent = `▶️ ابدأ الآن (${ar(ids.length)} لاعبين)`;
  }
  function onRoom(r, pin) {
    if (!room || !r) return;
    room.data = r;
    if (r.state === 'gone') { if (!room.done) { toast('أُلغي التحدّي'); hub(); } return; }
    if (r.state === 'wait') {
      drawLobby(r);
      if (room.isHost && new Set(liveIds(r).concat(me)).size >= (r.max || 2)) startGame(r);
      return;
    }
    if (r.state === 'play' && !loop) {
      const ids = (Array.isArray(r.ids) && r.ids.length ? r.ids : Object.keys(r.players || {})).filter(i => r.players[i]);
      if (!ids.includes(me)) { toast('بدأت اللعبة بدونك 🙂'); return hub(); }
      room.ids = [me].concat(ids.filter(i => i !== me)); room.others = room.ids.slice(1); room.opp = room.others[0];
      loop = setInterval(tick, 150); tick(); playing(true);
    }
  }

  /* scoring is computed from the answers on every phone, so all see the same numbers */
  function scoreOf(r, uid) {
    const ans = (r.players[uid] && r.players[uid].ans) || {};
    let sc = 0, st = 0, right = 0;
    for (let i = 0; i < N_Q; i++) {
      const a = ans[i];
      if (a && a.ok) { st++; right++; sc += (10 + a.left) * (st >= 5 ? 3 : st >= 3 ? 2 : 1) * (i === N_Q - 1 ? 2 : 1); } else st = 0;
    }
    return { sc, right, st };
  }

  /* v10.2: shared schedule — when ALL players have answered, the question ends
     at once (after a short pause) instead of waiting for the full 15 s. Every phone
     computes the same schedule from the answer times (at) saved in the room. */
  const BOTH_MS = 900;
  function sched(r) {
    const P = r.players || {}, ids = room && room.ids ? room.ids : Object.keys(P), st = [], en = [];
    let s = 0;
    for (let i = 0; i < N_Q; i++) {
      st.push(s); let e = s + Q_MS;
      const as = ids.filter(u => (P[u] || {}).on !== false || ((P[u] || {}).ans || {})[i]).map(u => ((P[u] || {}).ans || {})[i]);
      if (as.length >= 1 && ids.length >= 2 && as.every(a => a && typeof a.at === 'number')) e = Math.min(e, Math.max(s, ...as.map(a => a.at)) + BOTH_MS);
      en.push(e); s = e + REVEAL_MS;
    }
    return { st, en, total: s };
  }
  const many = () => room.others.length > 1;
  const pOf = (r, u) => r.players[u] || {};
  function tick() {
    const r = room && room.data; if (!r) return;
    const t = now() - r.start;
    const S = sched(r);
    // v23.3: لا نعلن «خرج الجميع» من انقطاع لحظي: ننتظر ١٠ ثوانٍ، فإن رجع أحدهم تستمر اللعبة
    if (!room.done && t < S.total && room.others.every(u => pOf(r, u).on === false)) { room.offT = room.offT || now(); if (now() - room.offT > 10000) return finish(r, true); } else room.offT = 0;
    if (t < 0) {
      const n = Math.ceil(-t / 1000);
      if (room.cd !== n) { room.cd = n; tone(n <= 3 ? 523 : 392, .12, 'square', .1);
        const who = room.ids.map(u => `<div><span class="av">${esc(pOf(r, u).av || '❔')}</span><b>${esc(pOf(r, u).nick || '')}</b></div>`);
        body().innerHTML = `<div class="vs ${many() ? 'many' : ''}">${who.join('<span class="vs-x">⚔️</span>')}</div><div class="countdown-in">${ar(n)}</div>`; }
      return;
    }
    let idx = 0; while (idx < N_Q && t >= S.en[idx] + REVEAL_MS) idx++;
    if (idx >= N_Q) return finish(r, false);
    const inQ = t < S.en[idx], qt = t - S.st[idx];
    const left = Math.max(0, Math.ceil((Q_MS - qt) / 1000));
    if (room.idx !== idx) { room.idx = idx; room.phase = null; }
    if (inQ && room.phase !== 'q') { room.phase = 'q'; drawQ(r, idx); }
    if (!inQ && room.phase !== 'r') { room.phase = 'r'; drawReveal(r, idx); }
    if (inQ) {
      const tl = document.getElementById('tleft'), bar = document.getElementById('tbar');
      if (tl && tl.textContent !== ar(left)) { tl.textContent = ar(left); if (left <= 5 && left > 0) { tone(left <= 2 ? 1200 : 900, .06, 'square', .08); const tb = document.getElementById('tbox'); if (tb) tb.classList.add('hot'); } }
      if (bar) bar.style.transform = `scaleX(${Math.max(0, (Q_MS - qt) / Q_MS)})`;
      const od = document.getElementById('oppState');
      if (od) {
        const done = room.others.filter(u => (pOf(r, u).ans || {})[idx]).length;
        od.textContent = many() ? `✅ ${ar(done)} من ${ar(room.others.length)}` : done ? '✅ جاوب' : '🤔 يفكّر…';
      }
    }
    updScores(r);
  }
  function updScores(r) {
    const s = document.getElementById('liveScore');
    if (s) s.innerHTML = room.ids.map(u => `<span>${esc(pOf(r, u).av)} ${ar(scoreOf(r, u).sc)}</span>`).join('');
  }
  function qOpts(idx) {
    room.opts = room.opts || {};
    if (!room.opts[idx]) {
      const q0 = room.data.qs[idx] || {};
      const q = { q: clean(q0.q), verse: clean(q0.verse), src: clean(q0.src), o: (q0.o || []).map(clean), a: q0.a | 0, fixed: !!q0.fixed, st: STAGES[q0.st] ? q0.st : 0 };
      room.opts[idx] = { q, si: q.st, opts: withOpts(q).opts };
    }
    return room.opts[idx];
  }
  function drawQ(r, idx) {
    const { q, si, opts } = qOpts(idx), golden = idx === N_Q - 1;
    const mine = ((r.players[me].ans) || {})[idx];
    body().innerHTML = `<div class="live ${many() ? 'many' : ''}" id="liveScore"></div>
      <div class="turn"><span class="pts">سؤال ${ar(idx + 1)} من ${ar(N_Q)}</span><span class="pts">${many() ? 'الأصدقاء' : 'الخصم'}: <b id="oppState">🤔 يفكّر…</b></span></div>
      <div class="timer" id="tbox"><i id="tbar"></i></div>
      <div class="helps"><button class="help" id="hCut" ${room.cut && !mine ? '' : 'disabled'}>✂️<small>احذف جوابًا</small></button></div>
      <div class="qcard ${golden ? 'golden' : ''}" style="--sc:${golden ? '#d4a017' : STAGES[si].color}"><div class="qn">${golden ? '⭐ السؤال الذهبي — نقاطه مضاعفة! · ' : ''}⏱️ <b id="tleft">${ar(15)}</b></div>${qHead(q)}
      ${opts.map((o, k) => `<button class="opt" data-k="${k}" ${mine ? 'disabled' : ''}><span class="l">${LET[k]}</span><span>${o.t}</span></button>`).join('')}<div class="fb" id="cfb">${mine ? 'انتظر الآخرين…' : ''}</div></div>`;
    if (golden) { tone(784, .12, 'sine', .12); tone(1175, .3, 'sine', .12, .12); }
    const btns = [...body().querySelectorAll('.opt')];
    btns.forEach((b, k) => b.onclick = () => {
      if (room.answered[idx]) return; room.answered[idx] = true;
      const rd = room.data || r, S = sched(rd), t = now() - rd.start, qt = Math.max(0, t - S.st[idx]);
      if (t >= S.en[idx]) return;
      const left = Math.max(0, Math.ceil((Q_MS - qt) / 1000)), at = Math.min(t, S.st[idx] + Q_MS);
      const ok = opts[k].ok;
      roomRef.child(`players/${me}/ans/${idx}`).set({ ok, left, k: opts[k].t, at });
      btns.forEach(x => x.disabled = true); b.classList.add('sel');
      $('#hCut').disabled = true; $('#cfb').textContent = many() ? 'تم! انتظر الآخرين…' : 'تم! انتظر الخصم…';
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
    const mine = ((r.players[me].ans) || {})[idx];
    const btns = [...body().querySelectorAll('.opt')];
    btns.forEach((b, i) => { b.disabled = true; b.classList.remove('sel'); if (opts[i].ok) b.classList.add('ok'); else if (mine && mine.k === opts[i].t) b.classList.add('bad'); });
    const tb = document.getElementById('tbox'); if (tb) tb.classList.remove('hot');
    const s = scoreOf(r, me);
    const f = $('#cfb');
    if (f) {
      if (mine && mine.ok) { f.className = 'fb ok'; f.textContent = s.st >= 3 ? `🔥 سلسلة ${ar(s.st)}!` : 'أحسنت! ✓'; beep(true); if (s.st === 3) ctBanner('🔥 رائع! النقاط ×٢'); if (s.st === 5) { ctBanner('⚡ لا يُوقَف! ×٣', 'b2'); } }
      else { f.className = 'fb bad'; f.textContent = mine ? 'ليست هذه الإجابة 💪' : '⏰ انتهى الوقت!'; beep(false); try { navigator.vibrate && navigator.vibrate(150); } catch (e) {} }
      if (many()) {
        const right = room.others.filter(u => ((pOf(r, u).ans || {})[idx] || {}).ok).length;
        f.textContent += ` · أصاب ${ar(right)} من ${ar(room.others.length)}`;
      } else {
        const his = (pOf(r, room.opp).ans || {})[idx];
        f.textContent += his ? (his.ok ? ' · الخصم: ✓' : ' · الخصم: ✗') : ' · الخصم لم يجب';
      }
    }
    updScores(r);
  }

  async function finish(r, forfeit) {
    if (room.done) return; room.done = true; playing(false);
    if (loop) clearInterval(loop); loop = null;
    const rows = room.ids.map(u => ({ u, p: pOf(r, u), ...scoreOf(r, u) }));
    const a = rows[0], best = Math.max(...rows.slice(1).map(x => x.sc));
    const win = forfeit || a.sc > best, tie = !forfeit && a.sc === best;
    const place = 1 + rows.filter(x => x.sc > a.sc).length;
    rows.sort((x, y) => y.sc - x.sc);
    const top = rows[0].sc, medal = ['🥇', '🥈', '🥉', '4️⃣'];
    const head = forfeit ? (many() ? 'خرج الجميع — الفوز لك!' : 'خرج خصمك — الفوز لك!') : tie ? (many() ? 'تعادلت في المركز الأول! 🤝' : 'تعادل! كلاكما بطل') : win ? 'فزت يا بطل!' : many() ? `أنت ${['', 'الأول', 'الثاني', 'الثالث', 'الرابع'][place]}! أحسنت 💪` : 'أحسنت المحاولة!';
    body().innerHTML = `<div class="result"><div class="big">${forfeit ? '🏳️' : tie ? '🤝' : win ? '🏆' : place === 2 && many() ? '🥈' : '💪'}</div>
      <h2>${head}</h2>
      <div class="board ${many() ? 'many' : ''}">${rows.map(x => { const i = rows.filter(y => y.sc > x.sc).length; return `<div class="${!forfeit && x.sc === top ? 'win' : forfeit && x.u === me ? 'win' : ''}">${many() ? `<span class="md">${medal[i]}</span>` : ''}<span class="av">${esc(x.p.av || '❔')}</span><small class="nk">${x.u === me ? 'أنت' : esc(x.p.nick || '')}</small><b>${ar(x.sc)}</b><small>${ar(x.right)} صحيحة</small></div>`; }).join('')}</div>
      ${!win && !tie ? '<p class="tip">المرة القادمة لك إن شاء الله! 💪</p>' : ''}
      <div class="nav"><button class="btn gold" id="again">تحدٍّ جديد</button></div><div class="nav"><button class="btn sec" id="toHub">الرئيسية أونلاين</button></div></div>`;
    if (win || tie) { fanfare(); confetti(); }
    if (window.Deco) { const jw = Deco.challenge(win && !tie ? 30 : tie ? 20 : many() && place === 2 ? 15 : 10, 'online'); if (jw) $('#onBody .result h2').insertAdjacentHTML('afterend', jw); }
    const solo = !many() && room.opp && !forfeit ? room.opp : null;
    $('#again').onclick = () => (solo ? challenge(solo) : many() ? quick() : hub());
    $('#toHub').onclick = hub;
    if (room.isHost) roomRef.update({ state: 'done' });
    // own stats only
    const w = week(), winInc = win && !tie ? 1 : 0;
    profile.wins = (profile.wins || 0) + winInc; profile.games = (profile.games || 0) + 1;
    // دقّة الإجابات: تساعد الإدارة على معرفة من يتعمّد الإجابات الخاطئة
    const acc = profile.acc || {}; profile.acc = { r: (acc.r | 0) + a.right, q: (acc.q | 0) + N_Q, z: (acc.z | 0) + (a.right === 0 ? 1 : 0) };
    // v21.0: السيرفر يقبل +1 فوز/مباراة كل 30 ثانية (tg = وقت السيرفر)؛ إذا رُفض نرجع لأرقام السيرفر
    db.ref('profiles/' + me).update({ wins: profile.wins, games: profile.games, acc: profile.acc, tg: firebase.database.ServerValue.TIMESTAMP, seen: firebase.database.ServerValue.TIMESTAMP })
      .catch(() => db.ref('profiles/' + me).get().then(s => { const v = s.val() || {}; profile.wins = v.wins | 0; profile.games = v.games | 0; }).catch(() => {}));
    // v20.9: قواعد السيرفر تقبل فوزًا واحدًا و600 نقطة كحدّ أعلى لكل مباراة، مع وقت السيرفر tw (ضد الغش)
    if (!isAdm()) { const lr = db.ref(`leader/${w}/${me}`); lr.get().then(s => { const v = s.val() || {}; return lr.update({ nick: profile.nick, av: profile.av, wins: (v.wins || 0) + winInc, pts: (v.pts || 0) + Math.min(600, Math.max(0, a.sc | 0)), tw: firebase.database.ServerValue.TIMESTAMP }); }).catch(() => {}); }
    if (winInc && window.Aamal) Aamal.grow('win');
    if (window.Alqab) Alqab.soon();
  }

  async function board() {
    setHead('🏅 لوحة الأبطال');
    body().innerHTML = `<div class="handoff"><div class="big spin">🏅</div></div>`;
    const s = await db.ref('leader/' + week()).get();
    const rows = []; s.forEach(c => { const v = c.val() || {}; if (!v.adm && !(isAdm() && c.key === me)) rows.push({ id: c.key, ...v }); });
    const key = r => Math.max(r.xp || 0, (r.wins || 0) * 10);
    rows.sort((x, y) => (key(y) - key(x)) || ((y.wins || 0) - (x.wins || 0)) || ((y.pts || 0) - (x.pts || 0))); rows.splice(30);
    const medal = i => ['🥇', '🥈', '🥉'][i] || ar(i + 1);
    body().innerHTML = rows.length ? `<p class="tip">أبطال هذا الأسبوع: بالأعمال الصالحة والتعلّم ✨ والانتصارات 🏆 · يبدأ من جديد كل جمعة</p><div class="flist">${rows.map((r, i) => `<div class="frow ${r.id === me ? 'mine' : ''}"><span class="rk">${medal(i)}</span><span class="av">${esc(r.av)}</span><span class="who-n"><b>${nameTag(r.nick, r.adm)}</b><small>✨ ${ar(r.xp || 0)} · ${ar(r.pts || 0)} نقطة</small></span><span class="wn">🏆 ${ar(r.wins || 0)}</span></div>`).join('')}</div>
      <button class="btn sec" id="backHub" style="margin-top:12px">رجوع</button>`
      : `<div class="handoff"><div class="big">🏅</div><h2>اللوحة فارغة هذا الأسبوع</h2><p>كن أول بطل! العب تحدّيًا واربح.</p><button class="btn sec" id="backHub" style="flex:none;min-width:200px">رجوع</button></div>`;
    $('#backHub').onclick = hub;
  }

  /* ---------- 🤝 طلبات الصداقة (v21.8، طلب صاحب التطبيق) ----------
     من «أبطال هذا الأسبوع»: الطفل يطلب صداقة بطل، والطرف الثاني يقبل أو يرفض.
     الطلب يمرّ في invites/{المستقبِل}/{المرسِل} = {kind:'fr',nick,av,t} (القواعد الحالية تسمح، بلا تغيير قواعد).
     القبول يكتب friends للطرفين ثم يرسل للمرسِل {kind:'fra'} «قبل صداقتك». الرفض يحذف الطلب بهدوء (لا يُخبَر المرسل).
     حدود: ٥ طلبات في اليوم، ونفس الشخص مرة كل ٣ أيام. الطلب يبقى ١٤ يومًا حتى يفتح الطرف الثاني التطبيق. */
  const frQ = [];
  function frShowNext() {
    if (!frQ.length) return;
    const busy = $('#modal').classList.contains('on') || !$('#home').classList.contains('on') || document.hidden || (room && room.data && room.data.state === 'play');
    if (busy) { clearTimeout(frShowNext.t); frShowNext.t = setTimeout(frShowNext, 3000); return; }
    const { s, v, from } = frQ.shift();
    const next = () => { closeModal(); setTimeout(frShowNext, 500); };
    if (v.kind === 'fra') {
      tone(784, .12, 'sine'); tone(1046, .15, 'sine', .14, .12);
      modal(`<div style="font-size:56px">${esc(v.av || '🙂')}</div><h3 style="margin:4px 0">🤝 ${esc(v.nick || '')}</h3><p>وافق على صداقتك! صرتما صديقين 🌷</p>
        <div class="nav"><button class="btn gold" id="fraOk">جميل 👍</button></div>`, () => { $('#fraOk').onclick = next; });
      s.ref.remove().catch(() => {}); try { window.Alqab && Alqab.reload && Alqab.reload(); } catch (e) {}
      return;
    }
    tone(880, .1, 'sine'); tone(1320, .15, 'sine', .16, .12);
    modal(`<div style="font-size:56px">${esc(v.av || '🙂')}</div><h3 style="margin:4px 0">${esc(v.nick || '')}</h3><p>يطلب صداقتك 🤝</p>
      <div class="nav"><button class="btn sec" id="frNo">لا، شكرًا</button><button class="btn gold" id="frYes">✅ أقبل الصداقة</button></div>`, () => {
      $('#frNo').onclick = () => { s.ref.remove().catch(() => {}); next(); };
      $('#frYes').onclick = async () => {
        $('#frYes').disabled = true;
        try {
          await db.ref().update({ [`friends/${me}/${from}`]: true, [`friends/${from}/${me}`]: 'fr' }); // v22.7: 'fr' = هو طلب صداقتي (القواعد تتحقق من الطلب)
          s.ref.remove().catch(() => {});
          db.ref(`invites/${from}/${me}`).set({ kind: 'fra', nick: profile.nick, av: profile.av, t: firebase.database.ServerValue.TIMESTAMP }).catch(() => {});
          toast('صرتما صديقين 🤝'); try { window.Alqab && Alqab.reload && Alqab.reload(); } catch (e) {}
        } catch (e) { toast('تعذّر، تأكّد من الإنترنت'); }
        next();
      };
    });
  }
  async function frIn(s, v, from) {
    if (now() - (v.t || 0) > 14 * 864e5 || banned()) { s.ref.remove().catch(() => {}); return; }
    if (v.kind === 'fr') { try { if ((await db.ref(`friends/${me}/${from}`).get()).val()) { s.ref.remove().catch(() => {}); return; } } catch (e) {} }
    if (!frQ.some(x => x.from === from && x.v.kind === v.kind)) frQ.push({ s, v, from });
    frShowNext();
  }
  async function friendReq(uid) {
    try { await init(); } catch (e) { toast('تأكّد من الإنترنت'); return; }
    if (!profile) return setupProfile();
    if (banned()) return bannedScreen();
    if (uid === me) return;
    if ((await db.ref(`friends/${me}/${uid}`).get()).val()) { toast('أنتما صديقان من قبل 🤝'); return; }
    const day = new Date().toDateString(); state.frq = state.frq && typeof state.frq === 'object' ? state.frq : { d: '', n: 0, ids: {} };
    const q = state.frq; q.ids = q.ids || {}; if (q.d !== day) { q.d = day; q.n = 0; }
    if (q.ids[uid] && Date.now() - q.ids[uid] < 3 * 864e5) { toast('أرسلت طلبًا من قبل، انتظر الجواب 🤍'); return; }
    if (q.n >= 5) { toast('تكفي ٥ طلبات صداقة في اليوم 🤍 جرّب غدًا'); return; }
    try { await db.ref(`invites/${uid}/${me}`).set({ kind: 'fr', nick: profile.nick, av: profile.av, t: firebase.database.ServerValue.TIMESTAMP }); }
    catch (e) { toast('تعذّر الإرسال، تأكّد من الإنترنت'); return; }
    q.n++; q.ids[uid] = Date.now(); const k = Object.keys(q.ids); if (k.length > 80) delete q.ids[k[0]]; save();
    toast('أُرسل طلب الصداقة 🤝 بانتظار الموافقة');
  }

  /* ---------- incoming challenges ---------- */
  function listenInvites() {
    if (invOff) return;
    const ref = db.ref('invites/' + me);
    const cb = ref.on('child_added', async s => {
      const v = s.val(), from = s.key;
      if (v && (v.kind === 'fr' || v.kind === 'fra')) return frIn(s, v, from); // (v21.8) طلبات الصداقة لها طريقها
      if (!v || now() - (v.t || 0) > 120000 || (room && room.data && room.data.state === 'play')) { s.ref.remove(); return; }
      tone(880, .1, 'sine'); tone(1320, .15, 'sine', .16, .12);
      const isBayt = v.kind === 'bayt';
      modal(`<div style="font-size:52px">${esc(v.av)}</div><h3 style="margin:4px 0">${esc(v.nick)}</h3><p>${isBayt ? 'يدعوك إلى سباق بناء البيت! 🏗️🏁' : 'يتحدّاك الآن! ⚔️'}</p>
        <div class="nav"><button class="btn sec" id="invNo">لاحقًا</button><button class="btn gold" id="invYes">قبول التحدّي</button></div>`, () => {
        $('#invNo').onclick = () => { closeModal(); s.ref.remove(); db.ref('rooms/' + v.room).update({ state: 'gone' }); };
        $('#invYes').onclick = () => { closeModal(); s.ref.remove(); if (isBayt && window.BaytRace) return BaytRace.join(v.room); show('online'); joinRoom(v.room); };
      });
    });
    invOff = () => ref.off('child_added', cb);
  }

  function toast(t) { const d = document.createElement('div'); d.className = 'ctbanner b2'; d.style.fontSize = '18px'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1400); }

  /* v21.1: إجباري من أول دخول — ولد أو بنت + صورة + اسم (طلب صاحب التطبيق).
     مع الإنترنت: شاشة «اسمي وصورتي» الحقيقية (الاسم محجوز للطفل). بلا إنترنت: نفس الاختيارات تُحفظ بالجهاز،
     وتُكمَّل أونلاين لاحقًا (setupProfile يأخذ الاسم والصورة المحفوظين). تتكرّر عند كل رجوع للرئيسية حتى يكمل. */
  const needSetup = () => !(state.nick && window.Cups && Cups.sex);
  let gating = false;
  const goHome = () => { gating = false; renderHome(); show('home'); };
  async function gate() {
    if (gating || !needSetup()) return; gating = true;
    show('online'); setHead('✏️ اسمي وصورتي');
    body().innerHTML = `<div class="handoff"><div class="big spin">🌐</div><p>لحظة…</p></div>`;
    try {
      await Promise.race([init(), new Promise((_, no) => setTimeout(() => no(new Error('slow')), 8000))]);
      if (profile && profile.nick && (profile.sx || window.Cups && Cups.sex)) { // طفل مسجّل من قبل: نأخذ بياناته بدون سؤال
        const sx = (window.Cups && Cups.sex) || profile.sx; if (window.Cups && Cups.setSex) Cups.setSex(sx);
        state.nick = profile.nick; state.av = profile.av; save(); return goHome();
      }
      afterProf = goHome; window.onlineReturn = goHome; setupProfile();
    } catch (e) { localSetup(); }
  }
  function localSetup() {
    let sx = (window.Cups && Cups.sex) || '', av = state.av || '', own = state.nick || '';
    const draw = () => {
      const list = sx === 'g' ? AV_G : AV_B; if (sx && !list.includes(av)) av = list[0];
      body().innerHTML = `<div class="card" style="flex:none">
        <h2 style="text-align:center">${sx === 'g' ? 'مرحبًا يا بطلة! 👋' : 'مرحبًا يا بطل! 👋'}</h2>
        <div class="pick-h">أنا…</div>
        <div class="sxpick"><button class="${sx === 'b' ? 'on' : ''}" data-sx="b"><span>👦</span>ولد</button><button class="${sx === 'g' ? 'on' : ''}" data-sx="g"><span>👧</span>بنت</button></div>
        ${sx ? `<div class="preview"><span class="av">${av}</span><b id="nickPrev">${esc(own || 'اسمك هنا')}</b></div>
        <div class="pick-h">صورتك</div><div class="chips">${list.map(a => `<button class="pk ${a === av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
        <div class="pick-h">✏️ اسمك</div>
        <input class="inp" id="ownNick" maxlength="16" placeholder="${sx === 'g' ? 'مثل: زهراء، فاطمة، مريم' : 'مثل: حيدر، علي، أبو علي الصغير'}" value="${esc(own)}" autocomplete="off">
        <div class="fb" id="nickMsg" style="font-size:14px">اسمك الأول أو اسم تحبّه، بلا اسم العائلة 🤍 حروف عربية فقط (٣ إلى ١٦ حرفًا)</div>
        <div class="nav"><button class="btn gold" id="saveProf">هذا اسمي ✓</button></div>` : `<p style="text-align:center;color:var(--muted)">اختر: ولد أو بنت 👆</p>`}</div>`;
      body().querySelectorAll('[data-sx]').forEach(b => b.onclick = () => { sx = b.dataset.sx; draw(); });
      if (!sx) return;
      body().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { av = b.dataset.av; draw(); });
      $('#ownNick').oninput = e => { own = e.target.value; $('#nickPrev').textContent = own.trim() || 'اسمك هنا'; };
      $('#saveProf').onclick = () => {
        const why = badNick(own); if (why) { $('#nickMsg').className = 'fb bad'; $('#nickMsg').textContent = why; $('#ownNick').focus(); return; }
        if (window.Cups && Cups.setSex) Cups.setSex(sx);
        state.nick = own.trim().replace(/\s+/g, ' '); state.av = av; save(); toast('حُفظ اسمك وصورتك ✓'); goHome();
      };
    };
    draw();
  }
  { const _rh = window.renderHome; window.renderHome = function () { const r = _rh.apply(this, arguments); if (needSetup()) setTimeout(homeGate, 400); return r; };
    // فقط إذا الطفل فعلًا بالرئيسية (رجع منها بزر الرجوع) نعيد فتح الشاشة؛ لا نقاطعه وهو يكتب
    const homeGate = () => { const h = document.getElementById('home'); if (needSetup() && h && h.classList.contains('on')) { gating = false; gate(); } };
    window.addEventListener('load', () => setTimeout(homeGate, 1200)); }

  window.openOnline = openOnline;
  // for «بيتك في الجنة»: friends' houses, gifts and likes
  window.OnlineAPI = { playing,
    init: () => init(), get db() { return db; }, get me() { return me; }, get profile() { return profile; },
    get lastErr() { return lastErr; }, now, esc, toast, get busy() { return !!(room && room.data && room.data.state === 'play'); },
    friendIds: async () => Object.keys((await db.ref('friends/' + me).get()).val() || {}),
    week, get banned() { return banned(); }, get ban() { return ban; },
    challenge: async (uid) => { show('online'); try { await init(); } catch (e) { return openOnline(); } if (banned()) return bannedScreen(); if (!profile) return setupProfile(); challenge(uid); },
    openBoard: async () => { show('online'); try { await init(); } catch (e) { return openOnline(); } if (!profile) return setupProfile(); board(); },
    editProfile: async (back) => { afterProf = back || null; window.onlineReturn = back || null; show('online'); setHead('✏️ اسمي وصورتي');
      body().innerHTML = `<div class="handoff"><div class="big spin">🌐</div><p>جارٍ الاتصال…</p></div>`;
      try { await init(); } catch (e) { afterProf = null; return openOnline(); } setupProfile(); },
    refreshLeader: () => { if (db && profile) refreshLeader(); },
    claimNick: n => claimNick(n), releaseNick: n => releaseNick(n),
    friendReq: uid => friendReq(uid),
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
