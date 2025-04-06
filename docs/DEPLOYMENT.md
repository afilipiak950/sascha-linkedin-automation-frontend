# Deployment-Anleitung

## Voraussetzungen

- Docker und Docker Compose
- Node.js 18 oder höher
- AWS CLI (für Cloud-Deployment)
- Git

## Lokales Deployment

1. Repository klonen:
   ```bash
   git clone https://github.com/your-username/linkedin-automation.git
   cd linkedin-automation
   ```

2. Umgebungsvariablen konfigurieren:
   ```bash
   cp .env.example .env
   # Bearbeiten Sie .env mit Ihren Konfigurationswerten
   ```

3. Dependencies installieren:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. Mit Docker Compose starten:
   ```bash
   docker-compose up -d
   ```

## Cloud-Deployment (AWS)

1. AWS CLI konfigurieren:
   ```bash
   aws configure
   ```

2. ECR-Repositories erstellen:
   ```bash
   aws ecr create-repository --repository-name linkedin-automation-backend
   aws ecr create-repository --repository-name linkedin-automation-frontend
   ```

3. ECS-Cluster erstellen:
   ```bash
   aws ecs create-cluster --cluster-name linkedin-automation
   ```

4. Task Definitions erstellen:
   ```bash
   aws ecs register-task-definition --cli-input-json file://backend-task-definition.json
   aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json
   ```

5. Services erstellen:
   ```bash
   aws ecs create-service --cluster linkedin-automation --service-name backend --task-definition backend
   aws ecs create-service --cluster linkedin-automation --service-name frontend --task-definition frontend
   ```

## SSL/TLS-Konfiguration

1. SSL-Zertifikat erhalten (z.B. von Let's Encrypt):
   ```bash
   certbot certonly --standalone -d api.linkedin-automation.com
   ```

2. Nginx-Konfiguration:
   ```nginx
   server {
       listen 443 ssl;
       server_name api.linkedin-automation.com;
       
       ssl_certificate /etc/letsencrypt/live/api.linkedin-automation.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.linkedin-automation.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Monitoring einrichten

1. Prometheus konfigurieren:
   ```bash
   # prometheus.yml bereits im Repository
   docker-compose up -d prometheus
   ```

2. Grafana einrichten:
   ```bash
   docker-compose up -d grafana
   # Öffnen Sie http://localhost:3002 und melden Sie sich an
   # Fügen Sie Prometheus als Datenquelle hinzu
   ```

## Wartung und Updates

1. Logs überwachen:
   ```bash
   docker-compose logs -f
   ```

2. Updates durchführen:
   ```bash
   git pull
   docker-compose build
   docker-compose up -d
   ```

3. Backup erstellen:
   ```bash
   ./scripts/backup.sh
   ```

## Fehlerbehebung

1. Container-Status prüfen:
   ```bash
   docker-compose ps
   ```

2. Logs analysieren:
   ```bash
   docker-compose logs [service-name]
   ```

3. Container neustarten:
   ```bash
   docker-compose restart [service-name]
   ```

## Sicherheitshinweise

- Regelmäßig Sicherheitsupdates durchführen
- API-Schlüssel und Zugangsdaten sicher aufbewahren
- Firewall-Regeln regelmäßig überprüfen
- Backup-Strategie implementieren
- Monitoring-Systeme aktiv überwachen 

## Fehlerbehebung für Docker Desktop und WSL

Der Fehler deutet darauf hin, dass es ein Problem mit der WSL-Integration (Windows Subsystem for Linux) gibt, die Docker Desktop benötigt. Hier sind die Schritte zur Behebung:

1. **WSL herunterfahren**:
   Öffnen Sie PowerShell als Administrator und führen Sie folgenden Befehl aus:

   ```
   wsl --shutdown
   ```

2. **Docker Desktop neu starten**:
   - Schließen Sie Docker Desktop vollständig
   - Starten Sie Docker Desktop neu

3. **WSL-Status überprüfen**:
   ```
   wsl --status
   ```

4. **WSL aktualisieren**:
   ```
   wsl --update
   ```

5. **Docker Desktop-Einstellungen überprüfen**:
   - Öffnen Sie Docker Desktop
   - Gehen Sie zu Einstellungen > Allgemein
   - Stellen Sie sicher, dass "Use WSL 2 based engine" aktiviert ist

6. **System neu starten**:
   Wenn die obigen Schritte nicht helfen, starten Sie Ihren Computer neu.

7. **WSL neu installieren** (als letzte Option):
   ```
   wsl --unregister docker-desktop
   wsl --unregister docker-desktop-data
   ```
   Dann starten Sie Docker Desktop neu.

8. **Docker Desktop neu installieren**:
   Wenn nichts anderes funktioniert, deinstallieren Sie Docker Desktop und installieren Sie es neu.

## Alternative: Lokale Entwicklung ohne Docker

Wenn Sie weiterhin Probleme mit Docker haben, können Sie die Anwendung auch ohne Docker lokal ausführen:

1. **Backend starten**:
   ```
   cd backend
   npm install
   npm start
   ```

2. **Frontend starten**:
   ```
   cd frontend
   npm install
   npm start
   ```

3. **Redis lokal installieren**:
   Sie können Redis für Windows von der offiziellen Website herunterladen und installieren.

## Möchten Sie, dass ich Ihnen bei einem dieser Schritte genauer helfe?

Ich kann Ihnen auch helfen, die Anwendung ohne Docker zu konfigurieren, wenn Sie weiterhin Probleme mit Docker Desktop haben.