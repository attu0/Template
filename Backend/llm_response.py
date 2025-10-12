from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with Groq endpoint
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

# Optional: Map known hand signs to their meanings
GESTURE_MEANINGS = {
    "Tripataka": "symbolizes a crown, tree, or flame",
    "Pataka": "represents a flag, denial, or blessing",
    "Ardhachandra": "depicts the half moon or offering",
    "Mayura": "represents a peacock or elegance",
    "Shikhara": "symbolizes strength or Lord Shiva",
    "Hamsasya": "depicts a delicate gesture or tying thread",
    "No hand detected": "no recognizable gesture was found",
}

def generate_story(hand_sign: str) -> str:
    """
    Generates a 2–3 line narrative or description based on the detected hand sign.
    """
    meaning = GESTURE_MEANINGS.get(hand_sign, "a symbolic gesture in Bharatanatyam")

    prompt = (
        f"In Bharatanatyam, the hand sign '{hand_sign}' is used to represent {meaning}. "
        f"Tell a 2–3 line information or story about it."
    )

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ Error generating story: {str(e)}"
