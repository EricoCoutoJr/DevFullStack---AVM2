function checkBody(keysAllowed,keysSent) {
    const keyNotAllowed = Object.keys(keysSent).filter(key => !(key in keysAllowed));
    if (keyNotAllowed.length>0) {
        return true
    }
}

module.exports = { checkBody }