# language: fr
Fonctionnalité: envoie d'un message à un contact
    Scénario: l'utilisateur souhaite envoyer un message
        Soit l'utilisateur écrit un message
        Quand l'utilisateur clique sur le bouton envoyer
        Alors le message est envoyé
    
    Scénario: l'utilisateur souhaite envoyer une photo
        Soit l'utilisateur choisi une photo sur son ordinateur
        Quand l'utilisateur clique sur le bouton envoyer
        Alors la photo est envoyée
    
    Scénario: l'utilisateur souhaite supprimer un message
        Soit l'utilisateur utilise son clique droit sur un message
        Alors deux propositions apparaissent
        Quand l'utilisateur clique sur supprimer dans les propositions
        Alors le message est supprimé 
    
    Scénario: l'utilisateur souhaite modifier un message
        Soit l'utilisateur utilise son clique droit sur un message
        Alors deux propositions apparaissent
        Quand l'utilisateur clique sur modifier dans les propositions
        Alors l'utilisateur peut modifier son message 