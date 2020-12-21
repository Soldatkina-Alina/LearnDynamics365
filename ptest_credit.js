// namespace
var Navicon = Navicon || {};

Navicon.ptest_credit = (function () {

    //Блокирование сохранения
    var blockSave = function (context) {
        console.log("stop");
        context.getEventArgs().preventDefault();
    }

    // Событие на изменение в полях дат
    var datesOnChange = function (context) {
        let formContext = context.getFormContext();
        var dateStartValue = formContext.getAttribute("ptest_datestart").getValue();
        var dateEndValue = formContext.getAttribute("ptest_dateend").getValue();

        if (dateStartValue == null || dateEndValue == null) return;

        var dateEnd = moment(dateEndValue).format('YYYY-MM-DD');
        var dateStart = moment(dateStartValue).format('YYYY-MM-DD');

        var differenceDates = moment(dateEnd).diff(dateStart, 'year');

        console.log('Разница в ', moment(dateEnd).diff(dateStart, 'year'), 'год(а)');

        if (differenceDates < 1) {
            formContext.getControl("ptest_dateend").addNotification({
                messages: ['Разница между датами должна быть больше года'],
                notificationLevel: 'RECOMMENDATION',
                uniqueId: 'my_unique_id',
                actions: null
            });

            formContext.data.process.addOnPreStageChange(blockSave);
        }
        //else formContext.data.process.removeOnPreStageChange(blockSave);

    }

    return {
        onLoad: function (context) {
            let formContext = context.getFormContext();
            var dateStartAttr = formContext.getAttribute("ptest_datestart");
            var dateEndAttr = formContext.getAttribute("ptest_dateend");

            if (dateStartAttr == null || dateEndAttr == null) return;

            dateStartAttr.addOnChange(datesOnChange);
            dateEndAttr.addOnChange(datesOnChange);
        }
    }
})();

