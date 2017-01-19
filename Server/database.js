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
        // {
        //     UserID: '1',
        //     Type: 'הוספה',           // OPTIONS: הוספה, עדכון, מחיקה
        //     Requested: '',         // Date and Time
        //     Approved: '',          // Date and Time
        //     TableName: 'students', // OPTIONS: students, colel
        //     Data: ''
        // },
        {
            RecomendID: '0',
            UserID: "1",
            Type: "הוספה",
            Requested: "2017-01-18T23:32:42.380Z",
            TableName: "students",
            Data: {
                firstName: "יוסי",
                lastName: "כהן",
                phone: "5770",
                id: "3",
                street: "רבי יהודה הנשיא",
                house: "51",
                city: "פתח תקווה",
                bank: "1",
                branch: "2",
                account: "3",
                accountName: "יוסקה"
            }
        },
        {
            RecomendID: '1',
            UserID: "1",
            Type: "הוספה",
            Requested: "2017-01-18T23:32:42.380Z",
            TableName: "students",
            Data: {
                firstName: "שמעון",
                lastName: "לוי",
                phone: "5770",
                id: "5",
                street: "מנחם בגין",
                house: "65",
                city: "פתח תקווה",
                bank: "1",
                branch: "2",
                account: "3",
                accountName: "שימי"
            }
        }
    ],
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

var count = function (table) {
    return DAL[table].length;
}

module.exports = {
    ADD: add,
    SUB: remove,
    UPD: edit,
    GET: get,
    COUNT: count
};