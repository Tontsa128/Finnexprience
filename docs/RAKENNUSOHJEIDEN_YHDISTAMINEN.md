# Rakennusohjeiden yhdistäminen Finnexprienceen

Tämä dokumentti sovittaa projektin mukana toimitetun *Matkailusivuston rakennusohje: Next.js + GitHub + Decap CMS* -ohjeen Finnexpriencen nykyiseen toteutukseen. Tarkoitus ei ole rakentaa toista rinnakkaista sivustoa, vaan käyttää ohjeen toiminnalliset vaatimukset jo olemassa olevassa sovelluksessa.

## Arkkitehtuuripäätös: yksi sivusto ja yksi sisällönhallinta

Finnexprience käyttää tällä hetkellä:
- Next.js App Routeria ja TypeScriptiä
- Supabasea tietokantana, kirjautumiseen ja kuvien tallennukseen
- omaa Supabaseen yhdistettyä `/admin`-hallintapaneelia
- GitHubia versionhallintaan ja pull request -tarkistuksiin
- Verceliä nykyisenä suunniteltuna/julkaisuun liitettynä Next.js-hostina

**Älä lisää Decap CMS:ää, Markdown-sisältökantaa, Netlify Formsia tai staattista vientiä rinnalle ilman erillistä arkkitehtuurimuutosta.** Ohjeen alkuperäinen ratkaisu tallentaa sisältöä GitHubin tiedostoihin ja julkaisee Netlifyssa. Finnexpriencen nykyinen ratkaisu tallentaa sisältöä Supabaseen. Näitä ei pidä sekoittaa: muuten hallinta voisi tallentaa tiedot yhteen paikkaan, kun julkinen sivusto lukee niitä toisesta.

Erityisesti ohjeen `output: 'export'` ei sovi sellaisenaan tähän toteutukseen, koska Finnexprience käyttää palvelinpuolen Supabase-kyselyitä muun muassa CMS-metatiedoissa ja sivukartassa. Älä muuta `next.config.ts`-tiedostoa staattiseen vientiin tämän ohjeen perusteella.

## Ohjeen ja nykyisen toteutuksen vastaavuus

| Toimitetun ohjeen vaatimus | Finnexpriencen nykyinen ratkaisu | Tarkistus ennen julkaisua |
|---|---|---|
| Next.js + Tailwind | Nykyinen Next.js App Router + Tailwind | CI:n build onnistuu |
| Selainpohjainen `/admin` | Oma Supabase Auth -hallintapaneeli | Testaa kirjautuminen oikealla admin-käyttäjällä |
| Sivujen luonti ja muokkaus | Supabasen `pages)-taulu ja hallintapaneeli | Luo, muokkaa, julkaise ja piilota testisivu |
| Kohteet ja alasivut | `destinations)-taulu, kohdehierarkia ja kohdesivut | Testaa Salo ja sen kohteet kaikilla kielillä |
| Hero-kuvat ja galleriat | `hero_slides), kohteiden kansikuvat/galleriat ja Supabase Storage | Lataa, näytä ja vaihda testikuva; varmista alt-teksti ja käyttöoikeustiedot |
| FI / EN / ES | Espanja oletuksena, lisäksi suomi ja englanti | Tarkista valikot, sivut, linkit ja metatiedot kaikilla kielillä |
| Sivuston asetukset | Supabasen `site_settings) | Muuta etusivun tekstiä ja varmista, että muutos näkyy julkisella sivulla |
| SEO ja sivukartta | Lokalisoidut CMS-metatiedot ja `app/sitemap.ts) | Avaa `/sitemap.xml` ja testaa julkaistut URL-osoitteet |
| Kuvien lähteet ja lisenssit | Hero-/kohdemedian lähde-, tekijä-, lisenssi- ja tarkistustiedot | Älä julkaise kuvaa, jonka käyttöoikeutta ei ole tarkistettu |
| Yhteydenottolomake | Ei pidä olettaa toimivaksi vain käyttöliittymän perusteella | Varmista, onko lomakkeella toimiva tallennus-/lähetysreitti ja roskapostisuojaus ennen sen mainostamista |
| GitHub-julkaisuputki | GitHub Actions tarkistaa buildin; PR pysyy erillään tuotannosta | Tarkista Actions ja erikseen hostauksen deployment |
| Netlify Forms + Decap CMS | Ei käytössä nykyisessä arkkitehtuurissa | Älä lisää rinnalle; toteuta tarvittaessa Supabase-/palvelinratkaisuna |

## Pakollinen käyttöönottotarkistuslista

### A. GitHub ja build
- [ ] Pull requestin CI/build on vihreä viimeisimmällä commitilla.
- [ ] Muutokset tarkistetaan PR:ssä; PR:ää ei yhdistetä ilman erillistä päätöstä.
- [ ] Riippuvuudet lukitaan lock-tiedostoon ja CI käyttää toistettavaa asennusta ennen tuotantokäyttöä.
- [ ] Riippuvuuksien audit-havainnot selvitetään; suuria päivityksiä ei tehdä sokkona.

### B. Supabase ja käyttöoikeudet
- [ ] Projektin Supabase URL ja julkinen anon/publishable-avain on asetettu hostauksen ympäristömuuttujiin.
- [ ] Kaikki migraatiot `0005`–`0008` on suoritettu kyseisessä Supabase-projektissa. Pelkkä SQL-tiedoston tallentaminen GitHubiin ei suorita migraatiota.
- [ ] Oikea käyttäjä on lisätty `admin_users)-tauluun vasta, kun Supabase Auth -käyttäjä on luotu.
- [ ] Kirjautumaton kävijä ei pääse hallintatoimintoihin.
- [ ] Tavallinen kirjautunut käyttäjä ei pääse admin-toimintoihin ilman `admin_users)-jäsenyyttä.
- [ ] Julkinen kävijä näkee vain julkaistut sivut ja aktiiviset hero-diat.
- [ ] Storage-bucketin julkinen luku ja admin-rajoitetut kirjoitusoikeudet on tarkistettu.

### C. Sisältö ja kuvat
- [ ] Testisivu voidaan luoda, tallentaa, julkaista, muokata ja poistaa.
- [ ] Testikohde voidaan luoda ja näyttää oikealla kieliversiolla.
- [ ] Hero-diojen järjestys ja aktiivisuus vaikuttavat julkiseen sivuun.
- [ ] Kuvalataus hyväksyy vain sallitut kuvatyypit ja rajoittaa tiedostokokoa.
- [ ] Kuvilla on tarkoituksenmukainen alt-teksti ja lähde-/lisenssitiedot.
- [ ] Inspiraatiokuvaa ei esitetä valheellisesti tietyn majoituskohteen tai yrityksen kuvana.

### D. Julkinen sivusto
- [ ] Etusivu avautuu espanjaksi oletuskielenä.
- [ ] FI- ja EN-kielivalinta vie olemassa olevalle vastaavalle sivulle eikä 404:ään.
- [ ] Salo → majoitus / ruoka / tekeminen -polut ja yksittäiset kohdesivut toimivat.
- [ ] Ulkoiset varaus- ja palveluntarjoajalinkit vievät oikeaan viralliseen kohteeseen.
- [ ] Hintoja, aukioloaikoja, tapahtumapäiviä tai saatavuutta ei näytetä vahvistamattomina.
- [ ] Sivusto toimii puhelimella ja tietokoneella.
- [ ] Tietosuojaseloste ja kumppanilinkkien ilmoitus ovat näkyvissä ennen henkilötietojen keräämistä tai kaupallisten linkkien käyttämistä.

### E. Julkaisu
- [ ] Hostauksen ympäristömuuttujat ovat oikeissa Preview- ja Production-ympäristöissä.
- [ ] Uusi deployment on onnistunut hostauksen omassa hallinnassa.
- [ ] Julkaistulla URL-osoitteella on testattu etusivu, kohdesivut, `/admin`, `/sitemap.xml` ja kirjautuminen.
- [ ] Palautus aiempaan toimivaan versioon on mahdollista.

## Mitä on jo tehty ja mitä ei pidä väittää valmiiksi

Projektissa on kooditasolla toteutettu muun muassa Supabaseen perustuva hallintapaneeli, kohdehierarkia, lokalisoidut SEO-kentät, kuvien lähde-/lisenssitiedot, migraatiot ja sivukartta. GitHub Actionsin viimeisin tarkistettu build on onnistunut.

Se **ei yksin todista**, että tuotannon Supabase-migraatiot on suoritettu, kirjautuminen ja tallennus toimivat oikeassa projektissa tai Vercel-julkaisu on onnistunut. Nämä pitää testata yllä olevalla tarkistuslistalla. Älä merkitse kohtaa valmiiksi ennen todellista testiä.

## Suositeltu etenemisjärjestys

1. Vahvista ympäristömuuttujat ja suorita puuttuvat Supabase-migraatiot.
2. Testaa kirjautuminen, käyttöoikeudet, sisällön tallennus ja kuvien lataus.
3. Testaa julkiset sivupolut sekä FI/EN/ES-kieliversiot.
4. Tarkista lomakkeen todellinen lähetysreitti ja tietosuojatekstit.
5. Selvitä riippuvuuksien audit-havainnot ja lukitse asennus lock-tiedostolla.
6. Tarkista onnistunut hostausdeployment ja testaa julkaistu sivusto mobiilissa.
