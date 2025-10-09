from fastapi.responses import StreamingResponse
import psycopg2
import pandas as pd
from services.report_strategy import MonthlyReportStrategy
from services.pdf_builder import PDFBuilder

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
        df["mes"] = df["mes"].dt.strftime("%Y-%m")
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}

def generar_pdf_por_mes():
    try:
        conn = psycopg2.connect(**DB_CONFIG)

        # Aplicar patrón Strategy
        estrategia = MonthlyReportStrategy()
        df = estrategia.generate(conn)
        conn.close()

        # Aplicar patrón Builder
        builder = PDFBuilder(title="Reporte de Pagos por Mes")
        builder.add_header("Reporte de Pagos Agrupados por Mes")
        builder.add_table(df)
        builder.add_footer()
        buffer = builder.build()

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline; filename=reportes_por_mes.pdf"}
        )

    except Exception as e:
        return {"error": str(e)}