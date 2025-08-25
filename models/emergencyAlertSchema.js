const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencyAlertSchema = new Schema({
    
    elderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    triggeredAt: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    notifiedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
