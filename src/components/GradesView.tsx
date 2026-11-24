import React from 'react';
import { Award, CheckCircle2, Clock } from 'lucide-react';
import { Course, GradeRecord, StudentProfile } from '../types/academic';

interface GradesViewProps {
  student: StudentProfile;
  grades: GradeRecord[];
  enrolledCourses: Course[];
}

export const GradesView: React.FC<GradesViewProps> = ({
  student,
  grades,
  enrolledCourses,
}) => {
  const existingCodes = new Set(grades.map((g) => g.code));
  const newlyEnrolledRows: GradeRecord[] = enrolledCourses
    .filter((c) => !existingCodes.has(c.code))
    .map((c) => ({
      code: c.code,
      name: c.name,
      professor: c.professor,
      credits: c.credits,
      partialGrades: [],
      average: 0,
      attendancePercent: 100,
      status: 'En curso',
    }));

  const combinedRecords = [...newlyEnrolledRows, ...grades];
  const evaluatedRecords = combinedRecords.filter((r) => r.average > 0);
  const overallAvg =
    evaluatedRecords.length > 0
      ? (
          evaluatedRecords.reduce((acc, r) => acc + r.average, 0) /
          evaluatedRecords.length
        ).toFixed(1)
      : '—';
  const avgAttendance =
    combinedRecords.length > 0
      ? Math.round(
          combinedRecords.reduce((acc, r) => acc + r.attendancePercent, 0) /
            combinedRecords.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs sm:text-sm font-medium text-[#0284C7]">
          Registro Curricular · Escala 1.0 a 7.0
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight">
          Notas y Asistencia
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Resumen consolidado de rendimiento académico y porcentaje de asistencia de {student.name}.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Promedio General Acumulado</p>
          <p className="mt-2 text-3xl font-bold text-[#1B365D] font-mono tabular-nums">
            {overallAvg}
          </p>
          <p className="mt-1 text-xs text-slate-500">Sobre asignaturas evaluadas</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Asistencia Promedio</p>
          <p className="mt-2 text-3xl font-bold text-[#1B365D] font-mono tabular-nums">
            {avgAttendance}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Mínimo reglamentario: 75%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Asignaturas en Registro</p>
          <p className="mt-2 text-3xl font-bold text-[#1B365D] font-mono tabular-nums">
            {combinedRecords.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Vigentes e historial reciente</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <th className="py-3.5 px-4">Código</th>
              <th className="py-3.5 px-4">Asignatura</th>
              <th className="py-3.5 px-4">Evaluaciones Parciales</th>
              <th className="py-3.5 px-4 text-right">Promedio</th>
              <th className="py-3.5 px-4 text-right">Asistencia</th>
              <th className="py-3.5 px-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {combinedRecords.map((rec) => (
              <tr key={rec.code} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#1B365D]">
                  {rec.code}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-900">{rec.name}</p>
                  <p className="text-xs text-slate-500">{rec.professor}</p>
                </td>
                <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-slate-600">
                  {rec.partialGrades.length > 0
                    ? rec.partialGrades.map((n) => n.toFixed(1)).join(' · ')
                    : 'Sin evaluaciones aún'}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                  {rec.average > 0 ? rec.average.toFixed(1) : '—'}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                  {rec.attendancePercent}%
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      rec.status === 'Aprobado' ? 'text-emerald-700' : 'text-[#0284C7]'
                    }`}
                  >
                    {rec.status === 'Aprobado' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-3">
        {combinedRecords.map((rec) => (
          <div key={rec.code} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-[#1B365D]">{rec.code}</span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  rec.status === 'Aprobado' ? 'text-emerald-700' : 'text-[#0284C7]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                {rec.status}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">{rec.name}</p>
            <p className="text-xs text-slate-500">{rec.professor}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums">
              <span className="text-slate-600">
                Promedio:{' '}
                <strong className="text-slate-900">
                  {rec.average > 0 ? rec.average.toFixed(1) : '—'}
                </strong>
              </span>
              <span className="text-slate-600">
                Asistencia: <strong className="text-slate-900">{rec.attendancePercent}%</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
