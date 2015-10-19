export default {
    componentDidMount() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '860499974063343',
                xfbml      : true,
                version    : 'v2.4'
            });
            FB.getLoginStatus(function(response) {
                this.statusChangeCallback(response);
            }.bind(this))
        }.bind(this)
    },

    componentWillMount() {
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    },
}