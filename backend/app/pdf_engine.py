import fitz  # PyMuPDF
from weasyprint import HTML
from io import BytesIO

class PDFEngine:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        """Extract plain text from a PDF file."""
        text = ""
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text

    @staticmethod
    def generate_pdf(html_content: str) -> bytes:
        """Convert HTML content to a PDF byte stream."""
        # Wrap the content in a basic CSS for resume styling
        styled_html = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; }}
                    h1 {{ color: #2c3e50; border-bottom: 2px solid #2c3e50; }}
                    h2 {{ color: #34495e; margin-top: 20px; }}
                    ul {{ padding-left: 20px; }}
                    li {{ margin-bottom: 5px; }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
        </html>
        """
        pdf_bytes = HTML(string=styled_html).write_pdf()
        return pdf_bytes
