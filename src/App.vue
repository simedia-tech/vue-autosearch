<template>
  selected result: {{ selectedOption }}
  <hr>
  <VueAutosearch
    v-model="selectedOption"
    :options="[{ id: 1, name: 'first' }, { id: 2, name: 'second' }, { id: 3, name: 'third' }, { id: 4, name: 'fourth' }, { id: 5, name: 'fifth' }, { id: 6, name: 'sixth' }, { id: 7, name: 'seventh' }, { id: 8, name: 'eight' }, { id: 9, name: 'nenth' }, { id: 10, name: 'tenth' }]"
    placeholder="direct options"
  >
    <template #:noResults>Es konnte kein Ergebnis gefunden werden.</template>
    <template #:loading>Lädt...</template>
    <template #:error>Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.</template>
  </VueAutosearch>

  <br><br><br>

  selected result: {{ selectedSearchOption }}
  <hr>
  <VueAutosearch
    v-model="selectedSearchOption"
    :searchFunction="searchFunction"
    :maxHeight="400"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueAutosearch from './components/vue-autosearch.vue';

export default defineComponent({
  name: 'App',
  components: {
    VueAutosearch
  },
  setup() {
    const selectedOption = ref(null);
    const selectedSearchOption = ref(null);

    let searchTimeout: null | number = null;
    const searchFunction = (searchTerm: string) => {
      return new Promise((resolve) => {
        if (searchTimeout) clearTimeout(searchTimeout);

        if (searchTerm.length < 3) {
          return resolve({
            message: "needs at least 3 characters",
          });
        }

        searchTimeout = setTimeout(async () => {
          return resolve({
            result: (await (await fetch(`https://nominatim.openstreetmap.org/search.php?q=${searchTerm}&polygon_geojson=1&format=jsonv2`)).json()).map((result: { place_id: number; display_name: string }) => ({ id: result.place_id, name: result.display_name }))
          })
        }, 500);
      });
    };

    return {
      selectedOption,
      selectedSearchOption,

      searchFunction
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
