from abc import ABC, abstractmethod
import pandas as pd

class ReportStrategy(ABC):
    @abstractmethod
    def generate(self, conn) -> pd.DataFrame:
        pass

class MonthlyReportStrategy(ReportStrategy):
    def generate(self, conn):
        query = """
            SELECT DATE_TRUNC('month', transaction_date) AS mes,
                   COUNT(*) AS total_pagos,
                   SUM(amount) AS total_monto
            FROM payments
            GROUP BY mes
            ORDER BY mes;
        """
        df = pd.read_sql(query, conn)
        df["mes"] = df["mes"].dt.strftime("%Y-%m")
        return df
    

