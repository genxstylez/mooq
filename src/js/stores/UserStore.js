import _ from 'lodash';
import BaseStore from './BaseStore';

class UserStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = {
                username: 'genxstylez',
                channels: [{id: 'test_channel', name: '1101 台泥'}, {id: 'test_channel1', name: 'APPL'}]
            };
    }

    _registerToActions() {
        return;
    }

    get user() {
        return this._user;
    }
}

export default new UserStore()