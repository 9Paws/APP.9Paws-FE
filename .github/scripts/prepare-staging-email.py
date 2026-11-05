import os
import sys

# Đảm bảo mã hóa UTF-8 cho stdout trên mọi hệ điều hành
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def render_markdown_to_email_html(text):
    """
    Chuyển đổi Markdown từ PR Description / Changelog sang HTML chuẩn email.
    Tự động áp dụng inline style cho tables, headings, lists để hiển thị đẹp mắt trên Gmail, Outlook.
    """
    if not text or not text.strip():
        return "<p style=\"color: #718096; margin: 0; font-size: 14px;\">Không có mô tả chi tiết.</p>"

    html_content = ""
    try:
        import markdown
        html_content = markdown.markdown(text, extensions=["tables", "nl2br", "fenced_code"])
    except Exception as e:
        import html as html_lib
        escaped = html_lib.escape(text)
        return f"<div style=\"white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #4a5568;\">{escaped}</div>"

    # Áp dụng inline styles thân thiện với mọi ứng dụng Email (Gmail, Outlook, Apple Mail)
    html_content = html_content.replace("<table>", '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; color: #4a5568; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">')
    html_content = html_content.replace("<thead>", '<thead style="background-color: #f7fafc;">')
    html_content = html_content.replace("<th", '<th style="border: 1px solid #e2e8f0; padding: 10px 12px; font-weight: 700; color: #2d3748; background-color: #f7fafc; font-size: 13px;"')
    html_content = html_content.replace("<td", '<td style="border: 1px solid #e2e8f0; padding: 9px 12px; color: #4a5568; line-height: 1.5; font-size: 13px; vertical-align: top;"')
    html_content = html_content.replace("<h3>", '<h3 style="margin: 20px 0 10px 0; font-size: 15px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #edf2f7; padding-bottom: 6px;">')
    html_content = html_content.replace("<h4>", '<h4 style="margin: 16px 0 8px 0; font-size: 14px; font-weight: 700; color: #2d3748;">')
    html_content = html_content.replace("<p>", '<p style="margin: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">')
    html_content = html_content.replace("<hr />", '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 18px 0;" />')
    html_content = html_content.replace("<hr>", '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 18px 0;" />')
    html_content = html_content.replace("<ul>", '<ul style="margin: 8px 0; padding-left: 22px; color: #4a5568; line-height: 1.6;">')
    html_content = html_content.replace("<ol>", '<ol style="margin: 8px 0; padding-left: 22px; color: #4a5568; line-height: 1.6;">')
    html_content = html_content.replace("<li>", '<li style="margin-bottom: 6px; font-size: 14px; line-height: 1.6;">')
    html_content = html_content.replace("<code>", '<code style="background-color: #edf2f7; color: #c53030; padding: 2px 5px; border-radius: 4px; font-size: 12px; font-family: monospace;">')
    html_content = html_content.replace("<strong>", '<strong style="color: #2d3748; font-weight: 700;">')

    return html_content

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
    raw_pr_body = os.environ.get("PR_BODY", "Không có mô tả chi tiết.")
    download_url = os.environ.get("DOWNLOAD_URL", "")
    repo = os.environ.get("REPOSITORY", "9Paws/APP.9Paws-FE")
    run_id = os.environ.get("RUN_ID", "")
    run_number = os.environ.get("RUN_NUMBER", "1")

    # Render Markdown sang HTML cao cấp
    rendered_body = render_markdown_to_email_html(raw_pr_body)

    # Thay thế các placeholder trong email HTML
    html = html.replace("{{PR_TITLE}}", pr_title)
    html = html.replace("{{PR_BODY}}", rendered_body)
    html = html.replace("{{REPOSITORY}}", repo)
    html = html.replace("{{RUN_ID}}", run_id)
    html = html.replace("{{RUN_NUMBER}}", run_number)
    html = html.replace("{{DOWNLOAD_URL}}", download_url)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("Success: Generated email-ready.html successfully with rendered Markdown.")

if __name__ == "__main__":
    main()
