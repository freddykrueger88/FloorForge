/**
 * Board Model – Ein Spielfeld (Taktik-Board)
 * Enthält Spielfeld-Typ, Spieler-Positionen, Zeichen-Elemente und Lines
 */
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  role:     { type: String, default: 'GK' },   // GK, D, F, etc.
  name:     { type: String, default: '' },
  team:     { type: String, enum: ['home', 'away'], default: 'home' },
  x:        { type: Number, required: true },
  y:        { type: Number, required: true },
  lineIds:  [{ type: String }],                // Welchen Lines gehört dieser Spieler an
}, { _id: false });

const DrawingElementSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  type:        { type: String, enum: ['move', 'pass', 'shot', 'freehand'], required: true },
  color:       { type: String, default: '#facc15' },
  strokeWidth: { type: Number, default: 3 },
  dash:        [{ type: Number }],
  arrowHead:   { type: Boolean, default: true },
  // Pfeil-Koordinaten (in Metern)
  x1: Number, y1: Number, x2: Number, y2: Number,
  // Freihand-Punkte (in Metern, alternierend x/y)
  points: [{ type: Number }],
  lineId: { type: String, default: null },     // Welcher Line gehört dieses Element
}, { _id: false });

const LineSchema = new mongoose.Schema({
  id:    { type: String, required: true },
  name:  { type: String, required: true },     // z.B. "Line 1", "PP", "PK"
  color: { type: String, default: '#facc15' },
  order: { type: Number, default: 0 },
}, { _id: false });

const BoardSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 80 },
  fieldType: {
    type:    String,
    enum:    ['large', 'small', 'street', 'three_v_three'],
    default: 'large',
  },
  theme:       { type: String, enum: ['dark', 'light', 'vikings', 'iff'], default: 'dark' },
  homeColor:   { type: String, default: '#1d4ed8' },
  awayColor:   { type: String, default: '#dc2626' },
  ballColor:   { type: String, default: '#ffffff' },
  showGrid:    { type: Boolean, default: false },
  showNames:   { type: Boolean, default: true  },
  namePosition:{ type: String, enum: ['above', 'below'], default: 'below' },
  players:     [PlayerSchema],
  elements:    [DrawingElementSchema],
  lines:       [LineSchema],
  activeLineId:{ type: String, default: null },
  // Soft-Delete Schutz
  deletedAt:   { type: Date, default: null },
}, {
  timestamps: true,
});

// Index für schnelles Laden (neueste zuerst)
BoardSchema.index({ createdAt: -1 });
BoardSchema.index({ updatedAt: -1 });

export default mongoose.model('Board', BoardSchema);
