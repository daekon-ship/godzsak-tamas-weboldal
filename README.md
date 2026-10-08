# Godzsák Tamás E.V. — weboldal

Prémium, statikus egyoldalas weboldal. Nincs build folyamat, nincs dependency — a fájlok bármelyik statikus tárhelyre feltölthetők.

## Tartalom feltöltése (placeholder csere)

Az oldal minden fotóhelye jól jelzett placeholder. Csere menete:

1. **Hero fotó** — `index.html` → `.hero-bg` blokk: a `hero-grid` és `ph-note` elemek törlése után ide kerül egy `<img>` vagy CSS `background-image` (valódi, elkészült felújítás fotója, javasolt 2400 px széles WebP). A `<head>`-ben érdemes `<link rel="preload" as="image">`-gel előtölteni.
2. **Referenciák** — `.ph` elemek cseréje `<img src="...">` elemre, a `Projekt 01–04` címek, helyszínek, munkakörök és a `Projekt megtekintése` link valódi adatokkal. A `aria-disabled` link utána valódi `<a href>` lesz.
3. **Előtte / Utána** — `.ba-after` / `.ba-before` háttérként kapja a valódi fotópárt (azonos álláspont, azonos projektről). A `ba-` ghost feliratok törlendők.
4. **Portré** — `.about-portrait` figure helyére valódi, munka közbeni fotó.
5. **Munka közben sáv** — `.craft-item` elemek cseréje `<img>`-re (8 db, 3:4 arány).
6. **Ügyfélidézetek** — a `.trust-sub` sor törlődik, ha rögzített idézetek érkeznek; az értékelés száma az aktuális nyilvános adat szerint frissítendő (jelenleg 5,0 / 2 értékelés).

Minden `<img>` kapjon: `width/height` vagy `aspect-ratio` konténert (CLS), `loading="lazy"`-t (kivéve hero), `alt` szöveget, és WebP/AVIF formátumot `srcset`-tel.

## Űrlap

A küldés jelenleg **mailto fallback**: megnyitja a látogató e-mail kliensét előre kitöltött tartalommal. Éles backend esetén a `assets/js/main.js` űrlap-szekciójában a `window.location.href = mailto...` sort kell kicserélni `fetch()` hívásra a végpont URL-jére.

## Domain / SEO

- Domain véglegesítése után: `sitemap.xml` (`example.hu` helyre), `robots.txt` abszolút sitemap URL, `<link rel="canonical">` és `og:url` beillesztése a `index.html`-be.
- Tervezett SEO aloldalak: `/lakasfelujitas-budapest`, `/hazfelujitas-budapest`, `/festes-budapest`, `/gipszkartonozas-budapest`, `/komuves-budapest`, `/hoszigeteles-budapest` — mind ezzel a design rendszerrel.

## Hitelességi szabály

Az oldalon szándékosan **nincs** kitalált szám, évszám, projektmennyiség, garancia vagy fake értékelés. Csak megerősített adat szerepel (telefon, e-mail, terület, 5,0 / 2 értékelés).
