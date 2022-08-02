<template>
  <main>
    <Heading>
      To-do groups
    </Heading>
    <br>
    <ToDoGroups :groups="todoStore.groups" @edit:group="handleGroupEditClick" @delete:group="handleGroupDeleteClick" />
    <ButtonExt @click="handleShowNewGroupModal">Add new</ButtonExt>

    <div class="filter">
      <strong>Filters</strong>
      <div class="filterCols">
        <div class="filterCol">
          <div class="filterName">Completed</div>
          <input type="checkbox" name="completed" :checked="showCompleted" @change="showCompleted = !showCompleted" />
        </div>
        <div class="filterCol">
          <div class="filterName">Group</div>
          <select name="group" v-model="filterActiveGroupId">
            <option value="">All</option>
            <option v-for="group in todoStore.getAllGroupNamesWithId" :value="group.id">{{ group.name }}</option>
          </select>
        </div>
        <div class="filterCol">
          <div class="filterName">Priority</div>
          <InputExt type="number" name="priority" :modelValue="filter.priority || ''" @change="handleFilterChange" />
        </div>
        <div class="filterCol">
          <div class="filterName">Due date after</div>
          <InputExt type="date" name="dueDate" :modelValue="filter.dueDate || ''" @change="handleFilterChange" />
        </div>
        <ButtonExt @click="filter = {}; filterActiveGroupId = ''; showCompleted = false">Reset filters</ButtonExt>
      </div>
    </div>

    <ToDoList :items="getFilteredGroupItems" :filter="createFilterFunction" :hideEdit="showCompleted"
      @edit:item="handleTodoItemEdit" @delete:item="handleTodoItemDelete"
      @completeChange:item="handleCompleteStatusChange" />
    <ButtonExt @click="handleShowNewTodoItemModal">Add new</ButtonExt>


    <Modal v-model="showGroupModal" @confirm="handleConfirm" @cancel="cancel">
      <template v-slot:title>
        <span v-if="isEdit">Edit group</span>
        <span v-else>New group</span>
      </template>
      <InputExt placeholder="name" v-model="group.name" />
      <p v-show="todoStore.error">
        {{ todoStore.error }}
      </p>
    </Modal>

    <Modal v-model="showTodoItemModal" @confirm="handleConfirmTodoItem" @cancel="cancel">
      <template v-slot:title>
        <span v-if="isEdit">Edit todo</span>
        <span v-else>New todo</span>
      </template>
      <div v-if="!isEdit" class="row">
        <select name="group" v-model="newItemForGroupId">
          <option v-for="group in todoStore.getAllGroupNamesWithId" :value="group.id">{{ group.name }}</option>
        </select>
      </div>
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
  </main>
</template>
<style lang="scss" scoped>
.row {
  margin: 3px 0;
}

.filter {
  margin: 10px 0;
  padding: 20px;
  border-top: 1px solid #1e272e;

  strong {
    font-weight: bold;
    font-size: 1.2em;
  }

  .filterCols {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .filterCol {
      display: flex;
      align-items: center;
      margin-right: 10px;

      .filterName {
        margin-right: 5px;
      }
    }
  }

}
</style>
<script>
import ToDoGroups from '../components/ToDoGroups.vue'
import Heading from '../components/Heading.vue';
import { useTodoGroupStore } from '../stores/todoGroups';
import ButtonExt from '../components/ButtonExt.vue';
import Modal from '../components/Modal.vue';
import InputExt from '../components/InputExt.vue';
import ToDoList from '../components/ToDoList.vue';

export default {
  components: { ToDoGroups, Heading, ButtonExt, Modal, InputExt, ToDoList },
  data() {
    return {
      showGroupModal: false,
      group: {
        id: "",
        name: "",
      },
      showTodoItemModal: false,
      minDate: new Date().toISOString().substring(0, 16),
      isEdit: false,
      todoItem: {
        id: "",
        text: "",
        priority: 0,
        dueDate: new Date().toISOString(),
      },
      filter: {},
      filterActiveGroupId: "",
      newItemForGroupId: "",
      showCompleted: false,
    }
  },
  computed: {
    createFilterFunction() {
      const filter = { ...this.filter };
      const filterKeys = Object.keys(filter);
      return function (todo) {
        return filterKeys.every(key => {
          if (key === 'dueDate') {
            return new Date(todo[key]) >= new Date(filter[key]);
          }

          return todo[key] === filter[key]
        })
      }
    },
    getFilteredGroupItems() {
      if (!this.filterActiveGroupId) {
        if (this.showCompleted) {
          return this.todoStore.getAllCompletedItems;
        } else {
          return this.todoStore.getAllActiveItems;
        }
      }

      if (this.showCompleted) {
        return this.todoStore.getCompletedGroupItemsById(this.filterActiveGroupId);
      } else {
        return this.todoStore.getActiveGroupItemsById(this.filterActiveGroupId);
      }
    },
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
  created: async function () {
    await this.todoStore.fetchGroups()
  },
  setup() {
    const todoStore = useTodoGroupStore();
    return { todoStore }
  },
  methods: {
    handleFilterChange(e) {
      const type = e.target.type;
      const value = e.target.value;
      const checked = e.target.checked;
      const name = e.target.name;

      if (!value) {
        delete this.filter[name];
        return;
      }

      if (type === "checkbox") {
        this.filter[name] = checked;
      } else if (type === "number") {
        this.filter[name] = Number(value);
      } else {
        this.filter[name] = value;
      }
    },
    handleShowNewGroupModal() {
      this.clearState();
      this.todoStore.resetError();
      this.showGroupModal = true
      this.isEdit = false;
    },
    clearState() {
      this.group = {
        id: "",
        name: "",
      }
      this.todoItem = {
        id: "",
        text: "",
        priority: 0,
        dueDate: new Date().toISOString(),
      };
      this.showGroupModal = false;
      this.showTodoItemModal = false;
    },
    async addNewTodoGroup() {
      const result = await this.todoStore.addGroup(this.group.name);
      if (result) {
        this.clearState();
      }
    },
    handleGroupEditClick(groupId) {
      this.todoStore.resetError();
      this.showGroupModal = true;
      const { id, name } = this.todoStore.getGroup(groupId)
      this.group = {
        id,
        name,
      }
      this.isEdit = true;
    },
    handleGroupDeleteClick(groupId) {
      this.todoStore.deleteGroup(groupId)
    },
    async handleUpdateGroup() {
      const result = await this.todoStore.updateGroup(this.group.id, this.group)
      if (result) {
        this.clearState();
      }
    },
    handleConfirm() {
      if (this.isEdit) {
        this.handleUpdateGroup();
      } else {
        this.addNewTodoGroup()
      }
    },
    cancel(close) {
      close()
    },
    handleShowNewTodoItemModal() {
      this.todoStore.resetError();
      this.showTodoItemModal = true;
      this.isEdit = false;
      console.log("handleShowNewTodoItemModal")
    },
    async handleAddNewTodoItem() {
      if (!this.newItemForGroupId) {
        this.todoStore.setError("Please select a group")
        return
      }

      const result = await this.todoStore.addGroupItem(this.newItemForGroupId, this.todoItem);
      if (result) {
        this.clearState();
      }
    },
    handleTodoItemEdit(todoItemId, groupId) {
      this.todoItem = { ...this.todoStore.getGroupItem(groupId, todoItemId) };
      this.isEdit = true;
      this.showTodoItemModal = true;
    },
    handleTodoItemDelete(todoItemId, groupId) {
      if (!groupId || !todoItemId) {
        return
      }

      this.todoStore.deleteGroupItem(groupId, todoItemId);
    },
    handleCompleteStatusChange(todoItemId, groupId, isComplete) {
      this.todoStore.updateItemCompleteStatus(groupId, todoItemId, isComplete);
    },
    handleTodoItemEditConfirm() {
      this.todoStore.updateGroupItem(this.todoItem.groupId, this.todoItem);
      this.clearState();
      this.showTodoItemModal = false;
    },
    handleConfirmTodoItem() {
      if (this.isEdit) {
        this.handleTodoItemEditConfirm();
      } else {
        this.handleAddNewTodoItem();
      }
    }
  }
}
</script>