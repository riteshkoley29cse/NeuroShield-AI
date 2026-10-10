
const messageInput = document.getElementById("message");
const analyzeBtn = document.getElementById("analyzeBtn");
const emptyState = document.getElementById("emptyState");
const report = document.getElementById("report");
const scoreElement = document.getElementById("score");
const scoreBar = document.getElementById("scoreBar");
const riskLevel = document.getElementById("riskLevel");
const signals = document.getElementById("signals");
const recommendation = document.getElementById("recommendation");
const resetBtn = document.getElementById("resetBtn");

function detectThreats(message) {
    const checks = [
        {
            name: "Urgent or threatening language",
            pattern: /\b(urgent|immediately|act now|account suspended|final warning|within 24 hours)\b/i,
            points: 20
        },
        {
            name: "Requests for passwords or verification codes",
            pattern: /\b(password|otp|one[- ]time password|verification code|pin number|login credentials)\b/i,
            points: 25
        },
        {
            name: "Suspicious links",
            pattern: /(https?:\/\/|www\.)\S+|bit\.ly\/\S+|tinyurl\.com\/\S+/i,
            points: 25
        },
        {
            name: "Prize or unexpected reward claims",
            pattern: /\b(you have won|you won|claim your prize|free gift|lottery winner|congratulations)\b/i,
            points: 15
        },
        {
            name: "Requests for money or payment",
            pattern: /\b(send money|transfer money|pay now|payment required|bank details|gift card)\b/i,
            points: 20
        },
        {
            name: "Impersonation or account verification",
            pattern: /\b(verify your account|confirm your identity|bank account|click here to verify)\b/i,
            points: 20
        }
    ];

    const matched = checks.filter(check => check.pattern.test(message));
    const rawScore = matched.reduce((total, check) => total + check.points, 0);
    const score = Math.min(rawScore, 100);

    let level;
    let advice;

    if (score >= 60) {
        level = "HIGH RISK";
        advice = "Do not click links, share codes, or send money. Verify the message through the organisation's official website or phone number.";
    } else if (score >= 25) {
        level = "MEDIUM RISK";
        advice = "Be cautious. Check the sender independently and avoid opening unexpected links or sharing sensitive information.";
    } else {
        level = "LOW RISK";
        advice = "No strong warning patterns were detected by these rules. This does not guarantee the message is safe.";
    }

    return { score, level, advice, matched };
}

function analyzeMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        messageInput.focus();
        messageInput.placeholder = "Please paste a message to analyze first...";
        return;
    }

    const result = detectThreats(message);

    emptyState.classList.add("hidden");
    report.classList.remove("hidden");

    scoreElement.textContent = result.score + "%";
    scoreBar.style.width = result.score + "%";
    riskLevel.textContent = result.level;
    recommendation.textContent = result.advice;

    signals.innerHTML = "";

    if (result.matched.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No known warning patterns matched. Stay alert: new or sophisticated scams may not be detected.";
        signals.appendChild(item);
    } else {
        result.matched.forEach(check => {
            const item = document.createElement("li");
            item.textContent = check.name;
            signals.appendChild(item);
        });
    }

    scoreElement.style.transform = "scale(1.12)";
    setTimeout(() => {
        scoreElement.style.transform = "scale(1)";
    }, 250);
}

function resetAnalyzer() {
    messageInput.value = "";
    report.classList.add("hidden");
    emptyState.classList.remove("hidden");
    scoreElement.textContent = "0%";
    scoreBar.style.width = "0%";
    riskLevel.textContent = "";
    recommendation.textContent = "";
    signals.innerHTML = "";
}

analyzeBtn.addEventListener("click", analyzeMessage);

if (resetBtn) {
    resetBtn.addEventListener("click", resetAnalyzer);
}

document.querySelectorAll("[data-sample]").forEach(button => {
    button.addEventListener("click", () => {
        messageInput.value = button.dataset.sample;
        messageInput.focus();
    });
});