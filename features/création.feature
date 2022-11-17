# language: fr
Fonctionnalité: création d'un compte
    Scénario: le compte n'existe pas
        Soit l'user est sur la page de création
        Et l'user donne une adresse e-mail inexistante
        Et l'user donne un mdp
        Quand l'user appuie sur le bouton de création
        Alors l'user reste sur la page de création
        Et un message d'erreur est envoyé

    Règle: l'user doit donner un bon code de création
        Contexte: 
            Soit l'user est sur la page de création
            Et l'user donne une adresse e-mail existante
            Et l'user donne un mdp
            Et l'user appuie sur le bouton de création

        Scénario: l'user donne le mauvais code
            Soit l'user donne un code incorrect
            Quand l'user appuie sur le bouton de confirmation
            Alors l'user reste sur la page de création 
            Et un message d'erreur est envoyé

        Scénario: l'user donne le bon code
            Soit l'user donne un code correct
            Quand l'user appuie sur le bouton de confirmation
            Alors le compte est créé
            Et l'user est envoyé sur le site
