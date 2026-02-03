'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '@/lib/mock-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calculator, Edit2, RotateCcw } from 'lucide-react';

export function KPIAnalysisSection() {
  const [data, setData] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be passed via props or context
    const metrics = getDashboardMetrics();
    setData(metrics);
  }, []);

  const handleOverride = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setOverrides(prev => ({ ...prev, [id]: numValue }));
    }
  };

  const clearOverride = (id: string) => {
    setOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[id];
      return newOverrides;
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>KPI Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Current</TableHead>
            <TableHead>Delta (WoW)</TableHead>
            <TableHead className="w-[40%]">Analysis / Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((kpi) => {
            const hasOverride = overrides[kpi.id] !== undefined;
            // Safe alignment with mock data history length
            const history = kpi.history || [];
            const originalCurrent = history[history.length - 1]?.value || kpi.currentValue;
            const current = hasOverride ? overrides[kpi.id] : originalCurrent;
            const previous = history[history.length - 2]?.value || kpi.currentValue;

            const delta = current - previous;
            // Assuming higher is better for this visual logic (would need inversion for AHT)
            const isPositive = delta > 0;
            const breakdown = kpi.calculationBreakdown;

            return (
              <TableRow key={kpi.id}>
                <TableCell className="font-medium">{kpi.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{kpi.voice_type}</Badge>
                </TableCell>
                <TableCell>{kpi.target}{kpi.unit}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {editingId === kpi.id ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          className="w-20 h-8"
                          value={current}
                          onChange={(e) => handleOverride(kpi.id, e.target.value)}
                          autoFocus
                          onBlur={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <span className={hasOverride ? "font-bold text-orange-600 underline decoration-dotted" : ""}>
                        {current.toFixed(1)}{kpi.unit}
                      </span>
                    )}

                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingId(kpi.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      {hasOverride && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => clearOverride(kpi.id)}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                      {breakdown && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                              <Calculator className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Calculation Breakdown</h4>
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Formula:</span>
                                  <span>{breakdown.formula}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Numerator:</span>
                                  <span>{breakdown.numerator.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Denominator:</span>
                                  <span>{breakdown.denominator}</span>
                                </div>
                                <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                                  <span>Result:</span>
                                  <span>{originalCurrent.toFixed(2)}</span>
                                </div>
                                {hasOverride && (
                                  <div className="text-orange-600 text-[10px] mt-1 italic">
                                    *Manually overridden
                                  </div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}{kpi.unit}
                </TableCell>
                <TableCell>
                  <Input placeholder={hasOverride ? "Reason for override..." : "Why did this move? (Root cause...)"} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
