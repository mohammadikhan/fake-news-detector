from pydantic import BaseModel
from typing import Optional, Dict, List

class ExplainabilityResponse(BaseModel):
    topFakeIndicators: List[str]
    topRealIndicators: List[str]
    interpretation: str

class AnalyzeRequest(BaseModel):
    text: str
    includeExplanation: bool = False
    # numFeatures: int = 8

class AnalyzeResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    explainability: Optional[ExplainabilityResponse] = None