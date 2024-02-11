const AccessToken = require('../models/AccessToken');
const axios = require("axios");

const updateAccessToken = async (req, rss, next) => {
    try {
        const tokenInfo = await AccessToken.find({});
        console.log('token info', tokenInfo)
        console.log('token info length', tokenInfo.length)
        if (tokenInfo.length) {
            const tokenDetails = tokenInfo[0];
            if (Date.now() > tokenDetails.expiration) {
                console.log('token expired')
                const {data} = await axios.post('https://accounts.zoho.com/oauth/v2/token', {}, {
                    params: {
                        grant_type: 'refresh_token',
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        refresh_token: process.env.REFRESH_TOKEN
                    }
                });
                const updatedAccess = await AccessToken.findOneAndUpdate(
                    { expiration: tokenDetails.expiration },
                    { accessToken: data.access_token, expiration: Date.now() + 2000000 }
                );
                req.body.accessToken = 'Zoho-oauthtoken ' + data.access_token;
            } else {
                console.log('token not expired')
                req.body.accessToken = 'Zoho-oauthtoken ' + tokenInfo[0].accessToken;
            }
        } else {
            console.log('generating new token')
            console.table({
                grant_type: 'refresh_token',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
            });
            const {data} = await axios.post('https://accounts.zoho.com/oauth/v2/token', {}, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    refresh_token: process.env.REFRESH_TOKEN,
                }
            });
            const CreateToken = new AccessToken({
                accessToken: data.access_token,
                expiration: Date.now() + 2000000
            })
            const savingToken = await CreateToken.save();
            req.body.accessToken = 'Zoho-oauthtoken ' + data.access_token;
        }
    } catch (e) {
        console.error(e);
    }
    next();
}

module.exports = {updateAccessToken};