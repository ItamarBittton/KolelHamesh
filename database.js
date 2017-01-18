var DAL = {
    students: [
        {
            firstName: 'שוקי',
            lastName: 'גור',
            phone: '770',
            id: '5770',
            street: 'רבי יהודה הנשיא',
            house: '51',
            city: 'PT',
            bank: '1',
            branch: '2',
            account: '3',
            accountName: 'שוקי',
            UserID: '1',
        },
        {
            firstName: 'איתמר',
            lastName: 'ביטון',
            phone: '456',
            id: '7894',
            street: 'מנחם בגין',
            house: '65',
            city: 'PT',
            bank: '5',
            branch: '8',
            account: '78',
            accountName: 'Itamar',
            UserID: '2',
        }
    ],
    recomends: [
        {
            UserID: '1',
            Type: 'הוספה',           // OPTIONS: הוספה, עדכון, מחיקה
            Requested: '',         // Date and Time
            Approved: '',          // Date and Time
            TableName: 'students', // OPTIONS: students, colel
            Data: ''
        }
    ]
}

var get = function (table, UserID) {
    return DAL[table].filter(function (value) {
        return (value.UserID === UserID || UserID === 0);
    });
}

var add = function (table, object = {}) {
    var match = DAL[table].filter(function (value) {
        return (value.id === object.id);
    })[0];

    if (match && match.id) {
        return false
    } else {
        DAL[table].push(object);
        return true
    }
}

var remove = function (table, id) {
    DAL[table][id] = undefined;
}

var edit = function (table, id, object) {
    DAL[table][id] = object;
}

module.exports = {
    ADD: add,
    SUB: remove,
    UPD: edit,
    GET: get
};