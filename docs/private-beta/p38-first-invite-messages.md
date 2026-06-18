# P-38 — First Invite Messages

**Date:** 2026-06-18
**Usage:** Messages à envoyer aux testeurs pour la première invitation réelle.

---

## Contexte

Ces messages sont utilisés pour le **premier contact** avec un testeur potentiel.
Une fois l'invitation créée dans l'UI admin (`/dashboard/admin/beta-invitations`),
le lien unique (`/beta/invite/:token`) est copié et envoyé avec l'un de ces messages.

> **Différence avec P-31 :** Les messages P-31 sont pour l'onboarding *après* acceptation.
> Ceux-ci sont pour la *première invitation*.

---

## Version 1 — WhatsApp court

Pour un contact direct et informel (musicien, ami, connaissance).

```
Salut [Prénom] 👋

Je lance la bêta privée de Metableton École, mon projet
d'école de musique en ligne connectée à Google Classroom.

Je cherche 3 à 5 testeurs pour valider le concept avant
un lancement public. C'est un MVP, pas un produit fini.

⏱️ Temps : 10 à 15 minutes
👤 Rôle : [étudiant / enseignant / admin]

Voici ton lien d'invitation personnel :
[LIEN_BETA_INVITE]

⚠️ Important : connecte-toi avec le même compte Google
que cet email ([EMAIL_TESTEUR]), sinon l'invitation
ne fonctionnera pas.

Ton retour honnête sera super utile — ce qui marche,
ce qui est confus, ce qui manque. Tu peux répondre
directement ici.

Merci ! 🙏
```

---

## Version 2 — Email simple

Pour un contact plus formel (enseignant, partenaire école).

**Objet :** Metableton École — Invitation bêta privée 🎵

**Corps :**

```
Bonjour [Prénom],

Je travaille sur Metableton École, une plateforme de cours
de musique en ligne connectée à Google Classroom.

Le projet est en phase de bêta privée. Je cherche 3 à 5
testeurs pour valider le concept avant un lancement public.

🎯 Ce qu'on teste :
- Le catalogue de cours
- Le workflow de demande d'inscription
- Le dashboard (étudiant, enseignant ou admin selon ton rôle)
- La connexion avec Google Classroom

⏱️ Temps demandé : 10 à 15 minutes
👤 Ton rôle : [étudiant / enseignant / admin]

🔗 Ton lien d'invitation personnel :
[LIEN_BETA_INVITE]

⚠️ Connecte-toi avec le compte Google correspondant à
cet email ([EMAIL_TESTEUR]). L'invitation est liée à
cette adresse.

📝 Ton retour est essentiel. Ce qui est clair, ce qui
est confus, ce qui manque — tout est utile. Tu peux
répondre à cet email ou utiliser le formulaire de feedback.

C'est un MVP testable, pas un produit fini. Merci pour
ton temps et ton honnêteté !

[TON NOM]
```

---

## Version 3 — Relance douce

À envoyer 3 à 5 jours après l'invitation si pas de réponse.

### WhatsApp

```
Salut [Prénom] 👋

Petit rappel tout doux — je t'ai envoyé une invitation
pour tester Metableton École il y a quelques jours.

Pas de pression ! Si t'as 10 minutes cette semaine pour
jeter un œil, voici le lien :

[LIEN_BETA_INVITE]

Et si c'est pas le bon moment, dis-le moi, y'a zéro
souci 😊

Merci !
```

### Email

**Objet :** Petit rappel — Metableton École bêta

```
Bonjour [Prénom],

Juste un petit rappel au cas où mon premier message
se serait perdu.

L'invitation pour tester Metableton École est toujours
valide : [LIEN_BETA_INVITE]

⏱️ 10 à 15 minutes suffisent.
👤 Rôle : [étudiant / enseignant / admin]

Si ce n'est pas le bon moment, pas de souci — dis-le
moi simplement.

Bonne journée !

[TON NOM]
```

---

## Notes d'utilisation

- **Personnaliser** `[Prénom]`, `[LIEN_BETA_INVITE]`, `[EMAIL_TESTEUR]`, `[rôle]` et `[TON NOM]` avant envoi.
- **Ne pas envoyer le lien en public** (réseaux sociaux, groupes). C'est une invitation personnelle.
- **Le lien est à usage unique** : une fois accepté, il ne fonctionne plus.
- **L'email Google doit correspondre** à l'email utilisé pour créer l'invitation dans l'UI admin.
- **Si le testeur utilise un autre compte Google**, l'invitation sera refusée. Lui demander de se reconnecter avec le bon compte.

---

**Fin du document.**

*Document généré le 2026-06-18*
