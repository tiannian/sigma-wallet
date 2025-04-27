#! /bin/bash

pnpm tauri android build --apk || exit 1

rm -f app-* || exit 1

~/.android/build-tools/34.0.0/zipalign -v \
    -p 4 \
    src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk \
    app-aligned.apk || exit 1

~/.android/build-tools/34.0.0/apksigner sign \
    --ks ~/.android/debug.keystore \
    --ks-key-alias androiddebugkey \
    --ks-pass pass:android \
    --key-pass pass:android \
    --out app-debug-signed.apk app-aligned.apk || exit 1
 
adb install -r app-debug-signed.apk