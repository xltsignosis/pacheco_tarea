from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

class PDFBuilder:
    def __init__(self, title="Reporte"):
        self.buffer = io.BytesIO()
        self.pdf = canvas.Canvas(self.buffer, pagesize=letter)
        self.pdf.setTitle(title)
        self.y = 750

    def add_header(self, text):
        self.pdf.setFont("Helvetica-Bold", 16)
        self.pdf.drawString(50, self.y, text)
        self.y -= 30

    def add_table(self, df):
        self.pdf.setFont("Helvetica", 12)
        for _, row in df.iterrows():
            linea = f"{row['mes']} - Total pagos: {row['total_pagos']} - Monto: ${row['total_monto']:.2f}"
            self.pdf.drawString(50, self.y, linea)
            self.y -= 20
            if self.y < 50:
                self.pdf.showPage()
                self.y = 750

    def add_footer(self):
        self.pdf.setFont("Helvetica-Oblique", 10)
        self.pdf.drawString(50, 30, "Reporte generado automáticamente")
    
    def build(self):
        self.pdf.save()
        self.buffer.seek(0)
        return self.buffer
