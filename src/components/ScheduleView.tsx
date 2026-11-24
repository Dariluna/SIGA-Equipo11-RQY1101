import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, User } from 'lucide-react';
import { SCHEDULE_DAYS, SCHEDULE_TIME_SLOTS } from '../data/mockAcademicData';
import { AppView, Course, DayOfWeek, StudentProfile } from '../types/academic';

interface ScheduleViewProps {
  student: StudentProfile;
  enrolledCourses: Course[];
  onNavigate: (view: AppView) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  student,
  enrolledCourses,
  onNavigate,
}) => {
  const [selectedMobileDay, setSelectedMobileDay] = useState<DayOfWeek | 'Todos'>('Lunes');

  const getCellCourse = (day: DayOfWeek, slotStart: string) => {
    for (const course of enrolledCourses) {
      const matchingBlock = course.blocks.find(
        (b) => b.day === day && b.startTime === slotStart
      );
      if (matchingBlock) {
        return { course, block: matchingBlock };
      }
    }
    return null;
  };

  const totalWeeklyBlocks = enrolledCourses.reduce(
    (sum, c) => sum + c.blocks.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0284C7]">
            Horario Académico Oficial · Período {student.currentPeriod}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight">
            Mi Horario Semanal
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Grilla dinámica de Lunes a Sábado (08:30 a 20:00) actualizada automáticamente con tus inscripciones confirmadas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums">
            {enrolledCourses.length} ramos · {totalWeeklyBlocks} módulos semanales
          </span>
          <button
            type="button"
            onClick={() => onNavigate('enrollment')}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Inscribir ramos</span>
          </button>
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="mt-3 text-base font-bold text-slate-900">
            No tienes asignaturas confirmadas en tu horario
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Dirígete al módulo de inscripción para agregar y confirmar tus ramos del período {student.currentPeriod}.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('enrollment')}
            className="mt-4 min-h-[44px] px-4 py-2 rounded-xl bg-[#1B365D] text-white text-sm font-semibold cursor-pointer"
          >
            Ir a Inscripción de Asignaturas
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Day Filter Tabs (< 768px) */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {([...SCHEDULE_DAYS, 'Todos'] as const).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedMobileDay(day)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selectedMobileDay === day
                      ? 'bg-[#1B365D] text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {day === 'Todos' ? 'Ver todo' : day}
                </button>
              ))}
            </div>

            {selectedMobileDay !== 'Todos' && (
              <div className="space-y-2.5">
                {SCHEDULE_TIME_SLOTS.map((slot) => {
                  const match = getCellCourse(selectedMobileDay, slot.start);
                  return (
                    <div
                      key={slot.start}
                      className={`rounded-xl border p-3.5 ${
                        match
                          ? 'bg-white border-[#0284C7]/50'
                          : 'bg-slate-50/70 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {slot.label}
                        </span>
                        {match && (
                          <span className="font-bold text-[#1B365D]">{match.course.code}</span>
                        )}
                      </div>
                      {match ? (
                        <div className="mt-2">
                          <p className="text-sm font-bold text-slate-900">
                            {match.course.name}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                              {match.block.room}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {match.course.professor}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-slate-400">Bloque libre</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop & "Ver todo" Full Monday-Saturday Grid */}
          <div
            className={`${
              selectedMobileDay === 'Todos' ? 'block' : 'hidden md:block'
            } bg-white border border-slate-200 rounded-2xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table
                data-testid="schedule-grid"
                className="w-full min-w-[760px] border-collapse text-left"
              >
                <thead>
                  <tr className="bg-[#1B365D] text-white text-xs font-semibold">
                    <th className="py-3 px-3.5 w-32 border-r border-white/10">
                      Bloque Horario
                    </th>
                    {SCHEDULE_DAYS.map((day) => (
                      <th
                        key={day}
                        className="py-3 px-3 border-r border-white/10 last:border-r-0 text-center"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {SCHEDULE_TIME_SLOTS.map((slot) => (
                    <tr key={slot.start} className="align-top">
                      <td className="py-3.5 px-3.5 font-mono tabular-nums font-semibold text-slate-700 bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                        {slot.label}
                      </td>
                      {SCHEDULE_DAYS.map((day) => {
                        const match = getCellCourse(day, slot.start);
                        return (
                          <td
                            key={day}
                            className="p-2 border-r border-slate-200 last:border-r-0 min-w-[120px] h-24"
                          >
                            {match ? (
                              <div
                                data-testid={`schedule-cell-${match.course.code}-${day}`}
                                className="h-full rounded-lg bg-[#0284C7]/10 border border-[#0284C7]/35 p-2.5 flex flex-col justify-between"
                              >
                                <div>
                                  <p className="font-mono font-bold text-[11px] text-[#1B365D]">
                                    {match.course.code}
                                  </p>
                                  <p className="mt-0.5 font-semibold text-slate-900 leading-snug">
                                    {match.course.name}
                                  </p>
                                </div>
                                <div className="mt-2 pt-1.5 border-t border-[#0284C7]/20 text-[11px] text-slate-700 space-y-0.5">
                                  <p className="font-medium text-[#1B365D]">{match.block.room}</p>
                                  <p className="truncate text-slate-600">{match.course.professor}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-[11px] text-slate-300 select-none">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
