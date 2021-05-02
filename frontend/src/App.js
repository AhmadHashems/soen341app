import React, {useCallback, useState} from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Feed from './components/Feed';
import ReportFeed from "./components/ReportFeed";
import PostForm from './components/PostForm';
import FollowFinder from './components/FollowFinder';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import {BrowserRouter as Router, Switch} from 'react-router-dom';


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const wrapperSetIsAuthenticated = useCallback(auth => {
        setIsAuthenticated(auth);
    }, [setIsAuthenticated, ]);

    return (
        <Router>
            <div className="app">
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={wrapperSetIsAuthenticated}/>
                <div className="container">
                    <Switch>
                        <ProtectedRoute path="/login" component={LoginForm} isAuthenticated={!isAuthenticated} redirect={'/feed'} />
                        <ProtectedRoute path="/register" component={RegisterForm} isAuthenticated={!isAuthenticated} redirect={'/feed'} />
                        <ProtectedRoute path="/feed" component={Feed} isAuthenticated={isAuthenticated} redirect={'/login'} />
                        <ProtectedRoute path="/post" component={PostForm} isAuthenticated={isAuthenticated} redirect={'/login'}  />
                        <ProtectedRoute path="/follow" component={FollowFinder} isAuthenticated={isAuthenticated} redirect={'/login'}  />
                        <ProtectedRoute path="/report" component={ReportFeed} isAuthenticated={isAuthenticated} redirect={'/login'}  />
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;