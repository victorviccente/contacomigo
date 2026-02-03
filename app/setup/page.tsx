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
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#1F7A8C]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-[#4CAF50]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#F4C430]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-[700px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-2xl shadow-[#1F7A8C]/10 border border-white">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1F7A8C] to-[#186170] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1F7A8C]/20">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1320] tracking-tight mb-3">
            Bem-vindo ao ContaComigo!
          </h1>
          <p className="text-gray-500 font-medium px-4">
            {step === 'avatar'
              ? 'Escolha seu personagem para iniciar a jornada'
              : 'Agora escolha como você será conhecido na comunidade'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`h-2 transition-all duration-500 rounded-full ${step === 'avatar' ? 'w-12 bg-[#1F7A8C]' : 'w-4 bg-[#4CAF50]'}`}></div>
          <div className={`h-2 transition-all duration-500 rounded-full ${step === 'username' ? 'w-12 bg-[#1F7A8C]' : 'w-4 bg-gray-200'}`}></div>
        </div>

        {/* Main Selection Card */}
        <div className="bg-white rounded-[48px] p-6 sm:p-12 shadow-[0_32px_64px_-16px_rgba(31,122,140,0.12)] border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1F7A8C]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="relative z-10">
            {/* Step 1: Avatar Selection */}
            {step === 'avatar' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4">
                  {AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={`relative group flex flex-col items-center gap-3 p-3 rounded-3xl transition-all duration-300 ${isSelected
                            ? 'bg-[#1F7A8C] text-white shadow-xl shadow-[#1F7A8C]/30 -translate-y-1'
                            : 'bg-gray-50 hover:bg-gray-100/80 text-gray-500 hover:text-[#0B1320]'
                          }`}
                      >
                        <div className={`relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}>
                          <img
                            src={getAvatarUrl(avatar.id)}
                            alt={avatar.name}
                            className="w-full h-full object-cover bg-white"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              <div className="w-8 h-8 bg-white text-[#4CAF50] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                                <Check size={20} strokeWidth={4} />
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider truncate w-full text-center">
                          {avatar.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {selectedAvatar && (
                  <div className="flex items-center justify-center gap-6 p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <img
                      src={getAvatarUrl(selectedAvatar)}
                      alt="Selected"
                      className="w-20 h-20 rounded-2xl shadow-xl shadow-[#1F7A8C]/10 border-4 border-white"
                    />
                    <div className="space-y-1">
                      <p className="text-xl font-black text-[#0B1320]">{selectedAvatarData?.name}</p>
                      <p className="text-[#4CAF50] text-sm font-bold flex items-center gap-2">
                        <Check size={16} strokeWidth={3} />
                        Personagem pronto para aventura
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Username Selection */}
            {step === 'username' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={getAvatarUrl(selectedAvatar)}
                      alt="Selected"
                      className="w-24 h-24 rounded-3xl shadow-2xl shadow-[#1F7A8C]/20 border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4CAF50] text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                      Seu @ único
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1F7A8C] transition-colors">
                        <AtSign size={20} strokeWidth={2.5} />
                      </div>
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
                        autoFocus
                        className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#1F7A8C]/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-xl font-black text-[#0B1320] placeholder-gray-400 outline-none transition-all"
                      />
                    </div>
                    {usernameError ? (
                      <p className="text-[#E63946] text-xs font-bold pl-1">{usernameError}</p>
                    ) : (
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider pl-1">
                        Use letras, números e underline (_)
                      </p>
                    )}
                  </div>

                  {username && !usernameError && (
                    <div className="bg-[#1F7A8C]/5 rounded-2xl p-4 flex items-center gap-4 border border-[#1F7A8C]/10 animate-in zoom-in-95 duration-300">
                      <div className="w-10 h-10 bg-[#1F7A8C] text-white rounded-xl flex items-center justify-center font-bold">@</div>
                      <div>
                        <p className="text-sm font-black text-[#0B1320]">@{username}</p>
                        <p className="text-[10px] font-bold text-[#1F7A8C] uppercase">Disponível para cadastro</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep('avatar')}
                    className="w-full text-center text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-[#0B1320] transition-colors pt-2"
                  >
                    ← Trocar personagem
                  </button>
                </div>
              </div>
            )}

            {/* Persistent Navigation Button */}
            <button
              onClick={handleContinue}
              disabled={step === 'avatar' ? !selectedAvatar : !username || !!usernameError}
              className="w-full mt-10 bg-gradient-to-r from-[#1F7A8C] to-[#134D59] text-white py-4.5 rounded-[22px] font-black tracking-wide text-lg shadow-xl shadow-[#1F7A8C]/20 hover:shadow-2xl hover:shadow-[#1F7A8C]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {step === 'avatar' ? (
                <>
                  Continuar
                  <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Começar Jornada
                  <Sparkles size={22} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
