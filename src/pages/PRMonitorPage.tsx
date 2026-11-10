import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as prService from '@/services/prService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GitPullRequest, FileText, MessageSquare, AlertTriangle, Link2, RefreshCw } from 'lucide-react';
import type { PullRequest } from '@/types';

function PRStatusBadge({ status }: { status: PullRequest['status'] }) {
  if (status === 'open') return <Badge className="bg-green-100 text-green-800">Open</Badge>;
  if (status === 'merged') return <Badge className="bg-purple-100 text-purple-800">Merged</Badge>;
  return <Badge variant="secondary">Closed</Badge>;
}

function CommentTypeIcon({ type }: { type: string }) {
  if (type === 'trace_link_suggestion') return <Link2 className="h-4 w-4 text-blue-600" />;
  if (type === 'link_updated') return <RefreshCw className="h-4 w-4 text-amber-600" />;
  return <AlertTriangle className="h-4 w-4 text-orange-600" />;
}

export default function PRMonitorPage() {
  const { id } = useParams<{ id: string }>();
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [selected, setSelected] = useState<PullRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) prService.getPullRequests(id).then(data => { setPrs(data); setLoading(false); });
  }, [id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><GitPullRequest className="h-5 w-5" /> Pull Request Monitor</h2>
        <p className="text-xs text-muted-foreground">⚠️ Simulated PR data</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : prs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <GitPullRequest className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pull requests found. PR monitoring is available for GitHub-sourced projects.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {prs.map(pr => (
            <Card key={pr.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(pr)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">#{pr.number}</span>
                      <span className="font-semibold">{pr.title}</span>
                      <PRStatusBadge status={pr.status} />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>by {pr.author}</span>
                      <span><FileText className="h-3 w-3 inline mr-0.5" />{pr.changedFiles.length} files</span>
                      <span><Link2 className="h-3 w-3 inline mr-0.5" />{pr.affectedLinks} affected links</span>
                      {pr.newLinks > 0 && <span className="text-blue-600">+{pr.newLinks} new links</span>}
                      <span><MessageSquare className="h-3 w-3 inline mr-0.5" />{pr.comments.length} comments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PR Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  #{selected.number} {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mb-3">
                <PRStatusBadge status={selected.status} />
                <Badge variant="outline">by {selected.author}</Badge>
              </div>

              {/* Changed Files */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Changed Files ({selected.changedFiles.length})</h4>
                <div className="space-y-1">
                  {selected.changedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant={f.changeType === 'added' ? 'default' : f.changeType === 'deleted' ? 'destructive' : 'secondary'} className="text-xs">{f.changeType}</Badge>
                        <span className="font-mono text-xs">{f.path}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-green-600">+{f.additions}</span>
                        <span className="text-red-600">-{f.deletions}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selected.changedFiles.some(f => f.affectedMethods.length > 0) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Affected methods: </span>
                    {selected.changedFiles.flatMap(f => f.affectedMethods).join(', ')}
                  </div>
                )}
              </div>

              <Separator />

              {/* Impact Analysis */}
              <div className="my-4">
                <h4 className="font-medium text-sm mb-1">Impact Analysis (Simulated)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold text-amber-600">{selected.affectedLinks}</div>
                    <p className="text-xs text-muted-foreground">Re-evaluated Links</p>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold text-blue-600">{selected.newLinks}</div>
                    <p className="text-xs text-muted-foreground">New Link Suggestions</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* PR Comments */}
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">ReqLink Bot Comments (Simulated)</h4>
                <div className="space-y-3">
                  {selected.comments.map(comment => (
                    <div key={comment.id} className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CommentTypeIcon type={comment.type} />
                        <Badge variant="outline" className="text-xs">
                          {comment.type === 'trace_link_suggestion' ? 'New Link' : comment.type === 'link_updated' ? 'Link Updated' : 'Warning'}
                        </Badge>
                      </div>
                      <div className="text-sm whitespace-pre-line">{comment.content}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">⚠️ All PR activities and bot comments are simulated for demonstration.</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
