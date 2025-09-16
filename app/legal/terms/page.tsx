import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Terms of Service - kynky.ro",
  description:
    "Read the terms and conditions for using kynky.ro products and services, including adult content policies.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Terms of <span className="font-medium italic instrument">Service</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-8">
              <section className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">🔞 Conținut pentru Adulți</h2>
                <p className="text-white/80 leading-relaxed">
                  Acest site conține conținut pentru adulți și este destinat exclusiv persoanelor cu vârsta de cel puțin
                  18 ani. Prin utilizarea acestui site, confirmați că aveți vârsta legală în jurisdicția dumneavoastră
                  pentru a accesa astfel de conținut.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptarea Termenilor</h2>
                <p className="text-white/80 leading-relaxed">
                  Prin accesarea și utilizarea kynky.ro, acceptați și sunteți de acord să fiți obligat de termenii și
                  prevederile acestui acord. Dacă nu sunteți de acord să respectați cele de mai sus, vă rugăm să nu
                  utilizați acest serviciu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Licență și Utilizare</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  La achiziție, vi se acordă o licență non-exclusivă pentru utilizarea produselor noastre digitale,
                  supusă următoarelor condiții:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Produsele pot fi utilizate pentru proiecte comerciale și personale</li>
                  <li>Nu puteți redistribui, revinde sau partaja fișierele originale</li>
                  <li>Atribuirea este apreciată, dar nu este obligatorie</li>
                  <li>Modificările sunt permise pentru utilizarea proprie</li>
                  <li>Utilizarea trebuie să respecte legile locale privind conținutul pentru adulți</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Restricții de Vârstă și Acces</h2>
                <div className="space-y-4">
                  <p className="text-white/80 leading-relaxed">
                    Serviciile noastre sunt destinate utilizatorilor care au cel puțin 18 ani. Prin utilizarea
                    serviciilor noastre, declarați că:
                  </p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>Aveți cel puțin 18 ani împliniți</li>
                    <li>Aveți dreptul legal să accesați conținut pentru adulți în jurisdicția dumneavoastră</li>
                    <li>Nu veți permite accesul minorilor la conținutul achiziționat</li>
                    <li>Înțelegeți natura conținutului pentru adulți oferit</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Protecția Datelor și GDPR</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    Respectăm pe deplin Regulamentul General privind Protecția Datelor (GDPR) și ne angajăm să protejăm
                    confidențialitatea dumneavoastră:
                  </p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>Colectăm doar datele necesare pentru furnizarea serviciilor</li>
                    <li>Obținem consimțământul explicit pentru procesarea datelor</li>
                    <li>Respectăm drepturile dumneavoastră de acces, rectificare și ștergere</li>
                    <li>Implementăm măsuri de securitate adecvate</li>
                    <li>Nu partajăm datele cu terți fără consimțământul dumneavoastră</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Conținut și Conduită Acceptabilă</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Prin utilizarea serviciilor noastre, vă angajați să:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Utilizați conținutul în mod responsabil și legal</li>
                  <li>Nu încălcați drepturile de autor ale terților</li>
                  <li>Nu utilizați conținutul pentru activități ilegale</li>
                  <li>Respectați termenii de licență pentru fiecare produs</li>
                  <li>Nu încercați să ocoliți măsurile de securitate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Returnări și Rambursări</h2>
                <p className="text-white/80 leading-relaxed">
                  Datorită naturii digitale a produselor noastre și a livrării instantanee, toate vânzările sunt finale.
                  Cu toate acestea, dacă întâmpinați probleme tehnice sau primiți un produs defect, vă rugăm să
                  contactați echipa noastră de suport în termen de 30 de zile de la achiziție. Consultați politica
                  noastră de returnări pentru detalii complete.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Limitarea Răspunderii</h2>
                <p className="text-white/80 leading-relaxed">
                  kynky.ro nu va fi răspunzător pentru niciun fel de daune indirecte, accidentale, speciale, consecutive
                  sau punitive, inclusiv, fără limitare, pierderea profiturilor, datelor, utilizării, bunăvoinței sau
                  alte pierderi intangibile, rezultate din utilizarea sau incapacitatea de utilizare a serviciilor
                  noastre.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Modificări ale Termenilor</h2>
                <p className="text-white/80 leading-relaxed">
                  Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor fi publicate pe
                  această pagină și vor intra în vigoare imediat. Utilizarea continuă a serviciilor după modificări
                  constituie acceptarea noilor termeni.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Legea Aplicabilă</h2>
                <p className="text-white/80 leading-relaxed">
                  Acești termeni sunt guvernați de legile României. Orice dispute vor fi rezolvate în instanțele
                  competente din România, cu respectarea drepturilor consumatorilor conform legislației europene și
                  naționale.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
                <p className="text-white/80 leading-relaxed">
                  Pentru întrebări despre acești termeni, vă rugăm să ne contactați la legal@kynky.ro sau prin
                  intermediul paginii noastre de contact.
                </p>
              </section>

              <p className="text-white/60 text-sm border-t border-white/10 pt-6">
                <strong>Ultima actualizare:</strong> Decembrie 2024
                <br />
                <strong>Versiune:</strong> 2.0 (GDPR Compliant)
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
