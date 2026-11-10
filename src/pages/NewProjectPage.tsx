import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/useProjectStore';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Github, FileText, FolderTree, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { CodeSourceType, CreateProjectData, FileTreeNode } from '@/types';
import { mockFileTree } from '@/data/mockFileTree';

// File tree renderer for ZIP preview
function FileTree({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === 'directory';
  return (
    <div>
      <div className="flex items-center gap-1 py-0.5 hover:bg-accent/50 rounded cursor-pointer"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => isDir && setOpen(!open)}>
        {isDir ? (
          <FolderTree className="h-3.5 w-3.5 text-primary shrink-0" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <span className={`text-sm ${isDir ? 'font-medium' : ''}`}>{node.name}</span>
        {node.extension === 'java' && <Badge variant="outline" className="text-[10px] py-0 ml-1">Java</Badge>}
      </div>
      {isDir && open && node.children?.map(child => (
        <FileTree key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function NewProjectPage() {
  const navigate = useNavigate();
  const createProject = useProjectStore(s => s.createProject);
  const startAnalysis = useAnalysisStore(s => s.startAnalysis);
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [codeSource, setCodeSource] = useState<CodeSourceType>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [requirementsFileName, setRequirementsFileName] = useState('');
  const [showFileTree, setShowFileTree] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<{ id: string; text: string }[]>([]);
  const [isRealExtraction, setIsRealExtraction] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!name.trim()) e.name = 'Project name is required';
    } else if (s === 2) {
      if (!requirementsFileName) e.requirements = 'Requirements file is required';
    } else if (s === 3) {
      if (codeSource === 'github' && !githubUrl.trim()) e.github = 'Repository URL is required';
      if (codeSource === 'github' && githubUrl && !/^https:\/\/github\.com\/.+\/.+/.test(githubUrl)) e.github = 'Enter a valid GitHub URL (https://github.com/owner/repo)';
      if (codeSource === 'upload' && !uploadedFileName) e.upload = 'Please upload source code files';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 4)); };
  const prevStep = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

  const handleReqUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExts = ['.docx', '.pdf', '.txt'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExts.includes(ext)) {
        setErrors(prev => ({ ...prev, requirements: 'Only .docx, .pdf, and .txt files are accepted' }));
        return;
      }
      setRequirementsFileName(file.name);
      setErrors(prev => { const { requirements, ...rest } = prev; return rest; });

      if (ext === '.txt') {
        try {
          const rawText = await file.text();
          const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 10);
          if (lines.length > 0) {
            const parsed = lines.slice(0, 8).map((line, idx) => ({
              id: `FR-${String(idx + 1).padStart(2, '0')}`,
              text: line.replace(/^(FR-?\d+:?|R-?\d+:?|\d+\.?)\s*/i, ''),
            }));
            setExtractedPreview(parsed);
            setIsRealExtraction(true);
            toast.success(`Successfully read ${lines.length} requirements from "${file.name}"`);
            return;
          }
        } catch {
          // fallback to simulated preview if reading fails
        }
      }

      setIsRealExtraction(false);
      setExtractedPreview([
        { id: 'FR-01', text: 'The system shall allow patients to register with personal details and insurance ID' },
        { id: 'FR-02', text: 'The system shall authenticate users with role-based access control (admin, doctor, nurse)' },
        { id: 'FR-03', text: 'The system shall allow doctors to create, update, and view patient medical records' },
        { id: 'FR-04', text: 'The system shall enable patients to book, reschedule, and cancel appointments' },
      ]);
      toast.success(`Requirements file "${file.name}" selected`);
    }
  }, []);

  const handleCodeUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setShowFileTree(file.name.endsWith('.zip'));
      setErrors(prev => { const { upload, ...rest } = prev; return rest; });
      toast.success(`Source code "${file.name}" selected`);
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    const data: CreateProjectData = {
      name,
      description,
      type: 'standard',
      codeSource,
      githubUrl: codeSource === 'github' ? githubUrl : undefined,
      uploadedFileName: codeSource === 'upload' ? uploadedFileName : undefined,
      requirementsFileName,
      language: 'java',
      enableExperimentalC: false,
    };
    const project = await createProject(data);
    toast.success('Project created! Starting analysis...');
    await startAnalysis(project.id);
    navigate(`/projects/${project.id}/analysis`);
  };

  const stepProgress = (step / 4) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">Step {step} of 4</p>
        <Progress value={stepProgress} className="mt-3 h-2" />
      </div>

      {/* Step 1: Project Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Name and describe your traceability analysis project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Hospital Management System" className="mt-1" />
              {errors.name && <p className="text-sm text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the project..." className="mt-1" rows={3} />
            </div>
            <div>
              <Label>Project Type</Label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="font-medium">Standard Project</Badge>
                <span className="text-xs text-muted-foreground">Traceability analysis connecting natural-language requirements to source code</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Requirements Upload */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Requirements</CardTitle>
            <CardDescription>Upload your Software Requirements Specification file. Accepted formats: .docx, .pdf, .txt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">
                {requirementsFileName ? requirementsFileName : 'Click or drag to upload requirements file'}
              </p>
              <p className="text-xs text-muted-foreground mb-3">.docx, .pdf, or .txt — Required for analysis</p>
              <input type="file" accept=".docx,.pdf,.txt" onChange={handleReqUpload} className="hidden" id="req-upload" />
              <Button variant="outline" asChild><label htmlFor="req-upload" className="cursor-pointer">Choose File</label></Button>
              {requirementsFileName && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex items-center gap-2">
                  <Check className="h-4 w-4" /> File selected: {requirementsFileName}
                </div>
              )}
            </div>
            {errors.requirements && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.requirements}</p>}

            {/* Preview of extracted requirements */}
            {requirementsFileName && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {isRealExtraction ? 'Extracted Requirements Preview (Client-Side Read)' : 'Extracted Requirements Preview (Simulated)'}
                  </h4>
                  <Badge variant={isRealExtraction ? 'default' : 'outline'} className="text-xs">
                    {isRealExtraction ? 'Browser Text Parse' : 'Simulated Demonstration'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {isRealExtraction
                    ? 'Requirements parsed directly from your plain-text document in the browser.'
                    : '⚠️ DOCX/PDF binary parsing is handled by backend NLP services. Showing simulated extraction preview for prototype demonstration.'}
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(extractedPreview.length > 0 ? extractedPreview : [
                    { id: 'FR-01', text: 'The system shall allow patients to register with personal details and insurance ID' },
                    { id: 'FR-02', text: 'The system shall authenticate users with role-based access control (admin, doctor, nurse)' },
                    { id: 'FR-03', text: 'The system shall allow doctors to create, update, and view patient medical records' },
                    { id: 'FR-04', text: 'The system shall enable patients to book, reschedule, and cancel appointments' },
                  ]).map((item) => (
                    <div key={item.id} className="text-sm p-2 bg-muted rounded flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0 font-mono text-xs">{item.id}</Badge>
                      <span className="truncate">{item.text}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground italic">...and more requirements extracted for analysis</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Code Source */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Source Code Input</CardTitle>
            <CardDescription>Provide the source code to analyze. Choose one method.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={codeSource} onValueChange={v => { setCodeSource(v as CodeSourceType); setErrors({}); }} className="grid grid-cols-2 gap-4">
              <label htmlFor="cs-github" className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${codeSource === 'github' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="github" id="cs-github" />
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHub Repository</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">Provide a GitHub URL to clone</p>
              </label>
              <label htmlFor="cs-upload" className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${codeSource === 'upload' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="upload" id="cs-upload" />
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload Files</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">Upload a ZIP archive or source files</p>
              </label>
            </RadioGroup>

            {codeSource === 'github' && (
              <div>
                <Label htmlFor="github-url">GitHub Repository URL *</Label>
                <Input id="github-url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/owner/repository" className="mt-1" />
                {errors.github && <p className="text-sm text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.github}</p>}
                <p className="text-xs text-muted-foreground mt-1">The repository will be cloned for analysis. PR monitoring will be available.</p>
              </div>
            )}

            {codeSource === 'upload' && (
              <div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">{uploadedFileName || 'Upload source code ZIP or files'}</p>
                  <p className="text-xs text-muted-foreground mb-3">.zip archive or Java source files</p>
                  <input type="file" accept=".zip,.java,.c,.h" onChange={handleCodeUpload} className="hidden" id="code-upload" />
                  <Button variant="outline" asChild><label htmlFor="code-upload" className="cursor-pointer">Choose File</label></Button>
                </div>
                {errors.upload && <p className="text-sm text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.upload}</p>}

                {/* ZIP file tree preview */}
                {showFileTree && (
                  <div className="border rounded-lg p-4 mt-3">
                    <h4 className="font-medium mb-2 flex items-center gap-2"><FolderTree className="h-4 w-4" /> Archive Structure Preview</h4>
                    <p className="text-xs text-muted-foreground mb-2">Simulated view of the uploaded archive contents.</p>
                    <div className="max-h-64 overflow-y-auto bg-muted/50 rounded p-2">
                      <FileTree node={mockFileTree} />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Note: PR monitoring is not available for uploaded projects.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Start */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Start Analysis</CardTitle>
            <CardDescription>Review your project configuration before starting the analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {[
                ['Project Name', name],
                ['Project Type', 'Standard Project'],
                ['Requirements File', requirementsFileName],
                ['Code Source', codeSource === 'github' ? `GitHub: ${githubUrl}` : `Upload: ${uploadedFileName}`],
                ['Language', 'Java'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium max-w-[60%] text-right truncate">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 mb-4">
              ⚠️ This is a prototype demonstration. The analysis will be simulated — no actual AI processing will occur.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {step < 4 ? (
          <Button onClick={nextStep}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
