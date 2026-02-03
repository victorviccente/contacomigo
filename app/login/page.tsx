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
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#1F7A8C]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#4CAF50]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#F4C430]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[32px] mb-6 shadow-2xl shadow-[#1F7A8C]/10 border border-white relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F7A8C] to-[#186170] rounded-[32px] opacity-0 group-hover:opacity-10 scale-95 group-hover:scale-100 transition-all duration-500"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#1F7A8C] to-[#186170] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#1F7A8C]/20 transition-transform duration-500 group-hover:rotate-12">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-[#0B1320] tracking-tight mb-3">
            ContaComigo
          </h1>
          <p className="text-gray-500 font-medium px-6 leading-relaxed">
            Sua jornada para a <span className="text-[#1F7A8C] font-bold">liberdade financeira</span> começa aqui de forma gamificada.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[48px] p-8 sm:p-10 shadow-[0_32px_64px_-16px_rgba(31,122,140,0.12)] border border-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1F7A8C]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[#0B1320] mb-8 flex items-center gap-3">
              Entrar na conta
              <div className="h-1.5 w-1.5 bg-[#4CAF50] rounded-full animate-ping"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Email
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1F7A8C] transition-colors">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#1F7A8C]/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-[#0B1320] font-semibold placeholder-gray-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Senha
                  </label>
                  <button type="button" className="text-[10px] font-black text-[#1F7A8C] uppercase tracking-wider hover:underline transition-all">Sumiu?</button>
                </div>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1F7A8C] transition-colors">
                    <Lock size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#1F7A8C]/20 focus:bg-white rounded-2xl pl-12 pr-12 py-4 text-[#0B1320] font-semibold placeholder-gray-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F7A8C] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-[#E63946]/5 border border-[#E63946]/10 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-300">
                  <p className="text-[#E63946] text-sm font-bold text-center flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E63946] rounded-full animate-pulse"></span>
                    {error}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1F7A8C] to-[#134D59] text-white py-4.5 rounded-[22px] font-black tracking-wide text-lg shadow-xl shadow-[#1F7A8C]/20 hover:shadow-2xl hover:shadow-[#1F7A8C]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  'Entrar na Jornada'
                )}
              </button>
            </form>

            {/* Account Info Hint */}
            <div className="mt-10 pt-8 border-t border-gray-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Acesso Rápido</div>
              <div className="bg-gray-50/80 rounded-[28px] p-5 space-y-2 border border-white shadow-inner transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400">EMAIL</span>
                  <span className="text-xs font-bold text-[#0B1320] font-mono">usuario@contacomigo.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400">SENHA</span>
                  <span className="text-xs font-bold text-[#0B1320] font-mono">123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <p className="text-gray-400 font-bold text-[10px] text-center mt-10 tracking-widest uppercase opacity-40">
          ContaComigo &copy; 2026 • Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
