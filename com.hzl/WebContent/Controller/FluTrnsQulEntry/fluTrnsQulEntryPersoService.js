sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "FTQE-fluTrnsQualityEntryTable-date",
                        order: 0,
                        text: "{i18n>FTQE_dt}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-shift",
                        order: 1,
                        text: "{i18n>FTQE_sft}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-materialTransfer",
                        order: 2,
                        text: "{i18n>FTQE_MatTrans}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-materialTransFrom",
                        order: 3,
                        text: "{i18n>FTQE_matTrnsFrm}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-materialTransTo",
                        order: 4,
                        text: "{i18n>FTQE_matTrnsTo}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-quantity",
                        order: 5,
                        text: "{i18n>FTQE_qlt}",
                        visible: true
                    },
                    {
                        id: "FTQE-fluTrnsQualityEntryTable-quantityUOM",
                        order: 6,
                        text: "{i18n>FTQE_qltUOM}",
                        visible: false
                    }
                ]
            },

            /** @Function call to get the persona data
             */
            getPersData: function() {
                var oDeferred = new jQuery.Deferred();
                if (!this._oBundle) {
                    this._oBundle = this.oData;
                }
                var oBundle = this._oBundle;
                oDeferred.resolve(oBundle);
                return oDeferred.promise();
            },

            /** @Function call to set the persona data
             */
            setPersData: function(oBundle) {
                var oDeferred = new jQuery.Deferred();
                this._oBundle = oBundle;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            /** @Function call to reset the persona data
             */
            resetPersData: function() {
                var oDeferred = new jQuery.Deferred();
                var oInitialData = {
                    _persoSchemaVersion: "1.0",
                    aColumns: [{
                            id: "FTQE-fluTrnsQualityEntryTable-date",
                            order: 0,
                            text: "{i18n>FTQE_dt}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-shift",
                            order: 1,
                            text: "{i18n>FTQE_sft}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-materialTransfer",
                            order: 2,
                            text: "{i18n>FTQE_MatTrans}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-materialTransFrom",
                            order: 3,
                            text: "{i18n>FTQE_matTrnsFrm}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-materialTransTo",
                            order: 4,
                            text: "{i18n>FTQE_matTrnsTo}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-quantity",
                            order: 5,
                            text: "{i18n>FTQE_qlt}",
                            visible: true
                        },
                        {
                            id: "FTQE-fluTrnsQualityEntryTable-quantityUOM",
                            order: 6,
                            text: "{i18n>FTQE_qltUOM}",
                            visible: false
                        }
                    ]
                };

                this._oBundle = oInitialData;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            /** @Function call to set the weight property
             */
            getCaption: function(oColumn) {
                if (oColumn.getHeader() && oColumn.getHeader().getText) {
                    if (oColumn.getHeader().getText() === "Weight") {
                        return "Weight (Important!)";
                    }
                }
                return null;
            },

            /** @Function call to group the list
             */
            getGroup: function(oColumn) {
                if (oColumn.getId().indexOf('productCol') != -1 ||
                    oColumn.getId().indexOf('supplierCol') != -1) {
                    return "Primary Group";
                }
                return "Secondary Group";
            }
        };

        return DemoPersoService;

    }, true);