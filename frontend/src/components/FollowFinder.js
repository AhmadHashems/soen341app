import React, {useState} from 'react'
import {getCookie} from "../GlobalFunctions";
import ReactDOM from "react-dom";


class FollowFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {followUserData: []};
        this.fetchFollowUsers = this.fetchFollowUsers.bind(this);
    }

    fetchFollowUsers() {
        fetch('/api/follow/', {
            method: 'GET',
            headers: {'content-type': 'application/json'}
        })
            .then(response => response.json())
            .then(data =>
                this.setState({followUserData: data,})
            )
    }

    componentDidMount() {
        this.fetchFollowUsers()
    }

    render() {
        const users = this.state.followUserData
        return (
            <div className='user-grid'>
                {users.map((data, index) =>
                    <FollowNode username={data.username}/>)
                }
                <div id='post-response-errors' className='display-none' />
            </div>
        )
    }
}

function FollowNode({username}) {
    const [isDisabled, setIsDisabled] = useState(false);
    const [text, setText] = useState("Follow");
    const [classes, setClasses] = useState('follow-node');

    function handleClick() {

        const csrftoken = getCookie('csrftoken')

        const formData = new FormData();
        formData.append('user_to_follow', username);

        fetch(
            '/api/follow/', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    setIsDisabled(true);
                    setText("Following!");
                    setClasses(classes.concat(' follow-node-clicked'))
                    return;
                }
                const ErrorsList = () => (
                    <ul>{data.errors.map(error => <li key={error}> {error} </li>)}</ul>
                );
                const rootElement = document.getElementById('post-response-errors');
                rootElement.classList.remove('display-none');
                ReactDOM.render(<ErrorsList />, rootElement);
            })
            .catch(error => console.log(error))
    }

    return (
        <div className={classes}>
            <p>{username}</p>
            <button
                onClick={handleClick} disabled={isDisabled}
                className={'follow-button'}>{text}
            </button>
        </div>
    )
}

export default FollowFinder;
