#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# 🚀 Fleet Management - Script de Déploiement
# ═══════════════════════════════════════════════════════════════
#
# Ce script permet de déployer facilement le frontend vers OVH
#
# Configuration requise :
# 1. Modifier les variables ci-dessous
# 2. Configurer l'accès SSH au serveur
# 3. Rendre le script exécutable : chmod +x deploy.sh
# 4. Exécuter : ./deploy.sh
#
# ═══════════════════════════════════════════════════════════════

# ========== CONFIGURATION ==========
# ⚠️ IMPORTANT : Modifier ces valeurs selon votre configuration

VPS_HOST="51.91.123.45"                        # IP de votre VPS OVH
VPS_USER="ubuntu"                               # Utilisateur SSH
VPS_FRONTEND_PATH="/var/www/fleet-frontend"     # Chemin du frontend sur le serveur
API_URL="https://api.votredomaine.tn/api/v1"   # URL de votre API

# ===================================

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions d'affichage
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header() {
    echo ""
    echo "═══════════════════════════════════════"
    echo "  🚀 Fleet Management - Déploiement"
    echo "═══════════════════════════════════════"
    echo ""
}

# Vérification de la connexion SSH
check_ssh_connection() {
    print_info "Vérification de la connexion SSH..."
    if ssh -o ConnectTimeout=5 -o BatchMode=yes $VPS_USER@$VPS_HOST "exit" 2>/dev/null; then
        print_success "Connexion SSH OK"
        return 0
    else
        print_error "Impossible de se connecter au serveur"
        print_warning "Vérifiez vos clés SSH et la configuration du serveur"
        return 1
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "Que voulez-vous faire ?"
    echo ""
    echo "1) 🎨 Déployer le Frontend"
    echo "2) 🔄 Rollback (restaurer la version précédente)"
    echo "3) 🧪 Tester la connexion SSH"
    echo "4) 📊 Voir les backups disponibles"
    echo "5) ❌ Quitter"
    echo ""
}

# Déploiement du frontend
deploy_frontend() {
    print_header
    print_info "📋 Déploiement du Frontend vers $VPS_HOST"
    echo ""
    
    # Vérifier la connexion SSH
    if ! check_ssh_connection; then
        exit 1
    fi
    
    # 1. Build
    print_info "🔨 Build du frontend..."
    VITE_API_URL=$API_URL npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Erreur lors du build!"
        exit 1
    fi
    print_success "Build réussi"
    
    # Afficher la taille du build
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    print_info "📦 Taille du build: $BUILD_SIZE"
    
    # 2. Créer le backup et nettoyer sur le serveur
    print_info "💾 Création du backup sur le serveur..."
    ssh $VPS_USER@$VPS_HOST << EOF
        sudo cp -r $VPS_FRONTEND_PATH $VPS_FRONTEND_PATH-backup-\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
        sudo rm -rf $VPS_FRONTEND_PATH/*
        echo "✅ Backup créé et dossier nettoyé"
EOF
    
    if [ $? -ne 0 ]; then
        print_error "Erreur lors de la préparation du serveur"
        exit 1
    fi
    
    # 3. Upload vers le serveur
    print_info "📤 Upload vers le serveur..."
    rsync -avz --progress dist/ $VPS_USER@$VPS_HOST:/tmp/fleet-frontend-new/
    
    if [ $? -ne 0 ]; then
        print_error "Erreur lors de l'upload!"
        exit 1
    fi
    print_success "Upload terminé"
    
    # 4. Déployer sur le serveur
    print_info "🚀 Déploiement..."
    ssh $VPS_USER@$VPS_HOST << EOF
        sudo mv /tmp/fleet-frontend-new/* $VPS_FRONTEND_PATH/
        sudo chown -R www-data:www-data $VPS_FRONTEND_PATH
        sudo chmod -R 755 $VPS_FRONTEND_PATH
        rm -rf /tmp/fleet-frontend-new
        
        # Garder seulement les 5 derniers backups
        cd \$(dirname $VPS_FRONTEND_PATH)
        ls -t fleet-frontend-backup-* 2>/dev/null | tail -n +6 | xargs -r sudo rm -rf
        
        echo "✅ Déploiement terminé"
EOF
    
    if [ $? -ne 0 ]; then
        print_error "Erreur lors du déploiement"
        exit 1
    fi
    
    # 5. Test du déploiement
    print_info "🧪 Test du déploiement..."
    sleep 3
    
    # Extraire le domaine de l'URL
    DOMAIN=$(echo $API_URL | sed 's|https://api\.||' | sed 's|/.*||')
    TEST_URL="https://$DOMAIN"
    
    if curl -f -s -o /dev/null $TEST_URL; then
        print_success "Frontend accessible à $TEST_URL"
    else
        print_warning "Impossible de tester l'accès (peut-être un problème de domaine)"
    fi
    
    # Résumé
    echo ""
    echo "═══════════════════════════════════════"
    print_success "Déploiement réussi!"
    echo ""
    echo "🌐 URL: $TEST_URL"
    echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "📦 Taille: $BUILD_SIZE"
    echo "═══════════════════════════════════════"
    echo ""
}

# Rollback
rollback_frontend() {
    print_header
    print_warning "Rollback Frontend"
    echo ""
    
    # Vérifier la connexion SSH
    if ! check_ssh_connection; then
        exit 1
    fi
    
    print_info "Recherche du dernier backup..."
    
    ssh $VPS_USER@$VPS_HOST << 'EOF'
        cd $(dirname $VPS_FRONTEND_PATH)
        LAST_BACKUP=$(ls -t fleet-frontend-backup-* 2>/dev/null | head -n 1)
        
        if [ -z "$LAST_BACKUP" ]; then
            echo "❌ Aucun backup trouvé!"
            exit 1
        fi
        
        echo "📋 Backup trouvé: $LAST_BACKUP"
        echo ""
        read -p "⚠️  Confirmer le rollback? (y/N) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🔄 Rollback en cours..."
            sudo rm -rf $VPS_FRONTEND_PATH/*
            sudo cp -r $LAST_BACKUP/* $VPS_FRONTEND_PATH/
            sudo chown -R www-data:www-data $VPS_FRONTEND_PATH
            echo "✅ Rollback effectué vers $LAST_BACKUP"
        else
            echo "❌ Rollback annulé"
        fi
EOF
}

# Tester la connexion SSH
test_ssh() {
    print_header
    print_info "Test de connexion SSH vers $VPS_USER@$VPS_HOST"
    echo ""
    
    if check_ssh_connection; then
        print_success "La connexion SSH fonctionne correctement!"
        
        # Afficher quelques infos du serveur
        print_info "Informations du serveur:"
        ssh $VPS_USER@$VPS_HOST << 'EOF'
            echo ""
            echo "🖥️  Système: $(uname -s) $(uname -r)"
            echo "💾 Disque:"
            df -h / | tail -n 1 | awk '{print "   Utilisé: " $3 " / " $2 " (" $5 ")"}'
            echo "🧠 RAM:"
            free -h | grep Mem | awk '{print "   Utilisée: " $3 " / " $2}'
            echo ""
EOF
    else
        print_error "La connexion SSH ne fonctionne pas"
        echo ""
        print_info "Vérifiez que:"
        echo "  1. VPS_HOST et VPS_USER sont corrects dans ce script"
        echo "  2. Vos clés SSH sont configurées (ssh-copy-id $VPS_USER@$VPS_HOST)"
        echo "  3. Le serveur est accessible"
    fi
}

# Voir les backups
show_backups() {
    print_header
    print_info "Backups disponibles sur le serveur"
    echo ""
    
    if ! check_ssh_connection; then
        exit 1
    fi
    
    ssh $VPS_USER@$VPS_HOST << EOF
        cd \$(dirname $VPS_FRONTEND_PATH)
        
        echo "📋 Liste des backups:"
        echo ""
        
        if ls fleet-frontend-backup-* 1> /dev/null 2>&1; then
            ls -lh fleet-frontend-backup-* | awk '{print "  " \$9 " (" \$5 ")"}'
        else
            echo "  Aucun backup trouvé"
        fi
        echo ""
EOF
}

# Programme principal
main() {
    print_header
    
    while true; do
        show_menu
        read -p "Votre choix (1-5): " choice
        
        case $choice in
            1)
                deploy_frontend
                ;;
            2)
                rollback_frontend
                ;;
            3)
                test_ssh
                ;;
            4)
                show_backups
                ;;
            5)
                print_info "Au revoir!"
                exit 0
                ;;
            *)
                print_error "Choix invalide!"
                ;;
        esac
        
        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
    done
}

# Exécuter le programme principal
main

