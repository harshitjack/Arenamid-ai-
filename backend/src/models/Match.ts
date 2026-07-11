import mongoose, { Schema } from 'mongoose';

const MatchEventSchema = new Schema({
  time: { type: Number, required: true },
  type: { type: String, enum: ['goal', 'card', 'shot', 'corner', 'foul', 'substitution'], required: true },
  detail: { type: String, required: true },
});

const MatchSchema = new Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, enum: ['scheduled', 'live', 'finished'], default: 'scheduled' },
  minute: { type: Number, default: 0 },
  possession: {
    home: { type: Number, default: 50 },
    away: { type: Number, default: 50 },
  },
  expectedGoals: {
    home: { type: Number, default: 0.0 },
    away: { type: Number, default: 0.0 },
  },
  momentum: [{ type: Number }], // array of values between -100 and +100
  timeline: [MatchEventSchema],
  aiCommentary: [{ type: String }],
  predictions: {
    homeWin: { type: Number, default: 33.3 },
    awayWin: { type: Number, default: 33.3 },
    draw: { type: Number, default: 33.4 },
  },
  heatmaps: {
    home: [{ x: Number, y: Number, intensity: Number }],
    away: [{ x: Number, y: Number, intensity: Number }],
  },
  createdAt: { type: Date, default: Date.now },
});

export const MatchModel = mongoose.models.Match || mongoose.model('Match', MatchSchema);
