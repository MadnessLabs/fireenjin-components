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
                display: "list",
                endpoint: "listUsers",
                limit: 15,
                listEl: function (_a) {
                    var result = _a.result;
                    return "<h1>" + result.id + "</h1>";
                },
                collection: "users",
                results: [
                    { id: "001" },
                    { id: "002" },
                    { id: "003" }
                ]
            },
            beforeHTML: function () { return "<h1>User List</h1>"; },
            innerHTML: function (_component, props) { return "\n            <ion-content>\n                <fireenjin-pagination display=\"" + props.display + "\" endpoint=\"" + props.endpoint + "\" limit=\"" + props.limit + "\" collection=\"" + props.collection + "\"></fireenjin-pagination>\n            </ion-content>\n        "; },
            hooks: {
                onComponentDidLoad: function (_a) {
                    var organismEl = _a.organismEl, props = _a.props;
                    if (!organismEl.querySelector("fireenjin-pagination"))
                        return;
                    organismEl.querySelector("fireenjin-pagination").listEl = props.listEl;
                    organismEl.querySelector("fireenjin-pagination").results = props.results;
                }
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
