# language: fr
Fonctionnalité: connexion au site
    Scénario: l'utilisateur n'a pas de compte
        Soit l'utilisateur est sur la page d'accueil
        Et l'utilisateur donne une adresse e-mail incorrecte
        # Je pense que c'est mieux de mettre "inexistante" à la place de "incorrecte"
        Et l'utilisateur donne un mdp
        Quand l'utilisateur appuie sur le bouton de connexion
        Alors l'utilisateur reste sur la page d'accueil
        Et un message d'erreur est envoyé

    Scénario: l'utilisateur donne un mauvais mdp
        Soit l'utilisateur est sur la page d'accueil
        Et l'utilisateur donne une adresse e-mail correcte
        Et l'utilisateur donne un mdp incorrect
        Quand l'utilisateur appuie sur le bouton de connexion
        Alors l'utilisateur reste sur la page d'accueil
        Et un message d'erreur est envoyé

    Scénario: l'utilisateur réussi sa connexion
        Soit l'utilisateur est sur la page d'accueil
        Et l'utilisateur donne une adresse e-mail correcte
        Et l'utilisateur donne un mdp correct
        Quand l'utilisateur appuie sur le bouton de connexion
        Alors l'utilisateur est envoyé sur le site

Fonctionnalité: déconnexion au site
    Scénario: l'utilisateur se déconnecte
        Soit l'utilisateur est sur le site
        Quand l'utilisateur appuie sur le bouton de déconnexion
        Alors l'utilisateur est envoyé sur la page d'accueil   