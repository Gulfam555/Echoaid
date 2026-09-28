/**
 * EchoAid Laravel - Core Frontend Controller
 */

class EchoAidApp {
  constructor() {
    this.sessionActive = false;
    this.micMuted = false;
    this.currentView = window.ECHOAID_CURRENT_VIEW || 'caller';
    
    this.emergencyState = {
      sessionId: 'ECHO-' + Math.floor(100000 + Math.random() * 900000),
      type: 'Awaiting Voice Input...',
      urgency: 'MODERATE',
      peopleAffected: 'Assessing...',
      conscious: 'Assessing...',
      breathing: 'Assessing...',
      hazards: 'None Reported',
      summary: 'Voice interaction in progress. Speak naturally to describe the emergency.',
      location: {
        lat: 40.7648,
        lng: -73.9734,
        address: '5th Ave & 59th St, New York, NY'
      },
      sosDispatched: false,
      responder: null
    };

    this.audioCanvas = null;
    this.canvasCtx = null;
    this.wavePhase = 0;
    this.waveIntensity = 0.2;
    this.micAudioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.speechRecognizer = null;

    this.map = null;
    this.victimMarker = null;
    this.responderMarker = null;
    this.routeLine = null;

    this.init();
  }

  init() {
    this.setupVisualizer();
    this.setupMap();
    this.bindDomEvents();
    this.setupSpeechRecognition();
    this.updateDashboardUI();

    if (window.EchoAidResponder) {
      window.EchoAidResponder.init();
    }

    this.exposeTeammateHooks();
  }

  setupVisualizer() {
    this.audioCanvas = document.getElementById('audioCanvas');
    if (!this.audioCanvas) return;
    this.canvasCtx = this.audioCanvas.getContext('2d');

    const resize = () => {
      this.audioCanvas.width = this.audioCanvas.offsetWidth * window.devicePixelRatio || 600;
      this.audioCanvas.height = this.audioCanvas.offsetHeight * window.devicePixelRatio || 120;
    };
    resize();
    window.addEventListener('resize', resize);

    this.renderWave();
  }

  renderWave() {
    const ctx = this.canvasCtx;
    const canvas = this.audioCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    let amplitude = 12 * this.waveIntensity;
    if (this.analyser && this.sessionActive && !this.micMuted) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += Math.abs(dataArray[i] - 128);
      }
      const avg = sum / dataArray.length;
      amplitude = Math.max(10, avg * 1.5);
    }

    this.wavePhase += 0.05;

    const layers = [
      { color: 'rgba(6, 182, 212, 0.25)', speed: 1.0, freq: 0.015, ampMult: 0.7 },
      { color: 'rgba(239, 68, 68, 0.4)', speed: 1.3, freq: 0.02, ampMult: 1.0 },
      { color: 'rgba(6, 182, 212, 0.8)', speed: 0.8, freq: 0.025, ampMult: 0.85 }
    ];

    layers.forEach((layer) => {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = layer.color;

      for (let x = 0; x < width; x += 4) {
        const y = midY + Math.sin(x * layer.freq + this.wavePhase * layer.speed) * (amplitude * layer.ampMult);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    requestAnimationFrame(() => this.renderWave());
  }

  setupMap() {
    const mapEl = document.getElementById('emergencyMap');
    if (!mapEl || typeof L === 'undefined') return;

    const coords = [this.emergencyState.location.lat, this.emergencyState.location.lng];
    this.map = L.map('emergencyMap', {
      center: coords,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    const radarIcon = L.divIcon({
      className: 'radar-pulse-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.victimMarker = L.marker(coords, { icon: radarIcon }).addTo(this.map);
    this.victimMarker.bindPopup('<b>Victim Emergency Location</b><br>' + this.emergencyState.location.address).openPopup();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.emergencyState.location.lat = lat;
          this.emergencyState.location.lng = lng;
          this.map.setView([lat, lng], 15);
          this.victimMarker.setLatLng([lat, lng]);
          const locText = document.getElementById('metricLocation');
          if (locText) locText.textContent = `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        },
        () => console.log('Geolocation fallback active.')
      );
    }
  }

  drawResponderRoute() {
    if (!this.map || typeof L === 'undefined') return;

    const victimLat = this.emergencyState.location.lat;
    const victimLng = this.emergencyState.location.lng;
    const respLat = victimLat + 0.0045;
    const respLng = victimLng + 0.0040;

    if (this.responderMarker) this.map.removeLayer(this.responderMarker);
    if (this.routeLine) this.map.removeLayer(this.routeLine);

    const responderIcon = L.divIcon({
      html: '<div style="background:#10b981; color:#fff; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:16px; border:2px solid #fff; box-shadow:0 0 15px rgba(16,185,129,0.8);"><i class="bi bi-person-fill"></i></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    this.responderMarker = L.marker([respLat, respLng], { icon: responderIcon }).addTo(this.map);
    this.responderMarker.bindPopup('<b>Responder: Sarah Jenkins</b><br>En Route (ETA: 2 mins)').openPopup();

    const path = [
      [respLat, respLng],
      [victimLat + 0.002, respLng],
      [victimLat, victimLng]
    ];
    this.routeLine = L.polyline(path, {
      color: '#10b981',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9
    }).addTo(this.map);

    this.map.fitBounds([ [respLat, respLng], [victimLat, victimLng] ], { padding: [30, 30] });
  }

  bindDomEvents() {
    const btnToggleSession = document.getElementById('btnToggleSession');
    if (btnToggleSession) {
      btnToggleSession.addEventListener('click', () => this.toggleEmergencySession());
    }

    const btnMute = document.getElementById('btnMuteMic');
    if (btnMute) {
      btnMute.addEventListener('click', () => this.toggleMute());
    }

    const btnSos = document.getElementById('btnTriggerSos');
    if (btnSos) {
      btnSos.addEventListener('click', () => this.triggerSos());
    }

    const btnCopySummary = document.getElementById('btnCopySummary');
    if (btnCopySummary) {
      btnCopySummary.addEventListener('click', () => {
        navigator.clipboard.writeText(this.emergencyState.summary);
        btnCopySummary.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        setTimeout(() => {
          btnCopySummary.innerHTML = '<i class="bi bi-clipboard"></i> Copy Summary';
        }, 2000);
      });
    }

    const scenarioChips = document.querySelectorAll('[data-scenario]');
    scenarioChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        scenarioChips.forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const scenarioKey = e.currentTarget.getAttribute('data-scenario');
        this.runScriptedScenario(scenarioKey);
      });
    });
  }

  async toggleEmergencySession() {
    const btn = document.getElementById('btnToggleSession');
    const statusPill = document.getElementById('agentStatusPill');

    if (!this.sessionActive) {
      this.sessionActive = true;
      this.waveIntensity = 0.5;
      window.EchoAidAudio.playChime();

      if (btn) {
        btn.innerHTML = '<i class="bi bi-stop-circle-fill me-2"></i> End Emergency Session';
        btn.classList.replace('btn-danger', 'btn-outline-danger');
      }

      if (statusPill) {
        statusPill.className = 'live-status-indicator status-listening';
        statusPill.innerHTML = '<span class="status-pulse-dot"></span> Listening for Emergency Speech...';
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.micAudioContext = new AudioContext();
        const source = this.micAudioContext.createMediaStreamSource(stream);
        this.analyser = this.micAudioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        if (this.speechRecognizer) this.speechRecognizer.start();
      } catch (err) {
        console.warn('Microphone permission notice:', err);
      }

      this.addTranscript('agent', 'EchoAid emergency assistant activated. Describe what is happening around you.');
      window.EchoAidAudio.speakText('EchoAid emergency assistant activated. What is happening?');

    } else {
      this.sessionActive = false;
      this.waveIntensity = 0.1;

      if (btn) {
        btn.innerHTML = '<i class="bi bi-mic-fill me-2"></i> Start Voice Emergency Session';
        btn.classList.replace('btn-outline-danger', 'btn-danger');
      }

      if (statusPill) {
        statusPill.className = 'live-status-indicator status-ready';
        statusPill.innerHTML = '<span class="status-pulse-dot"></span> System Ready';
      }

      if (this.mediaStream) this.mediaStream.getTracks().forEach(t => t.stop());
      if (this.speechRecognizer) {
        try { this.speechRecognizer.stop(); } catch(e) {}
      }
    }
  }

  toggleMute() {
    this.micMuted = !this.micMuted;
    const btnMute = document.getElementById('btnMuteMic');
    if (btnMute) {
      if (this.micMuted) {
        btnMute.innerHTML = '<i class="bi bi-mic-mute-fill"></i>';
        btnMute.classList.add('text-danger');
      } else {
        btnMute.innerHTML = '<i class="bi bi-mic-fill"></i>';
        btnMute.classList.remove('text-danger');
      }
    }
  }

  setupSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    this.speechRecognizer = new SpeechRec();
    this.speechRecognizer.continuous = true;
    this.speechRecognizer.interimResults = false;
    this.speechRecognizer.lang = 'en-US';

    this.speechRecognizer.onresult = (event) => {
      const lastIndex = event.results.length - 1;
      const transcript = event.results[lastIndex][0].transcript;
      this.handleUserInputSpeech(transcript);
    };
  }

  handleUserInputSpeech(speechText) {
    this.addTranscript('user', speechText);
    this.waveIntensity = 0.9;
    setTimeout(() => { this.waveIntensity = 0.4; }, 1000);

    const textLower = speechText.toLowerCase();
    const update = {};

    if (textLower.includes('collapse') || textLower.includes('faint') || textLower.includes('heart') || textLower.includes('unresponsive')) {
      update.emergency_type = 'Medical: Collapse / Unresponsive';
      update.urgency = 'CRITICAL';
      update.conscious = 'Unconscious';
      this.askAgentFollowUp('Is the person breathing? Check their chest movement.');
    } else if (textLower.includes('car') || textLower.includes('crash') || textLower.includes('accident') || textLower.includes('traffic')) {
      update.emergency_type = 'Traffic Accident / Collision';
      update.urgency = 'HIGH';
      update.hazards = 'Active Roadway / Vehicle Traffic';
      this.askAgentFollowUp('How many people appear injured? Are they able to exit?');
    } else if (textLower.includes('fire') || textLower.includes('smoke') || textLower.includes('burn')) {
      update.emergency_type = 'Fire / Hazard Emergency';
      update.urgency = 'CRITICAL';
      update.hazards = 'Smoke Inhalation & Flames';
      this.askAgentFollowUp('Are you in a safe location? Evacuate immediately if possible.');
    } else if (textLower.includes('not breathing') || textLower.includes('gasping')) {
      update.breathing = 'Agonal / Not Breathing';
      update.urgency = 'CRITICAL';
      update.summary = 'Critical respiratory/cardiac arrest detected. Immediate responder notification advised.';
    }

    if (Object.keys(update).length > 0) {
      this.updateStructuredState(update);
    }
  }

  askAgentFollowUp(questionText) {
    setTimeout(() => {
      this.addTranscript('agent', questionText);
      window.EchoAidAudio.speakText(questionText);
    }, 900);
  }

  addTranscript(speaker, text) {
    const box = document.getElementById('transcriptBox');
    if (!box) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const isUser = speaker === 'user';

    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${isUser ? 'msg-user' : 'msg-agent'}`;
    bubble.innerHTML = `
      <div class="msg-meta">
        <strong>${isUser ? '<i class="bi bi-person-fill text-danger me-1"></i> Chaotic Emergency Speech' : '<i class="bi bi-robot text-info me-1"></i> EchoAid Agent (Clarity)'}</strong>
        <span>${time}</span>
      </div>
      <div>${text}</div>
    `;

    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  updateStructuredState(data) {
    if (data.emergency_type) this.emergencyState.type = data.emergency_type;
    if (data.urgency) this.emergencyState.urgency = data.urgency;
    if (data.people_affected !== undefined) this.emergencyState.peopleAffected = data.people_affected;
    if (data.conscious !== undefined) this.emergencyState.conscious = data.conscious;
    if (data.breathing !== undefined) this.emergencyState.breathing = data.breathing;
    if (data.hazards !== undefined) this.emergencyState.hazards = data.hazards;
    if (data.summary) this.emergencyState.summary = data.summary;

    this.updateDashboardUI();

    // Optionally post to Laravel API route
    this.syncWithLaravelApi(data);
  }

  async syncWithLaravelApi(data) {
    try {
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      const token = csrfMeta ? csrfMeta.getAttribute('content') : '';

      await fetch('/api/emergency/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      // Offline/Local graceful fallback
    }
  }

  updateDashboardUI() {
    const elType = document.getElementById('metricType');
    if (elType) {
      elType.textContent = this.emergencyState.type;
      this.highlightCard('cardType');
    }

    const elUrgency = document.getElementById('metricUrgencyBanner');
    if (elUrgency) {
      elUrgency.textContent = `TRIAGE LEVEL: ${this.emergencyState.urgency}`;
      elUrgency.className = `p-2 text-center rounded-3 fw-bold mb-3 ${
        this.emergencyState.urgency === 'CRITICAL' ? 'urgency-badge-critical' :
        this.emergencyState.urgency === 'HIGH' ? 'urgency-badge-high' : 'urgency-badge-moderate'
      }`;
    }

    const elPeople = document.getElementById('metricPeople');
    if (elPeople) elPeople.textContent = this.emergencyState.peopleAffected;

    const elConscious = document.getElementById('metricConscious');
    if (elConscious) {
      elConscious.textContent = this.emergencyState.conscious;
      if (String(this.emergencyState.conscious).toLowerCase().includes('unconscious')) {
        elConscious.className = 'metric-value text-danger';
      }
    }

    const elBreathing = document.getElementById('metricBreathing');
    if (elBreathing) {
      elBreathing.textContent = this.emergencyState.breathing;
      if (String(this.emergencyState.breathing).toLowerCase().includes('agonal') || String(this.emergencyState.breathing).toLowerCase().includes('not')) {
        elBreathing.className = 'metric-value text-danger';
      }
    }

    const elHazards = document.getElementById('metricHazards');
    if (elHazards) elHazards.textContent = this.emergencyState.hazards;

    const elSummary = document.getElementById('responderSummaryContent');
    if (elSummary) elSummary.textContent = this.emergencyState.summary;
  }

  highlightCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.classList.add('updated');
    setTimeout(() => card.classList.remove('updated'), 1200);
  }

  async triggerSos() {
    this.emergencyState.sosDispatched = true;
    window.EchoAidAudio.playSosAlert();

    const sosBtn = document.getElementById('btnTriggerSos');
    if (sosBtn) {
      sosBtn.innerHTML = '<i class="bi bi-broadcast me-2"></i> SOS BROADCASTED';
      sosBtn.classList.add('disabled');
    }

    this.updateDispatchStep(2);

    try {
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      const token = csrfMeta ? csrfMeta.getAttribute('content') : '';

      fetch('/api/emergency/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          sessionId: this.emergencyState.sessionId,
          urgency: this.emergencyState.urgency,
          summary: this.emergencyState.summary
        })
      });
    } catch(e) {}

    setTimeout(() => {
      if (window.EchoAidResponder) {
        window.EchoAidResponder.triggerIncomingAlert({
          emergency_type: this.emergencyState.type,
          urgency: this.emergencyState.urgency,
          summary: this.emergencyState.summary,
          locationText: this.emergencyState.location.address
        });
      }
    }, 1200);
  }

  onResponderAccepted(responderInfo) {
    this.emergencyState.responder = responderInfo;
    this.updateDispatchStep(3);

    const acceptedBanner = document.getElementById('callerAcceptedAlert');
    if (acceptedBanner) {
      acceptedBanner.classList.remove('d-none');
      acceptedBanner.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <i class="bi bi-shield-check-fill fs-4 text-success me-2"></i>
            <strong>Responder Assigned:</strong> ${responderInfo.responderName}
            <div class="small text-muted mt-1">Carrying: ${responderInfo.equipment.join(', ')}</div>
          </div>
          <span class="badge bg-success fs-6">ETA: ${responderInfo.etaMinutes} mins</span>
        </div>
      `;
    }

    this.addTranscript('agent', `Good news! Nearby verified responder ${responderInfo.responderName} has accepted your emergency request and is en route. ETA: ${responderInfo.etaMinutes} minutes.`);
    window.EchoAidAudio.speakText(`Responder ${responderInfo.responderName} has accepted and is en route. Stay where you are.`);
  }

  updateDispatchStep(stepNum) {
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`stepNode${i}`);
      if (!stepEl) continue;
      if (i < stepNum) {
        stepEl.className = 'dispatch-step completed';
        stepEl.innerHTML = '<i class="bi bi-check"></i>';
      } else if (i === stepNum) {
        stepEl.className = 'dispatch-step active';
      } else {
        stepEl.className = 'dispatch-step';
      }
    }
  }

  async runScriptedScenario(scenarioKey) {
    const scenario = window.EchoAidScenarios[scenarioKey];
    if (!scenario) return;

    const box = document.getElementById('transcriptBox');
    if (box) box.innerHTML = '';
    
    this.sessionActive = true;
    window.EchoAidAudio.init();

    for (const step of scenario.steps) {
      await new Promise(r => setTimeout(r, step.delayMs));
      this.waveIntensity = step.visualizerIntensity || 0.5;
      this.addTranscript(step.speaker, step.text);

      if (step.speakAudio) {
        window.EchoAidAudio.speakText(step.text);
      }

      if (step.stateUpdate) {
        this.updateStructuredState(step.stateUpdate);
        window.EchoAidAudio.playBeep(520, 'sine', 0.1);
      }

      if (step.enableSosPrompt) {
        const btn = document.getElementById('btnTriggerSos');
        if (btn) btn.classList.add('border-red-glow');
      }
    }
  }

  exposeTeammateHooks() {
    window.EchoAid = {
      updateStructuredState: (fields) => this.updateStructuredState(fields),
      addTranscriptTurn: (speaker, text) => this.addTranscript(speaker, text),
      onResponderAccepted: (info) => this.onResponderAccepted(info),
      setAudioIntensity: (val) => { this.waveIntensity = Math.min(1.0, Math.max(0.1, val)); },
      drawResponderRoute: () => this.drawResponderRoute()
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.echoAidApp = new EchoAidApp();
});
