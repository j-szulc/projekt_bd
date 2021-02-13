
const isDefined = (x) => (typeof x != "undefined")

const minutesToStr = (min) => (min/60|0).toString() + ":" + (min%60).toString();

export {isDefined,minutesToStr};