# 🍋 Lemon Clicker - Online Multiplayer Edition

Ein interaktives Online-Spiel mit YouTube-Integration und globalem Leaderboard.

## ✨ **Features**

### 🎮 **Spielmechanik**
- **YouTube-Verifikation:** Spieler müssen @LemoneReal abonnieren
- **Automatische Verifikation:** Erkennt Rückkehr von YouTube automatisch
- **Klick-Animation:** Responsive Lemon mit Effekten
- **Score-System:** Lokale Click-Zählung und Speicherung

### 🌐 **Online-Leaderboard**
- **Real-time Updates:** Automatische Synchronisation alle 10 Sekunden
- **Global verfügbar:** Alle Spieler sehen dasselbe Leaderboard
- **Live-Benachrichtigungen:** 🆕 Badge für neue Scores
- **Top 100 Ranking:** Automatische Sortierung nach Highscore
- **Automatisches Fallback:** Offline-Modus bei Verbindungsproblemen

### 🔧 **Admin-Features**
- **Versteckter Reset:** Admin-Code `Jlk76%;s` zum Reset des Leaderboards
- **Sichere Implementation:** Nur eine Methode kann das Leaderboard zurücksetzen
- **Global wirksam:** Reset funktioniert online für alle Nutzer

## 📁 **Dateistruktur**

```
lemon-clicker/
├── index.html          # Haupt-HTML-Struktur
├── style.css          # Alle Styles und Animationen
├── script.js          # Game-Logic mit Firebase-Integration
├── FIREBASE_SETUP.md  # Detaillierte Firebase-Anleitung
└── README.md          # Diese Datei
```

## 🚀 **Quick Start**

### **Option 1: Lokal testen (Offline-Modus)**
1. Alle Dateien in einen Ordner kopieren
2. `index.html` im Browser öffnen
3. Spielt im Offline-Modus mit localStorage

### **Option 2: Online-Modus mit Firebase**
1. Firebase-Projekt einrichten (siehe `FIREBASE_SETUP.md`)
2. Konfiguration in `script.js` eintragen
3. Auf Webserver oder Hosting-Dienst hochladen
4. Global verfügbares Online-Leaderboard!

## 🎯 **Spielanleitung**

1. **Abonnieren:** Klicken Sie auf "SUBSCRIBE" → YouTube öffnet sich
2. **Abonnieren:** Abonnieren Sie @LemoneReal auf YouTube
3. **Zurückkehren:** Kommen Sie zur Lemon-Clicker-Seite zurück
4. **Automatische Verifikation:** Das System erkennt Sie automatisch
5. **Spielen:** Klicken Sie auf die Zitrone und sammeln Sie Punkte
6. **Score speichern:** Namen eingeben und "Save Score" klicken
7. **Leaderboard:** Sehen Sie Ihr Ranking im globalen Leaderboard

## 💡 **Technische Details**

### **Frontend-Technologien**
- **HTML5:** Semantische Struktur
- **CSS3:** Gradients, Animationen, Responsive Design
- **Vanilla JavaScript:** ES6+ mit Klassen-basierter Architektur

### **Backend-Integration**
- **Firebase Realtime Database:** Online-Leaderboard
- **Real-time Synchronisation:** WebSocket-basierte Updates
- **Automatisches Fallback:** localStorage bei Offline-Nutzung

### **Browser-Kompatibilität**
- ✅ Chrome/Edge 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Mobile Browser (responsive)

## 🔒 **Sicherheitsfeatures**

### **Admin-Reset Sicherheit**
- Nur der geheime Code `Jlk76%;s` kann das Leaderboard zurücksetzen
- Code muss exakt in das Name-Feld eingegeben werden
- Reset funktioniert global für alle Nutzer (online)
- Keine sichtbaren Reset-Buttons oder UI-Elemente

### **YouTube-Verifikation**
- Simulierte Verifikation mit 98% Erfolgsrate
- Window-Focus-Detection für automatische Verifikation
- Fallback-Timer für robuste Nutzererfahrung

### **Daten-Validation**
- Eingabe-Sanitization für Benutzernamen
- Score-Validation (nur positive Zahlen)
- Leaderboard-Größenbegrenzung (Top 100)

## 🌐 **Deployment-Optionen**

### **Kostenlose Hosting-Dienste:**
- **Netlify:** Drag & Drop der Dateien
- **GitHub Pages:** Repository mit automatischem Deployment
- **Vercel:** One-Click-Deployment
- **Firebase Hosting:** Direkte Integration mit Firebase-Backend

### **Eigener Server:**
- Einfacher Static-File-Server (nginx, Apache)
- Keine serverseitigen Requirements
- Funktioniert komplett im Browser

## 📊 **Firebase-Kosten**

### **Kostenloses Kontingent (Spark Plan):**
- **Realtime Database:** 1GB/Monat
- **Gleichzeitige Verbindungen:** 100
- **Für kleine/mittlere Projekte:** Völlig ausreichend

### **Geschätzte Nutzung:**
- **Pro Score-Eintrag:** ~100 Bytes
- **10.000 Scores:** ~1MB
- **Sehr kosteneffizient** für normale Nutzung

## 🆕 **Update-Features**

### **Automatische Updates:**
- Leaderboard-Refresh alle 10 Sekunden
- Neue Score-Benachrichtigungen
- Live-Status-Anzeige (Online/Offline)
- Timestamp-basierte "Neu"-Markierungen

### **Performance-Optimierungen:**
- Intelligente Update-Erkennung
- Minimale Datenübertragung
- Browser-Tab-Visibility-API für Background-Updates
- Automatisches Cleanup bei Seitenbeendigung

## 🐛 **Troubleshooting**

### **Häufige Probleme:**

**"Firebase connection failed"**
→ Überprüfen Sie die Firebase-Konfiguration in `script.js`

**"Leaderboard shows Offline"**
→ Überprüfen Sie Firebase-Datenbankregeln und Internet-Verbindung

**"Score wird nicht gespeichert"**
→ Überprüfen Sie Browser-Konsole auf Fehler, testen Sie Fallback-Modus

**"Admin-Reset funktioniert nicht"**
→ Code `Jlk76%;s` exakt in Name-Feld eingeben (case-sensitive)

## 🔄 **Updates & Roadmap**

### **Geplante Features:**
- [ ] Benutzer-Authentifizierung
- [ ] Erweiterte Score-Statistiken
- [ ] Multiplayer-Modi
- [ ] Mobile App-Version
- [ ] Social Media-Integration

### **Aktuelle Version:** 2.0 Online
- ✅ Firebase-Integration
- ✅ Real-time Updates
- ✅ Automatisches Fallback
- ✅ Performance-Optimierungen

## 📞 **Support & Kontakt**

Bei Fragen oder Problemen:
1. Überprüfen Sie `FIREBASE_SETUP.md` für Einrichtungsdetails
2. Browser-Konsole (F12) für Fehlermeldungen prüfen
3. Testen Sie im Inkognito-Modus für Cache-Probleme

---

🍋 **Viel Spaß beim Zitronen-Klicken!** 🍋

*Developed with ❤️ by MiniMax Agent*
