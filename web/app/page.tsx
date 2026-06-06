import { Navbar } from "@/components/nav/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Playground } from "@/components/sections/Playground";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";

/**
 * The entire site is one scroll: nav buttons smooth-scroll between these
 * sections, there is no client-side routing.
 */
export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Playground />
      <About />
      <Features />
      <Footer />
    </main>
  );
}
