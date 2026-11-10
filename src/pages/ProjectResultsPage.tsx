import { useEffect, useState } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { useProjectStore } from '@/store/useProjectStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, FileText, Code2, GitBranch, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProjectResultsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentProject, isLoading, loadProject } = useProjectStore();

  useEffect(() => { if (id) loadProject(id); }, [id, loadProject]);

  if (isLoading || !currentProject) {
    return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><Skeleton className="h-48 w-full" /><Skeleton className="h-96 w-full mt-4" /></div>;
  }

  const stats = currentProject.stats;
  const isGithub = currentProject.codeSource === 'github';
  const isBenchmark = currentProject.type === 'benchmark';

  // Determine active tab from path
  const pathEnd = location.pathname.split(`/projects/${id}`)[1] || '';
  const activeTab = pathEnd.startsWith('/trace-links') ? 'trace-links'
    : pathEnd.startsWith('/requirements') ? 'requirements'
    : pathEnd.startsWith('/code') ? 'code'
    : pathEnd.startsWith('/pull-requests') ? 'pull-requests'
    : pathEnd.startsWith('/evaluation') ? 'evaluation'
    : 'overview';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Project header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <Badge variant="outline">{currentProject.status}</Badge>
          {isBenchmark && <Badge>Benchmark — {currentProject.benchmarkDataset}</Badge>}
        </div>
        <p className="text-muted-foreground text-sm">{currentProject.description}</p>
        <p className="text-xs text-muted-foreground mt-1">Created {formatDate(currentProject.createdAt)}{currentProject.completedAt ? ` · Completed ${formatDate(currentProject.completedAt)}` : ''}</p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Requirements', value: stats.totalRequirements, icon: FileText },
            { label: 'Code Artifacts', value: stats.totalCodeArtifacts, icon: Code2 },
            { label: 'Trace Links', value: stats.totalTraceLinks, icon: Link2 },
            { label: 'AI Accepted', value: stats.acceptedLinks, icon: Link2 },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="text-xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation tabs */}
      <Tabs value={activeTab} className="mb-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" asChild><Link to={`/projects/${id}`}>Overview</Link></TabsTrigger>
          <TabsTrigger value="trace-links" asChild><Link to={`/projects/${id}/trace-links`}>Trace Links</Link></TabsTrigger>
          <TabsTrigger value="requirements" asChild><Link to={`/projects/${id}/requirements`}>Requirements</Link></TabsTrigger>
          <TabsTrigger value="code" asChild><Link to={`/projects/${id}/code`}>Code Artifacts</Link></TabsTrigger>
          {isGithub && <TabsTrigger value="pull-requests" asChild><Link to={`/projects/${id}/pull-requests`}>PR Monitor</Link></TabsTrigger>}
          {isBenchmark && <TabsTrigger value="evaluation" asChild><Link to={`/projects/${id}/evaluation`}>Evaluation</Link></TabsTrigger>}
        </TabsList>
      </Tabs>

      {/* Tab content or Overview */}
      {activeTab === 'overview' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Link to={`/projects/${id}/trace-links`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Trace Links</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Explore {stats?.totalTraceLinks} AI-verified requirement-to-code trace links with explanations.</p></CardContent>
            </Card>
          </Link>
          <Link to={`/projects/${id}/requirements`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Requirements</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Browse {stats?.totalRequirements} extracted functional requirements and their linked artifacts.</p></CardContent>
            </Card>
          </Link>
          <Link to={`/projects/${id}/code`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code2 className="h-4 w-4 text-primary" /> Code Artifacts</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Browse {stats?.totalCodeArtifacts} parsed code units with LLM-generated summaries.</p></CardContent>
            </Card>
          </Link>
          {isGithub && (
            <Link to={`/projects/${id}/pull-requests`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><GitBranch className="h-4 w-4 text-primary" /> PR Monitor</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Monitor pull requests and incremental trace link maintenance.</p></CardContent>
              </Card>
            </Link>
          )}
          {isBenchmark && (
            <Link to={`/projects/${id}/evaluation`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Evaluation</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Benchmark results across configurations A–D with research question findings.</p></CardContent>
              </Card>
            </Link>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
