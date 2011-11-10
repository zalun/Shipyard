/*global process: true, window: true, navigator: true, document:true*/
var isNode = typeof process !== 'undefined',
    isBrowser = typeof window !== 'undefined',
    platform = {},
    browser = {};

if (isNode) {
    platform.name = process.title;
    platform.version = process.version;
    browser.name = 'jsdom';
    browser.version = '0.2';

} else if (isBrowser) {
    var ua = navigator.userAgent.toLowerCase(),
        platform_ = navigator.platform.toLowerCase(),
        UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
        mode = UA[1] === 'ie' && document.documentMode;

    platform.name = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0];

    browser.name = (UA[1] === 'version') ? UA[3] : UA[1];
    browser.vesion = mode || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2]);
}


browser[browser.name] = true;
browser[browser.name + parseInt(browser.version, 10)] = true;
platform[platform.name] = true;


var env = module.exports = {
    
    platform: platform,

    browser: browser

};

