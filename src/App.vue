<template>
  <div>
    <h1>{{ value }} .!</h1>
    <IAmHotReloadable/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import IAmHotReloadable from "./Component.vue";

export default Vue.extend({
  components: { IAmHotReloadable },
  props: ["value"],
});
</script>

