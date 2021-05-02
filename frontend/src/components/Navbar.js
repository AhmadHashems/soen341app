import React, {useLayoutEffect} from 'react';
import SubmitButton from './SubmitButton';
import LogoutForm from './LogoutForm';
import {Link, useLocation} from 'react-router-dom';
import {getIsAuthenticated} from "../GlobalFunctions";


function Navbar(props) {

    const location = useLocation()

    useLayoutEffect(() => {
        getIsAuthenticated((data => {
            props.setIsAuthenticated(data);
        }));
    }, [location, props]);

    return (
        <div className="navbar-container">
            <div className="navbar">
                <Link to="/feed" className="logo mr-auto">
                    SnowFlake
                </Link>
                {props.isAuthenticated ? (
                    <div className="user-status ml-auto">
                        <Link to="/post">
                            <SubmitButton text='New Post'/>
                        </Link>
                        <Link to="/follow">
                            <SubmitButton text='Follow Finder'/>
                        </Link>
                        <LogoutForm/>
                    </div>
                ) : (
                    <div className="user-status ml-auto">
                        <Link to="/login">
                            <SubmitButton text='Login'/>
                        </Link>
                        <Link to="/register">
                            <SubmitButton text='Register'/>
                        </Link>
                    </div>
                )
                }
            </div>
        </div>
    );
}

export default Navbar;
