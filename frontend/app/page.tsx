import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="page-container">
      <h1 className="section-title">Welcome to E-Commerce</h1>
      <p className="text-muted-foreground">
        Browse our collection of clothing items.
      </p>
      <div className="text-4xl font-bold text-red-500">
        Tailwind Working
      </div>
      <Button>Click Me</Button>
    </main>
  );
}

