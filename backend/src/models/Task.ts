import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, default: '' }, // Volunteer name or ID
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  createdAt: { type: Date, default: Date.now },
});

export const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
