import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Returns Policy - kynky.ro",
  description:
    "Learn about our returns and refund policy for digital products, including hygiene exceptions for intimate goods.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Returns <span className="font-medium italic instrument">Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-8">
              <section className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">⚠️ Excepții de Igienă - Produse Intime</h2>
                <p className="text-white/80 leading-relaxed">
                  <strong>Notă importantă:</strong> Conform reglementărilor UE privind protecția consumatorilor,
                  produsele intime desigilate nu pot fi returnate din motive de igienă și sănătate publică. Această
                  excepție se aplică produselor digitale cu conținut intim care au fost accesate sau descărcate.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Politica Generală de Returnări</h2>
                <p className="text-white/80 leading-relaxed">
                  Datorită livrării instantanee și naturii digitale a produselor noastre, în general nu oferim
                  rambursări odată ce o descărcare a fost finalizată. Cu toate acestea, înțelegem că pot apărea
                  circumstanțe excepționale și evaluăm fiecare caz individual.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Motive Eligibile pentru Returnare</h2>
                <div className="space-y-4">
                  <p className="text-white/80 leading-relaxed mb-4">
                    Putem lua în considerare rambursări în următoarele situații:
                  </p>

                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-3">Probleme Tehnice</h3>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      <li>Probleme tehnice care împiedică descărcarea sau utilizarea produsului</li>
                      <li>Fișiere corupte sau incomplete</li>
                      <li>Erori de procesare a plății</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-3">Discrepanțe de Produs</h3>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      <li>Produsul diferă semnificativ de descriere</li>
                      <li>Conținut lipsă sau incomplet</li>
                      <li>Calitate sub standardele advertizate</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-3">Erori de Comandă</h3>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      <li>Achiziții duplicate făcute din greșeală</li>
                      <li>Erori de facturare</li>
                      <li>Tranzacții neautorizate</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Procesul de Returnare</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Pentru a solicita o returnare, vă rugăm să urmați acești pași:
                </p>
                <ol className="list-decimal list-inside text-white/80 space-y-3">
                  <li>
                    <strong>Contactați echipa de suport</strong> în termen de 30 de zile de la achiziție la
                    support@kynky.ro
                  </li>
                  <li>
                    <strong>Furnizați informațiile necesare:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Numărul comenzii</li>
                      <li>Motivul returnării</li>
                      <li>Capturi de ecran sau mesaje de eroare relevante</li>
                      <li>Descrierea detaliată a problemei</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Evaluare:</strong> Permiteți 3-5 zile lucrătoare pentru evaluare și răspuns
                  </li>
                  <li>
                    <strong>Rezoluție:</strong> Veți primi o decizie și instrucțiuni de urmărire
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Excepții Legale - Produse Intime</h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    <strong>Conform Directivei UE 2011/83/EU (Drepturile Consumatorilor):</strong>
                  </p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>
                      <strong>Articolul 16(m):</strong> Dreptul de retragere nu se aplică contractelor pentru furnizarea
                      de bunuri care, din motive de igienă sau protecție a sănătății, nu pot fi returnate dacă au fost
                      desigilate după livrare
                    </li>
                    <li>
                      <strong>Produse digitale intime:</strong> Odată accesate sau descărcate, aceste produse sunt
                      considerate "desigilate" și nu pot fi returnate
                    </li>
                    <li>
                      <strong>Excepție:</strong> Această restricție nu se aplică în cazul defectelor tehnice sau al
                      neconformității produsului
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Procesarea Rambursărilor</h2>
                <div className="space-y-4">
                  <p className="text-white/80 leading-relaxed">
                    Rambursările aprobate vor fi procesate conform următoarelor proceduri:
                  </p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>
                      <strong>Metoda de rambursare:</strong> Înapoi la metoda de plată originală
                    </li>
                    <li>
                      <strong>Timpul de procesare:</strong> 5-10 zile lucrătoare
                    </li>
                    <li>
                      <strong>Confirmarea:</strong> Veți primi un email de confirmare când rambursarea a fost inițiată
                    </li>
                    <li>
                      <strong>Urmărire:</strong> Puteți urmări statusul prin contul dumneavoastră
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Drepturile Dumneavoastră GDPR</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    Chiar dacă nu putem oferi rambursări pentru anumite produse, aveți în continuare drepturi privind
                    datele dumneavoastră personale:
                  </p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>Dreptul de a solicita ștergerea datelor personale</li>
                    <li>Dreptul de a restricționa procesarea datelor</li>
                    <li>Dreptul de a vă retrage consimțământul pentru marketing</li>
                    <li>Dreptul de portabilitate a datelor</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Rezolvarea Disputelor</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Dacă nu sunteți mulțumit de răspunsul nostru la solicitarea de returnare:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Puteți escalada cazul la manager@kynky.ro</li>
                  <li>
                    Aveți dreptul să depuneți o plângere la Autoritatea Națională pentru Protecția Consumatorilor (ANPC)
                  </li>
                  <li>Puteți utiliza platforma ODR (Online Dispute Resolution) a UE</li>
                  <li>Aveți dreptul la asistență juridică conform legilor naționale</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Contact pentru Suport</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    Pentru solicitări de returnare sau întrebări despre această politică:
                  </p>
                  <ul className="text-white/80 space-y-2">
                    <li>
                      <strong>Email suport:</strong> support@kynky.ro
                    </li>
                    <li>
                      <strong>Email returnări:</strong> returns@kynky.ro
                    </li>
                    <li>
                      <strong>Timp de răspuns:</strong> 24-48 ore în zile lucrătoare
                    </li>
                    <li>
                      <strong>Formularul de contact:</strong> Disponibil pe site
                    </li>
                  </ul>
                </div>
              </section>

              <p className="text-white/60 text-sm border-t border-white/10 pt-6">
                <strong>Ultima actualizare:</strong> Decembrie 2024
                <br />
                <strong>Versiune:</strong> 2.0 (GDPR Compliant & EU Consumer Rights Directive Compliant)
                <br />
                <strong>Legislație aplicabilă:</strong> Directiva UE 2011/83/EU, GDPR, Legea 102/2014 (România)
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
