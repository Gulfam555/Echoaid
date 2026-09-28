@extends('layouts.app')

@section('title', 'EchoAid — Split-Screen Pitch View')

@section('content')
<script>
  window.ECHOAID_CURRENT_VIEW = 'split';
</script>

<div class="container-fluid px-lg-4">
  <div class="row g-3">
    <!-- Left Column: Caller Workspace (Voice + Dashboard combined) -->
    <div class="col-lg-7 col-12">
      <div class="row g-3">
        <div class="col-12 col-xl-6">
          @include('partials.voice-station')
        </div>
        <div class="col-12 col-xl-6">
          @include('partials.dashboard')
        </div>
      </div>
    </div>

    <!-- Right Column: Responder Interface Simulation -->
    <div class="col-lg-5 col-12">
      @include('partials.responder-panel')
    </div>
  </div>
</div>
@endsection
