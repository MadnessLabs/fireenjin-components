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
define("src/components/filter-bar/filter-bar.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        "default": {
            props: {
                modeToggle: true,
                filter: {
                    label: "Filter By",
                    controls: [
                        {
                            name: "companyId",
                            label: "Company",
                            endpoint: "listCompanies",
                            icon: "business",
                            resultsKey: "locations.results"
                        },
                        {
                            name: "locationId",
                            value: "TGjRNPVFDHFbsamnxeSt",
                            label: "Location",
                            endpoint: "listLocations",
                            icon: "business",
                            dataPropsMap: {
                                locations: "results"
                            }
                        },
                        {
                            name: "tags",
                            label: "Tags",
                            icon: "pricetags",
                            multiple: true,
                            options: [
                                {
                                    label: "Important",
                                    value: "important"
                                },
                                {
                                    label: "Referral",
                                    value: "referral"
                                },
                                {
                                    label: "Plumber",
                                    value: "plumber"
                                },
                                {
                                    label: "Staff",
                                    value: "staff"
                                },
                                {
                                    label: "Agent",
                                    value: "agent"
                                },
                                {
                                    label: "Property Manager",
                                    value: "property manager"
                                },
                                {
                                    label: "PEU",
                                    value: "peu"
                                },
                            ]
                        },
                    ]
                },
                sort: {
                    header: "Sort By",
                    value: "firstName",
                    options: [
                        {
                            label: "Created At",
                            value: "createdAt:desc"
                        },
                        {
                            label: "First Name",
                            value: "firstName"
                        },
                        {
                            label: "Last Name",
                            value: "lastName"
                        },
                        {
                            label: "Email Address",
                            value: "email"
                        },
                    ]
                }
            }
        }
    };
});
define("src/components/graph/graph.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        "default": {
            name: "Pie Chart",
            props: {
                type: "pie",
                labels: ["Test 1", "test 2"],
                datasets: [
                    {
                        label: "Dataset 1",
                        data: [30, 20],
                        backgroundColor: ["red", "blue"]
                    },
                ]
            }
        },
        bar: {
            name: "Bar Chart",
            props: {
                type: "bar",
                labels: ["Test 1", "test 2"],
                datasets: [
                    {
                        label: "Dataset 1",
                        data: [30, 20],
                        backgroundColor: ["red", "blue"]
                    },
                ]
            }
        },
        line: {
            name: "Line Chart",
            props: {
                type: "line",
                labels: ["Test 1", "test 2"],
                datasets: [
                    {
                        label: "Dataset 1",
                        data: [30, 20],
                        backgroundColor: ["red", "blue"]
                    },
                ]
            }
        }
    };
});
define("src/components/json-editor/json-editor.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        "default": {
            props: {
                value: {
                    test: {
                        asdf: true
                    }
                }
            }
        }
    };
});
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
define("src/components/render-template/render-template.presets", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        "default": {
            name: "Default",
            props: {
                template: {
                    html: "<p>testing {{user.firstName}}</p>"
                },
                data: {
                    user: {
                        firstName: "Bobby"
                    }
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
