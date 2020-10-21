# Vue Autosearch
A Vue.js 3 component for synchronous and asynchronous autocomplete and search.

## Characteristics
- No dependencies
- Works with synchronous options or custom search logic
- Supports `v-model`

---

## Sponsors
<a href="https://www.simedia.com/" title="SiMedia" rel="nofollow"><img src="./sponsors/simedia.svg" style="max-width: 350px"></a>

SiMedia is focussed on websites, tourism portals, online marketing and software for the touristic sector.

---

## Available options

### `v-model`
- a reference to a property inside the parent component which the selected result from the vue-autosearch will be bound to.
- example usage: `v-model="selectedOption"`
- defaults to null
- when the user clicks or selects an option inside the results list, the passed property will contain the whole object, which has been selected

### `options`
- an array containing elements typed as { id: number; name: string }
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

### `placeholder`
- a string to be used as placeholder inside the search input
- example usage: `placeholder="enter to search"` or as property `v-bind:placeholder="myPlaceholder"`
- defaults to an empty string

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
Renders an input form and as soon as the search input gets focussed, the user sees the results and can scroll and filter through them.

```vue
<template>
  <AutoSearch
    v-model="selectedOption"
    v-bind:options="options"
  />
</template>

<script>
  export default {
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
```

### Custom placeholder and custom maxHeight
Same as the minimal version, but adds a custom placeholder text and changes the maximum height of the result box.

```vue
<template>
  <AutoSearch
    v-model="selectedOption"
    v-bind:options="options"
    placeholder="Type to filter results",
    v-bind:maxHeight="400"
  />
</template>

<script>
  export default {
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
```

### Custom message texts
Same as the minimal version, but adds custom texts to be shown if no results were found or an error happened.

```vue
<template>
  <AutoSearch
    v-model="selectedOption"
    v-bind:options="options"
  >
    <template v-slot:noResults>Custom message, if no results were found</template>
    <template v-slot:error>Custom message, if an error happened</template>
    <template v-slot:loading>Custom message, if the application is currently loading the results</template>
  </AutoSearch>
</template>

<script>
  export default {
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
```

### Custom search function
Use the searchFunction prop to handle custom search logic, debouncing and async calls.

```vue
<template>
  <AutoSearch
    v-model="selectedOption"
    :searchFunction="searchFunction"
  />
</template>

<script>
  export default {
    data() {
      return {
        selectedOption: null,
        searchTimeout: null
      }
    },
    methods: {
      searchFunction(searchTerm: string) => {
        return new Promise((resolve) => {
          if (searchTimeout) clearTimeout(searchTimeout);

          if (searchTerm.length < 3) {
            return resolve({
              message: "needs at least 3 characters",
            });
          }

          searchTimeout = setTimeout(async () => {
            const searchResults = (await (await fetch(`https://nominatim.openstreetmap.org/search.php?q=${searchTerm}&polygon_geojson=1&format=jsonv2`)).json()).map((result: { place_id: number; display_name: string }) => ({ id: result.place_id, name: result.display_name }));

            return resolve({
              result: searchResults
            })
          }, 500);
        });
      };
    }
  }
</script>
```