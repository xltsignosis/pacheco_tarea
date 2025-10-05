from fastapi import FastAPI
from routes import reportes

app = FastAPI()
app.include_router(reportes.router)