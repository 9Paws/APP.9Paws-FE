import os
import sys
import json
import urllib.request
import re
import subprocess
import argparse

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

FALLBACK_NOTES_V101 = """### 🐾 9Paws Mobile App — Bản Phát Hành v1.0.1

#### 🌟 Tổng Quan Phiên Bản
Phiên bản **v1.0.1** tập trung hoàn thiện trải nghiệm giao diện người dùng (UI/UX) và tối ưu hóa vượt bậc dung lượng gói cài đặt Android (APK) cho ứng dụng 9Paws.

#### 🚀 Điểm Mới & Cải Tiến Nổi Bật
- 🎨 **Hoàn thiện Mascot Miu Miu & Avatar**: Sửa triệt để lỗi viền trắng vuông góc quanh avatar linh vật Miu Miu trên tất cả các màn hình (Đăng nhập, Hồ sơ cá nhân, Giới thiệu và Mẹo chi tiêu). Tích hợp ảnh PNG 720x720 độ nét cao với nền trong suốt 100%.
- ⚡ **Tối ưu luồng khởi động (Splash Screen)**: Loại bỏ màn hình splash tĩnh màu trắng dư thừa ở giữa màn hình; chuyển tiếp mượt mà ngay vào hiệu ứng mở ứng dụng động.
- 📦 **Tối ưu hóa dung lượng APK siêu nhẹ (Giảm >50%)**:
  - Dung lượng tệp APK giảm mạnh từ **~57MB xuống chỉ còn ~24.9MB**.
  - Tối ưu đóng gói thư viện C++ qua cơ chế nén `useLegacyPackaging = true`.
  - Kích hoạt nén Hermes Bytecode và loại trừ các tệp metadata dư thừa trong APK.

#### 📲 Hướng Dẫn Tải & Cài Đặt
1. Tải tệp **`9Paws-v1.0.1.apk`** trực tiếp trong mục **Assets** bên dưới.
2. Mở tệp `.apk` trên thiết bị Android và cho phép *Cài đặt ứng dụng từ nguồn không xác định* nếu được hỏi.
"""

FALLBACK_NOTES_V100 = """### 🐾 9Paws Mobile App — Bản Phát Hành v1.0.0

#### 🌟 Tổng Quan Phiên Bản
Phiên bản phát hành chính thức đầu tiên **v1.0.0** của ứng dụng **9Paws — Quản lý tài chính cá nhân & Chia hóa đơn thông minh**, đánh dấu sự ra mắt trọn vẹn của hệ thống tính năng cốt lõi.

#### 🚀 Các Tính Năng Nổi Bật
- 🔐 **Xác thực An Toàn & Đa Phương Thức**: Hỗ trợ đăng nhập nhanh bằng Google Sign-In, tài khoản Email/Password và mã xác minh OTP qua email.
- 👤 **Quản lý Hồ Sơ & Bảo Mật**: Cập nhật thông tin cá nhân, thay đổi ảnh đại diện linh vật Miu Miu, đổi mật khẩu và liên kết tài khoản Google an toàn.
- 🔒 **Khóa Ứng Dụng Bằng Sinh Trắc Học**: Tích hợp cảm biến vân tay (Fingerprint) và nhận diện khuôn mặt (Face ID) để bảo vệ dữ liệu tài chính nhạy cảm khi mở ứng dụng.
- 🔔 **Nhắc Nhở Chi Tiêu & Đơn Vị Tiền Tệ**: Cài đặt nhắc nhở ghi chép chi tiêu định kỳ lúc 21:00 hàng ngày, hỗ trợ đa loại tiền tệ (VND, USD).
- 🌐 **Đa Ngôn Ngữ Toàn Diện**: Hỗ trợ đầy đủ giao diện Tiếng Việt và Tiếng Anh với khả năng tự động nhận diện ngôn ngữ thiết bị.

#### 📲 Hướng Dẫn Tải & Cài Đặt
1. Tải tệp **`9Paws-v1.0.0.apk`** trực tiếp trong mục **Assets** bên dưới.
2. Mở tệp `.apk` trên thiết bị Android và tiến hành cài đặt để trải nghiệm.
"""

def call_gemini_ai(gemini_key, version, commits_text):
    prompt = f"""
    Bạn là Technical Writer kiêm Senior Release Manager cho ứng dụng di động 9Paws (ứng dụng quản lý chi tiêu cá nhân và chia tiền nhóm phong cách ấm cúng).
    Hãy viết một bản Release Description (Ghi chú phát hành) thật chuyên nghiệp, dễ hiểu, tràn đầy năng lượng bằng tiếng Việt cho phiên bản {version}.

    Danh sách các commit / thay đổi trong bản này:
    {commits_text}

    Cấu trúc bản Release Description yêu cầu (viết chuẩn Markdown GitHub):
    ### 🐾 9Paws Mobile App — Bản Phát Hành {version}

    #### 🌟 Tổng Quan Phiên Bản
    (Đoạn văn ngắn 2-3 câu giới thiệu ý nghĩa và trọng tâm của bản cập nhật này)

    #### 🚀 Điểm Mới & Cải Tiến Nổi Bật
    (Gạch đầu dòng các tính năng mới hoặc nâng cấp giao diện, kèm icon sinh động)

    #### ⚡ Tối Ưu Hóa & Sửa Lỗi
    (Gạch đầu dòng các lỗi đã sửa, tối ưu dung lượng, hiệu năng hoặc bảo mật)

    #### 📲 Hướng Dẫn Tải & Cài Đặt
    (Hướng dẫn người dùng tải tệp APK trong phần Assets bên dưới và cài đặt trên Android)

    Lưu ý: Chỉ trả về nội dung Markdown thuần túy, không bọc trong ```markdown hoặc bất kỳ thẻ nào khác.
    """

    urls = [
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}",
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
    ]

    payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
    headers = {"Content-Type": "application/json"}

    for url in urls:
        try:
            req = urllib.request.Request(url, data=payload, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Xóa bọc ```markdown nếu có
                clean_text = re.sub(r"^```(markdown)?\s*", "", text, flags=re.IGNORECASE)
                clean_text = re.sub(r"\s*```$", "", clean_text)
                return clean_text.strip()
        except Exception as e:
            print(f"⚠️ Thử endpoint thất bại ({e}), chuyển fallback tiếp theo...")

    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="v1.0.1", help="Version tag (e.g. v1.0.1 or v1.0.0)")
    parser.add_argument("--output", default="release_notes.md", help="Output file path")
    args = parser.parse_args()

    version = args.version
    if not version.startswith("v"):
        version = f"v{version}"

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()

    # Thu thập commit log
    try:
        if version == "v1.0.0":
            commits = subprocess.check_output(
                ["git", "log", "-n", "20", "--oneline", "dd78740"],
                encoding="utf-8"
            ).strip()
        else:
            commits = subprocess.check_output(
                ["git", "log", "-n", "15", "--oneline"],
                encoding="utf-8"
            ).strip()
    except Exception as e:
        commits = f"Bản cập nhật tính năng và cải tiến {version}"

    content = None
    if gemini_key:
        print(f"🤖 Đang gọi Gemini AI để tạo mô tả chi tiết cho release {version}...")
        content = call_gemini_ai(gemini_key, version, commits)
        if content:
            print("✨ Gemini AI đã tạo thành công Release Description!")

    if not content:
        print(f"📋 Sử dụng nội dung mô tả chuẩn bị sẵn cho {version}...")
        if version == "v1.0.0":
            content = FALLBACK_NOTES_V100
        else:
            content = FALLBACK_NOTES_V101

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

    print(f"✅ Đã ghi thành công ghi chú phát hành ra file: {args.output}")

if __name__ == "__main__":
    main()
