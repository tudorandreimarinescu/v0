import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy - kynky.ro",
  description: "Learn how kynky.ro collects, uses, and protects your personal information in compliance with GDPR.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
            Privacy <span className="font-medium italic instrument">Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg p-8 space-y-8">
              <section className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">🇪🇺 GDPR Compliance</h2>
                <p className="text-white/80 leading-relaxed">
                  Această politică de confidențialitate este în conformitate cu Regulamentul General privind Protecția
                  Datelor (GDPR) și alte legi aplicabile privind protecția datelor. Aveți drepturi specifice cu privire
                  la datele dumneavoastră personale.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Informații pe care le colectăm</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Informații furnizate direct</h3>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      <li>Nume și adresă de email</li>
                      <li>Informații de facturare și plată</li>
                      <li>Preferințe de comunicare</li>
                      <li>Conținutul mesajelor de suport</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Informații colectate automat</h3>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      <li>Adresa IP și locația geografică</li>
                      <li>Tipul de browser și dispozitiv</li>
                      <li>Paginile vizitate și timpul petrecut</li>
                      <li>Cookie-uri și tehnologii similare</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Cum utilizăm informațiile</h2>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Procesarea tranzacțiilor și livrarea produselor</li>
                  <li>Furnizarea suportului pentru clienți</li>
                  <li>Trimiterea de actualizări importante despre cont</li>
                  <li>Îmbunătățirea produselor și serviciilor noastre</li>
                  <li>Respectarea obligațiilor legale</li>
                  <li>Marketing direct (doar cu consimțământul dumneavoastră)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Drepturile dumneavoastră GDPR</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 mb-4">În conformitate cu GDPR, aveți următoarele drepturi:</p>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>
                      <strong>Dreptul de acces:</strong> Să solicitați o copie a datelor personale pe care le deținem
                    </li>
                    <li>
                      <strong>Dreptul de rectificare:</strong> Să corectați datele inexacte sau incomplete
                    </li>
                    <li>
                      <strong>Dreptul la ștergere:</strong> Să solicitați ștergerea datelor în anumite circumstanțe
                    </li>
                    <li>
                      <strong>Dreptul la restricționare:</strong> Să limitați procesarea datelor dumneavoastră
                    </li>
                    <li>
                      <strong>Dreptul la portabilitate:</strong> Să primiți datele într-un format structurat
                    </li>
                    <li>
                      <strong>Dreptul de opoziție:</strong> Să vă opuneți procesării pentru marketing direct
                    </li>
                    <li>
                      <strong>Dreptul de retragere a consimțământului:</strong> Să vă retrageți consimțământul oricând
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Partajarea informațiilor</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Nu vindem, comercializăm sau transferăm informațiile dumneavoastră personale către terți fără
                  consimțământul dumneavoastră, cu excepția cazurilor descrise în această politică:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Furnizori de servicii de încredere care ne asistă în operarea site-ului</li>
                  <li>Procesatori de plăți pentru tranzacții</li>
                  <li>Autorități legale când este necesar prin lege</li>
                  <li>În cazul unei fuziuni sau achiziții (cu notificare prealabilă)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Securitatea datelor</h2>
                <p className="text-white/80 leading-relaxed">
                  Implementăm măsuri de securitate tehnice și organizatorice adecvate pentru a proteja informațiile
                  dumneavoastră personale împotriva accesului neautorizat, modificării, divulgării sau distrugerii.
                  Acestea includ criptarea datelor, accesul restricționat și monitorizarea regulată a sistemelor.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Cookie-uri și tehnologii de urmărire</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Utilizăm cookie-uri și tehnologii similare pentru a îmbunătăți experiența dumneavoastră. Puteți
                  controla utilizarea cookie-urilor prin setările browserului sau prin banner-ul nostru de consimțământ
                  pentru cookie-uri.
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Tipuri de cookie-uri:</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>
                      <strong>Esențiale:</strong> Necesare pentru funcționarea site-ului
                    </li>
                    <li>
                      <strong>Analitice:</strong> Pentru înțelegerea utilizării site-ului
                    </li>
                    <li>
                      <strong>Marketing:</strong> Pentru publicitate personalizată (cu consimțământ)
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Reținerea datelor</h2>
                <p className="text-white/80 leading-relaxed">
                  Păstrăm datele dumneavoastră personale doar atât timp cât este necesar pentru îndeplinirea scopurilor
                  pentru care au fost colectate sau conform cerințelor legale. Datele de cont sunt păstrate până la
                  închiderea contului, iar datele de tranzacție sunt păstrate conform obligațiilor fiscale și legale.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Transferuri internaționale</h2>
                <p className="text-white/80 leading-relaxed">
                  Datele dumneavoastră pot fi transferate și procesate în țări din afara Spațiului Economic European. În
                  astfel de cazuri, ne asigurăm că sunt implementate garanții adecvate pentru protecția datelor, conform
                  GDPR.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Contact și reclamații</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed mb-4">
                    Pentru exercitarea drepturilor dumneavoastră sau pentru întrebări despre această politică:
                  </p>
                  <ul className="text-white/80 space-y-2">
                    <li>
                      <strong>Email:</strong> privacy@kynky.ro
                    </li>
                    <li>
                      <strong>Răspuns:</strong> În termen de 30 de zile
                    </li>
                    <li>
                      <strong>Autoritate de supraveghere:</strong> Aveți dreptul să depuneți o plângere la Autoritatea
                      Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
                    </li>
                  </ul>
                </div>
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
