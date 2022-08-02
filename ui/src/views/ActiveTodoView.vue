<template>
  <div class="active-todo">
    <p v-show="todoStore.isLoaded && !todoStore.getGroup($route.params.id)">
      You have no to-do group with id "{{ $route.params.id }}"
    </p>
    <Fragment v-show="todoStore.isLoaded && !todoStore.loading">
      <Heading>
        Active To-do's
      </Heading>

      <router-link :to="'/todo/' + $route.params.id + '/completed'">go to completed todo's</router-link>

      <ToDoList :todos="todoStore.getGroupActiveItems($route.params.id)" @edit:item="handleTodoItemEdit"
        @delete:item="handleTodoItemDelete" @completeChange:item="handleCompleteStatusChange" />
      <ButtonExt @click="handleShowNewTodoItemModal">Add new</ButtonExt>
    </Fragment>

    <Modal v-model="showTodoItemModal" @confirm="handleConfirm" @cancel="cancel">
      <template v-slot:title>
        <span v-if="isEdit">Edit todo</span>
        <span v-else>New todo</span>
      </template>
      <div class="row">
        <InputExt placeholder="text" v-model="todoItem.text" />
      </div>
      <div class="row">
        <InputExt placeholder="due date" v-model="itemDueDateDisplayValue" type="datetime-local" :min='minDate' />
      </div>
      <div class="row">
        <InputExt placeholder="priority" v-model="priorityDisplayValue" type="number" />
      </div>
      <p v-show="todoStore.error">
        {{ todoStore.error }}
      </p>
    </Modal>

  </div>
</template>

<script>
import Heading from '../components/Heading.vue';
import ToDoList from '../components/ToDoList.vue';
import { useTodoGroupStore } from '../stores/todoGroups';
import ButtonExt from '../components/ButtonExt.vue';
import Modal from '../components/Modal.vue';
import InputExt from '../components/InputExt.vue';
export default {
  components: { Heading, ToDoList, ButtonExt, Modal, InputExt },
  created: async function () {
    await this.todoStore.fetchGroupItems(this.$route.params.id);
  },
  data() {
    return {
      showTodoItemModal: false,
      minDate: new Date().toISOString().substring(0, 16),
      isEdit: false,
      todoItem: {
        id: "",
        text: "",
        priority: 0,
        dueDate: new Date().toISOString(),
      },
    }
  },
  computed: {
    itemDueDateDisplayValue: {
      get() {
        return this.todoItem.dueDate.substring(0, 16);
      },
      set(value) {
        this.todoItem.dueDate = value;
      }
    },
    priorityDisplayValue: {
      get() {
        return this.todoItem.priority;
      },
      set(value) {
        this.todoItem.priority = Number(value);
      }
    },
  },
  methods: {
    handleShowNewTodoItemModal() {
      this.showTodoItemModal = true;
      this.clearState();
      this.isEdit = false;
    },
    async handleAddNewTodoItem() {
      const result = await this.todoStore.addGroupItem(this.$route.params.id, this.todoItem);
      if (result) {
        this.newTodo = {
          name: "",
          description: "",
          priority: 0,
        };
        this.showTodoItemModal = false;
      }
    },
    clearState() {
      this.todoItem = {
        id: "",
        text: "",
        priority: 0,
        dueDate: new Date().toISOString(),
      };
    },
    cancel(close) {
      this.clearState();
      close()
    },
    handleTodoItemEdit(todoItemId) {
      this.todoItem = { ...this.todoStore.getGroupItem(this.$route.params.id, todoItemId) };
      this.isEdit = true;
      this.showTodoItemModal = true;
    },
    handleTodoItemDelete(todoItemId) {
      this.todoStore.deleteGroupItem(this.$route.params.id, todoItemId);
    },
    handleCompleteStatusChange(todoItemId, isComplete) {
      this.todoStore.updateItemCompleteStatus(this.$route.params.id, todoItemId, isComplete);
    },
    handleTodoItemEditConfirm() {
      console.log("handleTodoItemEditConfirm");
      this.todoStore.updateGroupItem(this.$route.params.id, this.todoItem);
      this.clearState();
      this.showTodoItemModal = false;
    },
    handleConfirm() {
      if (this.isEdit) {
        this.handleTodoItemEditConfirm();
      } else {
        this.handleAddNewTodoItem();
      }
    },
  },
  setup() {
    const todoStore = useTodoGroupStore();
    return { todoStore }
  },
};
</script>

<style lang="scss" scoped>
.active-todo {
  .row {
    margin: 3px 0;
  }
}
</style>