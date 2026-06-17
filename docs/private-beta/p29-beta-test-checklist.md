# P-29 — Beta Test Checklist

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Avant le test

- [ ] Avoir une session Google ouverte (pour le login)
- [ ] Avoir accès à Metableton École (`your-app.vercel.app`)
- [ ] Lire `p29-known-limitations.md` pour connaître les limites
- [ ] S'identifier le profil que vous représentez (étudiant/enseignant/admin)
- [ ] S'offrir 20-30 minutes de temps non interrompu

---

## Parcours visiteur

- [ ] Ouvrir la home (`/`)
- [ ] Comprendre ce qu'est Metableton École en 15 secondes
- [ ] Lire le header et le tagline
- [ ] Ouvrir le catalogue (`/catalog`)
- [ ] Voir les filtres (instruments, niveaux)
- [ ] Ouvrir une page de cours (`/catalog/:id`)
- [ ] Comprendre la différence entre brouillon et cours publié

### Notes à noter :
> Qu'est-ce que vous n'avez pas compris ? Quelle question vous êtes-vous posé ?

---

## Parcours étudiant

- [ ] Se connecter avec Google (bouton "Se connecter avec Google")
- [ ] Vérifier que l'authentification se passe bien
- [ ] Accéder au dashboard étudiant (`/dashboard/student`)
- [ ] Comprendre la page "Aucun cours pour le moment"
- [ ] Demander l'accès à un cours
- [ ] Vérifier la confirmation de demande
- [ ] Comprendre les statuts : En attente / Approuvée / Refusée
- [ ] Comprendre le rôle de Google Classroom dans le cours

### Notes à noter :
> Est-ce que le workflow "demande → validation → accès" est clair ? Quel est le moment de confusion ?

---

## Parcours enseignant

- [ ] Se connecter avec Google (compte enseignant)
- [ ] Accéder au dashboard enseignant (`/dashboard/teacher`)
- [ ] Voir ses cours créés
- [ ] Voir la section "Demandes d'inscription"
- [ ] Lire une demande d'inscription
- [ ] Approuver une demande
- [ ] Refuser une demande
- [ ] Comprendre la liaison Classroom (si applicable)

### Notes à noter :
> Est-ce que le workflow "approuver/refuser" est clair ? Est-ce que Classroom est utile ?

---

## Parcours admin

- [ ] Se connecter avec Google (compte admin)
- [ ] Accéder au dashboard admin (`/dashboard/admin`)
- [ ] Voir le header "Pilotage Metableton"
- [ ] Voir la liste des utilisateurs
- [ ] Changer le rôle d'un utilisateur
- [ ] Accéder à la page des cours (`/dashboard/admin/courses`)
- [ ] Comprendre les stats (Total / Publiés / Brouillons / Classroom lié)

### Notes à noter :
> Est-ce que la gouvernance est claire ? Est-ce que les stats sont utiles ?

---

## Moment Google Classroom

- [ ] Vérifier si l'enseignant a accès à Classroom
- [ ] Vérifier si l'étudiant voit le lien Classroom
- [ ] Ouvrir un cours avec Classroom lié
- [ ] Comprendre le workflow " OAuth → Link → Cours"

### Notes à noter :
> Est-ce que Google Classroom est perçu comme un avantage ? Une contrainte ?

---

## Après le test

- [ ] Noter les bugs (écran, message d'erreur, reproduction)
- [ ] Noter les incompréhensions (phrase à laquelle vous avez répondu "je ne sais pas")
- [ ] Noter les demandes de features (suggestion spontanée)
- [ ] Remplir le formulaire de feedback (`p29-feedback-form.md`)
- [ ] Envoyer vos notes à l'équipe

### Notes à noter :
> Quelle est la première chose à améliorer selon vous ?

---

**Fin de la checklist.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
