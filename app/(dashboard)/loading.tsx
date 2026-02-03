import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
            <p className="mt-4 text-slate-500 text-sm">Loading dashboard data...</p>
        </div>
    );
}
