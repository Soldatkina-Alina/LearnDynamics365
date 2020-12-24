// namespace
var Navicon = Navicon || {};

Navicon.ptest_agreement_ribbon = (function () {

    return {
        CalculateCredit: function (context) {
            alert("click");

            let formContext = context.getFormContext();
            var creditamountAttr = formContext.getAttribute("ptest_creditamount");
            var summaAttr = formContext.getAttribute("ptest_summa");
            var initialfeeAttr = formContext.getAttribute("ptest_initialfee");
            var creditperiodAttr = formContext.getAttribute("ptest_creditperiod");
            var creditidAttr = formContext.getAttribute("ptest_creditid");
            var fullcreditamountAttr = formContext.getAttribute("ptest_fullcreditamount");

            if (creditamountAttr == null || summaAttr == null || initialfeeAttr == null
                || creditperiodAttr == null || creditidAttr == null || fullcreditamountAttr == null) return;

            var summaValue = formContext.getAttribute("ptest_summa").getValue();
            var initialfeeValue = formContext.getAttribute("ptest_initialfee").getValue();
            var creditperiodValue = formContext.getAttribute("ptest_creditperiod").getValue();
            var creditidValue = formContext.getAttribute("ptest_creditid").getValue();
            var creditamountValue = formContext.getAttribute("ptest_creditamount").getValue();

            console.log(summaValue, initialfeeValue, creditperiodValue, creditidValue);

            if (summaValue == null || initialfeeValue == null || creditperiodValue == null || creditidValue == null || creditamountValue == null) return;

            var summa = summaValue - initialfeeValue;
            if (summa > 0)
                creditamountAttr.setValue(summa);

            Xrm.WebApi.retrieveRecord("ptest_credit", creditidValue[0].id, "?$select=ptest_percent").then(
                function success(result) {
                    console.log(result);
                    if (result.ptest_percent > 0)
                        fullcreditamountAttr.setValue((result.ptest_percent / 100 * creditperiodValue * creditamountValue) + creditamountValue);
                },
                function (error) {
                    console.log(error.message);
                }
            );
        }
    }
})();

