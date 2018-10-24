"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chip_1 = require("@material-ui/core/Chip");
const ra_core_1 = require("ra-core");
const React = require("react");
const react_admin_1 = require("react-admin");
const isEnum = (type) => typeof type === 'object' && !(type.attribute && type.type);
const invertMap = (map) => {
    if (!map) {
        return false;
    }
    let invertedMap = {};
    Object.keys(map).forEach(key => (invertedMap[map[key]] = key));
    return invertedMap;
};
const ListStringsField = ({ record, source, map }) => {
    const invertedMap = invertMap(map);
    return (React.createElement(React.Fragment, null, record[source].map((item) => [
        React.createElement(Chip_1.default, { key: item, label: invertedMap && invertedMap[item] ? invertedMap[item] : item }),
        React.createElement(React.Fragment, null, " ")
    ])));
};
ListStringsField.defaultProps = { addLabel: true };
const enumToChoices = (e) => Object.keys(e).map((key) => ({ id: e[key], name: key }));
const attributeToField = (input) => {
    if (Array.isArray(input.type)) {
        if (input.type.length > 0 && isEnum(input.type[0])) {
            return React.createElement(ListStringsField, { source: input.attribute, map: input.type[0] });
        }
        return (React.createElement(react_admin_1.ArrayField, { source: input.attribute },
            React.createElement(react_admin_1.Datagrid, null, input.type.map(attribute => attributeToField(attribute)))));
    }
    if (typeof input.type === 'string') {
        const [reference, sourceName] = input.type.split('.');
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
const attributeToInput = (input) => {
    if (Array.isArray(input.type)) {
        if (input.type.length > 0 && isEnum(input.type[0])) {
            return React.createElement(react_admin_1.SelectArrayInput, { source: input.attribute, choices: enumToChoices(input.type[0]) });
        }
        return (React.createElement(react_admin_1.ArrayInput, { source: input.attribute },
            React.createElement(react_admin_1.SimpleFormIterator, null, input.type.map(attribute => attributeToInput(attribute)))));
    }
    if (typeof input.type === 'string') {
        const [reference, sourceName] = input.type.split('.');
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
exports.AutoFilter = (props) => (React.createElement(react_admin_1.Filter, Object.assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: "Search", source: "q", alwaysOn: true })));
const AutoTitle = ({ record, schema }) => {
    return React.createElement("span", null,
        "Edit ",
        record ? `"${record[schema[0].attribute]}"` : '');
};
exports.AutoCreate = (props, { schema }) => {
    return (React.createElement(react_admin_1.Create, Object.assign({ title: "Create a course" }, props),
        React.createElement(react_admin_1.SimpleForm, null, schema.map(attributeToInput))));
};
exports.AutoShow = (props, { schema }) => {
    return (React.createElement(react_admin_1.Show, Object.assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props),
        React.createElement(react_admin_1.SimpleShowLayout, null,
            React.createElement(react_admin_1.TextField, { source: "id" }),
            schema.map(attributeToField))));
};
exports.AutoEdit = (props, { schema }) => {
    return (React.createElement(react_admin_1.Edit, Object.assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props),
        React.createElement(react_admin_1.SimpleForm, null,
            React.createElement(react_admin_1.DisabledInput, { source: "id" }),
            schema.map(attribute => (attribute.readOnly !== true ? attributeToInput(attribute) : attributeToField(attribute))))));
};
exports.AutoList = (props, { schema }) => {
    return (React.createElement(react_admin_1.List, Object.assign({}, props, { filters: React.createElement(exports.AutoFilter, null) }),
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "id", onClick: () => (document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, 'show')) }),
            schema.filter(attribute => attribute.inList !== false).map(attributeToField),
            React.createElement(react_admin_1.ShowButton, { basePath: props.basePath }))));
};
exports.AutoResource = (modelName, { schema }) => {
    const list = (props) => exports.AutoList(props, { schema });
    const show = (props) => exports.AutoShow(props, { schema });
    const edit = (props) => exports.AutoEdit(props, { schema });
    const create = (props) => exports.AutoCreate(props, { schema });
    const icon = 'address-book';
    return React.createElement(react_admin_1.Resource, { name: modelName, list: list, show: show, edit: edit, create: create, icon: icon });
};
//# sourceMappingURL=AutoAdmin.js.map