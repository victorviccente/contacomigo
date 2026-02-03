'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(email, password)

    if (success) {
      router.push('/')
    } else {
      setError('Email ou senha incorretos')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#1F7A8C] flex items-center justify-center p-3 sm:p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[#1F7A8C]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[#4CAF50]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1F7A8C] to-[#4CAF50] rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-[#1F7A8C]/30">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ContaComigo
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm px-4">
            Transforme suas finanças em uma jornada de evolução
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[32px] p-5 sm:p-8 shadow-2xl border border-white/10 mx-1 sm:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Campo Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-white placeholder-[#94A3B8]/50 focus:ring-2 focus:ring-[#1F7A8C] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-12 py-3 sm:py-4 text-white placeholder-[#94A3B8]/50 focus:ring-2 focus:ring-[#1F7A8C] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-[#E63946]/20 border border-[#E63946]/30 rounded-xl p-2.5 sm:p-3 text-center">
                <p className="text-[#E63946] text-xs sm:text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl shadow-[#1F7A8C]/30 hover:shadow-2xl hover:shadow-[#1F7A8C]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Dica de credenciais */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10">
            <p className="text-[#94A3B8] text-[10px] sm:text-xs text-center mb-2">Credenciais de demonstração:</p>
            <div className="bg-white/5 rounded-xl p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
              <p className="text-white/80 text-xs sm:text-sm font-mono text-center break-all">
                usuario@contacomigo.com
              </p>
              <p className="text-white/80 text-xs sm:text-sm font-mono text-center">
                123456
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[#94A3B8]/60 text-[10px] sm:text-xs text-center mt-4 sm:mt-6 px-4">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  )
}
