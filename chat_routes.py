from flask import Blueprint, request, jsonify, render_template
from horoscope_ai import send_to_gemini
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

SYSTEM_PROMPT = """You are a friendly astrology assistant. 
Answer only what the user asks. 
Keep responses short, conversational, and to the point. 
Do not generate full horoscopes unless the user explicitly requests it.
"""

@chat_bp.route('/')
def home():
    return render_template('index.html')

@chat_bp.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '').strip()
    if not user_message:
        return jsonify({'response': 'Please send a message!'}), 400

    current_date = datetime.now().strftime("%B %d, %Y, %A")
    # Keep context short
    short_message = f"[{current_date}] {user_message}"

    try:
        bot_response = send_to_gemini(short_message, SYSTEM_PROMPT)
        return jsonify({'response': bot_response})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"}), 500
