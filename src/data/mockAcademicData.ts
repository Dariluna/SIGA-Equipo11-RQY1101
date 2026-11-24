import { Course, GradeRecord, StudentProfile } from '../types/academic';

export const DEMO_STUDENT: StudentProfile = {
  name: 'Darien Carrasco',
  rut: '20.845.319-7',
  email: 'darien.carrasco@upsur.cl',
  career: 'Ingeniería en Informática',
  shortCareer: 'Ing. en Informática',
  faculty: 'Facultad de Ingeniería y Tecnología',
  academicStatus: 'Regular',
  currentPeriod: '2026-2',
  cohort: 2024,
  approvedCourses: [
    'INF-101', // Fundamentos de Programación
    'INF-202', // Modelamiento de Datos
    'INF-204', // Análisis de Sistemas
    'INF-205', // Programación Orientada a Objetos
    'INF-206', // Redes de Datos
    'MAT-201', // Álgebra Lineal
  ],
};

export const INITIAL_ENROLLED_COURSES: Course[] = [
  {
    id: 'inf-210',
    code: 'INF-210',
    name: 'Sistemas Operativos',
    professor: 'Dr. Rodrigo Villalobos',
    credits: 5,
    totalSeats: 35,
    availableSeats: 6,
    prerequisite: { code: 'INF-205', name: 'Programación Orientada a Objetos' },
    semesterLevel: 5,
    isPreEnrolled: true,
    blocks: [
      { day: 'Jueves', startTime: '08:30', endTime: '10:00', room: 'Sala B-302' },
      { day: 'Viernes', startTime: '08:30', endTime: '10:00', room: 'Lab C-101' },
    ],
  },
];

export const INITIAL_COURSE_CATALOG: Course[] = [
  {
    id: 'inf-301',
    code: 'INF-301',
    name: 'Ingeniería de Requisitos',
    professor: 'Mg. Carolina Valdivia',
    credits: 5,
    totalSeats: 35,
    availableSeats: 5,
    prerequisite: { code: 'INF-204', name: 'Análisis de Sistemas' },
    semesterLevel: 5,
    blocks: [
      { day: 'Lunes', startTime: '08:30', endTime: '10:00', room: 'Sala B-204' },
      { day: 'Miércoles', startTime: '08:30', endTime: '10:00', room: 'Sala B-204' },
    ],
  },
  {
    id: 'inf-304',
    code: 'INF-304',
    name: 'Arquitectura de Software',
    professor: 'Dr. Matías Sepúlveda',
    credits: 6,
    totalSeats: 35,
    availableSeats: 11,
    prerequisite: { code: 'INF-204', name: 'Análisis de Sistemas' },
    semesterLevel: 6,
    blocks: [
      { day: 'Lunes', startTime: '08:30', endTime: '10:00', room: 'Sala A-301' },
      { day: 'Viernes', startTime: '10:15', endTime: '11:45', room: 'Sala A-301' },
    ],
  },
  {
    id: 'inf-306',
    code: 'INF-306',
    name: 'Base de Datos Avanzada',
    professor: 'Ing. Francisca Muñoz',
    credits: 5,
    totalSeats: 35,
    availableSeats: 8,
    prerequisite: { code: 'INF-202', name: 'Modelamiento de Datos' },
    semesterLevel: 5,
    blocks: [
      { day: 'Martes', startTime: '10:15', endTime: '11:45', room: 'Lab C-102' },
      { day: 'Jueves', startTime: '10:15', endTime: '11:45', room: 'Lab C-102' },
    ],
  },
  {
    id: 'inf-308',
    code: 'INF-308',
    name: 'Gestión Ágil de Proyectos',
    professor: 'Mg. Sebastián Alarcón',
    credits: 4,
    totalSeats: 35,
    availableSeats: 14,
    prerequisite: null,
    semesterLevel: 5,
    blocks: [
      { day: 'Miércoles', startTime: '14:30', endTime: '16:00', room: 'Sala B-105' },
      { day: 'Viernes', startTime: '14:30', endTime: '16:00', room: 'Sala B-105' },
    ],
  },
  {
    id: 'inf-401',
    code: 'INF-401',
    name: 'Seguridad Informática',
    professor: 'Dr. Patricio Riquelme',
    credits: 5,
    totalSeats: 35,
    availableSeats: 0,
    prerequisite: { code: 'INF-206', name: 'Redes de Datos' },
    semesterLevel: 7,
    blocks: [
      { day: 'Martes', startTime: '18:15', endTime: '19:45', room: 'Lab C-201' },
      { day: 'Sábado', startTime: '10:15', endTime: '11:45', room: 'Lab C-201' },
    ],
  },
  {
    id: 'inf-405',
    code: 'INF-405',
    name: 'Inteligencia Artificial',
    professor: 'Dra. Daniela Paredes',
    credits: 6,
    totalSeats: 35,
    availableSeats: 9,
    prerequisite: { code: 'MAT-302', name: 'Estadística Computacional' },
    semesterLevel: 7,
    blocks: [
      { day: 'Jueves', startTime: '16:15', endTime: '17:45', room: 'Sala A-402' },
      { day: 'Sábado', startTime: '08:30', endTime: '10:00', room: 'Sala A-402' },
    ],
  },
  {
    id: 'inf-315',
    code: 'INF-315',
    name: 'Computación en la Nube',
    professor: 'Ing. Nicolás Fuentes',
    credits: 5,
    totalSeats: 35,
    availableSeats: 4,
    prerequisite: { code: 'INF-206', name: 'Redes de Datos' },
    semesterLevel: 6,
    blocks: [
      { day: 'Jueves', startTime: '08:30', endTime: '10:00', room: 'Lab C-203' },
      { day: 'Martes', startTime: '16:15', endTime: '17:45', room: 'Lab C-203' },
    ],
  },
];

export const INITIAL_GRADES_SUMMARY: GradeRecord[] = [
  {
    code: 'INF-210',
    name: 'Sistemas Operativos',
    professor: 'Dr. Rodrigo Villalobos',
    credits: 5,
    partialGrades: [6.1, 5.8],
    average: 6.0,
    attendancePercent: 94,
    status: 'En curso',
  },
  {
    code: 'INF-204',
    name: 'Análisis de Sistemas',
    professor: 'Mg. Carolina Valdivia',
    credits: 5,
    partialGrades: [6.4, 6.0, 6.5],
    average: 6.3,
    attendancePercent: 96,
    status: 'Aprobado',
  },
  {
    code: 'INF-202',
    name: 'Modelamiento de Datos',
    professor: 'Ing. Francisca Muñoz',
    credits: 5,
    partialGrades: [5.9, 6.2, 6.1],
    average: 6.1,
    attendancePercent: 92,
    status: 'Aprobado',
  },
  {
    code: 'INF-206',
    name: 'Redes de Datos',
    professor: 'Dr. Patricio Riquelme',
    credits: 5,
    partialGrades: [5.5, 5.7, 5.9],
    average: 5.7,
    attendancePercent: 89,
    status: 'Aprobado',
  },
];

export const SCHEDULE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

export const SCHEDULE_TIME_SLOTS = [
  { label: '08:30 - 10:00', start: '08:30', end: '10:00' },
  { label: '10:15 - 11:45', start: '10:15', end: '11:45' },
  { label: '12:00 - 13:30', start: '12:00', end: '13:30' },
  { label: '14:30 - 16:00', start: '14:30', end: '16:00' },
  { label: '16:15 - 17:45', start: '16:15', end: '17:45' },
  { label: '18:15 - 19:45', start: '18:15', end: '19:45' },
] as const;
