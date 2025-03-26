from fpdf import FPDF
import os

class PDF(FPDF):
    pass

def create_pdf(data, filename):
    pdf = PDF()
    pdf.add_page()

    # 日本語フォントを追加
    font_path = os.path.join(os.path.dirname(__file__), "fonts", "NotoSansJP-VariableFont.ttf")
    pdf.add_font('Noto', '', font_path, uni=True)
    pdf.set_font('Noto', size=12)

    # 名前と年齢
    pdf.cell(200, 10, txt=f"名前: {data.get('name')}, 年齢: {data.get('age')}", ln=True)

    # 職歴
    for job in data.get("work_history", []):
        line = f"{job.get('company')} - {job.get('title')} ({job.get('start_date')}~{job.get('end_date')})"
        pdf.cell(200, 10, txt=line, ln=True)

    pdf.output(filename)
