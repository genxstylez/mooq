import React from 'react';
import ReactDOM from 'react-dom';
import ChatroomItem from './chatroom-item';
import Avatar from './avatar';

export default React.createClass({
    ClickMobileMenu() {
       let sidebar = ReactDOM.findDOMNode(this.refs.sidebar)
       $(sidebar).sidebar('toggle');
    },
    render() {
        return (
            <div className="full height">
                <div id="profile-container">
                    <div className="ui sidebar vertical grid menu profile-menu" ref="sidebar">
                        <Avatar />
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
                    </div>
                    <div id="profile-menu" className="ui vertical menu grid profile-menu">
                        <Avatar />
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
                    </div>
                </div>
                <div id="messages-container">
                    <div className="ui top fixed menu">
                        <a className="icon item" id="mobile-menu" onClick={this.ClickMobileMenu}>
                            <i className="content icon"></i>
                        </a>
                        <div className="item">
                            <h2 className="ui header">#1101 中鋼</h2>
                        </div>
                        <div className="right menu">
                            <div className="item">
                                <i className="users icon"></i>10
                            </div>
                        </div>
                    </div>
                    <div id="footer">
                        <div className="ui form">
                            <div className="field">
                                <textarea rows="1" />
                            </div>
                        </div>
                    </div>
                    <div id="messages">
                        <div className="ui feed">
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        <a className="user">
                                            Elliot Fu
                                        </a> added you as a friend
                                        <div className="date">
                                        1 Hour Ago
                                        </div>
                                    </div>
                                    <div className="meta">
                                        <a className="like">
                                            <i className="like icon"></i> 4 Likes
                                        </a>
                                    </div>
                                </div>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
});