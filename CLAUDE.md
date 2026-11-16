# أصول ديني الخمسة — تطبيق الأطفال

App name (chosen by the owner, v2.8): «جنّتي الصغيرة». Children's app for the book «أصول ديني الخمسة» by الشيخ علاء المطوري (Iraq). Talk to the owner in Iraqi Arabic, simply and step by step (he is not a programmer; give exact taps/clicks, ask for screenshots when stuck). Never guess Quranic text: verses must stay exactly as in the book.

## Where it lives
- Live app (PWA, the link families use): https://alaa1981q-droid.github.io/usool-deeni/ — GitHub Pages from `main`, root.
- Android APK: built by `.github/workflows/android.yml` on every push, published to Release `latest` → `releases/download/latest/usool-deeni.apk`. Families prefer the link (APK triggers Play Protect warnings).
- A copy is also published as a claude.ai artifact: https://claude.ai/artifact/X5qPTuubxS7Ra7EKSgoshM (no online play there; publish `index.html` + `questions.js`).
- The owner's library artifact (2WtgvcP2YdbxcaAaKZ3oxw) and green site (GkFzJJze2b2T3GckuzUFHW) link to the live app.

## Files
- `index.html` — whole app: lessons (`STAGES`), stage exams, titles/grades/celebration, solo/duo contest, picture-book reader (`p/01..38.webp` = book pages). Bump `APP_VER` on every change and tell the owner the new number (shown at the bottom of the home screen).
- `questions.js` — `QBANK` question bank (types: mcq, tf, verse, order, match), written from the book only and approved by the owner. Exams/contest pick fresh-first via `pickFresh`.
- `online.js` — online play on Firebase Realtime Database (project `usool-deeni`, europe-west1, anonymous auth): friend codes, live 1v1 rooms, quick 4-digit rooms, weekly leaderboard. No chat, no real names (nicknames built from fixed word lists).
- `database.rules.json` — security rules; if changed, the owner must paste them in Firebase console → Realtime Database → Rules → Publish.
- `hifz.js` — «أنا حافظ صغير»: الحمد + short surahs with per-ayah audio in `audio/SSSAAA.mp3` (Abdul Basit Murattal 64kbps, everyayah.com; host allowed in the `usool-deeni` environment). Text: الحمد/التوحيد from the book, others Tanzil simple 1.0.2 unchanged (credit tanzil.net). To add a surah: append to `SUR`, download its files, list them in `sw.js`.
- `jannah.js` — house decorations shop (💎 jewels from floors, cups, contest/online/nafsak, daily chest, likes), friends' houses, gifts, likes, visitors (Firebase paths houses/gifts/hlikes/hvisit). `bayt.js` exposes `window.Bayt`; `houseSVG(...,look)` draws any house and makes SVG ids unique per drawing.
- `baytrace.js` — live house-building race with a friend (rooms with type:'bayt', invites with kind:'bayt', winner via transaction "uid|why", fixed emoji cheers only). Nicknames: word lists or typed by the child (Arabic letters only, 3–16, small bad-word list in online.js `badNick`).
- `wird.js` — daily wird (5 questions, streak) and mistake review (state.miss, spaced 0/1/3 days); hooks `onAnswer` in exam/contest and `qz.mode` in finishQuiz.
- House: 4 floors (4th = the five «آية أحفظها» verses from the book, harder), house scales to 0.8 at 4 floors (`Bayt.hk`); rooms inside per floor with furniture (jannah.js `roomSVG`).
- `sawt.js` — voice: `Voice.reciteBox` (child reads aloud; Web Speech API ar-SA compares words green/red; where unsupported — e.g. the APK WebView or offline — it only detects voice and says so honestly), `Voice.counter` (offline voice-activity counter for salawat/tasbih ×10). Also `Aamal`: shared store of good deeds (`usul5_aamal_v1`: sal, tas, tilawa, prayN/pray log, fiqh, akhlaq).
- `salah.js` — «وضوئي وصلاتي»: wudu + prayer taught ONE way only (the owner's way, Shia/Ja'fari) and the UI must NOT name a sect (owner's instruction). Learn steps / order drill / say-it-by-voice / 8-question tests / daily prayer log. Fatiha & Tawhid come from `STAGES`. Content is not from the book → owner reviews it.
- `alqab.js` — profile «ملفّي»: XP → levels, 11 medals (🥉🥈🥇💎), 10 titles, level-up celebration; home panel (my card, friends + add friend, weekly heroes from `leader/{week}` sorted by weekly `xp`); voice salawat/tasbih screens; house: 3D tilt + «ابنِ بيتك بالأعمال الصالحة» box; grants deed items (jannah.js `cat:'deeds'`, via `Deco.grant`). Publishes `lv, tt, md` to `profiles/$uid` and `xp` to `leader/$week/$uid` (no rule change needed).
- Android: MainActivity grants RECORD_AUDIO to the WebView (mic only, everything else denied).
- `bayt.js`, `nafsak.js` — house game/cups and «اختبر نفسك». New .js files must also be added to the `cp` line in `.github/workflows/android.yml`.
- `sw.js` — offline cache; must never intercept Firebase/other-origin requests. Bump `CACHE` when caching logic changes.
- `vendor/` — Firebase compat SDK 10.14.1. `android/` — WebView wrapper.

## Working rules
- Commit and push to `main` directly; Pages and the APK rebuild automatically.
- Test in Playwright before pushing (a Firebase mock is needed; this sandbox cannot reach Firebase).
