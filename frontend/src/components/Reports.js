import React from "react";
import {Avatar} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import {getCookie} from "../GlobalFunctions";
import ReactDOM from "react-dom";
import SubmitButton from "./SubmitButton";


class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({newReport: ""});
    }

    handleNewReportChange = (e) => {
        this.setState({newReport: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('post', this.props.id);
        formData.append('content', this.state.newReport);

        const csrftoken = getCookie('csrftoken')

        fetch(
            '/api/report/', {
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
                    return this.props.history.push('/')
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
        return (
            <div className="report-card">

                <img className="report-image" src={this.props.image} alt=""/>

                <div className='report-content'>
                    <div className="report-header">
                        <Avatar
                            className="report-avatar"
                            alt={this.props.username}
                            src=""
                        />
                        <p className=''>{this.props.username}: {this.props.caption}</p>
                        <FontAwesomeIcon icon={faTimes} className='report-close ml-auto'
                                         onClick={this.props.handleDisableShowReport}/>
                    </div>

                    <form onSubmit={this.handleSubmit} className='report-form'>
                        <textarea value={this.state.newReport}
                                  onChange={this.handleNewReportChange}
                                  className='report-form-textarea'
                                  name="new-report"
                                  placeholder="Explain your reason for this report..."/>
                        <SubmitButton type='submit' text="Submit Report" classes='report-form-btn'/>
                        <div id={"post-response-errors"}/>
                    </form>
                </div>
            </div>
        )
    }
}


export default Reports;
