import React from 'react'
import ReactDOM from 'react-dom'
import i18n from 'i18next-client'
import history from './history'
import { Router, Route, IndexRoute } from 'react-router'
import RouterContainer from './RouterContainer'

import App from './components/App'
import Index from './components/Index'
import Channel from './components/Channel'
import Login from './components/Login'
import Signup from './components/Signup'
import Search from './components/Search'
import Privacy from './components/Privacy'
import UserService from './services/UserService'
import UserActions from './actions/UserActions'
import ChannelActions from './actions/ChannelActions'


var option = {
    resGetPath: STATIC_URL + 'locales/__lng__/__ns__.json',
    getAsync: false
}

i18n.init(option)
i18n.setLng('zh-TW')


let jwt = localStorage.getItem('jwt')
if (jwt)
    UserActions.login(jwt)
else
    UserActions.create_guest()

let router = (
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={Index} />
            <Route name="channels" path="channels/" component={Channel}>
                <Route name="channels" path=":channelId/" component={Channel} />
            </Route>
            <Route name="search" path="search/" component={Search} />
            <Route name="login" path="login/" component={Login} />
            <Route name="signup" path="signup/" component={Signup} />
            <Route name="privacy" path="privacy/" component={Privacy} />
        </Route>
    </Router>
)

RouterContainer.set(router)

ReactDOM.render((router), document.getElementById('app'));
