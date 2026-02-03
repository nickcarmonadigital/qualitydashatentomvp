import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="mt-4 text-lg font-semibold text-slate-700">Initializing LSS Engine...</h2>
        </div>
    );
}
