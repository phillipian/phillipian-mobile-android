package com.phillipian.mobile;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

public class PhillipianMobile extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html", 2000);
    }
}

