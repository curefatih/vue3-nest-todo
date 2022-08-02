<template>
  <input type="text" class="custom-input" :value="modelValue" @input="updateValue" />
</template>

<script>
export default {
  name: "InputExt",
  props: {
    modelValue: String,
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>

<style scoped>
.custom-input {
  width: 100%;
  padding: 15px;
  border-radius: 0.5em;
  border: 1px solid #ddd;
  background-color: #fff;
}
</style>