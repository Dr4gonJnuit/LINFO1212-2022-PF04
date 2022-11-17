# language: fr
Fonctionnalité: connexion au site
    Scénario: l'user n'a pas de compte
        Soit l'user est sur la page d'accueil
        Et l'user donne une adresse e-mail incorrecte
        Et l'user donne un mdp
        Quand l'user appuie sur le bouton de connexion
        Alors l'user reste sur la page d'accueil
        Et un message d'erreur est envoyé

    Scénario: l'user donne un mauvais mdp
        Soit l'user est sur la page d'accueil
        Et l'user donne une adresse e-mail correcte
        Et l'user donne un mdp incorrect
        Quand l'user appuie sur le bouton de connexion
        Alors l'user reste sur la page d'accueil
        Et un message d'erreur est envoyé

    Scénario: l'user réussi sa connexion
        Soit l'user est sur la page d'accueil
        Et l'user donne une adresse e-mail correcte
        Et l'user donne un mdp correcte
        Quand l'user appuie sur le bouton de connexion
        Alors l'user est envoyé sur le site

Fonctionnalité: déconnexion au site
    Scénario: l'user se déconnecte
        Soit l'user est sur le site
        Quand l'user appuie sur le bouton de déconnexion
        Alors l'user est envoyé sur la page d'accueil   