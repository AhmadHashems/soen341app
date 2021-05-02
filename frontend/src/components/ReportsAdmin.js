import React from "react";
import {Avatar} from "@material-ui/core";
import '../App.css';
import {getCookie} from "../GlobalFunctions";
import ReactDOM from "react-dom";
import SubmitButton from "./SubmitButton";


class ReportsAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({newReport: ""})
        this.dismissReport = this.dismissReport.bind(this);
    };

    deletePost = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', this.props.id);

        const csrftoken = getCookie('csrftoken')

        fetch('/api/feed/', {
            method: 'DELETE',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    return this.push('/report');
                }
                const ErrorsList = () => (
                    <ul>{data.errors.map(error => <li key={error}> {error} </li>)}</ul>
                );
                const rootElement = document.getElementById("post-response-errors");
                ReactDOM.render(<ErrorsList/>, rootElement);
            })
            .catch(error => console.log(error))
    }


    dismissReport = (id) => {
        const formData = new FormData();
        formData.append('id', id);

        const csrftoken = getCookie('csrftoken')

        fetch('/api/report/', {
            method: 'DELETE',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    return this.props.history.push('/report');
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
            <div className="report-card">

                <img className="report-image" src={this.props.image} alt=""/>

                <div className='report-content'>
                    <div className="report-header">
                        <SubmitButton type='submit' text="Delete Post" classes='report-form-btn'
                                      onClick={this.deletePost}/>
                    </div>


                    <div id='reports-report-container'>
                        {this.props.reports.map((reports) => {
                            return (
                                <Report id={reports.id} report={reports.content} username={reports.username}
                                        handleDismissReport={this.dismissReport}/>
                            )
                        })}
                    </div>

                </div>
            </div>
        )
    }
}

function Report({report, username, id, handleDismissReport}) {

    return (
        <div className='report-box'>
            <Avatar
                className="report-avatar"
                alt={username}
                src=""
            />
            <div className='mr-auto'>
                <p className='report-box-username'>{username}</p>
                <p className='report-box-text'>Content: {report}</p>
                <SubmitButton type='submit' text="Dismiss" classes='report-form-btn'
                              onClick={() => handleDismissReport(id)}/>

            </div>
        </div>
    )
}

export default ReportsAdmin;
