<div class="card-glass p-3 h-100 d-flex flex-column">
  
  <!-- Voice Station Header -->
  <div class="d-flex justify-content-between align-items-center mb-2">
    <div class="d-flex align-items-center gap-2">
      <span class="fs-6 fw-bold text-white"><i class="bi bi-soundwave text-info me-1"></i> Voice Interaction Station</span>
    </div>
    <div id="agentStatusPill" class="live-status-indicator status-ready">
      <span class="status-pulse-dot"></span> System Ready
    </div>
  </div>

  <!-- Canvas Audio Visualizer -->
  <div class="visualizer-container mb-3">
    <canvas id="audioCanvas"></canvas>
    <div class="visualizer-overlay-pill">
      <i class="bi bi-activity text-info me-1"></i> 16kHz Stream
    </div>
  </div>

  <!-- Voice Controls Bar -->
  <div class="d-flex gap-2 mb-3">
    <button id="btnToggleSession" class="btn btn-danger flex-grow-1 py-2 fw-bold shadow-sm">
      <i class="bi bi-mic-fill me-2"></i> Start Voice Emergency Session
    </button>
    <button id="btnMuteMic" class="btn btn-outline-secondary px-3" title="Mute/Unmute Mic">
      <i class="bi bi-mic-fill"></i>
    </button>
  </div>

  <!-- Live Transcript Feed -->
  <div class="d-flex justify-content-between align-items-center mb-1">
    <span class="small text-muted text-uppercase fw-semibold">
      <i class="bi bi-chat-left-dots text-danger me-1"></i> Emergency Speech Stream
    </span>
    <span class="badge bg-dark text-muted font-mono" style="font-size: 0.7rem;">Live AssemblyAI Context</span>
  </div>
  <div id="transcriptBox" class="transcript-box card-glass flex-grow-1">
    <div class="msg-bubble msg-agent">
      <div class="msg-meta">
        <strong><i class="bi bi-robot text-info me-1"></i> EchoAid Agent (Clarity)</strong>
        <span>System</span>
      </div>
      <div>Welcome to EchoAid. Press <strong>Start Voice Emergency</strong> or select a <strong>Demo Scenario</strong> below to begin. Speak naturally without worrying about structure.</div>
    </div>
  </div>

</div>
