import React from 'react'
import ReactDOM from 'react-dom';
import SubmitButton from "./SubmitButton";
import {Link} from 'react-router-dom'


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        // By using states we can associate the name property of the <input> with the state variable and we can initialize values
        this.state = ({username: '', password: ''})
    }

    onChange = (e) => {
        // If using states to handle, this line will index the state variable with the same name as the calling-event's
        // (the calling input field's) name property and update the state's value to the <input>'s new value
        this.setState({[e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        // Since using states means `this.state` holds the current state of each input field, we can simply convert to JSON and its ready for POST
        const postData = JSON.stringify(this.state);

        /*
        // If using the FormData instead, it will only take what is currently the value of the <input>, and not its state
        const formData = new FormData(e.target);
        // You can see here that this successfully gets/prints the JSON formatted form. However, if you were to try to
        // set the state in the constructor initially and submit the form before writing any values in the fields,
        // the output will be all empty fields (ex: {"username": "",....}) although username's state is 'some initial value'
        console.log(JSON.stringify(Object.fromEntries(formData)));
        */

        fetch('/api/login/', {
            method: 'POST',
            body: postData,
            headers: {'content-type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    return this.props.history.push('/feed')
                }
                const ErrorsList = () => (
                    <ul>{data.errors.map(error => <li key={error}> {error} </li>)}</ul>
                );
                const rootElement = document.getElementById("post-response-errors");
                ReactDOM.render(<ErrorsList />, rootElement);
            })
            .catch(error => console.log(error))
    }

    render() {
        return(
            // The name property of every field needs to be the same as the state so that the relation is established
            <form
                onSubmit={this.onSubmit}
                className="auth-form input">
                Login
                <input
                    name='username'
                    type='text'
                    placeholder='Username'
                    onChange={this.onChange}
                />
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    onChange={this.onChange}
                />
                <SubmitButton
                    type='submit'
                    classes='submit-button-padding'
                    text='Login'
                />
                <Link to ="/register">
                <SubmitButton
                    type='submit'
                    classes='submit-button-padding'
                    text='Register'
                />
                </Link>
                <div id="post-response-errors"/>
            </form>
        )
    }
}

export default LoginForm;