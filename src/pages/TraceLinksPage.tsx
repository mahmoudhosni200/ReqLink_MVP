import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTraceLinkStore } from '@/store/useTraceLinkStore';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, CheckCircle2, X } from 'lucide-react';
import type { TraceLink } from '@/types';

function RetrievalBadge({ method }: { method: string }) {
  return (
    <Badge variant="outline" className="text-xs">
      {method === 'semantic_seed' ? '🎯 Semantic' : '🔗 Graph'}
    </Badge>
  );
}

export default function TraceLinksPage() {
  const { id } = useParams<{ id: string }>();
  const { traceLinks, selectedLink, filters, isLoading, loadTraceLinks, selectLink, setFilters, resetFilters, applyFilters } = useTraceLinkStore();
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => { if (id) loadTraceLinks(id); }, [id, loadTraceLinks]);

  const handleFilter = () => { if (id) applyFilters(id); };
  const handleReset = () => { resetFilters(); if (id) loadTraceLinks(id); };

  const openDetail = (link: TraceLink) => { selectLink(link); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); selectLink(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          AI-Accepted Trace Links ({traceLinks.length})
        </h2>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-xs text-muted-foreground">All links verified and accepted by AI</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requirements, artifacts..."
                  className="pl-9"
                  value={filters.search || ''}
                  onChange={e => setFilters({ search: e.target.value })}
                />
              </div>
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Retrieval Method</label>
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
              <Select value={filters.sortBy || 'requirement'} onValueChange={v => setFilters({ sortBy: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="requirement">Requirement</SelectItem>
                  <SelectItem value="artifact">Artifact</SelectItem>
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
                <TableHead className="w-28">Retrieval</TableHead>
                <TableHead className="w-28">AI Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : traceLinks.map(link => (
                <TableRow key={link.id} className="cursor-pointer hover:bg-accent/50" onClick={() => openDetail(link)}>
                  <TableCell><Badge variant="outline">{link.requirementIdentifier}</Badge></TableCell>
                  <TableCell className="font-mono text-sm">{link.codeArtifactName}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{link.codeArtifactType}</Badge></TableCell>
                  <TableCell><RetrievalBadge method={link.retrievalMethod} /></TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />Accepted
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && traceLinks.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No trace links match the current filters.</TableCell></TableRow>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Retrieval Method</h4>
                    <RetrievalBadge method={selectedLink.retrievalMethod} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">AI Decision</h4>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />Accepted
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">AI Explanation</h4>
                  <p className="text-sm bg-muted rounded-md p-3">{selectedLink.explanation}</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">⚠️ Simulated trace link data for demonstration.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
