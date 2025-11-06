# 📱 Guide des Icônes - Salatrack

## Icônes PWA requises

Pour un fonctionnement optimal de la PWA et des applications natives, les icônes suivantes sont nécessaires :

### Icônes actuelles

| Fichier | Taille | Usage | Chemin |
|---------|--------|-------|--------|
| `favicon.png` | 192x192 | Favicon + PWA small icon | `/public/favicon.png` |
| `icon-512.png` | 512x512 | PWA large icon | `/public/icon-512.png` |

### Icônes recommandées (optionnel mais meilleures pratiques)

| Taille | Usage | Nom de fichier suggéré |
|--------|-------|------------------------|
| 16x16 | Favicon navigateur | `favicon-16x16.png` |
| 32x32 | Favicon navigateur | `favicon-32x32.png` |
| 180x180 | Apple Touch Icon | `apple-touch-icon.png` |
| 192x192 | Android Chrome | `icon-192.png` ✅ (déjà présent) |
| 512x512 | Splash screen | `icon-512.png` ✅ (déjà présent) |
| 1024x1024 | iOS App Store | `icon-1024.png` |

## Spécifications techniques

### Format
- **Type de fichier** : PNG avec transparence (recommandé)
- **Profondeur de couleur** : 24-bit ou 32-bit (avec canal alpha)
- **Compression** : Optimisée pour le web

### Design
- **Zone de sécurité** : Éviter de placer des éléments importants dans les 10% extérieurs
- **Forme** : Carrée (les systèmes d'exploitation appliquent leurs propres masques)
- **Fond** : 
  - Transparent pour les icônes adaptatives
  - Couleur de marque (#0c3b2e) pour le fond si nécessaire

### Couleurs de marque
- **Primaire** : `#0c3b2e` (vert sombre)
- **Fond** : `#ffffff` (blanc)
- **Accent** : Utiliser les couleurs du logo Salatrack

## Configuration actuelle

### manifest.webmanifest
```json
{
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### index.html
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

## Génération des icônes

### Outils recommandés (gratuits)

1. **PWA Asset Generator**
   ```bash
   npx @vite-pwa/assets-generator --preset minimal public/logo.svg
   ```

2. **RealFaviconGenerator** (en ligne)
   - URL : https://realfavicongenerator.net/
   - Upload du logo source
   - Télécharge un package complet avec toutes les tailles

3. **ImageMagick** (ligne de commande)
   ```bash
   # Générer toutes les tailles depuis un PNG source
   convert source-1024.png -resize 512x512 icon-512.png
   convert source-1024.png -resize 192x192 icon-192.png
   convert source-1024.png -resize 180x180 apple-touch-icon.png
   ```

## Android (Capacitor)

### Chemin des ressources natives
```
android/app/src/main/res/
├── mipmap-mdpi/        # 48x48
├── mipmap-hdpi/        # 72x72
├── mipmap-xhdpi/       # 96x96
├── mipmap-xxhdpi/      # 144x144
└── mipmap-xxxhdpi/     # 192x192
```

### Génération automatique
```bash
npx capacitor-assets generate --android
```

## iOS (Capacitor)

### Chemin des ressources natives
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Tailles requises pour iOS
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024

### Génération automatique
```bash
npx capacitor-assets generate --ios
```

## Vérification

### Checklist PWA
- [ ] Favicon 192x192 présent et accessible
- [ ] Icon 512x512 présent et accessible
- [ ] Manifest référence les icônes correctement
- [ ] Apple touch icon déclaré dans index.html
- [ ] Icônes visibles dans le navigateur (onglet, favoris)
- [ ] Installation PWA affiche la bonne icône

### Checklist Native
- [ ] Capacitor assets générés pour Android
- [ ] Capacitor assets générés pour iOS
- [ ] Build Android affiche la bonne icône
- [ ] Build iOS affiche la bonne icône dans tous les contextes

## Ressources

- [PWA Builder](https://www.pwabuilder.com/)
- [Capacitor Assets Documentation](https://capacitorjs.com/docs/guides/splash-screens-and-icons)
- [Web.dev - Add a web app manifest](https://web.dev/add-manifest/)
- [Apple Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
