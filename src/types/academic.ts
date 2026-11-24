export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export type AppView =
  | 'dashboard'
  | 'enrollment'
  | 'schedule'
  | 'grades'
  | 'certificates';

export interface ScheduleBlock {
  day: DayOfWeek;
  startTime: string; // HH:MM e.g. "08:30"
  endTime: string;   // HH:MM e.g. "10:00"
  room: string;
}

export interface Prerequisite {
  code: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  credits: number;
  totalSeats: number;
  availableSeats: number;
  prerequisite: Prerequisite | null;
  blocks: ScheduleBlock[];
  semesterLevel: number;
  isPreEnrolled?: boolean;
}

export interface StudentProfile {
  name: string;
  rut: string;
  email: string;
  career: string;
  shortCareer: string;
  faculty: string;
  academicStatus: 'Regular' | 'Suspendido' | 'Egresado';
  currentPeriod: string;
  cohort: number;
  approvedCourses: string[]; // course codes already passed
}

export interface ValidationResult {
  ok: boolean;
  reason?:
    | 'NO_QUOTA'
    | 'MISSING_PREREQUISITE'
    | 'ALREADY_ENROLLED'
    | 'ALREADY_SELECTED'
    | 'SCHEDULE_CONFLICT';
  message?: string;
  conflictCourseName?: string;
}

export interface EnrollmentReceipt {
  folio: string;
  issuedAt: string;
  period: string;
  courses: Course[];
  totalCredits: number;
}

export interface CertificateData {
  folio: string;
  studentName: string;
  rut: string;
  career: string;
  faculty: string;
  period: string;
  issuedAt: string;
  issuedDateFormatted: string;
  verificationUrl: string;
  signatureHash: string;
}

export interface GradeRecord {
  code: string;
  name: string;
  professor: string;
  credits: number;
  partialGrades: number[];
  average: number;
  attendancePercent: number;
  status: 'En curso' | 'Aprobado';
}
