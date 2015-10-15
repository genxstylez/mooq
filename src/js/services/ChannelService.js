import _ from 'lodash';
import request from 'superagent';
import ChannelActions from '../actions/ChannelActions';
import ChannelConstants from '../constants/ChannelConstants';

class ChannelService {
    all() {
        /*
        request
            .get(ChannelConstants.API_URL)
            .end(function(err, res) {
                console.log(res);
            });
        */

    }

    create_message(channel_id, username, text, cb) {
        pubnub.publish({
            channel: channel_id,
            message: {
                text: text,
                username: username,
                timestamp: Date.now(),
                channel: channel_id
            },
            callback: (message) => {
                cb(channel_id, message)
            }
        });
    }

    join_channels(channels, msgCb, ConnectCb) {
        pubnub.subscribe({
            channel: _.pluck(channels, 'id'),
            message: (msgObj) => {
                msgCb(msgObj)
            },
            error: function(error) {
                console.log(JSON.stringify(error));
            },
            restore: true,
            connect: ConnectCb()
        });
    }

    get_history(channel_id, cb, count, timetoken) {
        pubnub.history({
            channel: channel_id,
            start: timetoken,
            count: count || 100,
            callback: (history) => {
                cb(channel_id, history, timetoken);
            }
        });
    }

}

export default new ChannelService()