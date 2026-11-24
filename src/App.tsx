import { useEffect, useState } from 'react';
import {
  DEMO_STUDENT,
  INITIAL_COURSE_CATALOG,
  INITIAL_ENROLLED_COURSES,
  INITIAL_GRADES_SUMMARY,
} from './data/mockAcademicData';
import {
  AppView,
  CertificateData,
  Course,
  EnrollmentReceipt,
  StudentProfile,
} from './types/academic';
import { confirmEnrollment } from './utils/academicRules';
import { LoginView } from './components/LoginView';
import { HeaderNav } from './components/HeaderNav';
import { DashboardView } from './components/DashboardView';
import { EnrollmentView } from './components/EnrollmentView';
import { ScheduleView } from './components/ScheduleView';
import { GradesView } from './components/GradesView';
import { CertificateView } from './components/CertificateView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  });

  const [student, setStudent] = useState<StudentProfile>(DEMO_STUDENT);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [catalog, setCatalog] = useState<Course[]>(INITIAL_COURSE_CATALOG);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>(INITIAL_ENROLLED_COURSES);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [lastReceipt, setLastReceipt] = useState<EnrollmentReceipt | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeView, isAuthenticated]);

  const handleLoginSuccess = (email: string) => {
    setStudent((prev) => ({ ...prev, email }));
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('dashboard');
    setSelectedCourses([]);
  };

  const handleAddCourse = (course: Course) => {
    setSelectedCourses((prev) => [...prev, course]);
  };

  const handleRemoveSelected = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleConfirmEnrollment = () => {
    if (selectedCourses.length === 0) return;
    const { updatedCatalog, updatedEnrolled, receipt } = confirmEnrollment(
      catalog,
      selectedCourses,
      enrolledCourses,
      student.currentPeriod
    );
    setCatalog(updatedCatalog);
    setEnrolledCourses(updatedEnrolled);
    setSelectedCourses([]);
    setLastReceipt(receipt);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <HeaderNav
        student={student}
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-12">
        {activeView === 'dashboard' && (
          <DashboardView
            student={student}
            enrolledCourses={enrolledCourses}
            catalogCount={catalog.length}
            grades={INITIAL_GRADES_SUMMARY}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'enrollment' && (
          <EnrollmentView
            student={student}
            catalog={catalog}
            enrolledCourses={enrolledCourses}
            selectedCourses={selectedCourses}
            lastReceipt={lastReceipt}
            onAddCourse={handleAddCourse}
            onRemoveSelected={handleRemoveSelected}
            onConfirmEnrollment={handleConfirmEnrollment}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'schedule' && (
          <ScheduleView
            student={student}
            enrolledCourses={enrolledCourses}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'grades' && (
          <GradesView
            student={student}
            grades={INITIAL_GRADES_SUMMARY}
            enrolledCourses={enrolledCourses}
          />
        )}

        {activeView === 'certificates' && (
          <CertificateView
            student={student}
            enrolledCourses={enrolledCourses}
            certificate={certificate}
            onEmitCertificate={setCertificate}
          />
        )}
      </main>

      <footer className="no-print border-t border-slate-200 bg-white py-4 px-4 sm:px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>
            SIGA · Sistema Integrado de Gestión Académica — Universidad Politécnica del Sur
          </span>
          <span>Período Académico {student.currentPeriod}</span>
        </div>
      </footer>
    </div>
  );
}
