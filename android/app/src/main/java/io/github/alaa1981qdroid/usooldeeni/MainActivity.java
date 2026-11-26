package io.github.alaa1981qdroid.usooldeeni;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.provider.Settings;
import android.content.pm.PackageManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.content.Intent;
import android.content.SharedPreferences;
import android.webkit.WebResourceError;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/**
 * (v20.1) يفتح الموقع مباشرة حتى يصل كل تحديث لكل الأطفال فورًا (الموقع يعمل بلا إنترنت بعد أول فتح).
 * أول مرة: يفتح النسخة القديمة المحفوظة داخل التطبيق، ينقل بيانات الطفل (تقدّمه وحسابه) إلى الموقع، ثم يفتح الموقع.
 * إذا لم يوجد إنترنت قبل النقل يبقى على النسخة الداخلية كما كان.
 */
public class MainActivity extends Activity {
    private static final String START = "https://appassets.androidplatform.net/assets/www/index.html";
    private static final String SITE = "https://alaa1981q-droid.github.io/usool-deeni/";
    private static final String SITE_HOST = "alaa1981q-droid.github.io";
    private static final int MIC_REQ = 7;
    private SharedPreferences prefs;
    private boolean noMig = false;   // فشل النقل في هذه الجلسة (لا إنترنت) → نبقى على النسخة الداخلية
    private static final String COLLECT_JS =
        "(function(){if(window.__migC)return;window.__migC=1;var ls={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);ls[k]=localStorage.getItem(k)}}catch(e){}" +
        "function send(fb){try{JannahApp.migSave(JSON.stringify({ls:ls,fb:fb||[]}))}catch(e){}}" +
        "try{var r=indexedDB.open('firebaseLocalStorageDb');r.onsuccess=function(){var db=r.result;if(!db.objectStoreNames.contains('firebaseLocalStorage')){db.close();send([]);return}" +
        "var q=db.transaction('firebaseLocalStorage','readonly').objectStore('firebaseLocalStorage').getAll();q.onsuccess=function(){db.close();send(q.result)};q.onerror=function(){send([])}};" +
        "r.onerror=function(){send([])}}catch(e){send([])}})();";

    private boolean migrated() { return prefs.getBoolean("migDone", false); }
    private File migFile() { return new File(getFilesDir(), "mig.json"); }
    private boolean onSite(Uri u) { return u != null && SITE_HOST.equals(u.getHost()) && u.getPath() != null && u.getPath().startsWith("/usool-deeni"); }
    private void offline() {
        String h = "<html dir=rtl><body style='font-family:sans-serif;text-align:center;padding:40px 20px;background:#eef7f1;color:#0e5a3a'>" +
            "<div style='font-size:60px'>📶</div><h2>اتصل بالإنترنت مرة واحدة</h2><p>حتى يجهز التطبيق ويعمل بعدها بلا إنترنت</p>" +
            "<button style='font-size:20px;padding:12px 26px;border:0;border-radius:16px;background:#1f9d5c;color:#fff' onclick=\"location.href='" + SITE + "'\">🔄 حاول مرة ثانية</button></body></html>";
        web.loadDataWithBaseURL("about:blank", h, "text/html", "utf-8", null);
    }
    private void fallback() {
        if (migrated()) offline(); else { noMig = true; web.loadUrl(START); }
    }
    private WebView web;
    private PermissionRequest pendingMic;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (Build.VERSION.SDK_INT >= 21) {
            getWindow().setStatusBarColor(Color.parseColor("#0e5a3a"));
        }
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        prefs = getSharedPreferences("jannah", MODE_PRIVATE);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                return loader.shouldInterceptRequest(req.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                // النسخة الداخلية فُتحت ولم يتمّ النقل بعد → نجمع بيانات الطفل وننقلها للموقع
                if (url != null && url.startsWith(START) && !migrated() && !noMig) view.evaluateJavascript(COLLECT_JS, null);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame() && onSite(req.getUrl())) fallback();
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest req, WebResourceResponse res) {
                if (req.isForMainFrame() && onSite(req.getUrl()) && res.getStatusCode() >= 400 && !migrated()) fallback();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("appassets.androidplatform.net".equals(u.getHost()) || onSite(u)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }
        });
        // المايك: للقراءة بالصوت والصلاة على النبي. نطلب إذن الصوت فقط، ونرفض أي شيء آخر (الكاميرا مثلًا).
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest req) {
                runOnUiThread(() -> {
                    boolean audio = false;
                    for (String r : req.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) audio = true;
                    if (!audio) { req.deny(); return; }
                    if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                        if (pendingMic != null) { try { pendingMic.deny(); } catch (Exception ignored) { } }
                        pendingMic = req;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_REQ);
                    } else {
                        req.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    }
                });
            }
        });
        // 🔔 التذكير اليومي: يناديه «للأهل» من صفحة التطبيق (window.JannahApp)
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void remind(int h, int m, String msgs) {
                Reminder.schedule(getApplicationContext(), h, m, msgs);
                if (Build.VERSION.SDK_INT >= 33) runOnUiThread(() -> {
                    if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED)
                        requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 8);
                });
            }
            @JavascriptInterface
            public void cancelRemind() { Reminder.cancel(getApplicationContext()); }
            // (v20.1) نقل بيانات الطفل من النسخة الداخلية إلى الموقع (مرة واحدة)
            @JavascriptInterface
            public void migSave(String json) {
                try (FileOutputStream o = new FileOutputStream(migFile())) { o.write(json.getBytes(StandardCharsets.UTF_8)); } catch (Exception e) { return; }
                runOnUiThread(() -> web.loadUrl(SITE + "mig.html"));
            }
            @JavascriptInterface
            public String migGet() {
                File f = migFile();
                if (migrated() || !f.exists()) return null;
                try (FileInputStream in = new FileInputStream(f)) {
                    byte[] b = new byte[(int) f.length()]; int n = 0;
                    while (n < b.length) { int r = in.read(b, n, b.length - n); if (r < 0) break; n += r; }
                    return new String(b, 0, n, StandardCharsets.UTF_8);
                } catch (Exception e) { return null; }
            }
            @JavascriptInterface
            public void migDone() { prefs.edit().putBoolean("migDone", true).apply(); try { migFile().delete(); } catch (Exception ignored) { } }
        }, "JannahApp");
        // Android 15+ draws apps edge-to-edge: keep the page clear of the status/navigation bars and the keyboard.
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#0e5a3a"));
        root.addView(web, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        if (Build.VERSION.SDK_INT >= 30) {
            root.setOnApplyWindowInsetsListener((v, ins) -> {
                android.graphics.Insets b = ins.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime() | WindowInsets.Type.displayCutout());
                v.setPadding(b.left, b.top, b.right, b.bottom);
                return WindowInsets.CONSUMED;
            });
        } else if (Build.VERSION.SDK_INT >= 20) {
            root.setFitsSystemWindows(true);
        }
        setContentView(root);
        // Android 13+: back gesture (onBackPressed is not called on Android 16 when targeting it).
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                () -> { if (web.canGoBack()) web.goBack(); else finish(); });
        }
        if (state != null) web.restoreState(state); else web.loadUrl(migrated() ? SITE : START);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        super.onRequestPermissionsResult(code, perms, res);
        if (code != MIC_REQ || pendingMic == null) return;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) pendingMic.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        else {
            pendingMic.deny();
            // إذا رفض الإذن سابقًا بـ«عدم السؤال مجددًا» لا تظهر نافذة الإذن، فنوجّه للإعدادات.
            if (Build.VERSION.SDK_INT >= 23 && !shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO)) {
                try {
                    new AlertDialog.Builder(this)
                        .setTitle("المايك 🎤")
                        .setMessage("حتى يسمع التطبيق صوتك، اسمح له باستعمال الميكروفون من الإعدادات:\nالأذونات ← الميكروفون ← سماح")
                        .setPositiveButton("افتح الإعدادات", (d, w) -> {
                            try {
                                startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                        Uri.fromParts("package", getPackageName(), null)));
                            } catch (Exception ignored) { }
                        })
                        .setNegativeButton("لاحقًا", null)
                        .show();
                } catch (Exception ignored) { }
            }
        }
        pendingMic = null;
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
