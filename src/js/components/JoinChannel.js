import React from 'react'
import UserStore from '../stores/UserStore'

export default React.createClass({
    getInitialState() {
        return {
            is_authenticated: UserStore.is_authenticated
        }
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnMount() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            is_authenticated: UserStore.is_authenticated
        })
    },

    render() {
        return (
            <h2>A List of Channels</h2>
        )
    }
})