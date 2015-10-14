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

    join_subscribed(channels) {
        pubnub.subscribe({
            channel: _.pluck(channels, 'id'),
            message: function(msgObj) {
                ChannelActions.new_message(msgObj)
            },
            error: function(error) {
                console.log(JSON.stringify(error));
            },
            restore: true,
            connect: ChannelActions.join(channels)
        });
    }

    get_history(channel, count, timetoken) {
        pubnub.history({
            channel: channel.id,
            start: timetoken,
            count: count || 100,
            callback: (history) => {
                ChannelActions.got_history(channel, history)
                console.log(history);
            }
        });
    }

}

export default new ChannelService()