// namespace
var Navicon = Navicon || {};

Navicon.ptest_auto = (function () {

    // Событие на изменение в поле Тип
    var usedOnChange = function (context) {

        let formContext = context.getFormContext();

        let usedControl = formContext.getAttribute("ptest_used");
        let kmControl = formContext.getControl("ptest_km");
        let ownerscountControl = formContext.getControl("ptest_ownerscount");
        let isdamagedControl = formContext.getControl("ptest_isdamaged");

        kmControl.setVisible(usedControl.getValue() == true);
        ownerscountControl.setVisible(usedControl.getValue() == true);
        isdamagedControl.setVisible(usedControl.getValue() == true);

    }

    return {
        onLoad: function (context) {

            let formContext = context.getFormContext();

            let usedAttr = formContext.getAttribute("ptest_used");
            let kmControl = formContext.getControl("ptest_km");
            let ownerscountControl = formContext.getControl("ptest_ownerscount");
            let isdamagedControl = formContext.getControl("ptest_isdamaged");

            if (usedAttr == null || kmControl == null || ownerscountControl == null || isdamagedControl == null) return;

            usedAttr.addOnChange(usedOnChange);

        }
    }
})();

