# LinkedIn Growth Agent

Ein Streamlit-basiertes Dashboard zur Automatisierung von LinkedIn-Aktivitäten.

## Features

- **Post Generator**: Automatische Generierung und Planung von LinkedIn-Posts
- **Interaction Manager**: Verwaltung von automatisierten Interaktionen
- **Network Growth**: Automatisierte Netzwerkerweiterung

## Installation

1. Klone das Repository:
```bash
git clone [repository-url]
cd linkedin-growth-agent
```

2. Installiere die Abhängigkeiten:
```bash
pip install -r requirements.txt
```

3. Konfiguriere die Umgebungsvariablen:
   - Erstelle eine `.streamlit/secrets.toml` Datei
   - Füge die API-URL hinzu:
     ```toml
     api_url = "http://localhost:3001"
     ```

4. Starte die Anwendung:
```bash
streamlit run app.py
```

## Verwendung

1. **Post Generator**:
   - Wähle Thema, Stil und Länge
   - Generiere automatisch Posts
   - Plane Posts für später

2. **Interaction Manager**:
   - Stelle Interaktionsfrequenz ein
   - Definiere Zielgruppe
   - Überwache Automatisierungseinstellungen

3. **Network Growth**:
   - Suche nach potenziellen Kontakten
   - Sende automatisierte Kontaktanfragen
   - Verwalte Netzwerkerweiterung

## Technologien

- Python
- Streamlit
- Requests
- Python-dotenv 