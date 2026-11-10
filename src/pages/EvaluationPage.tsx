import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as evaluationService from '@/services/evaluationService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BarChart3, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { EvaluationResult, ResearchQuestion, BenchmarkDataset } from '@/types';

const CONFIG_COLORS: Record<string, string> = { A: '#94a3b8', B: '#f59e0b', C: '#3b82f6', D: '#10b981' };

export default function EvaluationPage() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [rqs, setRqs] = useState<ResearchQuestion[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<BenchmarkDataset | 'all'>('all');

  useEffect(() => {
    if (!id) return;
    evaluationService.getEvaluationResults(id).then(setResults);
    evaluationService.getResearchQuestions(id).then(setRqs);
  }, [id]);

  const filtered = selectedDataset === 'all' ? results : results.filter(r => r.dataset === selectedDataset);

  // Chart data — grouped by dataset
  const datasets: BenchmarkDataset[] = ['eTour', 'iTrust', 'SMOS', 'eAnci'];
  const chartData = datasets.map(ds => {
    const row: any = { dataset: ds };
    results.filter(r => r.dataset === ds).forEach(r => {
      row[`F1_${r.config}`] = r.f1;
    });
    return row;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Evaluation Results</h2>
        <p className="text-xs text-muted-foreground">⚠️ Simulated benchmark data</p>
      </div>

      {/* Config legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { key: 'A', label: 'LiSSA Baseline' },
          { key: 'B', label: 'LiSSA + Preprocessing' },
          { key: 'C', label: 'LiSSA + Graph Retrieval' },
          { key: 'D', label: 'Full ReqLink Pipeline' },
        ].map(c => (
          <Badge key={c.key} variant="outline" className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: CONFIG_COLORS[c.key] }} />
            Config {c.key}: {c.label}
          </Badge>
        ))}
      </div>

      {/* F1 comparison chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">F1 Score Comparison Across Datasets</CardTitle>
          <CardDescription>Ablation study: Configs A → D across eTour, iTrust, SMOS, eAnci</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dataset" />
              <YAxis domain={[0, 0.7]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="F1_A" name="Config A" fill={CONFIG_COLORS.A} radius={[2, 2, 0, 0]} />
              <Bar dataKey="F1_B" name="Config B" fill={CONFIG_COLORS.B} radius={[2, 2, 0, 0]} />
              <Bar dataKey="F1_C" name="Config C" fill={CONFIG_COLORS.C} radius={[2, 2, 0, 0]} />
              <Bar dataKey="F1_D" name="Config D" fill={CONFIG_COLORS.D} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed metrics table */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Detailed Metrics</CardTitle>
          <Select value={selectedDataset} onValueChange={v => setSelectedDataset(v as any)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Datasets</SelectItem>
              {datasets.map(ds => <SelectItem key={ds} value={ds}>{ds}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset</TableHead>
                <TableHead>Config</TableHead>
                <TableHead>Precision</TableHead>
                <TableHead>Recall</TableHead>
                <TableHead>F1</TableHead>
                <TableHead>F2</TableHead>
                <TableHead>MAP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.dataset}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ borderColor: CONFIG_COLORS[r.config] }}>
                      {r.config}: {r.configLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{(r.precision * 100).toFixed(1)}%</TableCell>
                  <TableCell>{(r.recall * 100).toFixed(1)}%</TableCell>
                  <TableCell className="font-semibold">{(r.f1 * 100).toFixed(1)}%</TableCell>
                  <TableCell>{(r.f2 * 100).toFixed(1)}%</TableCell>
                  <TableCell>{r.map ? `${(r.map * 100).toFixed(1)}%` : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Research Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research Questions</CardTitle>
          <CardDescription>Findings from the ablation study (simulated)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rqs.map(rq => (
            <div key={rq.id} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                {rq.supported ? <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /> : <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />}
                <div>
                  <h4 className="font-medium text-sm mb-1">{rq.id}: {rq.question}</h4>
                  <p className="text-sm text-muted-foreground">{rq.finding}</p>
                  <Badge variant={rq.supported ? 'default' : 'secondary'} className="mt-2 text-xs">{rq.supported ? 'Supported' : 'Partially Supported'}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
