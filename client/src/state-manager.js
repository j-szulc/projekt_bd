import {cookies} from './cookie-manager'
import axios from 'axios'

const rootMessenger = new EventTarget();

const send = (type,payload={}) => {
    let event = new CustomEvent(type,{detail: payload});
    rootMessenger.dispatchEvent(event);
}

const listen = (type,listener) => {
    rootMessenger.addEventListener(type,(e)=>listener(e.detail));
}

const changeRootState = (payload) => send("changeState",payload);

const logout = ()=>send("logout",{detail:{}});

async function checkCookies () {
    let res = await axios.get('/api/v1/validToken',{
        params: {
            token: cookies.get('token')
        }
    });
    console.log(res);
    if(!res.data.valid)
        changeRootState({page: "login"});
    return res.data.valid;
}

export {send,changeRootState, listen,checkCookies};