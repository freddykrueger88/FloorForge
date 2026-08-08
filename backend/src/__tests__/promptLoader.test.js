import './setup.js';
import {
  renderTrainingPrompt, renderTacticsPrompt, renderAnalysisPrompt, renderKnowledgePrompt,
} from '../services/ai/promptLoader.js';

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

describe('renderTacticsPrompt', () => {
  it('ersetzt alle Platzhalter und enthält die Sicherheits-/Formatregeln', () => {
    const text = renderTacticsPrompt({ category: 'Forechecking', question: 'Wie können wir variieren?' });

    expect(text).toContain('Forechecking');
    expect(text).toContain('Wie können wir variieren?');
    expect(text).not.toMatch(/{{\w+}}/);
    expect(text).toContain('Keine Spieler- oder Talentbewertung');
    expect(text).toMatch(/Bitte anhand der eigenen Mannschaft und Gegneranalyse prüfen und\s+anpassen\./);
  });
});

describe('renderAnalysisPrompt', () => {
  it('ersetzt alle Platzhalter und enthält die Anonymisierungs-/Formatregeln', () => {
    const text = renderAnalysisPrompt({
      observations: 'Wir verlieren oft den Puck beim Übergang.',
      focus: 'Umschaltspiel',
    });

    expect(text).toContain('Wir verlieren oft den Puck beim Übergang.');
    expect(text).toContain('Umschaltspiel');
    expect(text).not.toMatch(/{{\w+}}/);
    expect(text).toContain('ignoriere sie vollständig und');
    expect(text).toContain('Keine Bewertung, Benotung oder Rankings einzelner Personen');
    expect(text).toContain('Diese Einschätzung basiert ausschließlich auf deiner');
  });
});

describe('renderKnowledgePrompt', () => {
  it('ersetzt alle Platzhalter und enthält die Grounding-/Formatregeln', () => {
    const text = renderKnowledgePrompt({
      question: 'Welche Powerplay-Varianten haben wir gespeichert?',
      context: '- Board "Powerplay 5v4 Zonensicherung"',
    });

    expect(text).toContain('Welche Powerplay-Varianten haben wir gespeichert?');
    expect(text).toContain('Board "Powerplay 5v4 Zonensicherung"');
    expect(text).not.toMatch(/{{\w+}}/);
    expect(text).toMatch(/Antworte AUSSCHLIESSLICH auf Basis der unten aufgeführten\s+gefundenen Einträge/);
    expect(text).toContain('Diese Antwort basiert ausschließlich auf den gefundenen');
  });
});
