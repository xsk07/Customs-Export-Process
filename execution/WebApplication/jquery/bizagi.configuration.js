var bizagiConfig = {
    /**
     * Define Server to REST services, if services is allocated in the
     * same server to static resources you must leave this field in blank.
     * Note: Without final / slash
     *
     * @default ""
     * @example proxyPrefix: "http://www.example.com/BizAgi-war"
     * @example proxyPrefix: "/REST"
     * @example proxyPrefix: ""
     */
    proxyPrefix: "",
    /**
     * Define relative path to root
     *
     * if your static resources is allocated in some directory (different to root)
     * you must define this var with relative path
     *
     * @default ""
     * @example http://www.example.com/index.html => pathToRoot: ""
     * @example http://www.example.com/BizAgi-war/index.html => pathToRoot: "../"
     * @example http://www.example.com/someDirectory/index.html => pathToRoot: "../"
     * @example http://www.example.com/someDirectory/other/index.html => pathToRoot: "../../"
     * @example http://www.example.com/someDirectory/other/andmore/index.html => pathToRoot: "../../../"
     */
    pathToRoot: "../",
    /**
     * Set default language, it is used if not defined yet
     * List of available languages: en,es,fr,it,ja,nl,pl,pt,ru,zh
     *
     * @default "en"
     * @example defaultLanguage: "es"
     */
    defaultLanguage: "en",
    /**
     * Define bizagi environment
     *
     * @default release
     * @example environment: "release"
     * @example environment: "debug"
     */
    environment: "release",
    /**
     * Define if bizagi has eneble the themes feature
     *
     * @default false
     * @example themesEnabled: false
     * @example themesEnabled: true
     */
    themesEnabled: false,
    /**
     * Enable or disable log
     *
     * @type boolean
     * @default false
     * @example  log: false
     */
    log: false,
    /**
     * Define the maximun number of bytes allowed to upload in render controls,
     * Affected controls: upload, ecm, image
     *
     * @default 1048576 -> 1MB
     */
    uploadMaxFileSize: "1048576",
    /**
     * Show messages in developer tools
     */
    showConsoleLog: true,
    /**
     * Define the url for the CDN for Run cloud environment
     * if the environment is 'debug', this key should be set to ''
     *
     * @example cdn: http://localhost/CDN/
     * @example cdn: https://testbpm.azureedge.net/
     * Azure configuration CDN Multiple origin scenarios:
     * https://azure.microsoft.com/en-us/documentation/articles/cdn-cors/
     * https://regex101.com/r/iX6nU8/2
     * https?:\/\/(\w+\.eastus2.cloudapp.azure\.com\/\w+\/?|localhost\/\w+\/?)$
     */
    cdn: ""
};
