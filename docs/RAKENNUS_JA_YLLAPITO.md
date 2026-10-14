# Finnexprience – toteutus- ja ylläpito-ohje

Tämä dokumentti sovittaa liitetyn matkailusivuston rakennusohjeen nykyiseen Finnexprience-koodiin.

## Arkkitehtuuripäätös

Nykyinen sivusto käyttää Next.js App Routeria, TypeScriptiä, Verceliä ja Supabasea. Sitä ei muuteta pelkästään ohjeen takia Netlifyyn vietäväksi staattiseksi sivustoksi: nykyinen toteutus käyttää palvelinpuolen Supabase-hakuja ja mukautettua hallintapaneelia. Ohjeesta hyödynnetään kuitenkin tärkeät toiminnallisuudet: FI/EN/ES-kielet, selaimella käytettävä sisällönhallinta, sivujen luonnos/julkaisu, kuvien hallinta, alasivurakenne, hakukonekuvaukset, ulkoiset palveluntarjoajalinkit ja mobiilikäyttö.

## Julkaisu ja ympäristömuuttujat

Vercel-projektissa `finnexprience` tarvitaan nämä ympäristömuuttujat sekä Preview- että Production-ympäristöissä:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase-projektin URL, esimerkiksi `https://PROJECT-REF.supabase.co`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: saman projektin julkinen anon/publishable key.

Tallenna arvot Verceliin ja käynnistä sen jälkeen uusi deployment. Älä tallenna avaimia GitHubiin tai tähän dokumenttiin. Älä koskaan käytä `service_role`-avainta selaimessa.

## Supabase-tietokannan käyttöönotto

Uudessa Supabase-projektissa aja SQL Editorissa `supabase/schema.sql).

Jos projekti on jo olemassa, aja molemmat migraatiot Supabase SQL Editorissa:

- `supabase/migrations/0009_admin_users_self_select.sql` – sallii käyttäjän lukea oman ylläpitäjärivinsä.
- `supabase/migrations/0010_pages_content_builder.sql` – lisää sivuhierarkian, SEO-kuvaukset ja FI/EN/ES-sisältölohkot.

Hallintapaneelin pitää saada lukea kirjautuneen käyttäjän oma `admin_users`-rivi. Ilman tätä RLS-sääntöä kirjautuminen voi onnistua, mutta käyttöliittymä ei tunnista käyttäjää ylläpitäjäksi. Sisältölohkojen editori edellyttää migraation 0010 sarakkeita.

### Lisää ensimmäinen ylläpitäjä

1. Luo käyttäjä Supabase Dashboardin Authentication → Users -näkymässä tai käytä GitHub-/sähköpostikirjautumista.
2. Kopioi käyttäjän UUID Authentication-näkymästä.
3. Aja SQL Editorissa seuraava SQL korvaten esimerkkitiedot:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH-USER-UUID', 'oma-sahkoposti@example.com')
on conflict (user_id) do update set email = excluded.email;
```

Ylläpitäjäksi pääsy ei perustu pelkästään siihen, että käyttäjä voi kirjautua sisään. Vain `admin_users`-tauluun lisätty käyttäjä hyväksytään hallintapaneeliin.

## GitHub-tunnistautuminen Supabasen kautta

GitHub OAuth toimii nykyisessä arkkitehtuurissa Supabase Authin välityksellä. Älä käytä Netlify OAuth -callbackia, koska tämä projekti julkaistaan Vercelissä eikä sen hallintapaneeli ole Decap CMS.

1. Avaa Supabase Dashboard → Authentication → Providers → GitHub ja ota provider käyttöön.
2. Luo GitHubissa OAuth App. GitHubin **Authorization callback URL** on Supabasen näyttämä callback, tavallisesti `https://PROJECT-REF.supabase.co/auth/v1/callback`. Se ei ole sovelluksen `/auth/callback`-osoite.
3. Kopioi GitHub OAuth Appin Client ID ja Client Secret Supabasen GitHub-provider-asetuksiin.
4. Avaa Supabase Authentication → URL Configuration.
5. Aseta Site URL nykyiseen tuotanto-osoitteeseen `https://finnexprience.vercel.app`.
6. Lisää sallittuihin Redirect URLs -osoitteisiin `https://finnexprience.vercel.app/auth/callback`. Lisää myös käytössä oleva Preview-osoite, jos kirjaudut Preview-deploymentista.
7. Luo tai kirjaa sisään GitHub-käyttäjä ja lisää sen UUID `admin_users`-tauluun yllä olevan SQL:n avulla.

Sähköpostilinkin käyttö vaatii, että käyttäjätili on olemassa Supabase Authissa ja sähköpostin lähetys toimii. Supabasen oletussähköpostipalvelun rajoitukset voivat vaikuttaa tuotantokäyttöön; tarvittaessa määritä oma SMTP-palvelu.

## Hallintapaneeli

Avaa `/admin`. Nykyinen hallinta sisältää välilehdet:

- Yleiskatsaus ja etusivun tekstit
- Etusivun kuvat
- Sivut kolmella kielellä
- Kohteet kolmella kielellä
- Matkapyynnöt

Kirjautuminen on tarkoitettu sivuston ylläpitäjälle. Sivujen ja kohteiden julkaisu riippuu Supabasen RLS-säännöistä. Testaa tallennus ja julkaisun näkyminen ennen sisällön syöttämistä.

## Ohjeen sisällönrakenteen jatkokehitys

Liitetty ohje määrittelee hyödyllisen lohkomallin: tekstilohko, kuva, galleria, linkkipainikkeet, alasivulista, CTA, upotus sekä yhteydenottolomake. Se suosittelee myös sivuhierarkiaa, kielikohtaisia SEO-kuvauksia ja media-alt-tekstejä. Nykyisessä CMS:ssä nämä eivät ole kaikki vielä käytössä täysimääräisesti; sivujen nykyinen sisältökenttä on pääosin tekstipohjainen. Ne kannattaa toteuttaa tietokantamigraatioina ja hallintapaneelin editorina ennen kuin vanhaa sivustoa muutetaan staattiseksi tai toiseen CMS-järjestelmään.

## Matkailusisällön julkaiseminen

- Oletuskieli on nykyisessä toteutuksessa espanja (`/`); suomi on `/fi` ja englanti `/en`. Tämä seuraa projektin aiemmin valittua ensisijaista kohderyhmää.
- Aloitusalue on Salo, Perniö, Mathildedal, Teijo, Särkisalo ja Kemiönsaari. Älä lisää Lappia tähän sisältökonseptiin.
- Ohjaa varaukset palveluntarjoajien omiin virallisiin sivuihin. Älä esitä Finnexprienceä matkapakettien myyjänä.
- Tarkista hinnat, aukioloajat, tapahtumapäivät, kulkuyhteydet ja varauslinkit alkuperäiseltä lähteeltä ennen julkaisua.
- Julkaise vain kuvia, joihin on käyttöoikeus; lisää kuvaan vaihtoehtoinen teksti ja tarvittaessa kuvaajan/luvan edellyttämä maininta.

## Käyttöönottotesti

1. Vercelin viimeisin deployment onnistuu.
2. `/api/health` palauttaa JSON-vastauksen, jossa `ok: true`.
3. `/admin` näyttää kirjautumisvaihtoehdot eikä Supabase-asetusvirhettä.
4. GitHub OAuth ja sähköpostilinkki palaavat `/auth/callback`-reitin kautta.
5. Ei-ylläpitäjä ei pääse sisältöön, vaikka onnistuu kirjautumaan.
6. Ylläpitäjä pystyy tallentamaan kohteen ja sivun, julkaisemaan sisällön sekä lataamaan kuvan.
7. Tarkista julkaistut muutokset espanjaksi, suomeksi ja englanniksi sekä puhelimella että tietokoneella.
