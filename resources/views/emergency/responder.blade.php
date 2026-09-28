@extends('layouts.app')

@section('title', 'EchoAid — Community Responder Network')

@section('content')
<script>
  window.ECHOAID_CURRENT_VIEW = 'responder';
</script>

<div class="container-fluid px-lg-4">
  <div class="row">
    <div class="col-12">
      @include('partials.responder-panel')
    </div>
  </div>
</div>
@endsection
