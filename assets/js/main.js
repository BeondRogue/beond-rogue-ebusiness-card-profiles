// Initialize Audio Context for retro sound effects
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Synthesize a retro Gameboy-style UI click (8-bit square wave)
function playRetroClick() {
    initAudio();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Square wave gives that classic Pokémon Gameboy feel
    oscillator.type = 'square';
    
    // Start at a high pitch and quickly drop (a 'blip' or 'click' sound)
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.05);
    
    // Volume envelope: quick fade out
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// Wait for the DOM to load before attaching events
document.addEventListener('DOMContentLoaded', () => {
    
    // Attach the sound effect to all buttons
    const buttons = document.querySelectorAll('.btn, .btn-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            playRetroClick();
            
            // Allow the sound to play for 100ms before following the link
            // if it's not opening in a new tab
            if(button.getAttribute('target') !== '_blank') {
                e.preventDefault();
                const href = button.getAttribute('href');
                setTimeout(() => {
                    window.location.href = href;
                }, 150);
            }
        });
    });
});
