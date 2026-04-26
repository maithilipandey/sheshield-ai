'use client'

import { X, Phone, MapPin, Users, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SOSModalProps {
  isOpen: boolean
  onClose: () => void
}

const emergencyContacts = [
  { name: 'Mom', phone: '+1 (555) 123-4567', relation: 'Family' },
  { name: 'Best Friend', phone: '+1 (555) 987-6543', relation: 'Friend' },
  { name: 'Police', phone: '911', relation: 'Emergency' },
]

export function SOSModal({ isOpen, onClose }: SOSModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with alert */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Emergency Alert Sent</h2>
          <p className="text-sm text-white/80 mt-1">Help is on the way</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location shared */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">Location Shared</p>
              <p className="text-sm text-green-700">GPS coordinates sent to contacts</p>
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Notified Contacts</span>
            </div>
            <div className="flex flex-col gap-2">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium">Notified</span>
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button 
              variant="destructive"
              className="h-12 rounded-xl font-semibold"
              onClick={() => window.open('tel:911')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 911 Now
            </Button>
            <Button 
              variant="outline"
              className="h-12 rounded-xl font-semibold border-gray-200"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Close Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
