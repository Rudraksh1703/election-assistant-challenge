// Election Process Assistant Logic

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const contrastToggle = document.getElementById('contrast-toggle');
    const datesBtn = document.getElementById('dates-btn');
    const dynamicContent = document.getElementById('dynamic-content-area');
    const quizContainer = document.getElementById('quiz-container');

    // Accessibility: High Contrast
    contrastToggle.addEventListener('click', () => {
        const isHighContrast = document.body.getAttribute('data-theme') === 'high-contrast';
        document.body.setAttribute('data-theme', isHighContrast ? '' : 'high-contrast');
    });

    // Chat functionality
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            userInput.value = '';
            handleIntent(text);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // Voice Input (Web Speech API)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        voiceBtn.addEventListener('click', () => {
            voiceBtn.textContent = 'Listening...';
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendBtn.click();
        };

        recognition.onspeechend = () => {
            recognition.stop();
            voiceBtn.textContent = '🎤 Voice Input';
        };

        recognition.onerror = () => {
            voiceBtn.textContent = '🎤 Voice Input';
            addMessage("Voice recognition failed. Please try typing.", 'assistant');
        };
    } else {
        voiceBtn.style.display = 'none';
    }

    // Smart Intent Engine
    function getIntent(text) {
        const lowerText = text.toLowerCase();
        
        // Age check logic
        const ageMatch = text.match(/(?:i am|age|i'm)\s*(\d+)/i);
        if (ageMatch) {
            const age = parseInt(ageMatch[1], 10);
            return { intent: 'age_check', value: age };
        }

        if (/(eligible|can i vote|register|requirements)/.test(lowerText)) return { intent: 'eligibility' };
        if (/(steps|how to|process)/.test(lowerText)) return { intent: 'steps' };
        if (/(timeline|when|stages)/.test(lowerText)) return { intent: 'timeline' };
        if (/(quiz|test me|learn)/.test(lowerText)) return { intent: 'quiz' };
        
        return { intent: 'unknown' };
    }

    function handleIntent(text) {
        const parsed = getIntent(text);

        switch (parsed.intent) {
            case 'age_check':
                if (parsed.value < 18) {
                    addMessage("You are Ineligible to vote. You must be at least 18 years old.", 'assistant');
                } else {
                    addMessage("You are eligible! Here is your Registration Checklist:", 'assistant');
                    showChecklist();
                }
                break;
            case 'eligibility':
                addMessage("To vote, you generally need to be a citizen, meet state residency requirements, and be 18 years old. What is your age?", 'assistant');
                break;
            case 'steps':
                addMessage("Voting steps: 1. Register 2. Find your polling station 3. Bring ID 4. Cast your ballot. Use the buttons on the right to find your station!", 'assistant');
                break;
            case 'timeline':
                addMessage("Check out the election timeline chart below!", 'assistant');
                break;
            case 'quiz':
                addMessage("Let's test your civic knowledge! Look at the quiz panel.", 'assistant');
                startQuiz();
                break;
            default:
                addMessage("I'm not sure about that. Try asking about 'eligibility', 'voting steps', 'election timeline', or 'quiz'.", 'assistant');
        }
    }

    // Context-Aware Logic: Registration Checklist with Staggered Entry
    function showChecklist() {
        dynamicContent.innerHTML = '<h3>Registration Checklist</h3>';
        const items = ['1. Check Voter Registration Status', '2. Gather required IDs', '3. Find your local polling place', '4. Review the ballot options'];
        
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'checklist-item';
            div.textContent = item;
            div.style.animationDelay = `${index * 0.2}s`;
            dynamicContent.appendChild(div);
        });
    }

    // Google Services Integration: Mock Sheets API
    datesBtn.addEventListener('click', async () => {
        addMessage("Fetching local election dates from database...", 'assistant');
        datesBtn.disabled = true;
        // Mock async delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        addMessage("Primary Election: June 4, General Election: November 5. Don't forget!", 'assistant');
        datesBtn.disabled = false;
    });

    // Timeline: Chart.js
    const ctx = document.getElementById('timelineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Registration', 'Primary', 'Campaigns', 'Early Voting', 'Election Day'],
            datasets: [{
                label: 'Election Stages Intensity',
                data: [20, 50, 80, 60, 100],
                borderColor: '#ea580c',
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { display: false }
            }
        }
    });

    // Quiz Mode
    const questions = [
        { q: "What is the minimum voting age in most democracies?", options: ["16", "18", "21", "25"], a: 1 },
        { q: "What do you need to find to vote in person?", options: ["A grocery store", "A polling station", "A post office", "A library"], a: 1 },
        { q: "Which election happens first?", options: ["Primary", "General", "Midterm", "Special"], a: 0 },
        { q: "Can you vote early in many regions?", options: ["Yes", "No", "Only if sick", "Only seniors"], a: 0 },
        { q: "What is a ballot?", options: ["A dance", "A voting document", "A politician", "A law"], a: 1 }
    ];
    let currentQ = 0;
    let score = 0;

    const quizQ = document.getElementById('quiz-question');
    const quizOpts = document.getElementById('quiz-options');
    const quizFeed = document.getElementById('quiz-feedback');
    const scoreSpan = document.getElementById('quiz-score');

    function startQuiz() {
        quizContainer.classList.remove('hidden');
        currentQ = 0;
        score = 0;
        scoreSpan.textContent = score;
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQ >= questions.length) {
            quizQ.textContent = "Quiz Complete!";
            quizOpts.innerHTML = "";
            quizFeed.textContent = `Final Score: ${score}/${questions.length}`;
            return;
        }

        const q = questions[currentQ];
        quizQ.textContent = `${currentQ + 1}. ${q.q}`;
        quizOpts.innerHTML = '';
        quizFeed.textContent = '';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(idx);
            quizOpts.appendChild(btn);
        });
    }

    function checkAnswer(idx) {
        if (idx === questions[currentQ].a) {
            score++;
            scoreSpan.textContent = score;
            quizFeed.textContent = "Correct! ✅";
            quizFeed.style.color = "green";
        } else {
            quizFeed.textContent = "Incorrect. ❌";
            quizFeed.style.color = "red";
        }
        currentQ++;
        setTimeout(loadQuestion, 1000);
    }
});
