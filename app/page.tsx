import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION */}
      <Hero />

      {/* FEATURE SECTION */}
      <section className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-12
        sm:py-16
      ">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Card 1 */}
          <div className="
            group
            flex
            flex-col
            sm:flex-row
            rounded-2xl
            border
            bg-card
            overflow-hidden
            shadow-sm
            hover:shadow-lg
            transition
          ">

            <div className="
              w-full
              sm:w-[220px]
              md:w-[250px]
              h-[240px]
              sm:h-auto
              overflow-hidden
            ">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"
                alt="Minimalist Luxury"
                className="
                  h-full
                  w-full
                  object-cover
                  group-hover:scale-105
                  transition-transform
                  duration-500
                "
              />
            </div>

            <div className="p-6 flex flex-col justify-center text-center sm:text-left">

              <h3 className="
                font-serif
                text-xl
                md:text-2xl
                font-bold
                uppercase
                tracking-wider
              ">
                Minimalist Luxury
              </h3>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The meticulously tailored minimalist luxury crafted with an
                unpretentious devotion to detail.
              </p>

            </div>

          </div>

          {/* Card 2 */}
          <div className="
            group
            flex
            flex-col
            sm:flex-row
            rounded-2xl
            border
            bg-card
            overflow-hidden
            shadow-sm
            hover:shadow-lg
            transition
          ">

            <div className="
              w-full
              sm:w-[220px]
              md:w-[250px]
              h-[240px]
              sm:h-auto
              overflow-hidden
            ">
              <img
                src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop"
                alt="New Season Arrivals"
                className="
                  h-full
                  w-full
                  object-cover
                  group-hover:scale-105
                  transition-transform
                  duration-500
                "
              />
            </div>

            <div className="p-6 flex flex-col justify-center text-center sm:text-left">

              <h3 className="
                font-serif
                text-xl
                md:text-2xl
                font-bold
                uppercase
                tracking-wider
              ">
                New Season Arrivals
              </h3>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Discover our new collection embodying the essence of raw silk,
                organic textures, and pure refinement.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}