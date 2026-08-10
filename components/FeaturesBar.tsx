import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "On orders over $50",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "100% secure checkout",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      subtitle: "30-day return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "Always here to help",
    },
  ];

  return (
    <section className="border-y border-border bg-card py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 group"
              >
                <div className="p-2.5 sm:p-3 rounded-2xl bg-muted border border-border text-foreground shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
