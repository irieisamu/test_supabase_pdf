from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pdf_generator import create_pdf
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/generate-pdf")
def generate_pdf(data: dict = Body(...)):
    filename = f"/tmp/{uuid.uuid4()}.pdf"
    create_pdf(data, filename)
    return FileResponse(filename, media_type="application/pdf", filename="resume.pdf")
