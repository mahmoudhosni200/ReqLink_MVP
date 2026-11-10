import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Link2, GitBranch, Brain, BarChart3, Zap, Shield } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AST-Based Code Understanding', desc: 'Parses source code into semantic units with hierarchical LLM-generated summaries.' },
  { icon: GitBranch, title: 'Dependency Graph Analysis', desc: 'Builds and traverses call, inheritance, and import graphs to discover hidden relationships.' },
  { icon: Zap, title: 'Smart Retrieval Pipeline', desc: 'Combines semantic seed retrieval with graph-based expansion for comprehensive candidate coverage.' },
  { icon: Shield, title: 'LLM Verification', desc: 'Verifies each candidate trace link with confidence scores and natural-language explanations.' },
  { icon: BarChart3, title: 'Benchmark Evaluation', desc: 'Evaluate on standard datasets (eTour, iTrust, SMOS, eAnci) with ablation configurations.' },
  { icon: Link2, title: 'GitHub PR Integration', desc: 'Monitor pull requests, detect changes, and incrementally maintain trace links.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ReqLink</span>
          </div>
          <Link to="/dashboard">
            <Button>Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Zap className="h-3.5 w-3.5" /> AI-Powered Requirements Traceability
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Trace Requirements to Code<br />Automatically
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          ReqLink uses semantic retrieval, code dependency analysis, and LLM verification to
          automatically discover and maintain trace links between natural-language requirements
          and source code artifacts.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">View Demo Project</Button>
          </Link>
        </div>
      </section>

      {/* Pipeline visual */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['1. Parse & Summarize', '2. Build Graph', '3. Retrieve & Expand', '4. Verify Links'].map((step, i) => (
            <div key={i} className="relative rounded-lg border bg-white p-5 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{step.split('.')[0]}.</div>
              <div className="text-sm font-medium">{step.split('. ')[1]}</div>
              {i < 3 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-muted-foreground">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Key Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border bg-white p-6">
              <Icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>ReqLink — Graduation Project Prototype · Frontend Simulation · No actual AI processing</p>
      </footer>
    </div>
  );
}
