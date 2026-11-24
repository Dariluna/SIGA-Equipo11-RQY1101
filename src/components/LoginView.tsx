import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, UserCheck } from 'lucide-react';
import { UpsurCrest } from './UpsurCrest';
import { validateLoginForm } from '../utils/academicRules';
import { DEMO_STUDENT } from '../data/mockAcademicData';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLoginForm(email, password);
    setEmailError(result.emailError);
    setPasswordError(result.passwordError);

    if (!result.valid) {
      setFormError('Revisa los campos señalados antes de continuar.');
      return;
    }

    setFormError(undefined);
    onLoginSuccess(email.trim().toLowerCase());
  };

  const handleDemoLogin = () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);
    onLoginSuccess(DEMO_STUDENT.email);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Institutional Branding Panel */}
      <aside className="bg-[#1B365D] text-white px-6 py-8 lg:w-[44%] lg:min-h-screen lg:px-14 lg:py-16 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3.5">
            <UpsurCrest className="w-11 h-11 shrink-0" variant="light" />
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-sky-300">
                Universidad Politécnica del Sur
              </p>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
                SIGA Académico
              </h1>
            </div>
          </div>

          <div className="mt-10 lg:mt-20 max-w-md">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white [text-wrap:balance]">
              Portal Unificado de Gestión Estudiantil
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed">
              Administra tu inscripción de asignaturas, consulta tu horario semanal en tiempo real y emite certificados oficiales con firma electrónica avanzada.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/15 hidden sm:grid grid-cols-2 gap-6 text-xs text-slate-300">
          <div>
            <p className="font-semibold text-white">Período Activo</p>
            <p className="mt-1 font-mono tabular-nums text-sky-200">2026-2 · Segundo Semestre</p>
          </div>
          <div>
            <p className="font-semibold text-white">Dominio Autorizado</p>
            <p className="mt-1 font-mono text-sky-200">@upsur.cl</p>
          </div>
        </div>
      </aside>

      {/* Login Form Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8 lg:px-16">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B365D]">
              Ingreso Institucional
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Accede con tu correo institucional <span className="font-mono text-slate-800">@upsur.cl</span> y contraseña.
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-900"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="institutional-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Correo institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="institutional-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(undefined);
                    if (formError) setFormError(undefined);
                  }}
                  placeholder="nombre.apellido@upsur.cl"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    emailError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0284C7] focus:ring-[#0284C7]/20'
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-red-700">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="institutional-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="institutional-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(undefined);
                    if (formError) setFormError(undefined);
                  }}
                  placeholder="Ingresa tu contraseña"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  className={`w-full min-h-[44px] pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    passwordError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0284C7] focus:ring-[#0284C7]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="mt-1.5 text-xs font-medium text-red-700">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] mt-2 px-4 py-2.5 rounded-xl bg-[#1B365D] hover:bg-[#142947] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B365D] cursor-pointer"
            >
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500">Acceso para demostración</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7] cursor-pointer"
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Ingreso Rápido Demo (Estudiante)</span>
          </button>

          <p className="mt-5 text-center text-xs text-slate-500 [text-wrap:balance]">
            Servicios Informáticos · Universidad Politécnica del Sur
          </p>
        </div>
      </main>
    </div>
  );
};
