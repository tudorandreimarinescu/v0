import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "About - kynky.ro",
  description: "Learn about kynky.ro, our mission to provide premium digital experiences and adult content.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            About <span className="font-medium italic instrument">kynky.ro</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Cine Suntem</h2>
                <p className="text-white/80 leading-relaxed">
                  kynky.ro este o platformă premium dedicată experiențelor digitale pentru adulți. Ne specializăm în
                  furnizarea de conținut de înaltă calitate, produse digitale și servicii personalizate pentru o
                  audiență matură și sofisticată.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Misiunea Noastră</h2>
                <p className="text-white/80 leading-relaxed">
                  Credem în puterea tehnologiei de a crea experiențe digitale memorabile și personalizate. Misiunea
                  noastră este să oferim produse și servicii de cea mai înaltă calitate, respectând în același timp
                  confidențialitatea și siguranța utilizatorilor noștri.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Valorile Noastre</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Confidențialitate</h3>
                    <p className="text-white/70">
                      Respectăm și protejăm confidențialitatea tuturor utilizatorilor noștri prin măsuri de securitate
                      avansate.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Calitate</h3>
                    <p className="text-white/70">
                      Oferim doar produse și servicii de cea mai înaltă calitate, testate și verificate de echipa
                      noastră.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Inovație</h3>
                    <p className="text-white/70">
                      Utilizăm cele mai noi tehnologii pentru a crea experiențe digitale unice și captivante.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Responsabilitate</h3>
                    <p className="text-white/70">
                      Operăm în conformitate cu toate reglementările legale și standardele etice din industrie.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                <p className="text-white/80 leading-relaxed">
                  Pentru întrebări, sugestii sau suport, ne puteți contacta la{" "}
                  <a href="mailto:contact@kynky.ro" className="text-purple-400 hover:text-purple-300">
                    contact@kynky.ro
                  </a>{" "}
                  sau prin intermediul paginii noastre de contact.
                </p>
              </section>

              <div className="border-t border-white/10 pt-6">
                <p className="text-white/60 text-sm">
                  <strong>Notă importantă:</strong> Acest site conține conținut pentru adulți și este destinat exclusiv
                  persoanelor cu vârsta de cel puțin 18 ani. Prin utilizarea acestui site, confirmați că aveți vârsta
                  legală în jurisdicția dumneavoastră.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
