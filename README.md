# LinkedIn Automation Tool

Ein Fullstack-Tool zur Automatisierung von LinkedIn-Aktivitäten mit KI-gestützter Content-Generierung.

## Features

- 🤖 Automatische Post-Generierung mit GPT-4
- 📅 Intelligente Zeitplanung von Posts (3-4x pro Woche)
- 🤝 Automatische Kontakterweiterung (max. 39 pro Tag)
- 💬 Automatisierte Interaktionen (Likes, Kommentare)
- 🔒 Sichere Authentifizierung und Datenverschlüsselung
- 📊 Dashboard für Übersicht und Statistiken

## Technologie-Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL mit TypeORM
- Puppeteer für LinkedIn-Automation
- OpenAI GPT-4 für Content-Generierung
- JWT für Authentifizierung

### Frontend
- React mit TypeScript
- Material-UI für das Design
- Redux für State Management
- Chart.js für Statistiken

## Installation

1. Repository klonen:
```bash
git clone https://github.com/yourusername/linkedin-automation.git
cd linkedin-automation
```

2. Backend-Abhängigkeiten installieren:
```bash
cd backend
npm install
```

3. Frontend-Abhängigkeiten installieren:
```bash
cd ../frontend
npm install
```

4. Umgebungsvariablen konfigurieren:
```bash
cd ../backend
cp .env.example .env
# Bearbeiten Sie .env mit Ihren Einstellungen
```

5. Datenbank einrichten:
```bash
# PostgreSQL-Datenbank erstellen
createdb linkedin_automation
```

6. Backend starten:
```bash
cd backend
npm run dev
```

7. Frontend starten:
```bash
cd frontend
npm start
```

## Konfiguration

### LinkedIn-Einstellungen
- Posting-Frequenz: 3-4x pro Woche
- Maximale Verbindungsanfragen: 39 pro Tag
- Interaktions-Limits: 5 pro 30 Minuten

### KI-Textgenerierung
- Modell: GPT-4
- Anpassbare Parameter:
  - Ton (formell, informell, technisch)
  - Stil (analytisch, erzählend, lehrreich)
  - Länge (kurz, mittel, lang)

## Sicherheit

- Alle Passwörter werden verschlüsselt gespeichert
- JWT-basierte Authentifizierung
- Rate-Limiting für API-Endpunkte
- Sichere Cookie-Speicherung für LinkedIn-Sessions

## Best Practices

1. **LinkedIn-Richtlinien**
   - Respektieren Sie die Nutzungsbedingungen
   - Vermeiden Sie übermäßige Automatisierung
   - Halten Sie Interaktionen natürlich und authentisch

2. **Content-Qualität**
   - Überprüfen Sie generierte Posts vor der Veröffentlichung
   - Personalisieren Sie Verbindungsanfragen
   - Bleiben Sie thematisch relevant

3. **System-Monitoring**
   - Überprüfen Sie regelmäßig die Logs
   - Überwachen Sie die API-Limits
   - Sichern Sie die Datenbank regelmäßig

## Lizenz

MIT

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im GitHub-Repository. 