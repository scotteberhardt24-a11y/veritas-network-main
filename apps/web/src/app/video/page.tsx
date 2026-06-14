'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface VideoSession {
  session_id: string;
  initiator_id: string;
  initiator_name: string;
  participant_id: string;
  participant_name: string;
  status: 'pending' | 'active' | 'ended';
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  recording_url?: string;
  transcript?: string;
  ai_summary?: string;
  notes?: string;
}

interface TranscriptLine {
  timestamp: string;
  speaker: string;
  text: string;
  confidence: number;
}

export default function VideoConferencePage() {
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [duration, setDuration] = useState(0);

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  // Timer for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && activeSession.status === 'active') {
      interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  async function loadSessions() {
    try {
      const token = localStorage.getItem('veritas_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/video-sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load sessions');

      const data = await res.json();
      setSessions(data.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function initializeWebRTC() {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      mediaStreamRef.current = stream;

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: ['stun:stun.l.google.com:19302'] },
          { urls: ['stun:stun1.l.google.com:19302'] },
        ],
      });

      // Add stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = peerConnection;

      // Start recording and transcription
      startRecording(stream);
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
    }
  }

  async function startRecording(stream: MediaStream) {
    try {
      setIsRecording(true);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        // Upload recording
        await uploadRecording(blob);
      };

      // Setup Web Audio API for transcription
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);

      // Start transcription
      startTranscription(stream);

      mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }

  async function startTranscription(stream: MediaStream) {
    // Using Web Speech API for live transcription
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      let interimTranscript = '';
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          isFinal = true;
          addTranscriptLine(transcript, event.results[i][0].confidence);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Transcription error:', event.error);
    };

    recognition.start();
  }

  function addTranscriptLine(text: string, confidence: number) {
    const newLine: TranscriptLine = {
      timestamp: new Date().toISOString(),
      speaker: 'You', // Would be determined by speaker diarization in production
      text,
      confidence,
    };

    setTranscript((prev) => [...prev, newLine]);
  }

  async function uploadRecording(blob: Blob) {
    try {
      const token = localStorage.getItem('veritas_token');
      const formData = new FormData();
      formData.append('video', blob);
      formData.append('session_id', activeSession!.session_id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/video-sessions/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Get AI summary
        const summaryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/video-sessions/${activeSession!.session_id}/summarize`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcript.map((t) => t.text).join(' ') }),
          }
        );

        if (summaryRes.ok) {
          const summary = await summaryRes.json();
          setActiveSession((prev) =>
            prev
              ? {
                  ...prev,
                  recording_url: data.recording_url,
                  ai_summary: summary.summary,
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error('Failed to upload recording:', error);
    }
  }

  async function endSession() {
    try {
      // Stop media tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      setIsRecording(false);

      // Update session status
      const token = localStorage.getItem('veritas_token');
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/video-sessions/${activeSession!.session_id}/end`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            duration_minutes: Math.floor(duration / 60),
            transcript: transcript,
          }),
        }
      );

      setActiveSession(null);
      setDuration(0);
      setTranscript([]);
      loadSessions();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading video sessions..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              📹 Video Conferencing
            </h1>
            <p className="text-gray-400">
              Real-time calls with AI transcription and recording
            </p>
          </div>

          {activeSession && activeSession.status === 'active' ? (
            // Active Session View
            <div className="space-y-4">
              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Controls */}
              <Card variant="default">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-2xl font-black text-cyan-400">
                      {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={endSession}
                  >
                    End Call
                  </Button>
                </div>
              </Card>

              {/* Live Transcript */}
              {transcript.length > 0 && (
                <Card variant="default" className="max-h-48 overflow-y-auto">
                  <h3 className="font-bold mb-3">📝 Live Transcript</h3>
                  <div className="space-y-2">
                    {transcript.map((line, i) => (
                      <div key={i} className="text-sm">
                        <p className="text-cyan-400 font-bold">
                          {line.speaker}
                        </p>
                        <p className="text-gray-300">{line.text}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(line.confidence * 100)}% confidence
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            // Sessions List
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <Card variant="default" className="text-center py-12">
                  <p className="text-3xl mb-2">📹</p>
                  <p className="font-bold">No video sessions</p>
                </Card>
              ) : (
                sessions.map((session) => (
                  <Card key={session.session_id} variant="default">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">
                          {session.status === 'pending'
                            ? `Call from ${session.initiator_name}`
                            : `Call with ${session.participant_name}`}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {session.status === 'active'
                            ? 'In Progress'
                            : session.status === 'pending'
                            ? 'Incoming'
                            : `Duration: ${session.duration_minutes} minutes`}
                        </p>
                      </div>

                      {session.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setActiveSession(session);
                              initializeWebRTC();
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {session.status === 'ended' && session.recording_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(session.recording_url, '_blank')
                          }
                        >
                          📥 View Recording
                        </Button>
                      )}
                    </div>

                    {session.status === 'ended' && session.ai_summary && (
                      <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 mt-3">
                        <p className="text-xs text-gray-400 mb-1">AI Summary</p>
                        <p className="text-sm text-gray-300 line-clamp-3">
                          {session.ai_summary}
                        </p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
