import type { FileTreeNode } from '@/types';

export const mockFileTree: FileTreeNode = {
  name: 'hospital-management-system', path: '/', type: 'directory',
  children: [
    { name: 'pom.xml', path: '/pom.xml', type: 'file', size: 4200, extension: 'xml' },
    { name: 'README.md', path: '/README.md', type: 'file', size: 2100, extension: 'md' },
    { name: 'src', path: '/src', type: 'directory', children: [
      { name: 'main', path: '/src/main', type: 'directory', children: [
        { name: 'java', path: '/src/main/java', type: 'directory', children: [
          { name: 'com', path: '/src/main/java/com', type: 'directory', children: [
            { name: 'hospital', path: '/src/main/java/com/hospital', type: 'directory', children: [
              { name: 'controller', path: '/src/main/java/com/hospital/controller', type: 'directory', children: [
                { name: 'AuthenticationController.java', path: '/src/main/java/com/hospital/controller/AuthenticationController.java', type: 'file', size: 3200, extension: 'java' },
                { name: 'AppointmentController.java', path: '/src/main/java/com/hospital/controller/AppointmentController.java', type: 'file', size: 4100, extension: 'java' },
                { name: 'PatientController.java', path: '/src/main/java/com/hospital/controller/PatientController.java', type: 'file', size: 2800, extension: 'java' },
              ]},
              { name: 'service', path: '/src/main/java/com/hospital/service', type: 'directory', children: [
                { name: 'PatientRegistrationService.java', path: '/src/main/java/com/hospital/service/PatientRegistrationService.java', type: 'file', size: 3800, extension: 'java' },
                { name: 'AuthService.java', path: '/src/main/java/com/hospital/service/AuthService.java', type: 'file', size: 5200, extension: 'java' },
                { name: 'MedicalRecordService.java', path: '/src/main/java/com/hospital/service/MedicalRecordService.java', type: 'file', size: 6100, extension: 'java' },
                { name: 'AppointmentService.java', path: '/src/main/java/com/hospital/service/AppointmentService.java', type: 'file', size: 4500, extension: 'java' },
                { name: 'NotificationService.java', path: '/src/main/java/com/hospital/service/NotificationService.java', type: 'file', size: 3900, extension: 'java' },
                { name: 'BillingService.java', path: '/src/main/java/com/hospital/service/BillingService.java', type: 'file', size: 4800, extension: 'java' },
                { name: 'PatientSearchService.java', path: '/src/main/java/com/hospital/service/PatientSearchService.java', type: 'file', size: 3400, extension: 'java' },
                { name: 'PrescriptionService.java', path: '/src/main/java/com/hospital/service/PrescriptionService.java', type: 'file', size: 4200, extension: 'java' },
              ]},
              { name: 'model', path: '/src/main/java/com/hospital/model', type: 'directory', children: [
                { name: 'Patient.java', path: '/src/main/java/com/hospital/model/Patient.java', type: 'file', size: 1800, extension: 'java' },
                { name: 'Appointment.java', path: '/src/main/java/com/hospital/model/Appointment.java', type: 'file', size: 1200, extension: 'java' },
                { name: 'MedicalRecord.java', path: '/src/main/java/com/hospital/model/MedicalRecord.java', type: 'file', size: 1500, extension: 'java' },
                { name: 'Prescription.java', path: '/src/main/java/com/hospital/model/Prescription.java', type: 'file', size: 1100, extension: 'java' },
              ]},
              { name: 'security', path: '/src/main/java/com/hospital/security', type: 'directory', children: [
                { name: 'RoleBasedAccessFilter.java', path: '/src/main/java/com/hospital/security/RoleBasedAccessFilter.java', type: 'file', size: 4000, extension: 'java' },
                { name: 'JwtTokenProvider.java', path: '/src/main/java/com/hospital/security/JwtTokenProvider.java', type: 'file', size: 2900, extension: 'java' },
              ]},
              { name: 'audit', path: '/src/main/java/com/hospital/audit', type: 'directory', children: [
                { name: 'AuditLogger.java', path: '/src/main/java/com/hospital/audit/AuditLogger.java', type: 'file', size: 2800, extension: 'java' },
              ]},
              { name: 'repository', path: '/src/main/java/com/hospital/repository', type: 'directory', children: [
                { name: 'PatientRepository.java', path: '/src/main/java/com/hospital/repository/PatientRepository.java', type: 'file', size: 800, extension: 'java' },
                { name: 'UserRepository.java', path: '/src/main/java/com/hospital/repository/UserRepository.java', type: 'file', size: 700, extension: 'java' },
              ]},
            ]},
          ]},
        ]},
      ]},
      { name: 'test', path: '/src/test', type: 'directory', children: [
        { name: 'java', path: '/src/test/java', type: 'directory', children: [
          { name: 'com', path: '/src/test/java/com', type: 'directory', children: [
            { name: 'hospital', path: '/src/test/java/com/hospital', type: 'directory', children: [
              { name: 'service', path: '/src/test/java/com/hospital/service', type: 'directory', children: [
                { name: 'AuthServiceTest.java', path: '/src/test/java/com/hospital/service/AuthServiceTest.java', type: 'file', size: 3200, extension: 'java' },
                { name: 'PatientRegistrationServiceTest.java', path: '/src/test/java/com/hospital/service/PatientRegistrationServiceTest.java', type: 'file', size: 2800, extension: 'java' },
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
  ],
};
