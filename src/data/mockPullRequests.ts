import type { PullRequest } from '@/types';

export const mockPullRequests: PullRequest[] = [
  {
    id: 'pr-1', projectId: 'proj-1', number: 42, title: 'feat: add prescription dispensing status tracking', author: 'dr-smith', status: 'open',
    changedFiles: [
      { path: 'src/main/java/com/hospital/service/PrescriptionService.java', changeType: 'modified', additions: 35, deletions: 8, affectedMethods: ['updateDispensingStatus', 'getDispensedMedications'] },
      { path: 'src/main/java/com/hospital/model/Prescription.java', changeType: 'modified', additions: 12, deletions: 2, affectedMethods: [] },
      { path: 'src/main/java/com/hospital/controller/PharmacyController.java', changeType: 'added', additions: 68, deletions: 0, affectedMethods: ['getQueue', 'markDispensed'] },
    ],
    affectedLinks: 2, newLinks: 1,
    comments: [
      { id: 'prc-1', type: 'trace_link_suggestion', content: '🔗 **New trace link suggested**: `PharmacyController.markDispensed` → FR-11 (pharmacist dispensing status)\n\nConfidence: 87% — This new method implements the dispensing status update described in requirement FR-11.', relatedLinks: ['tl-20'] },
      { id: 'prc-2', type: 'link_updated', content: '🔄 **Trace link updated**: `PrescriptionService` → FR-11\n\nThe modifications to `updateDispensingStatus` strengthen the link to FR-11. Confidence increased from 87% to 91%.', relatedLinks: ['tl-20'] },
      { id: 'prc-3', type: 'unlinked_warning', content: '⚠️ **Unlinked code change**: `Prescription.java` was modified but no trace link connects it to any requirement. Consider linking to FR-11 if the model changes support the dispensing status feature.', relatedLinks: [] },
    ],
    createdAt: '2024-11-09T10:15:00Z',
  },
  {
    id: 'pr-2', projectId: 'proj-1', number: 41, title: 'fix: correct appointment time zone handling', author: 'jane-dev', status: 'merged',
    changedFiles: [
      { path: 'src/main/java/com/hospital/service/AppointmentService.java', changeType: 'modified', additions: 15, deletions: 10, affectedMethods: ['bookAppointment', 'rescheduleAppointment'] },
      { path: 'src/main/java/com/hospital/util/TimeZoneHelper.java', changeType: 'added', additions: 42, deletions: 0, affectedMethods: ['convertToUTC', 'convertToLocal'] },
    ],
    affectedLinks: 1, newLinks: 0,
    comments: [
      { id: 'prc-4', type: 'link_updated', content: '🔄 **Trace link re-evaluated**: `AppointmentService.bookAppointment` → FR-04\n\nMinor code change in time zone handling. Link remains valid with unchanged confidence (92%).', relatedLinks: ['tl-12'] },
    ],
    createdAt: '2024-11-08T16:30:00Z',
  },
  {
    id: 'pr-3', projectId: 'proj-1', number: 39, title: 'refactor: extract audit logging into aspect', author: 'arch-lead', status: 'merged',
    changedFiles: [
      { path: 'src/main/java/com/hospital/audit/AuditLogger.java', changeType: 'modified', additions: 40, deletions: 25, affectedMethods: ['logAction', 'formatAuditEntry'] },
      { path: 'src/main/java/com/hospital/audit/AuditAspect.java', changeType: 'added', additions: 55, deletions: 0, affectedMethods: ['aroundAudited'] },
      { path: 'src/main/java/com/hospital/service/MedicalRecordService.java', changeType: 'modified', additions: 3, deletions: 18, affectedMethods: ['createRecord', 'updateRecord'] },
    ],
    affectedLinks: 3, newLinks: 1,
    comments: [
      { id: 'prc-5', type: 'link_updated', content: '🔄 **Trace link re-evaluated**: `AuditLogger` → FR-07\n\nRefactored to use aspect-oriented approach. Link confidence remains high (92%).', relatedLinks: ['tl-17'] },
      { id: 'prc-6', type: 'trace_link_suggestion', content: '🔗 **New trace link suggested**: `AuditAspect.aroundAudited` → FR-07 (audit logging)\n\nConfidence: 85% — The new AuditAspect class implements the cross-cutting audit logging concern for FR-07.', relatedLinks: ['tl-17'] },
    ],
    createdAt: '2024-11-07T09:00:00Z',
  },
];
