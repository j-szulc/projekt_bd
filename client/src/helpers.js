
const isDefined = (x) => (typeof x != "undefined")

const minutesToStr = (min) => (min/60|0).toString().padStart(2,"0") + ":" + (min%60).toString().padStart(2,"0");

export {isDefined,minutesToStr};