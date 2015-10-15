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

            case ChannelConstants.GOT_HISTORY:
                var channel = _.filter(this._channels, {id: action.channel.id})[0];
                if(_.has(channel, 'messages'))
                    channel.messages.unshift(action.history[0])
                else
                    channel['messages'] = action.history[0]
                this.emitChange();
                break;

            case ChannelConstants.NEW_MESSAGE:
                var channel = _.filter(this._channels, {id: action.msgObj.channel})[0];
                if(_.has(channel, 'messages'))
                    channel.messages.push(action.msgObj)
                else
                    channel['messages'] = [action.msgObj];
                if(channel.id != this._active_channel.id) {
                    channel['unread'] = true;
                }
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
        return _.filter(this._channels, {'id': id})[0]
    }

    get channels() {
        return this._channels;
    }

    get active_channel()  {
        return this._active_channel;
    }

}
export default new ChannelStore()
