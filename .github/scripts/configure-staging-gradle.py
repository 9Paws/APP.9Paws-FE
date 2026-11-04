import os
import sys

build_gradle_path = "android/app/build.gradle"
gradle_properties_path = "android/gradle.properties"

print("🔍 Đang kiểm tra cấu hình môi trường Staging...")

# 1. Kiểm tra an toàn: Đảm bảo file build.gradle tồn tại
if not os.path.exists(build_gradle_path):
    print(f"❌ Lỗi: Không tìm thấy file {build_gradle_path}. Bạn đã chạy 'expo prebuild' chưa?")
    sys.exit(1)

# 2. Kiểm tra an toàn: Đảm bảo các Secrets đã được truyền vào
store_pass = os.environ.get("KEYSTORE_PASSWORD")
key_alias = os.environ.get("KEY_ALIAS")
key_pass = os.environ.get("KEY_PASSWORD")

if not all([store_pass, key_alias, key_pass]):
    print("❌ Lỗi: Thiếu một trong các biến môi trường: KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD!")
    print("👉 Hãy kiểm tra lại cài đặt Secrets trên GitHub Repository.")
    sys.exit(1)

with open(build_gradle_path, "r", encoding="utf-8") as f:
    content = f.read()

# 3. Chống chèn lặp: Thiết lập signingConfigs.release
if "signingConfigs.release" in content:
    print("ℹ️ Cấu hình Keystore đã tồn tại trong build.gradle, bỏ qua bước chèn.")
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
    print("✅ Đã thiết lập khối signingConfigs.release.")

# 4. Cấu hình lọc riêng kiến trúc arm64-v8a (Tăng tốc biên dịch 50% C++ NDK)
if "abiFilters \"arm64-v8a\"" not in content:
    abi_filter = """
        ndk {
            abiFilters "arm64-v8a"
        }
    """
    content = content.replace("defaultConfig {", "defaultConfig {\n" + abi_filter)
    print("✅ Đã kích hoạt bộ lọc kiến trúc arm64-v8a.")

# 5. TỐI ƯU TỐC ĐỘ: TẮT HOÀN TOÀN ProGuard/R8 CHO STAGING
# ProGuard làm rối code và phân tích toàn bộ cây class, ngốn 15-20 phút vô ích ở bản test
content = content.replace("def enableProguardInReleaseBuilds = true", "def enableProguardInReleaseBuilds = false")
print("✅ Đã đảm bảo ProGuard/R8 được tắt (tiết kiệm ~15 phút biên dịch).")

# 6. TẮT ANDROID LINT VITAL CHECK KHI BUILD RELEASE
if "lintOptions {" not in content:
    lint_bypass = """
    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
    """
    content = content.replace("android {", "android {\n" + lint_bypass)
    print("✅ Đã tắt Android Lint Vital Check để tăng tốc build.")

with open(build_gradle_path, "w", encoding="utf-8") as f:
    f.write(content)

# 7. TỐI ƯU GRADLE.PROPERTIES: PARALLEL + 4.5GB RAM + BUILD CACHING
if os.path.exists(gradle_properties_path):
    with open(gradle_properties_path, "r", encoding="utf-8") as f:
        props = f.read()

    optimizations = """
# CI/CD Extreme Speed Flags
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.jvmargs=-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+UseParallelGC -Dfile.encoding=UTF-8
"""
    with open(gradle_properties_path, "a", encoding="utf-8") as f:
        f.write(optimizations)
    print("✅ Đã cấu hình bộ cờ tăng tốc song song và 4.5GB RAM trong gradle.properties.")

print("🎉 Hoàn tất siêu tối ưu hóa Gradle cho bản Staging!")
