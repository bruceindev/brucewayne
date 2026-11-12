import Hero from "@/components/home/Hero"
import Manifesto from "@/components/home/Manifesto"
import Skills from "@/components/home/Skills"
import Proof from "@/components/home/Proof"
import Work from "@/components/home/Work"
import Journey from "@/components/home/Journey"
import Goals from "@/components/home/Goals"
import Offer from "@/components/home/Offer"
import FinalCTA from "@/components/home/FinalCTA"

export default function Page() {
  return (
    <div className="relative">
      <Hero />
      <Manifesto />
      <Skills />
      <Proof />
      <Work />
      <Journey />
      <Goals />
      <Offer />
      <FinalCTA />
    </div>
  )
}
