// Merge two objects with conflicts resolved by the new object.


var styles = {
    multiCentered: {
        alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }
    },
    regularBorder: {
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    },
    header: {
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } }, 
        fill: { type: 'solid', pattern: 'lightGray' }
    }
}

module.exports = function(array) {
        var result = ""

        array.forEach(function (name) {
            result += styles[name] ? JSON.stringify(styles[name]) : '';
        });

        return JSON.parse(result.replace(/\}\{/, ", "));
    };