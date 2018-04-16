sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "sftAvgTbl-sftAvgTbl-SA_dt",
                        order: 0,
                        text: "{i18n>SD_Date}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_matQty",
                        order: 1,
                        text: "{i18n>SD_matQty}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_matQtyUOM",
                        order: 2,
                        text: "{i18n>SD_matQtyUOM}",
                        visible: false
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znVol",
                        order: 3,
                        text: "{i18n>SD_FluidZNVolume}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znVolUOM",
                        order: 4,
                        text: "{i18n>SD_ZnVolUOM}",
                        visible: false
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znGPL",
                        order: 5,
                        text: "{i18n>SD_FluidZNGPL}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znGplUOM",
                        order: 6,
                        text: "{i18n>SD_FluidZNGPL_UOM}",
                        visible: false
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_den",
                        order: 7,
                        text: "{i18n>SD_FluidDensity}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znMT",
                        order: 8,
                        text: "{i18n>SD_FluidZNMIC}",
                        visible: true
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_znMtUOM",
                        order: 9,
                        text: "{i18n>SD_ZnMicUOM}",
                        visible: false
                    },
                    {
                        id: "sftAvgTbl-sftAvgTbl-SA_sft",
                        order: 10,
                        text: "{i18n>SD_Shift}",
                        visible: true
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
                            id: "sftAvgTbl-sftAvgTbl-SA_dt",
                            order: 0,
                            text: "{i18n>SD_Date}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_matQty",
                            order: 1,
                            text: "{i18n>SD_matQty}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_matQtyUOM",
                            order: 2,
                            text: "{i18n>SD_matQtyUOM}",
                            visible: false
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znVol",
                            order: 3,
                            text: "{i18n>SD_FluidZNVolume}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znVolUOM",
                            order: 4,
                            text: "{i18n>SD_ZnVolUOM}",
                            visible: false
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znGPL",
                            order: 5,
                            text: "{i18n>SD_FluidZNGPL}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znGplUOM",
                            order: 6,
                            text: "{i18n>SD_FluidZNGPL_UOM}",
                            visible: false
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_den",
                            order: 7,
                            text: "{i18n>SD_FluidDensity}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znMT",
                            order: 8,
                            text: "{i18n>SD_FluidZNMIC}",
                            visible: true
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_znMtUOM",
                            order: 9,
                            text: "{i18n>SD_ZnMicUOM}",
                            visible: false
                        },
                        {
                            id: "sftAvgTbl-sftAvgTbl-SA_sft",
                            order: 10,
                            text: "{i18n>SD_Shift}",
                            visible: true
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