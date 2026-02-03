'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, AVATARS, getAvatarUrl } from '@/lib/auth-context'
import { Check, Sparkles, AtSign, ArrowRight } from 'lucide-react'

export default function SetupPage() {
  const [step, setStep] = useState<'avatar' | 'username'>('avatar')
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const { setupProfile, userProfile, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirecionar se não autenticado ou se já configurou perfil
  if (typeof window !== 'undefined') {
    if (!isAuthenticated) {
      router.push('/login')
      return null
    }
    if (userProfile?.isProfileSetup) {
      router.push('/')
      return null
    }
  }

  const validateUsername = (value: string): boolean => {
    const cleanUsername = value.replace('@', '')

    if (cleanUsername.length < 3) {
      setUsernameError('O @ deve ter pelo menos 3 caracteres')
      return false
    }
    if (cleanUsername.length > 20) {
      setUsernameError('O @ deve ter no máximo 20 caracteres')
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setUsernameError('Use apenas letras, números e _')
      return false
    }
    setUsernameError('')
    return true
  }

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId)
  }

  const handleContinue = () => {
    if (step === 'avatar' && selectedAvatar) {
      setStep('username')
    } else if (step === 'username' && validateUsername(username)) {
      setupProfile(username, selectedAvatar)
      router.push('/')
    }
  }

  const selectedAvatarData = AVATARS.find(a => a.id === selectedAvatar)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#1F7A8C] flex items-center justify-center p-3 sm:p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[#1F7A8C]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-[#4CAF50]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1F7A8C] to-[#4CAF50] rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-2xl shadow-[#1F7A8C]/30">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white mb-1 sm:mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Bem-vindo ao ContaComigo!
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base px-4">
            {step === 'avatar'
              ? 'Escolha seu personagem para a jornada'
              : 'Agora escolha seu @ na plataforma'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-8">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${step === 'avatar' ? 'bg-[#4CAF50] scale-125' : 'bg-[#4CAF50]'}`}></div>
          <div className={`w-6 sm:w-8 h-0.5 ${step === 'username' ? 'bg-[#4CAF50]' : 'bg-white/20'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${step === 'username' ? 'bg-[#4CAF50] scale-125' : 'bg-white/20'}`}></div>
        </div>

        {/* Card principal */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-2xl border border-white/10 mx-1 sm:mx-0">

          {/* Step 1: Escolha de Avatar */}
          {step === 'avatar' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-xl font-bold text-white text-center">
                Qual personagem te representa?
              </h2>

              {/* Grid de Avatares - Responsivo */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`relative group flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-[#1F7A8C]/30 ring-2 ring-[#4CAF50] scale-105'
                        : 'bg-white/5 hover:bg-white/10 active:scale-95 sm:hover:scale-105'
                    }`}
                  >
                    {/* Avatar image */}
                    <div className="relative">
                      <img
                        src={getAvatarUrl(avatar.id)}
                        alt={avatar.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-white/10"
                      />
                      {/* Check mark quando selecionado */}
                      {selectedAvatar === avatar.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg">
                          <Check size={12} className="text-white sm:hidden" strokeWidth={3} />
                          <Check size={14} className="text-white hidden sm:block" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    {/* Nome do avatar */}
                    <span className={`text-[10px] sm:text-xs font-medium truncate max-w-full ${
                      selectedAvatar === avatar.id ? 'text-white' : 'text-[#94A3B8]'
                    }`}>
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Preview do avatar selecionado */}
              {selectedAvatar && (
                <div className="flex items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
                  <img
                    src={getAvatarUrl(selectedAvatar)}
                    alt="Avatar selecionado"
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 shadow-xl"
                  />
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{selectedAvatarData?.name}</p>
                    <p className="text-[#4CAF50] text-xs sm:text-sm">Personagem selecionado</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Escolha de Username */}
          {step === 'username' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                <img
                  src={getAvatarUrl(selectedAvatar)}
                  alt="Seu avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 shadow-xl"
                />
              </div>

              <h2 className="text-base sm:text-xl font-bold text-white text-center">
                Como você quer ser chamado?
              </h2>

              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                  Seu @ na plataforma
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.replace('@', '')
                      setUsername(value)
                      if (value) validateUsername(value)
                    }}
                    placeholder="seunome"
                    maxLength={20}
                    className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-white placeholder-[#94A3B8]/50 focus:ring-2 focus:ring-[#1F7A8C] focus:border-transparent outline-none transition-all text-base sm:text-lg"
                  />
                </div>
                {usernameError && (
                  <p className="text-[#E63946] text-xs sm:text-sm">{usernameError}</p>
                )}
                <p className="text-[#94A3B8] text-[10px] sm:text-xs">
                  Este será seu identificador único na comunidade
                </p>
              </div>

              {/* Preview */}
              {username && !usernameError && (
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <img
                    src={getAvatarUrl(selectedAvatar)}
                    alt="Preview"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10"
                  />
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">@{username}</p>
                    <p className="text-[#94A3B8] text-xs sm:text-sm">Assim você aparecerá na comunidade</p>
                  </div>
                </div>
              )}

              {/* Botão voltar */}
              <button
                onClick={() => setStep('avatar')}
                className="text-[#94A3B8] text-xs sm:text-sm hover:text-white transition-colors"
              >
                ← Voltar e trocar avatar
              </button>
            </div>
          )}

          {/* Botão de continuar/finalizar */}
          <button
            onClick={handleContinue}
            disabled={step === 'avatar' ? !selectedAvatar : !username || !!usernameError}
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl shadow-[#1F7A8C]/30 hover:shadow-2xl hover:shadow-[#1F7A8C]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {step === 'avatar' ? (
              <>
                Continuar
                <ArrowRight size={18} className="sm:hidden" />
                <ArrowRight size={20} className="hidden sm:block" />
              </>
            ) : (
              <>
                Começar minha jornada
                <Sparkles size={18} className="sm:hidden" />
                <Sparkles size={20} className="hidden sm:block" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
