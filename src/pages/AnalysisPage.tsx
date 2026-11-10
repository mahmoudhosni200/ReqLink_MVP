import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Loader2, Circle, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import type { AnalysisStageStatus } from '@/types';

function StageIcon({ status }: { status: AnalysisStageStatus }) {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case 'running': return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    case 'error': return <AlertCircle className="h-5 w-5 text-destructive" />;
    default: return <Circle className="h-5 w-5 text-muted-foreground/40" />;
  }
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysisState, isRunning, startAnalysis, restartAnalysis, cleanup } = useAnalysisStore();
  const loadProject = useProjectStore(s => s.loadProject);
  const currentProject = useProjectStore(s => s.currentProject);

  useEffect(() => {
    if (id) loadProject(id);
  }, [id, loadProject]);

  useEffect(() => {
    // Only auto-start for projects that aren't already completed
    if (id && !analysisState && !isRunning && currentProject && currentProject.status !== 'completed') {
      startAnalysis(id);
    }
  }, [id, analysisState, isRunning, startAnalysis, currentProject]);

  useEffect(() => {
    return () => { /* keep state so user can navigate back */ };
  }, []);

  const isCompleted = analysisState?.isCompleted;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Analysis Pipeline</h1>
        <p className="text-muted-foreground">
          {currentProject?.name || 'Project'} — {isCompleted ? 'Analysis Complete' : isRunning ? 'Running...' : 'Initializing...'}
        </p>
      </div>

      {/* Overall progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{analysisState?.overallProgress ?? 0}%</span>
          </div>
          <Progress value={analysisState?.overallProgress ?? 0} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ This is a simulated analysis pipeline — no actual AI processing is occurring.
          </p>
        </CardContent>
      </Card>

      {/* Pipeline stages */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Stages</CardTitle>
          <CardDescription>Seven-stage traceability analysis pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {analysisState?.stages.map((stage, i) => (
              <div key={stage.id}>
                <div className="flex items-start gap-3 py-3">
                  <StageIcon status={stage.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{stage.name}</span>
                      <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'running' ? 'secondary' : 'outline'} className="text-xs">
                        {stage.status === 'running' ? `${stage.progress}%` : stage.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    {stage.status === 'running' && <Progress value={stage.progress} className="h-1.5 mt-2" />}
                    {stage.status === 'completed' && stage.detail && (
                      <p className="text-xs text-green-700 mt-1">✓ {stage.detail}</p>
                    )}
                  </div>
                </div>
                {i < (analysisState?.stages.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={() => { if (id) restartAnalysis(id); }}>
          <RotateCcw className="mr-2 h-4 w-4" /> Restart Analysis
        </Button>
        {isCompleted ? (
          <Button onClick={() => { cleanup(); navigate(`/projects/${id}`); }}>
            View Results <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : currentProject?.status === 'completed' && !isRunning ? (
          <Button onClick={() => navigate(`/projects/${id}`)}>
            View Results <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
