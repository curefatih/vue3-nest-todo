<template>
  <ul class="todo-list">
    <p v-show="!todos.length">
      No todo found!
    </p>
    <li v-for="todo in todos" :key="todo.id">
      <ToDo :id="todo.id" :text="todo.text" :dueDate="todo.dueDate" :priority="todo.priority"
        :completed="todo.completed" @edit="$emit('edit:item', todo.id)" @delete="$emit('delete:item', todo.id)"
        @complete="handleCompleteChange" :hideEdit="hideEdit" />
    </li>
  </ul>
</template>

<script>
import ToDo from './ToDo.vue'
export default {
  props: {
    todos: {
      type: Array,
      default: function () {
        return [];
      }
    },
    hideEdit: {
      type: Boolean,
      default: false
    }
  },
  components: { ToDo },
  methods: {
    handleCompleteChange(id, completed) {
      this.$emit('completeChange:item', id, completed);
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin: 5px 0;
  }
}
</style>