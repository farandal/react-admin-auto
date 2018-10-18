/// <reference types="react" />
import { SchemaTypeOpts } from "mongoose";
interface AutoAdminAttribute {
    attribute: string;
    type: SchemaTypeOpts<any>;
}
export default class AutoAdmin {
    static AutoCreate: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
    static AutoShow: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
    static AutoEdit: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
    static AutoList: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
}
export declare const AutoList: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
export declare const AutoShow: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
export declare const AutoEdit: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
export declare const AutoCreate: (props: any, fields: AutoAdminAttribute[]) => JSX.Element;
export {};
