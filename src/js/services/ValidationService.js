import _ from 'lodash';
import request from 'superagent-bluebird-promise';

export default {
    validate_password(password) {
        // at least one number, one lowercase and one uppercase letter
        // at least eight characters
        let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return re.test(password);
    },

    validate_username(username, okCb, errCb, invalidCb) {
        let re = /^[\w]{4,30}$/
        if (re.test(username))
            return request
                .get(Urls['api-check-username']())
                .query({username: username})
                .end((err, res) => {
                    res.ok ? okCb() : errCb()
                })
        else
            invalidCb()
    },

    validate_email(email, okCb, errCb, invalidCb) {
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if(re.test(email))
            return request
                .get(Urls['api-check-email']())
                .query({email: email})
                .end((err, res) => {
                    res.ok ? okCb() : errCb()
                })
        else
            invalidCb()
    },
}