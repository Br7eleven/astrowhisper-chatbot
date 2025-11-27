from flask import Flask
from chat_routes import chat_bp

app = Flask(__name__)
app.register_blueprint(chat_bp)

if __name__ == '__main__':
    print("🔮 Horoscope chatbot running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
