// namespace
var Navicon = Navicon || {};

Navicon.ptest_brand = (function () {

    var setCreditInWebResource = function (context) {
        let formContext = context.getFormContext();
        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
            "<entity name='ptest_credit'>" +
            "<attribute name='ptest_creditid'/>" +
            "<attribute name='ptest_name'/>" +
            "<attribute name='ptest_creditperiod'/>" +
            "<order attribute='ptest_name' descending='false'/>" +
            "<link-entity name='ptest_ptest_credit_ptest_auto' from='ptest_creditid' to='ptest_creditid' visible='false' intersect='true'>" +
            "<link-entity name='ptest_auto' from='ptest_autoid' to='ptest_autoid' alias='af'>" +
            "<filter type='and'>" +
            "<condition attribute='ptest_brandid' operator='eq' uiname='Audi' uitype='ptest_brand' value='{00D5BF94-3141-EB11-A813-000D3A666701}'/>" +
            "</filter>" +
            "<link-entity name='ptest_model' from='ptest_modelid' to='ptest_modelid' alias='mod'>" +
            "<attribute name='ptest_modelid'/>" +
            "<attribute name='ptest_name'/>" +
            "</link-entity>" +
            "</link-entity>" +
            "</link-entity>" +
            "</entity>" +
            "</fetch>";

        fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
        let mass = [];
        Xrm.WebApi.retrieveMultipleRecords('ptest_credit', fetchXml
        ).then(function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                var idCredit = result.entities[i].ptest_creditid;
                var nameCredit = result.entities[i].ptest_name;
                var idModel = result.entities[i]["mod.ptest_modelid"];
                var nameModel = result.entities[i]["mod.ptest_name"];
                var creditperiod = result.entities[i]["ptest_creditperiod"];
                let arr = [idCredit, nameCredit, idModel, nameModel, creditperiod];
                mass[i] = arr;
            }

            let resourceControl = formContext.getControl("WebResource_brandAutoCredit").getContentWindow();
            resourceControl.then(function (contentWindow) {
                contentWindow.setContext(context);
                contentWindow.onSomeEventTableGeneration(mass);
            },
                function (error) {
                    console.log(error.message);
                })
        },
            function (error) {
                console.log(error.message);
            });
    };

    return {
        onLoad: function (context) {
            setCreditInWebResource(context);
        }
    }
})();

