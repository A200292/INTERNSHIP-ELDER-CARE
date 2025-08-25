const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    // notificationId:{
    //     type: Schema.Types.ObjectId,
    //     required: true
    // },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    notificationType: {
        type: String,
        enum: ['appointment', 'health_update', 'emergency', 'matchCriteria'],
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
