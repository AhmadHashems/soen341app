import React from "react";
import {Avatar} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import {getCookie} from "../GlobalFunctions";
import ReactDOM from "react-dom";
import SubmitButton from "./SubmitButton";


class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({newComment: ""});
    }

    handleNewCommentChange = (e) => {
        this.setState({newComment: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('post', this.props.id);
        formData.append('content', this.state.newComment);

        const csrftoken = getCookie('csrftoken')

        fetch(
            '/api/comment/', {
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
                    this.setState({newComment: ""});
                    const commentsContainer = document.getElementById("comments-comment-container");
                    this.props.comments.push(data.comment);
                    const updatedComments =
                        this.props.comments.map((comment) => {
                            return (
                                <Comment username={comment.username} comment={comment.content}/>
                            )
                        })
                    ReactDOM.render(updatedComments, commentsContainer);
                    return;
                }
                const ErrorsList = () => (
                    <ul>{data.errors.map(error => <li key={error}> {error} </li>)}</ul>
                );
                const rootElement = document.getElementById("post-response-errors");
                ReactDOM.render(<ErrorsList/>, rootElement);
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="comments-card">

                <img className="comments-image" src={this.props.image} alt=""/>

                <div className='comments-content'>
                    <div className="comments-header">
                        <Avatar
                            className="comments-avatar"
                            alt={this.props.username}
                            src=""
                        />
                        <p className=''>{this.props.username}</p>
                        <FontAwesomeIcon icon={faTimes} className='comments-close ml-auto'
                                         onClick={this.props.handleDisableShowComments}/>
                    </div>

                    <div id='comments-comment-container'>
                        {this.props.comments.map((comment) => {
                            return (
                                <Comment username={comment.username} comment={comment.content}/>
                            )
                        })}
                    </div>

                    <form onSubmit={this.handleSubmit} className='comments-form'>
                        <textarea value={this.state.newComment}
                                  onChange={this.handleNewCommentChange}
                                  className='comments-form-textarea'
                                  name="new-comment"
                                  placeholder="Add a new comment to this post..."/>
                        <SubmitButton type='submit' text="Add Comment" classes='comments-form-btn'/>
                        <div id={"post-response-errors"}/>
                    </form>
                </div>
            </div>
        )
    }
}

function Comment({username, comment}) {

    return (
        <div className='comment-box'>
            <Avatar
                className="comment-avatar"
                alt={username}
                src=""
            />
            <div className='mr-auto'>
                <p className='comment-box-username'>{username}</p>
                <p className='comment-box-text'>{comment}</p>
            </div>
        </div>
    )
}

export default Comments;
