import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useProjectStore } from '@/store/useProjectStore';
import {
  LayoutDashboard,
  FolderPlus,
  GitBranch,
  Link2,
  FileText,
  Code2,
  BarChart3,
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';

const mainNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects/new', label: 'New Project', icon: FolderPlus },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const currentProject = useProjectStore(s => s.currentProject);

  // Check if we are inside a project view: /projects/:id...
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/);
  const activeProjectId = projectMatch && projectMatch[1] !== 'new' ? projectMatch[1] : null;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <Link to="/" className="flex items-center gap-2 px-6 py-5 border-b">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Link2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">ReqLink</span>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Main</p>
          {mainNavItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                (to === '/dashboard' && pathname === '/dashboard') || (to === '/projects/new' && pathname === '/projects/new')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {activeProjectId && currentProject && (
          <div className="space-y-1 pt-2 border-t">
            <div className="px-3 pb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project</p>
              <p className="text-xs font-medium text-foreground truncate mt-0.5">{currentProject.name}</p>
            </div>
            {[
              { to: `/projects/${activeProjectId}`, label: 'Overview', icon: LayoutDashboard, exact: true },
              { to: `/projects/${activeProjectId}/trace-links`, label: 'Trace Links', icon: Link2 },
              { to: `/projects/${activeProjectId}/requirements`, label: 'Requirements', icon: FileText },
              { to: `/projects/${activeProjectId}/code`, label: 'Code Artifacts', icon: Code2 },
              ...(currentProject.codeSource === 'github' ? [
                { to: `/projects/${activeProjectId}/pull-requests`, label: 'PR Monitor', icon: GitPullRequest }
              ] : []),
              ...(currentProject.type === 'benchmark' ? [
                { to: `/projects/${activeProjectId}/evaluation`, label: 'Evaluation', icon: BarChart3 }
              ] : []),
            ].map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link key={to} to={to}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
      <div className="px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Prototype v0.1 — Simulated</span>
        </div>
      </div>
    </aside>
  );
}
