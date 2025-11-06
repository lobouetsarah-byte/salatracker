#!/bin/bash

#######################################
# Script de Health Check - Salatrack
# Vérifie l'état de l'application en production
#######################################

URL="https://app.salatracker.com"
FALLBACK_URL="https://salatrack.app"

echo "🔍 Health Check Salatrack"
echo "=========================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de test
check_endpoint() {
  local endpoint=$1
  local name=$2
  local expected=$3
  
  echo -n "Vérification $name... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
  
  if [ "$response" = "$expected" ]; then
    echo -e "${GREEN}✅ OK${NC} (HTTP $response)"
    return 0
  else
    echo -e "${RED}❌ ERREUR${NC} (HTTP $response, attendu $expected)"
    return 1
  fi
}

check_content() {
  local endpoint=$1
  local name=$2
  local pattern=$3
  
  echo -n "Vérification $name... "
  
  content=$(curl -s "$endpoint")
  
  if echo "$content" | grep -q "$pattern"; then
    echo -e "${GREEN}✅ OK${NC}"
    return 0
  else
    echo -e "${RED}❌ ERREUR${NC} (contenu non trouvé: $pattern)"
    return 1
  fi
}

# Tests
errors=0

# 1. Page principale
check_endpoint "$URL/" "page principale" "200" || ((errors++))

# 2. Health endpoint
check_endpoint "$URL/health.html" "health endpoint" "200" || ((errors++))
check_content "$URL/health.html?format=json" "health status" '"status": "ok"' || ((errors++))

# 3. Manifest PWA
check_endpoint "$URL/manifest.webmanifest" "manifest PWA" "200" || ((errors++))
check_content "$URL/manifest.webmanifest" "manifest name" '"name": "Salatrack"' || ((errors++))

# 4. Service Worker
check_content "$URL/" "service worker" "service-worker" || ((errors++))

# 5. Icônes
check_endpoint "$URL/favicon.png" "favicon" "200" || ((errors++))
check_endpoint "$URL/icon-512.png" "icon-512" "200" || ((errors++))

# 6. SEO
check_endpoint "$URL/robots.txt" "robots.txt" "200" || ((errors++))
check_endpoint "$URL/sitemap.xml" "sitemap.xml" "200" || ((errors++))

# 7. SSL/HTTPS
echo -n "Vérification SSL... "
ssl_check=$(curl -s -I "$URL" | grep -i "strict-transport-security")
if [ -n "$ssl_check" ]; then
  echo -e "${GREEN}✅ OK${NC} (HSTS activé)"
else
  echo -e "${YELLOW}⚠️  AVERTISSEMENT${NC} (HSTS non détecté)"
  ((errors++))
fi

# 8. Headers de sécurité
echo -n "Vérification headers de sécurité... "
headers=$(curl -s -I "$URL")
security_headers=("X-Content-Type-Options" "X-Frame-Options" "X-XSS-Protection")
missing_headers=0

for header in "${security_headers[@]}"; do
  if ! echo "$headers" | grep -qi "$header"; then
    ((missing_headers++))
  fi
done

if [ $missing_headers -eq 0 ]; then
  echo -e "${GREEN}✅ OK${NC}"
else
  echo -e "${YELLOW}⚠️  $missing_headers manquants${NC}"
  ((errors++))
fi

# 9. Performance (temps de réponse)
echo -n "Vérification temps de réponse... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" "$URL")
response_time_ms=$(echo "$response_time * 1000" | bc)

if (( $(echo "$response_time < 2.0" | bc -l) )); then
  echo -e "${GREEN}✅ OK${NC} (${response_time_ms%.*}ms)"
else
  echo -e "${YELLOW}⚠️  LENT${NC} (${response_time_ms%.*}ms)"
  ((errors++))
fi

# Résumé
echo ""
echo "=========================="
if [ $errors -eq 0 ]; then
  echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
  exit 0
else
  echo -e "${RED}❌ $errors erreur(s) détectée(s)${NC}"
  exit 1
fi
