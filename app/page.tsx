import { Shield, ArrowRight, Mic, Map, MessageCircle, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Shield,
    title: 'SOS Alert',
    description: 'One-tap emergency alert to contacts with location sharing',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Mic,
    title: 'Voice Detection',
    description: 'AI-powered distress recognition for automatic alerts',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Map,
    title: 'Safe Routes',
    description: 'AI recommends the safest path to your destination',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: MessageCircle,
    title: 'AI Chat',
    description: 'Get safety advice and support anytime, anywhere',
    color: 'bg-pink-100 text-pink-600',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 py-12 max-w-md mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-xl shadow-pink-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 text-balance">
            SheShield AI
          </h1>
          <p className="text-muted-foreground text-balance">
            Your AI-powered safety companion. Stay protected, stay confident.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4 mb-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-4 flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            asChild
            className="h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-pink-500/25 active:scale-95 transition-transform"
          >
            <Link href="/dashboard">
              Try Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          <div className="flex gap-3">
            <Button 
              asChild
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-pink-200 hover:bg-pink-50 font-semibold active:scale-95 transition-transform"
            >
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-purple-200 hover:bg-purple-50 font-semibold active:scale-95 transition-transform"
            >
              <Link href="/auth/sign-up">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-pink-100">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-muted-foreground">
              Built with care for your safety
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
