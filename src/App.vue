<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

<template>
  <div>
    <div>selected result: {{ selectedOption }}</div>
    <hr>
    <VueAutosearch
      id="myId"
      v-model="selectedOption"
      :options="options"
      placeholder="direct options"
    >
      <template #:noResults>
        Es konnte kein Ergebnis gefunden werden.
      </template>
      <template #:loading>
        Lädt...
      </template>
      <template #:error>
        Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
      </template>
    </VueAutosearch>
    <button @click="selectedOption = null">
      clear above
    </button>

    <br><br><br>
    <VueAutosearch
      v-model="disabledInputOption"
      :options="[]"
      placeholder="disabled input option"
      :disabled="true"
    />
    <br><br><br>

    <div>selected result: {{ selectedSearchOption }}</div>
    <hr>
    <VueAutosearch
      v-model="selectedSearchOption"
      :search-function="searchFunction"
      :max-height="400"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import VueAutosearch from "./components/VueAutosearch.vue";

export default defineComponent({
  name: "App",
  components: {
    VueAutosearch,
  },
  setup() {
    const selectedOption = ref(null);
    const disabledInputOption = ref(null);
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
            result: (await (await fetch(`https://nominatim.openstreetmap.org/search.php?q=${searchTerm}&polygon_geojson=1&format=jsonv2`)).json()).map((result: { place_id: number; display_name: string }) => ({ id: result.place_id, name: result.display_name })),
          });
        }, 500);
      });
    };

    const options: Ref<{ id: number; name: string }[]> = ref([]);
    onMounted(() => {
      setTimeout(() => {
        options.value = [{ id: 1, name: "first" }, { id: 2, name: "second" }, { id: 3, name: "third" }, { id: 4, name: "fourth" }, { id: 5, name: "fifth" }, { id: 6, name: "sixth" }, { id: 7, name: "seventh" }, { id: 8, name: "eight" }, { id: 9, name: "nenth" }, { id: 10, name: "tenth" }];
      }, 2000);
    });

    return {
      selectedOption,
      disabledInputOption,
      selectedSearchOption,
      options,

      searchFunction,
    };
  },
});
</script>
