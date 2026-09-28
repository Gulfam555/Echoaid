<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  
  <title>@yield('title', 'EchoAid — From Chaos to Clarity | Voice Emergency AI')</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Bootstrap 5.3 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  
  <!-- EchoAid Custom CSS -->
  <link rel="stylesheet" href="{{ asset('css/echoaid.css') }}">
  
  @stack('styles')
</head>
<body>

  <!-- Top Navigation Partial -->
  @include('partials.navbar')

  <!-- Main Content Container -->
  <main class="py-3">
    @yield('content')
  </main>

  <!-- Presentation Scenarios Bottom Dock -->
  @include('partials.demo-bar')

  <!-- Responder Push Alert Modal -->
  @include('partials.responder-modal')

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  
  <!-- EchoAid Public Scripts -->
  <script src="{{ asset('js/scenarios.js') }}"></script>
  <script src="{{ asset('js/responder.js') }}"></script>
  <script src="{{ asset('js/echoaid-app.js') }}"></script>
  
  @stack('scripts')
</body>
</html>
