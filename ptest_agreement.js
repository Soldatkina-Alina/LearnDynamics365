// namespace
var Navicon = Navicon || {};

Navicon.ptest_agreement = (function () {

    var visibleCreditId = function (context) {

        let formContext = context.getFormContext();
        let contactAttr = formContext.getAttribute("ptest_contact");
        let autoAttr = formContext.getAttribute("ptest_autoid");

        if (contactAttr == null || autoAttr == null) return;
        formContext.getControl("ptest_creditid").setVisible(contactAttr.getValue() != null && autoAttr.getValue() != null);

        //Добавление филтра на кредитную программу
        formContext.getControl("ptest_creditid").addPreSearch(filterСreditid);
    }

    var contactOnChange = function (context) {
        visibleCreditId(context);
    }

    var autoOnChange = function (context) {
        visibleCreditId(context);
    }

    var creditidOnChange = function (context) {
        let formContext = context.getFormContext();
        let creditIdAttr = formContext.getAttribute("ptest_creditid");
        if (creditIdAttr == null) return;
        formContext.ui.tabs.get("tab_2").setVisible(creditIdAttr.getValue() != null);
    }

    var filterСreditid = function () {
        //alert("!!!");
        console.log("isFilter");
        var сreditidFilter = "<filter type='and'><condition attribute='ptest_name' value='Обычная' operator='eq' /></filter>";
        Xrm.Page.getControl("ptest_creditid").addCustomFilter(сreditidFilter);
    }

    var agreementNumberOnChange = function (context) {
        var agreementnumberAttr = context.getFormContext().getAttribute("ptest_agreementnumber");
        var agreementnumber = agreementnumberAttr.getValue();
        if (agreementnumber != null) {
            agreementnumberAttr.setValue(agreementnumber.replace(/[^\d-]/g, ''));
        }

    }

    return {
        onLoad: function (context) {
            let formContext = context.getFormContext();
            var tabObj = formContext.ui.tabs.get("tab_2");

            let contactAttr = formContext.getAttribute("ptest_contact");
            let autoAttr = formContext.getAttribute("ptest_autoid");
            let creditidAttr = formContext.getAttribute("ptest_creditid");
            let summaAttr = formContext.getAttribute("ptest_summa");

            let creditidControl = formContext.getControl("ptest_creditid");
            let summaControl = formContext.getControl("ptest_summa");

            if (contactAttr == null || autoAttr == null || creditidAttr == null || summaAttr == null) return;

            if (formContext.ui.getFormType() == 1) {
                tabObj.setVisible(false);
                creditidControl.setVisible(false);
                summaControl.setVisible(false);
            }

            var agreementnumber = formContext.getAttribute("ptest_agreementnumber");
            if (agreementnumber == null) return;
            agreementnumber.addOnChange(agreementNumberOnChange);

            contactAttr.addOnChange(contactOnChange);
            autoAttr.addOnChange(autoOnChange);
            creditidAttr.addOnChange(creditidOnChange);
        }
    }
})();

