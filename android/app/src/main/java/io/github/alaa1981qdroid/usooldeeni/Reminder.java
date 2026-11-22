package io.github.alaa1981qdroid.usooldeeni;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import java.util.Calendar;

/** 🔔 تذكير يومي لطيف للطفل (يختار الأهل الساعة من «للأهل»). يُعاد ضبطه بعد إعادة تشغيل الجهاز. */
public class Reminder extends BroadcastReceiver {
    static final String PREF = "jannah_remind", CH = "daily";

    static int flags() {
        return Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE : PendingIntent.FLAG_UPDATE_CURRENT;
    }

    static PendingIntent pi(Context c) {
        Intent i = new Intent(c, Reminder.class);
        i.setAction("io.github.alaa1981qdroid.usooldeeni.REMIND");
        return PendingIntent.getBroadcast(c, 11, i, flags());
    }

    static void schedule(Context c, int h, int m, String msgs) {
        SharedPreferences p = c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
        p.edit().putInt("h", h).putInt("m", m).putString("msgs", msgs == null ? "" : msgs).apply();
        arm(c);
    }

    static void arm(Context c) {
        SharedPreferences p = c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
        if (!p.contains("h")) return;
        Calendar t = Calendar.getInstance();
        t.set(Calendar.HOUR_OF_DAY, p.getInt("h", 17));
        t.set(Calendar.MINUTE, p.getInt("m", 0));
        t.set(Calendar.SECOND, 0);
        if (t.getTimeInMillis() <= System.currentTimeMillis() + 60000) t.add(Calendar.DAY_OF_YEAR, 1);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(pi(c));
        am.setInexactRepeating(AlarmManager.RTC_WAKEUP, t.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pi(c));
    }

    static void cancel(Context c) {
        c.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit().clear().apply();
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(pi(c));
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        String a = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(a) || "android.intent.action.MY_PACKAGE_REPLACED".equals(a)) { arm(c); return; }
        SharedPreferences p = c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
        if (!p.contains("h")) return;
        String[] ms = p.getString("msgs", "").split("\\|");
        String msg = ms.length > 0 && ms[0].length() > 0 ? ms[Calendar.getInstance().get(Calendar.DAY_OF_YEAR) % ms.length] : "🌙 جنّتي الصغيرة تنتظرك";
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        Notification.Builder b;
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(new NotificationChannel(CH, "تذكير يومي", NotificationManager.IMPORTANCE_DEFAULT));
            b = new Notification.Builder(c, CH);
        } else {
            b = new Notification.Builder(c);
        }
        Intent open = new Intent(c, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        b.setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("جنّتي الصغيرة 🌙")
                .setContentText(msg)
                .setAutoCancel(true)
                .setContentIntent(PendingIntent.getActivity(c, 12, open, flags()));
        try { nm.notify(21, b.build()); } catch (Exception ignored) { }
    }
}
