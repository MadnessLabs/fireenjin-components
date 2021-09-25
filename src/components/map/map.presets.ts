import { OrganismPresets } from "@madnesslabs/fireenjin-designer/dist/types/interfaces";

export default {
  default: {
    name: "Default",
    props: {
      filter: {
        label: "Filter By",
        controls: [
          {
            name: "status",
            label: "Status",
            icon: "help-circle",
            multiple: true,
            options: [
              {
                label: "Respond",
                value: "respond",
              },
              {
                label: "Evaluate",
                value: "evaluate",
              },
              {
                label: "Map",
                value: "map",
              },
              {
                label: "Dry",
                value: "dry",
              },
              {
                label: "Review",
                value: "review",
              },
              {
                label: "Complete and Get the Fuck out",
                value: "complete",
              },
              {
                label: "Lost",
                value: "lost",
              },
            ],
            value: "dry",
          },
        ],
      },
    },
  },
} as OrganismPresets;
