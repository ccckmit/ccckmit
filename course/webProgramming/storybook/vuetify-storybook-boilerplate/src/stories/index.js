import Vue from "vue";
import { storiesOf } from "@storybook/vue";
import { linkTo } from "@storybook/addon-links";

import Welcome from "./Welcome.vue";
import MyButton from "./Button.vue";
import Layout from "./Layout.vue";

storiesOf("Welcome", module).add("to Storybook", () => ({
  components: { Welcome },
  template: '<welcome :showApp="action" />',
  methods: { action: linkTo("Button") }
}));

const menuItems = [
  {
    action: "local_activity",
    title: "Attractions",
    items: [{ title: "List Item" }]
  },
  {
    action: "restaurant",
    title: "Dining",
    active: true,
    items: [
      { title: "Breakfast & brunch" },
      { title: "New American" },
      { title: "Sushi" }
    ]
  },
  {
    action: "school",
    title: "Education",
    items: [{ title: "List Item" }]
  },
  {
    action: "directions_run",
    title: "Family",
    items: [{ title: "List Item" }]
  },
  {
    action: "healing",
    title: "Health",
    items: [{ title: "List Item" }]
  },
  {
    action: "content_cut",
    title: "Office",
    items: [{ title: "List Item" }]
  },
  {
    action: "local_offer",
    title: "Promotions",
    items: [{ title: "List Item" }]
  }
];

const menuItemsAlt = [
  {
    action: "inbox",
    title: "Mailbox"
  },
  {
    action: "note",
    title: "My Address"
  },
  {
    action: "assignment",
    title: "In Progress",
    active: true,
    items: [
      { title: "Consolidation" },
      { title: "Repacking" },
      { title: "Shipping" }
    ]
  },
  {
    action: "playlist_add_check",
    title: "Registration"
  },
  {
    action: "account_circle",
    title: "Account"
  },
  {
    action: "view_headline",
    title: "Shipped"
  }
];

storiesOf("Button", module)
  .add("button template", () => ({
    template: '<my-button :rounded="true">round</my-button>'
  }))
  .add("rounded button", () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }))
  .add("normal button", () => ({
    components: { MyButton },
    template: '<my-button :rounded="false">normal</my-button>'
  }));

storiesOf("Layout", module)
  .add("with button", () => ({
    components: { Layout, MyButton },
    data() {
      return {
        items: menuItems
      };
    },
    template:
      '<layout :items="items"><my-button :rounded="false">my button</my-button></layout>'
  }))
  .add("with rounded button", () => ({
    components: { Layout, MyButton },
    data() {
      return {
        items: menuItemsAlt
      };
    },
    template:
      '<layout :items="items"><my-button :rounded="true">my button</my-button></layout>'
  }));
