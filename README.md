# social network.

## Objectif
Ce projet a pour but de réaliser un mini-réseau social en local, sans connexions vers une API externe. L'objectif est d'évaluer les compétences en développement web et en organisation de projet des demandeurs.

## Lien du site
[Visitez social network.](https://beauchard-nicolas.github.io/social-network/)

## Technologies Utilisées
- **HTML** : Pour la structure des pages.
- **CSS** : Pour le style, en utilisant un design de type "neumorphisme".
- **JavaScript** : Pour la gestion dynamique du DOM et l'interaction avec les données.

## Pages et Fonctionnalités

### 1. Page de Feed
- **Affichage de Posts** : Les posts (texte ou photo et texte) sont affichés à partir d'un fichier JSON simulant le retour d'une API.
- **Réactions aux Posts** : Les utilisateurs peuvent réagir aux posts avec des animations de particules pour chaque réaction (Like / Dislike / Love).
- **Commentaires** : Possibilité de commenter les billets et d'afficher les commentaires.
- **Affichage en Plein Écran** : Les photos peuvent être affichées en plein écran si le post en contient.

### 2. Page de Messagerie
- **Liste de Conversations** : Affichage dynamique d'une liste de conversations à partir d'un JSON.
- **Dernier Message** : Affichage du dernier message de chaque conversation.
- **Détail de la Conversation** : Affichage de l'historique des messages d'une conversation.
- **Gestion des Messages** : Les messages sont gérés en JSON, avec la possibilité d'envoyer de nouveaux messages qui se mettent à jour à la fois dans le JSON et sur l'interface.
- **Informations des Messages** : Affichage de l'horodatage, du nom, de la photo de profil de l'expéditeur, et du contenu du message.

### 3. Page de Liste d'Amis
- **Amis Codés en Dur** : Pas besoin de JSON, les amis sont codés en dur.
- **Filtrage des Amis** : Possibilité de filtrer les amis par nom et prénom.
- **Lien vers la Messagerie** : Chaque ligne d'ami contient un lien vers la messagerie.
- **Drag and Drop** : Implémentation d'une fonction de "drag and drop" pour réorganiser la liste d'amis.
