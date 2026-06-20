import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[500px_1fr] gap-12">

            {/* Left Image */}
            <Skeleton className="h-[600px] w-full rounded-xl" />

            {/* Right Content */}
            <div className="space-y-6">

                <Skeleton className="h-12 w-3/4" />

                <div className="flex gap-3">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>

                <Skeleton className="h-28 w-full rounded-lg" />

                <Skeleton className="h-24 w-full rounded-lg" />

                <Skeleton className="h-40 w-full rounded-lg" />

                <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1 rounded-lg" />
                    <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>

            </div>

        </div>
    );
}