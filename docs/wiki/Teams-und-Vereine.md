# 👥 Teams und Vereine

Zwei getrennte, hierarchisch unabhängige Ebenen: **Teams** (eine
Mannschaft) und **Organizations** (ein Verein mit mehreren Teams).

## Teams

| Rolle | Rechte |
|---|---|
| owner | Alles, inkl. Mitglieder verwalten. Kann nicht entfernt/degradiert werden, solange er der einzige Owner ist |
| coach | Team-geteilte Inhalte (Kader, Playbooks, Trainingspläne, Formationen) anlegen/bearbeiten |
| member | Nur ansehen |

Einladung setzt einen **bereits bestehenden** OpenFloorball-Account der
eingeladenen Person voraus – anders als bei Board-Kollaboratoren gibt
es hier keinen E-Mail-Einladungslink für neue Nutzer.

## Organizations (Vereine)

Gleiches Muster, aber nur zwei Rollen (admin/member). Ein Verein
besteht aus mehreren Teams; Org-Admins haben lesenden Einblick in die
Teams ihres Vereins, aber keine automatischen Bearbeitungsrechte an
deren Inhalten.

## Was NICHT team-gebunden ist

Boards sind bewusst **kein** Teil des Team-/Vereinsmodells. Wer an
einem Board mitarbeiten soll, wird über
[Board-Kollaboratoren](./Export.md#board-teilen-kollaboratoren) eingeladen – unabhängig
davon, ob beide Personen im selben Team sind. Team-geteilt werden
können dagegen: Kader-Einträge, Playbooks, Formationsvorlagen und
Trainingspläne (jeweils optional, per `teamId`).

## Verwandte Seiten

- [Export & Teilen](./Export.md)
- [Kader](./Kader.md)
- [Trainingsplaner](./Trainingsplaner.md)
