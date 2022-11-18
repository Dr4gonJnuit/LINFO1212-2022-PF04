# language: fr
Fonctionnalité: création d'un compte
    Scénario: le compte n'existe pas
        Soit l'utilisateur est sur la page de création
        Et l'utilisateur donne une adresse e-mail inexistante
        Et l'utilisateur donne un mdp
        Quand l'utilisateur appuie sur le bouton de création
        Alors l'utilisateur reste sur la page de création
        Et un message d'erreur est envoyé

    # Doit-on mettre les scénarios 
    # où il ne met pas d'e-mail,
    # où il met un mail qui existe déjà et
    # où il ne met pas de mdp ?

    # Demander aux tuteurs
    Règle: l'utilisateur doit donner un bon code de création
        Contexte: 
            Soit l'utilisateur est sur la page de création
            Et l'utilisateur donne une adresse e-mail existante
            Et l'utilisateur donne un mdp
            Et l'utilisateur appuie sur le bouton de création

        Scénario: l'utilisateur donne le mauvais code
            Soit l'utilisateur donne un code incorrect
            Quand l'utilisateur appuie sur le bouton de confirmation
            Alors l'utilisateur reste sur la page de création 
            Et un message d'erreur est envoyé

        Scénario: l'utilisateur donne le bon code
            Soit l'utilisateur donne un code correct
            Quand l'utilisateur appuie sur le bouton de confirmation
            Alors le compte est créé
            Et l'utilisateur est envoyé sur le site
