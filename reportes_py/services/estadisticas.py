from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from fastapi.responses import StreamingResponse
import psycopg2
import pandas as pd


DB_CONFIG = {
    "host": "localhost",
    "port": "5432",
    "dbname": "universidad_db",
    "user": "postgre",
    "password": "pachegod"
}


def obtener_por_metodo_pago():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        query = """
            SELECT payment_method, COUNT(*) AS total_pagos, SUM(amount) AS total_monto
            FROM payments
            GROUP BY payment_method
            ORDER BY payment_method;
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}
    




def obtener_por_mes():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        query = """
            SELECT DATE_TRUNC('month', transaction_date) AS mes,
                   COUNT(*) AS total_pagos,
                   SUM(amount) AS total_monto
            FROM payments
            GROUP BY mes
            ORDER BY mes;
        """
        df = pd.read_sql(query, conn)
        conn.close()

        # Formatear la fecha como YYYY-MM
        df["mes"] = df["mes"].dt.strftime("%Y-%m")

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}




def generar_pdf_por_mes():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        query = """
            SELECT DATE_TRUNC('month', transaction_date) AS mes,
                   COUNT(*) AS total_pagos,
                   SUM(amount) AS total_monto
            FROM payments
            GROUP BY mes
            ORDER BY mes;
        """
        df = pd.read_sql(query, conn)
        conn.close()
        df["mes"] = df["mes"].dt.strftime("%Y-%m")

        # Crear PDF en memoria
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Reporte de Pagos por Mes")

        pdf.drawString(50, 750, "Reporte de Pagos Agrupados por Mes")
        y = 720
        for index, row in df.iterrows():
            linea = f"{row['mes']} - Total pagos: {row['total_pagos']} - Monto: ${row['total_monto']:.2f}"
            pdf.drawString(50, y, linea)
            y -= 20
            if y < 50:
                pdf.showPage()
                y = 750

        pdf.save()
        buffer.seek(0)
        return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=reportes_por_mes.pdf"})

    except Exception as e:
        return {"error": str(e)}
    