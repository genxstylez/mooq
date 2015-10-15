import KeyMirror from 'keymirror';

export default KeyMirror({
    CHANNEL_JOIN: null,
    CHANNEL_LEAVE: null,
    CHANNEL_ACTIVE: null,
    CREATE_NEW_MESSAGE: null,
    RECV_NEW_MESSAGE: null,
    GOT_HISTORY: null,
    API_URL: 'http://localhost:8000/api/channels',
})