sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "repEtryTbl-repEtryTbl-dt",
                        order: 0,
                        text: "{i18n>date}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-qul",
                        order: 1,
                        text: "{i18n>qualityM3}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-qulUOM",
                        order: 2,
                        text: "Quantity UOM",
                        visible: false
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znMT",
                        order: 3,
                        text: "{i18n>micZnMt}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znMtUOM",
                        order: 4,
                        text: "Zn MIC UOM",
                        visible: false
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znGPL",
                        order: 5,
                        text: "{i18n>znGpl}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znGplUOM",
                        order: 6,
                        text: "Zn GPL UOM",
                        visible: false
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znVol",
                        order: 7,
                        text: "{i18n>mtVol}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-znVolUOM",
                        order: 8,
                        text: "Zn Vol UOM",
                        visible: false
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-frmPlt",
                        order: 9,
                        text: "{i18n>frmPlt}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-toPlt",
                        order: 10,
                        text: "{i18n>toPlt}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-mtNoFrm",
                        order: 10,
                        text: "{i18n>mtrNoFrm}",
                        visible: true
                    },
                    {
                        id: "repEtryTbl-repEtryTbl-mtNoTo",
                        order: 10,
                        text: "{i18n>mtrNoTo}",
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
                            id: "repEtryTbl-repEtryTbl-dt",
                            order: 0,
                            text: "{i18n>date}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-qul",
                            order: 1,
                            text: "{i18n>qualityM3}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-qulUOM",
                            order: 2,
                            text: "Quantity UOM",
                            visible: false
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znMT",
                            order: 3,
                            text: "{i18n>micZnMt}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znMtUOM",
                            order: 4,
                            text: "Zn MIC UOM",
                            visible: false
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znGPL",
                            order: 5,
                            text: "{i18n>znGpl}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znGplUOM",
                            order: 6,
                            text: "Zn GPL UOM",
                            visible: false
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znVol",
                            order: 7,
                            text: "{i18n>mtVol}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-znVolUOM",
                            order: 8,
                            text: "Zn Vol UOM",
                            visible: false
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-frmPlt",
                            order: 9,
                            text: "{i18n>frmPlt}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-toPlt",
                            order: 10,
                            text: "{i18n>toPlt}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-mtNoFrm",
                            order: 10,
                            text: "{i18n>mtrNoFrm}",
                            visible: true
                        },
                        {
                            id: "repEtryTbl-repEtryTbl-mtNoTo",
                            order: 10,
                            text: "{i18n>mtrNoTo}",
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