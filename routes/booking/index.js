const axios = require('axios');
const Appointment = require('../../models/Appointment');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.json({
    data: req.body.accessToken
  });
});

router.get('/get-update', async (req, res, next) => {
  try {
    const {data} = await axios.post('https://accounts.zoho.com/oauth/v2/token', {}, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
      }
    });

    res.json({data});
  } catch (e) {
    return res.json({
      message: 'Something went wrong',
      errorLog: e
    })
  }
});

router.get('/locations', async (req, res, next) => {
  try {
    const {accessToken} = req.body;
    console.log('getting locations data', accessToken)
    const {data} = await axios.get('https://www.zohoapis.com/bookings/v1/json/workspaces', {
      headers: {
        Authorization: accessToken
      }
    });
    res.json({data});
  } catch (e) {
    // console.error(e)
    res.json({
      message: 'Something went wrong',
      errorLog: e
    })
  }
});

router.post('/services', async (req, res, next) => {
  try {
    const {accessToken} = req.body;
    const workSpaceId = req.body.location_id;
    const {data} = await axios.get('https://www.zohoapis.com/bookings/v1/json/services', {
      headers: {
        Authorization: accessToken
      },
      params: {
        workspace_id: workSpaceId.toString()
      }
    });
    res.json({data});
  } catch (e) {
    res.json({
      message: 'Something went wrong',
      errorLog: e
    })
  }
});

router.post('/available-slots', async (req, res, next) => {
  try {
    const {staffId, serviceId, selectedDate, accessToken} = req.body;
    const {data} = await axios.get('https://www.zohoapis.com/bookings/v1/json/availableslots', {
      headers: {
        Authorization: accessToken
      },
      params: {
        staff_id: staffId.toString(),
        service_id: serviceId.toString(),
        selected_date: selectedDate.toString(),
      }
    });
    res.json({data});
  } catch (e) {
    console.log(e);
    res.json({
      message: 'Something went wrong',
      errorLogs: JSON.toString(e)
    })
  }
});

router.post('/booking', async (req, res, next) => {

});

router.post('/doctors', async (req, res, next) => {
  try {
    const {service_id, accessToken} = req.body;
    const {data} = await axios.post('https://www.zohoapis.com/bookings/v1/json/staffs', {}, {
      headers: {
        Authorization: accessToken
      },
      params: {
        service_id
      }
    });
    res.json({data});
  } catch (e) {
    console.log(e);
    res.json({
      message: 'Something went wrong',
      errorLog: JSON.toString(e)
    })
  }
});

module.exports = router;
