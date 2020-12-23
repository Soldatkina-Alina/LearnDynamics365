// namespace
var Navicon = Navicon || {};

Navicon.ptest_model = (function () {

    return {
        onLoad: function (context) {

            let formContext = context.getFormContext();

            for (let role of Xrm.Utility.getGlobalContext().userSettings.roles.get())
                if (role.name == "Системный администратор")
                    for (let sec of formContext.ui.tabs.get("tabs_1").sections.get())
                        sec.controls.get().forEach(function (item, i, arr) {
                            item.setDisabled(true);
                        });
        }
    }
})();

