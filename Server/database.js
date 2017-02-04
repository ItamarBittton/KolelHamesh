var DAL = {
    colels: [],
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
            id: '0',
            UserID: "1",
            Type: "הוספה",
            Requested: "2017-01-18T23:32:42.380Z",
            Status: undefined,
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
                accountName: "יוסקה",
                UserID: '1',
            }
        },
        {
            id: '1',
            UserID: "1",
            Type: "הוספה",
            Requested: "2017-01-18T23:32:42.380Z",
            Status: undefined,
            TableName: "students",
            Data: {
                firstName: "שמעון",
                lastName: "לוי",
                phone: "5770",
                id: "3",
                street: "מנחם בגין",
                house: "65",
                city: "פתח תקווה",
                bank: "1",
                branch: "2",
                account: "3",
                accountName: "שימי",
                UserID: '1',
            }
        }
    ],
    daily: [
        {
            studID: '5770',
            date: new Date(2017, 1, 19),
            late: 10,
            approval: false
        },
        {
            studID: '7894',
            date: new Date(2017, 1, 19),
            late: 0
        },
        {
            studID: '5770',
            date: new Date(2017, 1, 20),
            late: 10
        },
        {
            studID: '7894',
            date: new Date(2017, 1, 20),
            late: 0
        },
        {
            studID: '5770',
            date: new Date(2017, 1, 18),
            late: 10
        },
        {
            studID: '7894',
            date: new Date(2017, 1, 18),
            late: 0
        },
    ],
    presenceStatus : [
        {
            name: 'v',
            value: 0
        },
        {
            name: 'ח.מ',
            value: -1
        },
        {
            name: '5',
            value: 5
        },
        {
            name: '10',
            value: 10
        },
        {
            name: '15',
            value: 15
        },
        {
            name: '20',
            value: 20
        },
        {
            name: '25',
            value: 25
        },
        {
            name: '30',
            value: 30
        },
        {
            name: 'x',
            value: null
        },
    ],
}

var get = function (table, UserID) {
    return DAL[table].filter(function (value) {
        return (value.UserID === UserID || UserID === "0");
    });
}

var getByID = function (table, id) {
    return DAL[table].filter(function (value) {
        return (value.id === id);
    })[0];
 };

var add = function (table, object = {}) {
    var match = getByID(table || object.TableName, object.id);

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

var edit = function (table, object, id) {
    DAL[table][id] = object;
    return true
}

var count = function (table) {
    return DAL[table].length;
}
var getAll = function (table) {
    return DAL[table];
}

module.exports = {
    ADD: add,
    SUB: remove,
    UPD: edit,
    GET: get,
    COUNT: count,
    GETALL: getAll,
    getByID: getByID
};