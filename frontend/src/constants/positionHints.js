/**
 * Positions-Hinweise für jeden Spielertyp
 * IFF-konform, für das Info-Panel wenn ein Spieler ausgewählt wird
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
    M: {
      name: 'Mittelfeld',
      short: 'M',
      hint: 'Bindeglied zwischen Abwehr und Angriff. Unterstützt in beiden Phasen und hat die größte Laufleistung.',
      tips: [
        'Zwischen den Linien anbieten',
        'Freie Mitspieler suchen und anspielen',
        'Pressing initiieren wenn der Gegner unter Druck ist',
      ],
    },
    S: {
      name: 'Stürmer',
      short: 'S',
      hint: 'Sucht aktiv den Torabschluss. Presst gegnerische Verteidiger und öffnet Räume für das Mittelfeld.',
      tips: [
        'Torposition frühzeitig einnehmen',
        'Gegnerische Abwehr durch Bewegung binden',
        'Nach Ballverlust sofort pressen',
      ],
    },
    RV: {
      name: 'Rechter Verteidiger',
      short: 'RV',
      hint: 'Deckt die rechte Seite der Abwehr. Unterstützt bei Bedarf den rechten Flügel im Angriff.',
      tips: [
        'Linie halten mit dem linken Verteidiger',
        'Flanken des Gegners frühzeitig unterbinden',
        'Bei eigenem Angriff auf der rechten Bahn aufrrücken',
      ],
    },
    LV: {
      name: 'Linker Verteidiger',
      short: 'LV',
      hint: 'Deckt die linke Seite der Abwehr. Spiegel des rechten Verteidigers.',
      tips: [
        'Symmetrie mit dem rechten Verteidiger wahren',
        'Linke Bahn bei gegnerischem Aufbau schließen',
        'Nach oben sichern wenn Mittelfeld aufrrückt',
      ],
    },
    RM: {
      name: 'Rechter Mittelfeldspieler',
      short: 'RM',
      hint: 'Verbindet Abwehr und Angriff auf der rechten Bahn. Unterstützt Verteidiger und Stürmer.',
      tips: [
        'Rechte Außenbahn besetzen',
        'Nach Ballgewinn schnell nach vorne anbieten',
        'Bei gegnerischem Angriff über die rechte Seite zurückarbeiten',
      ],
    },
    LM: {
      name: 'Linker Mittelfeldspieler',
      short: 'LM',
      hint: 'Verbindet Abwehr und Angriff auf der linken Bahn. Spiegel des rechten Mittelfeldspielers.',
      tips: [
        'Linke Außenbahn besetzen',
        'Symmetrie mit dem rechten Mittelfeldspieler wahren',
        'Bei gegnerischem Angriff über die linke Seite zurückarbeiten',
      ],
    },
    ST: {
      name: 'Stürmer (Mitte)',
      short: 'ST',
      hint: 'Zentraler Torabschluss. Presst die gegnerische Abwehr und sucht die Zuspiele aus dem Mittelfeld.',
      tips: [
        'Zentrale Torposition frühzeitig einnehmen',
        'Freilaufen für Zuspiele aus dem Mittelfeld',
        'Nach Ballverlust als erster pressen',
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
    M: {
      name: 'Midfielder',
      short: 'MF',
      hint: 'Link between defence and attack. Supports in both phases and covers the most ground.',
      tips: [
        'Offer yourself between the lines',
        'Look for free teammates',
        'Initiate pressing when opponent is under pressure',
      ],
    },
    S: {
      name: 'Forward',
      short: 'FW',
      hint: 'Actively seeks goal opportunities. Presses defenders and creates space for midfielders.',
      tips: [
        'Take up goal position early',
        'Bind defenders through movement',
        'Press immediately after losing the ball',
      ],
    },
    RV: {
      name: 'Right Defender',
      short: 'RD',
      hint: 'Covers the right side of the defence. Supports the right wing in attack when needed.',
      tips: [
        'Hold the line with the left defender',
        'Cut off opponent crosses early',
        'Join the right-side attack when your own team has the ball',
      ],
    },
    LV: {
      name: 'Left Defender',
      short: 'LD',
      hint: 'Covers the left side of the defence. Mirror of the right defender.',
      tips: [
        'Maintain symmetry with the right defender',
        'Close the left channel against opponent build-up',
        'Cover back when midfield pushes forward',
      ],
    },
    RM: {
      name: 'Right Midfielder',
      short: 'RM',
      hint: 'Links defence and attack on the right flank. Supports both defenders and forwards.',
      tips: [
        'Occupy the right flank',
        'Offer an outlet forward after winning the ball',
        'Track back on the right when the opponent attacks',
      ],
    },
    LM: {
      name: 'Left Midfielder',
      short: 'LM',
      hint: 'Links defence and attack on the left flank. Mirror of the right midfielder.',
      tips: [
        'Occupy the left flank',
        'Maintain symmetry with the right midfielder',
        'Track back on the left when the opponent attacks',
      ],
    },
    ST: {
      name: 'Striker',
      short: 'ST',
      hint: 'Central goal threat. Presses the opposing defence and looks for through balls from midfield.',
      tips: [
        'Take up a central goal position early',
        'Find space for passes from midfield',
        'Be first to press after losing the ball',
      ],
    },
  },
};
