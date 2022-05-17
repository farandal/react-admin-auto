var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { useCallback } from 'react';
import { ArrayInput, ImageInput, BooleanInput, DateInput, DateTimeInput, NumberInput, SelectArrayInput, SelectInput, TextField, TextInput, ArrayField, BooleanField, ChipField, Create, Datagrid, DateField, Edit, Filter, FormTab, List, NumberField, ImageField, Pagination, PasswordInput, ReferenceArrayField, ReferenceArrayInput, ReferenceField, ReferenceInput, ReferenceManyField, Resource, Show, ShowButton, SimpleFormIterator, SingleFieldList, Tab, TabbedForm, TabbedShowLayout, WithRecord, useResourceContext, useCreate, useCreateContext, } from 'react-admin';
import { useRecordContext } from 'react-admin';
import { useUpdate } from 'react-admin';
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
    return (_jsx(_Fragment, { children: record[source].map((item) => [
            _jsx(Chip, { label: invertedMap && invertedMap[item] ? invertedMap[item] : item }, item),
            _jsx(_Fragment, { children: " " })
        ]) }));
};
const isFC = (Component) => {
    if (typeof Component === "undefined")
        return false;
    return !!Component.name;
};
const isComponent = (Component) => {
    if (typeof Component === "undefined")
        return false;
    return !!Component.name;
    return (typeof Component === 'function'
        && !(Component.prototype
            && Component.prototype.isReactComponent));
};
ListStringsField.defaultProps = { addLabel: true };
const enumToChoices = (e) => Object.keys(e).map((key) => ({ id: e[key], name: key }));
const UserAction = ({ method, attribute }) => {
    if (attribute.component && isFC(attribute.component)) {
        const Action = attribute.component;
        return _jsx(Action, { method: method, attribute: attribute });
    }
    if (attribute.component && isComponent(attribute.component)) {
        const Action = attribute.component;
        return Action(method, attribute);
    }
    if (typeof attribute.action === 'function') {
        const callback = attribute.action;
        return (_jsx(WithRecord, { label: attribute.label, render: record => _jsx(Button, Object.assign({ value: attribute.label, onClick: () => callback(record.id) }, { children: attribute.label })) }));
    }
    return null;
};
export const AttributeToField = (input) => {
    if (input.custom && input.component) {
        return _jsx(UserAction, { method: "view", attribute: input });
    }
    if (Array.isArray(input.type) && input.type.length > 0) {
        const inputType = input.type[0];
        if (!input.label) {
            input.label = input.attribute;
        }
        if (isEnum(inputType)) {
            return _jsx(ListStringsField, { label: input.label, source: input.listAttribute ? input.listAttribute : input.attribute, map: inputType });
        }
        if (typeof inputType === 'string') {
            const [reference, sourceName] = inputType.split('.');
            return (_jsx(ReferenceArrayField, Object.assign({ label: input.label, link: 'show', source: input.listAttribute ? input.listAttribute : input.attribute, reference: reference }, { children: _jsx(SingleFieldList, Object.assign({ link: 'show' }, { children: _jsx(ChipField, { source: sourceName, link: 'show' }) })) })));
        }
        else {
            const inputTypeArray = input.type;
            return (_jsx(ArrayField, Object.assign({ label: input.label, source: input.listAttribute ? input.listAttribute : input.attribute }, { children: _jsx(Datagrid, { children: inputTypeArray.map(attribute => AttributeToField(attribute)) }) })));
        }
    }
    if (typeof input.type === 'string') {
        const [reference, sourceName] = input.type.split('.');
        let filter = {};
        filter.pagination = input.pagination;
        filter.searchField = input.searchField;
        if (input && input.multiple === false) {
            return (_jsx(ReferenceField, Object.assign({ pagination: filter.pagination, filter: true, allowEmpty: true, label: input.label, link: 'show', source: input.listAttribute ? input.listAttribute : input.attribute, reference: reference }, { children: _jsx(TextField, { source: sourceName }) })));
        }
        return (_jsx(ReferenceArrayField, Object.assign({ pagination: filter.pagination, filter: true, label: input.label, link: 'show', source: input.listAttribute ? input.listAttribute : input.attribute, reference: reference }, { children: _jsx(SingleFieldList, Object.assign({ link: 'show' }, { children: _jsx(ChipField, { source: sourceName, link: 'show' }) })) })));
    }
    switch (input.type) {
        case Number:
            return _jsx(NumberField, { label: input.label, source: input.listAttribute ? input.listAttribute : input.attribute, options: input.fieldOptions });
        case Boolean:
            return _jsx(BooleanField, { label: input.label, source: input.listAttribute ? input.listAttribute : input.attribute, options: input.fieldOptions });
        case Date:
            return (_jsx(DateField, { label: input.label, showTime: (input.fieldOptions && input.fieldOptions.showTime) || false, source: input.listAttribute ? input.listAttribute : input.attribute, options: input.fieldOptions }));
        case ImageInput:
            return (_jsx(ImageField, { source: input.attribute, label: input.label }));
    }
    return _jsx(TextField, { label: input.label, source: input.listAttribute ? input.listAttribute : input.attribute, options: input.fieldOptions });
};
export const AttributeToInput = (input) => {
    if (input.readOnly === true) {
        return AttributeToField(input);
    }
    if (!input.label) {
        input.label = input.attribute;
    }
    if (input.custom && input.component) {
        return _jsx(UserAction, { method: "edit", attribute: input });
    }
    if (Array.isArray(input.type) && input.type.length > 0) {
        const inputType = input.type[0];
        if (isEnum(inputType)) {
            return _jsx(SelectArrayInput, { label: input.label, source: input.attribute, choices: enumToChoices(inputType) });
        }
        if (typeof inputType === 'string') {
            const [reference, sourceName] = inputType.split('.');
            const safeIfNull = (choice) => (choice ? choice[sourceName] : '?') || '??';
            if (input && input.multiple === false) {
                return (_jsx(ReferenceInput, Object.assign({ allowEmpty: true, filter: true, pagination: false, label: input.label, reference: reference, source: input.attribute }, { children: _jsx(input.component, { optionText: safeIfNull }) })));
            }
            return (_jsx(ReferenceArrayInput, Object.assign({ filter: true, label: input.label, reference: reference, source: input.attribute }, { children: _jsx(SingleFieldList, Object.assign({ link: 'show' }, { children: _jsx(ChipField, { source: sourceName, link: 'show' }) })) })));
        }
        else {
            const inputTypeArray = input.type;
            return (_jsx(ArrayInput, Object.assign({ label: input.label, source: input.attribute }, { children: _jsx(SimpleFormIterator, { children: inputTypeArray.map(attribute => AttributeToInput(attribute)) }) })));
        }
    }
    if (typeof input.type === 'string') {
        const [reference, sourceName] = input.type.split('.');
        let component = SelectInput;
        if (input.component)
            component = input.component;
        if (input && input.multiple === false) {
            return (_jsx(ReferenceInput, Object.assign({ allowEmpty: true, filters: true, label: input.label, source: input.attribute, reference: reference, sort: { field: sourceName, order: 'ASC' } }, { children: _jsx(input.component, { optionText: sourceName }) })));
        }
        if (input && component == ImageInput) {
            return (_jsx(ImageInput, Object.assign({ source: input.attribute, label: input.label, accept: "image/*" }, { children: _jsx(ImageField, { source: "src", title: "title" }) })));
        }
        return (_jsx(ReferenceArrayInput, Object.assign({ reference: reference, source: input.attribute }, { children: _jsx(SelectArrayInput, { optionText: sourceName }) })));
    }
    switch (input.type) {
        case Number:
            return _jsx(NumberInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Boolean:
            return _jsx(BooleanInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Date:
            return input.fieldOptions && input.fieldOptions.showTime ? (_jsx(DateTimeInput, { label: input.label, source: input.attribute, options: Object.assign(Object.assign({}, input.fieldOptions), { ampm: false }) })) : (_jsx(DateInput, { label: input.label, source: input.attribute, options: input.fieldOptions }));
    }
    if (isEnum(input.type)) {
        return (_jsx(SelectInput, { label: input.label, source: input.attribute, choices: enumToChoices(input.type), options: input.fieldOptions }));
    }
    if (input.isPassword) {
        return _jsx(PasswordInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
    }
    if (input.extended) {
        return _jsx(TextInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
    }
    return _jsx(TextInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
};
const groupByTabs = (schema) => {
    const tabs = [];
    schema.forEach(attribute => {
        let added = false;
        tabs.forEach(tab => {
            const name = tab[0].tab;
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
export const AutoFormTabs = (schema) => {
    return (groupByTabs(schema).map((groupOfAttributes, idx) => (_jsx(FormTab, Object.assign({ label: groupOfAttributes[0].tab || 'Datos' }, { children: groupOfAttributes.map((attribute) => AttributeToInput(attribute)) }), idx))));
};
export const AutoTabbedForm = ({ schema, onSubmit, onError, toolbar, mode, children }) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const [create, { error: createError, isLoading: createLoading, isError: createErrored }] = useCreate();
    const { onCancelCreate, onCreate } = useCreateContext();
    const [update, { isLoading: updateLoading, error: updateErrored }] = useUpdate();
    const onCreateSave = useCallback((values) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield create(resource, { data: values }, {
                returnPromise: true
            });
            if (onSubmit) {
                onSubmit(values);
            }
        }
        catch (error) {
            if (onError) {
                onError(error);
            }
            let response = JSON.parse(localStorage.getItem("lastValidationError"));
            localStorage.removeItem("lastValidationError");
            return response;
        }
    }), [create, onCreate, onError]);
    const onUpdateSave = useCallback((values) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield update(resource, { id: record.id, data: values, previousData: record });
            if (onSubmit) {
                onSubmit(values);
            }
        }
        catch (error) {
            if (onError) {
                onError(error);
            }
            let response = JSON.parse(localStorage.getItem("lastValidationError"));
            localStorage.removeItem("lastValidationError");
            return response;
        }
    }), [update, updateLoading, onError]);
    let onSave = onCreateSave;
    switch (mode) {
        case "update":
            onSave = onUpdateSave;
            break;
        case "create":
            onSave = onCreateSave;
            break;
    }
    return (_jsxs(TabbedForm, Object.assign({ toolbar: toolbar, onSubmit: onSave, validate: validate(schema) }, { children: [AutoFormTabs(schema), children] })));
};
const ExtendedPagination = (props) => _jsx(Pagination, Object.assign({ rowsPerPageOptions: [25, 50, 100, 250, 500, 1000] }, props));
export const AutoReferenceFormTab = (reference) => {
    const record = useRecordContext();
    return (_jsx(FormTab, Object.assign({ label: reference.tab || reference.reference }, { children: _jsx(ReferenceManyField, Object.assign({ reference: reference.reference, target: reference.target, addLabel: false, pagination: _jsx(ExtendedPagination, {}) }, { children: _jsx(AutoDataGrid, { schema: reference.schema, record: record }) })) }), reference.reference));
};
export const AutoReferenceTab = (reference) => {
    const record = useRecordContext();
    return (_jsx(Tab, Object.assign({ label: reference.tab || reference.reference }, { children: _jsx(ReferenceManyField, Object.assign({ reference: reference.reference, target: reference.target, addLabel: false, pagination: _jsx(ExtendedPagination, {}) }, { children: _jsx(AutoDataGrid, { schema: reference.schema, record: record }) })) }), reference.reference));
};
export const AutoTabs = (schema) => {
    return (groupByTabs(schema).map(groupOfAttributes => {
        let label = groupOfAttributes[0].tab || 'Datos';
        return _jsx(Tab, Object.assign({ label: label }, { children: groupOfAttributes.map(attribute => AttributeToField(attribute)) }), "tab_" + label);
    }));
};
const TabbedLayout = (_a) => {
    var { schema, references } = _a, props = __rest(_a, ["schema", "references"]);
    return (_jsxs(TabbedShowLayout, { children: [AutoTabs(schema), references && references.map(reference => AutoReferenceTab(reference))] }));
};
export const validate = (schema) => (values) => {
    const errors = {};
    schema.forEach(field => {
        if (field.validate) {
            try {
                if (field.validate(values[field.attribute], values))
                    errors[field.attribute] = field.validate(values[field.attribute], values);
            }
            catch (e) {
                errors[field.attribute] = 'Validation threw an exception: ' + e;
            }
        }
    });
    return errors;
};
export const AutoFilterGenerator = (referenceFilters) => (props) => {
    return (_jsxs(Filter, Object.assign({}, props, { children: [_jsx(TextInput, { label: 'Search', source: 'q', alwaysOn: true }), referenceFilters &&
                referenceFilters.length > 0 &&
                referenceFilters.map(r => (_jsx(ReferenceInput, Object.assign({ label: r.label, source: r.source, reference: r.reference, allowEmpty: true }, { children: _jsx(SelectInput, { optionText: r.optionText }) }))))] })));
};
export const AutoTitle = (props) => {
    return _jsxs("span", { children: ["Edit ", props.record ? `"${props.record[props.schema[0].attribute]}"` : ''] });
};
export const AutoCreate = ({ schema, toolbar, onSubmit, mode, onError, children }) => {
    return _jsx(Create, { children: _jsx(AutoTabbedForm, Object.assign({ schema: schema, toolbar: toolbar, onSubmit: onSubmit, onError: onError, mode: mode }, { children: children })) });
};
export const AutoShow = (props) => {
    return (_jsx(Show, Object.assign({ title: _jsx(AutoTitle, { schema: props.schema }) }, props, { children: _jsx(TabbedLayout, { schema: props.schema, references: props.references }) })));
};
export const AutoEdit = ({ schema, toolbar, onSubmit, onError, children }) => {
    return (_jsx(Edit, Object.assign({ title: _jsx(AutoTitle, { schema: schema }) }, { children: _jsx(AutoTabbedForm, Object.assign({ mode: "update", schema: schema, toolbar: toolbar, onSubmit: onSubmit, onError: onError }, { children: children })) })));
};
export const AutoDataGrid = (_a) => {
    var { schema, record, resource } = _a, props = __rest(_a, ["schema", "record", "resource"]);
    const schemaIncludesId = schema.filter(attribute => attribute.attribute === 'id').length !== 0;
    return (_jsxs(Datagrid, { children: [!schemaIncludesId && (_jsx(TextField, { source: 'id', onClick: (record &&
                    (() => {
                        console.error("Not implemented");
                    })) ||
                    undefined })), schema.filter(attribute => attribute.inList !== false).map(attribute => AttributeToField(attribute)), _jsx(ShowButton, { resource: resource })] }));
};
export const AutoList = ({ schema, exporter, referenceFilters, record, resource }) => {
    const CustomAutoFilter = AutoFilterGenerator(referenceFilters);
    const _record = record ? record : useRecordContext();
    return (_jsx(List, Object.assign({ exporter: exporter, filters: _jsx(CustomAutoFilter, {}), pagination: _jsx(ExtendedPagination, {}) }, { children: _jsx(AutoDataGrid, { resource: resource, schema: schema, record: _record }) })));
};
export const AutoResource = ({ model, label, schema, references, exporter, referenceFilters, show, list, edit, create, icon, group }) => {
    let props = {};
    if (typeof list !== "boolean" && isFC(list)) {
        const CustomList = list;
        props.list = () => _jsx(CustomList, { schema: schema, exporter: exporter, referenceFilters: referenceFilters });
    }
    else if (list !== false) {
        props.list = () => _jsx(AutoList, { schema: schema, exporter: exporter, referenceFilters: referenceFilters });
    }
    if (typeof show !== "boolean" && isFC(show)) {
        const CustomShow = show;
        props.list = () => _jsx(CustomShow, { schema: schema, references: references });
    }
    else if (show !== false) {
        props.show = () => _jsx(AutoShow, { schema: schema, references: references });
    }
    if (typeof edit !== "boolean" && isFC(edit)) {
        const CustomEdit = edit;
        props.list = () => _jsx(CustomEdit, { schema: schema });
    }
    else if (edit !== false) {
        props.edit = () => _jsx(AutoEdit, { mode: "update", schema: schema });
    }
    if (typeof create !== "boolean" && isFC(create)) {
        const CustomCreate = create;
        props.list = () => _jsx(CustomCreate, { schema: schema });
    }
    else if (create !== false) {
        props.create = () => _jsx(AutoCreate, { mode: "create", schema: schema });
    }
    return _jsx(Resource, Object.assign({ options: Object.assign({ label: label }, (group && { group })), name: model }, props, { icon: icon, group: group }));
};
//# sourceMappingURL=AutoAdmin.js.map