// // Merge two objects with conflicts resolved by the new object.


// var styles = {
//     multiCentered: {
//         alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }
//     },
//     regularBorder: {
//         alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' },
//         border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
//     },
//     header: {
//         border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } }
//     }
// }

// module.exports = function(array) {
//         var result = ""

//         array.forEach(function (name) {
//             result += styles[name] ? JSON.stringify(styles[name]) : '';
//         });

//         return JSON.parse(result.replace(/\}\{/, ", "));
//     };