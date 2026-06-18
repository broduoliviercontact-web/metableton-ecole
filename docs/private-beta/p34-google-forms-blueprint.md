# P-34B — Blueprint Google Forms pour la bêta privée

> **Version**: 2026-06-18
> **Tags**: `private-beta`, `google-forms`, `feedback`

---

## Objectif

Ce document sert de **copier-coller** pour créer les Google Forms de la bêta.

Structure recommandée :

1. **Formulaire principal** pour tous les testeurs
2. **Formulaire bug** seulement si un bug est rencontré

---

## Formulaire 1 — Feedback principal

### Paramètres généraux

**Titre**

`Metableton École — Feedback bêta privée`

**Description**

```text
Merci pour ton test.

Ce formulaire prend 3 à 5 minutes.
On cherche surtout à comprendre :
- ce que tu as compris du produit
- ce qui t'a bloqué ou ralenti
- ce qui manque pour que ce soit utile

Il s'agit d'une bêta privée, pas d'une version finale.
```

### Section 1 — Profil du testeur

**Q1. Prénom ou pseudo**
- Type : réponse courte
- Obligatoire : oui

**Q2. Quel profil représentais-tu pendant le test ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Élève / musicien
  - Enseignant
  - Admin / responsable pédagogique
  - Partenaire / école
  - Autre

**Q3. Sur quel appareil as-tu testé ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Ordinateur
  - Mobile
  - Tablette

**Q4. Quel navigateur as-tu utilisé ?**
- Type : liste déroulante
- Obligatoire : non
- Options :
  - Chrome
  - Safari
  - Firefox
  - Edge
  - Autre

---

## Section 2 — Compréhension

**Q5. En une phrase, qu'as-tu compris de Metableton École ?**
- Type : paragraphe
- Obligatoire : oui

**Q6. Est-ce que la page d'accueil explique clairement le projet ?**
- Type : échelle linéaire
- Obligatoire : oui
- Échelle : 1 à 5
- Libellés :
  - 1 = Pas clair
  - 5 = Très clair

**Q7. Est-ce que le catalogue de cours est compréhensible ?**
- Type : échelle linéaire
- Obligatoire : oui
- Échelle : 1 à 5

**Q8. Le rôle de Google Classroom est-il clair ?**
- Type : échelle linéaire
- Obligatoire : oui
- Échelle : 1 à 5

---

## Section 3 — Parcours de test

**Q9. As-tu réussi à te connecter avec Google ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui
  - Oui, mais avec hésitation
  - Non

**Q10. Le dashboard correspondant à ton rôle était-il compréhensible ?**
- Type : échelle linéaire
- Obligatoire : oui
- Échelle : 1 à 5

**Q11. Le workflow d'inscription / validation t'a semblé :**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Très clair
  - Plutôt clair
  - Moyen
  - Confus
  - Je n'ai pas pu le tester

**Q12. À quel moment t'es-tu senti le plus perdu ?**
- Type : paragraphe
- Obligatoire : non
- Aide :
  - home
  - catalogue
  - login
  - dashboard
  - classroom
  - autre

---

## Section 4 — Valeur perçue

**Q13. Est-ce que la plateforme te semble utile pour son public cible ?**
- Type : échelle linéaire
- Obligatoire : oui
- Échelle : 1 à 5

**Q14. Est-ce que les cours donnent envie ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui, clairement
  - Un peu
  - Pas vraiment
  - Pas du tout

**Q15. Qu'est-ce qui manque le plus pour que ce soit utile en vrai ?**
- Type : paragraphe
- Obligatoire : oui

---

## Section 5 — Priorités

**Q16. Quelle est la première chose à améliorer ?**
- Type : paragraphe
- Obligatoire : oui

**Q17. As-tu rencontré un bug ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui
  - Non

**Branchement recommandé**
- Si `Oui` -> afficher un message de fin :

```text
Merci. Si tu peux, remplis aussi le formulaire "Signalement de bug" pour nous aider à reproduire le problème.
```

**Q18. Serais-tu prêt à réutiliser ou recommander cette plateforme après amélioration ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui
  - Peut-être
  - Non

**Q19. Pourquoi ?**
- Type : paragraphe
- Obligatoire : oui

---

## Section 6 — Fin

**Q20. Si tu veux, peux-tu laisser un commentaire libre ?**
- Type : paragraphe
- Obligatoire : non

### Message de confirmation

```text
Merci beaucoup pour ton retour.
Tes réponses vont directement nous aider à prioriser les prochaines améliorations de Metableton École.
```

---

## Formulaire 2 — Signalement de bug

### Paramètres généraux

**Titre**

`Metableton École — Signalement de bug bêta`

**Description**

```text
Merci de décrire le bug rencontré.

Ce formulaire nous aide à reproduire le problème rapidement.
Il prend 2 à 4 minutes.
```

### Questions

**Q1. Prénom ou pseudo**
- Type : réponse courte
- Obligatoire : oui

**Q2. Quel rôle utilisais-tu ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Élève / musicien
  - Enseignant
  - Admin / responsable pédagogique
  - Autre

**Q3. Sur quelle page ou zone le bug est-il arrivé ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Home
  - Catalogue
  - Login
  - Dashboard étudiant
  - Dashboard enseignant
  - Dashboard admin
  - Google Classroom
  - Autre

**Q4. Que voulais-tu faire ?**
- Type : paragraphe
- Obligatoire : oui

**Q5. Que s'est-il passé exactement ?**
- Type : paragraphe
- Obligatoire : oui

**Q6. Qu'est-ce qui aurait dû se passer ?**
- Type : paragraphe
- Obligatoire : non

**Q7. Peux-tu décrire les étapes pour reproduire le bug ?**
- Type : paragraphe
- Obligatoire : oui
- Placeholder conseillé :
  - 1.
  - 2.
  - 3.

**Q8. Le bug bloque-t-il complètement l'usage ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui, complètement
  - Partiellement
  - Non, mais c'est gênant

**Q9. Quel appareil utilisais-tu ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Mac
  - Windows
  - iPhone
  - Android
  - Autre

**Q10. Quel navigateur utilisais-tu ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Chrome
  - Safari
  - Firefox
  - Edge
  - Autre

**Q11. As-tu un screenshot ou un screen recording ?**
- Type : choix multiple
- Obligatoire : oui
- Options :
  - Oui
  - Non

**Q12. Si oui, où peux-tu nous l'envoyer ?**
- Type : réponse courte
- Obligatoire : non
- Exemple :
  - email
  - WhatsApp
  - Drive

### Message de confirmation

```text
Merci. On va utiliser ce signalement pour reproduire le bug et le prioriser.
```

---

## Réglages Google Forms recommandés

- Activer la collecte automatique de l'horodatage
- Ne pas limiter à 1 réponse si un testeur peut refaire un test plus tard
- Autoriser la modification après envoi seulement si tu veux garder le process léger
- Désactiver l'obligation de connexion si tu veux réduire la friction
- Lier chaque formulaire à une feuille Google Sheets

---

## Noms de fichiers Google Sheets recommandés

- `Metableton Beta - Reponses Feedback`
- `Metableton Beta - Reponses Bugs`

### Onglets conseillés dans la Sheet de suivi

- `feedback_raw`
- `bugs_raw`
- `triage_export`
- `weekly_summary`

---

## Règle pratique

Si tu hésites entre ajouter une question ou non :

- la garder si elle change une décision produit
- la supprimer si elle est "intéressante" mais non actionnable

---

## Ordre conseillé de mise en place

1. créer le formulaire principal
2. créer le formulaire bug
3. lier les deux à des Google Sheets
4. mettre les liens dans les messages d'onboarding
5. centraliser ensuite dans `p30-feedback-triage-board.md`

---

**Fin du blueprint.**
