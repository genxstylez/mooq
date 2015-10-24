import KeyMirror from 'keymirror';

export default KeyMirror({
    CHANNEL_JOIN: null,
    CHANNEL_LEAVE: null,
    CHANNEL_ACTIVE: null,
    CREATE_NEW_MESSAGE: null,
    RECV_MESSAGE: null,
    RECV_PRESENCE: null,
    RECV_HISTORY: null,
    GOT_TOP_CHANNELS: null,
    GOT_HERE_NOW: null,

    API_URL: 'http://localhost:8000/api/channels',
})