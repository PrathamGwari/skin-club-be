const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    staff_name: { type: String},
    customer_more_info: { type: Object},
    customer_booking_start_time: { type: String},
    customer_contact_no: { type: String},
    booked_on: { type: String},
    booking_id: { type: String},
    workspace_id: { type: String},
    duration: { type: String},
    service_id: { type: String},
    staff_id: { type: String},
    cost_paid: { type: String},
    currency: { type: String},
    workspace_name: { type: String},
    cost: { type: String},
    service_name: { type: String},
    time_zone: { type: String},
    start_time: { type: String},
    due: { type: String},
    email: { type: String},
    booking_type: { type: String},
    name: { type: String},
    summary_url: { type: String},
    customer_booking_time_zone: { type: String},
    status: { type: String},
    customer_info: {
        user_phone: { type: String},
        user_email: { type: String},
        user_first_name: { type: String},
        user_last_name: { type: String},
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
