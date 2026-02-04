'use client';

import { useState, useEffect } from 'react';
import { getAgents } from '@/lib/mock-service';
import { Agent } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, UserCog, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { InfoTooltip } from '@/components/ui/info-tooltip';

export default function UserManagementPage() {
    const [users, setUsers] = useState<Agent[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Agent[]>([]);
    const [search, setSearch] = useState('');

    const handleInviteUser = () => {
        toast.success("Invitation Sent", {
            description: "An email has been sent to the user with setup instructions."
        });
    };

    useEffect(() => {
        // In a real app, this would fetch from a Users API, not just Agents
        // Reusing Agent mock data for MVP demo of permissions
        const data = getAgents();
        setUsers(data);
        setFilteredUsers(data);
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredUsers(users);
            return;
        }
        const lower = search.toLowerCase();
        setFilteredUsers(users.filter(u => u.name.toLowerCase().includes(lower) || u.role.toLowerCase().includes(lower)));
    }, [search, users]);

    const handleRoleChange = (userId: string, newRole: string) => {
        // Mock API call
        toast.promise(new Promise(resolve => setTimeout(resolve, 500)), {
            loading: 'Updating role...',
            success: `User role updated to ${newRole}`,
            error: 'Failed to update role'
        });

        // Optimistic update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const toggleStatus = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);

        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as 'active' | 'inactive' } : u));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        User Management
                        <InfoTooltip content="Manage platform access, roles, and status for all employees." />
                    </h2>
                    <p className="text-muted-foreground">Manage user roles, access permissions, and account status.</p>
                </div>
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.slice(0, 10).map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div>{user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.id.split('-')[0]}@example.com</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select defaultValue={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                                                    <SelectTrigger className="w-[140px] h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Agent">Agent</SelectItem>
                                                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                                                        <SelectItem value="QA Specialist">QA Specialist</SelectItem>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                Today, 9:41 AM
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => toggleStatus(user.id, user.status)}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent >
                </Card >
            </div >
            );
}
