'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, AlertTriangle, CheckCircle, LogOut, User, Mic, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SOSModal } from '@/components/sos-modal'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut } from '@/app/auth/actions'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isSOSActive, setIsSOSActive] = useState(false)
  const [showSOSModal, setShowSOSModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Demo user name if not logged in
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'

  const handleSOS = async () => {
    setIsLoading(true)
    
    // Simulate sending alert
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSOSActive(true)
    setShowSOSModal(true)
    setIsLoading(false)
    toast.error('Emergency Alert Activated!', {
      description: 'Your emergency contacts have been notified.',
    })
  }

  const handleCloseModal = () => {
    setShowSOSModal(false)
  }

  const handleDeactivateSOS = () => {
    setIsSOSActive(false)
    setShowSOSModal(false)
    toast.success('Alert Deactivated', {
      description: 'Your status has been set to safe.',
    })
  }

  const handleLogout = async () => {
    toast.success('Logging out...')
    await signOut()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SheShield AI</h1>
            <p className="text-sm text-muted-foreground">Your Safety Companion</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="rounded-xl hover:bg-white/50"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* User greeting */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-semibold text-foreground">{userName}</p>
          </div>
        </div>
      </div>

      {/* Safety Status */}
      <div className={`glass rounded-2xl p-6 mb-8 transition-all duration-500 ${
        isSOSActive 
          ? 'bg-red-50/80 border-red-200' 
          : 'bg-green-50/80 border-green-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-full ${
            isSOSActive 
              ? 'bg-red-100 animate-pulse' 
              : 'bg-green-100'
          }`}>
            {isSOSActive ? (
              <AlertTriangle className="w-7 h-7 text-red-600" />
            ) : (
              <CheckCircle className="w-7 h-7 text-green-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Status</p>
            <p className={`text-xl font-bold ${
              isSOSActive ? 'text-red-700' : 'text-green-700'
            }`}>
              {isSOSActive ? 'Alert Active' : 'You are Safe'}
            </p>
          </div>
        </div>
        {isSOSActive && (
          <Button
            variant="outline"
            className="w-full mt-4 h-10 rounded-xl border-red-300 text-red-700 hover:bg-red-100"
            onClick={handleDeactivateSOS}
          >
            Deactivate Alert
          </Button>
        )}
      </div>

      {/* SOS Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleSOS}
          disabled={isLoading}
          className="relative group"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-red-600 opacity-30 blur-xl group-hover:opacity-50 transition-opacity animate-pulse-ring" />
          
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-red-400 to-red-600 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
          
          {/* Button */}
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl shadow-red-500/50 flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <div className="text-center text-white">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm font-medium">Sending...</span>
                </div>
              ) : (
                <>
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-2xl font-bold block">SOS</span>
                  <span className="text-xs opacity-80">Tap for Help</span>
                </>
              )}
            </div>
          </div>
        </button>
        
        <p className="mt-6 text-sm text-muted-foreground text-center max-w-xs">
          Press the SOS button to instantly alert your emergency contacts and share your location
        </p>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/dashboard/voice')}
          className="glass rounded-2xl p-4 text-left hover:bg-white/80 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
            <Mic className="w-5 h-5 text-purple-600" />
          </div>
          <p className="font-semibold text-foreground">Voice Detection</p>
          <p className="text-xs text-muted-foreground">Auto-detect distress</p>
        </button>
        
        <button 
          onClick={() => router.push('/dashboard/map')}
          className="glass rounded-2xl p-4 text-left hover:bg-white/80 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-semibold text-foreground">Safe Routes</p>
          <p className="text-xs text-muted-foreground">AI-powered navigation</p>
        </button>
        
        <button 
          onClick={() => router.push('/dashboard/chat')}
          className="glass rounded-2xl p-4 text-left hover:bg-white/80 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-pink-600" />
          </div>
          <p className="font-semibold text-foreground">AI Chat</p>
          <p className="text-xs text-muted-foreground">Get safety advice</p>
        </button>
        
        <button 
          onClick={handleSOS}
          disabled={isLoading}
          className="glass rounded-2xl p-4 text-left hover:bg-red-50 transition-all active:scale-95 border-red-200"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <p className="font-semibold text-foreground">Quick SOS</p>
          <p className="text-xs text-muted-foreground">Emergency alert</p>
        </button>
      </div>

      {/* SOS Modal */}
      <SOSModal isOpen={showSOSModal} onClose={handleCloseModal} />
    </div>
  )
}
