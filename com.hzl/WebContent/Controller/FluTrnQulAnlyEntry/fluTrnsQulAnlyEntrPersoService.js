sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-date",
                        order: 0,
                        text: "{i18n>FTQAE_dt}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-shift",
                        order: 1,
                        text: "{i18n>FTQAE_shift}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-matTrans",
                        order: 2,
                        text: "{i18n>FTQAE_matTrns}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-matTransFrm",
                        order: 3,
                        text: "{i18n>FTQAE_MTF}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-matTransTo",
                        order: 4,
                        text: "{i18n>FTQAE_matTrnsTo}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-znGpl",
                        order: 5,
                        text: "{i18n>FTQAE_znGPL}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-znGplUOM",
                        order: 6,
                        text: "{i18n>FTQAE_znGplUOM}",
                        visible: false
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-znDen",
                        order: 7,
                        text: "{i18n>FTQAE_znDen}",
                        visible: true
                    },
                    {
                        id: "FTQAE-fluTrnsQulAnlyEntrTable-znDenUOM",
                        order: 8,
                        text: "{i18n>FTQAE_znDenUOM}",
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
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-date",
                            order: 0,
                            text: "{i18n>FTQAE_dt}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-shift",
                            order: 1,
                            text: "{i18n>FTQAE_shift}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-matTrans",
                            order: 2,
                            text: "{i18n>FTQAE_matTrns}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-matTransFrm",
                            order: 3,
                            text: "{i18n>FTQAE_MTF}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-matTransTo",
                            order: 4,
                            text: "{i18n>FTQAE_matTrnsTo}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-znGpl",
                            order: 5,
                            text: "{i18n>FTQAE_znGPL}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-znGplUOM",
                            order: 6,
                            text: "{i18n>FTQAE_znGplUOM}",
                            visible: false
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-znDen",
                            order: 7,
                            text: "{i18n>FTQAE_znDen}",
                            visible: true
                        },
                        {
                            id: "FTQAE-fluTrnsQulAnlyEntrTable-znDenUOM",
                            order: 8,
                            text: "{i18n>FTQAE_znDenUOM}",
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