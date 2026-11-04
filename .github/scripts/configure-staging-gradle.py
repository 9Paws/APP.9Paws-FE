import os
import sys

build_gradle_path = "android/app/build.gradle"

print("🔍 Đang kiểm tra cấu hình môi trường...")

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

# 3. Chống chèn lặp: Nếu đã cấu hình rồi thì bỏ qua
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

# 4. Cấu hình lọc riêng kiến trúc arm64-v8a (để APK < 25MB)
if "abiFilters \"arm64-v8a\"" not in content:
    abi_filter = """
        ndk {
            abiFilters "arm64-v8a"
        }
    """
    content = content.replace("defaultConfig {", "defaultConfig {\n" + abi_filter)
    print("✅ Đã kích hoạt bộ lọc kiến trúc arm64-v8a.")

# 5. TỐI ƯU THÊM: Kích hoạt ProGuard/R8 để dọn dẹp code thừa
content = content.replace("def enableProguardInReleaseBuilds = false", "def enableProguardInReleaseBuilds = true")

with open(build_gradle_path, "w", encoding="utf-8") as f:
    f.write(content)

print("🎉 Hoàn tất tối ưu hóa build.gradle cho bản Staging!")