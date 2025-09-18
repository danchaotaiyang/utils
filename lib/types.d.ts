export interface AnyData {
    [key: string]: any;
}
export interface AnyParams extends AnyData {
    platform?: string;
    timestamp?: number;
    nonce?: string;
    version?: string;
    sign?: string;
}
export interface ToolsSignFormatOptions {
    token?: boolean;
    payload?: boolean;
    offset?: number;
    debug?: boolean;
}
export interface ToolsSignFormatProp {
    token?: string;
}
export interface Tree {
    label: string;
    value: any;
    children?: Tree;
}
