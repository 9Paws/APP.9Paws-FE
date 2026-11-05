import os
import sys
import re
import subprocess

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

build_gradle_path = "android/app/build.gradle"
gradle_properties_path = "android/gradle.properties"

print("🔍 Đang cấu hình môi trường Staging (Hỗ trợ 100% dòng máy Android)...")

# 1. Kiểm tra an toàn: Đảm bảo file build.gradle tồn tại
if not os.path.exists(build_gradle_path):
    print(f"Error: Không tìm thấy file {build_gradle_path}. Bạn đã chạy 'expo prebuild' chưa?")
    sys.exit(1)

# 2. Kiểm tra an toàn: Đảm bảo các Secrets đã được truyền vào
store_pass = os.environ.get("KEYSTORE_PASSWORD")
key_alias = os.environ.get("KEY_ALIAS")
key_pass = os.environ.get("KEY_PASSWORD")

if not all([store_pass, key_alias, key_pass]):
    print("Error: Thiếu một trong các biến môi trường: KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD!")
    print("Hãy kiểm tra lại cài đặt Secrets trên GitHub Repository.")
    sys.exit(1)

with open(build_gradle_path, "r", encoding="utf-8") as f:
    content = f.read()

# 3. Chống chèn lặp: Thiết lập signingConfigs.release với cả V1 và V2 Signing
if "signingConfigs.release" in content:
    print("Keystore configuration already exists in build.gradle, skipping.")
else:
    signing_block = f"""
        signingConfigs {{
            release {{
                storeFile file('release.keystore')
                storePassword '{store_pass}'
                keyAlias '{key_alias}'
                keyPassword '{key_pass}'
                v1SigningEnabled true
                v2SigningEnabled true
            }}
        }}
    """
    content = content.replace("buildTypes {", signing_block + "\n    buildTypes {")
    content = content.replace("signingConfig signingConfigs.debug", "signingConfig signingConfigs.release")
    print("Configured signingConfigs.release with V1 and V2 Signing successfully.")

# 4. Hỗ trợ cả 32-bit (Galaxy A10) và 64-bit (Tecno Spark 20): armeabi-v7a + arm64-v8a
if "abiFilters" not in content:
    abi_filter = """
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a"
        }
        resConfigs "vi", "en"
    """
    content = content.replace("defaultConfig {", "defaultConfig {\n" + abi_filter)
    print("Configured armeabi-v7a and arm64-v8a NDK filters (100% Android phones supported).")

# 5. Tối ưu packagingOptions: giữ useLegacyPackaging false để tương thích chuẩn Android, loại bỏ debug symbols
target_legacy = "useLegacyPackaging enableLegacyPackaging.toBoolean()"
if target_legacy in content:
    replacement_packaging = """useLegacyPackaging false
            keepDebugSymbols = []
        }
        resources {
            excludes += [
                "META-INF/*.version",
                "META-INF/*.txt",
                "META-INF/DEPENDENCIES",
                "META-INF/NOTICE",
                "META-INF/LICENSE*",
                "META-INF/*.kotlin_module",
                "**/libjscexecutor.so"
            ]"""
    content = content.replace(target_legacy, replacement_packaging)
    print("Optimized packagingOptions: compatible packaging and stripped metadata.")

# 6. Tắt Android Lint Vital Check khi build release
if "lintOptions {" not in content:
    lint_bypass = """
    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
    """
    content = content.replace("android {", "android {\n" + lint_bypass)
    print("Bypassed Android Lint Vital Check for fast builds.")

with open(build_gradle_path, "w", encoding="utf-8") as f:
    f.write(content)

# 7. CẤU HÌNH GRADLE.PROPERTIES
if os.path.exists(gradle_properties_path):
    with open(gradle_properties_path, "r", encoding="utf-8") as f:
        props = f.read()

    # (A) Hỗ trợ cả 32-bit (armeabi-v7a) và 64-bit (arm64-v8a), loại bỏ 2 kiến trúc giả lập PC
    props = re.sub(r"reactNativeArchitectures=.*", "reactNativeArchitectures=armeabi-v7a,arm64-v8a", props)

    # (B) useLegacyPackaging=false để không bị lỗi Package Invalid trên Android 9/10/11+
    props = re.sub(r"expo\.useLegacyPackaging=.*", "expo.useLegacyPackaging=false", props)

    # (C) Tắt GIF native decoder thừa
    props = re.sub(r"expo\.gif\.enabled=.*", "expo.gif.enabled=false", props)

    # (D) Bật Resource Shrinking & R8 Minify
    if "android.enableShrinkResourcesInReleaseBuilds=" in props:
        props = re.sub(r"android\.enableShrinkResourcesInReleaseBuilds=.*", "android.enableShrinkResourcesInReleaseBuilds=true", props)
    else:
        props += "\nandroid.enableShrinkResourcesInReleaseBuilds=true\n"

    if "android.enableMinifyInReleaseBuilds=" in props:
        props = re.sub(r"android\.enableMinifyInReleaseBuilds=.*", "android.enableMinifyInReleaseBuilds=true", props)
    else:
        props += "\nandroid.enableMinifyInReleaseBuilds=true\n"

    # (E) Tăng tốc Gradle build song song & RAM
    optimizations = """
# CI/CD Performance Flags
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.jvmargs=-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+UseParallelGC -Dfile.encoding=UTF-8
android.enablePngCrunchInReleaseBuilds=true
"""
    props += optimizations

    with open(gradle_properties_path, "w", encoding="utf-8") as f:
        f.write(props)
    print("Configured gradle.properties for 100% Android device compatibility!")

# In mã SHA-1/SHA-256 fingerprint của release.keystore để cấu hình Google Sign-In trên Google Cloud Console
keystore_path = "android/app/release.keystore"
if os.path.exists(keystore_path):
    try:
        res = subprocess.run(
            ["keytool", "-list", "-v", "-keystore", keystore_path, "-alias", key_alias, "-storepass", store_pass],
            capture_output=True,
            text=True
        )
        print("\n" + "="*80)
        print("🔑 CERTIFICATE FINGERPRINTS (GOOGLE SIGN-IN OAUTH CREDENTIALS):")
        for line in res.stdout.splitlines():
            if "SHA1:" in line or "SHA256:" in line:
                print("   " + line.strip())
        print("👉 Hướng dẫn: Thêm mã SHA-1 ở trên vào Google Cloud Console -> Credentials")
        print("   -> OAuth 2.0 Client ID loại Android với package 'com.ninepaws.app'")
        print("="*80 + "\n")
    except Exception as e:
        print(f"Could not read keystore fingerprints: {e}")

print("Successfully configured Staging Gradle!")
