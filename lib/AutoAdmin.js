"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_admin_1 = require("react-admin");
var ra_core_1 = require("ra-core");
var attributeToField = function (input) {
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextField, { source: input.attribute });
    }
    return React.createElement(react_admin_1.TextField, { source: input.attribute });
};
var attributeToInput = function (input) {
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextInput, { source: input.attribute });
    }
    return React.createElement(react_admin_1.TextInput, { source: input.attribute });
};
var AutoFilter = function (props) { return (React.createElement(react_admin_1.Filter, __assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: "Search", source: "q", alwaysOn: true }))); };
var AutoTitle = function (_a) {
    var record = _a.record, fields = _a.fields;
    return React.createElement("span", null,
        "Edit ",
        record ? "\"" + record[fields[0].attribute] + "\"" : "");
};
var AutoAdmin = (function () {
    function AutoAdmin() {
    }
    AutoAdmin.AutoCreate = function (props, fields) {
        return (React.createElement(react_admin_1.Create, __assign({ title: "Create a course" }, props),
            React.createElement(react_admin_1.SimpleForm, null, fields.map(attributeToInput))));
    };
    AutoAdmin.AutoShow = function (props, fields) {
        return (React.createElement(react_admin_1.Show, __assign({ title: React.createElement(AutoTitle, { fields: fields }) }, props),
            React.createElement(react_admin_1.SimpleShowLayout, null,
                React.createElement(react_admin_1.TextField, { source: "id" }),
                fields.map(attributeToField))));
    };
    AutoAdmin.AutoEdit = function (props, fields) {
        return (React.createElement(react_admin_1.Edit, __assign({ title: React.createElement(AutoTitle, { fields: fields }) }, props),
            React.createElement(react_admin_1.SimpleForm, null,
                React.createElement(react_admin_1.DisabledInput, { source: "id" }),
                fields.map(attributeToInput))));
    };
    AutoAdmin.AutoList = function (props, fields) {
        return (React.createElement(react_admin_1.List, __assign({}, props, { filters: React.createElement(AutoFilter, null) }),
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "id", onClick: function () {
                        return (document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, "show"));
                    } }),
                fields.map(attributeToField),
                React.createElement(react_admin_1.ShowButton, { basePath: props.basePath }))));
    };
    return AutoAdmin;
}());
exports.default = AutoAdmin;
//# sourceMappingURL=AutoAdmin.js.map