# 🚀 Šifrovaný správce hesel | Hvězdná flotila

![Star Trek Password Manager](https://img.shields.io/badge/Version-3.0-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-AES--256-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> *"Bezpečnost na úrovni Hvězdné flotily - Vaše hesla chráněna jako utajované dokumenty Enterprise!"* 🖖

## 📋 Obsah

- [O projektu](#-o-projektu)
- [Funkce](#-funkce)
- [Bezpečnost](#-bezpečnost)
- [Technologie](#-technologie)
- [Instalace](#-instalace)
- [Použití](#-použití)
- [Struktura projektu](#-struktura-projektu)
- [Konfigurace Firebase](#-konfigurace-firebase)
- [Responzivita](#-responzivita)
- [Autoři](#-autoři)
- [Licence](#-licence)

---

## 🎯 O projektu

**Šifrovaný správce hesel** je moderní webová aplikace inspirovaná univerzem Star Trek, která poskytuje **vojenskou úroveň zabezpečení** pro správu vašich hesel. Všechna data jsou šifrována pomocí **AES-256** před uložením do cloudu a synchronizována napříč zařízeními pomocí **Firebase Firestore**.

### ✨ Klíčové vlastnosti

- 🔐 **AES-256 šifrování** - Vojenská úroveň zabezpečení
- 🌐 **Cloud synchronizace** - Přístup z jakéhokoli zařízení
- 🎨 **Futuristický design** - Inspirováno Star Trek
- 📱 **Plně responzivní** - Funguje na všech zařízeních
- 🔒 **Dvoustupňové zabezpečení** - Google Auth + Master heslo
- 💾 **Export/Import** - Záloha vašich dat do TXT souboru

---

## 🚀 Funkce

### 🔑 Správa hesel

- ✅ **Přidávání hesel** - Ukládání služby, uživatelského jména a hesla
- ✅ **Zobrazení hesel** - Přehledná tabulka všech uložených hesel
- ✅ **Mazání hesel** - Bezpečné odstranění nepotřebných záznamů
- ✅ **Toggle viditelnosti** - Přepínání zobrazení hesla (text/skryté)

### 🌐 Synchronizace

- ☁️ **Cloud storage** - Automatické ukládání do Firebase Firestore
- 🔄 **Real-time sync** - Okamžitá synchronizace mezi zařízeními
- 👤 **Multi-user support** - Každý uživatel má svoje izolované úložiště

### 💾 Záloha dat

- 📤 **Export do TXT** - Stažení všech hesel včetně master klíče
- 📥 **Import z TXT** - Obnovení nebo přidání hesel ze zálohy
- 🔐 **Šifrovaný formát** - I exportovaná data obsahují master klíč pro bezpečnost

### 🎨 Uživatelské rozhraní

- 🌟 **Animované hvězdné pozadí** - Atmosférický efekt vesmíru
- 💙 **Svítící efekty** - Neon glow efekty v modrých tónech
- 🔔 **Toast notifikace** - Elegantní zpětná vazba pro uživatele
- 📱 **Responzivní design** - Optimalizováno pro všechny velikosti obrazovek

---

## 🔒 Bezpečnost

### 🛡️ Bezpečnostní architektura

```
┌─────────────────────────────────────────────────┐
│   1. Google Autentizace (Firebase Auth)        │
│      ↓                                          │
│   2. Master heslo (uživatel si vytvoří)        │
│      ↓                                          │
│   3. AES-256 šifrování všech dat               │
│      ↓                                          │
│   4. Uložení do Firebase Firestore             │
└─────────────────────────────────────────────────┘
```

### 🔐 Vrstvy zabezpečení

1. **Firebase Authentication**
   - Google OAuth 2.0 přihlašování
   - Bezpečná správa uživatelských účtů
   - Token-based autentizace

2. **Master heslo**
   - Uživatel si vytvoří silné master heslo
   - Master heslo se NIKDY neukládá v čistém textu
   - Používá se jako klíč pro šifrování všech dat

3. **AES-256 šifrování**
   - Všechna hesla šifrována před uložením
   - Používá knihovnu CryptoJS
   - Dešifrování pouze s platným master heslem

4. **Cloudové zabezpečení**
   - Firebase Firestore pravidla pro ochranu dat
   - Každý uživatel má izolované úložiště
   - HTTPS komunikace

### 🚫 Ochrana proti útokům

- ✅ **Cross-Site Scripting (XSS)** - Sanitizace vstupů
- ✅ **SQL Injection** - NoSQL databáze (Firestore)
- ✅ **Man-in-the-Middle** - HTTPS pouze
- ✅ **Brute Force** - Firebase rate limiting

---

## 💻 Technologie

### Frontend

- **HTML5** - Sémantická struktura
- **CSS3** - Moderní styling, animace, responzivita
- **Vanilla JavaScript** - Žádné zbytečné frameworky
- **CryptoJS 4.1.1** - AES-256 šifrování

### Backend & Cloud

- **Firebase Authentication** - Správa uživatelů
- **Firebase Firestore** - NoSQL cloudová databáze
- **Python HTTP Server** - Lokální vývojový server

### Bezpečnost

- **AES-256** - Symetrické šifrování
- **Google OAuth 2.0** - Autentizace
- **HTTPS** - Bezpečná komunikace

---

## 📦 Instalace

### Požadavky

- **Python 3.7+** (pro lokální server)
- **Moderní webový prohlížeč** (Chrome, Firefox, Edge, Safari)
- **Firebase účet** (zdarma tier stačí)

### Krok 1: Klonování repozitáře

```bash
git clone https://github.com/vas-username/sprava-hesel-jirka.git
cd sprava-hesel-jirka
```

### Krok 2: Konfigurace Firebase

1. Vytvořte nový projekt na [Firebase Console](https://console.firebase.google.com/)
2. Povolte **Authentication** → **Google** přihlašování
3. Vytvořte **Firestore Database** (testovací režim pro začátek)
4. Zkopírujte konfiguraci z **Project Settings** → **Web App**
5. Vložte konfiguraci do `firebase-logic.js`:

```javascript
const firebaseConfig = {
    apiKey: "VÁŠ_API_KEY",
    authDomain: "váš-projekt.firebaseapp.com",
    projectId: "váš-projekt-id",
    storageBucket: "váš-projekt.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    measurementId: "G-XXXXXXXXXX"
};
```

### Krok 3: Firestore pravidla

Nastavte bezpečnostní pravidla v Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Krok 4: Spuštění serveru

#### Python server (doporučeno):

```bash
python server.py
```

Server poběží na `http://localhost:8080`

#### Alternativně - jednoduchý Python server:

```bash
python -m http.server 8080
```

### Krok 5: Otevření v prohlížeči

Otevřete prohlížeč a přejděte na:
```
http://localhost:8080
```

---

## 🎮 Použití

### První přihlášení

1. **Klikněte na "Přihlásit přes Google"**
   - Vyberte svůj Google účet
   - Autorizujte aplikaci

2. **Vytvořte Master heslo**
   - Zadejte silné, unikátní heslo
   - Toto heslo si **ZAPAMATUJTE** - nelze obnovit!
   - Master heslo slouží k šifrování všech dat

3. **Začněte přidávat hesla**
   - Vyplňte službu (např. "Gmail")
   - Zadejte uživatelské jméno
   - Zadejte heslo
   - Klikněte "💾 ULOŽIT"

### Správa hesel

#### Přidání hesla
```
Služba: Gmail
Uživatelské jméno: admiral@starfleet.com
Heslo: SuperSilneHeslo123!
→ Klikněte "💾 ULOŽIT"
```

#### Zobrazení hesla
- Hesla jsou defaultně viditelná v tabulce
- Pro kopírování - označte text a Ctrl+C

#### Smazání hesla
- Klikněte na "🗑️ SMAZAT" u konkrétního záznamu
- Potvrďte akci

### Export dat

1. Klikněte na **"📤 EXPORT"**
2. Soubor `hesla_flotila_YYYY-MM-DD.txt` se stáhne
3. **DŮLEŽITÉ:** Soubor obsahuje váš master klíč - uchovávejte bezpečně!

### Import dat

1. Klikněte na **"📥 IMPORT"**
2. Vyberte dříve exportovaný TXT soubor
3. Vyberte:
   - **OK** - Přidat k existujícím heslům
   - **Cancel** - Nahradit všechna hesla

### Odhlášení

- Klikněte na **"🔥 ODHLÁSIT SE"** vpravo nahoře
- Potvrzením se odhlásíte a vyčistíte lokální data

---

## 📁 Struktura projektu

```
sprava-hesel-jirka/
│
├── index.html              # Hlavní HTML struktura
├── style.css               # Kompletní CSS styling + responzivita
├── script.js               # Hlavní logika aplikace
├── firebase-logic.js       # Firebase integrace
├── server.py               # Python vývojový server
│
├── README.md               # Dokumentace (tento soubor)
├── .gitignore              # Ignorované soubory
└── LICENSE                 # MIT licence
```

### Popis souborů

#### `index.html`
- Struktura aplikace
- Přihlašovací formulář
- Hlavní rozhraní pro správu hesel
- Modální okna (Master heslo)
- Toast notifikace

#### `style.css`
- CSS proměnné pro barvy
- Futuristický design (gradienty, glow efekty)
- Animace hvězdného pozadí
- **Kompletní responzivní systém** (320px - 1920px+)
- Toast notifikace styling

#### `script.js`
- Šifrování/dešifrování (CryptoJS)
- CRUD operace s hesly
- Export/Import funkcionalita
- Toggle viditelnosti hesel
- UI interakce

#### `firebase-logic.js`
- Firebase inicializace
- Autentizace (Google OAuth)
- Firestore operace (save/load)
- Master klíč management

#### `server.py`
- Lokální HTTP server
- CORS podpora
- Barevný konzolový výstup
- Automatická detekce pracovního adresáře

---

## 🔧 Konfigurace Firebase

### Firestore struktura

```
artifacts/
  └── {appId}/
      └── users/
          └── {userId}/
              ├── passwordManager/
              │   └── userPasswords
              │       └── passwords: [encrypted_string]
              │
              └── masterKey/
                  └── keyData
                      └── encryptedKey: [encrypted_master_key]
```

### Bezpečnostní pravidla (production-ready)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Pravidla pro artifacts kolekci
    match /artifacts/{appId}/users/{userId}/{document=**} {
      // Povolit čtení a zápis pouze autentizovanému uživateli
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Zamítnout vše ostatní
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📱 Responzivita

### Podporované breakpointy

| Zařízení | Šířka | Optimalizace |
|----------|-------|--------------|
| 🖥️ **Velké monitory** | 1920px+ | Větší fonty, prostornější layout |
| 💻 **Desktop** | 1200px - 1919px | Standardní desktop zobrazení |
| 🖥️ **Laptop** | 992px - 1199px | Optimalizovaný layout |
| 📱 **Tablet (landscape)** | 768px - 991px | Grid tlačítek 3 sloupce |
| 📱 **Tablet (portrait)** | 576px - 767px | Kompaktnější spacing |
| 📱 **Velké mobily** | 480px - 575px | Menší fonty, 3 tlačítka vedle sebe |
| 📱 **Malé mobily** | 320px - 479px | Minimální velikosti |
| 📱 **Extra malé** | <320px | Ultra kompaktní režim |

### Testováno na zařízeních

- ✅ Desktop (1920x1080, 1366x768)
- ✅ iPad Pro (1024x1366)
- ✅ iPad (768x1024)
- ✅ iPhone 14 Pro (393x852)
- ✅ iPhone SE (375x667)
- ✅ Samsung Galaxy S21 (360x800)
- ✅ Malé mobily (320x568)

---

## 🎨 Téma a design

### Barevná paleta

```css
--primary-color: #0066cc      /* Hlavní modrá */
--secondary-color: #004499    /* Tmavší modrá */
--accent-color: #00ccff       /* Zářivá cyan */
--success-color: #4CAF50      /* Zelená (úspěch) */
--warning-color: #FF9800      /* Oranžová (varování) */
--danger-color: #f44336       /* Červená (nebezpečí) */
```

### Designové prvky

- 🌟 **Animované hvězdy** - Paralaxový efekt pohybu hvězd
- 💙 **Glow efekty** - Neonové osvětlení okrajů a tlačítek
- 🎨 **Gradienty** - Plynulé přechody barev
- ✨ **Hover animace** - Interaktivní odezva na hover
- 🔔 **Toast notifikace** - Shora vyskakující zprávy

---

## 👥 Autoři

### 🖖 Více admirál Jiřík
- **Role:** Project Lead, Frontend Developer
- **Specializace:** UI/UX Design, JavaScript
- **Star Trek rank:** Vice Admiral

### 🤖 Admirál Claude.AI
- **Role:** AI Assistant, Code Architect
- **Specializace:** CSS Architecture, Responsive Design
- **Vytvořeno:** Anthropic

---

## 🏆 Poděkování

Speciální poděkování:
- 🖖 **Gene Roddenberry** - Za inspiraci Star Trek univerzem
- 🚀 **Firebase Team** - Za skvělou cloudovou platformu
- 🔐 **CryptoJS** - Za spolehlivou šifrovací knihovnu
- 💙 **Open Source Community** - Za nekonečnou inspiraci

---

## 📄 Licence

```
MIT License

Copyright (c) 2024 Více admirál Jiřík & Admirál Claude.AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🚨 Důležité bezpečnostní poznámky

⚠️ **VAROVÁNÍ:**

1. **Master heslo NELZE OBNOVIT**
   - Pokud zapomenete master heslo, VŠECHNA data jsou NENÁVRATNĚ ZTRACENA
   - Doporučujeme si master heslo zapsat na bezpečné místo

2. **Export obsahuje nešifrovaná data**
   - Exportovaný TXT soubor obsahuje hesla V ČISTÉM TEXTU
   - Uchovávejte export na bezpečném místě (USB, šifrovaný disk)
   - NIKDY neposílejte export emailem nebo cloudem

3. **Firebase konfigurace**
   - API klíče v `firebase-logic.js` jsou veřejně viditelné
   - Bezpečnost zajišťují Firestore pravidla, ne API klíče
   - Vždy nastavte správná pravidla přístupu

4. **HTTPS v produkci**
   - Pro produkční nasazení VŽDY používejte HTTPS
   - Nikdy nespouštějte na nezabezpečeném HTTP v produkci

---

## 🐛 Známé problémy

- 🔄 **Import velkých souborů** - Může trvat několik sekund
- 🌐 **Offline režim** - Aplikace vyžaduje internetové připojení
- 📱 **iOS Safari** - Může mít problémy s file pickerem (use Chrome/Firefox)

---

## 🔮 Budoucí vylepšení

- [ ] PWA podpora (offline režim)
- [ ] Automatické zálohy do Google Drive
- [ ] Generátor silných hesel
- [ ] Kategorie a tagy pro hesla
- [ ] Vyhledávání v heslech
- [ ] Dark/Light mode přepínač
- [ ] 2FA (Two-Factor Authentication)
- [ ] Mobilní aplikace (React Native)
- [ ] Biometrická autentizace

---

## 📞 Kontakt & Podpora

**Issues:** [GitHub Issues](https://github.com/vas-username/sprava-hesel-jirka/issues)

**Dokumentace:** Tento README.md soubor

---

<div align="center">

### 🖖 Dlouhý život a prosperita! 🖖

**Vytvořeno s 💙 více admirálem Jiříkem a admirálem Claude.AI**

*"Vaše hesla jsou v bezpečí jako Enterprise na orbitě Země"*

---

![Star Trek](https://img.shields.io/badge/Inspired%20by-Star%20Trek-blue?style=for-the-badge)
![Made with](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)
![Warp Speed](https://img.shields.io/badge/Warp%20Speed-9.99-green?style=for-the-badge)

</div>
