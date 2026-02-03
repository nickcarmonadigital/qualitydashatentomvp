'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

interface GapRow {
  id: number;
  topic: string;
  gapType: string;
  actionItem: string;
}

export function ProductKnowledgeSection() {
  const [rows, setRows] = useState<GapRow[]>([
    { id: 1, topic: '', gapType: 'Execution', actionItem: '' }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), topic: '', gapType: 'Execution', actionItem: '' }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-md border border-purple-100 text-sm text-purple-800 mb-4">
        <strong>PK Focus:</strong> Differentiate between "I didn't know" (Doc Gap) and "I forgot" (Execution Gap).
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Topic / Procedure</TableHead>
            <TableHead className="w-[20%]">Gap Type</TableHead>
            <TableHead className="w-[30%]">Action Item (Owner)</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Input placeholder="e.g. 'Refund Policy for Digital Goods'" />
              </TableCell>
              <TableCell>
                <Select defaultValue={row.gapType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Execution">Execution (Coaching Needed)</SelectItem>
                    <SelectItem value="Documentation">Documentation (Wiki Update)</SelectItem>
                    <SelectItem value="Training">Training (New Module)</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input placeholder="e.g. 'Update Wiki Article #404 (Content Team)'" />
              </TableCell>
              <TableCell>
                {rows.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
                    <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="outline" size="sm" onClick={addRow} className="mt-2">
        <Plus className="mr-2 h-4 w-4" />
        Add Gap
      </Button>
    </div>
  );
}
