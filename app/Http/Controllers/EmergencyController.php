<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmergencyController extends Controller
{
    /**
     * Render the main Caller Emergency Dashboard view.
     */
    public function index()
    {
        return view('emergency.index');
    }

    /**
     * Render the Community Responder Interface view.
     */
    public function responder()
    {
        return view('emergency.responder');
    }

    /**
     * Render the Split-Screen side-by-side pitch view.
     */
    public function split()
    {
        return view('emergency.split');
    }

    /**
     * API Endpoint: Receive updated structured emergency state
     * Can be invoked by Member 1 (AssemblyAI Voice Agent) or Speech Extractor.
     */
    public function updateState(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'emergency_type' => 'nullable|string',
            'urgency' => 'nullable|string|in:LOW,MODERATE,HIGH,CRITICAL',
            'people_affected' => 'nullable',
            'conscious' => 'nullable|string',
            'breathing' => 'nullable|string',
            'hazards' => 'nullable|string',
            'summary' => 'nullable|string',
        ]);

        // In a full production system, session state would be stored in Cache/Database
        return response()->json([
            'status' => 'success',
            'message' => 'Emergency state updated successfully.',
            'state' => $validated
        ]);
    }

    /**
     * API Endpoint: Dispatch an SOS alert to nearby community responders.
     */
    public function triggerSos(Request $request): JsonResponse
    {
        $sessionId = $request->input('sessionId', 'ECHO-' . rand(100000, 999999));
        $urgency = $request->input('urgency', 'CRITICAL');
        $summary = $request->input('summary', 'Emergency broadcast triggered.');

        return response()->json([
            'status' => 'dispatched',
            'session_id' => $sessionId,
            'urgency' => $urgency,
            'responders_notified' => 4,
            'closest_eta_minutes' => 2,
            'message' => 'SOS broadcast transmitted to nearby verified responders.'
        ]);
    }
}
