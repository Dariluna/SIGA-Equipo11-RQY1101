import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  FileCheck2,
  Home,
  LogOut,
} from 'lucide-react';
import { AppView, StudentProfile } from '../types/academic';
import { UpsurCrest } from './UpsurCrest';

interface HeaderNavProps {
  student: StudentProfile;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: AppView; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Inicio', shortLabel: 'Inicio', icon: Home },
  { id: 'enrollment', label: 'Inscripción', shortLabel: 'Inscribir', icon: BookOpen },
  { id: 'schedule', label: 'Mi Horario', shortLabel: 'Horario', icon: Calendar },
  { id: 'grades', label: 'Notas', shortLabel: 'Notas', icon: Award },
  { id: 'certificates', label: 'Certificados', shortLabel: 'Certificado', icon: FileCheck2 },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  student,
  activeView,
  onNavigate,
  onLogout,
}) => {
  return (
    <>
      {/* Top Institutional Bar */}
      <header className="no-print sticky top-0 z-30 bg-[#1B365D] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-lg cursor-pointer"
          >
            <UpsurCrest className="w-8 h-8 shrink-0" variant="light" />
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
              SIGA · UPSUR
            </span>
          </button>

          {/* Zone 2: Desktop concise navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    isActive
                      ? 'border-[#38BDF8] text-white font-semibold'
                      : 'border-transparent text-slate-200 hover:text-white hover:border-white/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Student identity + Logout */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <span className="hidden sm:inline text-xs lg:text-sm text-sky-100 font-medium truncate max-w-[230px] lg:max-w-none">
              {student.name} | {student.shortCareer}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Mobile student identity strip inside compact top header */}
        <div className="sm:hidden px-4 py-1 text-[11px] leading-tight text-sky-100 truncate border-t border-white/10">
          {student.name} | {student.shortCareer}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (< 768px) */}
      <nav
        aria-label="Navegación móvil"
        className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      >
        <div className="grid grid-cols-5 h-12">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors cursor-pointer ${
                  isActive ? 'text-[#0284C7] font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] leading-none whitespace-nowrap">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
