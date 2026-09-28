<div class="card-glass responder-panel p-4 h-100">
  
  <!-- Responder Header -->
  <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
    <div class="d-flex align-items-center gap-3">
      <div class="bg-success text-white rounded-circle p-2 fs-4">
        <i class="bi bi-heart-pulse-fill"></i>
      </div>
      <div>
        <h5 class="mb-0 text-white fw-bold">EchoAid Community Responder App</h5>
        <span class="small text-muted">Volunteer ID: #EMT-4029 • Sarah Jenkins</span>
      </div>
    </div>
    <span id="responderStatusBadge" class="badge bg-secondary responder-badge-status">
      STANDBY
    </span>
  </div>

  <!-- Incoming Alert Notification Banner -->
  <div id="responderAlertBanner" class="card-glass border-red-glow p-3 mb-3 d-none">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge bg-danger fs-6 px-3 py-1">
        <i class="bi bi-bell-fill me-1"></i> CRITICAL SOS BROADCAST
      </span>
      <span id="respEtaVal" class="badge bg-dark text-warning font-mono fs-6">2 mins (0.35 mi)</span>
    </div>

    <div class="row g-2 my-2">
      <div class="col-8">
        <div class="text-muted small">Emergency Type:</div>
        <div id="respEmergencyType" class="fw-bold text-white fs-5">Medical: Unresponsive Collapse</div>
      </div>
      <div class="col-4 text-end">
        <div class="text-muted small">Urgency:</div>
        <span id="respUrgencyBadge" class="badge bg-danger">CRITICAL</span>
      </div>
    </div>

    <div class="bg-dark p-2 rounded-3 border border-secondary mb-3">
      <div class="small text-info fw-bold mb-1"><i class="bi bi-file-medical-fill me-1"></i> Triage Briefing:</div>
      <div id="respSummaryText" class="small text-light">1 individual collapsed suddenly. Unresponsive, agonal gasping observed. Immediate AED required.</div>
    </div>

    <div class="d-flex align-items-center gap-2 mb-3 text-muted small">
      <i class="bi bi-geo-alt-fill text-danger"></i>
      <span id="respLocationText">5th Ave & 59th St, Central Park Perimeter</span>
    </div>

    <!-- Responder Action Buttons -->
    <div class="d-flex gap-2">
      <button id="btnAcceptSos" class="btn btn-success flex-grow-1 py-2 fw-bold fs-6 shadow">
        <i class="bi bi-check-circle-fill me-2"></i> Accept Emergency & Navigate
      </button>
      <button id="btnDeclineSos" class="btn btn-outline-secondary px-3">
        Decline
      </button>
    </div>
  </div>

  <!-- Responder Equipment & Status -->
  <div class="row g-3">
    <div class="col-md-6 col-12">
      <div class="card-glass p-3 border-secondary h-100">
        <h6 class="text-info fw-bold mb-2"><i class="bi bi-backpack-fill me-1"></i> Registered Responder Gear</h6>
        <ul class="list-unstyled small mb-0 text-light">
          <li class="py-1"><i class="bi bi-check-circle-text text-success me-2"></i> Automated External Defibrillator (AED)</li>
          <li class="py-1"><i class="bi bi-check-circle-text text-success me-2"></i> Trauma First Aid / Bleeding Control Kit</li>
          <li class="py-1"><i class="bi bi-check-circle-text text-success me-2"></i> CPR Pocket Mask & Oxygen Seal</li>
        </ul>
      </div>
    </div>

    <div class="col-md-6 col-12">
      <div class="card-glass p-3 border-secondary h-100">
        <h6 class="text-warning fw-bold mb-2"><i class="bi bi-shield-check me-1"></i> Community Network Protocol</h6>
        <p class="small text-muted mb-0">
          EchoAid alerts CPR-certified and First Responder volunteers within a 0.5-mile radius. Responder acceptance automatically notifies the caller and locks route tracking.
        </p>
      </div>
    </div>
  </div>

</div>
