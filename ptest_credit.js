// namespace
var Navicon = Navicon || {};

Navicon.ptest_credit = (function () {

    //Блокировка сохранения при невыполнении условия с датами
    var checkSave = function (context) {
        if (getDiffDates(context) < 1)
            context.getFormContext().getEventArgs().preventDefault();
    }

    var getDiffDates = function (context) {
        let formContext = context.getFormContext();
        var dateStartValue = formContext.getAttribute("ptest_datestart").getValue();
        var dateEndValue = formContext.getAttribute("ptest_dateend").getValue();

        if (dateStartValue == null || dateEndValue == null) return 0;

        var dateEnd = moment(dateEndValue).format('YYYY-MM-DD');
        var dateStart = moment(dateStartValue).format('YYYY-MM-DD');

        return moment(dateEnd).diff(dateStart, 'year');
    }

    // Событие на изменение в полях дат
    var datesOnChange = function (context) {

        if (getDiffDates(context) < 1) {
            formContext.getControl("ptest_dateend").addNotification({
                messages: ['Разница между датами должна быть больше года'],
                notificationLevel: 'RECOMMENDATION',
                uniqueId: 'my_unique_id',
                actions: null
            });
        }
    }

    return {
        onLoad: function (context) {
            let formContext = context.getFormContext();
            var dateStartAttr = formContext.getAttribute("ptest_datestart");
            var dateEndAttr = formContext.getAttribute("ptest_dateend");

            if (dateStartAttr == null || dateEndAttr == null) return;

            dateStartAttr.addOnChange(datesOnChange);
            dateEndAttr.addOnChange(datesOnChange);
            formContext.data.entity.addOnSave(checkSave);
        }
    }
})();

