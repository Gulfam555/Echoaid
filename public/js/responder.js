/**
 * EchoAid Laravel - Community Responder Engine
 */

window.EchoAidResponder = {
  state: {
    status: 'STANDBY',
    responderName: 'Sarah Jenkins (EMT-B / Community Volunteer)',
    distanceMiles: 0.35,
    etaMinutes: 2,
    equipment: ['Automated External Defibrillator (AED)', 'Trauma First Aid Kit', 'CPR Mask']
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const acceptBtn = document.getElementById('btnAcceptSos');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptEmergency());
    }

    const declineBtn = document.getElementById('btnDeclineSos');
    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineEmergency());
    }
  },

  triggerIncomingAlert(emergencyData) {
    this.state.status = 'INCOMING';
    window.EchoAidAudio.playSosAlert();

    const banner = document.getElementById('responderAlertBanner');
    const alertModal = document.getElementById('responderAlertModal');

    const typeEl = document.getElementById('respEmergencyType');
    const urgencyEl = document.getElementById('respUrgencyBadge');
    const summaryEl = document.getElementById('respSummaryText');
    const locEl = document.getElementById('respLocationText');
    const etaEl = document.getElementById('respEtaVal');

    if (typeEl) typeEl.textContent = emergencyData.emergency_type || 'Critical Emergency';
    if (urgencyEl) {
      urgencyEl.textContent = emergencyData.urgency || 'HIGH';
      urgencyEl.className = `badge ${emergencyData.urgency === 'CRITICAL' ? 'bg-danger' : 'bg-warning text-dark'}`;
    }
    if (summaryEl) summaryEl.textContent = emergencyData.summary || 'Immediate medical attention requested via EchoAid Voice Agent.';
    if (locEl) locEl.textContent = emergencyData.locationText || 'Central Park Perimeter (Lat: 40.7648, Lng: -73.9734)';
    if (etaEl) etaEl.textContent = `${this.state.etaMinutes} mins (${this.state.distanceMiles} mi)`;

    if (banner) banner.classList.remove('d-none');
    
    if (alertModal && typeof bootstrap !== 'undefined') {
      const modalInstance = new bootstrap.Modal(alertModal);
      modalInstance.show();
    }
  },

  acceptEmergency() {
    this.state.status = 'ACCEPTED';
    window.EchoAidAudio.playChime();

    const alertModalEl = document.getElementById('responderAlertModal');
    if (alertModalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(alertModalEl);
      if (modal) modal.hide();
    }

    const statusPill = document.getElementById('responderStatusBadge');
    if (statusPill) {
      statusPill.textContent = 'En Route • 2 Mins';
      statusPill.className = 'badge bg-success';
    }

    if (window.EchoAid && typeof window.EchoAid.onResponderAccepted === 'function') {
      window.EchoAid.onResponderAccepted({
        responderName: this.state.responderName,
        etaMinutes: this.state.etaMinutes,
        equipment: this.state.equipment
      });
    }

    if (window.EchoAid && window.EchoAid.drawResponderRoute) {
      window.EchoAid.drawResponderRoute();
    }
  },

  declineEmergency() {
    this.state.status = 'STANDBY';
    const alertModalEl = document.getElementById('responderAlertModal');
    if (alertModalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(alertModalEl);
      if (modal) modal.hide();
    }
  }
};
