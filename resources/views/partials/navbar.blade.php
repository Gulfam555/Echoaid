<nav class="navbar navbar-expand-lg navbar-custom sticky-top py-2">
  <div class="container-fluid px-lg-4">
    
    <!-- Brand -->
    <a class="navbar-brand d-flex align-items-center gap-2 text-decoration-none" href="{{ route('emergency.index') }}">
      <span class="badge brand-badge px-2 py-1 rounded-3 fs-5">
        <i class="bi bi-broadcast-pin"></i> EchoAid
      </span>
      <span class="tagline-pill d-none d-md-inline-block">From Chaos to Clarity</span>
    </a>

    <!-- View Mode Switcher -->
    <div class="d-none d-md-flex btn-group rounded-pill bg-dark p-1 border border-secondary" role="group">
      <a href="{{ route('emergency.index') }}" 
         class="btn btn-sm {{ request()->routeIs('emergency.index') ? 'btn-primary' : 'btn-outline-secondary text-white' }} rounded-pill px-3">
        <i class="bi bi-mic-fill me-1"></i> Caller View
      </a>
      <a href="{{ route('emergency.responder') }}" 
         class="btn btn-sm {{ request()->routeIs('emergency.responder') ? 'btn-primary' : 'btn-outline-secondary text-white' }} rounded-pill px-3">
        <i class="bi bi-shield-shaded me-1"></i> Responder View
      </a>
      <a href="{{ route('emergency.split') }}" 
         class="btn btn-sm {{ request()->routeIs('emergency.split') ? 'btn-primary' : 'btn-outline-secondary text-white' }} rounded-pill px-3">
        <i class="bi bi-layout-split me-1"></i> Split-Screen Demo
      </a>
    </div>

    <!-- Right: Geolocation & AssemblyAI Status -->
    <div class="d-flex align-items-center gap-2">
      <span class="badge bg-dark border border-secondary text-muted px-2 py-1 d-none d-sm-inline-flex align-items-center gap-1 font-mono">
        <i class="bi bi-geo-alt-fill text-danger"></i> <span id="metricLocation">GPS: 40.7648, -73.9734</span>
      </span>
      <span class="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2 py-1">
        <i class="bi bi-cpu me-1"></i> AssemblyAI Agent
      </span>
    </div>

  </div>
</nav>
