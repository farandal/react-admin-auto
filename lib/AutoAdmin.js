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
var ra_core_1 = require("ra-core");
var React = require("react");
var react_admin_1 = require("react-admin");
function isEnum(instance) {
    var keys = Object.keys(instance);
    var values = [];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = instance[key];
        if (typeof value === 'number') {
            value = value.toString();
        }
        values.push(value);
    }
    for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
        var key = keys_2[_a];
        if (values.indexOf(key) < 0) {
            return false;
        }
    }
    return true;
}
var attributeToField = function (input) {
    if (Array.isArray(input.type)) {
        return (React.createElement(react_admin_1.ArrayField, { source: input.attribute },
            React.createElement(react_admin_1.Datagrid, null, input.type.map(function (attribute) { return attributeToField(attribute); }))));
    }
    if (typeof input.type === 'string') {
        var _a = input.type.split('.'), reference = _a[0], sourceName = _a[1];
        return (React.createElement(react_admin_1.ReferenceField, { linkType: "show", source: input.attribute, reference: reference },
            React.createElement(react_admin_1.TextField, { source: sourceName })));
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextField, { source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberField, { source: input.attribute });
    }
    return React.createElement(react_admin_1.TextField, { source: input.attribute });
};
var attributeToInput = function (input) {
    if (Array.isArray(input.type)) {
        return (React.createElement(react_admin_1.ArrayInput, { source: input.attribute },
            React.createElement(react_admin_1.SimpleFormIterator, null, input.type.map(function (attribute) { return attributeToInput(attribute); }))));
    }
    switch (typeof input.type) {
        case 'string': {
            var _a = input.type.split('.'), reference = _a[0], sourceName = _a[1];
            return (React.createElement(react_admin_1.ReferenceInput, { source: input.attribute, reference: reference, sort: { field: sourceName, order: 'ASC' } },
                React.createElement(react_admin_1.SelectInput, { source: sourceName })));
        }
        case 'object': {
            var obj_1 = input.type;
            var choices = Object.keys(input.type).map(function (key) { return ({ id: obj_1[key], name: key }); });
            return React.createElement(react_admin_1.SelectInput, { source: input.attribute, choices: choices });
        }
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextInput, { source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberInput, { source: input.attribute });
    }
    return React.createElement(react_admin_1.TextInput, { source: input.attribute });
};
exports.AutoFilter = function (props) { return (React.createElement(react_admin_1.Filter, __assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: "Search", source: "q", alwaysOn: true }))); };
var AutoTitle = function (_a) {
    var record = _a.record, schema = _a.schema;
    return React.createElement("span", null,
        "Edit ",
        record ? "\"" + record[schema[0].attribute] + "\"" : '');
};
exports.AutoCreate = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Create, __assign({ title: "Create a course" }, props),
        React.createElement(react_admin_1.SimpleForm, null, schema.map(attributeToInput))));
};
exports.AutoShow = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Show, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props),
        React.createElement(react_admin_1.SimpleShowLayout, null,
            React.createElement(react_admin_1.TextField, { source: "id" }),
            schema.map(attributeToField))));
};
exports.AutoEdit = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Edit, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props),
        React.createElement(react_admin_1.SimpleForm, null,
            React.createElement(react_admin_1.DisabledInput, { source: "id" }),
            schema.map(attributeToInput))));
};
exports.AutoList = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.List, __assign({}, props, { filters: React.createElement(exports.AutoFilter, null) }),
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "id", onClick: function () { return (document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, 'show')); } }),
            schema.map(attributeToField),
            React.createElement(react_admin_1.ShowButton, { basePath: props.basePath }))));
};
exports.AutoResource = function (modelName, _a) {
    var schema = _a.schema;
    var list = function (props) { return exports.AutoList(props, { schema: schema }); };
    var show = function (props) { return exports.AutoShow(props, { schema: schema }); };
    var edit = function (props) { return exports.AutoEdit(props, { schema: schema }); };
    var create = function (props) { return exports.AutoCreate(props, { schema: schema }); };
    var icon = 'address-book';
    return React.createElement(react_admin_1.Resource, { name: modelName, list: list, show: show, edit: edit, create: create, icon: icon });
};
//# sourceMappingURL=AutoAdmin.js.map