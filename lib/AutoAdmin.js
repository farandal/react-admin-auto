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
            return React.createElement(ListStringsField, { label: input.label, source: input.attribute, map: inputType });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName = _a[1];
            return (React.createElement(react_admin_1.ReferenceArrayField, { label: input.label, linkType: 'show', source: input.attribute, reference: reference },
                React.createElement(react_admin_1.SingleFieldList, null,
                    React.createElement(react_admin_1.ChipField, { source: sourceName }))));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayField, { label: input.label, source: input.attribute },
                React.createElement(react_admin_1.Datagrid, null, inputTypeArray.map(function (attribute) { return attributeToField(attribute); }))));
        }
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceField, { label: input.label, linkType: 'show', source: input.attribute, reference: reference },
            React.createElement(react_admin_1.TextField, { source: sourceName })));
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextField, { label: input.label, source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberField, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Boolean:
            return React.createElement(react_admin_1.BooleanField, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Date:
            React.createElement(react_admin_1.DateField, { label: input.label, source: input.attribute, options: input.fieldOptions });
    }
    return React.createElement(react_admin_1.TextField, { label: input.label, source: input.attribute, options: input.fieldOptions });
};
var attributeToInput = function (input) {
    if (input.readOnly) {
        return attributeToField(input);
    }
    if (Array.isArray(input.type) && input.type.length > 0) {
        var inputType = input.type[0];
        if (isEnum(inputType)) {
            return React.createElement(react_admin_1.SelectArrayInput, { label: input.label, source: input.attribute, choices: enumToChoices(inputType) });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName_1 = _a[1];
            var safeIfNull = function (choice) { return (choice ? choice[sourceName_1] : '?') || '??'; };
            return (React.createElement(react_admin_1.ReferenceArrayInput, { label: input.label, reference: reference, source: input.attribute },
                React.createElement(react_admin_1.AutocompleteArrayInput, { optionText: safeIfNull })));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayInput, { label: input.label, source: input.attribute },
                React.createElement(react_admin_1.SimpleFormIterator, null, inputTypeArray.map(function (attribute) { return attributeToInput(attribute); }))));
        }
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceInput, { label: input.label, source: input.attribute, reference: reference, sort: { field: sourceName, order: 'ASC' } },
            React.createElement(react_admin_1.AutocompleteInput, { optionText: sourceName })));
    }
    switch (input.type) {
        case String:
            return React.createElement(react_admin_1.TextInput, { label: input.label, source: input.attribute });
        case Number:
            return React.createElement(react_admin_1.NumberInput, { label: input.label, source: input.attribute });
        case Boolean:
            return React.createElement(react_admin_1.BooleanInput, { label: input.label, source: input.attribute });
        case Date:
            return React.createElement(react_admin_1.DateInput, { label: input.label, source: input.attribute });
    }
    if (isEnum(input.type)) {
        return React.createElement(react_admin_1.SelectInput, { label: input.label, source: input.attribute, choices: enumToChoices(input.type) });
    }
    return React.createElement(react_admin_1.TextInput, { label: input.label, source: input.attribute });
};
var groupByTabs = function (schema) {
    var tabs = [];
    schema.forEach(function (attribute) {
        var added = false;
        tabs.forEach(function (tab) {
            var name = tab[0].tab;
            if (name === attribute.tab) {
                tab.push(attribute);
                added = true;
            }
        });
        if (!added) {
            tabs.push([attribute]);
        }
    });
    return tabs;
};
var tabbedForm = function (schema) {
    return (React.createElement(react_admin_1.TabbedForm, null, groupByTabs(schema).map(function (groupOfAttributes) { return (React.createElement(react_admin_1.FormTab, { label: groupOfAttributes[0].tab || 'Main' }, groupOfAttributes.map(function (attribute) {
        return attribute.readOnly !== true ? attributeToInput(attribute) : attributeToField(attribute);
    }))); })));
};
var tabbedLayout = function (schema) {
    return (React.createElement(react_admin_1.TabbedShowLayout, null, groupByTabs(schema).map(function (groupOfAttributes) { return (React.createElement(react_admin_1.Tab, { label: groupOfAttributes[0].tab || 'Main' }, groupOfAttributes.map(attributeToField))); })));
};
exports.AutoFilter = function (props) { return (React.createElement(react_admin_1.Filter, __assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: 'Search', source: 'q', alwaysOn: true }))); };
var AutoTitle = function (_a) {
    var record = _a.record, schema = _a.schema;
    return React.createElement("span", null,
        "Edit ",
        record ? "\"" + record[schema[0].attribute] + "\"" : '');
};
exports.AutoCreate = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Create, __assign({ title: 'Create a course' }, props), tabbedForm(schema)));
};
exports.AutoShow = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Show, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props), tabbedLayout(schema)));
};
exports.AutoEdit = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Edit, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props), tabbedForm(schema)));
};
exports.AutoList = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.List, __assign({}, props, { filters: React.createElement(exports.AutoFilter, null) }),
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: 'id', onClick: function () { return (document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, 'show')); } }),
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