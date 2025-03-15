import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <Header isLandingPage={false} />
      <main className="mt-16">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <SectionWrapper animation="fade-up">
              <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6 text-center">
                  Ochrana osobních údajů
                </h1>

                <p className="mb-4">
                  Na této stránce naleznete přehled hlavních principů ochrany osobních a dalších zpracovávaných údajů.
                </p>
                <p className="mb-4">
                  Ochrana Vašich osobních údajů je pro nás důležitá. Vaše osobní údaje zpracováváme v souladu s
                  příslušnými právními předpisy na ochranu osobních údajů, zejména v souladu s Nařízením Evropského
                  parlamentu a Rady EU 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob v souvislosti se
                  zpracováním osobních údajů a o volném pohybu těchto údajů a o zrušení směrnice 95/46/ ES (dále jen
                  „Nařízení") a v souladu se zákonem č. 110/2019 Sb., o zpracování osobních údajů (dále jen „Zákon").
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">1. Co jsou osobní údaje?</h2>
                <p className="mb-4">
                  Osobními údaji jsou veškeré informace o identifikované nebo identifikovatelné fyzické osobě, jako je
                  např. jméno, bydliště, e-mailová adresa, telefonní číslo či IP adresa.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">2. Kdo zpracovává Vaše údaje?</h2>
                <p className="mb-4">
                  Jsme společnost Expohledávky s.r.o., IČ: 069 53 204, se sídlem Na strži 1702/65, Nusle, 140 00 Praha
                  4, zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 291445. Jsme inkasní
                  agentura provozující služby vymáhání peněz včetně advokátního zastoupení a poradenství a jako správce
                  budeme zpracovávat Vaše osobní údaje dle níže uvedených podmínek.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">3. Jaké osobní údaje zpracováváme?</h2>
                <p className="mb-4">
                  V případě, že jste naším zákazníkem/uživatelem našich služeb, zpracováváme osobní údaje, které nám
                  poskytnete v souvislosti s využíváním našich služeb (např. v rámci vymáhání, advokátního zastoupení),
                  resp. v souvislosti s uzavřením smlouvy o užívání této služby. Jedná se nejčastěji o údaje, které nám
                  sdělíte při odeslání e-mailového formuláře z webových stránek https://expohledavky.cz/ či dalších
                  podstránek této hlavní domény k některé z našich služeb. Zpravidla tak můžeme zpracovávat následující
                  osobní údaje (přesný rozsah zpracovávaných údajů závisí zejména na charakteru objednané služby a
                  informacích, které nám sami poskytnete):
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>jméno a příjmení;</li>
                  <li>rodné číslo;</li>
                  <li>datum narození;</li>
                  <li>pohlaví;</li>
                  <li>adresu trvalého bydliště;</li>
                  <li>adresu přechodného bydliště;</li>
                  <li>e-mailovou adresu;</li>
                  <li>telefonní číslo;</li>
                  <li>
                    heslo pouze v podobě jeho otisku, z něhož nelze původní heslo získat zpět; k zákaznické sekci
                    používáme šifrování hesla bcrypt + vlastní salt;
                  </li>
                  <li>
                    fakturační a platební údaje (číslo bankovního účtu), které uložíme k Vašemu účtu (pouze při
                    využívání placených služeb jako je např. složení zálohy na advokátní zastoupení v případě soudního
                    řízení);
                  </li>
                  <li>
                    údaje Vámi dobrovolně poskytnuté v rámci vzájemné komunikace, ať již probíhající osobně, písemně,
                    telefonicky či jinak.
                  </li>
                </ul>

                <p className="mb-4">
                  V případě, že jste návštěvníkem našich webových stránek, můžeme zpracovávat zejména níže uvedené
                  údaje.
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    IP adresa, ze které Vaše koncové zařízení získává přístup k našim stránkám či mobilním aplikacím;
                  </li>
                  <li>
                    údaje získané prostřednictvím souborů cookies (či jiných online identifikátorů) jako jsou zejména:
                    informace o Vašem koncovém zařízení (typ prohlížeče, jeho nastavení, operační systém zařízení),
                    geolokační údaje, obecné informace o Vašich zájmech, informace o navštívených webových stránkách či
                    použitých mobilních aplikacích atd. Více informací o cookies a jejich nastavení naleznete{" "}
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      className="text-orange-500 hover:text-orange-600"
                      rel="noreferrer"
                    >
                      ZDE
                    </a>
                    .
                  </li>
                </ul>

                <p className="mb-4">
                  V případě, že jste naším obchodním partnerem, zpracováváme osobní údaje, které nám poskytnete v
                  souvislosti s uskutečněním naší vzájemné spolupráce. Zejména se jedná o následující osobní údaje:
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    jméno a příjmení (pokud jste podnikající fyzickou osobou nebo pokud jste kontaktní osobou nebo
                    osobou oprávněnou jednat za obchodního partnera v rámci konkrétního obchodního vztahu);
                  </li>
                  <li>
                    e-mailovou adresu (zejména u kontaktních osob a osob oprávněných jednat za obchodního partnera v
                    rámci konkrétního obchodního vztahu);
                  </li>
                  <li>
                    telefonní číslo (zejména u kontaktních osob a osob oprávněných jednat za obchodního partnera v rámci
                    konkrétního obchodního vztahu);
                  </li>
                  <li>fakturační údaje (zejména IČ u podnikajících fyzických osob).</li>
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">4. Proč Vaše osobní údaje zpracováváme?</h2>
                <p className="mb-4">
                  V závislosti na tom, zda jste naším zákazníkem, návštěvníkem našich webových stránek nebo obchodním
                  partnerem, můžeme Vaše osobní údaje zpracovávat pro níže uvedené účely zpracování.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">Subjekt údajů</div>
                  <div className="font-semibold">Účel zpracování</div>
                  <div className="font-semibold">Právní základ</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">Klient / uživatel služeb</div>
                  <div>
                    - poskytování objednaných služeb (včetně fakturace a administrace plateb);
                    <br />- správa Vašich uživatelských účtů k našim službám;
                    <br />- uložení Vašeho osobního nastavení v rámci konkrétní služby či produktu;
                  </div>
                  <div>
                    plnění smlouvy nebo přijetí opatření před uzavřením smlouvy podle čl. 6 odst. 1 písm. b) Nařízení
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div>
                    - vedení účetní evidence;
                    <br />- plnění dalších zákonných povinností;
                    <br />- uložení Vašeho osobního nastavení v rámci konkrétní služby či produktu;
                  </div>
                  <div>plnění právní povinnosti Expohledávky s.r.o. podle čl. 6 odst. 1 písm. c) Nařízení</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div>
                    - zlepšení kvality našich služeb a vývoj nových služeb;
                    <br />- zajištění bezpečnosti našich systémů a sítí před útoky zvenčí či zneužitím ze strany
                    uživatelů;
                    <br />- zasílání obchodních sdělení týkajících se objednaných služeb;
                    <br />- zodpovězení Vašeho dotazu zaslaného prostřednictvím kontaktního formuláře či sděleného
                    telefonicky;
                    <br />- monitorování příchozích hovorů v rámci zkvalitňování našich služeb (Call Centrum);
                    <br />- ochrana našich práv (např. pro případ soudního sporu týkajícího se našich služeb);
                    <br />- vymáhání pohledávek;
                  </div>
                  <div>oprávněné zájmy Expohledávky s.r.o. podle čl. 6 odst. 1 písm. f) Nařízení</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div>
                    - zasílání obchodních sdělení Expohledávky s.r.o. týkajících se jiných než objednaných či obdobných
                    služeb;
                    <br />- jiný účel uvedený v uděleném souhlasu;
                    <br />- zasílání obchodních sdělení třetích stran;
                  </div>
                  <div>souhlas podle čl. 6 odst. 1 písm. a) Nařízení</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div className="font-semibold">Návštěvník webových stránek</div>
                  <div>
                    - přenos komunikace prostřednictvím elektronické komunikační sítě;
                    <br />- poskytnutí uživatelem výslovně vyžádané informační služby;
                    <br />
                  </div>
                  <div>oprávněné zájmy Expohledávky s.r.o. podle čl. 6 odst. 1 písm. f) Nařízení</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b pb-6">
                  <div></div>
                  <div>
                    - trvalé zapamatování si Vašich přihlašovacích údajů a preferencí;
                    <br />- výběr a zobrazování reklam pouze na základě Vašich zájmů (včetně remarketingu a behaviorální
                    reklamy);
                    <br />- výběr a zobrazování obsahu na základě Vašich preferencí (personalizace obsahu zobrazované
                    webové stránky);
                    <br />- provádění analýz a měření s cílem zjistit, jak jsou naše služby používány;
                  </div>
                  <div>souhlas subjektu údajů podle čl. 6 odst. 1 písm. a) Nařízení</div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  5. Jaké zdroje využíváme k získání Vašich údajů?
                </h2>
                <p className="mb-4">
                  Osobní údaje, které o Vás budeme zpracovávat, většinou získáváme přímo od Vás při uzavírání smlouvy či
                  v průběhu trvání smluvního vztahu mezi námi, popřípadě v rámci sledování Vaší činnosti v rámci našich
                  stránek (účtů) anebo v rámci vedení individuální komunikace (písemné či telefonické) s Vámi.
                </p>
                <p className="mb-4">
                  V odůvodněných případech (zejména při vymáhání dlužných částek) o Vás můžeme vyhledávat informace i z
                  otevřených zdrojů, seznamů a rejstříků, jako je obchodní rejstřík, živnostenský rejstřík, insolvenční
                  rejstřík atd.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  6. Jsem povinen poskytnout své osobní údaje? Co když osobní údaje neposkytnu?
                </h2>
                <p className="mb-4">
                  Vaše osobní údaje nám poskytujete dobrovolně. Pro navázání obchodního vztahu a/nebo zpřístupnění
                  některé služby je však předání některých osobních údajů vyžadováno. Pokud nám je nepředáte, nebude
                  možné obchodní vztah navázat a/nebo službu poskytnout.
                </p>
                <p className="mb-4">
                  Současně platí, že zpracování informací o návštěvnících našich webových stránek, které jsou často
                  anonymní a neumožňují Vás identifikovat jako konkrétního uživatele, nám umožnuje poskytovat některé
                  naše služby zdarma a tyto neustále zlepšovat a vyvíjet služby nové. Pokud nám své údaje neposkytnete,
                  může se stát, že některé naše online služby nebudeme schopni poskytovat zdarma, popř. že je nebudeme
                  moci poskytnout v plném rozsahu či kvalitě. Není však samozřejmě Vaší povinností naše služby využívat.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  7. Kdo všechno bude mít k Vašim údajům přístup?
                </h2>
                <p className="mb-4">
                  Vaše údaje jsou u nás v bezpečí. Pečlivě si vybíráme partnery, kterým Vaše data svěřujeme a kteří jsou
                  schopni zajistit takové technické a organizační zabezpečení Vašich údajů, aby nemohlo dojít k
                  neoprávněnému nebo nahodilému přístupu k Vašim údajům či k jejich jinému zneužití. Ochrana Vašich dat
                  je naší prioritou. Všichni naši partneři jsou vázáni povinností mlčenlivosti a nesmějí využít
                  poskytnuté údaje k žádným jiným účelům, než ke kterým jsme jim je zpřístupnili.
                </p>
                <p className="mb-4">
                  Partneři, kterým Vaše osobní údaje zpřístupníme, mohou být podle povahy jimi poskytovaných služeb v
                  postavení:
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    Našich zpracovatelů, kteří zpracovávají osobní údaje pouze pro námi stanovené účely na základě
                    písemně uzavřené smlouvy o zpracování osobních údajů. Jedná se zejména o poskytovatele služeb, které
                    využíváme pro zajištění plnění našich smluvních povinností vůči našim zákazníkům, uživatelům a
                    obchodním partnerům.
                  </li>
                </ul>

                <p className="mb-4">
                  Za určitých, přesně definovaných podmínek jsme pak povinni některé Vaše osobní údaje předat na základě
                  platných právních předpisů např. Policii ČR, popř. jiným orgánům činným v trestním řízení včetně
                  specializovaných útvarů (ÚOOZ, Celní správa atd.) a dalším orgánům veřejné správy. Tyto orgány budou
                  Vaše osobní údaje zpracovávat jako samostatní správci.
                </p>
                <p className="mb-4">Na Vaši žádost Vám poskytneme informace o příjemcích Vašich osobních údajů.</p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  8. Jsou Vaše osobní údaje předávány do tzv. třetích zemí?
                </h2>
                <p className="mb-4">
                  Vzhledem k tomu, že poskytujeme celou řadu služeb v online prostředí, kde často dochází k přenosu dat
                  po celém světě, může se stát, že v rámci poskytování služeb nebo v rámci našeho obchodního vztahu
                  budou Vaše osobní údaje předány do tzv. třetích zemí mimo Evropskou unii. V takovém případě předáváme
                  Vaše osobní údaje pouze za předpokladu, že Evropská komise vydala rozhodnutí o odpovídající ochraně
                  osobních údajů, příjemce Vašich osobních údajů je vázán standardními smluvními doložkami EU o ochraně
                  osobních údajů nebo za předpokladu, že příjemce poskytl jiné vhodné záruky ochrany osobních údajů.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">9. Jak dlouho Vaše údaje zpracováváme?</h2>
                <p className="mb-4">
                  Vaše osobní údaje budeme zpracovávat pouze po dobu, která je nezbytná vzhledem k účelu jejich
                  zpracování. Pokud jsou osobní údaje používány současně pro více různých účelů zpracování, budeme je
                  zpracovávat, dokud neodpadne účel s delší dobou zpracování. K účelu s kratší dobou zpracování je však
                  přestaneme používat, jakmile tato doba uplyne. Expohledávky s.r.o. používá následující kritéria pro
                  určení doby zpracování:
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    v případě plnění smlouvy zpracováváme Vaše osobní údaje po dobu trvání smluvního vztahu mezi námi;
                  </li>
                  <li>
                    v případě plnění našich zákonných povinností zpracováváme Vaše osobní údaje po dobu určenou
                    příslušnými právními předpisy;
                  </li>
                  <li>
                    v případě našich oprávněných zájmů zpracováváme Vaše osobní údaje po dobu trvání příslušného
                    oprávněného zájmu. Za účelem ochrany našich práv tak budeme zpracovávat Vaše osobní údaje i po
                    zániku našeho vzájemného vztahu, a to nejdéle do konce 3. kalendářního roku po jeho zániku. V
                    případě zahájení a trvání soudního, správního nebo jiného řízení, ve kterém budou řešeny naše práva
                    či povinnosti vůči Vám, však zpracování neskončí před ukončením takového řízení;
                  </li>
                  <li>
                    pokud nám udělíte souhlas se zpracováním Vašich osobních údajů, budeme tyto osobní údaje zpracovávat
                    do doby, než udělený souhlas odvoláte (nestanovíme-li při získávání Vašeho souhlasu kratší dobu
                    zpracování).
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  10. Jak jsou mé osobní údaje zabezpečeny?
                </h2>
                <p className="mb-4">
                  Zpracovávané osobní údaje jsou zabezpečeny standardními postupy a technologiemi, které je chrání před
                  neoprávněným přístupem ze strany třetích osob. Přijatá bezpečnostní opatření jsou pravidelně
                  kontrolována a aktualizována. Pro lepší zabezpečení Vašich osobních údajů je přístup k nim chráněn
                  heslem a údaje jsou při přenosu mezi Vaším prohlížečem a našimi webovými stránkami šifrovány.
                  Pravidelně ověřujeme, zda systémy používané ke zpracování osobních údajů neobsahují slabá místa či
                  nebyly vystaveny útoku.
                </p>
                <p className="mb-4">
                  Bez ohledu na výše uvedené prosím vezměte na vědomí, že v prostředí internetu není objektivně možné
                  zcela zaručit bezpečnost osobních údajů. Bez Vaší pomoci a odpovědného chování proto nejsme schopni
                  Vaše osobní údaje 100% ochránit. Bezpečnost Vašich osobních údajů zvýšíte zejména tím, že budete
                  používat jedinečná hesla a tato hesla pravidelně měnit. Vaše hesla a další přístupové údaje prosím
                  uchovávejte v tajnosti a dodržujte základní bezpečnostní zásady. Mějte vždy na paměti, že e-maily,
                  rychlé zprávy chatu, blogy a další typy komunikace s ostatními uživateli webových stránek nejsou
                  šifrovány. Proto důrazně doporučujeme nepoužívat tyto formy komunikace pro sdělování důvěrných
                  informací.
                </p>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
                  11. Jaká práva máte v souvislosti s ochranou osobních údajů?
                </h2>
                <p className="mb-4">
                  V souvislosti se zpracováním Vašich osobních údajů máte níže uvedená práva. Na výkon těchto práv se
                  nicméně mohou vztahovat určité výjimky, a proto je nemusí být možné uplatnit ve všech situacích. V
                  případě, že uplatníte Vaše práva a Vaše žádost bude shledána oprávněnou, přijmeme požadovaná opatření
                  bez zbytečného odkladu, nejpozději do jednoho měsíce (v důvodných případech lze tuto lhůtu prodloužit
                  až o další dva měsíce).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na informace</div>
                  <div className="md:col-span-2">
                    Máte právo být stručným, transparentním, srozumitelným a snadno přístupným způsobem informováni o
                    tom, jakým způsobem jsou Vaše osobní údaje zpracovávány.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na přístup k osobním údajům</div>
                  <div className="md:col-span-2">
                    Máte právo získat od nás potvrzení, zda osobní údaje, které se Vás týkají, jsou či nejsou
                    zpracovávány, a pokud je tomu tak, máte právo získat přístup k těmto osobním údajům (včetně
                    souvisejících informací) a jejich kopii.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na opravu</div>
                  <div className="md:col-span-2">
                    Můžete nás požádat o opravu nepřesných osobních údajů. Také můžete požadovat doplnění neúplných
                    osobních údajů, a to i poskytnutím dodatečného prohlášení.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na výmaz</div>
                  <div className="md:col-span-2">
                    Můžete nás požádat o výmaz zpracovávaných osobních údajů, a to za podmínek uvedených v článku 17
                    Nařízení. Vezměte prosím na vědomí, že v některých případech toto právo není možné uplatnit a Vaše
                    údaje budeme i nadále zpracovávat.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na omezení zpracování</div>
                  <div className="md:col-span-2">
                    V určitých případech můžete požadovat, abychom omezili prováděné zpracování (např. do doby vyřešení
                    Vašich námitek).
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo na přenositelnost údajů</div>
                  <div className="md:col-span-2">
                    Můžete nás požádat, abychom Vám či třetí osobě předali osobní údaje, které o Vás zpracováváme v
                    elektronické podobě na základě smlouvy či Vašeho souhlasu.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo odvolat souhlas</div>
                  <div className="md:col-span-2">
                    Pokud je zpracování osobních údajů založeno na Vašem souhlasu, můžete takový souhlas kdykoli odvolat
                    a zabránit tak dalšímu zpracování pro účel uvedený v daném souhlasu. Odvoláním souhlasu nicméně
                    nebude dotčena zákonnost zpracování v období před jeho odvoláním.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo vznést námitku</div>
                  <div className="md:col-span-2">
                    Pokud zpracováváme Vaše osobní údaje na základě našich oprávněných zájmů, máte právo vznést námitku
                    proti takovému zpracování. Můžeme nicméně prokázat, že na naší straně jsou závažné oprávněné důvody
                    pro další zpracování.
                    <br />
                    Pokud jsou Vaše osobní údaje zpracovávány pro účely přímého marketingu, máte právo vznést kdykoli
                    námitku proti zpracování těchto údajů. Pokud vznesete námitku proti zpracování pro účely přímého
                    marketingu, nebudou již osobní údaje pro tyto účely dále zpracovávány.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="font-semibold">Právo podat žádost o zjednání nápravy a právo vznést stížnost</div>
                  <div className="md:col-span-2">
                    Pokud se domníváte, že Vaše osobní údaje jsou zpracovávány v rozporu s právními předpisy, obraťte se
                    prosím na nás a my neprodleně zjednáme nápravu. Tím není dotčeno Vaše právo podat stížnost ohledně
                    prováděného zpracování přímo u Úřadu pro ochranu osobních údajů.
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">12. Jak nás můžete kontaktovat?</h2>
                <p className="mb-4">
                  V případě jakéhokoli dotazu na ochranu osobních údajů či odvolání souhlasu s dalším zpracováním Vašich
                  osobních údajů prosím využijte kontaktního formuláře dostupného v sekci osobních údajů{" "}
                  <a href="oou-formular/" className="text-orange-500 hover:text-orange-600">
                    ZDE
                  </a>{" "}
                  nebo písemně na naší adrese: Expohledávky s.r.o., Na strži 1702/65, Nusle, 140 00 Praha 4, k rukám
                  pověřence pro ochranu osobních údajů. Kontaktovat nás můžete též na e-mailové adrese pověřence pro
                  ochranu osobních údajů: oou@expohledavky.cz
                </p>
                <p className="mb-4">
                  V této souvislosti bychom Vás chtěli upozornit, že můžeme chtít, abyste nám vhodným způsobem prokázali
                  Vaši totožnost, abychom si mohli ověřit Vaši identitu. Jde o preventivní bezpečnostní opatření,
                  abychom zamezili přístupu neoprávněných osob k Vašim osobním údajům.
                </p>
              </div>
            </SectionWrapper>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

