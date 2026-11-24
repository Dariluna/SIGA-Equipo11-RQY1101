import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCertificateData,
  canSelectCourse,
  confirmEnrollment,
  validateInstitutionalEmail,
  validateLoginForm,
} from './academicRules';
import {
  DEMO_STUDENT,
  INITIAL_COURSE_CATALOG,
  INITIAL_ENROLLED_COURSES,
} from '../data/mockAcademicData';

test('validateInstitutionalEmail accepts @upsur.cl and rejects external domains', () => {
  assert.equal(validateInstitutionalEmail('darien.carrasco@upsur.cl'), true);
  assert.equal(validateInstitutionalEmail('  DARIEN@UPSUR.CL '), true);
  assert.equal(validateInstitutionalEmail('darien@gmail.com'), false);
  assert.equal(validateInstitutionalEmail(''), false);
});

test('validateLoginForm catches empty and invalid credentials', () => {
  const emptyRes = validateLoginForm('', '');
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.emailError);
  assert.ok(emptyRes.passwordError);

  const invalidDomain = validateLoginForm('usuario@duocuc.cl', 'clave123');
  assert.equal(invalidDomain.valid, false);
  assert.ok(invalidDomain.emailError?.includes('@upsur.cl'));

  const valid = validateLoginForm('darien.carrasco@upsur.cl', 'upsur2026');
  assert.equal(valid.valid, true);
});

test('canSelectCourse blocks courses with 0 available seats', () => {
  const securityCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-401');
  assert.ok(securityCourse);

  const res = canSelectCourse(
    securityCourse,
    [],
    INITIAL_ENROLLED_COURSES,
    DEMO_STUDENT.approvedCourses
  );
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'NO_QUOTA');
});

test('canSelectCourse blocks courses with unapproved prerequisites', () => {
  const aiCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-405');
  assert.ok(aiCourse);

  const res = canSelectCourse(
    aiCourse,
    [],
    INITIAL_ENROLLED_COURSES,
    DEMO_STUDENT.approvedCourses
  );
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'MISSING_PREREQUISITE');
  assert.ok(res.message?.includes('MAT-302'));
});

test('canSelectCourse detects schedule conflict against already enrolled course', () => {
  // INF-315 shares Jueves 08:30-10:00 with pre-enrolled INF-210 Sistemas Operativos
  const cloudCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-315');
  assert.ok(cloudCourse);

  const res = canSelectCourse(
    cloudCourse,
    [],
    INITIAL_ENROLLED_COURSES,
    DEMO_STUDENT.approvedCourses
  );
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'SCHEDULE_CONFLICT');
  assert.equal(res.conflictCourseName, 'Sistemas Operativos');
  assert.equal(res.message, 'Tope horario detectado con Sistemas Operativos');
});

test('canSelectCourse detects schedule conflict against newly selected course', () => {
  // INF-301 and INF-304 share Lunes 08:30-10:00
  const reqCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-301');
  const archCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-304');
  assert.ok(reqCourse && archCourse);

  const firstCheck = canSelectCourse(
    reqCourse,
    [],
    INITIAL_ENROLLED_COURSES,
    DEMO_STUDENT.approvedCourses
  );
  assert.equal(firstCheck.ok, true);

  const secondCheck = canSelectCourse(
    archCourse,
    [reqCourse],
    INITIAL_ENROLLED_COURSES,
    DEMO_STUDENT.approvedCourses
  );
  assert.equal(secondCheck.ok, false);
  assert.equal(secondCheck.reason, 'SCHEDULE_CONFLICT');
  assert.equal(secondCheck.message, 'Tope horario detectado con Ingeniería de Requisitos');
});

test('confirmEnrollment decrements availableSeats by 1 and generates receipt folio', () => {
  const reqCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-301')!;
  const dbCourse = INITIAL_COURSE_CATALOG.find((c) => c.code === 'INF-306')!;

  const result = confirmEnrollment(
    INITIAL_COURSE_CATALOG,
    [reqCourse, dbCourse],
    INITIAL_ENROLLED_COURSES,
    '2026-2'
  );

  const updatedReq = result.updatedCatalog.find((c) => c.code === 'INF-301')!;
  const updatedDb = result.updatedCatalog.find((c) => c.code === 'INF-306')!;

  assert.equal(updatedReq.availableSeats, reqCourse.availableSeats - 1);
  assert.equal(updatedDb.availableSeats, dbCourse.availableSeats - 1);
  assert.equal(result.updatedEnrolled.length, INITIAL_ENROLLED_COURSES.length + 2);
  assert.match(result.receipt.folio, /^INS-2026-\d{5}$/);
  assert.equal(result.receipt.totalCredits, reqCourse.credits + dbCourse.credits);
});

test('buildCertificateData produces valid SIGA folio and verification URL', () => {
  const cert = buildCertificateData(DEMO_STUDENT);
  assert.match(cert.folio, /^SIGA-2026-\d{5}$/);
  assert.equal(cert.studentName, 'Darien Carrasco');
  assert.equal(cert.period, '2026-2');
  assert.equal(cert.verificationUrl, `https://siga.upsur.cl/verificar/${cert.folio}`);
});
