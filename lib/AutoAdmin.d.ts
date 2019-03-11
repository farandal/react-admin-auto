/// <reference types="react" />
interface AutoAdminAttribute {
    attribute: string;
    type: string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
    tab?: string;
    label?: string;
    inList?: boolean;
    extended?: boolean;
    readOnly?: boolean;
    fieldOptions?: any;
}
interface AutoAdminReference {
    reference: string;
    target: string;
    tab?: string;
    schema: AutoAdminAttribute[];
}
export declare const AutoFilter: (props: any) => JSX.Element;
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
export declare const AutoList: (props: any, { schema }: {
    schema: AutoAdminAttribute[];
}) => JSX.Element;
export declare const AutoResource: (modelName: string, { schema, references }: {
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
}) => JSX.Element;
export {};
