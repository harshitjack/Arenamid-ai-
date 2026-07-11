import mongoose, { Schema } from 'mongoose';

const IncidentSchema = new Schema({
  reporterName: { type: String, required: true },
  reporterId: { type: String, default: 'anonymous' },
  type: {
    type: String,
    enum: ['medical', 'fire', 'violence', 'lost_child', 'suspicious_object'],
    required: true,
  },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['reported', 'assigned', 'resolving', 'resolved'],
    default: 'reported',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  assignedVolunteer: { type: String, default: '' }, // Volunteer Name / ID
  aiAnalysis: {
    suggestedResponse: { type: String, default: '' },
    responsePlan: [{ type: String }],
    notifiedControlRoom: { type: Boolean, default: true },
    recommendedPath: [{ type: String }], // list of directions/nodes
  },
  createdAt: { type: Date, default: Date.now },
});

export const IncidentModel = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
