<div class="card-glass p-3 h-100 d-flex flex-column">

  <!-- Dashboard Header -->
  <div class="d-flex justify-content-between align-items-center mb-2">
    <span class="fs-6 fw-bold text-white">
      <i class="bi bi-grid-1x2-fill text-danger me-1"></i> Structured Emergency State
    </span>
    <span class="badge bg-secondary font-mono" id="sessionIdBadge">SESSION #ECHO-8921</span>
  </div>

  <!-- Urgency Banner Meter -->
  <div id="metricUrgencyBanner" class="p-2 text-center rounded-3 fw-bold mb-3 urgency-badge-moderate">
    TRIAGE LEVEL: MODERATE (AWAITING SPEECH)
  </div>

  <!-- Triage Metrics Grid -->
  <div class="row g-2 mb-3">
    
    <!-- Emergency Type -->
    <div class="col-md-6 col-12">
      <div id="cardType" class="triage-metric-card">
        <div class="metric-title"><i class="bi bi-tag-fill text-info"></i> Emergency Type</div>
        <div id="metricType" class="metric-value text-truncate">Awaiting Voice Input...</div>
      </div>
    </div>

    <!-- People Affected -->
    <div class="col-md-6 col-12">
      <div id="cardPeople" class="triage-metric-card">
        <div class="metric-title"><i class="bi bi-people-fill text-warning"></i> People Affected</div>
        <div id="metricPeople" class="metric-value font-mono">Assessing...</div>
      </div>
    </div>

    <!-- Consciousness -->
    <div class="col-md-6 col-12">
      <div id="cardConscious" class="triage-metric-card">
        <div class="metric-title"><i class="bi bi-eye-fill text-primary"></i> Consciousness</div>
        <div id="metricConscious" class="metric-value">Assessing...</div>
      </div>
    </div>

    <!-- Breathing Status -->
    <div class="col-md-6 col-12">
      <div id="cardBreathing" class="triage-metric-card">
        <div class="metric-title"><i class="bi bi-lungs-fill text-danger"></i> Breathing Status</div>
        <div id="metricBreathing" class="metric-value">Assessing...</div>
      </div>
    </div>

    <!-- Immediate Hazards -->
    <div class="col-12">
      <div id="cardHazards" class="triage-metric-card">
        <div class="metric-title"><i class="bi bi-exclamation-triangle-fill text-warning"></i> Immediate Hazards / Environment</div>
        <div id="metricHazards" class="metric-value fs-6 fw-normal text-muted">None Reported</div>
      </div>
    </div>

  </div>

  <!-- Leaflet Map Card -->
  <div class="mb-3">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="small text-muted text-uppercase fw-semibold"><i class="bi bi-map-fill text-success me-1"></i> Emergency Geolocation</span>
      <span class="badge bg-dark text-success font-mono" style="font-size: 0.7rem;">Live Radar Active</span>
    </div>
    <div id="emergencyMap"></div>
  </div>

  <!-- Responder-Ready Summary Box -->
  <div class="card-glass p-3 mb-3 bg-dark border-secondary">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="small text-uppercase fw-bold text-info">
        <i class="bi bi-file-earmark-medical me-1"></i> Responder-Ready Summary
      </span>
      <button id="btnCopySummary" class="btn btn-xs btn-outline-info py-0 px-2" style="font-size: 0.75rem;">
        <i class="bi bi-clipboard"></i> Copy Summary
      </button>
    </div>
    <div id="responderSummaryContent" class="small text-light font-mono" style="line-height: 1.5;">
      Voice interaction in progress. Speak naturally to describe the emergency.
    </div>
  </div>

  <!-- Assigned Responder Alert Banner -->
  <div id="callerAcceptedAlert" class="alert alert-success d-none mb-3 border-success border-2 shadow"></div>

  <!-- SOS Action & Dispatch Stepper -->
  <div class="mt-auto">
    <button id="btnTriggerSos" class="btn btn-sos w-100 mb-3">
      <i class="bi bi-broadcast-pin me-2"></i> TRIGGER COMMUNITY SOS
    </button>

    <div class="dispatch-stepper px-3">
      <div id="stepNode1" class="dispatch-step active" title="Emergency Activated">1</div>
      <div id="stepNode2" class="dispatch-step" title="Nearby Responders Notified">2</div>
      <div id="stepNode3" class="dispatch-step" title="Responder Accepted">3</div>
      <div id="stepNode4" class="dispatch-step" title="En Route">4</div>
    </div>
    <div class="d-flex justify-content-between text-muted small px-1 font-mono" style="font-size: 0.7rem;">
      <span>Active</span>
      <span>Notified</span>
      <span>Accepted</span>
      <span>En Route</span>
    </div>
  </div>

</div>
