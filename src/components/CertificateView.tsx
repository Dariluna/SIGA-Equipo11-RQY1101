import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  FileCheck2,
  Printer,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { CertificateData, Course, StudentProfile } from '../types/academic';
import { buildCertificateData } from '../utils/academicRules';
import { UpsurCrest } from './UpsurCrest';

interface CertificateViewProps {
  student: StudentProfile;
  enrolledCourses: Course[];
  certificate: CertificateData | null;
  onEmitCertificate: (cert: CertificateData) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  enrolledCourses,
  certificate,
  onEmitCertificate,
}) => {
  const [qrSvg, setQrSvg] = useState<string>('');

  useEffect(() => {
    let active = true;
    if (!certificate) {
      setQrSvg('');
      return;
    }

    QRCode.toString(certificate.verificationUrl, {
      type: 'svg',
      width: 124,
      margin: 1,
      color: {
        dark: '#1B365D',
        light: '#FFFFFF',
      },
    })
      .then((svg) => {
        if (active) setQrSvg(svg);
      })
      .catch(() => {
        if (active) setQrSvg('');
      });

    return () => {
      active = false;
    };
  }, [certificate]);

  const handleEmit = () => {
    const data = buildCertificateData(student);
    onEmitCertificate(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* Control Header (hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#0284C7]">
            Documentación Electrónica · Ley N° 19.799
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight">
            Certificados Digitales
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Emite en línea tu Certificado de Alumno Regular con folio único verificable y código QR institucional.
          </p>
        </div>

        {certificate && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleEmit}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Emitir Nuevo Certificado</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1B365D] hover:bg-[#142947] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Descargar PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State before emission */}
      {!certificate ? (
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#1B365D]/8 text-[#1B365D] flex items-center justify-center mx-auto">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-lg sm:text-xl font-bold text-[#1B365D]">
            Certificado de Alumno Regular — Período {student.currentPeriod}
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Este documento acredita tu calidad de alumno regular en la carrera de{' '}
            <strong className="text-slate-800">{student.career}</strong>, válido para trámites bancarios, beneficios estudiantiles y acreditación institucional.
          </p>
          <button
            type="button"
            onClick={handleEmit}
            className="mt-6 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Emitir Certificado de Alumno Regular</span>
          </button>
        </div>
      ) : (
        /* Official Printable Certificate Document */
        <article
          data-testid="official-certificate"
          className="print-only-container bg-white border border-slate-300 rounded-2xl shadow-sm p-5 sm:p-8 max-w-4xl mx-auto"
        >
          {/* Letterhead */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-[#1B365D] pb-4">
            <div className="flex items-center gap-3.5">
              <UpsurCrest className="w-12 h-12 shrink-0" variant="navy" />
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#1B365D] uppercase">
                  Universidad Politécnica del Sur
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Vicerrectoría Académica · Dirección de Registro Curricular
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-500">Folio de Verificación</p>
              <p
                data-testid="certificate-folio"
                className="text-base sm:text-lg font-mono font-bold tabular-nums text-[#1B365D]"
              >
                {certificate.folio}
              </p>
            </div>
          </header>

          {/* Document Title */}
          <div className="my-5 text-center">
            <h3 className="text-lg sm:text-2xl font-extrabold tracking-wide text-[#1B365D] uppercase">
              Certificado de Alumno Regular
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-mono">
              Período Académico {certificate.period}
            </p>
          </div>

          {/* Official Body */}
          <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
            <p>
              La Dirección de Registro Curricular de la{' '}
              <strong className="text-[#1B365D]">Universidad Politécnica del Sur</strong>{' '}
              certifica que, según los registros académicos oficiales vigentes en el Sistema Integrado de Gestión Académica (SIGA):
            </p>

            {/* Student Data Grid */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Nombre Completo</p>
                <p className="mt-0.5 font-bold text-[#1B365D]">{certificate.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">RUT / Cédula de Identidad</p>
                <p className="mt-0.5 font-mono font-bold tabular-nums text-slate-900">
                  {certificate.rut}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Carrera</p>
                <p className="mt-0.5 font-semibold text-slate-900">{certificate.career}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Facultad</p>
                <p className="mt-0.5 font-semibold text-slate-900">{certificate.faculty}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Período Académico</p>
                <p className="mt-0.5 font-mono font-semibold text-slate-900">
                  {certificate.period} (Segundo Semestre 2026)
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Carga Académica Inscrita</p>
                <p className="mt-0.5 font-mono tabular-nums font-semibold text-slate-900">
                  {enrolledCourses.length} asignaturas · {totalCredits} créditos
                </p>
              </div>
            </div>

            <p>
              Se encuentra debidamente matriculado(a) y mantiene la calidad de{' '}
              <strong className="text-[#1B365D]">Alumno(a) Regular</strong> para todos los fines académicos, administrativos y legales que estime pertinente ante instituciones públicas o privadas.
            </p>

            <p className="text-xs sm:text-sm text-slate-600">
              Se extiende el presente certificado el{' '}
              <strong className="text-slate-800">{certificate.issuedDateFormatted}</strong>{' '}
              ({certificate.issuedAt} hrs.), con validez oficial de 60 días desde su fecha de emisión.
            </p>
          </div>

          {/* Electronic Signature Seal & Real QR Verification Footer */}
          <footer className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Digital Signature Seal */}
            <div className="flex items-start gap-3.5 max-w-md">
              <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-sky-300" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#1B365D] uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Firma Electrónica Avanzada · Ley N° 19.799
                </p>
                <p className="text-slate-600">
                  Documento firmado electrónicamente por Secretaría General — Universidad Politécnica del Sur.
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  Código de integridad: {certificate.signatureHash}
                </p>
              </div>
            </div>

            {/* Real Dynamic SVG QR Code */}
            <div className="flex items-center gap-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 shrink-0">
              <div
                data-testid="certificate-qr"
                aria-label={`Código QR de verificación para folio ${certificate.folio}`}
                className="w-[104px] h-[104px] bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <div className="text-xs space-y-1 max-w-[190px]">
                <p className="font-bold text-[#1B365D]">Verificación en línea</p>
                <p className="text-slate-600 leading-snug">
                  Escanea este código QR para validar la autenticidad del folio.
                </p>
                <p className="font-mono text-[11px] text-[#0284C7] break-all">
                  {certificate.verificationUrl}
                </p>
              </div>
            </div>
          </footer>
        </article>
      )}
    </div>
  );
};
