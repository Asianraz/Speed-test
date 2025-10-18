const quoteElement = document.getElementById('quote');
const inputElement = document.getElementById('input');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');

let quote = '';
let startTime;
let intervalId;

const localQuotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The only impossible journey is the one you never begin.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing."
];

async function getNewQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        quote = data.content;
    } catch (error) {
        console.error('Error fetching quote:', error);
        quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    } finally {
        quoteElement.textContent = quote;
        inputElement.value = '';
    }
}

function startTest() {
    startTime = new Date().getTime();
    intervalId = setInterval(updateStats, 1000);
}

function endTest() {
    clearInterval(intervalId);
}

function updateStats() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000 / 60; // in minutes

    const typedText = inputElement.value;
    const typedWords = typedText.trim().split(/\s+/).filter(word => word !== '').length;

    const wpm = Math.round(typedWords / elapsedTime) || 0;
    wpmElement.textContent = wpm;

    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === quote[i]) {
            correctChars++;
        }
    }
    const accuracy = Math.round((correctChars / typedText.length) * 100) || 100;
    accuracyElement.textContent = accuracy;
}

inputElement.addEventListener('input', () => {
    if (!startTime) {
        startTest();
    }
    if (inputElement.value.length >= quote.length) {
        endTest();
    }
});

resetBtn.addEventListener('click', () => {
    endTest();
    startTime = null;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
    getNewQuote();
});

getNewQuote();