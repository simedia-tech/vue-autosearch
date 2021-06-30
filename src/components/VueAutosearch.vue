<style lang="scss">
.autosearch__wrapper {
  box-sizing: border-box;
  font-size: 1rem;
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
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  &--openUp {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 409.81 409.81'><defs/><path fill='%23aaa' d='M228.93 205.01L404.6 29.34c6.78-6.548 6.968-17.352.42-24.132s-17.352-6.968-24.132-.42c-.142.137-.282.277-.42.42l-175.67 175.67L29.128 5.208c-6.78-6.548-17.584-6.36-24.132.42-6.388 6.614-6.388 17.099 0 23.713l175.67 175.67-175.67 175.67c-6.663 6.664-6.663 17.468 0 24.132 6.664 6.662 17.468 6.662 24.132 0l175.67-175.67 175.67 175.67c6.78 6.548 17.584 6.36 24.132-.42 6.387-6.614 6.387-17.099 0-23.712l-175.67-175.67z' class='active-path' data-old_color='%23000000' data-original='%23000000'/></svg>");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  top: calc(50% - 0.5em);
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
      :id="id"
      ref="inputElement"
      type="text"
      autocomplete="off"
      class="autosearch__input"
      :class="{
        'autosearch__input--openDown': showResults && showResultsDirection === Direction.DOWN,
        'autosearch__input--openUp': showResults && showResultsDirection === Direction.UP
      }"
      :value="modelValue ? modelValue.name : searchTerm"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="showResults = true"
      @click="showResults = true"
      @input="searchInputHandler"
      @blur="focusLeaveHandler"
    >
    
    <span
      v-if="searchState === SearchState.LOADING"
      class="autosearch__loadingIndicator"
    />
    
    <span
      v-if="searchTerm && searchTerm.length > 0 || (modelValue && modelValue.name && modelValue.name.length > 0)"
      class="autosearch__clearSearch"
      @click="searchTerm = ''; $emit('update:modelValue', null);"
    />

    <div
      v-show="showResults"
      ref="resultsElement"
      class="autosearch__result"
      :class="{
        'autosearch__result--down': showResultsDirection === Direction.DOWN,
        'autosearch__result--up': showResultsDirection === Direction.UP
      }"
    >
      <div
        v-if="searchState === SearchState.DONE && (searchResults && searchResults.length <= 0) && !message"
        class="autosearch__result__statusMessage"
      >
        <slot name="noResults">
          No results found
        </slot>
      </div>
      
      <div
        v-if="searchState === SearchState.LOADING && (!searchResults || searchResults.length <= 0)"
        class="autosearch__result__statusMessage"
      >
        <slot name="loading">
          Loading...
        </slot>
      </div>

      <div
        v-else-if="searchState === SearchState.ERROR"
        class="autosearch__result__statusMessage"
      >
        <slot name="error">
          An error happened, please try again
        </slot>
      </div>

      <div
        v-else-if="searchState === SearchState.DONE && message"
        class="autosearch__result__statusMessage"
      >
        {{ message }}
      </div>

      <template v-if="(searchState === SearchState.DONE || searchState === SearchState.LOADING) && (searchResults && searchResults.length > 0)">
        <a
          v-for="option in searchResults"
          :key="option.id"
          class="autosearch__result__option"
          @mousedown.prevent="$emit('update:modelValue', option); showResults = false;"
        ><span v-html="option.name"></span></a>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, PropType, watch, Ref, nextTick } from "vue";

import { LeaveBehavior } from "@/enums/LeaveBehavior";
import { assertNever } from "@/util/assertNever";

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
      type: Array as null | PropType<Option[]>,
      default: null,
    },
    modelValue: {
      type: Object as null | PropType<Option>,
      default: null,
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    searchFunction: {
      type: Function as null | PropType<((searchTerm: string) => Promise<{ message: null | string; result: null | Option[] }>)>,
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    leaveBehavior: {
      type: String as PropType<LeaveBehavior>,
      default: LeaveBehavior.UNCHANGED,
    },
  },
  emits: {
    ["update:modelValue"]: (payload: null | Option) => {
      return payload === null || (payload.id && payload.name);
    },
  },
  setup(props, { emit }) {
    const { options, maxHeight, searchFunction, modelValue, disabled } = toRefs(props);

    const inputElement: Ref<null | HTMLElement> = ref(null);
    const resultsElement: Ref<null | HTMLElement> = ref(null);

    const message: Ref<null | string> = ref(null);
    const searchResults: Ref<null | Option[]> = ref([]);
    const searchState = ref(SearchState.NONE);
    const showResults = ref(false);
    const showResultsDirection = ref(Direction.DOWN);

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

      let manuallySetCursorPosition = false;

      showResults.value = true;

      if (modelValue.value !== null) {
        emit("update:modelValue", null);

        // we need nextTick here, because we want to first reset the modelValue, wait till it's pushed down again from the parent
        // and just after that update the searchTerm again. This is required, because we reset the modelValue and searchTerm
        // as soon as the modelValue gets passed `null`, because if the parent clears the modelValue, we want to completely reset
        // everything. But if the modelValue gets reset when the user has selected an entry and keeps typing, we want to set the 
        // searchTerm again in order to not reset the field as soon as the user types.
        await nextTick();
        
        // if the parent value gets reset, we await for the nextTick above and set the searchTerm just then, which would cause
        // the cursor to jump to the end, if the user changes something in the middle of the textfield. Therefor we manually reset
        // the cursor position if we await the nextTick.
        manuallySetCursorPosition = true;
      }

      searchTerm.value = searchValue;

      if (manuallySetCursorPosition === true) {
        await nextTick();

        inputElement.setSelectionRange(cursorPosition, cursorPosition);
      }
    };
  
    const focusLeaveHandler = () => {
      showResults.value = false;

      switch (props.leaveBehavior) {
        case LeaveBehavior.UNCHANGED:
          // nothing to do in this case
          break;
      
        case LeaveBehavior.RESET:
          resetSearch();

          break;

        default:
          assertNever(props.leaveBehavior);
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

    const resetSearch = () => {
      if (modelValue.value === null) {
        searchTerm.value = "";
      }
    };

    watch(modelValue, resetSearch);
    watch(disabled, resetSearch);

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

      focusLeaveHandler,
      searchInputHandler,
    };
  },
});
</script>
