from flask import Flask, request, send_file
from docx import Document
from docx.shared import Pt, Inches
import tempfile
import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_document():
    # Получаем файл и параметры
    file = request.files['file']
    doc = Document(file)

    # Считываем параметры из формы
    font_name = request.form.get('fontFamily', 'Arial')
    font_size = int(request.form.get('fontSize', 12))
    indent_mm = float(request.form.get('paragraphIndent', 5))
    line_spacing = float(request.form.get('lineHeight', 1.0))
    margins_mm = {
        'top': float(request.form.get('topMargin', 0)),
        'bottom': float(request.form.get('bottomMargin', 0)),
        'left': float(request.form.get('leftMargin', 0)),
        'right': float(request.form.get('rightMargin', 0)),
    }

    # Установка полей
    for section in doc.sections:
        section.top_margin = Inches(margins_mm['top'] / 25.4)
        section.bottom_margin = Inches(margins_mm['bottom'] / 25.4)
        section.left_margin = Inches(margins_mm['left'] / 25.4)
        section.right_margin = Inches(margins_mm['right'] / 25.4)

    # Обработка всех абзацев
    for para in doc.paragraphs:
        pf = para.paragraph_format
        pf.first_line_indent = Inches(indent_mm / 25.4)
        pf.line_spacing = line_spacing

        for run in para.runs:
            run.font.name = font_name
            run.font.size = Pt(font_size)

    # Сохраняем результат во временный файл
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    doc.save(temp_file.name)

    return send_file(temp_file.name, as_attachment=True, download_name="formatted.docx")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


