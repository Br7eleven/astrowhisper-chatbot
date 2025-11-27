# horoscope_ai.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file!")

# Configure API
genai.configure(api_key=API_KEY)

def send_to_gemini(user_message: str, system_prompt: str) -> str:
    """
    Sends user message to Gemini 2.0 chat API and returns AI response.
    Works in localhost and on Vercel.
    """
    try:
        response = genai.chat.create(
            model="gemini-2.0",  # latest supported model
            messages=[
                {"author": "system", "content": system_prompt},
                {"author": "user", "content": user_message}
            ]
        )
        return response.last.text
    except Exception as e:
        return f"Error contacting AI: {str(e)}"
