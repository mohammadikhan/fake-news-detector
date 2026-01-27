from fastapi import FastAPI, HTTPException
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.explainAI import analyze as analyzeText

app = FastAPI(title="Fake News ML Service")

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="[ERROR]: Empty Text")
    
    return analyzeText(
        text=request.text,
        includeExplanation=request.includeExplanation,
        # num_features=request.numFeatures
    )