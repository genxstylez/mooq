import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route } from 'react-router';

import App from './components/App';
import UserService from './services/UserService';
import UserActions from './actions/UserActions';
import ChannelActions from './actions/ChannelActions';


var render_react = () => {
    ReactDOM.render((
        <Router history={createBrowserHistory()}>
            <Route path="/" component={App}>
                <Route name="channels" path="channels/:channelId/" component={App} />
            </Route>
        </Router>

    ), document.getElementById('app'));
};

// Get user session before rendering.
UserService.get_session(render_react);
