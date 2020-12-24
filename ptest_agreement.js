// namespace
var Navicon = Navicon || {};

Navicon.ptest_agreement = (function () {

    var isRigthDateAgreement = false;

    //Установление видимости поля "Кредитная программа"
    var visibleCreditId = function (context) {

        let formContext = context.getFormContext();
        let contactAttr = formContext.getAttribute("ptest_contact");
        let autoAttr = formContext.getAttribute("ptest_autoid");

        if (contactAttr == null || autoAttr == null) return;
        formContext.getControl("ptest_creditid").setVisible(contactAttr.getValue() != null && autoAttr.getValue() != null);
        formContext.getControl("ptest_summa").setVisible(contactAttr.getValue() != null && autoAttr.getValue() != null);

        //Добавление представления на кредитную программу
        CustomViewCreditid(context);
    }

    //Проверка, что дата договора входит в даты кредитной программы и установка срока кредита
    var checkcreditperiod = function (context) {
        let formContext = context.getFormContext();
        var creditidAttr = formContext.getAttribute("ptest_creditid");
        var dateAttr = formContext.getAttribute("ptest_date");
        if (creditidAttr == null || dateAttr == null) return;
        var creditidValue = creditidAttr.getValue();
        var date = dateAttr.getValue();
        if (creditidValue == null || date == null) return;

        var dateStart, dateEnd, creditperiod;

        Xrm.WebApi.retrieveRecord("ptest_credit", creditidValue[0].id, "?$select=ptest_datestart,ptest_dateend,ptest_creditperiod").then(
            function success(result) {
                console.log("datestart " + result.ptest_datestart + "dateend " + result.ptest_dateend + " " + result.ptest_creditperiod);
                dateStart = result.ptest_datestart;
                dateEnd = result.ptest_dateend;
                creditperiod = result.ptest_creditperiod;

                if (moment(moment(date)).isAfter(dateStart) == true && moment(moment(date)).isAfter(dateEnd) == false) {
                    formContext.ui.clearFormNotification("uniqueId");
                    isRigthDateAgreement = true;

                    if (creditperiod != null && formContext.getAttribute("ptest_creditperiod") != null)
                        if (formContext.getAttribute("ptest_creditperiod").getValue() == null)
                            formContext.getAttribute("ptest_creditperiod").setValue(creditperiod);
                }
                else
                    formContext.ui.setFormNotification("Дата договора не входит в срок действия кредитной программы", "ERROR", "uniqueId");
            },
            function (error) {
                console.log(error.message);
            }
        );
    }

    var checkSave = function (context) {
        if (!isRigthDateAgreement)
            context.getFormContext().getEventArgs().preventDefault();
    }

    var CustomViewCreditid = function (context) {
        if (context.getFormContext().getAttribute("ptest_autoid").getValue() == null) return;

        var autoidAtttr = context.getFormContext().getAttribute("ptest_autoid").getValue()[0].id;
        var autonameAttr = context.getFormContext().getAttribute("ptest_autoid").getValue()[0].name;
        var viewId = context.getFormContext().getControl("ptest_creditid").getDefaultView();
        var entityName = "ptest_credit";
        var viewDisplayName = "Filtered"

        var fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">' +
            '<entity name="ptest_credit">' +
            '<attribute name="ptest_creditid" />' +
            '<attribute name="ptest_name" />' +
            '<link-entity name="ptest_ptest_credit_ptest_auto" from="ptest_creditid" to="ptest_creditid" visible="false" intersect="true">' +
            '<link-entity name="ptest_auto" from="ptest_autoid" to="ptest_autoid" alias="ae">' +
            '<filter type="and">' +
            '<condition attribute="ptest_autoid" operator="eq" uiname="' + autonameAttr + '" uitype="ptest_auto" value="' + autoidAtttr + '" />' +
            '</filter>' +
            '</link-entity>' +
            '</link-entity>' +
            '</entity>' +
            '</fetch>';

        var layoutXml = "<grid name='resultset' jump='fullname' select='1' icon='1' preview='1'><row name = 'result' id = 'ptest_credit' ><cell name='ptest_name' width='300' /></row></grid>";

        context.getFormContext().getControl("ptest_creditid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
    }

    //#region События изменения данных в полях

    //Изменение контакта
    var contactOnChange = function (context) {
        visibleCreditId(context);
    }
    //Изменение автомобиля
    var autoOnChange = function (context) {
        visibleCreditId(context);

        let formContext = context.getFormContext();
        var autoid = formContext.getAttribute("ptest_autoid").getValue();
        var summa = formContext.getAttribute("ptest_summa");
        if (autoid == null || summa == null) return;

        //Установка суммы из таблицы Автомобиль или Модель в зависимости от поношенности авто
        Xrm.WebApi.retrieveRecord("ptest_auto", autoid[0].id, "?$select=ptest_used,ptest_amount&$expand=ptest_modelid($select=ptest_recommendedamount)").then(
            function success(result) {
                if (result.ptest_used)
                    summa.setValue(result.ptest_amount);
                else
                    summa.setValue(result.ptest_modelid.ptest_recommendedamount);
            },
            function (error) {
                console.log(error.message);
            }
        );
    }
    //Изменение кредитной программы
    var creditidOnChange = function (context) {
        let formContext = context.getFormContext();
        let creditIdAttr = formContext.getAttribute("ptest_creditid");
        if (creditIdAttr == null) return;
        formContext.ui.tabs.get("tab_2").setVisible(creditIdAttr.getValue() != null);
        checkcreditperiod(context);
    }
    // Изменение даты договора
    var dateOnChange = function (context) {
        checkcreditperiod(context);
    }

    //Изменение номера договора
    var agreementNumberOnChange = function (context) {
        var agreementnumberAttr = context.getFormContext().getAttribute("ptest_agreementnumber");
        var agreementnumber = agreementnumberAttr.getValue();
        if (agreementnumber != null) {
            agreementnumberAttr.setValue(agreementnumber.replace(/[^\d-]/g, ''));
        }

    }
    //#endregion

    return {
        onLoad: function (context) {
            let formContext = context.getFormContext();
            var tabObj = formContext.ui.tabs.get("tab_2");

            let contactAttr = formContext.getAttribute("ptest_contact");
            let autoAttr = formContext.getAttribute("ptest_autoid");
            let creditidAttr = formContext.getAttribute("ptest_creditid");
            let summaAttr = formContext.getAttribute("ptest_summa");
            let dateAttr = formContext.getAttribute("ptest_date");

            let creditidControl = formContext.getControl("ptest_creditid");
            let summaControl = formContext.getControl("ptest_summa");

            if (contactAttr == null || autoAttr == null || creditidAttr == null || summaAttr == null || dateAttr == null) return;

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
            dateAttr.addOnChange(dateOnChange);
            formContext.data.entity.addOnSave(checkSave);
        }
    }
})();

