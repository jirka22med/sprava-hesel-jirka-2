// firebase-logic.js
// Tento soubor obsahuje veškerou logiku pro interakci s Firebase Firestore.

// Firebase konfigurace, kterou jsi mi dal, Jirko.
const firebaseConfig = {
    apiKey: "AIzaSyA62qLLzSPSN5LSx7o7Rehv-UgBr5RwgWI",
    authDomain: "sprava-hesel-jirka.firebaseapp.com",
    projectId: "sprava-hesel-jirka",
    storageBucket: "sprava-hesel-jirka.firebasestorage.app",
    messagingSenderId: "736911248601",
    appId: "1:736911248601:web:345f1a1a2b90bbaac002c8",
    measurementId: "G-C8S2XW6ZW8"
};

// Globální proměnné pro Firebase instance
let app;
let db;
let auth;
let currentUserId = null; // ID aktuálního uživatele

// Inicializace Firebase
function initializeFirebase() {
    // Zkontrolujeme, zda už Firebase není inicializováno, abychom se vyhnuli chybám.
    if (!app) {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore(app);
        auth = firebase.auth(app);

        // Nastavení posluchače pro změny stavu autentizace
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUserId = user.uid;
                console.log("Uživatel přihlášen:", currentUserId);
                // Zavoláme globální funkci definovanou v index.html pro další zpracování
                if (typeof window.onUserAuthenticated === 'function') {
                    window.onUserAuthenticated(user);
                }
            } else {
                currentUserId = null;
                console.log("Uživatel odhlášen.");
                if (typeof window.onUserAuthenticated === 'function') {
                    window.onUserAuthenticated(null); // Informujeme index.html o odhlášení
                }
            }
        });

        // V Canvasu se pokusíme přihlásit custom tokenem, pokud je k dispozici.
        // Jinak se přihlášení provede až na základě interakce uživatele (např. Google login).
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            auth.signInWithCustomToken(__initial_auth_token)
                .then(() => console.log("Přihlášen custom tokenem (Canvas)."))
                .catch(error => {
                    console.error("Chyba při přihlašování custom tokenem:", error);
                    // Pokud selže custom token, uživatel se bude muset přihlásit přes Google tlačítko
                });
        }
        // Původní blok pro anonymní přihlášení byl odstraněn,
        // aby se modal nezobrazoval hned při startu stránky bez interakce.
    }
}

// NOVÁ FUNKCE: Přihlášení přes Google
async function signInWithGoogleProvider() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        console.log("Úspěšně přihlášen přes Google.");
    } catch (error) {
        console.error("Chyba při přihlášení přes Google:", error);
        throw error; // Předáme chybu dál
    }
}


// Funkce pro uložení hesel do Firestore
// Přijímá pole hesel.
function savePasswordsToFirestore(passwords) {
    if (!currentUserId) {
        console.error("Uživatel není přihlášen. Nelze uložit hesla do Firestore.");
        return Promise.reject("Uživatel není přihlášen.");
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = db.collection('artifacts').doc(appId).collection('users').doc(currentUserId).collection('passwordManager').doc('userPasswords');

    return docRef.set({
        passwords: passwords 
    })
    .then(() => {
        console.log("Hesla úspěšně uložena do Firestore.");
        return true;
    })
    .catch(error => {
        console.error("Chyba při ukládání hesel do Firestore:", error);
        return Promise.reject(error);
    });
}

// Funkce pro načtení hesel z Firestore
function loadPasswordsFromFirestore() {
    if (!currentUserId) {
        console.error("Uživatel není přihlášen. Nelze načíst hesla z Firestore.");
        return Promise.resolve(null); 
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = db.collection('artifacts').doc(appId).collection('users').doc(currentUserId).collection('passwordManager').doc('userPasswords');

    return docRef.get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                console.log("Hesla načtena z Firestore.");
                return data.passwords || null; // Vrátíme přímo šifrovaný string nebo null
            } else {
                console.log("Dokument s hesly pro tohoto uživatele neexistuje.");
                return null;
            }
        })
        .catch(error => {
            console.error("Chyba při načítání hesel z Firestore:", error);
            return Promise.reject(error);
        });
}

// Ukládání šifrovaného master klíče do Firestore
function saveEncryptedMasterKeyToFirestore(encryptedMasterKey) {
    if (!currentUserId) {
        console.error("Uživatel není přihlášen. Nelze uložit master klíč do Firestore.");
        return Promise.reject("Uživatel není přihlášen.");
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = db.collection('artifacts').doc(appId).collection('users').doc(currentUserId).collection('masterKey').doc('keyData');

    return docRef.set({
        encryptedKey: encryptedMasterKey
    })
    .then(() => {
        console.log("Šifrovaný master klíč úspěšně uložen do Firestore.");
        return true;
    })
    .catch(error => {
        console.error("Chyba při ukládání šifrovaného master klíče do Firestore:", error);
        return Promise.reject(error);
    });
}

// Načítání šifrovaného master klíče z Firestore
function loadEncryptedMasterKeyFromFirestore() {
    if (!currentUserId) {
        console.error("Uživatel není přihlášen. Nelze načíst master klíč z Firestore.");
        return Promise.resolve(null); // Vrátíme null, pokud uživatel není přihlášen
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = db.collection('artifacts').doc(appId).collection('users').doc(currentUserId).collection('masterKey').doc('keyData');

    return docRef.get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                console.log("Šifrovaný master klíč načten z Firestore.");
                return data.encryptedKey || null; 
            } else {
                console.log("Dokument s master klíčem pro tohoto uživatele neexistuje.");
                return null;
            }
        })
        .catch(error => {
            console.error("Chyba při načítání šifrovaného master klíče z Firestore:", error);
            return Promise.reject(error);
        });
}


// Spustíme inicializaci Firebase, jakmile se načte celý dokument
document.addEventListener('DOMContentLoaded', initializeFirebase);
