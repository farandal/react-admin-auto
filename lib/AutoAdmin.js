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
var Chip_1 = require("@material-ui/core/Chip");
var ra_core_1 = require("ra-core");
var React = require("react");
var react_admin_1 = require("react-admin");
var isEnum = function (type) { return typeof type === 'object' && !(type.attribute && type.type); };
var invertMap = function (map) {
    if (!map) {
        return false;
    }
    var invertedMap = {};
    Object.keys(map).forEach(function (key) { return (invertedMap[map[key]] = key); });
    return invertedMap;
};
var ListStringsField = function (_a) {
    var record = _a.record, source = _a.source, map = _a.map;
    var invertedMap = invertMap(map);
    return (React.createElement(React.Fragment, null, record[source].map(function (item) { return [
        React.createElement(Chip_1.default, { key: item, label: invertedMap && invertedMap[item] ? invertedMap[item] : item }),
        React.createElement(React.Fragment, null, " ")
    ]; })));
};
ListStringsField.defaultProps = { addLabel: true };
var enumToChoices = function (e) { return Object.keys(e).map(function (key) { return ({ id: e[key], name: key }); }); };
var attributeToField = function (input) {
    if (Array.isArray(input.type) && input.type.length > 0) {
        var inputType = input.type[0];
        if (isEnum(inputType)) {
            return React.createElement(ListStringsField, { source: input.attribute, map: inputType });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName = _a[1];
            return (React.createElement(react_admin_1.ReferenceArrayField, { linkType: "show", source: input.attribute, reference: reference },
                React.createElement(react_admin_1.SingleFieldList, null,
                    React.createElement(react_admin_1.ChipField, { source: sourceName }))));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayField, { source: input.attribute },
                React.createElement(react_admin_1.Datagrid, null, inputTypeArray.map(function (attribute) { return attributeToField(attribute); }))));
        }
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceField, { linkType: "show", source: input.attribute, reference: reference },
            React.createElement(react_admin_1.TextField, { source: sourceName })));
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextField, { source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberField, { source: input.attribute });
        case Date:
            return React.createElement(react_admin_1.DateField, { showTime: input.showTime, source: input.attribute });
    }
    return React.createElement(react_admin_1.TextField, { source: input.attribute });
};
var attributeToInput = function (input) {
    if (Array.isArray(input.type) && input.type.length > 0) {
        var inputType = input.type[0];
        if (isEnum(inputType)) {
            return React.createElement(react_admin_1.SelectArrayInput, { source: input.attribute, choices: enumToChoices(inputType) });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName = _a[1];
            return (React.createElement(react_admin_1.ReferenceManyField, { reference: reference, source: input.attribute, linkType: "show" },
                React.createElement(react_admin_1.SingleFieldList, null,
                    React.createElement(react_admin_1.ChipField, { source: sourceName }))));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayInput, { source: input.attribute },
                React.createElement(react_admin_1.SimpleFormIterator, null, inputTypeArray.map(function (attribute) { return attributeToInput(attribute); }))));
        }
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceInput, { source: input.attribute, reference: reference, sort: { field: sourceName, order: 'ASC' } },
            React.createElement(react_admin_1.AutocompleteInput, { optionText: sourceName })));
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextInput, { source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberInput, { source: input.attribute });
    }
    if (isEnum(input.type)) {
        return React.createElement(react_admin_1.SelectInput, { source: input.attribute, choices: enumToChoices(input.type) });
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
            schema.map(function (attribute) { return (attribute.readOnly !== true ? attributeToInput(attribute) : attributeToField(attribute)); }))));
};
exports.AutoList = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.List, __assign({}, props, { filters: React.createElement(exports.AutoFilter, null) }),
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "id", onClick: function () { return (document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, 'show')); } }),
            schema.filter(function (attribute) { return attribute.inList !== false; }).map(attributeToField),
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