import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import GoogleLogin from 'react-google-login';

const LoginComponent = props => {

    const history = useHistory();

    const responseSuccessGoogle = googleResponse => {
        console.log(googleResponse);

        axios.post("/login/google", { tokenId: googleResponse.tokenId })
            .then(response => {
                console.log(response);

                history.push('/');
            });
    }

    const responseErrorGoogle = googleResponse => {
        console.error(googleResponse);
    }

    return (
        <div className="App">
            <div className="col-md-6 offset-md-3 text-center mt-5">
                <GoogleLogin
                    clientId="290608108131-2oik11klmlpt0v1s1909u7pjrhrhon6c.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseSuccessGoogle}
                    onFailure={responseErrorGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    )
}

export default LoginComponent;