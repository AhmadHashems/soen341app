import React from 'react';
import SubmitButton from './SubmitButton';
import {getCookie} from "../GlobalFunctions";
import {useHistory} from 'react-router-dom';


function LogoutForm() {

    let history = useHistory();

    function submitLogout(e) {

        const csrftoken = getCookie('csrftoken')

        fetch('/api/logout/', {
                method: 'POST',
                body: '',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    return history.push('/login');
                } else {
                    return history.push('/feed');
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <SubmitButton onClick={() => submitLogout()} text="Logout"/>
    )
}

export default LogoutForm