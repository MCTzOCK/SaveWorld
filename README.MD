# SaveWorld

vorerst archiviert

Die App für Nachhaltigkeit - nachhaltiges Denken bei Jugendlichen stärken!

![Header Image](https://download.ben-siebert.com/saveworld/assets/gh/header.png)

## Autoren

- [Ben Siebert](https://ben-siebert.com) (Entwicklung)

## Demo

Eine Demo für SaveWorld kann über verschiedene Wege eingesehen werden:

- Web-App: [https://app.saveworld.one](https://app.saveworld.one)
- iOS-App: [https://apps.apple.com/de/app/saveworld/id6462684063](https://apps.apple.com/de/app/saveworld/id6462684063)
- Android-App (
  Beta): [https://download.ben-siebert.com/saveworld/app/2024.01.24-release/SaveWorld.apk](https://download.ben-siebert.com/saveworld/app/2024.01.24-release/SaveWorld.apk)

## Rückmeldungen

Um Rückmeldungen zu übermitteln (Fehlermeldung, Funktionsanregung, etc.) gibt es verschiedene Möglichkeiten:

- GitHub issue erstellen
- E-Mail: [ben@saveworld.one](ben@saveworld.one)
- Kontaktformular (Anmeldung erforderlich): [https://app.saveworld.one/support](https://app.saveworld.one/support)

## REST-API Dokumentation

Die automatisch erstellte Swagger Dokumentation ist
unter [https://api.saveworld.one/docs](https://api.saveworld.one/docs) verfügbar. Diese kann allerdings nicht komplett
vollständig in Bezug auf zu übergebende Parameter bzw. Rückgabewerte sein.

## Farben

**Primary**

| Ton (kleiner = heller) | Vorschau                                                 | Hex     |
|------------------------|----------------------------------------------------------|---------|
| 50                     | ![#EAFBF1](https://via.placeholder.com/40/EAFBF1?text=+) | #EAFBF1 |
| 100                    | ![#C4F3D7](https://via.placeholder.com/40/C4F3D7?text=+) | #C4F3D7 |
| 200                    | ![#9EEBBC](https://via.placeholder.com/40/9EEBBC?text=+) | #9EEBBC |
| 300                    | ![#78E3A2](https://via.placeholder.com/40/78E3A2?text=+) | #78E3A2 |
| 400                    | ![#52DB88](https://via.placeholder.com/40/52DB88?text=+) | #52DB88 |
| 500                    | ![#2CD36E](https://via.placeholder.com/40/2CD36E?text=+) | #2CD36E |
| 600                    | ![#23A958](https://via.placeholder.com/40/23A958?text=+) | #23A958 |
| 700                    | ![#1B7E42](https://via.placeholder.com/40/1B7E42?text=+) | #1B7E42 |
| 800                    | ![#12542C](https://via.placeholder.com/40/12542C?text=+) | #12542C |
| 900                    | ![#092A16](https://via.placeholder.com/40/092A16?text=+) | #092A16 |

**Gray**

| Ton (kleiner = heller) | Vorschau                                                 | Hex     |
|------------------------|----------------------------------------------------------|---------|
| 50                     | ![#F2F2F3](https://via.placeholder.com/40/F2F2F3?text=+) | #F2F2F3 |
| 100                    | ![#DADADC](https://via.placeholder.com/40/DADADC?text=+) | #DADADC |
| 200                    | ![#C2C2C6](https://via.placeholder.com/40/C2C2C6?text=+) | #C2C2C6 |
| 300                    | ![#ABABB0](https://via.placeholder.com/40/ABABB0?text=+) | #ABABB0 |
| 400                    | ![#93939A](https://via.placeholder.com/40/93939A?text=+) | #93939A |
| 500                    | ![#7B7B84](https://via.placeholder.com/40/7B7B84?text=+) | #7B7B84 |
| 600                    | ![#636369](https://via.placeholder.com/40/636369?text=+) | #636369 |
| 700                    | ![#4A4A4F](https://via.placeholder.com/40/4A4A4F?text=+) | #4A4A4F |
| 800                    | ![#313135](https://via.placeholder.com/40/313135?text=+) | #313135 |
| 900                    | ![#19191A](https://via.placeholder.com/40/19191A?text=+) | #19191A |
| 1000                   | ![#121212](https://via.placeholder.com/40/121212?text=+) | #121212 |

## Deployment

### Vorraussetzungen

- Node.js (> v18)
- Git
- Docker (nur für Backend/Microservices Bereitstellung)

Zunächst muss das Repository geklont werden:

```bash
  git clone https://git.saveworld.one/SaveWorld/SaveWorld.git SaveWorld
```

### Backend / Microservices

Um das SaveWorld Backend inklusive der Microservices bereitzustellen, kann die `docker-compose.yml`-Datei verwendet
werden. Wenn kein Test-Backend erstellt werden soll, kann der Dienst `backend_dev` entfernt werden. Wichtig ist, dass
die `.env`-Dateien `.env.backend` bzw. `.env.backend_dev` zuvor ausgefüllt werden.

```bash
  docker-compose up -d --build
```

### Mobile-App

Wichtig ist das Ausfüllen der `.env`-Datei, damit die App alle nötigen Umgebungsvariablen erhält. Außerdem müssen mit
folgendem Befehl alle benötigten Pakate installiert werden: `npm install`

**Web-App starten (mit HMR)**

Die Mobile-App kann mit folgendem Befehl gestartet werden (dieser **muss** im `mobile`-Verzeichnis ausgeführt werden):

```bash
  npm run dev
```

**Web-App bauen**

Für das Bauen der Mobile-App muss der folgende Befehl ausgeführt werden:

```bash
  npm run build
```

Die Ausgabedateien befinden sich anschließend im `dist`-Verzeichnis

**iOS-App bauen**

Das Bauen einer iOS-App ist nur unter MacOS X möglich:

```bash
  npx cap sync ios
  npx cap open ios
```

Anschließend öffnet sich XCode, wo anschließend das Signieren konfiguriert und schlussendlich die App gebaut werden
muss (Menu > Product > Archive).

## Umgebungsvariablen

### Backend (`/backend2`)

| Name                  | Beschreibung                                                              | 
|-----------------------|---------------------------------------------------------------------------|
| `PORT`                | Port, welcher anschließend für den HTTP-Traffic verwendet wird.           |
| `MONGO_URI`           | Datenbankverbinguns-URL (MongoDB)                                         |
| `SMTP_HOST`           | Host für die E-Mail Kommunikation                                         |
| `SMTP_PORT`           | Port für die E-Mail Kommunikation                                         |
| `SMTP_SECURE`         | Gibt an, ob eine TSL-Verbindung bei der E-Mails verwendet wird.           |
| `SMTP_FROM`           | Gibt die E-Mail-Adresse an, von welcher gesendet wird.                    |
| `SMTP_USER`           | Gibt den Benutzer an, mit dem die E-Mail-Verbindung authentifiziert wird. |
| `SMTP_PASS`           | Passwort des SMTP-Benutzers                                               |
| `EMAIL_BASE_URL`      | Basis URL, die für Links innerhalb von E-Mails verwendet wird.            |
| `JWT_SECRET`          | Sicherheitsschlüssel für Zugriffs-Tokens                                  |
| `MINIO_ENDPOINT`      | Dateispeicher-Host                                                        |
| `MINIO_PORT`          | Dateispeicher-Port                                                        |
| `MINIO_USE_SSL`       | Gibt die Verschlüsselung bei der Kommunikation mit dem Dateispeicher an.  |
| `MINIO_ACCESS_KEY`    | Dateispeicher-Zugriffsschlüssel                                           |
| `MINIO_SECRET_KEY`    | Dateispeicher-Zugriffspasswort                                            |
| `MINIO_MEDIA_BUCKET`  | Dateispeicher-Bilder                                                      |
| `ONE_SIGNAL_USER_KEY` | Benutzungsschlüssel für Push-Benachrichtigungen (OneSignal)               |
| `ONE_SIGNAL_APP_KEY`  | Appschlüssel für Push-Benachrichtigungen (OneSignal)                      |
| `NOMINATIM_URL`       | URL für GEO-Abfragen                                                      |
| `OPENAI_TOKEN`        | Zugriffsschlüssel für die OpenAI API                                      |
| `GITHUB_ACCESS_TOKEN` | Zugriffsschlüssel für GitHub                                              |
| `GITHUB_REPOSITORY`   | GitHub Repository für Issues                                              |

### Mobile-App (`/mobile`)

| Name                            | Beschreibung                                   | 
|---------------------------------|------------------------------------------------|
| `VITE_DEV_ENDPOINT`             | Test-Backend-Endpunkt                          |
| `VITE_ENDPOINT`                 | Backend-Endpunkt                               |
| `VITE_TRANSLATE_SERVER`         | Übersetzungs-Endpunkt                          |
| `VITE_ONE_SIGNAL_APP_ID`        | App-ID für Push-Benachrichtigungen (OneSignal) |
| `VITE_NOMINATIM_ENDPOINT`       | URL für GEO-Abfragen                           |
| `VITE_APPLE_MAP_KIT_TOKEN`      | Zugriffsschlüssel für Apple MapKit             |
| `VITE_DIRECTUS_ENDPOINT`        | Endpunkt für Inhalte                           |
| `VITE_FLAGSMITH_ENDPOINT`       | Endpunkt für Feature Flags                     |
| `VITE_FLAGSMITH_ENVIRONMENT_ID` | Umgebungs-ID für Feature Flags                 |
| `VITE_POSTHOG_KEY`              | Zugriffsschlüssel für das Analyse-Tool posthog |
| `VITE_POSTHOG_ENDPOINT`         | Endpunkt für das Analyse-Tool posthog          |

## Lizenz

Folgendes ist erlaubt:

- Lesen des Codes dieses Repositories
- Herunterladen dieses Repositories
- Lokales Verwenden dieses Repositories

Folgendes ist nur mit **schriftlicher** Genehmigung erlaubt:

- Verbreiten des Codes dieses Repositories
- Verwenden des Codes dieses Repositories für kommerzielle Zwecke
- Verwenden des Codes dieses Repositories in Zusammenhang mit einem Patent

