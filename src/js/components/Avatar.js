import React from 'react'
import ReactDOM from 'react-dom'
import UserService from '../services/UserService'
import {t as __} from 'i18next-client'

export default React.createClass({
    getInitialState() {
        return {
            is_authenticated: this.props.is_authenticated,
            user: this.props.user
        }
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.dropdown)).dropdown()
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.state) {
            this.setState({...nextProps})
        }
    },

    handleSignout() {
        UserService.logout()
    },

    render() {
        return (
            <div id="avatar">
                {this.state.is_authenticated ?
                    <span className="ui dropdown" ref="dropdown">
                        <img className="ui avatar image" src={this.props.avatar} />
                        <span className="username">{this.props.username}</span>
                        <i className="chevron up icon" />
                        <div className="menu transition hidden">
                            <div className="item" onClick={this.handleSignout}>
                                <i className="sign out icon link" />{__('Sign out')}
                            </div>
                        </div>
                    </span>
                    : null
                }
            </div>
        )
    }
})