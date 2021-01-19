define("pagination/pagination.presets", ["require", "exports"], function (require, exports) {
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
define("select-tags/select-tags.presets", ["require", "exports"], function (require, exports) {
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
                multiple: true,
                options: options
            }
        },
        withValue: {
            name: "With Value",
            props: {
                options: options,
                multiple: true,
                value: [
                    'important'
                ]
            }
        }
    };
});
