'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type CTXNodeType = 'Voice' | 'Expectation' | 'CTX' | 'Causal';

interface CTXNode {
    id: string;
    type: CTXNodeType;
    label: string;
    children: CTXNode[];
    isExpanded?: boolean;
}

const TYPE_COLORS: Record<CTXNodeType, string> = {
    'Voice': 'bg-blue-100 border-blue-300 text-blue-900',
    'Expectation': 'bg-purple-100 border-purple-300 text-purple-900',
    'CTX': 'bg-amber-100 border-amber-300 text-amber-900',
    'Causal': 'bg-red-100 border-red-300 text-red-900',
};

const initialData: CTXNode = {
    id: 'root',
    type: 'Voice',
    label: 'Customer says: "It takes too long to get my refund"',
    isExpanded: true,
    children: [
        {
            id: 'exp-1',
            type: 'Expectation',
            label: 'Refund processed within 24 hours',
            isExpanded: true,
            children: [
                {
                    id: 'ctx-1',
                    type: 'CTX',
                    label: 'Processing Time (TAT)',
                    isExpanded: true,
                    children: [
                        { id: 'c-1', type: 'Causal', label: 'Manual approval required', children: [] },
                        { id: 'c-2', type: 'Causal', label: 'System latency', children: [] }
                    ]
                },
                {
                    id: 'ctx-2',
                    type: 'CTX',
                    label: 'First Contact Resolution',
                    isExpanded: false,
                    children: [
                        { id: 'c-3', type: 'Causal', label: 'Agent knowledge gap', children: [] }
                    ]
                }
            ]
        }
    ]
};

export function CTXTree() {
    const [tree, setTree] = useState<CTXNode>(initialData);

    const toggleNode = (nodeId: string, currentTree: CTXNode): CTXNode => {
        if (currentTree.id === nodeId) {
            return { ...currentTree, isExpanded: !currentTree.isExpanded };
        }
        return {
            ...currentTree,
            children: currentTree.children.map(child => toggleNode(nodeId, child))
        };
    };

    const handleToggle = (id: string) => {
        setTree(prev => toggleNode(id, prev));
    };

    const renderNode = (node: CTXNode, level: number) => {
        const hasChildren = node.children.length > 0;
        const colorClass = TYPE_COLORS[node.type];

        return (
            <div key={node.id} className="relative">
                {/* Connector line for children (vertical) */}
                {level > 0 && (
                    <div className="absolute -left-6 top-0 h-full w-px bg-slate-300" />
                )}
                {/* Connector to parent (horizontal) */}
                {level > 0 && (
                    <div className="absolute -left-6 top-5 w-6 h-px bg-slate-300" />
                )}

                <div className="mb-4">
                    <div className={cn(
                        "relative flex items-center p-3 rounded-lg border shadow-sm w-fit min-w-[300px] transition-all",
                        colorClass
                    )}>
                        <div className="mr-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
                                {node.type}
                            </span>
                            <span className="font-medium text-sm">{node.label}</span>
                        </div>

                        {hasChildren && (
                            <button
                                onClick={() => handleToggle(node.id)}
                                className="ml-auto p-1 hover:bg-black/10 rounded-full"
                            >
                                {node.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                        )}

                        {!hasChildren && node.type !== 'Causal' && (
                            <button className="ml-auto p-1 hover:bg-black/10 rounded-full opacity-0 hover:opacity-100">
                                <Plus className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Render Children */}
                    {node.isExpanded && hasChildren && (
                        <div className="ml-12 mt-4 space-y-2 border-l-2 border-slate-200 pl-6 py-2">
                            {node.children.map(child => renderNode(child, level + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <div className="p-8 bg-slate-50 min-h-[500px] overflow-auto">
                <div className="mx-auto max-w-4xl">
                    {renderNode(tree, 0)}
                </div>
            </div>
        </Card>
    );
}
