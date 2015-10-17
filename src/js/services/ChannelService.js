import _ from 'lodash';
import when from 'when';
import request from 'superagent-bluebird-promise';
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

    async_get_channel_info(channel_id) {
        return request
            .get(Urls['channels-detail'](channel_id))
            .promise()
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

    join_channels(channels) {
        pubnub.subscribe({
            channel: _.pluck(channels, 'id'),
            message: (msgObj) => {
                ChannelActions.recv_new_message(msgObj);
            },
            error: function(error) {
                alert('error join channel, please try again!');
                console.log(JSON.stringify(error));
            },
            restore: true,
            heartbeat: 10,
            connect: ChannelActions.joined_channels(channels)
        });
    }

    get_history(channel_id, cb, count, timetoken) {
        pubnub.history({
            channel: channel_id,
            start: timetoken,
            count: count || 100,
            callback: (history) => {
                ChannelActions.got_history(channel_id, history, timetoken);
            }
        });
    }

    get_here_now() {
        pubnub.here_now({
            callback: (Obj) => {
                ChannelActions.got_here_now(Obj);
            }
        })
    }

}

export default new ChannelService()