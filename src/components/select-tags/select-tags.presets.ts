const options = [
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

export default {
    default: {
        name: "With Options",
        props: {
            label: "Tags",
            multiple: true,
            options
        }
    },
    withValue: {
        name: "With Value",
        props: {
            label: "Tags",
            options,
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
            options,
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
}