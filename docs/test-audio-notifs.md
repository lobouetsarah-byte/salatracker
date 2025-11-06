# 🔔 Guide de Test - Audio et Notifications - Salatrack

## Notifications Locales

### Prérequis
- Permission notifications accordée par l'utilisateur
- Application installée (PWA ou native)
- Paramètres de notification activés dans l'app

### Test sur Android (Capacitor)

1. **Build et installation**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```

2. **Dans Android Studio**
   - Lancer l'app sur émulateur ou appareil physique
   - Autoriser les notifications quand demandé

3. **Vérifications**
   - [ ] Permission demandée au premier lancement
   - [ ] Notification s'affiche à l'heure de prière configurée
   - [ ] Son Adhan joué (si activé)
   - [ ] Notification apparaît dans le centre de notifications
   - [ ] Tap sur notification ouvre l'app

4. **Logs de debug**
   ```bash
   adb logcat | grep Salatrack
   ```

### Test sur iOS (Capacitor)

1. **Build et installation**
   ```bash
   npm run build
   npx cap sync ios
   npx cap open ios
   ```

2. **Dans Xcode**
   - Sélectionner un appareil physique (les notifs ne fonctionnent pas sur simulateur)
   - Lancer l'app
   - Autoriser les notifications

3. **Vérifications**
   - [ ] Permission demandée au premier lancement
   - [ ] Notification s'affiche à l'heure de prière
   - [ ] Son Adhan joué (si activé)
   - [ ] Badge app mis à jour
   - [ ] Notification apparaît sur l'écran de verrouillage

4. **Notes iOS**
   - ⚠️ Les notifications ne fonctionnent PAS sur simulateur
   - ⚠️ Nécessite un appareil physique pour les tests
   - ⚠️ Vérifier les réglages iOS > Notifications > Salatrack

### Test PWA (Web)

1. **Dans le navigateur**
   - Ouvrir https://app.salatracker.com
   - Accepter les permissions notifications

2. **Vérifications**
   - [ ] Prompt de permission affiché
   - [ ] Notification Web affichée à l'heure configurée
   - [ ] Clic sur notification ramène à l'app

3. **Console du navigateur**
   ```javascript
   // Vérifier le support
   console.log('Notifications supportées:', 'Notification' in window);
   console.log('Permission actuelle:', Notification.permission);
   ```

4. **Limitations PWA**
   - ⚠️ Pas de son personnalisé sur toutes les plateformes
   - ⚠️ Style de notification contrôlé par le système
   - ⚠️ Peut être bloqué par les paramètres du navigateur

---

## Audio (Adhan)

### Prérequis
- Fichier audio `adhan.mp3` présent dans `/public/sounds/`
- Permission audio accordée (autoplay policy)
- Paramètre "Son Adhan" activé dans les réglages

### Test sur Android

1. **Vérifications**
   - [ ] Audio joué à l'heure de prière
   - [ ] Volume respecte les réglages système
   - [ ] Audio continue même si app en arrière-plan (selon permissions)
   - [ ] Audio s'arrête si utilisateur le demande

2. **Gestion des erreurs**
   ```typescript
   // Le code doit gérer silencieusement les erreurs
   try {
     await audio.play();
   } catch (error) {
     // Pas d'alerte utilisateur, juste log
     console.warn('Impossible de jouer le son:', error);
   }
   ```

3. **Cas spéciaux**
   - Mode silencieux : respecter le mode du téléphone
   - Écouteurs connectés : audio doit sortir dans les écouteurs
   - Appel en cours : ne pas jouer l'audio

### Test sur iOS

1. **Vérifications**
   - [ ] Audio joué à l'heure de prière
   - [ ] Respecte le mode silencieux de l'iPhone
   - [ ] Audio audible même app en arrière-plan
   - [ ] Pas d'interruption d'autres apps audio (musique, podcasts)

2. **Politique d'autoplay iOS**
   - L'audio nécessite une interaction utilisateur initiale
   - Stratégie : jouer un son silencieux au premier tap utilisateur
   
   ```typescript
   // Initialisation après interaction utilisateur
   const initAudio = async () => {
     const audio = new Audio('/sounds/adhan.mp3');
     audio.volume = 0;
     await audio.play();
     audio.pause();
   };
   ```

3. **Notes iOS**
   - ⚠️ Audio peut être bloqué par les restrictions iOS
   - ⚠️ Tester avec et sans mode silencieux
   - ⚠️ Vérifier le routing audio (haut-parleur vs écouteurs)

### Test PWA (Web)

1. **Vérifications**
   - [ ] Audio joué après interaction utilisateur
   - [ ] Fallback silencieux si autoplay bloqué
   - [ ] Pas d'alert() ou d'erreur visible

2. **Politique d'autoplay navigateur**
   - Chrome : autoplay autorisé après interaction
   - Safari : restrictions strictes sur mobile
   - Firefox : dépend des paramètres utilisateur

3. **Debug**
   ```javascript
   // Test manuel dans la console
   const audio = new Audio('/sounds/adhan.mp3');
   audio.play()
     .then(() => console.log('Audio joué avec succès'))
     .catch(err => console.error('Erreur audio:', err));
   ```

---

## Checklist Complète

### Permissions
- [ ] Permission notifications demandée au bon moment
- [ ] Message clair expliquant pourquoi la permission est nécessaire
- [ ] Gestion du refus de permission (pas d'erreur, dégradation gracieuse)
- [ ] Possibilité de réactiver depuis les réglages app

### Notifications
- [ ] Titre et contenu clairs (nom de la prière, heure)
- [ ] Icône correcte
- [ ] Son personnalisé (Adhan) sur Android
- [ ] Vibration sur mobile (si autorisée)
- [ ] Tap ouvre l'app sur la bonne page
- [ ] Notifications groupées si plusieurs

### Audio
- [ ] Fichier adhan.mp3 optimisé (< 1MB)
- [ ] Gestion des erreurs silencieuse
- [ ] Respecte le mode silencieux système
- [ ] Volume ajustable ou suit le volume média
- [ ] Ne bloque pas l'interface
- [ ] Possibilité de couper/relancer

### Edge Cases
- [ ] App en arrière-plan
- [ ] App fermée (killed)
- [ ] Mode avion activé puis désactivé
- [ ] Changement de fuseau horaire
- [ ] Batterie faible
- [ ] Mode économie d'énergie
- [ ] Téléphone verrouillé
- [ ] Pendant un appel

---

## Outils de Debug

### Android
```bash
# Voir les logs de notifications
adb logcat | grep NotificationManager

# Voir les logs audio
adb logcat | grep AudioTrack

# Forcer une notification (test)
adb shell cmd notification post -S bigtext -t "Test Salatrack" "Tag" "Ceci est un test"
```

### iOS
```bash
# Voir les logs dans Xcode
# Window > Devices and Simulators > [Device] > View Device Logs

# Filtrer par app
# Chercher "Salatrack" dans les logs
```

### Chrome DevTools
```javascript
// Simuler une notification
new Notification('Test Salatrack', {
  body: 'Ceci est un test',
  icon: '/icon-192.png',
  badge: '/favicon.png'
});

// Vérifier le service worker
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

---

## Ressources

- [Capacitor Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Autoplay Policy](https://developer.chrome.com/blog/autoplay/)
- [iOS Notification Guidelines](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [Android Notification Guidelines](https://developer.android.com/develop/ui/views/notifications)
