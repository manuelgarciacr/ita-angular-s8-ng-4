declare interface ImportMetaEnv {
    readonly NG_APP_MAPBOX_TOKEN: string;
    readonly NG_APP_URL: string;
}

declare interface ImportMeta {
    readonly env: ImportMetaEnv;
}
