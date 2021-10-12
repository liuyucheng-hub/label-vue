function getX(event) {
    if (event === null || event === undefined || !(event instanceof MouseEvent)) {
        throw 'event must MouseEvent';
    }
    return event.offsetX;
}

function getY(event) {
    if (event === null || event === undefined || !(event instanceof MouseEvent)) {
        throw 'event must MouseEvent';
    }
    return event.offsetY;
}

export {
    getX,
    getY
}