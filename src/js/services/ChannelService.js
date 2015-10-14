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

}

export default new ChannelService()