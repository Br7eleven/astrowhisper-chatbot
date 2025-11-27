// ========== STARFIELD ANIMATION ==========
const canvas = document.getElementById('starfield');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 150;
    const mouse = { x: w / 2, y: h / 2 };

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 1;
            this.speed = Math.random() * 0.5 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        update() {
            // Move star normally
            this.y -= this.speed;
            if (this.y < 0) this.y = h;

            // Mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) { // repel radius
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * 2;
                this.y += Math.sin(angle) * 2;
            }
        }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
}

// ========== CHAT FUNCTIONALITY ==========
function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function addMessage(msg, isUser) {
    const chatBox = document.getElementById('chat-box');
    const messageWrapper = document.createElement('div');
    messageWrapper.className = isUser ? 'message-wrapper user-wrapper' : 'message-wrapper bot-wrapper';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = isUser ? '👤' : '🔮';

    const messageContent = document.createElement('div');
    messageContent.className = isUser ? 'message user-message' : 'message bot-message';
    messageContent.innerHTML = msg.split("\n").join("<br>");

    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = getTimeString();

    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group';
    messageGroup.appendChild(messageContent);
    messageGroup.appendChild(timestamp);

    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageGroup);
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, true); // User message
    input.value = '';
    addMessage('<i>Consulting the stars...</i>', false); // Loading

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        const chatBox = document.getElementById('chat-box');
        chatBox.removeChild(chatBox.lastChild); // Remove loading
        addMessage(data.response, false);
    } catch (e) {
        addMessage('Error contacting the server.', false);
    }
}

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

// Initial greeting
addMessage('Hey there! 🌟 How can I help you today?', false);
