import React from 'react';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Main from './pages/main/Main';
import {Switch, Route, Redirect} from 'react-router-dom';

export default function useRoutes(isAuthenticated) {
    if(isAuthenticated) {
        return(
            <Switch>
                <Route path="/main" component={Main} exact/>
                <Redirect to="main"/>
            </Switch>
        );
    } 

    return(
        <Switch>
            <Route path="/login" component={Login} exact/>
            <Route path="/register" component={Register} exact/>
            <Redirect to="login"/>
        </Switch>
    );
}