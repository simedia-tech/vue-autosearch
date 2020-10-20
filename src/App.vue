<template>
  selected result: {{ selectedOption }}
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <hr>

  <AutoSelect
    v-model="selectedOption"
    :options="[{ id: 1, name: 'first' }, { id: 2, name: 'second' }, { id: 3, name: 'third' }, { id: 4, name: 'fourth' }, { id: 5, name: 'fifth' }, { id: 6, name: 'sixth' }, { id: 7, name: 'seventh' }, { id: 8, name: 'eight' }, { id: 9, name: 'nenth' }, { id: 10, name: 'tenth' }]"
    :maxHeight="300"
    placeholder="get this option"
  >
    <template v-slot:noResults>Es konnte kein Ergebnis gefunden werden.</template>
    <template v-slot:error>Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.</template>
  </AutoSelect>

  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>

  <AutoSelect
    v-model="selectedSearchOption"
    :searchFunction="searchFunction"
    :maxHeight="300"
  />

  <p>Jelly beans danish sweet roll pastry candy jelly. Sweet roll topping jelly beans pudding macaroon toffee. Tiramisu pastry candy cheesecake powder brownie cheesecake bonbon. Toffee marzipan powder lemon drops marzipan jujubes dragée croissant. Marshmallow cookie chocolate dessert. Cheesecake bonbon jujubes sweet roll brownie dragée. Muffin jelly-o toffee oat cake muffin. Powder soufflé pudding carrot cake sweet roll ice cream cupcake wafer sweet. Marshmallow pie pudding powder toffee pie tart topping jujubes. Bear claw donut dragée sugar plum. Jelly-o powder pudding topping jelly beans apple pie tiramisu dragée pastry. Gummies bear claw dragée tart chocolate. Jelly beans cookie lemon drops.</p>

  <p>Candy soufflé cheesecake. Sweet roll candy topping. Cheesecake wafer tootsie roll gummies jelly beans bear claw. Macaroon topping liquorice pudding donut toffee cake. Icing macaroon apple pie jujubes. Sweet sugar plum cotton candy wafer topping biscuit. Muffin pie gingerbread candy canes sweet roll marzipan jelly-o chocolate bar jelly-o. Chocolate bar tootsie roll apple pie dessert oat cake fruitcake brownie. Biscuit cupcake jujubes wafer wafer candy canes topping. Cake cake carrot cake. Muffin lemon drops chupa chups croissant caramels sugar plum. Bonbon toffee tiramisu jelly beans macaroon toffee lollipop pastry toffee. Macaroon cookie sweet donut pie pudding liquorice tart.</p>

  <p>Chocolate bar bear claw icing dragée muffin apple pie. Cookie powder candy tart bonbon soufflé. Brownie sweet roll sesame snaps sesame snaps oat cake tootsie roll bear claw ice cream jujubes. Dessert jujubes pastry cotton candy tart tootsie roll sweet roll chocolate. Gummies liquorice chocolate cake. Macaroon tart tart muffin croissant oat cake donut. Icing jelly-o pastry biscuit. Cotton candy tiramisu candy canes jelly beans gummies gummi bears lemon drops. Caramels cheesecake danish dessert. Candy muffin sugar plum. Chocolate cookie chocolate bar chocolate cake powder jelly. Tootsie roll donut gummi bears tiramisu cotton candy tiramisu ice cream macaroon macaroon.</p>

  <p>Chocolate cake carrot cake carrot cake pastry chupa chups brownie pudding. Dessert chocolate bar chocolate. Chocolate bar pie tiramisu macaroon sugar plum. Pastry jelly-o cheesecake cake muffin powder. Ice cream lollipop soufflé icing biscuit muffin. Macaroon jelly brownie candy canes liquorice tiramisu pudding gummies candy canes. Candy canes gummi bears tart tart gummies tootsie roll tootsie roll gingerbread. Gummies lollipop chocolate cake jelly-o halvah. Powder wafer bonbon jelly croissant donut cotton candy cupcake. Liquorice cake pudding cookie sugar plum biscuit ice cream danish. Gummies marzipan caramels powder. Tart cupcake jelly marzipan. Sugar plum lollipop tiramisu sesame snaps biscuit. Cookie pie jelly-o pie tootsie roll.</p>

  <p>Bonbon candy canes danish cake bear claw cotton candy. Cheesecake chupa chups lemon drops. Sweet roll fruitcake donut muffin wafer tootsie roll marzipan gingerbread sugar plum. Toffee gingerbread sugar plum sweet brownie liquorice. Cheesecake marshmallow dragée liquorice oat cake tart soufflé danish. Jelly-o cake chocolate bar bear claw candy donut jelly tootsie roll gingerbread. Soufflé halvah liquorice. Candy canes macaroon apple pie pudding oat cake. Candy soufflé wafer chocolate sugar plum. Bear claw chocolate chupa chups marzipan muffin lemon drops macaroon danish. Croissant jelly beans cheesecake chocolate bar chocolate bar tootsie roll oat cake topping. Caramels pie sweet roll lollipop icing candy. Marzipan fruitcake cookie gummi bears liquorice. Jelly-o cotton candy jujubes powder.</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AutoSelect from './components/AutoSelect.vue';

export default defineComponent({
  name: 'App',
  components: {
    AutoSelect
  },
  setup() {
    const selectedOption = ref(null);
    const selectedSearchOption = ref(null);

    const searchFunction = async (searchTerm: string) => {
      if (searchTerm.length < 3) {
        return {
          message: "needs at least 3 characters",
        };
      }

      return {
        result: (await (await fetch('https://jsonplaceholder.typicode.com/todos/')).json()).map((result: any) => ({ id: result.id, name: result.title }))
      }
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
