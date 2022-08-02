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
          <InputExt type="checkbox" name="completed" @change="showCompleted = !showCompleted" />
        </div>
        <div class="filterCol">
          <div class="filterName">Group</div>
          <select name="group" v-model="filterActiveGroupName">
            <option value="">All</option>
            <option v-for="group in todoStore.getAllGroupNames" :value="group">{{ group }}</option>
          </select>
        </div>
        <div class="filterCol">
          <div class="filterName">Priority</div>
          <InputExt type="number" name="priority" :modelValue="filter.priority || ''" @change="handleFilterChange" />
        </div>
        <div class="filterCol">
          <div class="filterName">Due date</div>
          <InputExt type="date" name="dueDate" :modelValue="filter.dueDate || ''" @change="handleFilterChange" />
        </div>
        <ButtonExt @click="filter = {}; filterActiveGroupName = ''">Reset filters</ButtonExt>
      </div>
    </div>
    <ToDoList :todos="getFilteredGroupItems" :filter="createFilterFunction" />
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
  </main>
</template>
<style lang="scss" scoped>
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
      isEdit: false,
      filter: {},
      filterActiveGroupName: "",
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
      if (!this.filterActiveGroupName) {
        if (this.showCompleted) {
          return this.todoStore.getAllCompletedItems;
        } else {
          return this.todoStore.getAllActiveItems;
        }
      }

      if (this.showCompleted) {
        return this.todoStore.getCompletedGroupItemsByName(this.filterActiveGroupName);
      } else {
        return this.todoStore.getActiveGroupItemsByName(this.filterActiveGroupName);
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
      this.showGroupModal = false;
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
    }
  }
}
</script>