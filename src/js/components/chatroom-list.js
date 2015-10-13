import React from 'react';
import ChatroomItem from './chatroom-item';

export default React.createClass({
    render() {
        return (

                <div className="ui list">
                    <h5 className="ui header">Top 5 Stocks</h5>
                    <ChatroomItem name="top 1" />
                    <ChatroomItem name="top 2" />
                    <ChatroomItem name="top 3" />
                    <ChatroomItem name="top 4" />
                    <ChatroomItem name="top 5" />
                </div>
                <div className="ui list">
                    <h5 className="ui header">Your Stocks</h5>
                    <ChatroomItem name="1101 中鋼"/>
                    <ChatroomItem name="2202 台積電"/>
                    <ChatroomItem name="APPL"/>
                    <ChatroomItem name="GOOG"/>
                    <ChatroomItem name="MSFT"/>
                </div>
            )

    }
})