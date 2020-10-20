<template>
  <div class="auto-select__wrapper">
    <input
      ref="inputElement"
      type="text"
      class="auto-select__input"
      :class="{
        'auto-select__input--openDown': showResults && showResultsDirection === Direction.DOWN,
        'auto-select__input--openUp': showResults && showResultsDirection === Direction.UP
      }"
      autocomplete="off"
      @focus="showResults = true"
      @click="showResults = true"
      @input="showResults = true; $emit('update:modelValue', null); searchTerm = $event.target.value;"
      @blur="showResults = false;"
      :data-model="modelValue"
      :value="modelValue ? modelValue.name : searchTerm"
    >
    <span
      v-if="searchState === SearchState.LOADING"
      class="auto-select__loadingIndicator"
    ></span>
    <span
      v-if="searchTerm.length > 0 || (modelValue && modelValue.name.length > 0)"
      @click="searchTerm = ''; $emit('update:modelValue', null);"
      class="auto-select__clearSearch"
    ></span>
    <div
      ref="resultsElement"
      class="auto-select__result"
      :class="{
        'auto-select__result--down': showResultsDirection === Direction.DOWN,
        'auto-select__result--up': showResultsDirection === Direction.UP
      }"
      v-show="showResults"
    >
      <template v-if="searchState === SearchState.DONE && (searchResults && searchResults.length <= 0) && !customMessage">
        <div class="auto-select__result__statusMessage">no results</div>
      </template>
      <template v-else-if="searchState === SearchState.ERROR">
        <div class="auto-select__result__statusMessage">error</div>
      </template>
      <template v-else-if="searchState === SearchState.DONE && customMessage">
        <div class="auto-select__result__statusMessage">{{ customMessage }}</div>
      </template>
      <template v-if="(searchState === SearchState.DONE || searchState === SearchState.LOADING) && (searchResults && searchResults.length > 0)">
        <a v-for="option in searchResults" :key="option.id" class="auto-select__result__option" @mousedown.prevent="$emit('update:modelValue', option); showResults = false;">{{ option.name }}</a>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, computed, PropType, ComputedRef, watch, Ref } from "vue";

interface Option {
  id: number;
  name: string;
}

enum Direction {
  DOWN,
  UP
}

export enum SearchState {
  NONE,
  LOADING,
  DONE,
  ERROR
}

export default defineComponent({
  name: "AutoSelect",
  props: {
    options: {
      type: Array as PropType<null | Option[]>,
      default: null
    },
    modelValue: {
      type: Object as PropType<null | Option>,
      default: null
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    searchFunction: {
      type: Function as PropType<null | ((searchTerm: string) => Promise<{ message: null| string; result?: Option[] }>)>,
      default: null
    }
  },
  setup(props) {
    const { options, maxHeight, searchFunction } = toRefs(props);

    const inputElement: Ref<null | HTMLElement> = ref(null);
    const resultsElement: Ref<null | HTMLElement> = ref(null);

    const searchState = ref(SearchState.NONE);
    const searchResults: Ref<undefined | Option[]> = ref([]);
    const customMessage: Ref<null | string> = ref(null);
    const showResultsDirection = ref(Direction.DOWN);
    const showResults = ref(false);

    watch(showResults, () => {
      if (showResults.value === true && inputElement.value !== null && resultsElement.value !== null) {
        const elementBoundingClientRect = inputElement.value.getBoundingClientRect();

        const topDistance = elementBoundingClientRect.top;
        const bottomDistance = window.innerHeight - elementBoundingClientRect.bottom;

        if (bottomDistance - 10 >= maxHeight.value) {
          showResultsDirection.value = Direction.DOWN;
          resultsElement.value.style.bottom = "unset";
          resultsElement.value.style.maxHeight = `${maxHeight.value}px`;
        } else {
          if (topDistance > bottomDistance) {
            showResultsDirection.value = Direction.UP;
            resultsElement.value.style.bottom = `${elementBoundingClientRect.height}px`;

            if (topDistance - 10 < maxHeight.value) {
              resultsElement.value.style.maxHeight = `${topDistance - 10}px`;
            }
          } else {
            showResultsDirection.value = Direction.DOWN;
            resultsElement.value.style.bottom = "unset";

            if (bottomDistance - 10 < maxHeight.value) {
              resultsElement.value.style.maxHeight = `${bottomDistance - 10}px`;
            }
          }
        }
      }
    });

    const searchTerm = ref("");
    watch(searchTerm, async () => {
      customMessage.value = null;

      if (searchFunction.value !== null && options.value === null) {
        try {
          searchState.value = SearchState.LOADING;

          const result = await searchFunction.value(searchTerm.value);
          searchResults.value = result.result;
          customMessage.value = result.message;

          searchState.value = SearchState.DONE;
        } catch (error) {
          console.error(error);

          searchResults.value = [];
          searchState.value = SearchState.ERROR;
        }
      } else if (searchFunction.value === null && options.value !== null) {
        // if an options array will be passed, "search" is already done, as there's no external call required
        searchState.value = SearchState.DONE;

        let optionsToReturn = options.value;

        if (searchTerm.value.trim().length > 0) {
          optionsToReturn = optionsToReturn.filter((option) => option.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
        }

        searchResults.value = optionsToReturn;
      }
    }, { immediate: true });

    return {
      inputElement,
      resultsElement,

      Direction,
      SearchState,

      customMessage,
      searchTerm,
      searchResults,
      searchState,
      showResults,
      showResultsDirection,
    };
  }
});
</script>

<style scoped lang="scss">
.auto-select__wrapper {
  box-sizing: border-box;
  max-width: 30rem;
  position: relative;
  width: 100%;
}

.auto-select__input {
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  box-sizing: border-box;
  padding: 0.7rem;
  padding-right: 0.7rem + 1rem + 0.7rem;
  font-size: 1rem;
  width: 100%;

  &--openDown {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--openUp {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

.auto-select__loadingIndicator {
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  border: 2px solid #ccc;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  height: 0.5rem;
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 0.5rem;
}

.auto-select__clearSearch {
  background-image: url("~@/assets/icons/close.svg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  top: calc(50% - 0.5rem);
  right: 0.7rem;
  height: 1rem;
  position: absolute;
  width: 1rem;

  &:hover {
    cursor: pointer;
  }
}

.auto-select__result {
  background-color: #ffffff;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  position: absolute;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;

  &--down {
    border-radius: 0 0 0.2rem 0.2rem;
    border-top: unset;
    margin-top: 0;
  }

  &--up {
    border-radius: 0.2rem 0.2rem 0 0;
    border-bottom: unset;
  }
}

.auto-select__result__statusMessage {
  padding: 1rem;
}

.auto-select__result__option {
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 1rem;

  &:hover {
    background-color: lightgrey;
  }
}

@keyframes pulse {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}
</style>
