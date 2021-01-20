"use strict";
function define(name, dependencies, callback) {
    if (!name || !dependencies || !callback)
        return;
    var exports = {};
    callback({}, exports);
    if (!window.presets)
        window.presets = {};
    window.presets[name.split('/').pop()] = exports["default"];
}
;
define("src/components/pagination/pagination.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        list: {
            props: {
                display: "grid"
            }
        }
    };
});
define("src/components/select-tags/select-tags.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var options = [
        {
            label: "Imortant",
            value: "important"
        },
        {
            label: "Bug",
            value: "bug"
        },
        {
            label: "Idea",
            value: "idea"
        }
    ];
    exports["default"] = {
        "default": {
            name: "With Options",
            props: {
                label: "Tags",
                multiple: true,
                options: options
            }
        },
        withValue: {
            name: "With Value",
            props: {
                label: "Tags",
                options: options,
                multiple: true,
                value: [
                    'important'
                ]
            }
        },
        withAdding: {
            name: "With Adding",
            props: {
                allowAdding: true,
                label: "Tags",
                options: options,
                multiple: true,
                value: [
                    "important"
                ]
            }
        },
        withEndpoint: {
            name: "Data from API",
            props: {
                allowAdding: true,
                label: "Tags",
                endpoint: "listRoles",
                resultsKey: "roles",
                limit: 100
            }
        }
    };
});
