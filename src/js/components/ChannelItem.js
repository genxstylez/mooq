import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import classnames from 'classnames';
import SetIntervalMixin from '../mixins/SetIntervalMixin';

import request from 'superagent';


export default React.createClass({
    mixins: [SetIntervalMixin],

    getInitialState() {
        return {
            messages: this.props.messages,
            occupancy: this.props.occupancy || 0,
            users: this.props.users || [],
            price: 0
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
        /* HACK for render callback
        var node = ReactDOM.findDOMNode(this);
        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        }, 1000);
        */
        this.setInterval(this._getStock, 5000, true);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate() {
        var node = ReactDOM.findDOMNode(this.refs.messages);
        $(node).animate({ scrollTop: node.scrollHeight }, 'slow');
    },

    _onChange() {
        this.setState({
            messages: ChannelStore.get_channel(this.props.id).messages,
            occupancy: ChannelStore.get_channel(this.props.id).occupancy,
            users: ChannelStore.get_channel(this.props.id).users
        });
    },

    handleHeightChange(height) {
        let node = ReactDOM.findDOMNode(this.refs.messages) ;
        height = height + 20 // 20 is the padding for footer
        node.style.bottom = height.toString() + 'px';
        node.scrollTop = node.scrollHeight;

    },

    _getStock() {
        request
            .get('http://www.google.com/finance/info?q=NASDAQ:AAPL')
            .end((err, res) => {
                var response = res.text.trim().replace('/', '').replace('/', '')
                response = JSON.parse(response)[0];
                this.setState({
                    price: response.l
                })
            })
            /* YAHOO finance api delay about 20 mins
            .get('https://query.yahooapis.com/v1/public/yql')
            .query('q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%22AAPL%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
            .end((err, res) => {
                var response = JSON.parse(res.text);
                console.log(response);
                this.setState({
                    price: response['query']['results']['quote']['Ask']
                });
            })

            */
            /*
        request.get('http://mis.twse.com.tw/stock/index.jsp')
            .type('application/json')
            .withCredentials()
            .set({'X-DevTools-Emulate-Network-Conditions-Client-Id': '308DBF43-EDDA-425B-AC7D-5969B1A15BA1'})
            .end((err, res) => {
            request.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp')
                .query('ex_ch=otc_2233.tw&json=1&delay=0')
                .end((err, res) => {
                    console.log(res.text);
                    var response = JSON.parse(res.text);
                    console.log(response);
                });
        })
        */


    },

    handleHereNow() {
        let dimmer = ReactDOM.findDOMNode(this.refs.dimmer);
        $(dimmer).dimmer('show');
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            channel: true
        })
        return (
            <div className={cls}>
                <div className="messages" ref="messages">
                    <div className="ui feed">
                        {_.map(this.state.messages, (message) => {
                            return (
                                <MessageItem key={message.timestamp} message={message}  />
                            );
                        })}
                    </div>
                </div>
                 <div className="footer">
                    <MessageInput id={this.props.id} onHeightChange={this.handleHeightChange} />
                </div>
            </div>

        )
    }
});