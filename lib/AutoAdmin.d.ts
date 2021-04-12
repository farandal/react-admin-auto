import * as React from 'react';
declare type ActionCallback = (id: string) => void;
interface AutoAdminAttribute {
    attribute: string;
    type: string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
    tab?: string;
    label?: string;
    inList?: boolean;
    extended?: boolean;
    readOnly?: boolean;
    fieldOptions?: any;
    action?: ActionCallback | React.ComponentClass<IRecord>;
    validate?: (value: any) => JSX.Element | string | undefined;
}
interface AutoAdminReference {
    reference: string;
    target: string;
    tab?: string;
    schema: AutoAdminAttribute[];
}
interface IRecord {
    id: string;
    record?: any;
}
export interface IReferenceFilter {
    label: string;
    source: string;
    reference: string;
    optionText: string;
}
export declare const AutoFilterGenerator: (referenceFilters?: IReferenceFilter[]) => (props: any) => JSX.Element;
export declare const AutoCreate: (props: any, { schema }: {
    schema: AutoAdminAttribute[];
}) => JSX.Element;
export declare const AutoShow: (props: any, { schema, references }: {
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
}) => JSX.Element;
export declare const AutoEdit: (props: any, { schema }: {
    schema: AutoAdminAttribute[];
}) => JSX.Element;
export declare const AutoDataGrid: (props: any, { schema }: {
    schema: AutoAdminAttribute[];
}) => JSX.Element;
export declare const AutoList: (props: any, { schema, exporter, referenceFilters }: {
    schema: AutoAdminAttribute[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
}) => JSX.Element;
export declare const AutoResource: (modelName: string, { schema, references, exporter, referenceFilters }: {
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
}) => JSX.Element;
export {};
