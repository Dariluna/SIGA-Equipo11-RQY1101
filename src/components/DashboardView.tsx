import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import {
  AppView,
  Course,
  GradeRecord,
  StudentProfile,
} from '../types/academic';
import { formatScheduleBlocks } from '../utils/academicRules';

interface DashboardViewProps {
  student: StudentProfile;
  enrolledCourses: Course[];
  catalogCount: number;
  grades: GradeRecord[];
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  enrolledCourses,
  catalogCount,
  grades,
  onNavigate,
}) => {
  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);
  const currentAverage =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.average, 0) / grades.length).toFixed(1)
      : '—';

  const navCards: {
    view: AppView;
    title: string;
    description: string;
    meta: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      view: 'enrollment',
      title: 'Inscripción de Asignaturas',
      description: 'Revisa cupos disponibles, valida prerrequisitos y confirma tus ramos sin topes horarios.',
      meta: `${catalogCount} asignaturas en oferta`,
      icon: BookOpen,
    },
    {
      view: 'schedule',
      title: 'Mi Horario Semanal',
      description: 'Consulta la distribución horaria de lunes a sábado con salas y docentes asignados.',
      meta: `${enrolledCourses.length} ramos activos`,
      icon: Calendar,
    },
    {
      view: 'grades',
      title: 'Notas y Asistencia',
      description: 'Visualiza el resumen de calificaciones parciales, promedios ponderados y asistencia.',
      meta: `Promedio acumulado ${currentAverage}`,
      icon: Award,
    },
    {
      view: 'certificates',
      title: 'Certificados Digitales',
      description: 'Emite al instante tu Certificado de Alumno Regular con folio único y código QR.',
      meta: 'Firma Electrónica Avanzada',
      icon: FileCheck2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0284C7]">
            {student.faculty} · Período {student.currentPeriod}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight [text-wrap:balance]">
            Bienvenido, {student.name}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {student.career} · RUT <span className="font-mono tabular-nums">{student.rut}</span> · Cohorte {student.cohort}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('enrollment')}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]"
        >
          <span>Ir a Inscripción</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Quick Metrics Row */}
      <section aria-label="Métricas académicas rápidas" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Ramos inscritos activos</p>
          <p
            data-testid="metric-active-courses"
            className="mt-2 text-3xl font-bold text-[#1B365D] font-mono tabular-nums"
          >
            {enrolledCourses.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Período académico {student.currentPeriod}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Créditos totales</p>
          <p
            data-testid="metric-total-credits"
            className="mt-2 text-3xl font-bold text-[#1B365D] font-mono tabular-nums"
          >
            {totalCredits}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Carga académica registrada
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Estado Académico</p>
          <div className="mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <p
              data-testid="metric-academic-status"
              className="text-2xl font-bold text-slate-900"
            >
              {student.academicStatus}
            </p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Habilitado para inscripción y certificados
          </p>
        </div>
      </section>

      {/* 4 Direct Navigation Cards */}
      <section aria-label="Accesos directos del portal">
        <h2 className="text-lg font-bold text-[#1B365D] mb-4">
          Servicios Académicos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.view}
                type="button"
                onClick={() => onNavigate(card.view)}
                className="group text-left bg-white border border-slate-200 hover:border-[#0284C7] rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#1B365D]/8 text-[#1B365D] group-hover:bg-[#0284C7] group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#1B365D] group-hover:text-[#0284C7] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{card.meta}</span>
                  <ArrowRight className="w-4 h-4 text-[#0284C7] transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Enrolled Load Summary */}
      <section aria-label="Asignaturas inscritas vigentes">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="text-lg font-bold text-[#1B365D]">
            Carga Académica Inscrita
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="text-sm font-medium text-[#0284C7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ver grilla horaria completa
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-[#1B365D]">{course.code}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{course.credits} créditos</span>
                  <span aria-hidden="true">·</span>
                  <span>{course.professor}</span>
                </div>
                <p className="mt-0.5 text-sm sm:text-base font-semibold text-slate-900">
                  {course.name}
                </p>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums shrink-0">
                {formatScheduleBlocks(course.blocks)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
