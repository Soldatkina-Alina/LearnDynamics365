// namespace
var Navicon = Navicon || {};

Navicon.ptest_agreement = (function () {

    var visibleCreditId = function (context) {

        let formContext = context.getFormContext();
        let contactAttr = formContext.getAttribute("ptest_contact");
        let autoAttr = formContext.getAttribute("ptest_autoid");

        if (contactAttr == null || autoAttr == null) return;
        formContext.getControl("ptest_creditid").setVisible(contactAttr.getValue() != null && autoAttr.getValue() != null);

    }

    var contactOnChange = function (context) {
        //let formContext = context.getFormContext();
        //let contactAttr = formContext.getAttribute("ptest_contact");
        //contactAttr.addOnChange("changed data" + contactOnChange)
        //console.log(contactAttr.getValue()[0]["name"]);
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

            console.log(tabObj);
            for (let cntr of formContext.getControl())
                console.log("Name: " + cntr.getName() + " Type:" + cntr.getControlType());

            if (formContext.ui.getFormType() == 1) {
                tabObj.setVisible(false);
                creditidControl.setVisible(false);
                summaControl.setVisible(false);
            }

            contactAttr.addOnChange(contactOnChange);
            autoAttr.addOnChange(autoOnChange);
            creditidAttr.addOnChange(creditidOnChange);
        }
    }
})();

