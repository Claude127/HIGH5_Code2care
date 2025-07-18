from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
#from patient_feedback.model_utils import predict_text
from patient_feedback.model_utils import predict_text

import time
from fastapi.responses import JSONResponse

app = FastAPI()

class TextInput(BaseModel):
    texts: List[str]

@app.post("/classify_text/")
async def predict(input: TextInput):
    results = []
    for text in input.texts:
        start_time = time.time()

        prediction, confidence = predict_text(text)

        end_time = time.time()
        inference_time = round(end_time - start_time, 2)

        results.append({
            "text": text,
            "prediction": prediction,
            "confidence": confidence,
            "processing_time_seconds": inference_time
        })

    return JSONResponse(content={"results": results})
