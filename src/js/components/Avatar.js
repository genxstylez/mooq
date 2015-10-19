import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import UserService from '../services/UserService'

export default React.createClass({
    getInitialState() {
        return {
            is_authenticated: this.props.is_authenticated,
            user: this.props.user
        }
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
                        <span>
                            <span className="username overflow_ellipsis">{this.props.username}</span>
                            <i className="sign out icon link" onClick={this.handleSignout}></i>
                        </span>
                    : <Link to='/login'>Please Log in</Link>
                    }

                </div>
            )
    }
})