// notify.js

async function notify(obj) {
    window.dispatchEvent(new CustomEvent('notify', {
        detail: obj
    }));
}

export { notify }