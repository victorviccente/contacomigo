'use client'

import { Target, CheckCircle2, Lock, Award, Trophy } from 'lucide-react'
import { Mission } from '@/lib/types'

interface MissionsViewProps {
  missions: Mission[]
  onCompleteMission: (id: string) => void
}

export default function MissionsView({ missions, onCompleteMission }: MissionsViewProps) {
  const pathMissions = missions.filter(m => m.type === 'path')

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in">
      {/* SaaS Style Header */}
      <div className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold">Trilha de Evolução</h1>
          <p className="text-gray-500 font-medium max-w-md">Complete os módulos para desbloquear novos patamares da sua liberdade financeira.</p>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Sua Liga</p>
            <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 shadow-inner min-w-[100px] lg:min-w-[120px]">
              <Trophy size={20} className="text-[#F4C430]" fill="currentColor" />
              <span className="text-xs lg:text-sm font-black text-[#0B1320]">BRONZE II</span>
            </div>
          </div>
          <div className="w-px h-12 lg:h-16 bg-gray-100"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Módulos</p>
            <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 shadow-inner min-w-[100px] lg:min-w-[120px]">
              <span className="text-xl lg:text-2xl font-black text-[#1F7A8C]">04</span>
              <span className="text-[10px] font-bold text-gray-400">RESTANTES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Path Layout adapted for desktop */}
      <div className="relative py-12 flex flex-col items-center overflow-x-hidden lg:overflow-visible">
        {/* Background Decorative Path Line */}
        <div className="absolute top-0 bottom-0 w-2 lg:w-3 bg-gray-100 left-1/2 -translate-x-1/2 rounded-full -z-10">
          <div className="w-full h-1/2 bg-gradient-to-b from-[#4CAF50] to-[#1F7A8C] rounded-full transition-all duration-1000"></div>
        </div>

        <div className="w-full space-y-16 lg:space-y-24">
          {pathMissions.map((mission, index) => {
            const isCompleted = mission.status === 'completed'
            const isLocked = mission.status === 'locked'
            const isCurrent = mission.status === 'available'

            const isLeft = index % 2 === 0

            return (
              <div key={mission.id} className={`flex items-center gap-4 lg:gap-12 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content Side */}
                <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-1 lg:space-y-2`}>
                   <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                     isCompleted ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                     isCurrent ? 'bg-[#1F7A8C]/10 text-[#1F7A8C]' : 'bg-gray-100 text-gray-400'
                   }`}>
                     Módulo {index + 1} • {mission.xp} XP
                   </div>
                   <h3 className="text-base lg:text-xl font-bold truncate">{mission.title}</h3>
                   <p className="text-gray-500 text-[10px] lg:text-sm max-w-[150px] lg:max-w-sm ml-auto mr-0 inline-block hidden sm:block">{mission.description}</p>
                </div>

                {/* Node Side */}
                <div className="relative shrink-0">
                  <div
                    onClick={() => isCurrent && onCompleteMission(mission.id)}
                    className={`w-20 h-20 lg:w-28 lg:h-28 rounded-[32px] lg:rounded-[40px] flex items-center justify-center shadow-xl border-b-[8px] lg:border-b-[10px] active:translate-y-1 active:border-b-0 transition-all cursor-pointer relative z-10 ${
                      isCompleted ? 'bg-[#4CAF50] border-[#388E3C] text-white' :
                      isCurrent ? 'bg-[#1F7A8C] border-[#14515d] text-white ring-4 lg:ring-8 ring-[#1F7A8C]/10' :
                      'bg-gray-200 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={32} /> : isLocked ? <Lock size={32} /> : <Target size={32} />}
                  </div>

                  {isCurrent && (
                    <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 bg-[#0B1320] text-white rounded-xl text-[10px] lg:text-xs font-bold shadow-2xl z-20 ${
                      isLeft ? 'left-24 lg:left-32' : 'right-24 lg:right-32'
                    }`}>
                      CONTINUAR AQUI
                      <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0B1320] rotate-45 ${
                        isLeft ? '-left-1' : '-right-1'
                      }`}></div>
                    </div>
                  )}
                </div>

                {/* Spacer Side */}
                <div className="flex-1"></div>
              </div>
            )
          })}

          {/* Bonus Final Section */}
          <div className="flex flex-col items-center pt-10 pb-8">
             <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-[#F4C430] to-[#D4A100] rounded-[36px] lg:rounded-[48px] border-b-[10px] lg:border-b-[12px] border-[#B8860B] flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-transform active:scale-95 group">
                <Award size={48} className="lg:w-16 lg:h-16 group-hover:rotate-12 transition-transform" />
             </div>
             <p className="mt-6 text-lg lg:text-xl font-black text-[#D4A100]">BAÚ LENDÁRIO</p>
             <p className="text-gray-400 text-[10px] lg:text-sm font-bold mt-1 tracking-widest uppercase">Prêmio Nível 15</p>
          </div>
        </div>
      </div>
    </div>
  )
}
