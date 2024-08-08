/**
 * IMPORTANT: if you need to modify this javascript file please modify the typescript file
 */
//@ts-ignore
var $ = window.$, 
//@ts-ignore
BrowserDetect = window.BrowserDetect, 
//@ts-ignore
BIZAGI_LANGUAGE = window.BIZAGI_LANGUAGE, 
//@ts-ignore
less = window.less, 
//@ts-ignore
InstallTrigger = window.InstallTrigger, 
//@ts-ignore
DOMPurify = window.DOMPurify, 
//@ts-ignore
printf = window.printf, 
//@ts-ignore
bizagi = window.bizagi;
//@ts-ignore
Object.keys = Object.keys || function (o, k, r) {
    r = [];
    for (k in o)
        r.hasOwnProperty.call(o, k) && r.push(k);
    return r;
};
//@ts-ignore
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
//@ts-ignore
Object.random = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};
/**
 Serialize (Backend)
*/
var _JsonThemeObject = function (data) {
    this.css = data.css || "";
    this.displayName = data.displayName || "";
    this.id = data.id || "";
    this.image = data.image || "";
    this.logo = data.logo || "";
    this.logoLogin = data.logoLogin || "";
    this.name = data.name || "";
    this.predefined = eval(data.predefined) || false;
    this.published = eval(data.published) || false;
    this.thumbs = data.thumbs || [];
    this.value = data.value || "";
    this.version = data.version || "";
    return this;
};
$.widget("bizagi.theme", {
    // default options
    options: {
        path: '',
        colorPickerClass: 'biz-ui-color-picker',
        switchClass: 'biz-ui-switch',
        radioClass: 'biz-ui-radio',
        secureFonts: null,
        previewPage: '',
        previewWebparts: '',
        oneColorTheme: '',
        autoPreview: true,
        thumbs: 3,
        tooltipPreview: false,
        _themeVersion: 0,
        _themeAutoUpdate: true,
        selectedTheme: 0,
        _queue: {},
        _browser: 'Chrome',
        _info: {},
        _themeLessString: '',
        _savedThemes: '',
        _savedThemeList: [],
        _exportThemeString: false,
        _debug: false,
        _dummies: false,
        _animations: false,
        _baseIdLightTheme: '889ccfea-a39f-8597-6bca-08c5ca1254c3',
        _lightThemePreFix: 'Light',
        _baseID: '075bcfae-d36f-4957-9bce-02b5ba8017e1',
        _baseIdBizagiGO: '9b9a9539-e09e-4da4-8d77-f6a02cc8d84e',
        _baseIdLostWoods: '86b8d526-5ff2-4513-b206-2cc77cf2a4cc',
        _baseIdBeezagi: '87dd146b-c877-4ea2-83a7-7a49acb237c5',
        _baseValue: '{\"@skeuomorphic":"active","@flat":"inactive","@lineal":"inactive"}',
        _baseCSSTheme: '/*** Bizagi Theme  ***/',
        predefinedThemes: [],
        _advancedTheme: "",
        _storage: {
            currentTheme: {}
        }
    },
    /**
     * Bizagi Old logos (please update this file too: jquery\workportal\js\desktop\bizagi.workportal.desktop.facade.js)
     */
    LOGOS_OLD_BIZAGI: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAsCAYAAACue3wzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlGM0RBQjU0Q0MyMDExRTU4QTI4QjJFNDQ4MDA3OTdCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlGM0RBQjU1Q0MyMDExRTU4QTI4QjJFNDQ4MDA3OTdCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUYzREFCNTJDQzIwMTFFNThBMjhCMkU0NDgwMDc5N0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUYzREFCNTNDQzIwMTFFNThBMjhCMkU0NDgwMDc5N0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz48uWmlAAAIsklEQVR42uxbe5COVRh/11p3IaFQKOUSNUWSjEtKLkU1ZWpMUTuxckkuCY0/0sZayuiCksiMwhLLuG4uhci1KJpccg8rdt2ysV+/33zPN17vnPPevm+/WeZ9Zn7zfnve8z7nnOc55znP85yzCSlDUs8YhlHOuEp/As9NShu+0wjouqciFuWS7gb6B6K5cRSsolsC0dzYCg4oUHBAgYIDChQcUKDggAIFB6Sjom4qpQxJvQmPxsBdwM3AJeAUsBvYNilt+GW3DQqvPkAxKboILAaPHZZ6NfBI8DieEHAUSAS/f70KwzRO5gL4Ox/IMcLJn83geT5WgkdbXFz3Ag2AKkAJgPwPiUwPeOT3EB4dTUXkNSMBL0KK+guAZ4H2wGtAZ5vJkAvMBz5Bpza56EgrPFZZijlhGuD7PVKnHR5LPMrsLLBdeJcBfgK/DJeC5lh7Aa1trBon8XLgM5mQIZ+KrYNHP+AFoJJN1T+oIGAy2sp2wXc8Hm9ainfoBlMSGAq8DbR1WOmc6a8AP6ORWUAlH+MuDjQz/V3CB4//gCtARaA6wL60dxDK/ew3wInQxmHLogw6AIuAtfi2nkfFlgYm4OdvwBsOyiVxIrwP7MF3fYAEHzJpqBtQMVEczUW2mD431IWzBp15OM7+AJW7H/gF+BV4RvhNkBWqEng3UW4jH+1xMm4Bjy4ulVuLJh7oy+3DY1tMJX8MZIJP2VgJlQq9ACSJ8PI98OR+sgqdeTQKhe3xqNxdwErgB7E6kf29NmexQuA0x9NM9fxQSbESrzool334Eagb5bb9FJAlfkLUCqaD8j2wBpgIDALeEgwERnMfknq6wWeKo+SZ5CSrq5jOBRpkiJLGAqOkP6PFETRTNYvAO8k+6uSsnRQ4Wa8p4NnGxmlbbO2DgriYjgB5DvWaAF97Mde6vTUPQl6H5zqH2VkZj5FAD8VrettfAY/5VPJMPGa6NIFNZG9U7WvHTPX4/ksbVjTxqcAytJ8r35QVP+Qd8bBVi4RCrxf5xkTjxCNXUY68/8bkXJIXveGeQDfNAqTDS6sxtcDjYHTsBNBTPFAVtRaPuMAI/Dng1RrlHhClRWi4oT8poyVohPHMMSsKv88Cc2X1pGq+rQoMsPSrPh7JmvpbGCKB78iIcqWtfGAjwMjlceC05vtU8C9R4Ao2dWwSHuM1r/sWoHIZT8+TLUFF/Sk0qVtKQj4VfYh6g4ErNmMMAe/iZ5qmSm+0kWT6u58mjqe/0Aa8jjjIdJXsuyqzfauEdnHNZI2Q5IeVnnA72zwolvH7GPEuVWOgonpASPNNZdwqVF4okzVDPDQ/jJGCopyWoWWkf+LJq/b2ruhXjsuFsx6PMZrXneOqYJoyPOYqXiVJtiZWymXM/C0wWFPlHGc++vOFpVwXuqV7ycSJRUjXvG4hz5oSTViJe/s2j0MeLxPWSk3jvYIje4uKqsVIuXTcsiTeNjQOVQsIcani3R2ab5b76IouyxYJhWrEqi2M5ZTE0FaqHo2CE3zqIDfG/MzKrSlefXNNld85q21WSDlN+VEfQmfy56LGTJPKaz497HP4BxVliW4SH0U0y7+Kz47cpim/FKVymW3aYJMsoEPSDII/6GPy+U125NksGF1bxX22dUFTnuhGwfsU5Y0g1HI+OtJKU74vCuV2lAyVbtIxId/OheOiU/59BeDgH4hjW44K3qhJgPT2qIh7jGuPqyL0jxE+bvOjXCZQMoFSmipMsnSDcvNcsNusKe9aAHLdr4lhn8eYisZbwfM074aiMw1dKqKYZIhUJuO7SCzqY+VO1vgJ9HqTwXeEh2M7Omeq89wUtFU3lkKV8WYqXtWS+DiuCl4I7FW845nqUgz+QQdFcKPPsHF+PvXZt3Ga8rMSBk31KHSGT1M0e/ACjKNKjGU7UVOehrY6xE3BEgPqAn2m4NajQ+lyKmJWbAUgWYL+pzXfT/MR90VOYOpoPF6GQct8jneUxnRye+F5dusYrmJufbM1299CtDU01gkgQ9MYOzMXjU03wglulefH06RBqHMCz+NG+Kz4doc4mlbB77/AqLxxpviY966PfrxohNN15W14MDqYhbHNNgn9uOzrczRx8kq8p7fOCfQXcEYTEbh1GunHNFPErJTbBwAP8mnKmS/Plq3Hmvk6EYWnf81pUg8RbFub+pUFTnTMpWero0OK+PE9I3yF6EnxRt04K50gwPXox2GTkjNQxpOh0ZpvmmqyRDwaXQts8rCKs8UcM4yrqLGQKYrykExofrc7ivDq6goUT5RnpTOjtArsUHPzKYkP88bVs9U02LEidJ6wNHSp3MgErq3gnybW4LLHxVBUPPpED2PhFtbSJkzTJYZKy7OU4f5GjX0mC525BDBsSBaT4YVoEpn8bwwedibMbWd5gYy3NXjxgFksnqvyMD8pRnvk53g8YoSv+Lih8+J4ljU8pnjRFu9h8f7XdJefUEbnJPYv43IihhwVbOrQVJn5TOg7/Z/wSfGUeb7Zz8XV0p02mR5zH2gOO4iCc2TP9WOqztu0wdiYUcJLRvhaTchhMaw2wrccM31MqDNAd/x8QBSd67CCacUWSax/zkU2bY2OkRuvtqoIooZpBdGj5czc5TXOBb8GItTS5tUvpllVn/30k1nLV9yysOsXDzN46nSnEc4rR67uMFGzQUKtSN0pCvO/AnVSPeQOKNN6psl7QRy4zWZZoO5S8T2u8QlQp6SFZ1uxShG9nk4wAirUBKUxUjiiyOZthYIdb4QG/7pS+GmYoU7VrvbsZAVU6FYvr+UM1Lye4TUODqjwKJYLj3fZ0jWLcAnM8/ZAwYVTeXQWK2gcXt4M5T8MvC7Oly4qcH2RMVBwfJXLA5QBUbCgV98dq3evl4xJQPHzhk9HwYKhaC9J0BjBCi58VD6Kb/8GXoZys7x+GHjRhZt4se8jI5wlzPLDIFjB8SNm1JhatDv6Y0aPhxI8Q18BzJFrs77pfwEGAE4T2uOgrZMVAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMTUgNDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDExNSA0MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8ZyBpZD0iSG9tZV93b3JrUG9ydGFsIj4KCTxnIGlkPSJfMi1WYW5ndWFyZC1EYXJrcyI+CgkJPGcgaWQ9ImJpemFnaV9ob21lX3dvcmtwb3J0YWwiPgoJCQk8ZyBpZD0ibWVudV90b3AiPgoJCQkJPGcgaWQ9ImxvZ28iPgoJCQkJCTxwYXRoIGlkPSJTaGFwZSIgY2xhc3M9InN0MCIgZD0iTTExMS40LDEwLjNjLTAuMy0wLjMtMC43LTAuNS0xLjItMC41aC0yLjhjLTAuMywwLTAuNiwwLjMtMC42LDAuNnYxOS4zYzAsMC40LDAuMiwwLjgsMC41LDEuMQoJCQkJCQljMC4zLDAuMywwLjcsMC41LDEuMiwwLjVoMi44YzAuMywwLDAuNS0wLjMsMC41LTAuNmMwLDAsMCwwLDAsMFYxMS40QzExMS45LDExLDExMS43LDEwLjYsMTExLjQsMTAuM0wxMTEuNCwxMC4zTDExMS40LDEwLjN6IgoJCQkJCQkvPgoJCQkJCTxwYXRoIGlkPSJTaGFwZS0yIiBjbGFzcz0ic3QwIiBkPSJNMzIuNiw5LjhoLTIuOGMtMC4zLDAtMC41LDAuMy0wLjUsMC42YzAsMCwwLDAsMCwwdjE5LjNjMCwwLjQsMC4yLDAuOCwwLjUsMS4xCgkJCQkJCWMwLjMsMC4zLDAuNywwLjUsMS4xLDAuNWgyLjhjMC4zLDAsMC42LTAuMywwLjYtMC42VjExLjRjMC0wLjQtMC4yLTAuOC0wLjUtMS4xQzMzLjUsMTAsMzMsOS44LDMyLjYsOS44TDMyLjYsOS44TDMyLjYsOS44eiIKCQkJCQkJLz4KCQkJCQk8cGF0aCBpZD0iU2hhcGUtMyIgY2xhc3M9InN0MCIgZD0iTTIyLjgsMTIuOWMtMi4yLTItNS4xLTMuMi04LjEtMy4xYy0xLjgsMC0zLjUsMC40LTUuMSwxLjJjLTAuNSwwLjMtMS4xLDAuNy0xLjIsMC43CgkJCQkJCXMwLDAuMSwwLDBjMS0wLjUsMi4xLTAuOSwzLjItMWwwLDBjLTEuMSwwLjMtMi4yLDAuNy0zLjIsMS4zYzAsMCwwLDAuMSwwLDBjMS0wLjUsMi4xLTAuOCwzLjItMC45bDAsMAoJCQkJCQljLTEuMSwwLjMtMi4yLDAuNy0zLjEsMS4zYzAsMCwwLDAuMSwwLDBjMS0wLjQsMi4xLTAuNywzLjItMC43bDAsMGMtMS4xLDAuMi0yLjIsMC41LTMuMiwxYzAsMCwwLDAuMSwwLDAKCQkJCQkJYzEtMC4zLDIuMS0wLjUsMy4yLTAuNWwwLDBjLTEuMSwwLjEtMi4yLDAuNC0zLjIsMC44YzAsMCwwLDAuMSwwLDBjMS4xLTAuMiwyLjItMC4zLDMuMy0wLjJsMCwwYy0xLjEsMC4xLTIuMiwwLjMtMy4zLDAuN2wwLDAKCQkJCQkJYzEuMS0wLjIsMi4yLTAuMiwzLjMtMC4ybDAsMGMtMS4xLDAuMS0yLjIsMC4zLTMuMywwLjVsMCwwYzEsMCwxLjQsMCwzLjEsMGgzLjFjMS43LDAsMy40LDAuNyw0LjUsMmMyLjQsMi4zLDIuNSw2LjIsMC4xLDguNgoJCQkJCQljMCwwLTAuMSwwLjEtMC4xLDAuMWMtMS4yLDEuMi0yLjksMS45LTQuNiwxLjhjLTEuNywwLTMuMy0wLjYtNC41LTEuOGMtMS4yLTEuMS0xLjktMi43LTEuOC00LjRWMi45YzAtMC40LTAuMi0wLjktMC41LTEuMgoJCQkJCQlDNy41LDEuNCw3LDEuMiw2LjYsMS4ySDMuOGMtMC4zLDAtMC41LDAuMi0wLjYsMC41djE4LjhjMCwyLjksMS4yLDUuNywzLjQsNy42YzIuMiwyLjEsNS4xLDMuMiw4LjEsMy4xYzMsMC4xLDUuOS0xLjEsOC4xLTMuMQoJCQkJCQljMi4yLTEuOSwzLjQtNC43LDMuNC03LjZDMjYuMiwxNy42LDI1LDE0LjgsMjIuOCwxMi45TDIyLjgsMTIuOUwyMi44LDEyLjl6Ii8+CgkJCQkJPHBhdGggaWQ9IlNoYXBlLTQiIGNsYXNzPSJzdDAiIGQ9Ik03NS41LDEzQzcxLDguOCw2My45LDguOCw1OS40LDEzYy0yLjIsMS45LTMuNCw0LjctMy40LDcuNWMwLDIuOSwxLjIsNS43LDMuNCw3LjYKCQkJCQkJYzIuMiwyLjEsNSwzLjIsOCwzLjFjMS4zLDAsMi42LTAuMiwzLjgtMC42YzAuOC0wLjMsMS42LTAuNywyLjMtMS4yYzAsMCwwLTAuMSwwLDBjLTEsMC41LTIsMC45LTMuMSwxbDAsMAoJCQkJCQljMS4xLTAuMywyLjItMC44LDMuMi0xLjRjMCwwLDAtMC4xLDAsMGMtMSwwLjUtMi4xLDAuOC0zLjIsMC45bDAsMGMxLjEtMC4zLDIuMi0wLjcsMy4yLTEuMmMwLDAsMC0wLjEsMCwwCgkJCQkJCWMtMSwwLjQtMi4xLDAuNy0zLjIsMC43bDAsMGMxLjEtMC4yLDIuMi0wLjYsMy4yLTEuMWwwLDBjLTEsMC40LTIuMSwwLjYtMy4yLDAuNmwwLDBjMS4xLTAuMiwyLjItMC41LDMuMi0wLjljMCwwLDAtMC4xLDAsMAoJCQkJCQljLTEuMSwwLjMtMi4yLDAuNC0zLjIsMC40bDAsMGMxLjEtMC4yLDIuMi0wLjQsMy4yLTAuN2wwLDBjLTEuMSwwLjItMi4yLDAuMy0zLjIsMC4zbDAsMGMwLjQsMCwyLjMtMC4zLDMuMi0wLjZsMCwwCgkJCQkJCWMtMS40LDAuMS0yLjcsMC4xLTQuMSwwaC0yLjFjLTMuNSwwLTYuMy0yLjctNi40LTYuMmMtMC4xLTEuOCwwLjYtMy42LDEuOS00LjhjMi41LTIuNSw2LjYtMi41LDkuMSwwYzEuMiwxLjEsMS45LDIuNywxLjksNC40CgkJCQkJCVYzMWMwLDAuMiwwLjEsMC4zLDAuMiwwLjRjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjFoMy45YzAuMywwLDAuNS0wLjMsMC41LTAuNlYyMC44Qzc5LDE3LjgsNzcuNywxNSw3NS41LDEzTDc1LjUsMTN6Ii8+CgkJCQkJPHBhdGggaWQ9IlNoYXBlLTUiIGNsYXNzPSJzdDAiIGQ9Ik0zOSwxNC40aDUuNGMwLjYsMCwwLjQsMCwyLTAuMWMxLjQtMC4xLDIuMy0wLjUsMy40LTAuNmwwLDBjLTEsMC0yLDAtMywwLjFsMCwwCgkJCQkJCWMxLjEtMC4zLDIuMy0wLjQsMy40LTAuNWwwLDBjLTEsMC0yLDAtMywwLjFsMCwwYzEuMS0wLjMsMi4zLTAuNSwzLjQtMC41bDAsMGMtMSwwLTIsMC0zLDAuMWwwLDBjMS4xLTAuMywyLjItMC42LDMuMy0wLjdsMCwwCgkJCQkJCWMtMS0wLjEtMi0wLjEtMywwbDAsMGMxLjEtMC4zLDIuMi0wLjQsMy4zLTAuNGwwLDBjLTEtMC4xLTItMC4xLTMsMGwwLDBjMS4xLTAuMywyLjEtMC40LDMuMi0wLjNsMCwwYy0xLTAuMi0yLTAuMi0zLDBsMCwwCgkJCQkJCWMxLTAuMiwyLTAuMywzLjEtMC4zbDAsMGMtMS0wLjItMi0wLjItMy0wLjFsMCwwYzAuOS0wLjIsMS45LTAuMywyLjgtMC4zbDAsMGMtMS0wLjMtMi0wLjMtMy0wLjFsMCwwYzAuOS0wLjIsMS43LTAuMywyLjYtMC4yCgkJCQkJCWwwLDBjLTAuNC0wLjEtMC45LTAuMi0xLjMtMC4ySDM3LjljLTAuMywwLTAuNiwwLjMtMC42LDAuNnYyLjFDMzcuNSwxMy45LDM4LjIsMTQuNCwzOSwxNC40TDM5LDE0LjR6Ii8+CgkJCQkJPHBhdGggaWQ9IlNoYXBlLTYiIGNsYXNzPSJzdDAiIGQ9Ik01Mi41LDI2LjdoLTUuNGMtMC42LDAtMC40LDAtMiwwLjFjLTEuNCwwLjEtMi4zLDAuNS0zLjQsMC42bDAsMGMxLDAsMiwwLDMtMC4xbDAsMAoJCQkJCQljLTEuMSwwLjMtMi4zLDAuNC0zLjQsMC41bDAsMGMxLDAsMiwwLDMtMC4xbDAsMGMtMS4xLDAuMy0yLjMsMC41LTMuNCwwLjVsMCwwYzEsMC4xLDIsMCwzLTAuMWwwLDBjLTEuMSwwLjMtMi4yLDAuNC0zLjQsMC41CgkJCQkJCWwwLDBjMSwwLjEsMiwwLjEsMywwbDAsMGMtMS4xLDAuMy0yLjIsMC40LTMuMywwLjRsMCwwYzEsMC4xLDIsMC4xLDMsMGwwLDBjLTEuMSwwLjMtMi4xLDAuNC0zLjIsMC4zbDAsMGMxLDAuMiwyLDAuMiwzLDBsMCwwCgkJCQkJCWMtMSwwLjItMiwwLjMtMy4xLDAuM2wwLDBjMSwwLjQsMi4xLDAuNiwzLjEsMC42bDAsMGMtMC45LDAuMi0xLjksMC4zLTIuOSwwLjNsMCwwYzEsMC4zLDIsMC4zLDMsMC4xbDAsMAoJCQkJCQljLTAuOSwwLjItMS43LDAuMy0yLjYsMC4ybDAsMGMwLjQsMC4xLDAuOSwwLjIsMS4zLDAuMmgxMS43YzAuMywwLDAuNi0wLjIsMC42LTAuNWMwLDAsMCwwLDAsMHYtMmMwLTAuNC0wLjItMC45LTAuNS0xLjIKCQkJCQkJYy0wLjMtMC4zLTAuNy0wLjUtMS4xLTAuNWwwLDBWMjYuN3oiLz4KCQkJCQk8cGF0aCBpZD0iU2hhcGUtNyIgY2xhc3M9InN0MCIgZD0iTTQyLjIsMjYuN2wxMC43LTkuM2MxLjctMS44LDEuNy00LjYtMC4xLTYuNGMtMC40LTAuNC0wLjktMC43LTEuNC0wLjlsMCwwCgkJCQkJCWMxLDEtMC4zLDIuNy0xLjMsMy43bC0xMS4zLDkuOWMtMC44LDAuOC0xLjIsMi0xLjMsMy4xYzAsMS44LDEsMy40LDIuNiw0LjFsMCwwQzM5LDI5LjQsNDIuMiwyNi43LDQyLjIsMjYuN0w0Mi4yLDI2LjcKCQkJCQkJTDQyLjIsMjYuN3oiLz4KCQkJCQk8cGF0aCBpZD0iU2hhcGUtOCIgY2xhc3M9InN0MCIgZD0iTTEwMC40LDEzYy0yLjItMi4xLTUuMS0zLjItOC4xLTMuMWMtMy0wLjEtNS45LDEuMS04LjEsMy4xYy00LjIsMy44LTQuNSwxMC4zLTAuNywxNC41CgkJCQkJCWMwLjIsMC4yLDAuNCwwLjUsMC43LDAuN2MyLjIsMi4xLDUuMSwzLjIsOC4xLDMuMUg5M2MxLjEtMC4xLDIuMS0wLjMsMy4xLTAuNmMwLjgtMC4zLDEuNi0wLjcsMi4zLTEuMmMwLDAsMC0wLjEsMCwwCgkJCQkJCWMtMSwwLjUtMiwwLjktMy4xLDFsMCwwYzEuMS0wLjMsMi4xLTAuOCwzLjEtMS41YzAsMCwwLTAuMSwwLDBjLTEsMC41LTIuMSwwLjgtMy4yLDAuOWwwLDBjMS4xLTAuMywyLjItMC43LDMuMi0xLjIKCQkJCQkJYzAsMCwwLTAuMSwwLDBjLTEsMC40LTIuMSwwLjctMy4yLDAuN2wwLDBjMS4xLTAuMiwyLjItMC42LDMuMi0xLjFsMCwwYy0xLDAuNC0yLjEsMC42LTMuMiwwLjZsMCwwYzEuMS0wLjIsMi4yLTAuNSwzLjItMC45CgkJCQkJCWMwLDAsMC0wLjEsMCwwYy0xLjEsMC4zLTIuMiwwLjQtMy4yLDAuNGwwLDBjMS4xLTAuMiwyLjItMC40LDMuMi0wLjdsMCwwYy0xLjEsMC4yLTIuMiwwLjMtMy4yLDAuM2wwLDBjMC40LDAsMi4zLTAuMywzLjItMC42CgkJCQkJCWwwLDBjLTEuNCwwLjEtMi43LDAuMS00LjEsMGgtMi4xYy0xLjcsMC0zLjMtMC42LTQuNS0xLjhjLTIuNC0yLjMtMi41LTYuMS0wLjItOC42YzAuMS0wLjEsMC4xLTAuMSwwLjItMC4yCgkJCQkJCWMxLjItMS4yLDIuOC0xLjksNC42LTEuOWMxLjcsMCwzLjMsMC42LDQuNSwxLjljMS4yLDEuMSwxLjksMi43LDEuOCw0LjRjMCwwLDAuMSw5LjgsMCw5LjljLTAuMSwxLjUtMC44LDIuOC0xLjksMy44CgkJCQkJCWMtMS4yLDEuMS0yLjgsMS44LTQuNSwxLjhoLTUuMWMtMC40LDAtMC45LDAuMi0xLjIsMC41Yy0wLjMsMC4zLTAuNSwwLjctMC41LDEuMnYyLjNjMCwwLjMsMC4yLDAuNiwwLjUsMC42YzAsMCwwLDAsMCwwaDYuMgoJCQkJCQljMywwLDUuOS0xLjEsOC4xLTMuMWMyLjMtMiwzLjUtNSwzLjQtOHYtOS4xQzEwMy44LDE3LjksMTAyLjYsMTUsMTAwLjQsMTNMMTAwLjQsMTN6Ii8+CgkJCQk8L2c+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==",
    ],
    /***********************************************************************************
     **  Constructor
     **  Initial configuration builder
     ***********************************************************************************/
    _create: function () {
        var self = this;
        self._languageSetup();
        self.userAuthenticated = false;
        self.userAuthorized = false;
        self.fromOneColorPalette = false;
        self.options._browser = (BrowserDetect.browser) ? BrowserDetect.browser : 'Chrome';
        self.options._version = (BrowserDetect.version) ? BrowserDetect.version : '10';
        self.options.stampVersionCss = '';
        self.counterSources = 0;
        self.limitSources = 0;
        self.globalInterval = [];
        self.layout = {};
        self.layout.bizUiThemesList = null;
        self.layout.bizUiOnePalette = null;
        self.layout.bizUiThemeSaveModal = null;
        self.layout.bizUiThemeSavePanel = null;
        self.layout.bizUiThemeUpdateModal = null;
        self.layout.bizUiThemeUpdatePanel = null;
        self.layout.bizUiControlList = null;
        self.layout.bizUiControlListPanel = null;
        self.listThemeContainerIsOpen = false;
        self.addingNew = false;
        //To ask if the user wants to save the changes applied in the theme
        self.saveBeforeLeave = false;
        self.selectedItemListToSaveBeforeLeave = null;
        self.changeAplied = false;
        self.newCreatedOrUpdatedTheme = false;
        self.options.stampVersionCss = function () {
            var stampVersionCss = '';
            stampVersionCss = '/***************************************\n';
            stampVersionCss += ' ***    @version: ' + self.options._themeVersion + '\n';
            stampVersionCss += ' ***    @date: ' + self._printDate() + '\n';
            stampVersionCss += ' ***    @create: Theme builder\n';
            stampVersionCss += ' **************************************/\n\n';
            return stampVersionCss;
        };
        self.local = {};
        self.local.save = {
            name: ''
        };
        self.resetThemeString = '';
        self.element.empty();
        self.element
            // add a class for theming
            .addClass("custom-theme")
            // prevent double click to select text
            .disableSelection();
        $.when($.get('libs/css/rules.theme.less')).done(function (data) {
            self.themeRulesBase = data;
        });
        $('body', 'html').addClass('biz-theme-builder');
        if (self.options._debug) {
            $.getScript(self.options.mockjax, function () {
                self._debug('loaded Mockjax for debug json dummies');
            });
        }
        // Creates a data service instance
        self.dataService = new bizagi.themebuilder.services.service({});
        self.actionsType = {
            SAVE: "save",
            UPDATE: "update",
            COPY: "copy",
            NEW: "new"
        };
        $.when(self.dataService.getMenuAuthorization(), $.get(self.options._configTheme)).done(function (result) {
            self._authentificationHandler(result);
            self._loadThemeBuilder();
        }).fail(function () {
            self._loadThemeBuilder();
        });
    },
    _loadThemeBuilder: function () {
        var self = this;
        $.when($.get(self.options._configTheme), $.get(self.options._savedThemes)).done(function (data, themes) {
            self.configuration = $.parseJSON(data[0]);
            self.options.secureFonts = self.configuration.theme.css.securefonts;
            self.options.sideBackgrounds = self.configuration.theme.css.sideBackgrounds;
            self.options.path = self.configuration.theme.less;
            self.options.predefinedThemes = $.parseJSON(themes[0]);
            self.options.localization = self.configuration.theme.localization;
            self._setupLocalization();
        });
    },
    _verifyThemesVersion: function () {
        var self = this;
        var version = self.options._themeVersion = self.configuration.theme.version;
        var localVersion = self.options._localVersion = '1.0';
        $.when(self.dataService.getAllThemes(), self.dataService.getCurrentTheme()).done(function (dataA, dataB) {
            if (dataB.id) {
                var isNotMigrated = {
                    value: self.options._baseValue,
                    thumbs: ["#36454E", "#2E516B", "#5D6771", "#DEDEDE"],
                };
                if (!dataB.value) {
                    dataB = $.extend({}, dataB, isNotMigrated);
                }
                var nDataA = [].concat(dataA);
                self.options._storage = {
                    currentTheme: dataB,
                    createdThemes: nDataA
                };
                dataA.push(dataB);
                if (dataB.id == self.options._baseID) {
                    self.options.updateVersion = false;
                }
                else {
                    if (!dataB.version)
                        dataB.version = self.options._localVersion;
                    self.options.updateVersion = bizagi.util.upVersion(dataB.version, self.options._themeVersion);
                }
            }
            self._getLesstoJson();
        }).fail(function (failDataA, failDataB) {
            if (failDataA.status === 401 || failDataB.status === 401) {
                self._createLoginErrorMessage();
            }
        });
    },
    _getLesstoJson: function () {
        var self = this, info;
        if (self.options.updateVersion) {
            self.options._updatingText = bizagi.localization.getResource("widget-theme-builder-updating-themes");
            self._createLoadingOverlay($('body'), self.options._updatingText);
        }
        $.get(self.options.path, function (data) {
            var dataJson = JSON.parse(data);
            self.options.info = dataJson.info;
            self.options.dataSource = dataJson.less;
            self.options.actualKeys = self._getAllKeks();
            if (self.options.updateVersion) {
                self._recreateSavedThemes();
            }
            else {
                self._loadTemplates(self.configuration.theme.templates);
            }
            if (!self.options.updateVersion && self.options._storage.errorUpdateThemeList) {
                self._showAlertToInvalidThemes();
            }
        });
    },
    _getAllKeks: function () {
        var self = this;
        var data = self.options.dataSource;
        var allKeys = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].hasOwnProperty('category')) {
                if (data[i].category.hasOwnProperty('items')) {
                    allKeys = $.extend({}, allKeys, self._getAllItemsKey(data[i].category.items));
                }
                else if (data[i].category.hasOwnProperty('subcategory')) {
                    if (data[i].category.subcategory) {
                        allKeys = $.extend({}, allKeys, self._getAllKeysFromCategory(data[i].category.subcategory));
                    }
                }
            }
        }
        return allKeys;
    },
    _getAllKeysFromCategory: function (data) {
        var self = this;
        var objTmp = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].hasOwnProperty('items')) {
                objTmp = $.extend({}, objTmp, self._getAllItemsKey(data[i].items));
            }
        }
        return objTmp;
    },
    _getAllItemsKey: function (data) {
        var self = this;
        var objTmp = {};
        for (var i = 0; i < data.length; i++) {
            objTmp[data[i].key] = data[i].value;
        }
        return objTmp;
    },
    /*
     *
     */
    _authentificationHandler: function (result) {
        var self = this;
        if (result[0].code != "AUTHENTICATION_ERROR") {
            var i = result[0].permissions.length, j;
            self.userAuthenticated = true;
            var success = false;
            while (i-- > 0) {
                if (result[0].permissions[i].Admin) {
                    j = result[0].permissions[i].Admin.length;
                    while (j-- > 0) {
                        if (result[0].permissions[i].Admin[j] == "ThemeBuilder") {
                            success = true;
                            j = i = 0;
                        }
                    }
                }
            }
            if (success) {
                self.userAuthorized = true;
            }
        }
    },
    _languageSetup: function () {
        var defaultLanguage = bizagi.readQueryString()["language"];
        defaultLanguage = defaultLanguage || (typeof (BIZAGI_LANGUAGE) !== "undefined" ? BIZAGI_LANGUAGE : null);
        bizagi.language = defaultLanguage;
    },
    /***********************************************************************************
     **  Load Templates
     ***********************************************************************************/
    _loadTemplates: function (templates) {
        var self = this;
        self.limitSources = templates.length;
        self._loadTemplate(templates[0]);
    },
    /***********************************************************************************
     **  Load Template
     ***********************************************************************************/
    _loadTemplate: function (resource) {
        var self = this;
        if (resource !== undefined) {
            $.get(resource.src).done(function (data, textStatus) {
                // Translate template
                var translatedTemplate = bizagi.localization.translate(data);
                $.template(resource.name, translatedTemplate);
                self._amountCounterTemplates(resource.src);
            }).fail(function (jqxhr, settings, exception) {
                //console.error(resource, settings, exception);
            });
        }
    },
    /***********************************************************************************
     **  Amount of resources loaded
     ***********************************************************************************/
    _amountCounterTemplates: function (src) {
        var self = this;
        self.counterSources++;
        self._debug(self.counterSources + ' Success to load: ' + src);
        if (self.counterSources == self.limitSources) {
            //Checks if the user is authentiated, and autorized
            if (self.userAuthenticated && self.userAuthorized) {
                self._buildTheme();
            }
            else {
                self._createLoginErrorMessage();
            }
        }
        else {
            self._loadTemplate(self.configuration.theme.templates[self.counterSources]);
        }
    },
    /**
     *
     */
    _setLocalizationSettings: function () {
        var self = this;
        var defer = $.Deferred();
        // Set localization settings
        if (typeof bizagi.localization === "undefined") {
            bizagi.localization = new bizagi.l10n(self.options.localization);
            bizagi.localization.setLanguage(bizagi.language);
            //When the required resources are ready, load the templates
            $.when(bizagi.localization.ready()).done(function () {
                defer.resolve();
            });
        }
        else {
            defer.resolve();
        }
        return defer.promise();
    },
    /**
     *
     */
    _setupLocalization: function () {
        var self = this;
        $.when(self._setLocalizationSettings()).done(function () {
            self._verifyThemesVersion();
        });
    },
    /***********************************************************************************
     **  BuildTheme
     **  Load templates / Layout Generation
     **  Get CSS from less
     ***********************************************************************************/
    _buildTheme: function () {
        var self = this, savedJson, themeLayout, savedThemesLayout, css, bizOutputLines, bizOutputJson, bizUiThemesList, bizUiOnePalette, bizUiThemeSavePanel, bizUiThemeNewPanel, bizUiThemeUpdatePanel, bizUiThemeChangeBackgroundImagePanel, bizUiThemeChangeLogoPanel, onePaletteTheme, saveModal, newModal, updateModal, changeBackgroundImageModal, changeLogoModal, themeTabs;
        self.options.tmpl = {};
        $.extend(self.configuration.theme, {
            updateVersion: self.options.updateVersion
        });
        themeLayout = $.tmpl("custom.theme.layout", self.configuration.theme);
        themeTabs = $.tmpl("custom.theme.layout.tabs", {
            panels: self.configuration.theme.previewPanels
        });
        $('.biz-layout-panel-right', themeLayout).append(themeTabs);
        self.layout.bizUiThemesList = bizUiThemesList = $('.biz-ui-themes-list', themeLayout);
        onePaletteTheme = $.tmpl("custom.theme.ui.controls.color.base", {});
        self.layout.bizUiOnePalette = bizUiOnePalette = $('.biz-ui-one-color-palette', themeLayout);
        bizUiOnePalette.append(onePaletteTheme);
        self.layout.bizUiThemeSavePanel = bizUiThemeSavePanel = $('.biz-ui-theme-save-panel', themeLayout);
        self.layout.bizUiThemeNewPanel = bizUiThemeNewPanel = $('.biz-ui-theme-new-panel', themeLayout);
        self.layout.bizUiThemeUpdatePanel = bizUiThemeUpdatePanel = $('.biz-ui-theme-update-panel', themeLayout);
        self.layout.bizUiThemeChangeLogoPanel = bizUiThemeChangeLogoPanel = $('.biz-ui-theme-change-logo-panel', themeLayout);
        self.layout.bizUiThemeChangeBackgroundImagePanel = bizUiThemeChangeBackgroundImagePanel = $('body');
        var thumbsSaved = [];
        for (var i = 0; i < self.options.thumbs; i++) {
            thumbsSaved.push(i);
        }
        //Save Modal
        self.layout.bizUiThemeSaveModal = saveModal = $.tmpl("custom.theme.ui.controls.save.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeSavePanel.append(saveModal);
        self.layout.bizUiControlModalSave = $('.modal-script', bizUiThemeSavePanel);
        //New Modal
        self.layout.bizUiThemeNewModal = newModal = $.tmpl("custom.theme.ui.controls.new.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeNewPanel.append(newModal);
        self.layout.bizUiControlModalNew = $('.modal-script', bizUiThemeNewPanel);
        //Update Modal
        self.layout.bizUiThemeUpdateModal = updateModal = $.tmpl("custom.theme.ui.controls.update.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeUpdatePanel.append(updateModal);
        self.layout.bizUiControlModalUpdate = $('.modal-script', bizUiThemeUpdatePanel);
        //Change Background Image Modal
        self.layout.bizUiThemeChangeBackgropundImageModal = changeBackgroundImageModal = $.tmpl("custom.theme.ui.controls.change.background.image.panel", {
            bgImages: self.options.sideBackgrounds
        });
        bizUiThemeChangeBackgroundImagePanel.append(changeBackgroundImageModal);
        self.layout.bizUiControlModalChangeBackgroungImage = $('.modal-script', bizUiThemeChangeBackgroundImagePanel);
        //Change logo Modal
        self.layout.bizUiThemeChangeLogoModal = changeLogoModal = $.tmpl("custom.theme.ui.controls.changeLogo.panel", {
            thumbs: thumbsSaved
        });
        bizUiThemeChangeLogoPanel.append(changeLogoModal);
        self.layout.bizUiControlModalChangeLogo = $('.modal-script', bizUiThemeChangeLogoPanel);
        self.layout.bizUiControlModalChangeLogoUnchanged = self.layout.bizUiControlModalChangeLogo.clone(true);
        self.element.append(themeLayout);
        self._createThemeList();
        self._createListThemeVariables();
        /* Generate an output css */
        bizOutputLines = $("#biz-output-lines");
        bizOutputJson = $("#biz-output-json");
        bizOutputJson.val(self.options._themeLessString);
        bizOutputLines.data('change', true);
        $('[title]').tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip',
            position: {
                my: "right center",
                at: "left center"
            }
        });
        $('.is-customizable').hide();
        $('.is-not-customizable').hide();
    },
    /**
     * load the access denied styles
     */
    _loadDeniedStyles: function () {
        var self = this, _isDenied = !self.userAuthenticated || !self.userAuthorized, _ID = "singlePageBaseStyles", _stylesLoaded = $("#" + _ID).length;
        if (_isDenied && !_stylesLoaded)
            $('head').append('<link id="' + _ID + '" rel="stylesheet" href="../css/singlePageBase.css"/>');
    },
    _createLoginErrorMessage: function () {
        var self = this;
        self._loadTemplates(self.configuration.theme.templates);
        $.when(self._setLocalizationSettings()).done(function () {
            var formTemplate;
            self._loadDeniedStyles();
            if (!self.userAuthenticated)
                formTemplate = $.tmpl("access.denied.form", {
                    "message": bizagi.localization.getResource("widget-theme-builder-theme-access-denied-logged")
                });
            else if (!self.userAuthorized)
                formTemplate = $.tmpl("access.denied.form", {
                    "message": bizagi.localization.getResource("widget-theme-builder-theme-access-denied-user")
                });
            if ($("div", formTemplate).length > 0) {
                formTemplate.appendTo($('.biz-theme-generator'));
            }
            $('body', 'html').removeClass('biz-theme-builder');
            $('body', 'html').addClass('biz-form-body');
            //Make room to show the complete form
            $('html').css("height", "100%");
        });
    },
    _returnToLogin: function () {
        window.location.href = window.location.href.substring(0, window.location.href.indexOf("ThemeBuilder"));
    },
    _correctcolorpicker: function () {
        var els = $(".NewColorPicker");
        var parentels = $("#DivModalNewTheme")[0].parentElement;
        var input = $("#NewColorPickerInput");
        input.css("top", "210px");
        input.css("left", "80px");
        els.appendTo(parentels);
    },
    _toggleListColors: function () {
        var self = this, listThemes;
        var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
        if (self._setDefaultAndValidateCertainConditions(currentThemeObj)) {
            $('.biz-ui-control-list .biz-theme-category').show();
        }
        else {
            if (self.newCreatedOrUpdatedTheme === false) { //If it is a new theme or is an updated theme, it doesn't have to show the deafult theme of bizagi
                $('.biz-ui-control-list .biz-theme-category').hide();
                $('[data-key="@one-color-theme"]').css('background-color', '#006c5f');
                $('.sp-preview-inner').css('background-color', '#006c5f');
            }
            else {
                $('.biz-ui-control-list .biz-theme-category').show();
                self.newCreatedOrUpdatedTheme = false;
            }
        }
        if (currentThemeObj === null || currentThemeObj.value === self.options._baseValue) {
            listThemes = $('.biz-ui-themes-list');
            $('.biz-theme-controls', listThemes).removeClass('isClose').addClass('isOpen');
        }
        self._hideSidebarOptionsIfIsLightTheme(self._isLightTheme(currentThemeObj));
    },
    /***********************************************************************************
     **  List Theme Variables
     **  Create Theme Variable  by List / by Category
     ***********************************************************************************/
    _createListThemeVariables: function () {
        var self = this, list, dataForList, info, controlList;
        self.layout.bizUiControlList = controlList = $('.biz-ui-control-list', self.element);
        self._translateThemeVariables();
        dataForList = {
            controls: self.options.dataSource,
            info: self.options.info
        };
        list = $.tmpl("custom.theme.category.list", dataForList);
        controlList.append(list);
        self._createFontFamily();
        self._createBackgroundImages();
        self._applyPlugins();
        self._createShortCutsSpans();
        self._addHandlers();
        if (self.options._themeLessString.length > 1) {
            var queueJson = $.parseJSON(self.options._themeLessString);
            self._refreshFields(queueJson);
        }
        // hide all span elements that contains array values
        self._hideShortCutsElements(['true', 'false', 'inactive', 'active']);
        self._createPreviewPanel();
        //set reset theme
        self.resetThemeString = self._gethemeLessString(false);
    },
    /*
     *
     */
    _translateThemeVariables: function () {
        var self = this;
        var i = self.options.dataSource.length;
        while (i-- > 0) {
            self.options.dataSource[i].category.name = bizagi.localization.getResource(self.options.dataSource[i].category.name) ? bizagi.localization.getResource(self.options.dataSource[i].category.name) : self.options.dataSource[i].category.name;
            if (self.options.dataSource[i].category.subcategory) {
                var j = self.options.dataSource[i].category.subcategory.length;
                while (j-- > 0) {
                    self.options.dataSource[i].category.subcategory[j].name = bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j]) ? bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].name) : self.options.dataSource[i].category.subcategory[j].name;
                    if (self.options.dataSource[i].category.subcategory[j].items) {
                        var k = self.options.dataSource[i].category.subcategory[j].items.length;
                        while (k-- > 0) {
                            if (bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].items[k].label))
                                self.options.dataSource[i].category.subcategory[j].items[k].label = bizagi.localization.getResource(self.options.dataSource[i].category.subcategory[j].items[k].label);
                        }
                    }
                }
            }
            else if (self.options.dataSource[i].category.items) {
                var l = self.options.dataSource[i].category.items.length;
                while (l-- > 0) {
                    if (bizagi.localization.getResource(self.options.dataSource[i].category.items[l].label))
                        self.options.dataSource[i].category.items[l].label = bizagi.localization.getResource(self.options.dataSource[i].category.items[l].label);
                }
            }
        }
    },
    /*
     *
     */
    _hideShortCutsElements: function (key) {
        var self = this;
        if (typeof key === 'string') {
            $(".noColor:contains('" + key + "')", self.element).addClass('biz-ui-hide');
        }
        else {
            for (var i = 0; i < key.length; i++) {
                $(".noColor:contains('" + key[i] + "')", self.element).addClass('biz-ui-hide');
            }
        }
    },
    /*
     *
     */
    _gethemeLessString: function () {
        var self = this;
        var tmpStr = '';
        var controlList = self.layout.bizUiControlList;
        var baseColor = $('.biz-theme-control .biz-one-color-theme');
        tmpStr += '{';
        $('input', controlList).each(function () {
            tmpStr += '\"' + $(this).data('key') + '\":\"' + $(this).val() + '\",';
        });
        tmpStr += '\"' + baseColor.data('key') + '\":\"' + baseColor.val() + '\",';
        tmpStr += '}';
        tmpStr = tmpStr.replace('",}', '"}');
        return tmpStr;
    },
    _loadNewThemeSelected: function () {
        var self = this;
        if (self.saveBeforeLeave) { //if there was a change saved and it was selected another theme in the list, load the theme that was selected in the list
            self._selectTheme(self.selectedItemListToSaveBeforeLeave);
            /*Hide Reset Button*/
            self._resetButton("hide");
            self.saveBeforeLeave = false;
        }
    },
    /*
     * This method is called when select a theme, and if this need to be published!
     */
    _selectTheme: function (_instancia, publish) {
        var self = this;
        var _input = $('input', _instancia);
        var parent = _instancia.closest('.biz-ui-theme-pre-build');
        //Check if the element is already selected
        if (_instancia.hasClass('active')) {
            //Clears the current selected theme
            self.currentSelectedThemeID = "";
            _instancia.removeClass('active');
            self._restoreTitle();
        } //if not, apply the selected theme
        else {
            //Stores the current selected theme
            self.currentSelectedThemeID = _instancia.attr('id');
            //Add the active
            self.options._themeLessString = _input.val();
            self.options._advancedTheme = _input.data("advanceCss");
            self.fromOneColorPalette = false;
            var name = $('h4', _instancia).text();
            var thumbs = $('.biz-ui-thumbs-theme span', _instancia).clone();
            self._changeTitle(name);
            $('.biz-theme-name', parent).text(name);
            $('.biz-ui-thumbs-theme:first', parent).empty().append(thumbs);
            var queueJson = (self.options._themeLessString.length > 0) ? $.parseJSON(self.options._themeLessString) : '';
            self._refreshFields(queueJson);
            self._selectActiveTheme(self.currentSelectedThemeID);
        }
        if (self.currentSelectedThemeID === self.options._baseIdBizagiGO) {
            $('.is-customizable').hide();
            $('.is-not-customizable').show();
        }
        else {
            $('.is-customizable').show();
            $('.is-not-customizable').hide();
        }
        if (publish) {
            var id = (_instancia.attr('id')) ? _instancia.attr('id') : undefined;
            self._publishService(id);
        }
    },
    /*
     *
     */
    _addHandlers: function () {
        var self = this, controlList;
        self.element.on('change', 'input', function () {
            if (!self.fromOneColorPalette) {
                var _self = $(this);
                if (_self.hasClass('biz-one-color-theme')) {
                    self._createOneColorTheme(_self);
                }
                self._addtoQueue(_self);
                var key = _self.data('key');
                $('span[data-key="' + key + '"]').css('background-color', _self.val());
                // the smart contrast switch is triggered by code, the idea is prevent modify the changeAplied variable
                if (_self.val() !== "false" && _self.val() !== "true") {
                    self.changeAplied = true; //When change the color, or style
                }
            }
            else {
                //TODO:Check this reset options for "Select theme"
                $('.biz-ui-selected-theme .biz-theme-name').text(bizagi.localization.getResource("widget-theme-builder-controls-label-select-a-theme"));
                $('.biz-ui-selected-theme .biz-ui-thumbs-theme').empty();
                var _self = $(this);
                var key = _self.data('key');
                $('span[data-key="' + key + '"]').css('background-color', _self.val());
            }
        });
        self.element.on('click', '.biz-ui-theme-part', function () {
            var _self = $(this);
            if (self.changeAplied) { //If there is a change applied and user changes the theme, a message to ask if changes have to be saved appears.
                var confirmSaveChange = confirm(bizagi.localization.getResource("confirmation-savebox-message1"));
                if (confirmSaveChange) { //If user select ok
                    self.saveBeforeLeave = true; //To know if there was a change when another theme is selected.
                    self.selectedItemListToSaveBeforeLeave = _self; //Theme of the list that was selected, to go there after save or not save (depends on the selection of the user in the modal) the changes applied.
                    self._readyForSave(true); //To show the modal to confirm update or save new theme
                }
                else {
                    self.changeAplied = false;
                    self._selectTheme(_self); //To go to the theme selected
                    /*Hide Reset Button*/
                    self._resetButton("hide"); //hide the reset button
                }
            }
            else {
                self._selectTheme(_self);
                /*Hide Reset Button*/
                self._resetButton("hide");
            }
        });
        self.element.on('click', '.biz-theme-delete', function (e) {
            e.stopPropagation();
            var partTheme = $(this).closest('.biz-ui-theme-part');
            self._deleteTheme(partTheme.attr('id'));
        });
        $('.biz-theme-reset').click(function () {
            self._reset();
        });
        $('.biz-theme-save').click(function () {
            self._readyForSave(true);
        });
        $('.biz-theme-new').click(function () {
            self.addingNew = true;
            self._toggleListColors();
            self._readyForNew();
            self._correctcolorpicker();
            self._newThemeRadioButtonText();
        });
        $('#logo').click(function () {
            self._readyForChangeLogo();
        });
        //Modal New
        $('.biz-ui-theme-new').click(function () {
            var name = $('input[name="name"]', self.layout.bizUiControlModalNew).val();
            if (name !== "" && name !== undefined && name !== null) {
                var originBg = "none", lightThemeIsChecked = $("#biz-radio-select-light:checked").val() ? true : false;
                $('input[data-key="@sidebar-image-theme"]').val(originBg);
                self.options._advancedTheme = "";
                self.newCreatedOrUpdatedTheme = true;
                $('.' + self.options.oneColorTheme).change();
                self.layout.bizUiControlModalNew.removeClass('biz-ui-hide').dialog("close");
                self.local.save.displayName = name;
                self._changeTitle(name);
                $('input[name="name"]', self.layout.bizUiControlModalNew).val('');
                var saveReference = $('.modal-save');
                $('input[name="name"]', saveReference).val(self.local.save.displayName);
                self._readyForSave(true, lightThemeIsChecked);
            }
            else {
                self._showValidationErrorMessage(".alert-new-theme", bizagi.localization.getResource("widget-theme-builder-modal-error-no-theme-name"));
            }
        });
        //Input of modal new 
        $('input[name="name"]', self.layout.bizUiControlModalNew).change(function () {
            self._hideErrorMessageWhenInputIsNotEmpty($(this));
        });
        //Input of modal update 
        $('input[name="name"]', self.layout.bizUiControlModalUpdate).change(function () {
            self._hideErrorMessageWhenInputIsNotEmpty($(this));
        });
        //Modal Save
        $('.biz-ui-theme-save').click(function () {
            self.layout.bizUiControlModalSave.removeClass('biz-ui-hide').dialog("close");
            self._saveService(self.actionsType.SAVE);
        });
        //Modal Update
        $('.biz-ui-theme-update').click(function () {
            var name = $('input[name="name"]', self.layout.bizUiControlModalUpdate).val();
            if (name !== "" && name !== undefined && name !== null) {
                self.newCreatedOrUpdatedTheme = true;
                self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog("close");
                self._saveService(self.actionsType.UPDATE); //sents the parameter in true indicating that is for "update"
            }
            else {
                self._showValidationErrorMessage(".alert-new-theme", bizagi.localization.getResource("widget-theme-builder-modal-error-no-theme-name"));
            }
        });
        $('.biz-ui-theme-save-copy').click(function () {
            var name = $('input[name="name"]', self.layout.bizUiControlModalUpdate).val();
            if (name !== "" && name !== undefined && name !== null) {
                self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog("close");
                self._saveService(self.actionsType.COPY); //save
            }
            else {
                self._showValidationErrorMessage(".alert-new-theme", bizagi.localization.getResource("widget-theme-builder-modal-error-no-theme-name"));
            }
        });
        //To show a message when user try to close or reload the browser.
        $(window).on('beforeunload', function (e) {
            if (self.changeAplied) { //If there is a change, it has to appears the message to confirm if leave or not the page
                // Firefox 1.0+
                var isFirefox = typeof InstallTrigger !== 'undefined'; //Cause: Firefox's API to install add-ons: InstallTrigger
                //Next validation is to show the message by default in all browsers: 
                if (isFirefox) { //This validation is required because the message shown here is by default the browser's even if there is a message here (in Firefox and Chrome), but in Firefox it's necesary return something even if this message won't be shown (it works like a flag)
                    return bizagi.localization.getResource("confirmation-savebox-message2");
                }
                else { //In IE when it returns '' only appears the message by default, otherwise put the message by dafault + message returned here. In Chrome nomatter what, always return the message by default.
                    return '';
                }
            }
        });
        /* Deprecated biz-theme-preview handler */
        self._addHandlerCategoryPanels(self.element);
        self.element.on("click", ".biz-theme-options-shortcut > span", function (e) {
            $('.biz-ui-control-list .biz-theme-category').show();
            var _self, key, input, h, parent;
            e.preventDefault();
            e.stopPropagation();
            self.fromOneColorPalette = false;
            _self = $(this);
            key = _self.data('key');
            input = $('input[data-key="' + key + '"]');
            input.data('spanFired', true);
            if (_self.hasClass('noColor')) {
                input.next().toggleClass('isOpen isClose').addClass('upLevel');
                input.closest('.biz-theme-controls').width(_self.outerWidth());
                //input.next().width(_self.outerWidth());
                h = ((input.next().height() / 2) - (_self.parent().height() / 2)) * (-1) + 'px';
                parent = _self.closest('.biz-theme-category');
                $('h3', parent).addClass('biz-active');
                input.next().css({
                    top: h
                });
            }
            else {
                input.spectrum("show");
            }
            self._hideSidebarOptionsIfIsLightTheme(self._selectedThemeInSidebarIsLight());
        });
        $('.biz-ui-theme-add-thumb').click(function () {
            var _self = $(this);
            var parent = _self.parent();
            var colorThumb = $('input', parent).val();
            $('.biz-ui-theme-list-thumbs', parent).append('<span style="background-color:' + colorThumb + '"></span>');
        });
        $('.biz-theme-reload').click(function () {
            $.when($.get('libs/css/rules.theme.less')).done(function (data) {
                self.themeRulesBase = data;
            });
        });
        self.element.on('click', '.biz-theme-publish', function (e) {
            var $this = $(this);
            e.stopPropagation();
            self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-publishing-theme"), function () {
                var themeSelector = $this.closest('.biz-ui-theme-part');
                self._selectTheme(themeSelector, true);
                /*Hide Reset Button*/
                self._resetButton("hide");
            });
        });
        $(window).resize(function () {
            self._refreshPanelHeights();
        });
    },
    _changeTitle: function (text) {
        var self = this;
        text = bizagi.util.sanitizeHTML(text);
        $('.biz-ui-theme-header .biz-theme-title', self.element).fadeOut(function () {
            $('.biz-ui-theme-header .biz-theme-name', self.element)
                .html(bizagi.localization.getResource("widget-theme-builder-theme-prefix") + '<span class="biz-theme-separator-ltr"> > </span>' + text)
                .fadeIn();
        });
    },
    _restoreTitle: function (text) {
        var self = this;
        text = bizagi.util.sanitizeHTML(text);
        $('.biz-ui-theme-header .biz-theme-name', self.element).fadeOut(function () {
            $('.biz-ui-theme-header .biz-theme-title', self.element).fadeIn();
        });
    },
    _restoreLogo: function () {
        var self = this;
        //selects the logo speified for the active theme
        self._selectLogoForActiveTheme(self.currentSelectedThemeID);
    },
    /**
     * decide what logo to show
     * if logo saved in DB is old logo, the logo is reeplaced by DefaultLogo
     */
    _changeLogo: function (newSrc, isDefaultLogo, isLightTheme, isBizagiGoTheme) {
        var self = this, _oldLogo = self.LOGOS_OLD_BIZAGI, _isOldLogo = _oldLogo.indexOf(newSrc) !== -1;
        var src = _isOldLogo ? self._getDefaultLogoPathForWorkportal(false, false) : newSrc;
        //sets the default logo, it asks firts to set the old logo
        src = isDefaultLogo ? self._getDefaultLogoPathForWorkportal(isLightTheme, isBizagiGoTheme) : src;
        $('#logo').find('img').attr('src', src);
        self._refreshWorkportalLogo(src);
    },
    _getImageDataFromService: function (selectedFile, callback) {
        var self = this;
        var $logoContent = $('.modal-change-logo');
        if (selectedFile && selectedFile[0]) {
            self._createLoadingOverlay($logoContent, '...');
            //calls the service to get the base64 data
            $.when(self.dataService.getImageData(selectedFile[0])).done(function (result) {
                if (result.isValid) {
                    //sets the image data returned from the service
                    if (typeof callback == "function") {
                        callback(result.data);
                    }
                    else {
                        self._setLogoData(result.data);
                    }
                    //closes the dialog and hides the loading
                    self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog("close");
                }
                else {
                    self._showerrorMessage(result.messageCode);
                }
                self._removeLoadingOverlay($logoContent);
            }).fail(function (error) {
                self._removeLoadingOverlay($logoContent);
            });
        }
    },
    _getImageDataFromIframe: function () {
        var self = this;
        var $logoContent = $('.modal-change-logo');
        var $content = self.layout.bizUiControlModalChangeLogo;
        self._createLoadingOverlay($logoContent, '...');
        //uses the old way to get the base64 data
        $.when(self.dataService.getImageDataFromIframe($content, self.layout.$uploadIframe)).done(function (result) {
            if (result.isValid) {
                //sets the image data returned from the service
                self._setLogoData(result.data);
                //closes the dialog and hides the loading
                self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog("close");
            }
            else {
                self._showerrorMessage(result.messageCode);
            }
            self._removeLoadingOverlay($logoContent);
        }).fail(function (error) {
            self._removeLoadingOverlay($logoContent);
        });
    },
    _setLogoData: function (data) {
        var self = this;
        //sets the logo with the data returned by the service
        self.logo = data;
        //modifies the variable to report the changes
        //self._modifyVars();
        self._changeLogo(data);
        self._activeSaveButton();
    },
    _showerrorMessage: function (messageCode) {
        var errorContainer = $("#alert-file-upload");
        // Empty container
        errorContainer.empty();
        errorContainer.show();
        if (messageCode == 101) {
            errorContainer.html(bizagi.util.sanitizeHTML(bizagi.localization.getResource("widget-theme-builder-modal-error-file-extension")));
        }
        else if (messageCode == 102) {
            errorContainer.html(bizagi.util.sanitizeHTML(bizagi.localization.getResource("widget-theme-builder-modal-error-file-size")));
        }
    },
    _showValidationErrorMessage: function (container, message) {
        var errorContainer = $(container);
        // Empty container
        errorContainer.empty();
        errorContainer.show();
        errorContainer.html(bizagi.util.sanitizeHTML(message));
    },
    _hideErrorMessageWhenInputIsNotEmpty: function (input) {
        if ($(".alert-new-theme").css('display') === 'block' && input.val() !== "" && input.val() !== undefined && input.val() !== null) {
            $(".alert-new-theme").hide();
        }
    },
    _refreshWorkportalLogo: function (src) {
        this.logo = src;
        $('.biz-ui-theme-panel-workportal').contents().find('#ui-bizagi-wp-app-menu-logo-client img').attr('src', src);
    },
    /*
     *
     */
    _addHandlerCategoryPanels: function (_instance) {
        var self = this;
        self.actualHighligthed = [];
        _instance.on('click', 'h3', function () {
            var $h3 = $('.biz-theme-category > h3', _instance);
            var $this = $(this);
            $('.biz-theme-category > h3 + .biz-theme-controls', _instance).addClass('isClose');
            if ($this.closest('.biz-theme-controls-item').length === 0) {
                if ($this.next().hasClass('isOpen')) {
                    $this.removeClass('biz-active');
                    $this.next().slideUp(function () {
                        $(this).removeClass('isOpen').addClass('isClose');
                    });
                }
                else {
                    $this.addClass('biz-active');
                    $this.next().slideDown(function () {
                        $(this).removeClass('isClose').addClass('isOpen');
                    });
                }
            }
        });
        /** show a related section **/
        _instance.on('mouseenter', 'h3[data-related]', function () {
            var $this = $(this);
            var keySearch = $this.data('related');
            var keyArray = keySearch.split(',');
            var _selfIframe = $('iframe');
            $.each(_selfIframe, function () {
                var $thisIframe = $(this);
                for (var i = 0; i < keyArray.length; i++) {
                    var $tmp = $thisIframe.contents().find(keyArray[i]);
                    if ($tmp.length > 0) {
                        self.actualHighligthed.push($tmp);
                        $tmp.addClass('highlight');
                        $tmp.attr('data-selection', $this.text());
                    }
                }
            });
        });
        _instance.on('mouseleave', 'h3[data-related]', function () {
            $.each(self.actualHighligthed, function (item, value) {
                value.removeClass('highlight');
            });
        });
        $('.biz-theme-category > h3 + .biz-theme-controls', _instance).addClass('isClose');
    },
    /*
     *
     */
    _createShortCutsSpans: function () {
        var self = this;
        $('.biz-theme-options-shortcut span').each(function () {
            var _self = $(this);
            var isColor = self.isValidColor(_self.text());
            var insideHtml = '';
            if (isColor) {
                _self.css('background-color', _self.text());
                _self.html(insideHtml);
            }
            else {
                if (_self.data('key').indexOf('font') != -1) {
                    _self.css('font-family', _self.text());
                    _self.addClass('font-dropdown');
                    _self.closest('.biz-theme-options-shortcut').addClass('biz-full-size');
                    _self.closest('h3').addClass('biz-full-size');
                }
                _self.addClass('noColor');
            }
        });
    },
    /*
     *
     */
    _applyPlugins: function () {
        var self = this, controlList;
        $('.biz-layout-tabs', self.element).tabs({
            beforeLoad: function (event, ui) {
                ui.jqXHR.error(function () {
                    ui.panel.html("Couldn't load this tab. We'll try to fix this as soon as possible. " +
                        "If this wouldn't be a demo.");
                });
            }
        });
        /* color inputs */
        controlList = $('.biz-ui-control-list', self.element);
        $('input', controlList).each(function () {
            var $this = $(this);
            var elVal = $this.val();
            if (elVal.indexOf('#') != -1) {
                $this.addClass(self.options.colorPickerClass);
            }
            if (elVal === 'true' || elVal === 'false') {
                $this.addClass(self.options.switchClass);
            }
            if (elVal === 'active' || elVal === 'inactive') {
                $this.addClass(self.options.radioClass);
            }
        });
        self._createSwitch();
        self._createRadioButtons();
        $('.biz-ui-theme-thumbs-selector > input').spectrum({
            autoUpdate: self.getAutoUpdate(),
            flat: false,
            showInput: true,
            clickoutFiresChange: true,
            cancelText: 'X',
            chooseText: bizagi.localization.getResource("widget-theme-builder-controls-label-apply"),
            move: function (color) {
                $(this).spectrum("set", color.toHexString());
                $('.' + self.options.oneColorTheme).val($(this).val());
            }
        });
        $('.' + self.options.colorPickerClass).spectrum({
            autoUpdate: self.getAutoUpdate(),
            flat: false,
            showInput: true,
            clickoutFiresChange: true,
            cancelText: 'X',
            chooseText: bizagi.localization.getResource("widget-theme-builder-controls-label-apply"),
            show: function (color) {
                var _self = $(this);
                var pos = 0;
                var top = _self.css('top');
                var left = _self.css('left');
                _self.data('oPos', {
                    top: top,
                    left: left
                });
                var sp = $('.sp-container:visible');
                if (_self.data('spanFired')) {
                    var key = _self.data('key');
                    pos = $('span[data-key="' + key + '"]').offset();
                    _self.data('spanFired', false);
                }
                else {
                    if (_self[0].id === "NewColorPickerInput") {
                        pos = { top: top, left: left };
                    }
                    else {
                        pos = _self.next().offset();
                    }
                }
                var validH = pos.top + sp.height();
                var wH = $(window).height();
                if (validH > wH) {
                    pos.top = pos.top - sp.height();
                }
                sp.css({
                    top: pos.top,
                    left: pos.left + _self.next().width()
                });
            },
            change: function (color) {
                self.changeColor = true;
            }
        });
        $('.biz-ui-control-panel').scroll(function () {
            $('.' + self.options.colorPickerClass).spectrum('hide');
        });
    },
    /*
     *
     */
    getAutoUpdate: function () {
        return false;
    },
    /***********************************************************************************
     **  Add to Queue
     **  Queue of variables to modify in Less
     ***********************************************************************************/
    _addtoQueue: function (field) {
        var self = this;
        var key = field.data('key');
        var value = (field.val()) ? field.val() : field.data('value');
        self.options._queue[key] = value;
        self._modifyVars();
        self._activeSaveButton();
    },
    _activeSaveButton: function () {
        var self = this;
        $('.biz-ui-button.biz-theme-save').removeClass('biz-ui-hide');
    },
    _inactiveSaveButton: function () {
        var self = this;
        $('.biz-ui-button.biz-theme-save').addClass('biz-ui-hide');
    },
    /*
     *
     */
    _createOneColorTheme: function (el) {
        var self = this;
        var oneColor = el.val();
        var obj = self._findElementsByAttribute('all', self.options.dataSource, 'lessFunction');
        var _queue = '{"@one-color-palette":"' + oneColor + '"';
        if (self.newCreatedOrUpdatedTheme === true) { //When theme is created or updated the Qone-color-theme has to be added in the json to set all the configuration of the theme.
            _queue = _queue + ',"@one-color-theme":"' + oneColor + '"';
        }
        _queue += self._recursiveExploreCategories(obj);
        _queue += '}';
        _queue = _queue.replace(/("")/g, '","').replace(/(\(@one-color-palette, @one-color-palette%\))/g, '@one-color-palette');
        var queueJson = $.parseJSON(_queue);
        self.fromOneColorPalette = true;
        self._refreshFields(queueJson);
    },
    /*
     *
     */
    _recursiveExploreCategories: function (arr) {
        var self = this;
        var _data = '';
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'object' && arr[i].length > 0) {
                _data += self._recursiveExploreCategories(arr[i]);
            }
            else {
                var tmpFunctionLess = arr[i].lessFunction;
                _data += '"' + arr[i].key + '":"' + tmpFunctionLess + '"';
            }
        }
        return _data;
    },
    /*
     *
     */
    _refreshFields: function (queueJson) {
        var self = this;
        self._toggleListColors();
        var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
        self._enableDefaultLightThemeStyleSheet(self._isLightTheme(currentThemeObj));
        if (self._setDefaultAndValidateCertainConditions(currentThemeObj)) {
            var oneColor = $('.' + self.options.oneColorTheme).val();
            for (var prop in queueJson) {
                var inputChange = $("input[data-key='" + prop + "']");
                if (inputChange.hasClass('biz-ui-color-picker')) {
                    var realVal = self._getRealValue(queueJson[prop], oneColor);
                    self.fromOneColorPalette = true;
                    inputChange.spectrum("set", realVal);
                    inputChange.val(realVal);
                    $('span[data-key="' + prop + '"]').css('background-color', realVal);
                    if ($('.sp-preview-inner', inputChange.siblings('.sp-replacer.sp-light')).css('background-color') === 'rgb(0, 108, 95)') { //It is because when the selected theme is the default theme, the background for the base color select picker is set, so when another theme is selected, this background is keep, so this is in order to avoid that.
                        $('.sp-preview-inner', inputChange.siblings('.sp-replacer.sp-light')).css('background-color', realVal);
                    }
                }
                else if (prop.indexOf('image-') !== -1) {
                    inputChange.val(queueJson[prop]);
                    $('span[data-key="' + prop + '"]').css('background-image', queueJson[prop].replace('jquery/', '../jquery/'));
                    self._selectBackgroundImageOnModal();
                }
                else {
                    inputChange.val(queueJson[prop]);
                    self._refreshPlugins();
                }
            }
            $.extend(self.options._queue, queueJson);
            self._modifyVars(queueJson);
            self.fromOneColorPalette = false;
        }
        else {
            var selector = $('.biz-ui-theme-pre-build > h3');
            var idSelector = $('#' + self.currentSelectedThemeID);
            var thumbs = $('.biz-ui-thumbs-theme span', idSelector).clone();
            $('.biz-ui-thumbs-theme:first', selector).empty().append(thumbs);
            self._resetVarsCss();
        }
        //selects the logo speified for the active theme
        self._selectLogoForActiveTheme(self.currentSelectedThemeID);
    },
    /*
     *
     */
    _getRealValue: function (func, color) {
        var parser = new (less.Parser);
        var result = 'Error in _getRealValue :' + func + ' ' + color;
        var _queue = '@one-color-palette: ' + color + '; @one-color-theme: ' + color + ';';
        try {
            parser.parse(_queue + ' .class { color: ' + func + '; }', function (err, tree) {
                result = tree.toCSS();
            });
        }
        catch (e) {
            this._debug(e);
            this._debug(_queue);
            this._debug(func);
        }
        result = result.replace(/(\.[a-z]*\s+\{\s+[a-z:]*\s+(.*)\;\s+})/g, '$2').replace(/(\r\n|\n|\r)/g, '').replace(/\s{2}/g, '');
        return result;
    },
    /*
     *
     */
    isValidColor: function (str) {
        return str.match(/^#[a-f0-9]{6}$|^#[a-f0-9]{3}$/i) !== null;
    },
    /***********************************************************************************
     **  Execute Modify vars in Less
     **  modifyvars Less with queue variables
     ***********************************************************************************/
    _modifyVars: function (_queue) {
        var self = this;
        var queue = (_queue) ? _queue : self.options._queue;
        var color = $('.' + self.options.oneColorTheme).val();
        var toExport = "";
        /*Active Reset Button*/
        self._resetButton("show");
        //@ts-ignore
        if (Object.size(queue) > 0) {
            $("#biz-output-lines").data('change', true);
        }
        self._printDebugQueue(queue);
        //less.modifyVars(queue);
        var str = "{";
        for (var prop in queue) {
            str += '"' + prop + '":"' + self._getRealValue(queue[prop], color) + '",';
        }
        str += "}";
        str = str.replace(/(\,\})/g, '}');
        self.options._themeLessString = str;
        //TODO:Comment this line for produccion
        /*console.info(self.options._themeLessString.replace(/(")/gi, '\\"'));*/
        if (self.options._exportThemeString) {
            var __queue = $('.biz-ui-color-picker:not(.biz-one-color-theme)');
            var _str = '{';
            for (var i = 0; i < __queue.length; i++) {
                var el = $(__queue[i]);
                if (!queue[el.data('key')]) {
                    _str += '"' + el.data('key') + '":"' + el.val() + '",';
                }
            }
            _str += "}";
            _str = _str.replace(/(\"\,\})/gim, '"}');
            if (_str.length > 5) {
                toExport = _str + self.options._themeLessString;
                toExport = toExport.replace(/(\}\{)/gim, ',');
            }
            else {
                toExport = self.options._themeLessString;
            }
            toExport = toExport.replace(/(\")/gim, '\\"');
            $("#biz-output-json").val(toExport);
            self._debug(toExport);
        }
        var css = self._getCSSText();
        $("#biz-output-lines").val(css);
        if (self.options.autoPreview) {
            self._previewinPanel(css);
        }
    },
    _printDebugQueue: function (queue) {
        var self = this;
        if (self.options._debug) {
            JSON.stringify(queue);
        }
    },
    _resetVarsCss: function () {
        var self = this;
        var css = '';
        $("#biz-output-lines").val(css);
        if (self.options.autoPreview) {
            self._previewinPanel(css);
        }
    },
    _recreateSavedThemes: function () {
        var self = this;
        self.options.updateVersion = false;
        self.layout.themebuilder = $('.biz-theme-builder');
        var counter = 0;
        var count = 0;
        var themesRecreate = [];
        if (self.options._storage.currentTheme.id) {
            var _current = self.options._storage.currentTheme;
            var jsonCurrentData = self._getJsonDataToRecreate(_current);
            themesRecreate.push(jsonCurrentData);
        }
        counter = themesRecreate.length - 1;
        if (themesRecreate.length > 0) {
            $.each(themesRecreate, function (item, value) {
                var data = {
                    json: "",
                    id: "",
                    published: false,
                    displayName: ""
                };
                //Checks if is already published
                if (value.published) {
                    value.published = true;
                }
                else {
                    value.published = false;
                }
                if (!value.displayName || value.displayName === null) {
                    value.displayName = value.name;
                }
                data.json = JSON.stringify(value);
                data.id = value.id;
                data.published = value.published;
                data.displayName = value.displayName;
                var percent = 100;
                if (counter > 0) {
                    percent = Math.floor(count * 100 / counter);
                }
                $('body > .biz-theme-preloader .biz-theme-preloader-text').text(self.options._updatingText + ': ' + percent + '%');
                $.when(self.dataService.updateTheme(data)).done(function (result) {
                    if (count == counter) {
                        $('.biz-ui-update-all-themes').parent().fadeOut(function () {
                            $(this).remove();
                        });
                        setTimeout(function () {
                            if (!self.options._themeAutoUpdate) {
                                self._refreshPanelHeights();
                            }
                            self._createThemeList();
                        }, 1000);
                        self._removeLoadingOverlay($('body'), function () { });
                    }
                    else {
                        if (counter > 0) {
                            percent = Math.floor(count * 100 / counter);
                        }
                        $('body > .biz-theme-preloader .biz-theme-preloader-text').text(self.options._updatingText + ': ' + percent + '%');
                        count++;
                    }
                }).fail(function (error) {
                    self._removeLoadingOverlay(self.layout.themebuilder);
                });
            });
        }
        else {
            self._removeLoadingOverlay(self.layout.themebuilder);
        }
        if (self.options._storage.errorUpdateThemeList) {
            self._showAlertToInvalidThemes();
        }
        self._loadTemplates(self.configuration.theme.templates);
    },
    _getJsonDataToRecreate: function (data) {
        var self = this;
        var cssVars = data.value;
        var cssVarsJson = $.parseJSON(cssVars);
        var name = data.name;
        var _queueString = '';
        for (var prop in self.options.actualKeys) {
            if (!cssVarsJson.hasOwnProperty(prop)) {
                _queueString += prop + ':  "";';
            }
            else {
                _queueString += prop + ':' + cssVarsJson[prop] + ';';
            }
        }
        var newCSS = '/*** @name:' + name + ' ***/' + self.options.stampVersionCss() + self._getCSSTextByQueueString(_queueString);
        var jsonData = {
            version: self.options._themeVersion,
            name: data.name,
            id: data.id,
            description: data.description,
            thumbs: data.thumbs,
            value: data.value,
            css: newCSS,
            type: data.type,
            logo: data.logo,
            published: false
        };
        if (data.published) {
            jsonData.published = true;
        }
        return jsonData;
    },
    _isAValidThemeToRecreate: function (val) {
        var self = this;
        var isValid = true;
        if (!val.value || !val.id) {
            isValid = false;
        }
        else if (val.value.length === 0) {
            isValid = false;
        }
        if (!isValid) {
            if (!self.options._storage.errorUpdateThemeList) {
                self.options._storage.errorUpdateThemeList = [];
            }
            self.options._storage.errorUpdateThemeList.push(val);
        }
        return isValid;
    },
    _showAlertToInvalidThemes: function () {
        var self = this;
        var invalidThemes = '';
        var ellipsis = $('.biz-ui-theme-part .biz-theme-ellipsis');
        $.each(self.options._storage.errorUpdateThemeList, function (item, value) {
            var nameCompare = value.name;
            for (var i = ellipsis.length - 1; i >= 0; i--) {
                var ellTempo = $(ellipsis[i]);
                var ellTempoText = ellTempo.text();
                var ellParent = ellTempo.closest('.biz-ui-theme-part');
                if (nameCompare === ellTempoText) {
                    ellParent.addClass('invalid-theme');
                    ellParent.attr('title', bizagi.util.sanitizeHTML(bizagi.localization.getResource("widget-theme-invalid-theme")));
                    ellParent.tooltip();
                    break;
                }
            }
        });
    },
    /***********************************************************************************
     **  Find Value by Key
     ***********************************************************************************/
    _findElementsByAttribute: function (key, data, attribute) {
        var self = this;
        var dataSource = (data) ? data : self.options.dataSource;
        var returnVal = [];
        var objAttr = (attribute) ? attribute : 'key';
        for (var i = 0; i < dataSource.length; i++) {
            if (dataSource[i].category.subcategory) {
                var tmpSubCat = self._getValueFromSubcategory(key, dataSource[i].category.subcategory, objAttr);
                if (tmpSubCat) {
                    returnVal.push(tmpSubCat);
                }
            }
            else if (dataSource[i].category.items) {
                var tmpCat = self._getValueFromItems(key, dataSource[i].category.items, attribute);
                if (tmpCat) {
                    returnVal.push(tmpCat);
                }
            }
        }
        return returnVal;
    },
    /*
     *
     */
    _getValueFromSubcategory: function (key, subcategory, attribute) {
        var self = this;
        var returnVal = false;
        for (var i = 0; i < subcategory.length; i++) {
            var tmpValue = self._getValueFromItems(key, subcategory[i].items, attribute);
            if (tmpValue) {
                if (!returnVal) {
                    returnVal = [];
                }
                returnVal.push(tmpValue);
            }
        }
        return returnVal;
    },
    /*
     *
     */
    _getValueFromItems: function (key, items, attribute) {
        var self = this;
        var returnVal = false;
        for (var i = 0; i < items.length; i++) {
            if (key === 'all') {
                if (items[i][attribute]) {
                    if (!returnVal) {
                        returnVal = [];
                    }
                    returnVal.push(items[i]);
                }
            }
            else {
                if (items[i][attribute] === key) {
                    if (!returnVal) {
                        returnVal = [];
                    }
                    returnVal.push(items[i]);
                }
            }
        }
        return returnVal;
    },
    /*
     *
     */
    _minify: function (prev) {
        var self = this, bizOutputLines, bizOutputJson, strToMinify;
        bizOutputLines = $("#biz-output-lines");
        bizOutputJson = $("#biz-output-json");
        strToMinify = bizOutputLines.val();
        strToMinify = strToMinify.replace(/(\r\n|\n|\r)/g, ' ').replace(/(\/\*([^*]|[\r\n]|(\*+([^\*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g, "").replace(/\s{2}/g, '');
        strToMinify = self._getMinifyMark() + strToMinify;
        bizOutputJson.val(self._gethemeLessString(true));
        bizOutputLines.val(strToMinify);
        bizOutputLines.data('change', false);
        if (prev) {
            self._previewinPanel(strToMinify);
        }
    },
    /*
     *
     */
    _getMinifyMark: function () {
        var self = this;
        var mark = '';
        var date = new Date();
        mark += "/********************************************************************** \r\n";
        mark += "\t" + self.configuration.theme.title + "\r\n";
        mark += "\t @date:    \t" + date + "\r\n";
        mark += "\t @version: \t" + self.configuration.theme.version + "\r\n";
        mark += "\t @support: \t";
        for (var i = 0; i < self.configuration.theme.support.length; i++) {
            mark += self.configuration.theme.support[i] + ' ';
        }
        mark += "\r\n";
        mark += "\t @author: \t" + self.configuration.theme.brand.alt + "\r\n";
        mark += "\t @website: \t" + self.configuration.theme.brand.url + "\r\n";
        mark += "**********************************************************************/ \r\n";
        return mark;
    },
    /***********************************************************************************
     ** Shows the modal with the upload file
     ***********************************************************************************/
    _readyForChangeLogo: function () {
        var self = this;
        var logoLogin = "";
        var logoInbox = self.logo;
        if (self.currentSelectedThemeID) {
            var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
            logoLogin = self.logoLogin || self._getLogoLogin(currentThemeObj.logo);
            logoInbox = self.logo || self._getLogoInbox(currentThemeObj.logo);
        }
        //reload the object every time is closed and opened again
        self.layout.bizUiControlModalChangeLogo.remove();
        self.layout.bizUiControlModalChangeLogo = self.layout.bizUiControlModalChangeLogoUnchanged.clone(true);
        //Set images
        if (logoInbox) {
            self.layout.bizUiControlModalChangeLogo.find("img[name='inbox']").attr("src", logoInbox);
        }
        if (logoLogin) {
            self.layout.bizUiControlModalChangeLogo.find("img[name='login']").attr("src", logoLogin);
        }
        else {
            self.layout.bizUiControlModalChangeLogo.find("img[name='login']").attr("src", "");
        }
        //sets the plugin and shows it
        self.layout.bizUiControlModalChangeLogo.removeClass('biz-ui-hide').dialog({
            height: "auto",
            width: '700',
            modal: true
        });
        var $fileControl = self.layout.bizUiControlModalChangeLogo.find('#fileUpload');
        var $fileControlLogin = self.layout.bizUiControlModalChangeLogo.find('#fileUploadLogin');
        var itShouldUseIframeWay = !$fileControl[0] || !$fileControl[0].files;
        //if user is using and old version of IE
        if (itShouldUseIframeWay) {
            self.layout.$uploadIframe = $('<iframe id="upload-iframe" name="upload-iframe"></iframe>').css({
                width: '0px',
                height: '0px',
                border: '0px solid #fff'
            });
            //sets the file control to use the form
            var $form = self.layout.bizUiControlModalChangeLogo.find('form');
            self.layout.bizUiControlModalChangeLogo.find('form').attr('target', 'upload-iframe');
            self.layout.$uploadIframe.appendTo(self.layout.bizUiControlModalChangeLogo.find('form'));
        }
        //upload button
        self.layout.bizUiControlModalChangeLogo.find('.biz-ui-theme-change-logo').click(function () {
            var selectedFile = $fileControl[0].files;
            var selectedFileLogo = $fileControlLogin[0].files;
            if (self._fileWasSelected(itShouldUseIframeWay)) {
                //if client is using old IE browsers we should get the content differently
                if (itShouldUseIframeWay) {
                    if ($fileControl[0].value) {
                        self._getImageDataFromIframe();
                    }
                }
                else {
                    if (selectedFile && selectedFile[0]) {
                        self._getImageDataFromService(selectedFile);
                    }
                    if (selectedFileLogo && selectedFileLogo[0]) {
                        self._getImageDataFromService(selectedFileLogo, function (data) {
                            self.logoLogin = data;
                            self._activeSaveButton();
                        });
                    }
                }
            }
            else {
                self._showValidationErrorMessage("#alert-file-upload", bizagi.localization.getResource("widget-theme-builder-modal-error-no-file"));
            }
            return false;
        });
        $('.biz-ui-theme-upload-logo').change(function () {
            var files = $(this)[0].files;
            if (files && files.length > 0) {
                //  $('.biz-ui-theme-change-logo').removeAttr('disabled');
            }
            else {
                //  $('.biz-ui-theme-change-logo').attr('disabled', 'disabled');
            }
        });
    },
    _fileWasSelected: function (itShouldUseIframeWay) {
        var self = this;
        var $fileControl = self.layout.bizUiControlModalChangeLogo.find('#fileUpload');
        var $fileControlLogin = self.layout.bizUiControlModalChangeLogo.find('#fileUploadLogin');
        if (itShouldUseIframeWay) {
            if ($fileControl[0].value || $fileControlLogin[0].value) {
                return true;
            }
        }
        else {
            var selectedFile = $fileControl[0].files;
            var selectedFileLogo = $fileControlLogin[0].files;
            if ((selectedFile && selectedFile[0]) || (selectedFileLogo && selectedFileLogo[0])) {
                return true;
            }
        }
        return false;
    },
    /***********************************************************************************
     **  New Theme
     ***********************************************************************************/
    _readyForNew: function () {
        var self = this;
        $('.alert-new-theme').hide(); //Hide the message error if it was showed before
        self.layout.bizUiControlModalNew.removeClass('biz-ui-hide').dialog({
            height: "auto",
            width: '430',
            modal: true,
            resizable: false,
        });
        var inputChange = $('input.color-picker', self.layout.bizUiControlModalNew);
        inputChange.change(function () {
            $('.' + self.options.oneColorTheme).val(inputChange.val());
        });
        $('.color-picker', self.layout.bizUiControlModalNew).each(function () {
            var $this = $(this);
            $this.spectrum("set", "#fff");
        });
    },
    /***********************************************************************************
     **  Save Theme and publish css as minified string
     ***********************************************************************************/
    _readyForSave: function (goService, lightThemeIsChecked) {
        var self = this, bizOutputLines, bizOutputJson;
        self._minify(!goService);
        if (goService) {
            bizOutputLines = $("#biz-output-lines");
            bizOutputJson = $("#biz-output-json");
            var objectTheme = $.parseJSON(bizOutputJson.val());
            var selectedThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
            var selected = $('.biz-ui-theme-part.biz-ui-active');
            if (selected.length) {
                self.currentSelectedThemeID = selected.attr('id');
            }
            $('.alert-new-theme').hide(); //Hide the message error if it was showed before
            //Check if there is selected theme
            if (self.currentSelectedThemeID && (self.currentSelectedThemeID.length > 0) && (self.local.save.displayName.length === 0)) {
                var result = self._getThemeDataByID(self.currentSelectedThemeID);
                //Fill the fields with the required info
                $('input[name="name"]', self.layout.bizUiControlModalUpdate).val(result.displayName);
                $('textarea', self.layout.bizUiControlModalUpdate).val(result.description);
                //Show the save modal
                self.layout.bizUiControlModalUpdate.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '400',
                    modal: true
                });
                $('.color-picker', self.layout.bizUiControlModalUpdate).each(function () {
                    var $this = $(this);
                    //@ts-ignore
                    $this.spectrum("set", Object.random(objectTheme));
                });
                var selector = $('#' + self.currentSelectedThemeID);
                if (selector.data().hasOwnProperty('save')) {
                    $('.biz-ui-theme-update', self.layout.bizUiControlModalUpdate).show();
                }
                else {
                    var valueName = $('input[name="name"]', self.layout.bizUiControlModalUpdate).val() + ' copy';
                    $('input[name="name"]', self.layout.bizUiControlModalUpdate).val(valueName);
                    $('.biz-ui-theme-update', self.layout.bizUiControlModalUpdate).hide();
                }
            }
            else if (self.local.save.displayName.length) {
                $(".biz-ui-theme-part").removeClass('active');
                $('.color-picker', self.layout.bizUiControlModalSave).each(function () {
                    var $this = $(this);
                    //@ts-ignore
                    $this.spectrum("set", Object.random(objectTheme));
                });
                self._saveService(self.actionsType.SAVE, lightThemeIsChecked);
            }
            else if ((self.currentSelectedThemeID == "")) {
                $(".biz-ui-theme-part").removeClass('active');
                self.layout.bizUiControlModalSave.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '400',
                    modal: true
                });
                $('.color-picker', self.layout.bizUiControlModalSave).each(function () {
                    var $this = $(this);
                    //@ts-ignore
                    $this.spectrum("set", Object.random(objectTheme));
                });
            }
        }
    },
    /**
     * method that returns the prefix light or themebuilder according to the selected topic and the save method
     * @param currentThemeObj
     * @param saveMethod
     */
    _getPrefixTheme: function (currentThemeObj, saveMethod, lightThemeIsChecked) {
        if (saveMethod === void 0) { saveMethod = ""; }
        if (lightThemeIsChecked === void 0) { lightThemeIsChecked = false; }
        var self = this, _isSave = saveMethod == self.actionsType.SAVE, _isObjectLight = self._isLightTheme(currentThemeObj), _isLight = lightThemeIsChecked || !_isSave && _isObjectLight;
        return _isLight ? self.options._lightThemePreFix : 'ThemeBuilder';
    },
    /*
     *
     */
    _saveService: function (saveMethod, lightThemeIsChecked) {
        var self = this, currentModal;
        var name, description;
        var css, themeJson;
        var thumbs = [], thumbsContainer;
        var data = {};
        //Check if is saving new, or updating an existing
        if (saveMethod == self.actionsType.SAVE) {
            currentModal = self.layout.bizUiControlModalSave;
        }
        else {
            currentModal = self.layout.bizUiControlModalUpdate;
        }
        name = $('input[name="name"]', currentModal).val();
        description = $('textarea', currentModal).val();
        var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
        if (self._isThemeBasedOnBizagiThemeAndOnlyChangeImage(currentThemeObj) && (saveMethod == self.actionsType.COPY)) {
            themeJson = "";
            css = self.options._baseCSSTheme;
        }
        else {
            themeJson = self._gethemeLessString();
            css = self._getCSSText();
        }
        thumbsContainer = $('.biz-ui-theme-thumbs-selector', currentModal);
        $('.color-picker', thumbsContainer).each(function (item, value) {
            thumbs.push($(value).val());
        });
        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-saving-theme"));
        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');
        //If is not updating, then, is saving a new theme
        if ((saveMethod == self.actionsType.SAVE) || (saveMethod == self.actionsType.COPY)) {
            var nameField = $('input[name="name"]', currentModal);
            var logoTheme = self.logo;
            var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
            if (saveMethod == self.actionsType.SAVE) {
                logoTheme = self._getDefaultLogoPathForWorkportal(lightThemeIsChecked, false);
            }
            name = self.validateIfNameExist(name).name;
            var loadLoginData = (name == currentThemeObj.displayName) || (saveMethod == self.actionsType.COPY);
            var loginData = loadLoginData ? self.logoLogin || self._getLogoLogin(currentThemeObj.logo) || "" : "";
            //@ts-ignore
            var actualId = Math.guid();
            var Prefix = self._getPrefixTheme(currentThemeObj, saveMethod, lightThemeIsChecked);
            data = {
                version: self.options._themeVersion,
                displayName: name,
                name: Prefix + actualId,
                id: actualId,
                description: description,
                logo: JSON.stringify({
                    inbox: logoTheme || "",
                    login: loginData
                }),
                thumbs: thumbs,
                predefined: false,
                value: themeJson,
                css: self.options.stampVersionCss() + css
            };
            self.options._savedThemeList = [data];
            //data = JSON.stringify(data);
            //@ts-ignore
            var sendDataJson = new _JsonThemeObject(data);
            var _strSendDataJson = JSON.stringify(sendDataJson);
            $.when(self.dataService.createTheme(_strSendDataJson)).done(function (result) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                    self._refreshThemeList({
                        themes: self.options._savedThemeList
                    }, true);
                });
            }).fail(function (error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        } //Otherwise, is updating an existing theme
        else {
            var currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
            var Prefix = self._getPrefixTheme(currentThemeObj);
            var jsonData = {
                version: self.options._themeVersion,
                displayName: name,
                name: Prefix + self.currentSelectedThemeID,
                id: self.currentSelectedThemeID,
                description: description,
                logo: JSON.stringify({
                    inbox: self.logo || self._getLogoInbox(currentThemeObj.logo),
                    login: self.logoLogin || self._getLogoLogin(currentThemeObj.logo) || ""
                }),
                thumbs: thumbs,
                value: themeJson,
                css: self.options.stampVersionCss() + css,
                type: currentThemeObj.type,
                published: false
            };
            //Checks if is already published
            if (currentThemeObj.published)
                jsonData.published = true;
            //@ts-ignore
            var sendDataJson = new _JsonThemeObject(jsonData);
            var _strSendDataJson = JSON.stringify(sendDataJson);
            data.json = _strSendDataJson;
            data.id = self.currentSelectedThemeID;
            $.when(self.dataService.updateTheme(data)).done(function (result) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                    self._createThemeList();
                });
            }).fail(function (error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        }
    },
    validateIfNameExist: function (name) {
        var self = this;
        var exist = false;
        var idWithName = self._getThemeIdByName(name);
        if (idWithName != null) {
            name = self.validateIfNameExist(name + ' copy').name;
        }
        return {
            exist: exist,
            name: name
        };
    },
    /*
     *
     */
    _publishService: function (id) {
        var self = this;
        var theme = self._getThemeDataByID(id);
        // just for IE8 (updateVersion);
        if (!theme.version)
            theme.version = self.options._localVersion;
        var updateVersion = bizagi.util.upVersion(theme.version, self.options._themeVersion);
        theme.value = theme.value || self.options._baseValue;
        theme.advCSS = self.options._advancedTheme || '';
        if (id !== self.options._baseID && theme.value !== self.options._baseValue) {
            // Recompile css
            var lessVars = "{}";
            lessVars = $.parseJSON(theme.value);
            theme.version = self.options._themeVersion;
            //self._refreshFields(lessVars);
            if (theme.displayName) {
                // Take recalculated data
                theme.css = '/*** @name:' + theme.displayName + ' ***/' + self.options.stampVersionCss() + self._getCSSText();
            }
            else {
                // Take recalculated data
                theme.css = '/*** @name:' + theme.name + ' ***/' + self.options.stampVersionCss() + self._getCSSText();
            }
        }
        else {
            theme.css = self.options._baseCSSTheme;
        }
        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');
        // Validate just params to be serialize on backend
        //@ts-ignore
        var sendDataJson = new _JsonThemeObject(theme);
        var _strSendDataJson = JSON.stringify(sendDataJson);
        var dataUpdate = {
            json: "",
            id: ""
        };
        dataUpdate.json = _strSendDataJson;
        dataUpdate.id = theme.id;
        if (updateVersion) {
            $.when(self.dataService.updateTheme(dataUpdate)).done(function (result) {
                $.when(self.dataService.publishTheme(dataUpdate)).done(function (result) {
                    self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                        self._createThemeList();
                    });
                });
            }).fail(function () {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        }
        else {
            $.when(self.dataService.publishTheme(dataUpdate)).done(function (result) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                    self._createThemeList();
                });
            }).fail(function (error) {
                self._removeLoadingOverlay(self.layout.bizUiThemesList);
            });
        }
    },
    /*
     *
     */
    _createThemeList: function () {
        var self = this;
        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-loading-theme-list"));
        //Reset the current Selected Theme
        self.currentSelectedThemeID = "";
        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');
        //Invoques the services to fecth the AllThemes, the DummyThemes, and the Current Theme
        //$.when(self.dataService.getAllThemes(), self.dataService.getDummyThemes(), self.dataService.getCurrentTheme()).done(function (serverThemes, mockThemes, currentTheme) {
        $.when(self.dataService.getAllThemes(), self.dataService.getCurrentTheme()).done(function (serverThemes, currentTheme) {
            if (currentTheme.id) {
                var _currentIsLight = currentTheme.name === self.options._lightThemePreFix, _idIsLight = currentTheme.id === self.options._baseIdLightTheme;
                if (_currentIsLight && !_idIsLight) {
                    currentTheme.id = self.options._baseIdLightTheme;
                }
                if ((currentTheme.name === "Bizagi GO" || currentTheme.name === "Bizagi") && currentTheme.id !== self.options._baseIdBizagiGO) {
                    currentTheme.id = self.options._baseID;
                }
                if (currentTheme.name === "Lost Woods" && currentTheme.id !== self.options._baseIdLostWoods) {
                    currentTheme.id = self.options._baseIdLostWoods;
                }
                if (currentTheme.name === "Beezagi" && currentTheme.id !== self.options._baseIdBeezagi) {
                    currentTheme.id = self.options._baseIdBeezagi;
                }
                var isNotMigrated = {
                    value: self._baseValue,
                    thumbs: ["#36454E", "#2E516B", "#5D6771", "#DEDEDE"]
                };
                if (!currentTheme.value) {
                    currentTheme = $.extend({}, currentTheme, isNotMigrated);
                }
            }
            var themes = self._preprocessThemes(serverThemes, currentTheme);
            self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                self.changeAplied = false;
                self._refreshThemeList({
                    themes: themes
                }, false);
                self._loadNewThemeSelected(); //to load the theme that was selected in the list if there was a saved change
            });
        });
    },
    /*
     *
     */
    _preprocessThemes: function (serverThemes, currentTheme) {
        var self = this;
        var i = serverThemes.length, itemDummy;
        var j, k;
        var mockThemes = {
            themes: [].concat(self.options.predefinedThemes.themes)
        };
        var themes = [];
        //Convert string array of thumbs, to a real array
        while (i-- > 0) {
            itemDummy = serverThemes[i];
            serverThemes[i].thumbs = [].concat(itemDummy.thumbs);
        }
        k = serverThemes.length;
        while (k-- > 0) {
            if (serverThemes[k].displayName === null) {
                serverThemes[k].displayName = serverThemes[k].name;
            }
            if ((serverThemes[k].name === "Bizagi GO" || serverThemes[k].name === "Bizagi") && currentTheme.id !== self.options._baseIdBizagiGO) {
                serverThemes[k].id = self.options._baseID;
            }
            if (serverThemes[k].name === "Lost Woods" && serverThemes[k].id !== self.options._baseIdLostWoods) {
                serverThemes[k].id = self.options._baseIdLostWoods;
            }
            if (serverThemes[k].name === "Beezagi" && serverThemes[k].id !== self.options._baseIdBeezagi) {
                serverThemes[k].id = self.options._baseIdBeezagi;
            }
        }
        // Join both data origins and argument
        if (mockThemes.themes.length) {
            themes = self.validateRepeatedIds($.merge(mockThemes.themes, serverThemes));
        }
        else {
            themes = [].concat(serverThemes);
        }
        //Checks if the current theme is an predefined theme
        j = themes.length;
        while (j-- > 0) {
            if (themes[j].id == currentTheme.id) {
                //Stores the current selected theme
                self.currentSelectedThemeID = currentTheme.id;
                //Assign the processed css
                themes[j].css = currentTheme.css;
                break;
            }
        }
        return themes;
    },
    validateRepeatedIds: function (arr) {
        for (var i = 0; i < arr.length; ++i) {
            for (var j = i + 1; j < arr.length; ++j) {
                if (arr[i].id === arr[j].id)
                    arr.splice(j--, 1);
            }
        }
        return arr;
    },
    /*
     *
     */
    _refreshThemeList: function (data, newTheme) {
        var self = this, savedJson, savedThemesLayout;
        savedJson = (typeof data === 'string') ? $.parseJSON(data) : data;
        if (self.currentThemeList && newTheme) {
            self.currentThemeList = self.currentThemeList.concat(savedJson.themes);
        }
        else {
            self.currentThemeList = [].concat(savedJson.themes);
        }
        for (var i = 0; i < savedJson.themes.length; i++) {
            if (!savedJson.themes[i].thumbs) {
                savedJson.themes[i].thumbs = [];
            }
            if (savedJson.themes[i].thumbs.length === 0) {
                var valJson = $.parseJSON(savedJson.themes[i].value);
                for (var j = 0; j < self.options.thumbs; j++) {
                    //@ts-ignore
                    savedJson.themes[i].thumbs.push(Object.random(valJson));
                }
            }
        }
        //Create a theme list or add a new theme
        if (newTheme) {
            savedThemesLayout = $.tmpl("custom.theme.ui.controls.new", savedJson);
            self.layout.bizUiThemesList.find(".biz-theme-controls").append(savedThemesLayout);
            self.changeAplied = false;
            self._loadNewThemeSelected(); //to load the theme that was selected in the list if there was a saved change
        }
        else {
            self.changeAplied = false;
            savedThemesLayout = $.tmpl("custom.theme.ui.controls.themes", savedJson);
            self.layout.bizUiThemesList.empty().append(savedThemesLayout);
        }
        if (self.options._animations) {
            savedThemesLayout.hide();
            savedThemesLayout.fadeIn();
        }
        $('h3[title]', self.layout.bizUiThemesList).tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip biz-theme-title',
            position: {
                my: "right center",
                at: "left center"
            }
        });
        $('.biz-theme-button-side-bar [title]').tooltip({
            tooltipClass: 'biz-ui-horizontal-align-tooltip',
            position: {
                my: "left bottom",
                at: "right top"
            }
        });
        $('.biz-ui-theme-part[title]', self.layout.bizUiThemesList).attr('title', '');
        self._toggleListColors();
        if (self.options.tooltipPreview) {
            $('.biz-ui-theme-part[title]', self.layout.bizUiThemesList).tooltip({
                tooltipClass: 'biz-ui-horizontal-align-tooltip biz-theme-thumbnail',
                position: {
                    my: "left center",
                    at: "right center"
                },
                content: function () {
                    var _self = $(this);
                    var title = _self.attr('title');
                    var strReturn = title;
                    if (title) {
                        if (title.indexOf('.png') != -1 || title.indexOf('.jpg') != -1) {
                            strReturn = '<img src="' + title + '">';
                        }
                    }
                    return strReturn;
                }
            });
        }
        //Check if after processing the template, there is any element with the attribute  is published
        var publishTheme = $('.biz-ui-theme-part.biz-ui-active', self.element);
        if (self.local.save.displayName === null || !self.local.save.displayName) {
            self.local.save.displayName = self.local.save.name;
        }
        if (self.local.save.displayName.length) {
            self._selectActiveTheme(self._getThemeIdByName(self.local.save.displayName));
        }
        else if (self.currentSelectedThemeID != '' && !newTheme) {
            self._selectPublishedTheme(self.currentSelectedThemeID);
        }
        else {
            self.currentSelectedThemeID = publishTheme.attr('id');
        }
        if (publishTheme.length > 0 && !newTheme) {
            var str = $('input', publishTheme).val();
            var name = $('h4', publishTheme).text();
            var queueJson = str.length === 0 ? {} : $.parseJSON(str);
            self._refreshFields(queueJson);
            $('.biz-theme-name', self.layout.bizUiThemesList).text(printf(bizagi.localization.getResource("widget-theme-builder-title-theme-is-selected"), name));
            self._changeTitle(name);
        }
        else if (self.currentSelectedThemeID && self.currentSelectedThemeID != "" && !self.local.save.displayName.length) {
            var themeItem = self._getThemeDataByID(self.currentSelectedThemeID);
            var str = themeItem.value;
            var name = (themeItem.displayName !== null) ? themeItem.displayName : themeItem.name;
            var queueJson = str.length === 0 ? {} : $.parseJSON(str);
            self._refreshFields(queueJson);
            $('.biz-theme-name', self.layout.bizUiThemesList).text(printf(bizagi.localization.getResource("widget-theme-builder-title-theme-is-selected"), name));
            self.currentSelectedThemeID = "";
            self._changeTitle(name);
        }
        else if (publishTheme.length === 0 && !newTheme) {
            var name = $('h4', $('.biz-ui-theme-part:first', self.element)).text();
            self.currentSelectedThemeID = self.options._baseIdLightTheme;
            self._selectPublishedTheme(self.currentSelectedThemeID);
            self._refreshFields();
            self._changeTitle(name);
        }
        else {
            self._refreshFields();
            $('.biz-theme-name', self.layout.bizUiThemesList).text(bizagi.localization.getResource("widget-theme-builder-controls-label-select-a-theme"));
            self.local.save.displayName = "";
        }
        if (self.listThemeContainerIsOpen) {
            $('.biz-ui-selected-theme', savedThemesLayout).addClass('biz-active');
            $('.biz-theme-controls', savedThemesLayout).addClass('isOpen');
        }
        /*Hide Reset Button*/
        self._resetButton("hide");
    },
    _selectPublishedTheme: function (id) {
        var self = this;
        $('.biz-theme-publish.biz-ui-active').removeClass('biz-ui-active');
        var activeTheme = $('#' + id);
        activeTheme.addClass('biz-ui-active');
        $('.biz-theme-publish', activeTheme).addClass('biz-ui-active');
        $('.biz-theme-delete', activeTheme).replaceWith('<span class="biz-ui-button-spacer"></span>');
        self._selectTheme(activeTheme);
        self._selectLogoForActiveTheme(id);
    },
    _selectActiveTheme: function (id) {
        var self = this;
        var activeTheme = $('#' + id);
        if (activeTheme.data().hasOwnProperty('save')) {
            self._activeSaveButton();
        }
        else {
            self._inactiveSaveButton();
        }
        $('.biz-ui-theme-part.biz-ui-active').removeClass('biz-ui-active');
        activeTheme.addClass('biz-ui-active');
        self.logoLogin = ""; //reset logologin
        self.currentSelectedThemeID = id;
        //selects the  logo for the theme
        self._selectLogoForActiveTheme(id);
    },
    _getLogoInbox: function (logoContent) {
        var logo = "";
        try {
            var logoObj = JSON.parse(logoContent);
            logo = logoObj.inbox;
        }
        catch (e) {
            logo = logoContent;
        }
        return logo;
    },
    _getLogoLogin: function (logoContent) {
        var logo = "";
        try {
            var logoObj = JSON.parse(logoContent);
            logo = logoObj.login;
        }
        catch (e) {
            // Nothing todo
        }
        return logo;
    },
    //when the user selects any theme, we should change the logo as well
    _selectLogoForActiveTheme: function (themeId) {
        var self = this;
        //filters the active theme
        var selectedTheme = self._getThemeDataByID(themeId);
        var selectedLogo = selectedTheme && self._getLogoInbox(selectedTheme.logo);
        var isLightTheme = self._isLightTheme(selectedTheme), _isBizagiGOTheme = themeId === self.options._baseIdBizagiGO;
        self._changeLogo(selectedLogo || self._getDefaultLogoPathForThemeBuilder(isLightTheme, _isBizagiGOTheme), !selectedLogo, isLightTheme, _isBizagiGOTheme);
    },
    /*
     *
     */
    _deleteTheme: function (id) {
        var self = this;
        var data = {
            id: id
        };
        self._createLoadingOverlay(self.layout.bizUiThemesList, bizagi.localization.getResource("widget-theme-builder-deleting-theme"));
        self.listThemeContainerIsOpen = $('.biz-ui-themes-list').is(':visible');
        $.when(self.dataService.deleteTheme(data)).done(function (result) {
            //console.log("delete result", result);
            //Clean the current selected theme
            self.currentSelectedThemeID = "";
            self._removeLoadingOverlay(self.layout.bizUiThemesList, function () {
                self._createThemeList();
            });
        }).fail(function (error) {
            //console.log('error publishing theme', error.responseText);
            self._removeLoadingOverlay(self.layout.bizUiThemesList);
        });
    },
    /*
     *
     */
    _createPreviewPanel: function () {
        var self = this, iframeParent, _selfIframe, tmplPreview, tmplPreviewWebparts, counterPreviewWorkportal = 0, previewPanelHeight = 0, panelHeight = 0, tabsPanel;
        function Check_Version() {
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent, re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
                if (re.exec(ua) !== null) {
                    rv = parseFloat(RegExp.$1);
                }
            }
            else if (navigator.appName == "Netscape") {
                /// in IE 11 the navigator.appVersion says 'trident'
                /// in Edge the navigator.appVersion does not say trident
                if (navigator.appVersion.indexOf('Trident') === -1)
                    rv = 12;
                else
                    rv = 11;
            }
            return rv;
        }
        //If IE11 or EDGE
        var keyStorageAux = 'auxBizagiAuthentication';
        if (Check_Version() === 11 || Check_Version() === 12 && !window.sessionStorage.bizagiAuthentication && localStorage.getItem(keyStorageAux)) {
            sessionStorage.setItem('bizagiAuthentication', JSON.parse(localStorage.getItem(keyStorageAux)));
            localStorage.removeItem(keyStorageAux);
        }
        tmplPreview = $.tmpl('custom.theme.ui.controls.preview.workportal', {
            title: 'Preview Theme',
            url: self.options.previewPage
        });
        tmplPreviewWebparts = $.tmpl('custom.theme.ui.controls.preview.webparts', {
            title: 'Preview Theme',
            url: self.options.previewWebparts
        });
        var browser = self.options._browser;
        var version = self.options._version;
        $('iframe').load(function () {
            iframeParent = $('iframe').parent();
            self._createLoadingOverlay(iframeParent, bizagi.localization.getResource("widget-theme-builder-loading-workportal-message"));
            _selfIframe = $(this);
            self.globalInterval.push(setInterval(function () {
                var contents = _selfIframe.contents().find('#contentFramework');
                var contentsMe = _selfIframe.contents().find('#home-content');
                counterPreviewWorkportal++;
                if (contents.length > 0 || contentsMe.length > 0 || counterPreviewWorkportal > 20) {
                    for (var i = 0; i < self.globalInterval.length; i++) {
                        clearInterval(self.globalInterval[i]);
                    }
                    if (browser === 'Explorer' && version < 10) {
                        _selfIframe.contents().find('body').addClass('biz-theme-ie');
                    }
                    self._readyForSave(false);
                    self._removeLoadingOverlay($('iframe').parent());
                }
            }, 500));
        });
        self._refreshPanelHeights();
    },
    _refreshPanelHeights: function () {
        var updateLink = 0;
        var panelContainer = $(window).height() - $('header.clearfix').outerHeight();
        $('.biz-layout-panel-container').height(panelContainer);
        var buttonBar = $('.biz-ui-actions-bar').height();
        var controlPanel = panelContainer - buttonBar;
        if ($('.biz-ui-update-all-themes').parent().length) {
            if ($('.biz-ui-update-all-themes').parent().is(':visible')) {
                updateLink = $('.biz-ui-update-all-themes').parent().height();
            }
        }
        $('.biz-ui-control-panel').height(controlPanel);
        var tabsNav = $('.ui-tabs-nav');
        var tabsHeight = 0;
        if (tabsNav.is(':visible')) {
            tabsHeight = tabsNav.outerHeight();
        }
        var previewPanelHeight = panelContainer - tabsHeight - updateLink;
        $('.ui-tabs-panel').height(previewPanelHeight);
        $('.ui-tabs-panel iframe').height(previewPanelHeight);
    },
    /*
     *
     */
    _createLoadingOverlay: function (_instance, text, response) {
        var h = (_instance.height() / 2) - 30;
        var altMax = (h <= 0) ? '45%' : h;
        if (_instance.has('.biz-theme-preloader').length > 0) {
            $('.biz-theme-preloader-text', _instance).attr("style", "top:'" + altMax + "'px;").text(text);
            $('.biz-theme-preloader', _instance).show();
        }
        else {
            _instance.append('<div class="biz-theme-preloader"><span class="biz-theme-preloader-text" style="top:' + altMax + 'px;">' + text + '</span></div>');
        }
        if (response) {
            response();
        }
    },
    /*
     *
     */
    _removeLoadingOverlay: function (_instance, callback) {
        if (_instance.has('.biz-theme-preloader').length > 0) {
            $('.biz-theme-preloader', _instance).fadeOut(function () {
                if (callback) {
                    callback();
                }
            });
        }
    },
    /*
     *
     */
    _previewinPanel: function (str) {
        var self = this, localStr = DOMPurify.sanitize(str);
        self._checkStylesForAppend();
        var prevPanelWorkPortal = $('.biz-ui-theme-panel-workportal').contents().find('head').find('#bizagi-theme');
        var prevPanelWebParts = $('.biz-ui-theme-panel-webparts').contents().find('head').find('#bizagi-theme');
        prevPanelWorkPortal.replaceWith('<style id="bizagi-theme">' + localStr + '</style>');
        prevPanelWebParts.replaceWith('<style id="bizagi-theme">' + localStr + '</style>');
    },
    _checkStylesForAppend: function () {
        var self = this;
        var instance = $('.biz-ui-theme-panel-workportal').contents().find('head');
        var styles = $('style', instance);
        for (var i = 0; i < styles.length; i++) {
            var el = $(styles[i]);
            var elID = el.attr('id');
            if (elID === 'bizagi-theme') {
                el.remove();
            }
        }
        var reference = $('link[href*="bizagi.custom.styles.css"]', instance);
        var style = $('<style id="bizagi-theme"></style>');
        if (reference.length) {
            style.insertBefore(reference);
        }
        else {
            instance.append(style);
        }
    },
    /*
     *
     */
    _reset: function () {
        var self = this;
        $('.biz-ui-theme-part.biz-ui-active').trigger('click');
        //Clean the current selected theme
        self._restoreLogo();
        self._restoreTitle();
        self.currentSelectedThemeID = "";
    },
    /*
     *
     */
    _selectAll: function (node) {
        var self = this;
        var browser = self.options._browser;
        if (browser === 'Explorer') {
            //@ts-ignore
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        }
        else if (browser === 'Mozilla' || browser === 'Opera' || browser === 'Chrome') {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        else if (browser === 'Safari') {
            var selection = window.getSelection();
            selection.setBaseAndExtent(node, 0, node, 1);
        }
    },
    /* called when created, and later when changing options
     *
     */
    _refresh: function () {
        this.element.css("background-color", "rgb(" +
            this.options.red + "," +
            this.options.green + "," +
            this.options.blue + ")");
        // trigger a callback/event
        this._trigger("change");
    },
    /*
     *
     */
    _getCSSText: function () {
        var self = this;
        var _queueString = '';
        var cssText = '';
        var result = '';
        var inputsKey = $('input[data-key]');
        inputsKey.each(function () {
            var $this = $(this);
            var $dataKey = $this.data('key');
            if ($dataKey === '@one-color-theme') {
                $dataKey = '@one-color-palette';
            }
            _queueString += $dataKey + ': ' + $this.val() + ';';
        });
        return self._getCSSTextByQueueString(_queueString);
    },
    _getCSSTextByQueueString: function (_queueString) {
        var self = this;
        var parser = new (less.Parser);
        var result = 'Error in _getCSSTextByQueueString: ' + _queueString;
        var rules = (self.themeRulesBase.length > 0) ? self.themeRulesBase : '';
        var _queue = '@white: #FFF ; @one-color-palette: #000 ; @one-color-theme: #000;';
        var currentThemeObj;
        if (self.currentThemeList) {
            if (self.currentSelectedThemeID === "") {
                self.currentSelectedThemeID = self._getIDThemeSelectedInSidebar();
            }
            currentThemeObj = self._getThemeDataByID(self.currentSelectedThemeID);
        }
        try {
            var isLight = self._isLightTheme(currentThemeObj), themeVariable = "@theme: " + (isLight ? "'" + self.options._lightThemePreFix + "';" : "'other';");
            parser.parse(_queueString + themeVariable + _queue + rules, function (err, tree) {
                result = tree.toCSS() + self.options._advancedTheme;
            });
        }
        catch (e) {
            this._debug(_queueString + rules);
            this._debug(e);
        }
        return result;
    },
    /*
     *
     */
    _getObjectFromComment: function (data) {
        var myInfoJson = '{';
        $.each(data, function (item, value) {
            var key = value.replace(/\@/gi, '').split(':');
            var jsonText = '"' + $.trim(key[0]) + '":"' + $.trim(key[1]) + '" ';
            myInfoJson += jsonText;
        });
        myInfoJson += '}';
        myInfoJson = myInfoJson.replace(/(\"\s\")/gim, '","');
        myInfoJson = $.parseJSON(myInfoJson);
        return myInfoJson;
    },
    _selectBackgroundImageOnModal: function () {
        var self = this;
        var initSideBgImageField = $('input[data-key="@sidebar-image-theme"]');
        $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).removeClass('active');
        self.layout.bizUiControlModalChangeBackgroungImage.find('.thumbnail').each(function (item, value) {
            var $el = $(value);
            var dataValue = $el.data('value');
            if ((initSideBgImageField.val() === 'none') && (dataValue.indexOf('not-alowed') !== -1)) {
                $el.addClass('active');
                $('span[data-key="@sidebar-image-theme"]').attr('style', 'background-image:url(' + dataValue + ');');
            }
            else if (initSideBgImageField.val().indexOf(dataValue.replace('../', '')) !== -1) {
                $el.addClass('active');
            }
        });
        $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).focus();
    },
    /*

     */
    _createBackgroundImages: function () {
        var selectElelement = false, self = this;
        var sideBackground = self._findElementsByAttribute('@sidebar-image-theme', self.options.dataSource, 'key');
        if (sideBackground) {
            var initSideBgImageField = $('input[data-key="@sidebar-image-theme"]');
            var initSideBgImageButton = $('span[data-key="@sidebar-image-theme"]');
            var label = initSideBgImageField.val().split(',')[0].replace(/(\')/gi, '');
            if (initSideBgImageField.val() !== 'none') {
                initSideBgImageButton.attr('style', 'background-image:' + initSideBgImageField.val());
                initSideBgImageButton.addClass('biz-button-image');
            }
            self.layout.bizUiControlModalChangeBackgroungImage.find('.thumbnail').click(//Click on an image to change it
            function () {
                self.changeAplied = true; //The change aplied variable is true when the user clicks on the image, because the image is changed immediately when the user selects it
                $('.thumbnail.active', self.layout.bizUiControlModalChangeBackgroungImage).removeClass('active');
                var $el = $(this);
                var url = $el.data('source');
                var src = $el.data('value');
                if (url) {
                    $el.addClass('active').focus();
                    initSideBgImageField.val(url);
                    initSideBgImageField.attr('value', url);
                    initSideBgImageButton.text(url);
                    if (src !== 'none') {
                        initSideBgImageButton.attr('style', 'background-image:url("' + src + '")');
                    }
                    self._addtoQueue(initSideBgImageField);
                }
            });
            self.layout.bizUiControlModalChangeBackgroungImage.find('.biz-ui-button').click(function () {
                self.layout.bizUiControlModalChangeBackgroungImage.dialog('close');
            });
            initSideBgImageButton.parent().on("click", function () {
                self.layout.bizUiControlModalChangeBackgroungImage.removeClass('biz-ui-hide').dialog({
                    height: "auto",
                    width: '750',
                    modal: true,
                    open: function () {
                        self._selectBackgroundImageOnModal();
                    }
                });
            });
        }
    },
    /*
     *
     */
    _createFontFamily: function () {
        var self = this;
        var fontFamily = self._findElementsByAttribute('@font-family', self.options.dataSource, 'key');
        if (fontFamily) {
            var initFontField = $('input[data-key="@font-family"]');
            var label = initFontField.val().split(',')[0].replace(/(\')/gi, '');
            var myFontSelect = $(self._createSelect(self.options.secureFonts, '@font-family', initFontField.val()));
            $('.select', myFontSelect).on("click", "li", function (event) {
                var _self = $(this);
                var _parent = _self.parent();
                var parent = _self.closest('.biz-theme-category');
                var initFontField = $('input[data-key="@font-family"]');
                initFontField.val(_self.data('value'));
                initFontField.data('label', _self.text());
                initFontField.attr('value', _self.data('value'));
                var keyField = $('span[data-key="' + initFontField.data('key') + '"]');
                keyField.text(initFontField.data('label'));
                keyField.css('font-family', initFontField.val());
                self._addtoQueue(initFontField);
                if (_parent.hasClass('isOpen')) {
                    $('h3', parent).removeClass('biz-active');
                    _parent.removeClass('isOpen').addClass('isClose');
                }
                else {
                    _parent.addClass('isClose').addClass('isOpen');
                }
                self.changeAplied = true; //When the font is changed
            });
            var selected = $('.select li[selected]', myFontSelect).text();
            $('span[data-key="' + initFontField.data('key') + '"]').text(selected);
            myFontSelect.insertAfter(initFontField);
            initFontField.remove();
            $('span[data-key="@font-family"]').closest('h3').addClass('no-label');
            $(document).bind('click.list', function (e) {
                var target = $(e.target);
                if (target.closest('.select').length === 0) {
                    var parent = target.closest('.biz-theme-category');
                    $('.select', myFontSelect).removeClass('isOpen').addClass('isClose');
                }
            });
        }
    },
    /***********************************************************************************
     **  Convert a Less String to Json Object
     ***********************************************************************************/
    _convertLesstoJson: function (data) {
        var self = this, jsonLess, jsonTmp, jsonLessArray = [], obj = {}, catCounter = 0, newData;
        newData = self._replaceByRegExp(data);
        jsonTmp = $.parseJSON(newData);
        for (var i = 0; i < jsonTmp.less.length; i++) {
            if (jsonTmp.less[i].category) {
                obj = {
                    category: {
                        name: jsonTmp.less[i].category
                    }
                };
                jsonLessArray[jsonLessArray.length] = obj;
            }
            else if (jsonTmp.less[i].subcategory) {
                if (!jsonLessArray[jsonLessArray.length - 1].category.subcategory) {
                    jsonLessArray[jsonLessArray.length - 1].category.subcategory = [];
                }
                var related = jsonTmp.less[i].related;
                jsonLessArray[jsonLessArray.length - 1].category.subcategory.push({
                    name: jsonTmp.less[i].subcategory,
                    items: [],
                    related: (related) ? related : null
                });
            }
            else {
                if (jsonLessArray[jsonLessArray.length - 1].category.subcategory) {
                    var l = jsonLessArray[jsonLessArray.length - 1].category.subcategory.length - 1;
                    jsonLessArray[jsonLessArray.length - 1].category.subcategory[l].items.push(jsonTmp.less[i]);
                }
                else {
                    if (!jsonLessArray[jsonLessArray.length - 1].category.items) {
                        jsonLessArray[jsonLessArray.length - 1].category.items = [];
                    }
                    jsonLessArray[jsonLessArray.length - 1].category.items.push(jsonTmp.less[i]);
                }
            }
        }
        jsonLess = {
            less: jsonLessArray
        };
        return jsonLess;
    },
    /***********************************************************************************
     **  Replace comments to convert a less page in a Json string structure
     ***********************************************************************************/
    _replaceByRegExp: function (data) {
        var self = this;
        data = data.replace(/(\/\*\*\*\*([\*\s\@\:\.\-\(\)a-zA-Z0-9]*)\*\/)/gim, '');
        /* replace string for  categories */
        data = data.replace(/(\/\*\*\s+\=.*\s+)/gm, '{"category":"').replace(/(\s+[=].*\*\/)/gim, '"}');
        /* replace string for  commnets by objects */
        data = data.replace(/(\/\*\s+)/gm, '{').replace(/.*\=\s+\*\/|\s+\*\//gm, '"}');
        /*replace string for  labels*/
        data = data.replace(/(\/\*\*\s+label:\s+)/gim, '{"label":"');
        /*replace string for subcategories */
        data = data.replace(/(\/\*\*\s+)/gim, '{"subcategory":"');
        /* replace string to create json LESS variables */
        data = data.replace(/(@(.*):)/gim, '{"key":"$&",').replace(/(,+(.*);)/gim, ',"value":"$&"}');
        /* remove @imports from string */
        data = data.replace(/(@import.*;)/gim, '');
        /* replace colons and semicolons */
        data = data.replace(/(\"\,\s+)/gim, '"').replace(/\;/gi, '').replace(/\:\"\,/gi, '",');
        /* join variables key*/
        data = data.replace(/(\"\}\s+\{"key")/gim, '", "key"');
        /* replace strong to create an array object */
        data = data.replace(/(\}\s+)/gim, '},');
        /* replace oneColorPalette to create functions in json */
        data = data.replace(/(oneColorPalette:\s+(([@a-z-(,":0-9%)])*}?\s?([0-9%)"}]*)?))/gim, '","lessFunction":"$2"').replace(/(\"\,\s+([0-9]*\%))/gim, ",$2").replace(/(\"\")/gim, '"');
        /* replace string to create a related selector from workportal / webparts */
        data = data.replace(/(related)\:.+\[(.*)\]/gm, '","$1":"$2');
        data = '{"less":[' + data + ']}';
        data = data.replace(/(\,\])/gim, ']').replace(/(\[\s+\{)/gim, '[{').replace(/(\s+\")/gim, '"');
        return data;
    },
    /*
     *
     */
    _createSelect: function (options, key, value) {
        var self = this;
        var opts = {
            key: key,
            value: value,
            options: []
        };
        var selectedLabel = '';
        for (var i = 0; i < options.length; i++) {
            var obj = {};
            var opt = options[i];
            obj.label = (opt.label) ? opt.label : opt;
            obj.value = (opt.value) ? opt.value : opt;
            if (value === obj.value) {
                obj.selected = true;
                selectedLabel = obj.label;
            }
            opts.options.push(obj);
        }
        var list = $.tmpl("custom.theme.ui.controls.select", opts);
        return list;
    },
    _refreshPlugins: function () {
        var self = this;
        self._createFontFamily();
        self._createSwitch();
        self._createRadioButtons();
    },
    /*
     *
     */
    _createRadioButtons: function () {
        var self = this;
        var inputRadio = $('.' + self.options.radioClass);
        inputRadio.each(function () {
            var $this = $(this);
            var key = $this.data('key');
            var value = $this.val();
            var $parent = $this.parent();
            $('.biz-theme-radio', $parent).remove();
            var radioTmpl = $.tmpl('custom.theme.ui.controls.radio', {
                key: key,
                value: value
            });
            $this.parent().append(radioTmpl);
            $this.addClass('biz-ui-hide');
            var radioControl = $('.biz-theme-radio-control', radioTmpl);
            radioControl.data('value', value);
            if (value === 'active') {
                radioTmpl.addClass('biz-theme-radio-on');
            }
            else {
                radioTmpl.addClass('biz-theme-radio-off');
            }
            radioTmpl.click(function () {
                var _self = radioControl;
                var valAct = _self.data('value');
                if (valAct === 'inactive') {
                    var referenceGroup = radioTmpl.closest('.biz-theme-controls-items');
                    var referenceWrapperItem = radioTmpl.closest('.biz-theme-controls-item');
                    var siblingsGroup = $('.biz-theme-radio > .biz-theme-radio-control', referenceGroup);
                    $('.biz-theme-radio', referenceGroup).removeClass('biz-theme-radio-on').addClass('biz-theme-radio-off');
                    siblingsGroup.data('value', 'inactive');
                    $('input', referenceGroup).val('inactive');
                    _self.data('value', 'active');
                    $('input', referenceWrapperItem).val('active');
                    $('input', referenceGroup).change();
                    radioTmpl.toggleClass('biz-theme-radio-on biz-theme-radio-off');
                    for (var i = 0; i < siblingsGroup.length; i++) {
                        self._addtoQueue($(siblingsGroup[i]));
                    }
                }
            });
        });
    },
    /*
     *
     */
    _resetButton: function (action) {
        if (action == "show") {
            $(".biz-ui-theme-button-bar .biz-ui-button.biz-theme-reset").show();
        }
        else {
            $(".biz-ui-theme-button-bar .biz-ui-button.biz-theme-reset").hide();
        }
    },
    /*
     *
     */
    _createSwitch: function () {
        var self = this;
        var inputSwitch = $('.' + self.options.switchClass);
        inputSwitch.each(function () {
            var $this = $(this);
            var key = $this.data('key');
            var value = $this.val();
            var $parent = $this.parent();
            $('.biz-theme-switch', $parent).remove();
            var switchTmpl = $.tmpl('custom.theme.ui.controls.switch', {
                key: key,
                value: value
            });
            $this.parent().append(switchTmpl);
            $this.addClass('biz-ui-hide');
            var switchControl = $('.biz-theme-switch-control', switchTmpl);
            switchControl.data('value', value);
            $('input', $this.parent()).val(value).change();
            if (self._booleanFromString(value)) {
                switchTmpl.addClass('biz-theme-switch-on');
            }
            else {
                switchTmpl.addClass('biz-theme-switch-off');
            }
            switchTmpl.click(function () {
                var _self = switchControl;
                var valAct = self._booleanFromString(_self.data('value'));
                if (valAct) {
                    _self.data('value', 'false');
                }
                else {
                    _self.data('value', 'true');
                }
                $('input', switchTmpl.parent()).val(_self.data('value')).change();
                switchTmpl.toggleClass('biz-theme-switch-on biz-theme-switch-off');
                self._addtoQueue(_self);
            });
        });
    },
    /*
     *
     */
    _booleanFromString: function (val) {
        if (typeof val == "string") {
            return (val.toLowerCase() === 'true') ? true : false;
        }
        else if (typeof val == "boolean") {
            return val;
        }
        else {
            return false;
        }
    },
    /*
     *
     */
    _getThemeDataByID: function (id) {
        var self = this;
        var i = self.currentThemeList.length;
        while (i-- > 0) {
            if (self.currentThemeList[i].id == id) {
                return self.currentThemeList[i];
            }
        }
        return null;
    },
    _getThemeIdByName: function (name) {
        var self = this;
        var i = self.currentThemeList.length;
        while (i-- > 0) {
            if (self.currentThemeList[i].displayName == name || self.currentThemeList[i].name == name) {
                return self.currentThemeList[i].id;
            }
        }
        return null;
    },
    // events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function () {
        // remove generated elements
        this.element.remove();
    },
    _debug: function (msg) {
        if (this.options._debug && console) {
            console.log(msg);
        }
    },
    _printDate: function () {
        var temp = new Date();
        var padStr = function (i) {
            return (i < 10) ? "0" + i : "" + i;
        };
        var dateStr = padStr(temp.getFullYear()) +
            '/' +
            padStr(1 + temp.getMonth()) +
            '/' +
            padStr(temp.getDate()) +
            ' | ' +
            padStr(temp.getHours()) +
            ':' +
            padStr(temp.getMinutes()) +
            ':' +
            padStr(temp.getSeconds());
        return dateStr;
    },
    /**
     * If theme is Bizagi Theme
     * @param {object} currentThemeObj
     */
    _isBizagiTheme: function (currentThemeObj) {
        var self = this;
        return self.currentSelectedThemeID === self.options._baseID && currentThemeObj.value === self.options._baseValue;
    },
    /**
     * If theme was created from Bizagi Theme
     * @param {object} currentThemeObj
     */
    _isCreatedFromBizagiTheme: function (currentThemeObj) {
        var self = this;
        return currentThemeObj.css && currentThemeObj.css.indexOf(self.options._baseCSSTheme) != -1;
    },
    /**
     * If the theme has changed only images and based on Bizagi Theme
     * @param {object} currentThemeObj
     */
    _isThemeBasedOnBizagiThemeAndOnlyChangeImage: function (currentThemeObj) {
        var self = this;
        return self._isBizagiTheme(currentThemeObj) ||
            self._isCreatedFromBizagiTheme(currentThemeObj) && self.changeAplied === false;
    },
    /**
     * Set default value to theme object and validate if theme meets certain conditions
     * @param {theme Object} currentThemeObj
     */
    _setDefaultAndValidateCertainConditions: function (currentThemeObj) {
        var self = this;
        return currentThemeObj && (!self._isBizagiTheme(currentThemeObj) &&
            !self._isThemeBasedOnBizagiThemeAndOnlyChangeImage(currentThemeObj)) ||
            self.fromOneColorPalette;
    },
    /**
     * method that returns if the currentTheme Obj is Light theme or based on that
     * @param currentThemeObj
     */
    _isLightTheme: function (currentThemeObj) {
        var self = this;
        return currentThemeObj && (currentThemeObj.name.search(self.options._lightThemePreFix) == 0);
    },
    /**
     * get default logo path for theme builder sidebar
     * @param {boolean} isLightTheme
     */
    _getDefaultLogoPathForThemeBuilder: function (isLightTheme, isBizagiGoTheme) {
        if (isBizagiGoTheme === void 0) { isBizagiGoTheme = false; }
        var self = this;
        return (isLightTheme || isBizagiGoTheme) ? self.configuration.theme.brand.logoLight : self.configuration.theme.brand.logo;
    },
    /**
     * get default logo path for workportal preview
     * @param {boolean} isLightTheme
     */
    _getDefaultLogoPathForWorkportal: function (isLightTheme, isBizagiGoTheme) {
        if (isBizagiGoTheme === void 0) { isBizagiGoTheme = false; }
        var self = this;
        return (isLightTheme || isBizagiGoTheme) ? self.configuration.theme.brand.defaultLogoLight : self.configuration.theme.brand.defaultLogo;
    },
    /**
     * get id for theme selected in sidebar
     */
    _getIDThemeSelectedInSidebar: function () {
        return $(".biz-ui-theme-part.biz-ui-active").attr('id');
    },
    /**
     * enable default Light styles in themebuilder preview if is Light theme
     * @param isLightTheme
     */
    _enableDefaultLightThemeStyleSheet: function (isLightTheme) {
        var iframe = $('.biz-ui-theme-preview iframe'), _disableLightThemeStyles = !isLightTheme, _borderStyle = isLightTheme ? "none" : "";
        $('#bizagi-default-theme', iframe.contents()).prop('disabled', _disableLightThemeStyles);
        $('.ui-bizagi-wp-app-inbox-grid-cases-container table', iframe.contents()).css("border", _borderStyle);
    },
    /**
     * hide sidebar controls when is Light Theme or based on that
     * @param isLightTheme
     */
    _hideSidebarOptionsIfIsLightTheme: function (isLightTheme) {
        var self = this, selectedThemeInSidebarIsLight = isLightTheme === null && self._selectedThemeInSidebarIsLight();
        if (isLightTheme || selectedThemeInSidebarIsLight) {
            $('.biz-ui-control-list .biz-theme-category').hide();
            $('.biz-theme-label-only-color').text(bizagi.localization.getResource("widget-theme-builder-title-theme-allows-change-only-color"));
        }
        else {
            $('.biz-theme-label-only-color').text("");
        }
    },
    /**
     * return true when theme selected in sidebar is Light Theme or based on that
     * @param isLightTheme
     */
    _selectedThemeInSidebarIsLight: function () {
        var self = this, id = self._getIDThemeSelectedInSidebar(), currentThemeObj = self._getThemeDataByID(id);
        return self._isLightTheme(currentThemeObj);
    },
    /**
     * set the text of the modal according to the selected radiobutton
     */
    _newThemeRadioButtonText: function () {
        $('.biz-ui-theme-radiobutton-container').click(function () {
            var modalTextKey = $("#biz-radio-select-light:checked").val() ? "widget-theme-builder-text-automatically-defined-from" : "widget-theme-builder-text-customizable-portal-object";
            $(".biz-ui-text-object").text(bizagi.localization.getResource(modalTextKey));
        });
    }
});
//# sourceMappingURL=bizagi.theme.widget.js.map