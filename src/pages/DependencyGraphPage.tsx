import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow, Background, Controls, MiniMap,
  type Node, type Edge, type NodeMouseHandler,
  Position, MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as graphService from '@/services/graphService';
import * as codeArtifactService from '@/services/codeArtifactService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { DependencyGraph, CodeArtifact } from '@/types';

const typeColors: Record<string, string> = {
  class: '#3b82f6', method: '#8b5cf6', package: '#10b981',
};
const edgeColors: Record<string, string> = {
  call: '#6366f1', inheritance: '#f59e0b', interface: '#10b981', import: '#94a3b8', field_type: '#ec4899',
};

export default function DependencyGraphPage() {
  const { id } = useParams<{ id: string }>();
  const [graph, setGraph] = useState<DependencyGraph | null>(null);
  const [artifacts, setArtifacts] = useState<CodeArtifact[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([graphService.getDependencyGraph(id), codeArtifactService.getCodeArtifacts(id)])
      .then(([g, a]) => { setGraph(g); setArtifacts(a); setLoading(false); });
  }, [id]);

  const nodes: Node[] = useMemo(() => {
    if (!graph) return [];
    return graph.nodes.map((n, i) => ({
      id: n.id,
      position: { x: 120 + (i % 5) * 220, y: 80 + Math.floor(i / 5) * 160 },
      data: { label: n.label },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: `${typeColors[n.type] || '#6b7280'}15`,
        border: `2px solid ${typeColors[n.type] || '#6b7280'}`,
        borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600,
        minWidth: 140, textAlign: 'center' as const,
      },
    }));
  }, [graph]);

  const edges: Edge[] = useMemo(() => {
    if (!graph) return [];
    return graph.edges.map(e => ({
      id: e.id, source: e.source, target: e.target,
      label: e.type, labelStyle: { fontSize: 9 },
      style: { stroke: edgeColors[e.type] || '#94a3b8', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: edgeColors[e.type] || '#94a3b8' },
      animated: e.type === 'call',
    }));
  }, [graph]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode || !graph) return null;
    const gNode = graph.nodes.find(n => n.id === selectedNode);
    const artifact = artifacts.find(a => a.id === selectedNode);
    const inEdges = graph.edges.filter(e => e.target === selectedNode);
    const outEdges = graph.edges.filter(e => e.source === selectedNode);
    return { gNode, artifact, inEdges, outEdges };
  }, [selectedNode, graph, artifacts]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node.id);
  }, []);

  if (loading) return <Skeleton className="h-[500px] w-full" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Dependency Graph</h2>
        <div className="flex gap-2">
          {Object.entries(edgeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1 text-xs">
              <div className="w-3 h-0.5" style={{ background: color }} />
              <span className="text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graph */}
        <div className="lg:col-span-2 border rounded-lg overflow-hidden" style={{ height: 520 }}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodeClick={onNodeClick}
            fitView fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        </div>

        {/* Detail panel */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNodeData?.gNode ? (
              <div className="space-y-3">
                <div>
                  <p className="font-mono font-semibold text-sm">{selectedNodeData.gNode.label}</p>
                  <Badge variant="secondary" className="mt-1">{selectedNodeData.gNode.type}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{selectedNodeData.gNode.filePath}</p>
                  <p className="text-xs text-muted-foreground">Degree: {selectedNodeData.gNode.degree}</p>
                </div>
                {selectedNodeData.artifact && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">LLM Summary (Simulated)</h4>
                      <p className="text-sm bg-muted rounded p-2">{selectedNodeData.artifact.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Linked Requirements</h4>
                      <p className="text-sm font-semibold">{selectedNodeData.artifact.linkedRequirements}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Incoming Edges ({selectedNodeData.inEdges.length})</h4>
                  {selectedNodeData.inEdges.map(e => (
                    <div key={e.id} className="flex items-center gap-1 text-xs py-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: edgeColors[e.type] }} />
                      <span>{graph?.nodes.find(n => n.id === e.source)?.label}</span>
                      <span className="text-muted-foreground">({e.type})</span>
                    </div>
                  ))}
                  {selectedNodeData.inEdges.length === 0 && <p className="text-xs text-muted-foreground">None</p>}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Outgoing Edges ({selectedNodeData.outEdges.length})</h4>
                  {selectedNodeData.outEdges.map(e => (
                    <div key={e.id} className="flex items-center gap-1 text-xs py-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: edgeColors[e.type] }} />
                      <span>{graph?.nodes.find(n => n.id === e.target)?.label}</span>
                      <span className="text-muted-foreground">({e.type})</span>
                    </div>
                  ))}
                  {selectedNodeData.outEdges.length === 0 && <p className="text-xs text-muted-foreground">None</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click a node in the graph to view its details, including LLM-generated summary and dependencies.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground mt-2">⚠️ This dependency graph is simulated mock data for demonstration purposes.</p>
    </div>
  );
}
