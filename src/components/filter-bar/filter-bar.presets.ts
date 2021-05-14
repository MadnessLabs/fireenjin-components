import { OrganismPresets } from "@madnesslabs/fireenjin-designer/dist/types/interfaces";

export default {
  default: {
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
              locations: "results",
            },
          },
          {
            name: "tags",
            label: "Tags",
            icon: "pricetags",
            multiple: true,
            options: [
              {
                label: "Important",
                value: "important",
              },
              {
                label: "Referral",
                value: "referral",
              },
              {
                label: "Plumber",
                value: "plumber",
              },
              {
                label: "Staff",
                value: "staff",
              },
              {
                label: "Agent",
                value: "agent",
              },
              {
                label: "Property Manager",
                value: "property manager",
              },
              {
                label: "PEU",
                value: "peu",
              },
            ],
          },
        ],
      },
      sort: {
        header: "Sort By",
        value: "firstName",
        options: [
          {
            label: "Created At",
            value: "createdAt:desc",
          },
          {
            label: "First Name",
            value: "firstName",
          },
          {
            label: "Last Name",
            value: "lastName",
          },
          {
            label: "Email Address",
            value: "email",
          },
        ],
      },
    },
  },
} as OrganismPresets;
