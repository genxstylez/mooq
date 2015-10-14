import _ from 'lodash';
import ChannelConstants from '../constants/ChannelConstants';
import BaseStore from './BaseStore';


class ChannelStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._channels = [];
        this._active_channel = {};
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case ChannelConstants.CHANNEL_JOIN:
                this._channels.push(action.channel);
                this._channels = _.union(this._channels);
                this.emitChange();
                break;

            case ChannelConstants.NEW_MESSAGE:
                let channel = _.filter(this._channels, {id: action.msgObj.channel})[0];
                if(_.has(channel, 'messages'))
                    channel.messages.push(action.msgObj)
                else
                    channel['messages'] = [action.msgObj];
                if(channel != this._active_channel)
                    channel['unread'] = true;
                this.emitChange();
                break;

            case ChannelConstants.CHANNEL_ACTIVE:
                action.channel.unread = false;
                this._active_channel = action.channel;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get_channel(id) {
        return _.filter(this._channels, {'id': id})
    }

    get channels() {
        return this._channels;
    }

    get active_channel()  {
        return this._active_channel;
    }

}
export default new ChannelStore()
