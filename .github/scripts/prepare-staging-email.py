import os
import sys

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    template_path = ".github/email-templates/staging-email.html"
    output_path = "email-ready.html"

    if not os.path.exists(template_path):
        print(f"Error: Template file {template_path} not found.")
        sys.exit(1)

    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Đọc trực tiếp từ environment variables (an toàn tuyệt đối trước mọi ký tự đặc biệt, backslash, ngoặc kép)
    pr_title = os.environ.get("PR_TITLE", "Bản cập nhật Staging mới")
    pr_body = os.environ.get("PR_BODY", "Không có mô tả chi tiết.")
    download_url = os.environ.get("DOWNLOAD_URL", "")
    repo = os.environ.get("REPOSITORY", "9Paws/APP.9Paws-FE")
    run_id = os.environ.get("RUN_ID", "")
    run_number = os.environ.get("RUN_NUMBER", "1")

    # Thay thế các placeholder trong email HTML
    html = html.replace("{{PR_TITLE}}", pr_title)
    html = html.replace("{{PR_BODY}}", pr_body)
    html = html.replace("{{REPOSITORY}}", repo)
    html = html.replace("{{RUN_ID}}", run_id)
    html = html.replace("{{RUN_NUMBER}}", run_number)
    html = html.replace("{{DOWNLOAD_URL}}", download_url)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("Success: Generated email-ready.html successfully from staging-email.html.")

if __name__ == "__main__":
    main()
