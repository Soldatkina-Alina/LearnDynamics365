// namespace
var Navicon = Navicon || {};

Navicon.ptest_communication = (function () {

    // Событие на изменение в поле Тип
    var typeOnChange = function (context) {

        let formContext = context.getFormContext();
        let phoneControl = formContext.getControl("ptest_phone");
        let emailControl = formContext.getControl("ptest_email");
        var typeValue = formContext.getAttribute("ptest_type").getValue();

        if (typeValue == null) return;

        phoneControl.setVisible(typeValue == formContext.getControl("ptest_type").getOptions()[1]["value"]);
        emailControl.setVisible(typeValue == formContext.getControl("ptest_type").getOptions()[2]["value"]);

    }

    return {
        onLoad: function (context) {

            let formContext = context.getFormContext();
            let phoneControl = formContext.getControl("ptest_phone");
            let emailControl = formContext.getControl("ptest_email");
            let typeAttr = formContext.getAttribute("ptest_type");

            if (phoneControl == null || emailControl == null || typeAttr == null) return;

            if (formContext.ui.getFormType() == 1) {
                phoneControl.setVisible(false);
                emailControl.setVisible(false);
            }

            typeAttr.addOnChange(typeOnChange);

        }
    }
})();

