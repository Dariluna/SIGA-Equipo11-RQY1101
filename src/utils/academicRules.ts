import {
  CertificateData,
  Course,
  EnrollmentReceipt,
  ScheduleBlock,
  StudentProfile,
  ValidationResult,
} from '../types/academic';

export interface LoginValidationResult {
  valid: boolean;
  emailError?: string;
  passwordError?: string;
}

export function validateInstitutionalEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return /^[a-z0-9._%+-]+@upsur\.cl$/.test(trimmed);
}

export function validateLoginForm(email: string, password: string): LoginValidationResult {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  let emailError: string | undefined;
  let passwordError: string | undefined;

  if (!trimmedEmail) {
    emailError = 'Ingresa tu correo institucional (@upsur.cl).';
  } else if (!validateInstitutionalEmail(trimmedEmail)) {
    emailError = 'El correo debe pertenecer al dominio institucional @upsur.cl.';
  }

  if (!trimmedPassword) {
    passwordError = 'Ingresa tu contraseña institucional.';
  } else if (trimmedPassword.length < 4) {
    passwordError = 'La contraseña debe tener al menos 4 caracteres.';
  }

  return {
    valid: !emailError && !passwordError,
    emailError,
    passwordError,
  };
}

export function timeToMinutes(time: string): number {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  return hours * 60 + minutes;
}

export function blocksOverlap(a: ScheduleBlock, b: ScheduleBlock): boolean {
  if (a.day !== b.day) return false;
  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);
  return aStart < bEnd && bStart < aEnd;
}

export function findScheduleConflict(course: Course, comparisonCourses: Course[]): Course | null {
  for (const existing of comparisonCourses) {
    if (existing.id === course.id) continue;
    for (const blockA of course.blocks) {
      for (const blockB of existing.blocks) {
        if (blocksOverlap(blockA, blockB)) {
          return existing;
        }
      }
    }
  }
  return null;
}

export function canSelectCourse(
  course: Course,
  selectedCourses: Course[],
  enrolledCourses: Course[],
  approvedCourses: string[]
): ValidationResult {
  if (enrolledCourses.some((c) => c.id === course.id)) {
    return {
      ok: false,
      reason: 'ALREADY_ENROLLED',
      message: `${course.name} (${course.code}) ya se encuentra inscrita en tu carga académica.`,
    };
  }

  if (selectedCourses.some((c) => c.id === course.id)) {
    return {
      ok: false,
      reason: 'ALREADY_SELECTED',
      message: `${course.name} ya está en tu selección actual.`,
    };
  }

  if (course.availableSeats <= 0) {
    return {
      ok: false,
      reason: 'NO_QUOTA',
      message: `La asignatura ${course.name} no cuenta con cupos disponibles (0/${course.totalSeats}).`,
    };
  }

  if (course.prerequisite && !approvedCourses.includes(course.prerequisite.code)) {
    return {
      ok: false,
      reason: 'MISSING_PREREQUISITE',
      message: `Prerrequisito pendiente: debes aprobar ${course.prerequisite.code} (${course.prerequisite.name}) antes de inscribir ${course.name}.`,
    };
  }

  const conflictCourse = findScheduleConflict(course, [...enrolledCourses, ...selectedCourses]);
  if (conflictCourse) {
    return {
      ok: false,
      reason: 'SCHEDULE_CONFLICT',
      conflictCourseName: conflictCourse.name,
      message: `Tope horario detectado con ${conflictCourse.name}`,
    };
  }

  return { ok: true };
}

export function generateRandomDigits(length: number): string {
  let digits = '';
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
}

export function confirmEnrollment(
  catalog: Course[],
  selectedCourses: Course[],
  enrolledCourses: Course[],
  period: string
): {
  updatedCatalog: Course[];
  updatedEnrolled: Course[];
  receipt: EnrollmentReceipt;
} {
  const selectedIds = new Set(selectedCourses.map((c) => c.id));

  const updatedCatalog = catalog.map((course) => {
    if (!selectedIds.has(course.id)) return course;
    return {
      ...course,
      availableSeats: Math.max(0, course.availableSeats - 1),
    };
  });

  const newlyEnrolled = updatedCatalog.filter((course) => selectedIds.has(course.id));
  const updatedEnrolled = [...enrolledCourses, ...newlyEnrolled];
  const totalCredits = newlyEnrolled.reduce((sum, c) => sum + c.credits, 0);

  const folio = `INS-2026-${generateRandomDigits(5)}`;
  const issuedAt = new Date().toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    updatedCatalog,
    updatedEnrolled,
    receipt: {
      folio,
      issuedAt,
      period,
      courses: newlyEnrolled,
      totalCredits,
    },
  };
}

export function buildCertificateData(student: StudentProfile): CertificateData {
  const randomSuffix = generateRandomDigits(5);
  const folio = `SIGA-2026-${randomSuffix}`;
  const now = new Date();
  const issuedDateFormatted = now.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const issuedAt = now.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const hashPartA = generateRandomDigits(6);
  const hashPartB = Math.random().toString(36).substring(2, 8).toUpperCase();

  return {
    folio,
    studentName: student.name,
    rut: student.rut,
    career: student.career,
    faculty: student.faculty,
    period: student.currentPeriod,
    issuedAt,
    issuedDateFormatted,
    verificationUrl: `https://siga.upsur.cl/verificar/${folio}`,
    signatureHash: `UPSUR-${hashPartA}-${hashPartB}`,
  };
}

export function formatScheduleBlocks(blocks: ScheduleBlock[]): string {
  return blocks
    .map((b) => `${b.day.slice(0, 3)} ${b.startTime}-${b.endTime}`)
    .join(' · ');
}
