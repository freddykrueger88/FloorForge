/**
 * Board Model – inkl. eingebetteter Frames
 */
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  role:     { type: String, default: 'GK' },
  name:     { type: String, default: '' },
  team:     { type: String, enum: ['home', 'away'], default: 'home' },
  x:        { type: Number, required: true },
  y:        { type: Number, required: true },
  lineIds:  [{ type: String }],
}, { _id: false });

const DrawingElementSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  type:        { type: String, enum: ['move', 'pass', 'shot', 'freehand'], required: true },
  color:       { type: String, default: '#facc15' },
  strokeWidth: { type: Number, default: 3 },
  dash:        [{ type: Number }],
  arrowHead:   { type: Boolean, default: true },
  x1: Number, y1: Number, x2: Number, y2: Number,
  points:      [{ type: Number }],
  lineId:      { type: String, default: null },
}, { _id: false });

const LineSchema = new mongoose.Schema({
  id:    { type: String, required: true },
  name:  { type: String, required: true },
  color: { type: String, default: '#facc15' },
  order: { type: Number, default: 0 },
}, { _id: false });

// Frame = ein Moment im Spielzug
const FrameSchema = new mongoose.Schema({
  order:    { type: Number, required: true },   // Reihenfolge (0-basiert)
  label:    { type: String, default: '' },       // z.B. "Anspiel", "Drehung"
  players:  [PlayerSchema],
  elements: [DrawingElementSchema],
  duration: { type: Number, default: 1000 },    // Anzeigedauer in ms bei Animation
}, { timestamps: true });

const BoardSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  notes:       { type: String, default: '', maxlength: 500 },
  fieldType:   { type: String, enum: ['large','small','street','three_v_three'], default: 'large' },
  theme:       { type: String, enum: ['dark','light','vikings','iff'], default: 'dark' },
  homeColor:   { type: String, default: '#1d4ed8' },
  awayColor:   { type: String, default: '#dc2626' },
  ballColor:   { type: String, default: '#ffffff' },
  showGrid:    { type: Boolean, default: false },
  showNames:   { type: Boolean, default: true },
  namePosition:{ type: String, enum: ['above','below'], default: 'below' },
  players:     [PlayerSchema],      // Basis-Aufstellung (Frame 0)
  elements:    [DrawingElementSchema],
  lines:       [LineSchema],
  activeLineId:{ type: String, default: null },
  frames:      [FrameSchema],       // Frame-System
  activeFrameIndex: { type: Number, default: 0 },
  deletedAt:   { type: Date, default: null },
}, { timestamps: true });

BoardSchema.index({ createdAt: -1 });
BoardSchema.index({ updatedAt: -1 });

export default mongoose.model('Board', BoardSchema);
