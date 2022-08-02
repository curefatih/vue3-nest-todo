<template>
  <div class="register">
    <div class="row">
      <InputExt type="email" placeholder="email" name="email" @change="handleChange" />
    </div>
    <div class="row">
      <InputExt type="text" placeholder="name" name="name" @change="handleChange" />
    </div>
    <div class="row">
      <InputExt type="password" placeholder="password" name="password" @change="handleChange" />
    </div>

    <div v-show="$props.error" class="row">
      Error: {{ $props.error }}
    </div>
  </div>
</template>

<script>
import InputExt from './InputExt.vue';
export default {
  components: { InputExt },
  props: {
    onChange: {
      type: Function,
      default: function () {
        return function () { }
      }
    },
    error: String
  },
  methods: {
    handleChange: function (e) {
      const name = e.target.name;
      const value = e.target.value
      this.onChange({
        [name]: value
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.register {
  .row {
    margin: 3px;
  }
}
</style>