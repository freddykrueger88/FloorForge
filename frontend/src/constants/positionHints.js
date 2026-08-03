/**
 * Positions-Hinweise für jeden Spielertyp
 * IFF-konform, für das Info-Panel wenn ein Spieler ausgewählt wird
 *
 * Formation: Standard-Großfeld-System 2-1-2 (2 Verteidiger, 1 Center,
 * 2 Stürmer) – siehe Issue #28. Es gibt keine "Mittelfeld"-Linie wie im
 * Fußball; die mittlere Feldspieler-Position heißt in Floorball/Unihockey
 * "Center" (DE gleichlautend, Lehnwort).
 */
export const POSITION_HINTS = {
  de: {
    TW: {
      name: 'Torwart',
      short: 'TW',
      hint: 'Bewacht das Tor. Darf im Torraum den Ball mit allen Körperteilen spielen. Kommuniziert mit der Verteidigung und organisiert den Rückraum.',
      tips: [
        'Im Torraum bleiben – außerhalb gelten Feldspieler-Regeln',
        'Schnelle Abwürfe starten Konter',
        'Sichtkontakt mit Verteidigern halten',
      ],
    },
    V: {
      name: 'Verteidiger',
      short: 'V',
      hint: 'Sichert die eigene Hälfte und unterstützt den Torwart. Verhindert Torschüsse und leitet Angriffe ein.',
      tips: [
        'Gegner unter Druck setzen, aber Position halten',
        'Beim Angriff nachrücken, aber Rückweg freihalten',
        'Kommunikation mit dem Torwart ist entscheidend',
      ],
    },
    C: {
      name: 'Center',
      short: 'C',
      hint: 'Bindeglied zwischen Abwehr und Angriff im 2-1-2-System. Unterstützt in beiden Phasen und hat die größte Laufleistung.',
      tips: [
        'Zwischen den Linien anbieten',
        'Freie Mitspieler suchen und anspielen',
        'Pressing initiieren wenn der Gegner unter Druck ist',
      ],
    },
    S: {
      name: 'Stürmer',
      short: 'S',
      hint: 'Sucht aktiv den Torabschluss. Presst gegnerische Verteidiger und öffnet Räume für den Center.',
      tips: [
        'Torposition frühzeitig einnehmen',
        'Gegnerische Abwehr durch Bewegung binden',
        'Nach Ballverlust sofort pressen',
      ],
    },
  },
  en: {
    TW: {
      name: 'Goalkeeper',
      short: 'GK',
      hint: 'Guards the goal. Can use all body parts inside the crease. Organises the defence and communicates with defenders.',
      tips: [
        'Stay inside the crease – field player rules apply outside',
        'Quick throws start counter-attacks',
        'Maintain eye contact with defenders',
      ],
    },
    V: {
      name: 'Defender',
      short: 'D',
      hint: 'Secures the defensive half and supports the goalkeeper. Prevents shots and initiates attacks.',
      tips: [
        'Press opponents but hold position',
        'Join attacks but keep the way back clear',
        'Communication with goalkeeper is key',
      ],
    },
    C: {
      name: 'Centre',
      short: 'C',
      hint: 'Link between defence and attack in the 2-1-2 system. Supports in both phases and covers the most ground.',
      tips: [
        'Offer yourself between the lines',
        'Look for free teammates',
        'Initiate pressing when opponent is under pressure',
      ],
    },
    S: {
      name: 'Attacker',
      short: 'A',
      hint: 'Actively seeks goal opportunities. Presses defenders and creates space for the centre.',
      tips: [
        'Take up goal position early',
        'Bind defenders through movement',
        'Press immediately after losing the ball',
      ],
    },
  },
};
