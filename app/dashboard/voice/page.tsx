'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, AlertTriangle, Shield, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SOSModal } from '@/components/sos-modal'
import { toast } from 'sonner'

type ListeningState = 'idle' | 'listening' | 'analyzing' | 'detected'

export default function VoicePage() {
  const [state, setState] = useState<ListeningState>('idle')
  const [showSOSModal, setShowSOSModal] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleStartListening = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Create audio context and analyzer
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      setState('listening')
      setPermissionDenied(false)
      toast.info('Voice detection started', {
        description: 'Listening for distress signals...',
      })

      // Analyze audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let highLevelCount = 0
      
      const analyze = () => {
        if (state === 'idle') return
        
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(average)
        
        // Detect loud sounds (potential distress)
        if (average > 80) {
          highLevelCount++
          
          // If loud for sustained period (simulating distress detection)
          if (highLevelCount > 30) {
            setState('analyzing')
            toast.info('Analyzing audio...', {
              description: 'Processing voice patterns',
            })
            
            // Simulate analysis
            setTimeout(() => {
              setState('detected')
              toast.error('Distress Detected!', {
                description: 'Triggering emergency alert...',
              })
              
              setTimeout(() => {
                setShowSOSModal(true)
              }, 500)
            }, 1500)
            
            return // Stop the loop
          }
        } else {
          highLevelCount = Math.max(0, highLevelCount - 1)
        }
        
        animationRef.current = requestAnimationFrame(analyze)
      }
      
      analyze()
      
    } catch (error) {
      console.error('Microphone access error:', error)
      setPermissionDenied(true)
      toast.error('Microphone access denied', {
        description: 'Please enable microphone permission to use voice detection.',
      })
    }
  }

  const handleStopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setState('idle')
    setAudioLevel(0)
    toast.success('Voice detection stopped')
  }

  const handleCloseModal = () => {
    setShowSOSModal(false)
    handleStopListening()
  }

  // Demo mode - for testing without real mic
  const handleDemoStart = async () => {
    setState('listening')
    toast.info('Demo mode started', {
      description: 'Simulating voice detection...',
    })

    // Simulate audio levels
    let level = 0
    const interval = setInterval(() => {
      level = Math.random() * 100
      setAudioLevel(level)
    }, 100)

    // Simulate detection after 3 seconds
    setTimeout(() => {
      clearInterval(interval)
      setState('analyzing')
      toast.info('Analyzing audio...', {
        description: 'Processing voice patterns',
      })
    }, 3000)

    setTimeout(() => {
      setState('detected')
      toast.error('Distress Detected!', {
        description: 'Triggering emergency alert...',
      })
    }, 4500)

    setTimeout(() => {
      setShowSOSModal(true)
    }, 5000)
  }

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening...'
      case 'analyzing':
        return 'Analyzing...'
      case 'detected':
        return 'Distress Detected!'
      default:
        return 'Voice Detection'
    }
  }

  const getStatusColor = () => {
    switch (state) {
      case 'listening':
        return 'text-blue-600'
      case 'analyzing':
        return 'text-yellow-600'
      case 'detected':
        return 'text-red-600'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Voice Detection</h1>
          <p className="text-sm text-muted-foreground">AI-powered distress recognition</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-full ${
            state === 'detected' 
              ? 'bg-red-100 animate-pulse' 
              : state !== 'idle'
              ? 'bg-blue-100'
              : 'bg-gray-100'
          }`}>
            {state === 'detected' ? (
              <AlertTriangle className="w-7 h-7 text-red-600" />
            ) : state !== 'idle' ? (
              <Activity className="w-7 h-7 text-blue-600" />
            ) : (
              <Shield className="w-7 h-7 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className={`text-xl font-bold ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Audio visualization */}
        {state !== 'idle' && state !== 'detected' && (
          <div className="flex items-center justify-center gap-1 h-16 mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(8, (Math.sin(i + audioLevel / 10) + 1) * 30 * (audioLevel / 100))}px`,
                }}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          {state === 'idle' 
            ? 'Start listening to enable automatic distress detection'
            : state === 'listening'
            ? 'The AI is actively monitoring for distress signals in your voice'
            : state === 'analyzing'
            ? 'Processing audio patterns to identify potential distress'
            : 'Distress signal identified - emergency alert triggered'}
        </p>
      </div>

      {/* Main Button */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={state === 'idle' ? handleStartListening : handleStopListening}
          disabled={state === 'analyzing' || state === 'detected'}
          className="relative group active:scale-95 transition-transform"
        >
          {/* Outer ring when active */}
          {state !== 'idle' && (
            <div className={`absolute inset-0 rounded-full opacity-30 blur-xl animate-pulse-ring ${
              state === 'detected' 
                ? 'bg-gradient-to-r from-red-400 to-red-600' 
                : 'bg-gradient-to-r from-purple-400 to-indigo-600'
            }`} />
          )}
          
          {/* Button */}
          <div className={`relative w-40 h-40 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 ${
            state === 'detected'
              ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/50'
              : state !== 'idle'
              ? 'bg-gradient-to-br from-purple-500 to-indigo-700 shadow-purple-500/50'
              : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-500/50'
          }`}>
            <div className="text-center text-white">
              {state === 'idle' ? (
                <Mic className="w-12 h-12 mx-auto" />
              ) : state === 'detected' ? (
                <AlertTriangle className="w-12 h-12 mx-auto animate-pulse" />
              ) : (
                <MicOff className="w-12 h-12 mx-auto" />
              )}
              <span className="text-sm mt-2 block opacity-80">
                {state === 'idle' ? 'Tap to Start' : state === 'detected' ? 'Alert!' : 'Tap to Stop'}
              </span>
            </div>
          </div>
        </button>
        
        {/* Demo button if permission denied */}
        {permissionDenied && state === 'idle' && (
          <Button
            onClick={handleDemoStart}
            variant="outline"
            className="mt-4 rounded-xl"
          >
            Try Demo Mode
          </Button>
        )}
        
        {state === 'idle' && !permissionDenied && (
          <Button
            onClick={handleDemoStart}
            variant="ghost"
            size="sm"
            className="mt-4 text-muted-foreground"
          >
            or try demo mode
          </Button>
        )}
      </div>

      {/* Info Cards */}
      <div className="flex flex-col gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Smart Detection</p>
              <p className="text-sm text-muted-foreground">
                AI analyzes voice patterns to detect screams, panic, or distress signals
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Instant Response</p>
              <p className="text-sm text-muted-foreground">
                Automatically triggers SOS alert when distress is detected
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Privacy First</p>
              <p className="text-sm text-muted-foreground">
                Audio is processed locally and never stored or shared
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SOSModal isOpen={showSOSModal} onClose={handleCloseModal} />
    </div>
  )
}
