const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_PRIVATE_KEY);

let Driver = require('../models/driver.model');

// Login
router.route('/google').post((req, res) => {
    const { tokenId } = req.body;

    client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_PRIVATE_KEY })
        .then(verifyResponse => {
            const {email_verified, email} = verifyResponse.payload;

            if (email_verified) {
                Driver.findOne({email})
                    .then(driver => {
                        if (driver) {
                            const token = driver.generateAuthToken();

                            res.cookie('token', token, { httpOnly: true })
                                .json({
                                    _id: driver._id,
                                    name: driver.name,
                                    isAdmin: driver.isAdmin
                                });
                        }
                        else {
                            res.status(400).json('Error [Driver Not Setup]')
                            /* Do not support New Users at the moment
                            const name = given_name;

                            const newDriver = new Driver({ name, email });

                            newDriver.save()
                                .then(driver => res.json(driver.name))
                                .catch(err => res.status(400).json('Error [Add New Driver]: ' + err)); */
                        }
                    })
                    .catch(err => {
                        res.status(400).json('Error [Get Driver]: ' + err)
                    })
            }
            else {
                res.status(500).json('Error [Account not valid]');
            }
        });
});

module.exports = router;