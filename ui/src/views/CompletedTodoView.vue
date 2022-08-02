<template>
  <div class="completed-todo">
    <p v-show="todoStore.isLoaded && !todoStore.getGroup($route.params.id)">
      You have no to-do group with id "{{ $route.params.id }}"
    </p>
    <Fragment v-show="todoStore.isLoaded && !todoStore.loading">
      <Heading>
        Completed To-do's
      </Heading>

      <router-link :to="'/todo/' + $route.params.id + '/active'">go to active todo's
        ({{ todoStore.getGroupActiveItemsCount($route.params.id) }})
      </router-link>

      <ToDoList :todos="todoStore.getGroupCompletedItems($route.params.id)" @delete:item="handleTodoItemDelete"
        @completeChange:item="handleCompleteStatusChange" :hideEdit="true" />
    </Fragment>

  </div>
</template>

<script>
import Heading from '../components/Heading.vue';
import ToDoList from '../components/ToDoList.vue';
import { useTodoGroupStore } from '../stores/todoGroups';
export default {
  components: { Heading, ToDoList },
  created: async function () {
    await this.todoStore.fetchGroupItems(this.$route.params.id);
  },
  setup() {
    const todoStore = useTodoGroupStore();
    return { todoStore }
  },
  methods: {
    handleCompleteStatusChange(todoItemId, isComplete) {
      this.todoStore.updateItemCompleteStatus(this.$route.params.id, todoItemId, isComplete);
    },
    handleTodoItemDelete(todoItemId) {
      this.todoStore.deleteGroupItem(this.$route.params.id, todoItemId);
    },
  }
};
</script>

<style>
</style>