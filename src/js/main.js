import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import ChannelActions from './actions/ChannelActions';

let user_channels = [{id: 'test_channel', name: '1101 台泥'}, {id: 'test_channel1', name: 'APPL'}];

ChannelActions.join(user_channels);

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
            <Route name="channels" path="channels/:channelId/" component={App} />
        </Route>
    </Router>

), document.getElementById('main'));
