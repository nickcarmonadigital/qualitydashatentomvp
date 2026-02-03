'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDashboardMetrics, getInterventionCandidates, getActionPlans, getAgents, getScores, getKPIs } from '@/lib/mock-service';
import { calculateVSF, identifyTrend } from '@/lib/lss/statistics';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [atRiskAgents, setAtRiskAgents] = useState<any[]>([]);
  const [recentPlans, setRecentPlans] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState<any>({});
  const [quickStats, setQuickStats] = useState<any>({});

  useEffect(() => {
    const data = getDashboardMetrics();
    setMetrics(data);

    // Get at-risk agents
    const candidates = getInterventionCandidates();
    setAtRiskAgents(candidates.slice(0, 5));

    // Get recent action plans
    const plans = getActionPlans();
    setRecentPlans(plans.slice(0, 4));

    // Calculate team stats
    const agents = getAgents();
    const scores = getScores();
    const kpis = getKPIs();

    // Group by team
    const teams: Record<string, { total: number; avgScore: number }> = {};
    agents.forEach(agent => {
      if (!teams[agent.team]) {
        teams[agent.team] = { total: 0, avgScore: 0 };
      }
      const agentScores = scores.filter(s => s.agent_id === agent.id);
      const avg = agentScores.length > 0
        ? agentScores.reduce((acc, s) => acc + s.value, 0) / agentScores.length
        : 0;
      teams[agent.team].total++;
      teams[agent.team].avgScore += avg;
    });

    // Calculate averages
    Object.keys(teams).forEach(team => {
      teams[team].avgScore = Number((teams[team].avgScore / teams[team].total).toFixed(1));
    });
    setTeamStats(teams);

    // Quick stats
    const totalAgents = agents.length;
    const totalKPIs = kpis.length;
    const activePlans = plans.filter(p => p.status === 'In Progress').length;
    const criticalAgents = candidates.filter(c => c.riskLevel === 'Critical').length;

    setQuickStats({
      totalAgents,
      totalKPIs,
      activePlans,
      criticalAgents,
      completedPlans: plans.filter(p => p.status === 'Completed').length,
      passRate: data[0]?.currentValue || 0
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-muted-foreground">Quality Operations Command Center</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-xs">Week {Math.ceil(new Date().getDate() / 7)}</p>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="metric-card bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{quickStats.totalAgents}</p>
                <p className="text-xs text-blue-600/80">Total Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{quickStats.passRate}%</p>
                <p className="text-xs text-green-600/80">Pass Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-amber-700">{quickStats.activePlans}</p>
                <p className="text-xs text-amber-600/80">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-700">{quickStats.criticalAgents}</p>
                <p className="text-xs text-red-600/80">At-Risk Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">{quickStats.totalKPIs}</p>
                <p className="text-xs text-purple-600/80">KPIs Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-emerald-700">{quickStats.completedPlans}</p>
                <p className="text-xs text-emerald-600/80">Plans Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const historyValues = metric.history.map((h: any) => h.value);
          const vsf = calculateVSF(historyValues);
          const trend = identifyTrend(historyValues);
          const trendProp = trend === 'UP' ? 'up' : trend === 'DOWN' ? 'down' : 'flat';

          return (
            <div key={metric.id} className={`animate-fade-in delay-${(index + 1) * 100}`}>
              <KPICard
                title={metric.name}
                value={metric.currentValue}
                target={metric.target}
                unit={metric.unit}
                voiceType={metric.voice_type}
                trend={trendProp}
                vsf={vsf}
              />
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Charts - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.length > 0 && (
              <TrendChart
                title="Pass Rate Trend"
                data={metrics[0].history}
                color="#10b981"
              />
            )}
            {metrics.length > 1 && (
              <TrendChart
                title="CSAT Trend"
                data={metrics[1].history}
                color="#3b82f6"
              />
            )}
          </div>

          {/* Team Performance */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Performance Overview
              </CardTitle>
              <CardDescription>Average scores by team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(teamStats).map(([team, stats]: [string, any]) => (
                  <div key={team} className="flex items-center gap-4">
                    <div className="w-24 font-medium text-sm">{team}</div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${stats.avgScore >= 90 ? 'bg-green-500' :
                            stats.avgScore >= 80 ? 'bg-blue-500' :
                              stats.avgScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${stats.avgScore}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className={`font-bold ${stats.avgScore >= 90 ? 'text-green-600' :
                          stats.avgScore >= 80 ? 'text-blue-600' :
                            stats.avgScore >= 70 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                        {stats.avgScore}%
                      </span>
                    </div>
                    <div className="w-16 text-xs text-muted-foreground">
                      {stats.total} agents
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts & Actions */}
        <div className="space-y-6">
          {/* At-Risk Agents */}
          <Card className="card-gradient border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Agents Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {atRiskAgents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  All agents are performing well! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {atRiskAgents.map((item, index) => (
                    <Link key={item.agent.id} href={`/agents/${item.agent.id}`}>
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                            }`} />
                          <div>
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">
                              {item.agent.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.agent.team}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={item.riskLevel === 'Critical' ? 'destructive' : 'secondary'}>
                            {item.averageScore}%
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link href="/fifty-seventy-five">
                    <Button variant="ghost" size="sm" className="w-full mt-2 btn-premium">
                      View 50/75 Analysis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Action Plans */}
          <Card className="card-gradient border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-blue-500" />
                Recent Action Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPlans.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No action plans yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPlans.map((plan) => (
                    <Link key={plan.id} href={`/action-plans/${plan.id}`}>
                      <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {plan.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {plan.category}
                            </p>
                          </div>
                          <Badge variant={
                            plan.status === 'Completed' ? 'default' :
                              plan.status === 'In Progress' ? 'secondary' : 'outline'
                          } className="shrink-0 text-xs">
                            {plan.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link href="/action-plans">
                    <Button variant="ghost" size="sm" className="w-full mt-2 btn-premium">
                      View All Plans <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quality Alerts */}
          <Card className="card-gradient border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Quality Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {metrics.length > 0 && metrics[0].currentValue < metrics[0].target && (
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-red-700">
                      Pass Rate is {(metrics[0].target - metrics[0].currentValue).toFixed(1)}% below target
                    </p>
                  </div>
                )}
                {quickStats.criticalAgents > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-amber-700">
                      {quickStats.criticalAgents} agent{quickStats.criticalAgents > 1 ? 's' : ''} need immediate coaching
                    </p>
                  </div>
                )}
                {quickStats.activePlans > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-blue-700">
                      {quickStats.activePlans} action plan{quickStats.activePlans > 1 ? 's' : ''} in progress
                    </p>
                  </div>
                )}
                {metrics.length > 0 && metrics[0].currentValue >= metrics[0].target && (
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-green-700">
                      Pass Rate is on target! Great work!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
