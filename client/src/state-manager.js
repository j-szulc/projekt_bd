
const rootMessenger = new EventTarget();

const send = (type,payload={}) => {
    let event = new CustomEvent(type,{detail: payload});
    rootMessenger.dispatchEvent(event);
}

const listen = (type,listener) => {
    rootMessenger.addEventListener(type,(e)=>listener(e.detail));
}

const changeRootState = (payload) => send("changeState",payload);

export {send,changeRootState, listen};