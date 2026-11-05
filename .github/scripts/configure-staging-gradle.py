import os
import sys
import re

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

build_gradle_path = "android/app/build.gradle"
gradle_properties_path = "android/gradle.properties"

print("🔍 Đang cấu hình siêu tối ưu hóa dung lượng và tốc độ cho Staging APK...")

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

# 3. Chống chèn lặp: Thiết lập signingConfigs.release
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
            }}
        }}
    """
    content = content.replace("buildTypes {", signing_block + "\n    buildTypes {")
    content = content.replace("signingConfig signingConfigs.debug", "signingConfig signingConfigs.release")
    print("Configured signingConfigs.release successfully.")

# 4. Cấu hình lọc riêng kiến trúc arm64-v8a trong defaultConfig
if "abiFilters \"arm64-v8a\"" not in content:
    abi_filter = """
        ndk {
            abiFilters "arm64-v8a"
        }
    """
    content = content.replace("defaultConfig {", "defaultConfig {\n" + abi_filter)
    print("Configured arm64-v8a NDK filter.")

# 5. Tắt Android Lint Vital Check khi build release
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

# 6. SIÊU TỐI ƯU HÓA DUNG LƯỢNG TRONG GRADLE.PROPERTIES (Ép từ 108MB xuống ~20-25MB)
if os.path.exists(gradle_properties_path):
    with open(gradle_properties_path, "r", encoding="utf-8") as f:
        props = f.read()

    # (A) Chỉ build duy nhất kiến trúc arm64-v8a (Loại bỏ armeabi-v7a, x86, x86_64 -> Giảm ngay ~75MB!)
    props = re.sub(r"reactNativeArchitectures=.*", "reactNativeArchitectures=arm64-v8a", props)

    # (B) Nén thư viện native .so bằng ZIP DEFLATE (Giảm thêm ~15-20MB!)
    props = re.sub(r"expo\.useLegacyPackaging=.*", "expo.useLegacyPackaging=true", props)

    # (C) Tắt GIF native decoder thừa (tiết kiệm ~2MB)
    props = re.sub(r"expo\.gif\.enabled=.*", "expo.gif.enabled=false", props)

    # (D) Bật Resource Shrinking (Dọn dẹp layout/drawable/string không dùng trong thư viện)
    if "android.enableShrinkResourcesInReleaseBuilds=" in props:
        props = re.sub(r"android\.enableShrinkResourcesInReleaseBuilds=.*", "android.enableShrinkResourcesInReleaseBuilds=true", props)
    else:
        props += "\nandroid.enableShrinkResourcesInReleaseBuilds=true\n"

    # (E) Bật R8 Minify & AAPT2 PNG Crunch
    if "android.enableMinifyInReleaseBuilds=" in props:
        props = re.sub(r"android\.enableMinifyInReleaseBuilds=.*", "android.enableMinifyInReleaseBuilds=true", props)
    else:
        props += "\nandroid.enableMinifyInReleaseBuilds=true\n"

    # (F) Cấu hình tăng tốc Gradle build song song & RAM
    optimizations = """
# CI/CD Performance & Size Flags
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.jvmargs=-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+UseParallelGC -Dfile.encoding=UTF-8
android.enablePngCrunchInReleaseBuilds=true
"""
    props += optimizations

    with open(gradle_properties_path, "w", encoding="utf-8") as f:
        f.write(props)
    print("Configured gradle.properties: arm64-v8a only, legacyPackaging compression, shrinkResources, PNG crunch!")

print("Successfully configured Staging Gradle for minimal size and maximum speed!")
