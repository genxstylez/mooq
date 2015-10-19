import React from 'react'
import ReactDOM from 'react-dom'
import history from './history'
import { Router, Route, IndexRoute } from 'react-router'

import App from './components/App'
import Index from './components/Index'
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
                <IndexRoute component={Index} />
                <Route name="channels" path="channels/" component={Channel}>
                    <Route name="channels" path=":channelId/" component={Channel} />
                </Route>
                <Route name="login" path="login/" component={Login} />
                <Route name="signup" path="signup/" component={Signup} />
            </Route>

        </Router>

    ), document.getElementById('app'));
};

// Get user session before rendering.
UserService.get_session(render_react);
