import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop"
            alt="Refined clothing texture"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 text-center max-w-3xl">

          <h1 className="
            text-3xl
            sm:text-5xl
            md:text-6xl
            font-serif
            text-white
            leading-tight
          ">
            Welcome to E-Commerce
          </h1>

          <p className="
            mt-4
            text-sm
            sm:text-base
            text-stone-200
            max-w-md
            sm:max-w-lg
            mx-auto
          ">
            Discover our curated collection of refined clothing items
          </p>

          <Link href="/products">
            <Button
              className="
                mt-8
                px-6 py-5
                sm:px-8 sm:py-6
                text-xs
                uppercase
                tracking-[0.2em]
                rounded-sm
                bg-white
                text-black
                hover:bg-stone-100
              "
            >
              Discover Style
            </Button>
          </Link>

        </div>
      </section>

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