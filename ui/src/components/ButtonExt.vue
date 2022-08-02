<template>
  <button class="button-extended" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  name: "ButtonExt"
}
</script>

<style scoped>
.button-extended {
  padding: 15px 20px;
  margin: 3px 0;
  border-radius: 0.5em;
  border: 1px solid #1e272e;
  background-color: #1e272e;
  color: #fff;
  cursor: pointer;
  transition: .2s ease all;
  outline: none;
}

.button-extended:hover {
  background-color: #485460;
}
</style>