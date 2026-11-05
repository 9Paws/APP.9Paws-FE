import os
import sys

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    template_path = ".github/email-templates/release-email.html"
    output_path = "release-email-ready.html"

    if not os.path.exists(template_path):
        print(f"Error: Template file {template_path} not found.")
        sys.exit(1)

    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_version = os.environ.get("NEW_VERSION", "")
    changelog = os.environ.get("CHANGELOG", "")
    download_url = os.environ.get("DOWNLOAD_URL", "")

    html = html.replace("{{NEW_VERSION}}", new_version)
    html = html.replace("{{CHANGELOG}}", changelog)
    html = html.replace("{{DOWNLOAD_URL}}", download_url)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("Success: Generated release-email-ready.html successfully from release-email.html.")

if __name__ == "__main__":
    main()
