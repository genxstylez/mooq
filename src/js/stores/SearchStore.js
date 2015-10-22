import _ from 'lodash';
import ChannelConstants from '../constants/ChannelConstants';
import BaseStore from './BaseStore';


class SearchStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this))
        this._channels = []
    }

    _registerToActions(action) {
        switch(action.actionType) {
            default:
                break
        }
    }

    get channels() {
        return this._channels
    }
}
