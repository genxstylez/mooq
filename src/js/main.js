import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import ChannelActions from './actions/ChannelActions';

import UserStore from './stores/UserStore';

let user = UserStore.user;

ChannelActions.join(user.channels);

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
            <Route name="channels" path="channels/:channelId/" component={App} />
        </Route>
    </Router>

), document.getElementById('main'));
