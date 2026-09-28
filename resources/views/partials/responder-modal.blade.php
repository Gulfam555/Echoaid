<div class="modal fade" id="responderAlertModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content card-glass border-red-glow text-white" style="background:#0b1120;">
      <div class="modal-header border-danger">
        <h5 class="modal-title text-danger fw-bold">
          <i class="bi bi-exclamation-octagon-fill me-2"></i> URGENT SOS ALERT NEARBY
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="mb-2">A verified caller just activated EchoAid nearby:</p>
        <div class="p-3 bg-dark rounded border border-danger border-opacity-50 mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="badge bg-danger">CRITICAL TRIAGE</span>
            <span class="text-warning font-mono">Distance: 0.35 mi (2 mins)</span>
          </div>
          <div class="fw-bold fs-6 mt-2">1 Victim Unconscious with Agonal Breathing</div>
          <div class="small text-muted mt-1">Central Park Perimeter near 5th Ave</div>
        </div>
        <p class="small text-muted">You are within the immediate responder perimeter. Can you respond with AED equipment?</p>
      </div>
      <div class="modal-footer border-secondary">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cannot Respond</button>
        <button type="button" class="btn btn-success fw-bold px-4" onclick="window.EchoAidResponder.acceptEmergency()">
          <i class="bi bi-check-circle-fill me-1"></i> Accept & Respond
        </button>
      </div>
    </div>
  </div>
</div>
