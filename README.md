# Vue Autosearch ![GitHub Actions](https://github.com/simedia-tech/vue-autosearch/workflows/GitHub%20Actions/badge.svg) [![npm](https://img.shields.io/npm/v/vue-autosearch.svg)](https://www.npmjs.com/package/vue-autosearch) ![minzip](https://badgen.net/bundlephobia/minzip/vue-autosearch)
A Vue.js 3 component for synchronous and asynchronous autocomplete and search.

## Characteristics
- No dependencies
- Works with synchronous options or custom search logic
- Supports `v-model`
- Customizable texts for different languages
- Small footprint (~5KB minified + gzip)
- Tree-shakable

## Live Demos
See [Examples](#examples)

## Installation
Install Vue Autosearch as a NPM dependency or grab the latest version from the CDN.

**NPM:**
```shell
# yarn
yarn add vue-autosearch

# npm
npm i vue-autosearch
```

**CDN:**
```javascript
<script src="https://unpkg.com/vue-autosearch/dist/VueAutosearch.umd.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/vue-autosearch/dist/VueAutosearch.css" />
```

## Basic usage

```vue
<template>
  <VueAutosearch
    v-model="selectedOption"
    v-bind:options="options"
  />
</template>

<script>
  import VueAutosearch from "vue-autosearch";

  export default {
    components: {
      VueAutosearch
    },
    data() {
      return {
        selectedOption: null,
        options: [
          { id: 1, name: "Tesla Model S" },
          { id: 2, name: "Tesla Model 3" }
        ]
      }
    }
  }
</script>

<style src="vue-autosearch/dist/VueAutosearch.css"></style>
```

---

## Sponsors
<p align="center">
  <a href="https://www.simedia.com/" title="SiMedia" rel="nofollow"><img src="https://raw.githubusercontent.com/simedia-tech/vue-autosearch/main/sponsors/simedia.svg" width="350px"></a>

  SiMedia is focussed on websites, tourism portals, online marketing and software for the touristic sector.
</p>

---

## Available options

### `v-model`
- a reference to a property inside the parent component which the selected result from the vue-autosearch will be bound to.
- example usage: `v-model="selectedOption"`
- defaults to null
- when the user clicks or selects an option inside the results list, the passed property will contain the whole object, which has been selected

### `options`
- an array containing elements typed as { id: number; name: string }
- can alternatively be a ref with an empty array, which will be populated later with data (asynchronous without using a custom searchFunction)
- example usage: `v-bind:options="[{ id: 1, name: 'Tesla Model S' }, { id: 2, name: 'Tesla Model 3' }]"`
- defaults to null
- when passing an options array, the options will be directly shown in the output when the user clicks or focusses the search input
- in this case, it's not permitted to also pass an additional `searchFunction`
- when typing in the input, the results will be automatically filtered

### `maxHeight`
- the maximum height in pixels of the results box. Generally, the height will be adapted to the available space
- example usage: `v-bind:maxHeight="400"`. Keep in mind that you have to use v-bind to pass down a number instead of a string.
- defaults to 300

### `searchFunction`
- a function, which will be called during initial render and on each search input. This can also be used for example to prevent search until the user entered at least 3 characters
- the function is typed as `(searchTerm: string) => Promise<{ message: null | string; result: null | { id: number; name: string } }>`
- example usage: see examples below
- defaults to null
- the function gets called with the current searchTerm, which can be used for custom filter logic and external search functionality
- the return value must be an object with either a message string or result array. If a message string will be passed with no result, the message will be displayed (e.g. if the user should enter a few characters before searching). If no message will be passed, but a result array, the results will be displayed
- vue-autosearch automatically handles exceptions, where the searchFunction throws an error and quietly displays an error message inside the result box. You can also wrap your own searchFunction into a trycatch if you want to separately log the error. In any case make sure to throw the error after that in order to allow the component to propertly show an error message inside the vue-autosearch results box.
- when passing a searchFunction, this function is responsible to return the results and therefor it's not allowed to pass in an options array along with a searchFunction

### `id`
- a string to be assigned to the `id` property of the search input field
- example usage: `id="country_search"` or as property `v-bind:id="customIdProperty"`
- no default, as it's an optional field
- useful for example in combination with a label to focus the input when the label gets clicked

### `placeholder`
- a string to be used as placeholder inside the search input
- example usage: `placeholder="enter to search"` or as property `v-bind:placeholder="myPlaceholder"`
- defaults to an empty string

### `disabled`
- a boolean to specify, if the input field should be enabled or disabled
- example usage: `v-bind:disabled="true"` or for example as computed property `v-bind:disabled="shouldBeDisabled"`
- defaults to false (meaning that by default the input field will be enabled)

### `leaveBehavior`
- a string, which defines, what should happen, when the input loses focus and nothing has been selected yet
- example usage: `leaveBehavior="unchanged"` (same as not providing the property at all) if you want to keep the search text inside the input field or `leaveBehavior="reset"` if you want to reset the content to an empty string when the user clicks outside the input
- defaults to "unchanged" (meaning that the search text will be kept when the user clicks outside)

## Custom texts
By default, if no results were found, the application is loading the search results or an error happened, the according message in English will be displayed ("No results found", "Loading..." and "An error happened, please try again" respectively). These texts can be overwritten for each single component by using slots. This is useful, if you have your app localized to different languages.

```vue
<template v-slot:noResults>Custom message, if no results were found</template>
<template v-slot:error>Custom message, if an error happened</template>
<template v-slot:loading>Custom message, if the application is currently loading the results</template>
```

---

## Examples

### Minimal version
**[Live Demo](https://codesandbox.io/s/vueautosearch-minimal-version-fukop)**

Renders an input form and as soon as the search input gets focussed, the user sees the results and can scroll and filter through them.

```vue
<template>
  <VueAutosearch
    v-model="selectedOption"
    v-bind:options="options"
  />
</template>

<script>
  import VueAutosearch from "vue-autosearch";

  export default {
    components: {
      VueAutosearch
    },
    data() {
      return {
        selectedOption: null,
        options: [
          { id: 1, name: "Tesla Model S" },
          { id: 2, name: "Tesla Model 3" }
        ]
      }
    }
  }
</script>

<style src="vue-autosearch/dist/VueAutosearch.css"></style>
```

### Custom placeholder and custom maxHeight
**[Live Demo](https://codesandbox.io/s/vueautosearch-custom-placeholder-and-custom-maxheight-k2nq8)**

Same as the minimal version, but adds a custom placeholder text and changes the maximum height of the result box.

```vue
<template>
  <VueAutosearch
    v-model="selectedOption"
    v-bind:options="options"
    placeholder="Type to filter results"
    v-bind:maxHeight="150"
  />
</template>

<script>
  import VueAutosearch from "vue-autosearch";

  export default {
    components: {
      VueAutosearch
    },
    data() {
      return {
        selectedOption: null,
        options: [
          { id: 1, name: "Tesla Model S" },
          { id: 2, name: "Tesla Model 3" }
        ]
      }
    }
  }
</script>

<style src="vue-autosearch/dist/VueAutosearch.css"></style>
```

### Custom message texts
**[Live demo](https://codesandbox.io/s/vueautosearch-custom-message-texts-gxl0x?file=/src/App.vue)**

Same as the minimal version, but adds custom texts to be shown if no results were found or an error happened.

```vue
<template>
  <VueAutosearch
    v-model="selectedOption"
    v-bind:options="options"
  >
    <template v-slot:noResults>Custom message, if no results were found</template>
    <template v-slot:error>Custom message, if an error happened</template>
    <template v-slot:loading>Custom message, if the application is currently loading the results</template>
  </VueAutosearch>
</template>

<script>
  import VueAutosearch from "vue-autosearch";

  export default {
    components: {
      VueAutosearch
    },
    data() {
      return {
        selectedOption: null,
        options: [
          { id: 1, name: "Tesla Model S" },
          { id: 2, name: "Tesla Model 3" }
        ]
      }
    }
  }
</script>

<style src="vue-autosearch/dist/VueAutosearch.css"></style>
```

### Custom search function
**[Live demo](https://codesandbox.io/s/vueautosearch-custom-search-function-zb99b)**

Use the searchFunction prop to handle custom search logic, debouncing and async calls.

```vue
<template>
  <VueAutosearch
    v-model="selectedOption"
    :searchFunction="searchFunction"
    placeholder="Search for a city, country or palce"
  />
</template>

<script>
  import VueAutosearch from "vue-autosearch";

  export default {
    components: {
      VueAutosearch
    },
    data() {
      return {
        selectedOption: null,
        searchTimeout: null
      }
    },
    methods: {
      searchFunction(searchTerm) {
        return new Promise((resolve) => {
          if (this.searchTimeout) clearTimeout(this.searchTimeout);

          if (searchTerm.length < 3) {
            return resolve({
              message: "needs at least 3 characters",
            });
          }

          this.searchTimeout = setTimeout(async () => {
            const searchResults = (await (await fetch(`https://nominatim.openstreetmap.org/search.php?q=${searchTerm}&polygon_geojson=1&format=jsonv2`)).json()).map((result) => ({ id: result.place_id, name: result.display_name }));

            return resolve({
              result: searchResults
            })
          }, 500);
        });
      }
    }
  }
</script>

<style src="vue-autosearch/dist/VueAutosearch.css"></style>
```