import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  MapPin,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import {
  AppView,
  Course,
  EnrollmentReceipt,
  StudentProfile,
} from '../types/academic';
import { canSelectCourse } from '../utils/academicRules';

interface EnrollmentViewProps {
  student: StudentProfile;
  catalog: Course[];
  enrolledCourses: Course[];
  selectedCourses: Course[];
  lastReceipt: EnrollmentReceipt | null;
  onAddCourse: (course: Course) => void;
  onRemoveSelected: (courseId: string) => void;
  onConfirmEnrollment: () => void;
  onNavigate: (view: AppView) => void;
}

type FilterMode = 'all' | 'available' | 'enrolled';

interface ActiveAlert {
  type: 'error' | 'warning';
  courseName: string;
  message: string;
}

export const EnrollmentView: React.FC<EnrollmentViewProps> = ({
  student,
  catalog,
  enrolledCourses,
  selectedCourses,
  lastReceipt,
  onAddCourse,
  onRemoveSelected,
  onConfirmEnrollment,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);

  const enrolledIds = useMemo(
    () => new Set(enrolledCourses.map((c) => c.id)),
    [enrolledCourses]
  );
  const selectedIds = useMemo(
    () => new Set(selectedCourses.map((c) => c.id)),
    [selectedCourses]
  );

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((course) => {
      const matchesQuery =
        !q ||
        course.code.toLowerCase().includes(q) ||
        course.name.toLowerCase().includes(q) ||
        course.professor.toLowerCase().includes(q);

      if (!matchesQuery) return false;
      if (filterMode === 'available') {
        return course.availableSeats > 0 && !enrolledIds.has(course.id);
      }
      if (filterMode === 'enrolled') {
        return enrolledIds.has(course.id);
      }
      return true;
    });
  }, [catalog, searchQuery, filterMode, enrolledIds]);

  const handleTryAdd = (course: Course) => {
    const validation = canSelectCourse(
      course,
      selectedCourses,
      enrolledCourses,
      student.approvedCourses
    );

    if (!validation.ok) {
      if (validation.reason === 'SCHEDULE_CONFLICT') {
        setActiveAlert({
          type: 'warning',
          courseName: course.name,
          message: validation.message || 'Tope horario detectado.',
        });
      } else {
        setActiveAlert({
          type: 'error',
          courseName: course.name,
          message: validation.message || 'No es posible inscribir esta asignatura.',
        });
      }
      return;
    }

    setActiveAlert(null);
    onAddCourse(course);
  };

  const selectedCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const currentCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0284C7]">
            Proceso de Inscripción Académica · Período {student.currentPeriod}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight">
            Inscripción de Asignaturas
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Selecciona asignaturas del catálogo de {student.career}. El sistema valida cupos, prerrequisitos y topes horarios en tiempo real.
          </p>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums shrink-0">
          Carga actual: <span className="font-bold text-[#1B365D]">{enrolledCourses.length}</span> ramos ({currentCredits} cr.)
        </div>
      </div>

      {/* Confirmation Receipt Banner */}
      {lastReceipt && (
        <section
          aria-label="Comprobante de inscripción confirmada"
          data-testid="enrollment-receipt"
          className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 sm:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                  Inscripción Confirmada Exitosamente
                </h2>
                <p className="mt-1 text-sm text-emerald-900">
                  Folio de comprobante:{' '}
                  <span className="font-mono font-bold tabular-nums whitespace-nowrap">{lastReceipt.folio}</span>
                  {' · '}
                  Emitido el {lastReceipt.issuedAt}
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-emerald-900">
                  {lastReceipt.courses.map((c) => (
                    <li key={c.id} className="font-medium">
                      <span className="font-mono">{c.code}</span> {c.name} ({c.credits} cr.)
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Ver en Mi Horario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Business Validation Alert Banner (Red for Prerequisite / Quota, Yellow for Schedule Conflict) */}
      {activeAlert && (
        <div
          role="alert"
          data-testid="enrollment-alert"
          className={`rounded-xl border px-4 py-3.5 flex items-start justify-between gap-3 ${
            activeAlert.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {activeAlert.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className="font-bold">
                {activeAlert.type === 'warning'
                  ? `Conflicto horario al intentar agregar ${activeAlert.courseName}`
                  : `No se pudo agregar ${activeAlert.courseName}`}
              </p>
              <p className="mt-0.5">{activeAlert.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveAlert(null)}
            aria-label="Cerrar alerta"
            className="text-xs font-semibold px-2 py-1 rounded hover:bg-black/5 shrink-0 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por sigla, asignatura o docente..."
            aria-label="Buscar asignatura"
            className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit">
          {(
            [
              { id: 'all', label: 'Todas' },
              { id: 'available', label: 'Con cupos' },
              { id: 'enrolled', label: 'Inscritas' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterMode === tab.id
                  ? 'bg-white text-[#1B365D] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Grid: Course Catalog + Sticky Selection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Catalog List */}
        <div className="lg:col-span-8 space-y-3">
          {filteredCatalog.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No se encontraron asignaturas con ese criterio de búsqueda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterMode('all');
                }}
                className="mt-3 text-sm font-semibold text-[#0284C7] hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredCatalog.map((course) => {
              const isEnrolled = enrolledIds.has(course.id);
              const isSelected = selectedIds.has(course.id);
              const noSeats = course.availableSeats <= 0;
              const missingPrereq =
                course.prerequisite &&
                !student.approvedCourses.includes(course.prerequisite.code);

              return (
                <article
                  key={course.id}
                  data-testid={`course-card-${course.code}`}
                  className={`bg-white border rounded-xl p-4 sm:p-5 transition-colors ${
                    isSelected
                      ? 'border-[#0284C7] ring-1 ring-[#0284C7]/25'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {/* Top Metadata Line (Zero-Pill discipline with · separators) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span className="font-mono font-bold text-[#1B365D]">
                          {course.code}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-medium text-slate-700">
                          {course.credits} créditos
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          data-testid={`seats-${course.code}`}
                          className={`font-mono tabular-nums font-semibold ${
                            noSeats ? 'text-red-700' : 'text-emerald-700'
                          }`}
                        >
                          Cupos: {course.availableSeats}/{course.totalSeats}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-base sm:text-lg font-bold text-slate-900">
                        {course.name}
                      </h3>

                      {/* Professor & Prerequisite */}
                      <div className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Docente: {course.professor}</span>
                        </p>
                        <p className="flex flex-wrap items-center gap-x-1.5">
                          <span className="font-medium text-slate-700">Prerrequisito:</span>
                          {course.prerequisite ? (
                            <span
                              className={
                                missingPrereq ? 'text-red-700 font-semibold' : 'text-slate-600'
                              }
                            >
                              {course.prerequisite.code} {course.prerequisite.name}{' '}
                              ({missingPrereq ? 'No aprobado' : 'Aprobado'})
                            </span>
                          ) : (
                            <span>Sin prerrequisitos</span>
                          )}
                        </p>
                      </div>

                      {/* Schedule Blocks & Room */}
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {course.blocks.map((block, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 font-mono tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                            <span>
                              {block.day} {block.startTime}-{block.endTime}
                            </span>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-sans text-slate-600">{block.room}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Column */}
                    <div className="sm:w-40 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                      {isEnrolled ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Inscrita
                        </span>
                      ) : isSelected ? (
                        <button
                          type="button"
                          onClick={() => onRemoveSelected(course.id)}
                          aria-label={`Quitar ${course.name} de la selección`}
                          className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-slate-500" />
                          <span>Quitar</span>
                        </button>
                      ) : noSeats ? (
                        <button
                          type="button"
                          disabled
                          aria-label={`${course.name} sin cupos disponibles`}
                          className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs sm:text-sm font-semibold cursor-not-allowed whitespace-nowrap"
                        >
                          Sin cupos
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTryAdd(course)}
                          aria-label={`Agregar ${course.name}`}
                          className={`w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                            missingPrereq
                              ? 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200'
                              : 'bg-[#1B365D] hover:bg-[#142947] text-white'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Selection Summary Panel */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#1B365D]">
              Resumen de Selección
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Revisa tus asignaturas antes de confirmar la inscripción.
            </p>
          </div>

          {selectedCourses.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">
              Aún no has seleccionado asignaturas nuevas. Presiona{' '}
              <span className="font-semibold text-slate-700">Agregar</span> en el catálogo para comenzar.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {selectedCourses.map((course) => (
                <li
                  key={course.id}
                  className="py-3 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-semibold text-[#0284C7]">
                      {course.code} · {course.credits} cr.
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {course.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSelected(course.id)}
                    aria-label={`Eliminar ${course.name} de selección`}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Asignaturas por confirmar</span>
              <span className="font-mono font-bold tabular-nums text-slate-900">
                {selectedCourses.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Créditos a sumar</span>
              <span className="font-mono font-bold tabular-nums text-slate-900">
                {selectedCredits}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-800 font-semibold pt-1">
              <span>Total créditos proyectado</span>
              <span className="font-mono tabular-nums text-[#1B365D]">
                {currentCredits + selectedCredits}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedCourses.length === 0}
            onClick={() => {
              setActiveAlert(null);
              onConfirmEnrollment();
            }}
            className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              selectedCourses.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Inscripción</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
