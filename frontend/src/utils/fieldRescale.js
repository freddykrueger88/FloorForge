/**
 * fieldRescale – Rechnet Spielerpositionen & Zeichen-Elemente proportional
 * von einem Feldtyp auf einen anderen um (z.B. bei Feldtyp-Wechsel eines
 * bestehenden Boards). Alle Koordinaten liegen in Metern vor.
 */

export function rescalePlayers(players, scaleX, scaleY) {
  return (players ?? []).map((p) => ({
    ...p,
    x: p.x * scaleX,
    y: p.y * scaleY,
  }));
}

export function rescaleElements(elements, scaleX, scaleY) {
  return (elements ?? []).map((el) => {
    if (el.type === 'freehand') {
      const points = el.points ?? [];
      const scaled = points.map((v, i) => v * (i % 2 === 0 ? scaleX : scaleY));
      return { ...el, points: scaled };
    }
    return {
      ...el,
      x1: el.x1 * scaleX,
      y1: el.y1 * scaleY,
      x2: el.x2 * scaleX,
      y2: el.y2 * scaleY,
    };
  });
}
