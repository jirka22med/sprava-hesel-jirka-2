const STORAGE_KEY = 'encryptedPasswords';
        const EMAIL_KEY = 'registeredEmail';
        let masterKey = '';
        let otpCode = '';
        let isNewMasterKeySetup = false;

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('mainContent').classList.add('hidden'); 
            document.getElementById('masterKeyInputModal').classList.add('hidden'); 
        });

        function togglePasswordVisibility(inputId, buttonElement) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                buttonElement.innerHTML = '🔓 Skrýt';
            } else {
                input.type = 'password';
                buttonElement.innerHTML = '🔒 Zobrazit';
            }
        }

        function showMasterKeyInputModal(isNewUser) {
            isNewMasterKeySetup = isNewUser;
            const modal = document.getElementById('masterKeyInputModal');
            const messageElement = document.getElementById('masterKeyInputModalMessage');
            const inputField = document.getElementById('masterKeyInputField');

            if (isNewUser) {
                messageElement.innerHTML = '🚀 <strong>Vítejte na palubě, admirále!</strong><br>Nastavte si master heslo pro šifrování vašich dat:';
                inputField.placeholder = 'Vytvořte silné master heslo';
            } else {
                messageElement.innerHTML = '🔐 <strong>Vítejte zpět!</strong><br>Zadejte své master heslo pro dešifrování dat:';
                inputField.placeholder = 'Zadejte master heslo';
            }
            inputField.value = '';
            modal.classList.remove('hidden');
        }

        async function handleMasterKeyInput() {
            const enteredKey = document.getElementById('masterKeyInputField').value;
            if (!enteredKey) {
                alert('⚠️ Zadejte master heslo!');
                return;
            }

            if (isNewMasterKeySetup) {
                masterKey = enteredKey;
                const encryptedMasterKey = CryptoJS.AES.encrypt(masterKey, enteredKey).toString();
                try {
                    await saveEncryptedMasterKeyToFirestore(encryptedMasterKey);
                    document.getElementById('masterKeyInputModal').classList.add('hidden');
                    document.getElementById('mainContent').classList.remove('hidden');
                    alert('✅ Warpový skok úspěšný! Master heslo nastaveno a uloženo do cloudu!');
                    await loadPasswords();
                } catch (error) {
                    console.error("Chyba při ukládání nového master klíče:", error);
                    alert('❌ Chyba při ukládání master klíče do cloudu.');
                }
            } else {
                try {
                    const encryptedMasterKeyFromFirestore = await loadEncryptedMasterKeyFromFirestore();
                    if (!encryptedMasterKeyFromFirestore) {
                        alert('❌ Chyba: Šifrovaný master klíč nebyl nalezen ve Firestore.');
                        return;
                    }
                    const bytes = CryptoJS.AES.decrypt(encryptedMasterKeyFromFirestore, enteredKey);
                    const decryptedMasterKey = bytes.toString(CryptoJS.enc.Utf8);

                    if (decryptedMasterKey) {
                        masterKey = decryptedMasterKey;
                        document.getElementById('masterKeyInputModal').classList.add('hidden');
                        document.getElementById('mainContent').classList.remove('hidden');
                        showFleetNotification('✅ Přihlášení úspěšné! Hesla načtena z hvězdné flotily.');
                        await loadPasswords();
                    } else {
                        alert('❌ Nesprávné master heslo. Zkuste to znovu.');
                    }
                } catch (error) {
                    console.error("Chyba při dešifrování master klíče:", error);
                    alert('❌ Chyba při dešifrování master klíče. Zkontrolujte heslo.');
                }
            }
        }

        async function signInWithGoogle() {
            document.getElementById('loginForm').classList.add('hidden'); 
            try {
                await signInWithGoogleProvider();
            } catch (error) {
                console.error("Chyba při přihlášení přes Google:", error);
                alert('❌ Chyba při přihlášení přes Google. Zkuste to znovu.');
                document.getElementById('loginForm').classList.remove('hidden'); 
            }
        }

        window.onUserAuthenticated = async (user) => {
            if (user) {
                console.log("Uživatel ověřen:", user.uid);
                
                // 1. Skryjeme přihlašovací formulář
                document.getElementById('loginForm').classList.add('hidden');

                // 2. ZMĚNA: Tady NESMÍME zobrazit hlavní obsah předčasně!
                // V původním kódu se to odkrývalo hned, ale my to chceme bezpečnější.
                // document.getElementById('mainContent').classList.remove('hidden'); <--- TOTO JSME ZRUŠILI

                try {
                    const encryptedMasterKeyFromFirestore = await loadEncryptedMasterKeyFromFirestore();
                    
                    if (encryptedMasterKeyFromFirestore) {
                        // Master klíč existuje -> Zobrazíme modal pro dešifrování
                        // Obsah pod ním je stále skrytý (jen pozadí s hvězdami)
                        showMasterKeyInputModal(false);
                    } else {
                        // První nastavení klíče
                        showMasterKeyInputModal(true);
                    }
                } catch (error) {
                    console.error("Chyba při zpracování autentizace:", error);
                    alert('❌ Chyba při načítání uživatelských dat. Zkuste se přihlásit znovu.');
                    logout();
                }
            } else {
                console.log("Uživatel odhlášen.");
                logout();
            }
        };

        function confirmLogout() {
            if (confirm('🚀 Opravdu chcete ukončit warpový skok a odhlásit se?')) {
                logout();
            }
        }

        function logout() {
            masterKey = '';
            clearTable();
            if (auth) {
                auth.signOut().then(() => {
                    console.log("Uživatel odhlášen z Firebase.");
                    alert('👋 Odhlášení úspěšné. Möžete se vrátit na palubu kdykoliv!');
                }).catch((error) => {
                    console.error("Chyba při odhlašování z Firebase:", error);
                });
            }
            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        }

        function encryptData(data) {
            if (!masterKey) {
                console.error("Master klíč není nastaven pro šifrování dat.");
                alert('❌ Chyba: Master klíč není nastaven pro šifrování dat.');
                throw new Error("Master key not set for encryption.");
            }
            return CryptoJS.AES.encrypt(JSON.stringify(data), masterKey).toString();
        }

        function decryptData(cipher) {
            try {
                if (!masterKey) {
                    console.error("Master klíč není nastaven pro dešifrování dat.");
                    alert('❌ Chyba: Master klíč není nastaven pro dešifrování dat.');
                    throw new Error("Master key not set for decryption.");
                }
                const bytes = CryptoJS.AES.decrypt(cipher, masterKey);
                const txt = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(txt);
            } catch (e) {
                console.error("Chyba při dešifrování dat hesel:", e);
                alert('❌ Chyba při dešifrování hesel. Zkontrolujte master heslo nebo se přihlaste znovu.');
                return [];
            }
        }

        async function savePassword() {
            const service = document.getElementById('service').value;
            const user = document.getElementById('username').value;
            const pwd = document.getElementById('password').value;
            if (!service || !user || !pwd) {
                alert('⚠️ Vyplňte všechna pole před warpovým skokem!');
                return;
            }
            if (!masterKey) {
                alert('❌ Master heslo není nastaveno. Přihlaste se prosím.');
                return;
            }

            let list = [];
            try {
                const encryptedList = await loadPasswordsFromFirestore();
                if (encryptedList) {
                    list = decryptData(encryptedList);
                }
            } catch (error) {
                console.error("Chyba při načítání hesel před uložením:", error);
                alert('❌ Chyba při načítání hesel před uložením.');
                return;
            }

            list.push({ service, username: user, password: pwd });

            try {
                await savePasswordsToFirestore(encryptData(list));
                await loadPasswords(); 
                clearForm();
                alert('✅ Heslo úspěšně uloženo do hvězdné databáze!');
            } catch (error) {
                console.error("Chyba při ukládání hesel do Firestore:", error);
                alert('❌ Chyba při ukládání hesel do Firestore.');
            }
        }

        async function loadPasswords() {
            clearTable();
            if (!masterKey) {
                console.warn('Master heslo není nastaveno. Nelze načíst hesla.');
                return;
            }

            try {
                const encryptedList = await loadPasswordsFromFirestore();
                let list = [];
                if (encryptedList) {
                    list = decryptData(encryptedList);
                }
                
                const tbody = document.querySelector('#passwordTable tbody');
                const emptyState = document.getElementById('emptyState');
                const table = document.getElementById('passwordTable');
                
                if (list.length === 0) {
                    table.classList.add('hidden');
                    emptyState.classList.remove('hidden');
                } else {
                    table.classList.remove('hidden');
                    emptyState.classList.add('hidden');
                    
                    list.forEach((e, i) => {
                        const row = tbody.insertRow();
                        row.insertCell().textContent = e.service;
                        row.insertCell().textContent = e.username;
                        const pwdCell = row.insertCell(); 
                        pwdCell.textContent = e.password;
                        const actCell = row.insertCell(); 
                        actCell.innerHTML = `<button class="delete-btn" onclick="deletePassword(${i})" title="Smazat toto heslo">🗑️ Smazat</button>`;
                    });
                }
            } catch (error) {
                console.error("Chyba při načítání hesel z Firestore:", error);
                alert('❌ Chyba při načítání hesel z Firestore.');
            }
        }

        async function deletePassword(idx) {
            if (!masterKey) {
                alert('❌ Master heslo není nastaveno. Přihlaste se prosím.');
                return;
            }
            
            try {
                const encryptedList = await loadPasswordsFromFirestore();
                let list = [];
                if (encryptedList) {
                    list = decryptData(encryptedList);
                }

                if (list.length === 0) return;
                
                const serviceToDelete = list[idx].service;
                if (confirm(`🗑️ Opravdu chcete smazat heslo pro službu "${serviceToDelete}"?`)) {
                    list.splice(idx, 1);
                    await savePasswordsToFirestore(encryptData(list));
                    await loadPasswords();
                    alert('✅ Heslo bylo úspěšně odstraněno z databáze!');
                }
            } catch (error) {
                console.error("Chyba při mazání hesla z Firestore:", error);
                alert('❌ Chyba při mazání hesla z Firestore.');
            }
        }

        function clearForm() {
            ['service','username','password'].forEach(id => document.getElementById(id).value='');
        }

        function clearTable() {
            document.querySelector('#passwordTable tbody').innerHTML = '';
        }

        async function exportToTxt() {
            if (!masterKey) {
                alert('❌ Nejsi přihlášen – masterKey chybí!');
                return;
            }
            let list = [];
            try {
                const encryptedList = await loadPasswordsFromFirestore();
                if (encryptedList) {
                    list = decryptData(encryptedList);
                }
            } catch (error) {
                console.error("Chyba při načítání dat pro export:", error);
                alert('❌ Chyba při načítání dat pro export.');
                return;
            }

            if (list.length === 0) {
                alert('⚠️ Žádná data k exportu. Databáze je prázdná.');
                return;
            }
            
            let txt = `🚀 HVĚZDNÁ FLOTILA - EXPORT HESEL 🚀\n`;
            txt += `═══════════════════════════════════════\n\n`;
            txt += `Master key: ${masterKey}\n\n`;
            txt += `Celkový počet hesel: ${list.length}\n`;
            txt += `═══════════════════════════════════════\n\n`;
            
            list.forEach((e, index) => {
                txt += `[${index + 1}] Služba: ${e.service}\n`;
                txt += `    Uživatel: ${e.username}\n`;
                txt += `    Heslo: ${e.password}\n`;
                txt += `---\n\n`;
            });
            
            txt += `═══════════════════════════════════════\n`;
            txt += `Export dokončen - Warpový pohon online! 🖖\n`;
            
            const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a'); 
            a.href = URL.createObjectURL(blob); 
            a.download = `hesla_flotila_${new Date().toISOString().split('T')[0]}.txt`; 
            a.click();
            alert('✅ Export dokončen! Soubor byl úspěšně stažen.');
        }

        function triggerImport() {
            document.getElementById('importFile').click();
        }

        async function importFromTxt(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (!masterKey) {
                alert('❌ Nejste přihlášeni! Pro import musíte být přihlášeni.');
                return;
            }

            const reader = new FileReader();
            reader.onload = async function(e) {
                const content = e.target.result;
                
                const masterKeyMatch = content.match(/Master key:\s*(.+)/);
                if (!masterKeyMatch) {
                    alert('❌ Soubor neobsahuje platný master key!');
                    return;
                }
                
                const fileMasterKey = masterKeyMatch[1].trim();
                if (fileMasterKey !== masterKey) {
                    const confirmImport = confirm('⚠️ Master key v souboru se liší od vašeho současného klíče. Chcete pokračovat?\n\n(Doporučujeme zálohovat současná data před importem!)');
                    if (!confirmImport) return;
                }

                const passwordBlocks = content.split('---').slice(0, -1);
                const importedPasswords = [];
                
                passwordBlocks.forEach(block => {
                    const serviceMatch = block.match(/Služba:\s*(.+)/);
                    const userMatch = block.match(/Uživatel:\s*(.+)/);
                    const passMatch = block.match(/Heslo:\s*(.+)/);
                    
                    if (serviceMatch && userMatch && passMatch) {
                        importedPasswords.push({
                            service: serviceMatch[1].trim(),
                            username: userMatch[1].trim(),
                            password: passMatch[1].trim()
                        });
                    }
                });

                if (importedPasswords.length === 0) {
                    alert('❌ Ve souboru nebyla nalezena žádná platná hesla!');
                    return;
                }

                const action = confirm(`📥 Nalezeno ${importedPasswords.length} hesel.\n\nKlikněte OK pro PŘIDÁNÍ k současným heslům\nKlikněte Cancel pro NAHRAZENÍ všech hesel.`);
                
                let currentPasswords = [];
                if (action) {
                    try {
                        const encryptedCurrent = await loadPasswordsFromFirestore();
                        if (encryptedCurrent) {
                            currentPasswords = decryptData(encryptedCurrent);
                        }
                    } catch (error) {
                        console.error("Chyba při načítání aktuálních hesel pro import:", error);
                        alert('❌ Chyba při načítání aktuálních hesel pro import.');
                        return;
                    }
                }

                const finalPasswords = action ? [...currentPasswords, ...importedPasswords] : importedPasswords;
                
                try {
                    await savePasswordsToFirestore(encryptData(finalPasswords));
                    await loadPasswords();
                    alert(`✅ Import dokončen! ${importedPasswords.length} hesel bylo ${action ? 'přidáno' : 'nahrazeno'}.\n\nWarpový skok úspěšný! 🚀`);
                } catch (error) {
                    console.error("Chyba při ukládání importovaných hesel do Firestore:", error);
                    alert('❌ Chyba při ukládání importovaných hesel do Firestore.');
                }
                
                event.target.value = '';
            };

            reader.readAsText(file);
        }
        
        function showFleetNotification(message, isError = false) {
    const toast = document.getElementById("fleetToast");
    
    // Nastavení textu
    toast.textContent = message;
    
    // Změna barvy podle typu zprávy (zelená pro OK, červená pro chybu)
    if (isError) {
        toast.style.borderColor = "var(--danger-color)";
        toast.style.boxShadow = "0 0 15px rgba(244, 67, 54, 0.4)";
    } else {
        toast.style.borderColor = "var(--success-color)";
        toast.style.boxShadow = "0 0 15px rgba(76, 175, 80, 0.4)";
    }

    // Zobrazení
    toast.className = "toast-notification show";

    // Automatické zmizení po 6000 ms
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 6000);
}