
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Calendar,
    User,
    Phone,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminRequestsPage() {
    const supabase = createClient();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('menu_requests' as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('menu_requests' as any)
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        const matchesSearch = r.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Customer Box</h1>
                    <p className="text-muted-foreground">Manage item requests from customers</p>
                </div>
                <Button onClick={fetchRequests} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
                    Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by item or customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald/20 focus:border-emerald outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald/20 focus:border-emerald outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="added">Added to Menu</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <Loader2 className="h-8 w-8 text-emerald animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium">No requests found</p>
                        <p className="text-muted-foreground">When customers request items, they will appear here.</p>
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <Card key={request.id} className={cn(
                            "overflow-hidden transition-all hover:shadow-md border-l-4",
                            request.status === 'pending' ? "border-l-amber-400" :
                                request.status === 'added' ? "border-l-emerald-400" : "border-l-slate-400"
                        )}>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-stretch">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-1">{request.item_name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                request.status === 'pending' ? 'outline' :
                                                    request.status === 'added' ? 'default' : 'secondary'
                                            } className={cn(
                                                "capitalize",
                                                request.status === 'added' && "bg-emerald text-white hover:bg-emerald-dark"
                                            )}>
                                                {request.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Customer</p>
                                                    <p className="font-medium">{request.customer_name || 'Anonymous User'}</p>
                                                </div>
                                            </div>
                                            {request.customer_phone && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <Phone className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Contact</p>
                                                        <p className="font-medium">{request.customer_phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-muted/20 p-4 md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-border/50">
                                        {request.status === 'pending' && (
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(request.id, 'reviewed')}
                                                variant="outline"
                                                className="w-full justify-start"
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Mark Reviewed
                                            </Button>
                                        )}
                                        {request.status !== 'added' && (
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(request.id, 'added')}
                                                className="w-full justify-start bg-emerald hover:bg-emerald-dark"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Mark Added
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this request?')) {
                                                    supabase.from('menu_requests' as any).delete().eq('id', request.id)
                                                        .then(() => setRequests(requests.filter(r => r.id !== request.id)));
                                                }
                                            }}
                                            variant="ghost"
                                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            Delete Request
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
