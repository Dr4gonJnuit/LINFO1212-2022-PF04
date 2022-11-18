# language: fr
Fonctionnalité: création d'un compte
    Scénario: le compte n'existe pas
        Soit l'utilisateur est sur la page de création
        Et l'utilisateur donne une adresse e-mail inexistante
        Et l'utilisateur donne un mdp
        Quand l'utilisateur appuie sur le bouton de création
        Alors l'utilisateur reste sur la page de création
        Et un message d'erreur est envoyé
    
    Scénario: l'utilisateur ne met pas d'adresse e-mail
        Soit l'utilisateur est sur la page de création
        Et l'utilisateur ne donne pas d'adresse e-mail
        Et l'utilisateur donne un mdp
        Quand l'utilisateur appuie sur le bouton de création
        Alors l'utilisateur reste sur la page de création
        Et un message d'erreur est envoyé
    
    Scénario: l'utilisateur ne met pas de mot de passe
        Soit l'utilisateur est sur la page de création
        Et l'utilisateur donne une adresse e-mail inexistante
        Et l'utilisateur ne donne pas de mdp
        Quand l'utilisateur appuie sur le bouton de création
        Alors l'utilisateur reste sur la page de création
        Et un message d'erreur est envoyé

    Scénario: l'utilisateur met une adresse e-mail qui existe déjà
        Soit l'utilisateur est sur la page de création
        Et l'utilisateur donne une adresse e-mail existante
        Et l'utilisateur donne un mdp
        Quand l'utilisateur appuie sur le bouton de création
        Alors l'utilisateur reste sur la page de création
        Et un message d'erreur est envoyé