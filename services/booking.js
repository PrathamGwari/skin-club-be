const axios = require("axios");
const Appointment = require("../models/Appointment");
const bookAppointment = async (data) => {
    try {
        const {staffId, serviceId, fromTime, customerDetails, accessToken, userInfo} = data;
        const bodyFormData = new FormData();
        bodyFormData.append('staff_id', staffId);
        bodyFormData.append('from_time', fromTime);
        bodyFormData.append('service_id', serviceId);
        bodyFormData.append('customer_details', JSON.stringify(customerDetails));
        const {data: {response: {returnvalue}}} = await axios.post('https://www.zohoapis.com/bookings/v1/json/appointment', bodyFormData, {
            headers: {
                Authorization: accessToken
            }
        });
        const appointmentData = {
            ...returnvalue,
            customer_info: userInfo
        }
        const AppointmentResponse = new Appointment(appointmentData);
        await AppointmentResponse.save();
        return returnvalue.booking_id;
    } catch (e) {
        console.log(e);
    }
}
const getBookedAppointment = async (bookingId, accessToken) => {
    try {
        const {data: {response: {returnvalue}}} = await axios.get('https://www.zohoapis.com/bookings/v1/json/appointment', {
            headers: {
                Authorization: accessToken
            },
            params: {
                booking_id: bookingId
            }
        });
        return returnvalue;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {bookAppointment, getBookedAppointment};