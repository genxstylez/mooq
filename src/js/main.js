import React from 'react'
import ReactDOM from 'react-dom'
import history from './history'
import { Router, Route } from 'react-router'

import App from './components/App'
import Channel from './components/Channel'
import Login from './components/Login'
import Signup from './components/Signup'
import UserService from './services/UserService'
import UserActions from './actions/UserActions'
import ChannelActions from './actions/ChannelActions'


let jwt = localStorage.getItem('jwt')
if (jwt)
    UserActions.login(jwt)

var render_react = () => {
    ReactDOM.render((
        <Router history={history}>
            <Route path="/" component={App}>
                <Route name="channels" path="channels/:channelId/" component={Channel} />
                <Route name="login" path="login/" component={Login} />
                <Route name="signup" path="signup/" component={Signup} />
            </Route>

        </Router>

    ), document.getElementById('app'));
};

// Get user session before rendering.
UserService.get_session(render_react);
