import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as requirementService from '@/services/requirementService';
import * as traceLinkService from '@/services/traceLinkService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, Link2 } from 'lucide-react';
import { formatConfidence, confidenceColor } from '@/lib/utils';
import type { Requirement, TraceLink } from '@/types';

export default function RequirementsViewPage() {
  const { id } = useParams<{ id: string }>();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [allLinks, setAllLinks] = useState<TraceLink[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Requirement | null>(null);

  useEffect(() => {
    if (!id) return;
    requirementService.getRequirements(id).then(setRequirements);
    traceLinkService.getTraceLinks(id).then(setAllLinks);
  }, [id]);

  const filtered = requirements.filter(r =>
    r.identifier.toLowerCase().includes(search.toLowerCase()) ||
    r.text.toLowerCase().includes(search.toLowerCase())
  );

  const linksForReq = (reqId: string) => allLinks.filter(l => l.requirementId === reqId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5" /> Requirements ({requirements.length})</h2>
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search requirements..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Requirement Text</TableHead>
              <TableHead className="w-24">Source</TableHead>
              <TableHead className="w-32">Linked Artifacts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(req => (
              <TableRow key={req.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelected(req)}>
                <TableCell><Badge variant="outline">{req.identifier}</Badge></TableCell>
                <TableCell className="text-sm">{req.text}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{req.source}</TableCell>
                <TableCell><Badge variant="secondary"><Link2 className="h-3 w-3 mr-1" />{req.linkedArtifacts}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.identifier}: Requirement Detail</DialogTitle></DialogHeader>
              <p className="text-sm mt-2">{selected.text}</p>
              <p className="text-xs text-muted-foreground">Source: {selected.source}</p>
              <Separator className="my-3" />
              <h4 className="text-sm font-medium mb-2">Linked Code Artifacts</h4>
              {linksForReq(selected.id).length === 0 ? (
                <p className="text-sm text-muted-foreground">No trace links found for this requirement.</p>
              ) : (
                <div className="space-y-2">
                  {linksForReq(selected.id).map(link => (
                    <div key={link.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-semibold">{link.codeArtifactName}</span>
                        <span className={`text-sm font-bold ${confidenceColor(link.confidence)}`}>{formatConfidence(link.confidence)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{link.codeArtifactPath}</p>
                      <p className="text-xs mt-1">{link.explanation}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={link.decision === 'accepted' ? 'default' : link.decision === 'rejected' ? 'destructive' : 'secondary'} className="text-xs">{link.decision}</Badge>
                        <Badge variant="outline" className="text-xs">{link.retrievalMethod === 'semantic_seed' ? 'Semantic' : 'Graph'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">⚠️ Simulated data for demonstration.</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
