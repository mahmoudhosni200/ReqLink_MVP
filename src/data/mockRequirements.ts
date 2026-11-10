import type { Requirement } from '@/types';

export const mockRequirements: Requirement[] = [
  { id: 'req-1', projectId: 'proj-1', identifier: 'FR-01', text: 'The system shall allow patients to register by providing personal details including name, date of birth, contact information, and insurance ID.', source: 'SRS §3.1', linkedArtifacts: 3 },
  { id: 'req-2', projectId: 'proj-1', identifier: 'FR-02', text: 'The system shall authenticate users via username and password with support for role-based access control (admin, doctor, nurse, patient).', source: 'SRS §3.2', linkedArtifacts: 4 },
  { id: 'req-3', projectId: 'proj-1', identifier: 'FR-03', text: 'The system shall allow doctors to create, update, and view patient medical records including diagnoses, prescriptions, and lab results.', source: 'SRS §3.3', linkedArtifacts: 3 },
  { id: 'req-4', projectId: 'proj-1', identifier: 'FR-04', text: 'The system shall enable patients to book, reschedule, and cancel appointments with available doctors.', source: 'SRS §3.4', linkedArtifacts: 2 },
  { id: 'req-5', projectId: 'proj-1', identifier: 'FR-05', text: 'The system shall send automated email and SMS notifications for appointment reminders 24 hours before the scheduled time.', source: 'SRS §3.5', linkedArtifacts: 2 },
  { id: 'req-6', projectId: 'proj-1', identifier: 'FR-06', text: 'The system shall generate billing invoices based on treatments and services rendered during a visit.', source: 'SRS §3.6', linkedArtifacts: 2 },
  { id: 'req-7', projectId: 'proj-1', identifier: 'FR-07', text: 'The system shall maintain an audit log of all user actions including login attempts, record modifications, and permission changes.', source: 'SRS §3.7', linkedArtifacts: 2 },
  { id: 'req-8', projectId: 'proj-1', identifier: 'FR-08', text: 'The system shall allow administrators to manage hospital departments, assign staff, and configure system settings.', source: 'SRS §3.8', linkedArtifacts: 2 },
  { id: 'req-9', projectId: 'proj-1', identifier: 'FR-09', text: 'The system shall provide a dashboard displaying real-time hospital statistics including bed occupancy, patient count, and pending appointments.', source: 'SRS §3.9', linkedArtifacts: 1 },
  { id: 'req-10', projectId: 'proj-1', identifier: 'FR-10', text: 'The system shall support searching patients by name, ID, or insurance number with auto-complete suggestions.', source: 'SRS §3.10', linkedArtifacts: 2 },
  { id: 'req-11', projectId: 'proj-1', identifier: 'FR-11', text: 'The system shall allow pharmacists to view prescriptions and update medication dispensing status.', source: 'SRS §3.11', linkedArtifacts: 2 },
  { id: 'req-12', projectId: 'proj-1', identifier: 'FR-12', text: 'The system shall encrypt all patient health data at rest and in transit using AES-256 and TLS 1.3 respectively.', source: 'SRS §3.12', linkedArtifacts: 1 },
];

export const mockBenchmarkRequirements: Requirement[] = [
  { id: 'breq-1', projectId: 'proj-bench-1', identifier: 'R-01', text: 'The system shall allow tourists to search for points of interest by category, location, and rating.', source: 'eTour SRS', linkedArtifacts: 3 },
  { id: 'breq-2', projectId: 'proj-bench-1', identifier: 'R-02', text: 'The system shall display a map with interactive markers for each tourist attraction.', source: 'eTour SRS', linkedArtifacts: 2 },
  { id: 'breq-3', projectId: 'proj-bench-1', identifier: 'R-03', text: 'The system shall allow users to create and save personalized tour itineraries.', source: 'eTour SRS', linkedArtifacts: 2 },
  { id: 'breq-4', projectId: 'proj-bench-1', identifier: 'R-04', text: 'The system shall provide user reviews and ratings for each point of interest.', source: 'eTour SRS', linkedArtifacts: 2 },
  { id: 'breq-5', projectId: 'proj-bench-1', identifier: 'R-05', text: 'The system shall support multi-language content display including Italian and English.', source: 'eTour SRS', linkedArtifacts: 1 },
  { id: 'breq-6', projectId: 'proj-bench-1', identifier: 'R-06', text: 'The system shall calculate optimal routes between selected points of interest.', source: 'eTour SRS', linkedArtifacts: 2 },
  { id: 'breq-7', projectId: 'proj-bench-1', identifier: 'R-07', text: 'The system shall allow users to bookmark favorite attractions for quick access.', source: 'eTour SRS', linkedArtifacts: 1 },
  { id: 'breq-8', projectId: 'proj-bench-1', identifier: 'R-08', text: 'The system shall provide real-time availability information for guided tours.', source: 'eTour SRS', linkedArtifacts: 1 },
];
