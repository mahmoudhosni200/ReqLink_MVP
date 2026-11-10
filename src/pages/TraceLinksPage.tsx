import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTraceLinkStore } from '@/store/useTraceLinkStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, CheckCircle2, XCircle, Clock, ArrowUpDown, X } from 'lucide-react';
import { formatConfidence, confidenceColor } from '@/lib/utils';
import type { TraceLink, TraceLinkDecision } from '@/types';

function DecisionBadge({ decision }: { decision: TraceLinkDecision }) {
  if (decision === 'accepted') return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Accepted</Badge>;
  if (decision === 'rejected') return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
  return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
}

function RetrievalBadge({ method }: { method: string }) {
  return <Badge variant="outline" className="text-xs">{method === 'semantic_seed' ? '🎯 Semantic' : '🔗 Graph'}</Badge>;
}

export default function TraceLinksPage() {
  const { id } = useParams<{ id: string }>();
  const { traceLinks, selectedLink, filters, isLoading, loadTraceLinks, selectLink, updateDecision, setFilters, resetFilters, applyFilters } = useTraceLinkStore();
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => { if (id) loadTraceLinks(id); }, [id, loadTraceLinks]);

  const handleFilter = () => { if (id) applyFilters(id); };
  const handleReset = () => { resetFilters(); if (id) loadTraceLinks(id); };

  const openDetail = (link: TraceLink) => { selectLink(link); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); selectLink(null); };

  const handleDecision = async (linkId: string, decision: TraceLinkDecision) => {
    await updateDecision(linkId, decision);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trace Links ({traceLinks.length})</h2>
        <p className="text-xs text-muted-foreground">⚠️ Simulated trace link data for demonstration</p>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search requirements, artifacts..." className="pl-9" value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })} />
              </div>
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Decision</label>
              <Select value={filters.decision || 'all'} onValueChange={v => setFilters({ decision: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Retrieval</label>
              <Select value={filters.retrievalMethod || 'all'} onValueChange={v => setFilters({ retrievalMethod: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="semantic_seed">Semantic</SelectItem>
                  <SelectItem value="graph_expansion">Graph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="text-xs text-muted-foreground mb-1 block">Sort By</label>
              <Select value={filters.sortBy || 'confidence'} onValueChange={v => setFilters({ sortBy: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="confidence">Confidence</SelectItem>
                  <SelectItem value="requirement">Requirement</SelectItem>
                  <SelectItem value="artifact">Artifact</SelectItem>
                  <SelectItem value="decision">Decision</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleFilter}><Filter className="h-3.5 w-3.5 mr-1" />Apply</Button>
            <Button size="sm" variant="ghost" onClick={handleReset}><X className="h-3.5 w-3.5 mr-1" />Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Requirement</TableHead>
                <TableHead>Code Artifact</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead className="w-28">Confidence</TableHead>
                <TableHead className="w-24">Retrieval</TableHead>
                <TableHead className="w-28">Decision</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traceLinks.map(link => (
                <TableRow key={link.id} className="cursor-pointer hover:bg-accent/50" onClick={() => openDetail(link)}>
                  <TableCell><Badge variant="outline">{link.requirementIdentifier}</Badge></TableCell>
                  <TableCell className="font-mono text-sm">{link.codeArtifactName}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{link.codeArtifactType}</Badge></TableCell>
                  <TableCell><span className={`font-semibold ${confidenceColor(link.confidence)}`}>{formatConfidence(link.confidence)}</span></TableCell>
                  <TableCell><RetrievalBadge method={link.retrievalMethod} /></TableCell>
                  <TableCell><DecisionBadge decision={link.decision} /></TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button size="sm" variant={link.decision === 'accepted' ? 'default' : 'outline'} className="h-7 px-2 text-xs" onClick={() => handleDecision(link.id, 'accepted')}>
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant={link.decision === 'rejected' ? 'destructive' : 'outline'} className="h-7 px-2 text-xs" onClick={() => handleDecision(link.id, 'rejected')}>
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {traceLinks.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No trace links match the current filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={v => { if (!v) closeDetail(); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedLink && (
            <>
              <DialogHeader>
                <DialogTitle>Trace Link Detail</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Requirement</h4>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline">{selectedLink.requirementIdentifier}</Badge>
                    <p className="text-sm">{selectedLink.requirementText}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Code Artifact</h4>
                  <p className="font-mono text-sm font-semibold">{selectedLink.codeArtifactName}</p>
                  <p className="text-xs text-muted-foreground">{selectedLink.codeArtifactPath}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{selectedLink.codeArtifactType}</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Confidence</h4>
                    <span className={`text-2xl font-bold ${confidenceColor(selectedLink.confidence)}`}>{formatConfidence(selectedLink.confidence)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Retrieval Method</h4>
                    <RetrievalBadge method={selectedLink.retrievalMethod} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Decision</h4>
                    <DecisionBadge decision={selectedLink.decision} />
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">LLM Explanation (Simulated)</h4>
                  <p className="text-sm bg-muted rounded-md p-3">{selectedLink.explanation}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" variant={selectedLink.decision === 'accepted' ? 'default' : 'outline'} onClick={() => handleDecision(selectedLink.id, 'accepted')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Link
                  </Button>
                  <Button className="flex-1" variant={selectedLink.decision === 'rejected' ? 'destructive' : 'outline'} onClick={() => handleDecision(selectedLink.id, 'rejected')}>
                    <XCircle className="mr-2 h-4 w-4" /> Reject Link
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">Accept/reject decisions persist across page refreshes.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
