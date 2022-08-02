<template>
  <ul class="todo-list">
    <p v-show="!items.length">
      No todo found!
    </p>
    <li v-for="todo in filteredItems" :key="todo.id">
      <ToDo :id="todo.id" :text="todo.text" :dueDate="todo.dueDate" :priority="todo.priority"
        :completed="todo.completed" @edit="$emit('edit:item', todo.id, todo.groupId)"
        @delete="$emit('delete:item', todo.id, todo.groupId)"
        @complete="(id, completed) => handleCompleteChange(id, todo.groupId, completed)" :hideEdit="hideEdit" />
    </li>
  </ul>
</template>

<script>
import ToDo from './ToDo.vue'
export default {
  props: {
    groupId: String,
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    hideEdit: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Function,
      default: function () {
        return true;
      }
    }
  },
  components: { ToDo },
  computed: {
    filteredItems() {
      return this.items.filter(this.filter);
    }
  },
  methods: {
    handleCompleteChange(id, groupId, completed) {
      this.$emit('completeChange:item', id, groupId, completed,);
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