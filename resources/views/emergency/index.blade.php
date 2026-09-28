@extends('layouts.app')

@section('title', 'EchoAid — Caller Emergency Workspace')

@section('content')
<script>
  window.ECHOAID_CURRENT_VIEW = 'caller';
</script>

<div class="container-fluid px-lg-4">
  <div class="row g-3">
    <!-- Left Column: Voice Interaction Station -->
    <div class="col-lg-6 col-12">
      @include('partials.voice-station')
    </div>

    <!-- Right Column: Structured Emergency Dashboard -->
    <div class="col-lg-6 col-12">
      @include('partials.dashboard')
    </div>
  </div>
</div>
@endsection
