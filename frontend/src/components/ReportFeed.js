import React from 'react';
import Modal from 'react-modal';
import {Avatar, Grid} from "@material-ui/core";
import ReportsAdmin from './ReportsAdmin';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import '../App.css';

class ReportFeed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postData: [],
            showReportsModal: false,
            reportsModalState: {
                postId: '',
                postUsername: '',
                postImage: '',
                reportData: [],
            },
            isError: false,
            errors: '',
        }

        this.enableShowReportsModal = this.enableShowReportsModal.bind(this);
        this.disableShowReportsModal = this.disableShowReportsModal.bind(this);
        this.fetchPosts = this.fetchPosts.bind(this);
    };

    enableShowReportsModal = (postId, postUsername, postImage, reportData) => {
        const newReportsModalState = {
            ...this.state.reportsModalState, postId: postId, postUsername: postUsername,
            postImage: postImage, reportData: reportData
        };
        this.setState({reportsModalState: newReportsModalState});
        this.setState({showReportsModal: true});
    }

    disableShowReportsModal = () => {
        this.setState({showReportsModal: false});
    }

    fetchPosts() {
        fetch('/api/report/', {
            method: 'GET',
            headers: {'content-type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if (data.errors === null || data.errors === undefined) {
                    this.setState({postData: data})
                } else {
                    this.setState({isError: true});
                    this.setState({errors: data.errors});
                }
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.fetchPosts()
    }

    render() {
        const posts = this.state.postData
        if (this.state.isError) {
            return (<h1>{this.state.errors}</h1>)
        } else {
            return (
                <div>

                    <Grid
                        id="feed-grid"
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="center">

                        {posts.map((post, index) => {
                            return (
                                <Post id={post.id} username={post.username} caption={post.caption}
                                      image={post.image} report={post.reports}
                                      handleEnableShowReports={this.enableShowReportsModal}
                                      key={index}/>
                            )
                        })}
                    </Grid>
                    <Modal
                        isOpen={this.state.showReportsModal}
                        contentLabel="Post Reports Section"
                        shouldCloseOnOverlayClick={true}
                        shoudCloseOnEsc={true}
                        className='modal-container'
                        onRequestClose={this.disableShowReportsModal}
                    >
                        <ReportsAdmin id={this.state.reportsModalState.postId}
                                      username={this.state.reportsModalState.postUsername}
                                      image={this.state.reportsModalState.postImage}
                                      reports={this.state.reportsModalState.reportData}
                                      handleDisableShowReports={this.disableShowReportsModal}
                        />
                    </Modal>
                </div>
            )
        }
    }
}

function Post({id, username, caption, image, report, handleEnableShowReports, index}) {
    return (
        <div className="post-card" key={index}>
            <div className="post-header">
                <Avatar
                    className="post-avatar"
                    alt={username}
                    src=""
                />
                <p className="post-username">{username}</p>
            </div>
            <img className="post-image" src={image} alt=""/>
            <div className='post-bottom-section'>
                <p className='post-text mr-auto'><strong>{username}:</strong> {caption}</p>
                <FontAwesomeIcon icon={faExclamationCircle} className='post-reports-button ml-auto'
                                 onClick={() => handleEnableShowReports(id, username, image, report)}/>
            </div>
        </div>
    )
}

export default ReportFeed;


