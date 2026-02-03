'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIAnalysisSection } from '@/components/lss-tools/insight-form/KPIAnalysisSection';
import { CorrelatedIssuesSection } from '@/components/lss-tools/insight-form/CorrelatedIssuesSection';
import { NewHireSection } from '@/components/lss-tools/insight-form/NewHireSection';
import { ProductKnowledgeSection } from '@/components/lss-tools/insight-form/ProductKnowledgeSection';
import { BottomQuartileSection } from '@/components/lss-tools/insight-form/BottomQuartileSection';
import { LeadershipSummarySection } from '@/components/lss-tools/insight-form/LeadershipSummarySection';

import { Badge } from '@/components/ui/badge';
import { FileCheck, Save, Send } from 'lucide-react';

import { toast } from 'sonner';

export default function NewInsightPage() {
  const [activeTab, setActiveTab] = useState('kpi');
  const [status, setStatus] = useState<'draft' | 'submitted' | 'approved'>('draft');
  const [summary, setSummary] = useState('');

  const handleSubmit = () => {
    if (!summary.trim()) {
      toast.error("Validation Error: Leadership Summary cannot be empty.");
      setActiveTab("summary");
      return;
    }

    setStatus('submitted');
    toast.success("Report Submitted", {
      description: "Your weekly insight has been submitted for approval.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">New Weekly Insight</h2>
            <Badge variant={status === 'approved' ? 'default' : status === 'submitted' ? 'secondary' : 'outline'} className="text-sm px-3 py-1">
              {status === 'approved' ? 'APPROVED' : status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}
            </Badge>
          </div>
          <p className="text-muted-foreground">Week 6 (Feb 02 - Feb 08) - Atento Quality Operations</p>
        </div>
        <div className="flex space-x-2">
          {status === 'draft' && (
            <>
              <Button variant="outline" onClick={() => {
                toast.success("Draft Saved", { description: "Your progress has been saved." });
              }}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </>
          )}
          {status === 'submitted' && (
            <>
              <Button variant="outline" onClick={() => setStatus('draft')}>Revert to Draft</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setStatus('approved')}>
                <FileCheck className="w-4 h-4 mr-2" />
                Approve Report
              </Button>
            </>
          )}
          {status === 'approved' && (
            <Button variant="ghost" disabled className="text-green-700 font-medium">
              <FileCheck className="w-4 h-4 mr-2" />
              Report Approved & Locked
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="kpi">1. KPI Moves</TabsTrigger>
          <TabsTrigger value="issues">2. Issues</TabsTrigger>
          <TabsTrigger value="newhire">3. New Hires</TabsTrigger>
          <TabsTrigger value="pk">4. Knowledge</TabsTrigger>
          <TabsTrigger value="bottom">5. B. Quartile</TabsTrigger>
          <TabsTrigger value="summary">6. Summary</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="kpi">
            <Card>
              <CardHeader>
                <CardTitle>Primary KPI Movements (WoW)</CardTitle>
                <CardDescription>Analyze Week-over-Week changes.</CardDescription>
              </CardHeader>
              <CardContent>
                <KPIAnalysisSection />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Correlated Issue Mapping</CardTitle>
                <CardDescription>Link generic bugs to specific KPI impacts.</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelatedIssuesSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newhire">
            <Card>
              <CardHeader>
                <CardTitle>New Hire Wave 30/60/90</CardTitle>
                <CardDescription>Cohort analysis from the 30/60/90 Tracker.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewHireSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pk">
            <Card>
              <CardHeader>
                <CardTitle>Product Knowledge Gaps</CardTitle>
                <CardDescription>Identify key knowledge deficiencies and required actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductKnowledgeSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bottom">
            <Card>
              <CardHeader>
                <CardTitle>Bottom Quartile Focus</CardTitle>
                <CardDescription>Deep dive on low performers and random audits.</CardDescription>
              </CardHeader>
              <CardContent>
                <BottomQuartileSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Summary</CardTitle>
                <CardDescription>Executive Overview of the Week.</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadershipSummarySection value={summary} onChange={setSummary} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
