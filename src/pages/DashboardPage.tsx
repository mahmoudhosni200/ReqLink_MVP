import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/useProjectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderOpen, Trash2, GitBranch, Link2, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

function statusBadge(status: Project['status']) {
  const map = { created: 'secondary', analyzing: 'default', completed: 'default', error: 'destructive' } as const;
  return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
}

export default function DashboardPage() {
  const { projects, isLoading, loadProjects, deleteProject } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => { loadProjects(); }, [loadProjects]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your traceability analysis projects</p>
        </div>
        <Link to="/projects/new">
          <Button><Plus className="mr-2 h-4 w-4" /> New Project</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Total Projects</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">{projects.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Completed Analyses</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">{projects.filter(p => p.status === 'completed').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Total Trace Links</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">{projects.reduce((sum, p) => sum + (p.stats?.totalTraceLinks || 0), 0)}</div></CardContent>
        </Card>
      </div>

      {/* Projects list */}
      {isLoading ? (
        <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first traceability analysis project.</p>
            <Link to="/projects/new"><Button>Create Project</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
              if (project.status === 'completed') navigate(`/projects/${project.id}`);
              else if (project.status === 'created') navigate(`/projects/${project.id}/analysis`);
            }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                      {statusBadge(project.status)}
                      {project.type === 'benchmark' && <Badge variant="outline">Benchmark</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {project.codeSource === 'github' ? <GitBranch className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        {project.codeSource === 'github' ? 'GitHub' : 'File Upload'}
                      </span>
                      <span>Created {formatDate(project.createdAt)}</span>
                      {project.stats && (
                        <>
                          <span className="flex items-center gap-1"><Link2 className="h-3 w-3" />{project.stats.totalTraceLinks} links</span>
                          <span className="flex items-center gap-1"><Link2 className="h-3 w-3 text-green-600" />{project.stats.acceptedLinks} accepted</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive"
                    onClick={e => { e.stopPropagation(); deleteProject(project.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
