import './setup.js';
import { renderTrainingPrompt } from '../services/ai/promptLoader.js';

describe('renderTrainingPrompt', () => {
  it('ersetzt alle Platzhalter durch die übergebenen Werte', () => {
    const text = renderTrainingPrompt({
      ageGroup: 'U15',
      goal: 'Umschaltspiel verbessern',
      durationMinutes: 90,
      playerCount: 14,
      focus: 'Pressing',
    });

    expect(text).toContain('U15');
    expect(text).toContain('Umschaltspiel verbessern');
    expect(text).toContain('90');
    expect(text).toContain('14');
    expect(text).toContain('Pressing');
    expect(text).not.toMatch(/{{\w+}}/);
  });

  it('enthält die festen Sicherheits- und Formatregeln unverändert', () => {
    const text = renderTrainingPrompt({
      ageGroup: 'U11', goal: 'x', durationMinutes: 60, playerCount: 10, focus: 'y',
    });

    expect(text).toContain('Keine Spieler- oder Talentbewertung');
    expect(text).toContain('Bitte vor dem Einsatz an die Gruppe anpassen.');
  });
});
