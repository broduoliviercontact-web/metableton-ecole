# P-30 — Feedback Triage Board

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Inbox

| ID | Date | Testeur | Rôle | Type | Zone | Retour brut | Priorité | Sévérité | Statut | Ticket |
|---|---|---|---|---|---|---|---|---|---|---|
| **FB-001** | 2026-06-17 | Jean | enseignant | UX | classroom | "Après OAuth Classroom, le bouton n'apparaît pas immédiatement" | P1 | High | Confirmed | TKT-101 |
| | | | | | | | | | | |

---

## Bugs confirmés

| ID | Zone | Description | Reproduction | Sévérité | Priorité | Statut | Ticket |
|---|---|---|---|---|---|---|---|
| **TKT-101** | classroom | Bouton "Ouvrir Google Classroom" non visible après OAuth | 1. Se connecter enseignant<br>2. Connecter Classroom<br>3. Retour dashboard<br>4. Bouton absent | High | P1 | En cours | |
| | | | | | | | |

---

## UX / incompréhensions

| ID | Zone | Problème compris | Impact | Décision | Ticket |
|---|---|---|---|---|---|
| **FB-002** | catalog | "Je ne savais pas qu'un cours pouvait être 'brouillon'" | Faible | Ajouter tooltip "Brouillon = pas encore publié" | Aucun |
| **FB-003** | dashboard-student | "Le statut 'En attente' est pas clair" | Moyenne | Renommer en "En attente de validation" | |
| | | | | | |
| | | | | | |

---

## Features demandées

| ID | Demande | Qui l'a demandé | Pourquoi | Décision | Priorité |
|---|---|---|---|---|---|
| **FB-004** | Notifications email | Jean | "Je ne sais pas quand ma demande est approuvée" | À implémenter | P1 |
| **FB-005** | Export élèves | École | "Je dois copier coller les emails un par un" | À implémenter | P2 |
| **FB-006** | Mode sombre | Thomas | "Luminosité forte la nuit" | Out of scope MVP | P3 |
| | | | | | |
| | | | | | |

---

## Décisions prises

| Date | Retour lié | Décision | Raison |
|---|---|---|---|
| 2026-06-17 | FB-001 | Créer ticket UX classroom link | Feedback important, plusieurs utilisateurs pourraient être bloqués |
| 2026-06-17 | FB-004 | Prioriser notifications email | Fonctionnalité essentielle pour engagement |
| 2026-06-17 | FB-006 | Report à V1 | Mode sombre non critique, nice to have |
| | | | |

---

## Détails de répartition (à remplir après bêta)

### Par testeur

| Testeur | Retours | Bugs | UX | Feature | Note |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

### Par zone

| Zone | Retours | Bugs | UX | % de satisfaction |
|---|---|---|---|---|
| home | | | | |
| catalog | | | | |
| dashboard-student | | | | |
| dashboard-teacher | | | | |
| dashboard-admin | | | | |
| classroom | | | | |
| auth | | | | |

### Par type

| Type | Nombre | % du total |
|---|---|---|
| Bug | | |
| UX confusion | | |
| Feature request | | |
| Content issue | | |
| Performance | | |
| Out of scope | | |
| **Total** | | 100% |

---

## Indicateurs clés (à remplir après bêta)

| KPI | Valeur |
|---|---|
| **Nombre total de retours** | |
| **Bugs confirmés** | |
| **UX majeures corrigées** | |
| **Features implémentées** | |
| **Retours out of scope** | |
| **Satisfaction moyenne** | |

### Score de satisfaction (à calculer)

```
Satisfaction = (Testeurs satisfaits / Total testeurs) × 100
Satisfaction = ( ? / ? ) × 100 = ? %
```

---

## Prochaines étapes (à remplir après bêta)

| Étape | Responsable | Date | Statut |
|---|---|---|---|
| Analyser tous les retours | | | |
| Prioriser les features | | | |
| Créer tickets importants | | | |
| Planifier bêta 2 | | | |
| Décider lancement V1 | | | |

---

**Fin du triage board.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*

---

*Note pour l'équipe : Ce board est à remplir pendant et après la bêta. Copier-coller les retours au fur et à mesure. Les colonnes "Priorité" et "Sévérité" sont à compléter selon le guide p30-feedback-intake.md.*
