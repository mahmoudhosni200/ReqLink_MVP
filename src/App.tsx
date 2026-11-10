import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import NewProjectPage from '@/pages/NewProjectPage';
import AnalysisPage from '@/pages/AnalysisPage';
import ProjectResultsPage from '@/pages/ProjectResultsPage';
import TraceLinksPage from '@/pages/TraceLinksPage';
import DependencyGraphPage from '@/pages/DependencyGraphPage';
import RequirementsViewPage from '@/pages/RequirementsViewPage';
import CodeArtifactsPage from '@/pages/CodeArtifactsPage';
import PRMonitorPage from '@/pages/PRMonitorPage';
import EvaluationPage from '@/pages/EvaluationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — full screen, no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id/analysis" element={<AnalysisPage />} />

          {/* Project results with nested tab routes */}
          <Route path="/projects/:id" element={<ProjectResultsPage />}>
            <Route path="trace-links" element={<TraceLinksPage />} />
            <Route path="graph" element={<DependencyGraphPage />} />
            <Route path="requirements" element={<RequirementsViewPage />} />
            <Route path="code" element={<CodeArtifactsPage />} />
            <Route path="pull-requests" element={<PRMonitorPage />} />
            <Route path="evaluation" element={<EvaluationPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
