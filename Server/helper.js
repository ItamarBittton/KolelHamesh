// Merge two objects with conflicts resolved by the new object.
function merge(oldObj, newObj) {
    return JSON.parse((JSON.stringify(oldObj) + JSON.stringify(newObj)).replace(/\}\{/, ", "));
};

module.exports = {
    merge, merge
};