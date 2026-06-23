export default function ProductCardSkeleton() {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
            {/* Image */}
            <div className="relative">
                <div className="h-64 w-full bg-zinc-800" />

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 h-8 w-20 rounded-md bg-zinc-700" />
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
                {/* Title */}
                <div className="h-8 w-3/4 rounded bg-zinc-800" />

                {/* Tags */}
                <div className="flex gap-3">
                    <div className="h-8 w-16 rounded-md bg-zinc-800" />
                    <div className="h-8 w-28 rounded-md bg-zinc-800" />
                </div>

                {/* Price */}
                <div className="flex gap-4 items-center">
                    <div className="h-8 w-24 rounded bg-zinc-800" />
                    <div className="h-6 w-16 rounded bg-zinc-800" />
                </div>

                {/* Stock */}
                <div className="h-6 w-28 rounded bg-zinc-800" />

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-12 rounded-xl bg-zinc-800" />
                    <div className="h-12 rounded-xl bg-zinc-700" />
                </div>
            </div>
        </div>
    );
}