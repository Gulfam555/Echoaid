/**
 * EchoAid Laravel - Scenarios and Audio Synthesizer
 */

window.EchoAidScenarios = {
  collapsedFriend: {
    id: 'collapsed_friend',
    name: 'Medical: Collapsed Friend (Hackathon Spec)',
    description: 'Sudden collapse, unresponsive, abnormal breathing, immediate triage.',
    steps: [
      {
        delayMs: 600,
        speaker: 'user',
        text: 'Help! My friend just suddenly collapsed on the floor and isn\'t responding!',
        visualizerIntensity: 0.85,
        stateUpdate: {
          emergency_type: 'Medical Emergency',
          urgency: 'HIGH',
          people_affected: 1,
          conscious: 'Assessing...',
          breathing: 'Unknown',
          hazards: 'None Reported'
        }
      },
      {
        delayMs: 2400,
        speaker: 'agent',
        text: 'Stay calm, I am here with you. Can you check: is your friend conscious or responding at all?',
        visualizerIntensity: 0.6,
        speakAudio: true
      },
      {
        delayMs: 3200,
        speaker: 'user',
        text: 'No, he is not conscious! I tapped his shoulder and yelled his name, but nothing.',
        visualizerIntensity: 0.9,
        stateUpdate: {
          conscious: 'Unconscious / Non-responsive',
          urgency: 'CRITICAL'
        }
      },
      {
        delayMs: 2600,
        speaker: 'agent',
        text: 'Understood. Critical priority recorded. Look closely at his chest right now—is he breathing normally?',
        visualizerIntensity: 0.6,
        speakAudio: true
      },
      {
        delayMs: 3400,
        speaker: 'user',
        text: 'His breathing sounds very shallow and abnormal, almost like he is gasping for air.',
        visualizerIntensity: 0.8,
        stateUpdate: {
          breathing: 'Agonal / Labored Gasping',
          hazards: 'Immediate cardiac/respiratory risk',
          urgency: 'CRITICAL',
          summary: '1 individual collapsed suddenly. Unconscious, non-responsive. Agonal/shallow breathing observed. Suspected cardiac/respiratory distress. Immediate AED / CPR standby recommended.'
        }
      },
      {
        delayMs: 2200,
        speaker: 'agent',
        text: 'Emergency summary compiled and triage set to CRITICAL. Press TRIGGER SOS now to notify nearby community responders.',
        visualizerIntensity: 0.5,
        speakAudio: true,
        enableSosPrompt: true
      }
    ]
  },

  trafficAccident: {
    id: 'traffic_accident',
    name: 'Traffic: Roadside Collision',
    description: 'Two-car impact, traffic hazard, conscious victims.',
    steps: [
      {
        delayMs: 600,
        speaker: 'user',
        text: 'Two cars just collided in front of me at the intersection! Smoke is coming from the hood!',
        visualizerIntensity: 0.9,
        stateUpdate: {
          emergency_type: 'Traffic Collision (2 Vehicles)',
          urgency: 'HIGH',
          people_affected: '2+ estimated',
          conscious: 'Assessing...',
          breathing: 'Assessing...',
          hazards: 'Engine smoke, active traffic'
        }
      },
      {
        delayMs: 2500,
        speaker: 'agent',
        text: 'Keep yourself in a safe spot away from traffic. Are the drivers conscious and able to exit the vehicles?',
        visualizerIntensity: 0.6,
        speakAudio: true
      },
      {
        delayMs: 3200,
        speaker: 'user',
        text: 'One driver is awake holding his wrist, the other is trapped in the driver seat but talking.',
        visualizerIntensity: 0.85,
        stateUpdate: {
          conscious: 'Conscious (1 pinned in vehicle)',
          breathing: 'Normal / Talking',
          people_affected: 2,
          urgency: 'HIGH',
          summary: '2-vehicle collision at intersection. 2 conscious victims; 1 driver trapped inside cabin with vehicle smoke. Extrication equipment needed. Active roadway hazard.'
        }
      },
      {
        delayMs: 2000,
        speaker: 'agent',
        text: 'Information structured. Do not attempt to move the trapped driver if fire hazard is low. Ready to dispatch SOS.',
        visualizerIntensity: 0.5,
        speakAudio: true,
        enableSosPrompt: true
      }
    ]
  }
};

window.EchoAidAudio = {
  ctx: null,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },

  playBeep(freq = 440, type = 'sine', duration = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone inhibited:', e);
    }
  },

  playSosAlert() {
    this.playBeep(880, 'square', 0.2);
    setTimeout(() => this.playBeep(660, 'square', 0.2), 220);
    setTimeout(() => this.playBeep(880, 'square', 0.3), 440);
  },

  playChime() {
    this.playBeep(523.25, 'sine', 0.25);
    setTimeout(() => this.playBeep(659.25, 'sine', 0.25), 150);
    setTimeout(() => this.playBeep(783.99, 'sine', 0.4), 300);
  },

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    }
  }
};
