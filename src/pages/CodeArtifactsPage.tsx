import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as codeArtifactService from '@/services/codeArtifactService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Code2, Link2 } from 'lucide-react';
import type { CodeArtifact, CodeArtifactType } from '@/types';

export default function CodeArtifactsPage() {
  const { id } = useParams<{ id: string }>();
  const [artifacts, setArtifacts] = useState<CodeArtifact[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CodeArtifactType | 'all'>('all');
  const [selected, setSelected] = useState<CodeArtifact | null>(null);

  useEffect(() => {
    if (id) codeArtifactService.getCodeArtifacts(id).then(setArtifacts);
  }, [id]);

  const filtered = artifacts.filter(a =>
    (typeFilter === 'all' || a.type === typeFilter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) ||
     a.qualifiedName.toLowerCase().includes(search.toLowerCase()) ||
     a.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Code2 className="h-5 w-5" /> Code Artifacts ({artifacts.length})</h2>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search artifacts..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={v => setTypeFilter(v as any)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="class">Class</SelectItem>
            <SelectItem value="method">Method</SelectItem>
            <SelectItem value="package">Package</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Qualified Name</TableHead>
              <TableHead className="w-20">Type</TableHead>
              <TableHead className="w-20">Lang</TableHead>
              <TableHead className="w-20">Lines</TableHead>
              <TableHead className="w-28">Linked Reqs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelected(a)}>
                <TableCell className="font-mono text-sm font-semibold">{a.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground truncate max-w-[250px]">{a.qualifiedName}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{a.type}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{a.language}</Badge></TableCell>
                <TableCell className="text-xs">{a.lineStart}–{a.lineEnd}</TableCell>
                <TableCell><Badge variant="secondary"><Link2 className="h-3 w-3 mr-1" />{a.linkedRequirements}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="font-mono">{selected.name}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selected.type}</Badge>
                  <Badge variant="outline">{selected.language}</Badge>
                  <Badge variant="outline">Lines {selected.lineStart}–{selected.lineEnd}</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Qualified Name</h4>
                  <p className="text-sm font-mono">{selected.qualifiedName}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">File Path</h4>
                  <p className="text-sm font-mono text-muted-foreground">{selected.filePath}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">LLM-Generated Summary (Simulated)</h4>
                  <p className="text-sm bg-muted rounded-md p-3">{selected.summary}</p>
                </div>
                <p className="text-xs text-muted-foreground">Linked Requirements: {selected.linkedRequirements}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
