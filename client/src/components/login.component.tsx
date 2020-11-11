import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import NavbarSimple from './common/navbar-simple.component';
import { SessionContext } from '../context/session.context';

import image from '../assets/login.jpg';

const LoginComponent: React.FC = () => {

    const history = useHistory();

    const session = useContext(SessionContext);

    const isGoogleLoginResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline):
        response is GoogleLoginResponse => {
            return !!response &&
                typeof response === 'object' &&
                !!(response as GoogleLoginResponse).tokenId;
        };

    const responseSuccessGoogle = (googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (isGoogleLoginResponse(googleResponse)) {
            axios.post("/login/google", { tokenId: googleResponse.tokenId })
                .then(response => {
                    session.setDriver(response.data);

                    history.push('/');
                });
        }
    }

    const responseErrorGoogle = (googleResponse: any) => {
        console.error(googleResponse);
    }

    return (
        <React.Fragment>
            <NavbarSimple/>
            <br/>
            <div className="login-container">
                <div className="row-flex banner">
                    <div className="col-2 col-2-a">
                        <h1 className="title-line-1">Hit the Track.</h1>
                        <h1>Make History</h1>
                        <div className="google-login-holder">
                            <GoogleLogin
                                clientId="290608108131-2oik11klmlpt0v1s1909u7pjrhrhon6c.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={responseSuccessGoogle}
                                onFailure={responseErrorGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                    <div className="col-2">
                        <img src={image} alt="exciting_road" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginComponent;