---
title: 'A11yAdvent Day 22: Interactive Widgets'
---

For the most part, the web is accessible by default. That means properly structured content should go a long way and be perceivable and consumable by everyone, regardless of how they browse the web.

As we make sites and applications more and more interactive however, accessibility sometimes suffer. Basically, anything that needs to be developed by hand because it is not natively supported by the web platform is at risk of causing accessibility issues down the line. Whether it is because of designers’ lack of awareness, or developers’ shotcoming in face of a difficult technical challenge.

When adding interaction to a page that goes beyond links and forms, we have to be cautious and proceed carefully. First of all, is the solution really the best one or is there something simpler and more straightforward? Interactive widgets such as tabs, dialogs and toggles come at a cost: usability, clarity and performance.

If you must though, rely on battle-tested implementations instead of rolling your own. While a dialog might seem as simple as displaying an element on top of the page, there is actually a _lot_ of work going on there, and unless you’ve read the specifications or are well aware of the intricacies of such widget, you are most likely going to implement it incorrectly.

Here is a collection of unflavoured JavaScript suggestions if you must implement an interactive widget:

- Dialogs: [a11y-dialog](https://a11y-dialog.netlify.app/) or [aria-modal-dialog](https://github.com/scottaohara/accessible_modal_window)
- Content visibility toggles: [a11y-toggle](https://edenspiekermann.github.io/a11y-toggle/) or [Inclusive Components’ Collapsible Sections](https://inclusive-components.design/collapsible-sections/)
- Tabs: [Inclusive Components’ Tabbed Interface](https://inclusive-components.design/tabbed-interfaces/) or [a11y_tab_widget](https://github.com/scottaohara/a11y_tab_widget)
- Dropdowns: [Inclusive Components’ Menu & Menu Buttons](https://inclusive-components.design/menus-menu-buttons/)
- Tooltips: [Inclusive Components’ Tooltips & Toggletips](https://inclusive-components.design/tooltips-toggletips/) or [a11y_tooltips](https://github.com/scottaohara/a11y_tooltips)
- Sliders: [Inclusive Components’ Content Sliders](https://inclusive-components.design/a-content-slider/)
- Notifications: [Inclusive Components’ Notifications](https://inclusive-components.design/notifications/)
- Data tables: [Inclusive Components’ Data Tables](https://inclusive-components.design/data-tables/)

If you don’t mind something a bit more rough around the edges, you could check the [WCAG Authoring Guidelines](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex) which have an entire sections dedicated to understanding the expectations of interactive widgets. [Scott O’Hara also maintains accessible components](https://github.com/scottaohara/accessible_components) on GitHub. Once again, avoid rolling your own implementation if you can, and use an accessible solution instead.
