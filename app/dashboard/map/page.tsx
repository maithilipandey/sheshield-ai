'use client'

import { useState, useEffect } from 'react'
import { Map, Navigation, Shield, AlertTriangle, Clock, Footprints, MapPin, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Route {
  id: string
  name: string
  type: 'safe' | 'risky'
  duration: string
  distance: string
  safetyScore: number
  features: string[]
}

const routes: Route[] = [
  {
    id: 'a',
    name: 'Route A - Main Street',
    type: 'safe',
    duration: '12 min',
    distance: '0.8 km',
    safetyScore: 95,
    features: ['Well-lit', 'CCTV Coverage', 'Busy Area', 'Police Station Nearby'],
  },
  {
    id: 'b',
    name: 'Route B - Side Alley',
    type: 'risky',
    duration: '8 min',
    distance: '0.5 km',
    safetyScore: 35,
    features: ['Poorly Lit', 'Isolated', 'No CCTV'],
  },
]

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>('a')
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    // Try to get user location on mount
    if (navigator.geolocation) {
      setIsLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
        },
        () => {
          setIsLoadingLocation(false)
          // Use default location if permission denied
          setCurrentLocation({ lat: 40.7128, lng: -74.006 })
        }
      )
    }
  }, [])

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(routeId)
    const route = routes.find(r => r.id === routeId)
    if (route?.type === 'risky') {
      toast.warning('Risky Route Selected', {
        description: 'This route has a low safety score. Consider the safer alternative.',
      })
    } else {
      toast.success('Safe Route Selected', {
        description: 'AI recommends this route for your safety.',
      })
    }
  }

  const handleStartNavigation = () => {
    setIsNavigating(true)
    toast.success('Navigation Started', {
      description: 'Turn-by-turn directions are now active. Stay safe!',
    })
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    toast.info('Navigation Stopped')
  }

  const handleShareLocation = async () => {
    if (currentLocation) {
      const locationUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Current Location - SheShield AI',
            text: 'Here is my current location for safety.',
            url: locationUrl,
          })
          toast.success('Location shared successfully')
        } catch {
          // User cancelled sharing
        }
      } else {
        await navigator.clipboard.writeText(locationUrl)
        toast.success('Location copied to clipboard')
      }
    } else {
      toast.error('Location not available')
    }
  }

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Safe Routes</h1>
            <p className="text-sm text-muted-foreground">AI-powered navigation</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          onClick={handleShareLocation}
          disabled={!currentLocation}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Current Location Card */}
      {currentLocation && (
        <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Current Location</p>
            <p className="text-xs text-muted-foreground">
              {isLoadingLocation ? 'Getting location...' : 'GPS tracking active'}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      )}

      {/* Map Visualization */}
      <div className="glass rounded-2xl p-4 mb-6 overflow-hidden">
        <div className="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }} />
          
          {/* Start point */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">You</span>
          </div>

          {/* End point */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-purple-500 border-3 border-white shadow-lg flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">Destination</span>
          </div>

          {/* Route A - Safe (curved path through top) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 12 50 Q 30 20, 50 25 Q 70 30, 88 50"
              fill="none"
              stroke={selectedRoute === 'a' ? '#22c55e' : '#86efac'}
              strokeWidth={selectedRoute === 'a' ? '4' : '2'}
              strokeLinecap="round"
              strokeDasharray={selectedRoute === 'a' ? '0' : '4 2'}
              className="transition-all duration-300"
            />
            {selectedRoute === 'a' && isNavigating && (
              <circle r="3" fill="#22c55e">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href="#routeA" />
                </animateMotion>
              </circle>
            )}
            <path id="routeA" d="M 12 50 Q 30 20, 50 25 Q 70 30, 88 50" fill="none" />
          </svg>

          {/* Route B - Risky (curved path through bottom) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 12 50 Q 30 80, 50 75 Q 70 70, 88 50"
              fill="none"
              stroke={selectedRoute === 'b' ? '#ef4444' : '#fca5a5'}
              strokeWidth={selectedRoute === 'b' ? '4' : '2'}
              strokeLinecap="round"
              strokeDasharray={selectedRoute === 'b' ? '0' : '4 2'}
              className="transition-all duration-300"
            />
          </svg>

          {/* Route labels */}
          <button 
            onClick={() => handleSelectRoute('a')}
            className={`absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg transition-all active:scale-95 ${
              selectedRoute === 'a' ? 'bg-green-500 ring-2 ring-green-300' : 'bg-green-400 hover:bg-green-500'
            }`}
          >
            Route A - Safe
          </button>
          <button 
            onClick={() => handleSelectRoute('b')}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg transition-all active:scale-95 ${
              selectedRoute === 'b' ? 'bg-red-500 ring-2 ring-red-300' : 'bg-red-400 hover:bg-red-500'
            }`}
          >
            Route B - Risky
          </button>

          {/* AI Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium shadow-lg flex items-center gap-1">
            <Shield className="w-3 h-3" />
            AI Recommended
          </div>
        </div>
      </div>

      {/* Route Options */}
      <div className="flex flex-col gap-4 mb-6">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => handleSelectRoute(route.id)}
            className={`glass rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.98] ${
              selectedRoute === route.id 
                ? route.type === 'safe'
                  ? 'ring-2 ring-green-500 bg-green-50/50'
                  : 'ring-2 ring-red-500 bg-red-50/50'
                : 'hover:bg-white/80'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  route.type === 'safe' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {route.type === 'safe' ? (
                    <Shield className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{route.name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {route.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3 h-3" />
                      {route.distance}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                route.type === 'safe' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {route.safetyScore}%
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {route.features.map((feature, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded-lg text-xs ${
                    route.type === 'safe'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Start Navigation Button */}
      {!isNavigating ? (
        <Button 
          onClick={handleStartNavigation}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
        >
          <Navigation className="w-5 h-5 mr-2" />
          Start Navigation
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button 
            onClick={handleStopNavigation}
            variant="outline"
            className="flex-1 h-14 rounded-2xl font-semibold"
          >
            Stop
          </Button>
          <Button 
            onClick={handleShareLocation}
            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Location
          </Button>
        </div>
      )}

      {/* Safety Tips */}
      <div className="mt-6 glass rounded-2xl p-4">
        <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          Safety Tips
        </p>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Share your live location with trusted contacts
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Stay on well-lit, populated routes when possible
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Keep SOS readily accessible during your journey
          </li>
        </ul>
      </div>
    </div>
  )
}
