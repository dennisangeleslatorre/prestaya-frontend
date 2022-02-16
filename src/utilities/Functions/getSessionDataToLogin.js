import axios from 'axios';

const getOS = () => {
    let osName = "Unknown OS";
    if (navigator.userAgent.indexOf("Win") != -1) osName = "Windows";
    if (navigator.userAgent.indexOf("Mac") != -1) osName = "Macintosh";
    if (navigator.userAgent.indexOf("Linux") != -1) osName = "Linux";
    if (navigator.userAgent.indexOf("Android") != -1) osName = "Android";
    if (navigator.userAgent.indexOf("like Mac") != -1) osName = "iOS";
    return osName;
}

const getBrowser = () => {
    var browserName = (
        function (agent) {        switch (true) {
        case agent.indexOf("edge") > -1: return "MS Edge";
        case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
        case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
        case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
        case agent.indexOf("trident") > -1: return "MS IE";
        case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
        case agent.indexOf("safari") > -1: return "Safari";
        default: return "other";
    }
    })(window.navigator.userAgent.toLowerCase());
    return browserName;
}

const getPublicIp = async () => {
    const jsonResult = axios({
        method: 'get',
        url: 'https://ipapi.co/json/',
    }).then(res => {
        return res.data;
    })
    .catch((error) => {
        console.log("Error", error);
    });
    return jsonResult;
}

const getSessionDataToLogin = async () => {
    const osName = getOS();
    const browserName = getBrowser();
    const dataConnection = await getPublicIp();
    return `Browser: ${browserName} - Operating system: ${osName} - ip: ${dataConnection.ip} - location: ${dataConnection.country_name}/${dataConnection.region}`;
}

export {
    getSessionDataToLogin
}