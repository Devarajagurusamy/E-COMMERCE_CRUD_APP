export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="page-container">
      <h1 className="section-title">Product Detail</h1>
      <p className="text-muted-foreground">
        Product ID: {params.id} - Coming soon
      </p>
    </main>
  );
}
