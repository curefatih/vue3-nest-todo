<template>
  <div class="todo">
    <div class="content">
      <div class="text">
        {{ $props.text }}
      </div>
      <div class="meta">
        due to {{ $props.dueDate }} ::
        priority {{ $props.priority }}
      </div>
    </div>
    <div class="actions">
      <InputExt type="checkbox" :checked="$props.completed" @change="handleCompleteChange" />
      <ButtonExt v-show="!hideEdit" @click="$emit('edit', id)">edit</ButtonExt>
      <ButtonExt @click="$emit('delete', id)">del</ButtonExt>
    </div>
  </div>
</template>

<script>
import InputExt from './InputExt.vue';
import ButtonExt from './ButtonExt.vue';
export default {
  name: "ToDo",
  props: {
    id: String,
    text: String,
    completed: Boolean,
    dueDate: String,
    priority: Number,
    hideEdit: Boolean,
  },
  components: { InputExt, ButtonExt },
  methods: {
    handleCompleteChange(event) {
      this.$emit('complete', this.id, event.target.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
.todo {
  display: flex;
  gap: 5px;

  &:hover {
    .actions {
      display: flex;
    }
  }

  .content {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: .5em;
    background-color: #1e272e;
    color: #ddd;
    padding: 10px 20px;

    .meta {
      font-style: italic;
      font-size: .8em;
      border-top: 1px solid #292929;
      color: #7f8c8d;
    }
  }

  .actions {
    display: none;
    justify-content: center;
    align-items: center;
    gap: 5px;

    input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

}
</style>