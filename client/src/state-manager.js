
const rootMessenger = new EventTarget();

const redirect = (target) => {
    let event = new CustomEvent("redirect",{detail: target});
    rootMessenger.dispatchEvent(event);
}

const listen = (listener) => {
    rootMessenger.addEventListener("redirect",(e)=>{
        listener(e.detail)
    });
}

export {redirect, listen};