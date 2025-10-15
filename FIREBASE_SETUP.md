# 🔥 Firebase Setup für Online-Leaderboard

## 📋 **Anleitung: Firebase einrichten**

### **Schritt 1: Firebase-Projekt erstellen**

1. Gehen Sie zu [Firebase Console](https://console.firebase.google.com/)
2. Klicken Sie auf "Projekt hinzufügen"
3. Geben Sie einen Projektnamen ein (z.B. "lemon-clicker-online")
4. Deaktivieren Sie Google Analytics (nicht erforderlich)
5. Klicken Sie auf "Projekt erstellen"

### **Schritt 2: Realtime Database aktivieren**

1. In der Firebase Console → "Realtime Database"
2. Klicken Sie auf "Datenbank erstellen"
3. Wählen Sie **"Im Testmodus starten"** (wichtig!)
4. Wählen Sie eine Region (z.B. europe-west1)

### **Schritt 3: Web-App hinzufügen**

1. In der Projektübersicht → "Web-App hinzufügen" (</> Symbol)
2. App-Name eingeben: "Lemon Clicker"
3. **NICHT** "Firebase Hosting einrichten" aktivieren
4. Klicken Sie auf "App registrieren"

### **Schritt 4: Konfiguration kopieren**

Sie erhalten eine Konfiguration wie diese:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "ihr-projekt.firebaseapp.com",
  databaseURL: "https://ihr-projekt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ihr-projekt",
  storageBucket: "ihr-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### **Schritt 5: Konfiguration in script.js einfügen**

Öffnen Sie `script.js` und ersetzen Sie die Demo-Konfiguration:

```javascript
// Ersetzen Sie diese Demo-Konfiguration:
const firebaseConfig = {
    apiKey: "AIzaSyB7OYzQ4P6KVV3-vP8WxOcX9N8kF5dXUzM", // ❌ DEMO
    authDomain: "lemon-clicker-demo.firebaseapp.com",
    // ... rest der Demo-Config
};

// Mit Ihrer echten Konfiguration:
const firebaseConfig = {
    apiKey: "IHRE_API_KEY_HIER",
    authDomain: "ihr-projekt.firebaseapp.com",
    databaseURL: "https://ihr-projekt-default-rtdb.REGION.firebasedatabase.app",
    projectId: "ihr-projekt",
    storageBucket: "ihr-projekt.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### **Schritt 6: Sicherheitsregeln anpassen**

1. In Firebase Console → "Realtime Database" → "Regeln"
2. Ersetzen Sie die Regeln mit:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true,
      "$entry": {
        ".validate": "newData.hasChildren(['name', 'score', 'date', 'timestamp', 'id']) && 
                     newData.child('name').isString() && 
                     newData.child('score').isNumber() && 
                     newData.child('score').val() > 0 && 
                     newData.child('name').val().length <= 20"
      }
    }
  }
}
```

3. Klicken Sie auf "Veröffentlichen"

## ✅ **Test der Installation**

1. Öffnen Sie Ihre Website
2. Der Leaderboard-Titel sollte zeigen: "🌐 Online"
3. Sie sollten die Nachricht "🌐 Connected to online leaderboard!" sehen
4. Scores werden automatisch alle 10 Sekunden synchronisiert

## ⚠️ **Wichtige Hinweise**

### **Kostenkontrolle:**
- Firebase Realtime Database ist bis 1GB/Monat **kostenlos**
- Für normale Nutzung reicht das kostenlose Kontingent aus
- Überwachen Sie die Nutzung in der Firebase Console

### **Sicherheit:**
- Die Testmodus-Regeln sind NUR für Demos geeignet
- Für Produktivnutzung sollten Sie die Regeln verschärfen
- Überlegen Sie sich Authentifizierung für Admin-Funktionen

### **Fallback-Modus:**
- Wenn Firebase nicht verfügbar ist, verwendet die App automatisch localStorage
- Der Status wird im Leaderboard-Titel angezeigt: "💾 Offline"

## 🚀 **Online-Features**

Nach erfolgreicher Einrichtung:

- ✅ **Real-time Updates:** Alle 10 Sekunden automatische Synchronisation
- ✅ **Globales Leaderboard:** Alle Nutzer sehen dasselbe Leaderboard
- ✅ **Live-Updates:** Neue Scores werden sofort für alle sichtbar
- ✅ **Neue Score-Benachrichtigungen:** 🆕 Badge für aktuelle Einträge
- ✅ **Admin-Reset:** Funktioniert global für alle Nutzer
- ✅ **Automatisches Fallback:** Bei Verbindungsproblemen

## 📞 **Support**

Bei Problemen:
1. Überprüfen Sie die Browser-Konsole (F12) auf Fehlermeldungen
2. Stellen Sie sicher, dass die Firebase-URLs korrekt sind
3. Überprüfen Sie die Realtime Database-Regeln
4. Testen Sie mit einem Inkognito-Fenster

🍋 **Viel Erfolg mit Ihrem Online-Lemon-Clicker!**
