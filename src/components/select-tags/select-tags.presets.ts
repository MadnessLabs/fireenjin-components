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
            options,
            multiple: true,
            value: [
                'important'
            ]
        }
    }
}