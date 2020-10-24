<style lang="scss">
.autosearch__wrapper {
  box-sizing: border-box;
  position: relative;
  text-align: left;
  width: 100%;
}

.autosearch__input {
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.4rem;
  padding-right: 0.4rem + 1rem + 0.4rem;
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

.autosearch__loadingIndicator {
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  border: 2px solid #ccc;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  height: 0.4rem;
  position: absolute;
  left: 0.2rem;
  top: 0.2rem;
  width: 0.4rem;
}

.autosearch__clearSearch {
  background-image: url("~@/assets/icons/close.svg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  top: calc(50% - 0.5rem);
  right: 0.4rem;
  height: 1rem;
  position: absolute;
  width: 1rem;

  &:hover {
    cursor: pointer;
  }
}

.autosearch__result {
  background-color: #ffffff;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  position: absolute;
  overflow-y: auto;
  width: 100%;
  z-index: 1;

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

.autosearch__result__statusMessage {
  padding: 1rem;
}

.autosearch__result__option {
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 0.4rem;

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

<template>
  <div class="autosearch__wrapper">
    <input
      ref="inputElement"
      type="text"
      autocomplete="off"
      class="autosearch__input"
      :class="{
        'autosearch__input--openDown': showResults && showResultsDirection === Direction.DOWN,
        'autosearch__input--openUp': showResults && showResultsDirection === Direction.UP
      }"
      @focus="showResults = true"
      @click="showResults = true"
      @input="searchInputHandler"
      @blur="showResults = false;"
      :value="modelValue ? modelValue.name : searchTerm"
      :placeholder="placeholder"
      :disabled="disabled"
      :id="id"
    >
    
    <span
      v-if="searchState === SearchState.LOADING"
      class="autosearch__loadingIndicator"
    ></span>
    
    <span
      v-if="searchTerm.length > 0 || (modelValue && modelValue.name.length > 0)"
      @click="searchTerm = ''; $emit('update:modelValue', null);"
      class="autosearch__clearSearch"
    ></span>

    <div
      ref="resultsElement"
      class="autosearch__result"
      :class="{
        'autosearch__result--down': showResultsDirection === Direction.DOWN,
        'autosearch__result--up': showResultsDirection === Direction.UP
      }"
      v-show="showResults"
    >
      <template v-if="searchState === SearchState.DONE && (searchResults && searchResults.length <= 0) && !message">
        <div class="autosearch__result__statusMessage">
          <slot name="noResults">No results found</slot>
        </div>
      </template>
      <template v-if="searchState === SearchState.LOADING && (!searchResults || searchResults.length <= 0)">
        <div class="autosearch__result__statusMessage">
          <slot name="loading">Loading...</slot>
        </div>
      </template>
      <template v-else-if="searchState === SearchState.ERROR">
        <div class="autosearch__result__statusMessage">
          <slot name="error">An error happened, please try again</slot>
        </div>
      </template>
      <template v-else-if="searchState === SearchState.DONE && message">
        <div class="autosearch__result__statusMessage">{{ message }}</div>
      </template>
      <template v-if="(searchState === SearchState.DONE || searchState === SearchState.LOADING) && (searchResults && searchResults.length > 0)">
        <a v-for="option in searchResults" :key="option.id" class="autosearch__result__option" @mousedown.prevent="$emit('update:modelValue', option); showResults = false;">{{ option.name }}</a>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, PropType, watch, Ref, nextTick } from "vue";

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
  name: "VueAutosearch",
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
      type: Function as PropType<null | ((searchTerm: string) => Promise<{ message: null | string; result: null | Option[] }>)>,
      default: null
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  setup(props, { emit }) {
    const { options, maxHeight, searchFunction, modelValue } = toRefs(props);

    const inputElement: Ref<null | HTMLElement> = ref(null);
    const resultsElement: Ref<null | HTMLElement> = ref(null);

    const searchState = ref(SearchState.NONE);
    const searchResults: Ref<null | Option[]> = ref([]);
    const message: Ref<null | string> = ref(null);
    const showResultsDirection = ref(Direction.DOWN);
    const showResults = ref(false);

    watch(showResults, () => {
      if (showResults.value === true && inputElement.value !== null && resultsElement.value !== null) {
        const elementBoundingClientRect = inputElement.value.getBoundingClientRect();

        const topDistance = elementBoundingClientRect.top;
        const bottomDistance = window.innerHeight - elementBoundingClientRect.bottom;

        resultsElement.value.style.maxHeight = `${maxHeight.value}px`;

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
    const searchInputHandler = async (event: InputEvent) => {
      const inputElement = (event.target as HTMLInputElement);
      const searchValue = inputElement.value;
      const cursorPosition = inputElement.selectionStart ?? searchValue.length;

      let manuallySetCurosrPosition = false;

      showResults.value = true;

      if (modelValue.value !== null) {
        emit("update:modelValue", null);

        // we need nextTick here, because we want to first reset the modelValue, wait till it's pushed down again from the parent
        // and just after that update the searchTerm again. This is required, because we reset the modelValue and searchTerm
        // as soon as the modelValue gets passed `null`, because if the parent clears the modelValue, we want to completely reset
        // everything. But if the modelValue gets reset when the user has selected an entry and keeps typing, we want to set the 
        // searcTerm again in order to not reset the field as soon as the user types.
        await nextTick();
        
        // if the parent value gets reset, we await for the nextTick above and set the searchTerm just then, which would cause
        // the cursor to jump to the end, if the user changes something in the middle of the textfield. Therefor we manually reset
        // the cursor position if we await the nextTick.
        manuallySetCurosrPosition = true;
      }

      searchTerm.value = searchValue;

      if (manuallySetCurosrPosition === true) {
        await nextTick();

        inputElement.setSelectionRange(cursorPosition, cursorPosition);
      }
    };
    const filterAction = async () => {
      message.value = null;

      if (searchFunction.value !== null && options.value === null) {
        try {
          searchState.value = SearchState.LOADING;

          const result = await searchFunction.value(searchTerm.value);
          searchResults.value = result.result;
          message.value = result.message;

          searchState.value = SearchState.DONE;
        } catch {
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
    };

    watch(searchTerm, filterAction, { immediate: true });
    watch(options, filterAction, { immediate: true });

    watch(modelValue, () => {
      if (modelValue.value === null) {
        searchTerm.value = "";
      }
    });

    return {
      inputElement,
      resultsElement,

      Direction,
      SearchState,

      message,
      searchTerm,
      searchResults,
      searchState,
      showResults,
      showResultsDirection,

      searchInputHandler,
    };
  }
});
</script>
