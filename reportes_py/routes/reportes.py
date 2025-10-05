from fastapi import APIRouter
from services.estadisticas import obtener_por_mes, obtener_por_metodo_pago, generar_pdf_por_mes


router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/por-metodo")
def por_metodo_pago():
    """
    Reporte de pagos agrupados por método de pago.
    """
    return obtener_por_metodo_pago()

@router.get("/por-mes")
def por_mes():
    """
    Reporte de pagos agrupados por mes.
    """
    return obtener_por_mes()

@router.get("/por-mes/pdf")
def reporte_pdf_por_mes():
    """
    Genera un reporte PDF de pagos agrupados por mes.
    """
    return generar_pdf_por_mes()