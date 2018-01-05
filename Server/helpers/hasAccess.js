module.exports = {
    allowed: canAccess,
    isUser: isUser,
    isAdmin: isAdmin,
    dailyAccess: dailyAccess,
    prevMonthAccess: prevMonthAccess,
    currentMonth: currentMonth,
    beforeTenth: beforeTenth,
    isPrevMonth: isPrevMonth
};

// Check if the user can update or view the data for this day.
function canAccess(user, selectedDate) {
    var today = new Date();

    return this.isAdmin(user) || (this.isUser(user) && (
        this.dailyAccess(user, today, selectedDate) ||
        this.prevMonthAccess(user, today, selectedDate) ||
        this.currentMonth(today, selectedDate) ||
        this.beforeTenth(today, selectedDate)
    ));
}

function isUser(user) {
    return user.permission === 'User';
}

function isAdmin(user) {
    return user.permission === 'Admin';
}

function currentMonth(today, selectedDate) {
    // Not === Because comparing string to int.
    return selectedDate[1] == (today.getMonth() + 1);
}

function beforeTenth(today, selectedDate) {
    return this.isPrevMonth(today, selectedDate) && today.getDate() <= 10;
}

function dailyAccess(user, today, selectedDate) {
    // Not === Because comparing string to int.
    return user.is_only_daily && selectedDate[2] == today.getDate();
}

function prevMonthAccess(user, today, selectedDate) {
    return user.is_prev_month && this.isPrevMonth(today, selectedDate);
}

function isPrevMonth(today, selectedDate) {
    // Not === Because comparing string to int.
    return selectedDate[1] == (today.getMonth() || 12);
}