import React from 'react'
import { History } from 'react-router'
import UserStore from '../stores/UserStore'
import SemanticInput from '../components/SemanticInput'

export default React.createClass({
    mixins: [History],

    getInitialState() {
        return {
            is_authenticated: UserStore.is_authenticated
        }
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            is_authenticated: UserStore.is_authenticated
        })
    },

    handleLogin() {
        this.history.pushState(null, '/login/')
    },

    handleSignUp() {
        this.history.pushState(null, '/signup/')
    },

    handleSearch() {
        this.history.pushState(null, '/search/')
    },

    render() {
        return (
            <div id="index" className="background">
                <div className="ui top fixed menu">
                    <div className="right item">
                        <button className="ui button inverted borderless" onClick={this.handleLogin}>Sign in</button>
                        <button className="ui button inverted basic" onClick={this.handleSignUp}>Sign Up for free</button>
                    </div>
                </div>
                <div className="ui container">
                    <div className="logo">
                        <img src={STATIC_URL + 'img/logo.png'} />
                    </div>
                    <div className="description">
                        A messaging app where millionaires are born EVERYDAY!
                    </div>
                    <div className="ui inverted segment search-segment">
                        <div className="ui inverted large form">
                            <input placeholder="Enter Stock Symbol e.g. AAPL" onClick={this.handleSearch} />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <div className="copyright">&copy; {new Date().getFullYear()} APPSE</div>
                </div>
            </div>
        )
    }
})


//<h2>A beautiful index page {this.state.is_authenticated ? 'Logged in' : 'Guest' }</h2>
