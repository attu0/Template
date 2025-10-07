from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import mediapipe as mp
import cv2
import io
from PIL import Image

# ------------------- CONFIG -------------------
MODEL_PATH = "./hand_gesture_model.h5"
LABELS_PATH = "./labels.txt"
IMG_SIZE = 128

# ------------------- FASTAPI SETUP -------------------
app = FastAPI(title="Hand Gesture Recognition API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- MODEL LOAD -------------------
print("🔹 Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
with open(LABELS_PATH, "r") as f:
    LABELS = [line.strip() for line in f.readlines()]
print("✅ Model loaded successfully!")

# ------------------- MEDIAPIPE SETUP -------------------
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.6)

# ------------------- DATA MODEL -------------------
class PredictionResponse(BaseModel):
    predictions: list

# ------------------- UTILS -------------------
def preprocess_image(image: np.ndarray):
    """Resize and normalize image for model prediction."""
    img = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# ------------------- ROUTES -------------------
@app.get("/")
async def root():
    return {"message": "Hand Gesture Recognition API is running 🚀"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """Accepts an image and returns predicted gestures."""
    contents = await file.read()
    image = np.array(Image.open(io.BytesIO(contents)).convert("RGB"))
    image_rgb = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Detect hand regions using MediaPipe
    result = hands.process(image)
    predictions = []

    if result.multi_hand_landmarks:
        h, w, _ = image.shape
        for hand_landmarks in result.multi_hand_landmarks:
            x_coords = [lm.x for lm in hand_landmarks.landmark]
            y_coords = [lm.y for lm in hand_landmarks.landmark]
            x_min = int(min(x_coords) * w) - 20
            x_max = int(max(x_coords) * w) + 20
            y_min = int(min(y_coords) * h) - 20
            y_max = int(max(y_coords) * h) + 20

            x_min, y_min = max(0, x_min), max(0, y_min)
            x_max, y_max = min(w, x_max), min(h, y_max)

            roi = image[y_min:y_max, x_min:x_max]
            if roi.size == 0:
                continue

            img = preprocess_image(roi)
            preds = model.predict(img)
            pred_label = LABELS[np.argmax(preds)]
            confidence = float(np.max(preds))

            predictions.append({
                "label": pred_label,
                "confidence": confidence,
                "bbox": [x_min, y_min, x_max, y_max]
            })
    else:
        predictions.append({"label": "No hand detected", "confidence": 0.0, "bbox": None})

    return {"predictions": predictions}

# ------------------- RUN SERVER -------------------
# Run via:  uvicorn main:app --reload
