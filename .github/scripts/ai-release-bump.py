import os
import json
import subprocess
import urllib.request
import re

print("🤖 Đang khởi động AI Release Manager (Gemini)...")

# 1. Lấy danh sách commit gần nhất từ Git
try:
    git_log = subprocess.check_output(
        ["git", "log", "-n", "15", "--oneline"], 
        encoding="utf-8"
    ).strip()
except Exception as e:
    git_log = "Initial release updates"

print("📝 Danh sách commit gần nhất:\n", git_log)

# 2. Gọi Google Gemini API để phân tích commit & viết Changelog
gemini_key = os.environ.get("GEMINI_API_KEY", "")
bump_type = "patch"
changelog = "- Bản cập nhật và tối ưu hóa hệ thống."

if gemini_key:
    prompt = f"""
    Bạn là Senior Release Manager. Dựa vào danh sách git commit sau đây:
    {git_log}
    
    Hãy thực hiện 2 việc:
    1) Quyết định loại bump version: 'minor' (nếu có tính năng mới quan trọng 'feat') hoặc 'patch' (nếu chỉ sửa lỗi 'fix' hoặc cải tiến nhỏ).
    2) Viết một bản tóm tắt Changelog (Ghi chú phát hành) bằng tiếng Việt thật trang trọng, ngắn gọn (3-5 gạch đầu dòng) để gửi cho Khách hàng.
    
    Chỉ trả về định dạng JSON thuần túy (không thêm markdown backtick ```json):
    {{"bump": "patch", "changelog": "- Tính năng mới\\n- Sửa lỗi"}}
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
    headers = {"Content-Type": "application/json"}
    payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")

    try:
        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Làm sạch chuỗi JSON nếu có dính backtick
            clean_json = re.sub(r"^```(json)?|```$", "", raw_text, flags=re.MULTILINE).strip()
            ai_data = json.loads(clean_json)
            bump_type = ai_data.get("bump", "patch")
            changelog = ai_data.get("changelog", changelog)
            print(f"✨ Gemini đề xuất loại bump: {bump_type}")
    except Exception as err:
        print(f"⚠️ Có lỗi khi gọi Gemini API ({err}), sử dụng fallback mặc định.")

# 3. Đọc và cập nhật file app.json
app_json_path = "app.json"
with open(app_json_path, "r", encoding="utf-8") as f:
    app_data = json.load(f)

expo_config = app_data.get("expo", {})
current_version = expo_config.get("version", "1.0.0")

# Tách version: major.minor.patch
try:
    parts = [int(p) for p in current_version.split(".")]
    if len(parts) == 3:
        major, minor, patch = parts
    else:
        major, minor, patch = 1, 0, 0
except:
    major, minor, patch = 1, 0, 0

if bump_type == "minor":
    minor += 1
    patch = 0
else:
    patch += 1

new_version = f"{major}.{minor}.{patch}"
expo_config["version"] = new_version

# Tăng versionCode cho Android (Bắt buộc để cho phép cài đè)
android_config = expo_config.get("android", {})
current_code = android_config.get("versionCode", 1)
android_config["versionCode"] = current_code + 1
expo_config["android"] = android_config

app_data["expo"] = expo_config

# Ghi lại file app.json
with open(app_json_path, "w", encoding="utf-8") as f:
    json.dump(app_data, f, indent=2)

pkg_json_path = "package.json"
if os.path.exists(pkg_json_path):
    try:
        with open(pkg_json_path, "r", encoding="utf-8") as f:
            pkg_data = json.load(f)
        pkg_data["version"] = new_version
        with open(pkg_json_path, "w", encoding="utf-8") as f:
            json.dump(pkg_data, f, indent=2)
        print(f"📦 Đã đồng bộ package.json: Version -> {new_version}")
    except Exception as e:
        print(f"⚠️ Không thể cập nhật package.json: {e}")

print(f"🎉 Đã cập nhật app.json & package.json: Version {current_version} -> {new_version} | versionCode: {android_config['versionCode']}")

# 4. Xuất kết quả ra file để GitHub Actions sử dụng ở các bước sau
github_output = os.environ.get("GITHUB_OUTPUT", "")
if github_output:
    with open(github_output, "a", encoding="utf-8") as gh:
        gh.write(f"new_version={new_version}\n")
        gh.write(f"changelog<<EOF\n{changelog}\nEOF\n")