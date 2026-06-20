import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyProducts() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                    No Products Available
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                    Please check again later.
                </p>
                <Link href="/">
                    <Button variant="default" size="sm">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
