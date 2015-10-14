import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
            <Route name="channels" path="channels/:channelId/" component={App} />
        </Route>
    </Router>

), document.getElementById('main'));
