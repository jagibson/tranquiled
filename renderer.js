const { ipcRenderer } = require('electron');

const led = document.getElementById('led');

const TARGET_INTERVAL = 500; // 1 blink per second (500ms per half-cycle)
const FADE_DURATION = 10000; // 10 seconds to fade out

let settings = {
    initialInterval: 100,   // ms per half-cycle at start (fast blink rate)
    slowdownTime: 60,       // seconds to reach 1/second
    steadyTime: 120         // seconds at 1/second before fade-out
};

let isRunning = false;
let blinkTimeout = null;
let startTime = 0;
let fadeOpacity = 1;
let isVisible = true;

function getCurrentInterval() {
    const elapsed = Date.now() - startTime;
    const slowdownMs = settings.slowdownTime * 1000;

    if (elapsed < slowdownMs) {
        // Linearly interpolate from initialInterval to TARGET_INTERVAL
        const progress = elapsed / slowdownMs;
        return settings.initialInterval + (TARGET_INTERVAL - settings.initialInterval) * progress;
    }
    return TARGET_INTERVAL;
}

function getPhase() {
    const elapsed = Date.now() - startTime;
    const slowdownMs = settings.slowdownTime * 1000;
    const steadyMs = settings.steadyTime * 1000;

    if (elapsed < slowdownMs) return 'slowing';
    if (elapsed < slowdownMs + steadyMs) return 'steady';
    if (elapsed < slowdownMs + steadyMs + FADE_DURATION) return 'fading';
    return 'done';
}

function startHeartbeat() {
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now();
    fadeOpacity = 1;
    isVisible = true;
    led.style.display = 'block';
    led.style.opacity = 1;
    scheduleNextBlink();
}

function stopHeartbeat() {
    isRunning = false;
    clearTimeout(blinkTimeout);
    blinkTimeout = null;
    led.style.display = 'none';
}

function scheduleNextBlink() {
    if (!isRunning) return;

    const phase = getPhase();
    if (phase === 'done') {
        stopHeartbeat();
        return;
    }

    const interval = getCurrentInterval();

    if (phase === 'fading') {
        const elapsed = Date.now() - startTime;
        const fadeStart = (settings.slowdownTime + settings.steadyTime) * 1000;
        fadeOpacity = 1 - ((elapsed - fadeStart) / FADE_DURATION);
    }

    blinkTimeout = setTimeout(() => {
        isVisible = !isVisible;
        led.style.opacity = isVisible ? fadeOpacity : 0;
        scheduleNextBlink();
    }, interval);
}

ipcRenderer.on('toggle-led', () => {
    if (isRunning) {
        stopHeartbeat();
    } else {
        startHeartbeat();
    }
});

ipcRenderer.on('update-settings', (_event, newSettings) => {
    settings = { ...settings, ...newSettings };
    if (isRunning) {
        stopHeartbeat();
        startHeartbeat();
    }
});

ipcRenderer.on('restart-heartbeat', () => {
    stopHeartbeat();
    startHeartbeat();
});

// Start as soon as the app loads
startHeartbeat();
