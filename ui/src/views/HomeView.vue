<template>
  <main>
    <Heading>
      To-do groups
    </Heading>
    <br>
    <ToDoGroups :groups="todoStore.groups" @edit:group="handleGroupEditClick" @delete:group="handleGroupDeleteClick" />
    <ButtonExt @click="handleShowNewGroupModal">Add new</ButtonExt>
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

<script>
import ToDoGroups from '../components/ToDoGroups.vue'
import Heading from '../components/Heading.vue';
import { useTodoGroupStore } from '../stores/todoGroups';
import ButtonExt from '../components/ButtonExt.vue';
import Modal from '../components/Modal.vue';
import InputExt from '../components/InputExt.vue';

export default {
  components: { ToDoGroups, Heading, ButtonExt, Modal, InputExt },
  data() {
    return {
      showGroupModal: false,
      group: {
        id: "",
        name: "",
      },
      isEdit: false,
    }
  },
  created: async function () {
    await this.todoStore.fetchGroups()
  },
  setup() {
    const todoStore = useTodoGroupStore();
    return { todoStore }
  },
  methods: {
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