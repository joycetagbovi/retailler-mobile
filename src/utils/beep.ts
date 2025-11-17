// Beep sound utility using Web Audio API
export function playBeep() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz (higher = higher pitch)
    oscillator.type = 'sine'; // Sine wave for a clean beep

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1); // Duration 100ms
  } catch (error) {
    console.log('Beep sound not supported');
  }
}
