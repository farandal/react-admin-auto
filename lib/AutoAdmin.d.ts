import { ReactNode } from 'react';
import * as React from 'react';
export interface ICustomResourceSubComponent {
    model?: string;
    schema?: AutoAdminAttribute[];
    references?: AutoAdminReference[];
    label?: string;
}
export interface IAutoAdminCustomFieldComponent {
    method: string;
    attribute: AutoAdminAttribute;
}
export interface AutoAdminAttribute {
    attribute: string;
    modelAttribute?: string;
    type: React.FC<IRecord> | string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
    tab?: string;
    label?: string;
    inList?: boolean;
    extended?: boolean;
    readOnly?: boolean;
    isPassword?: boolean;
    fieldOptions?: any;
    action?: any;
    actionProps?: any;
    validate?: (value: any, allValues: any) => JSX.Element | string | undefined;
    pagination?: boolean;
    multiple?: boolean;
    component?: any;
    searchField?: string;
    listAttribute?: string;
    custom?: boolean;
}
export interface AutoAdminReference {
    reference: string;
    target: string;
    tab?: string;
    schema: AutoAdminAttribute[];
}
export interface IRecord {
    id?: string;
    record?: any;
    attribute?: AutoAdminAttribute;
    [key: string]: any;
}
export declare const AttributeToField: (input: AutoAdminAttribute) => JSX.Element;
export declare const AttributeToInput: (input: any) => JSX.Element;
export declare const AutoFormTabs: (schema: AutoAdminAttribute[]) => JSX.Element[];
export interface IAutoTabbedForm {
    schema: AutoAdminAttribute[];
    toolbar?: JSX.Element;
    onSubmit?: (values: any) => any;
    onError?: (error: any) => any;
    mode?: "create" | "update";
    children?: JSX.Element;
}
export declare const AutoTabbedForm: React.FC<IAutoTabbedForm>;
export declare const AutoReferenceFormTab: (reference: AutoAdminReference) => JSX.Element;
export declare const AutoReferenceTab: (reference: AutoAdminReference) => JSX.Element;
export declare const AutoTabs: (schema: AutoAdminAttribute[]) => JSX.Element[];
export interface ITabbedLayout {
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
}
export declare const validate: (schema: AutoAdminAttribute[]) => (values: {
    [field: string]: string | JSX.Element;
}) => {
    [field: string]: string | JSX.Element;
};
export interface IReferenceFilter {
    label: string;
    source: string;
    reference: string;
    optionText: string;
}
export declare const AutoFilterGenerator: (referenceFilters?: IReferenceFilter[]) => (props: any) => JSX.Element;
export interface IAutoTitle {
    record?: any;
    schema: AutoAdminAttribute[];
}
export declare const AutoTitle: React.FC<IAutoTitle>;
export interface IAutoForm {
    schema: AutoAdminAttribute[];
    toolbar?: JSX.Element;
    onSubmit?: (values: any) => any;
    onError?: (error: any) => any;
    mode: "create" | "update";
    children?: any;
}
export declare const AutoCreate: React.FC<IAutoForm>;
export interface IAutoShow {
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
}
export declare const AutoShow: React.FC<IAutoShow>;
export declare const AutoEdit: React.FC<IAutoForm>;
export interface IAutoDataGrid {
    record?: any;
    schema: AutoAdminAttribute[];
    resource?: string;
}
export declare const AutoDataGrid: React.FC<IAutoDataGrid>;
export interface IAutoList {
    schema: AutoAdminAttribute[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
    record?: any;
    resource?: string;
}
export declare const AutoList: React.FC<IAutoList>;
export interface IAutoResource {
    model: string;
    label: string;
    show?: boolean;
    list?: boolean;
    edit?: boolean;
    create?: boolean;
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
}
export declare const AutoResource: ({ model, label, schema, references, exporter, referenceFilters, show, list, edit, create, icon, group }: {
    model: string;
    label: string;
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
    show?: boolean | React.FC;
    list?: boolean | React.FC;
    edit?: boolean | React.FC;
    create?: boolean | React.FC;
    icon?: any | JSX.Element | React.ReactNode;
    group?: string;
}) => JSX.Element;
