import React from "react";
import {Redirect, Route} from "react-router-dom";

class ProtectedRoute extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({isAuthenticated: nextProps.isAuthenticated});
        }
    }

    render() {
        const {isAuthenticated, redirect, ...props} = this.props;
        return (
            isAuthenticated ?
                <Route
                    {...props}
                /> :
                <Redirect to={redirect}/>
        )
    }
}

export default ProtectedRoute;