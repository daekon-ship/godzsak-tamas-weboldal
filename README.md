# GT-Lakásfelújítás — gt-lakasfelujitas.hu

Godzsák Tamás E.V. (GT-Lakásfelújítás) statikus, egyoldalas weboldala. Nincs build és nincs függőség: az `index.html` minden stílust és szkriptet tartalmaz.

## Fájlok

- `index.html` – a főoldal (forrása a DAEKON látványterv: `daekon-ship/daekon` → `public/latvanytervek/godzsak-tamas/`)
- `adatkezeles.html` – adatkezelési tájékoztató (`assets/css/style.css`-t használ)
- `assets/favicon.svg`, `robots.txt`, `sitemap.xml`, `.htaccess` (HTTPS + www nélküli átirányítás)

## Feltöltés FTP-re (automatikus)

A `main` ágra küldött minden módosítás után a `.github/workflows/ftp-deploy.yml` feltölti a fájlokat a tárhelyre. Kézzel is indítható: **Actions → FTP feltöltés → Run workflow**.

Szükséges repository-titkok (**Settings → Secrets and variables → Actions → New repository secret**):

| Név | Érték |
|---|---|
| `FTP_SERVER` | `we002.tarhely.com` |
| `FTP_USERNAME` | az FTP felhasználónév |
| `FTP_PASSWORD` | az FTP jelszó |
| `FTP_SERVER_DIR` | *(nem kötelező)* célmappa, ha az FTP nem közvetlenül a webgyökérbe lép be, pl. `public_html/` |

A jelszó soha ne kerüljön a repóba – ez a repó nyilvános.

## Tartalom

- A képhelyeken „Fotók hamarosan” jelzés áll; a valódi fotók az `index.html` végén lévő `PROJECTS` / `CRAFT` tömbökben `src` mezővel cserélhetők.
- Az „Előtte / Utána” modul csak valódi fotópár esetén jelenik meg.
- Szolgáltatási terület: Cigánd és környéke, Szlovákia (egyeztetés alapján). Kitalált szám, vélemény vagy referencia nincs az oldalon.
