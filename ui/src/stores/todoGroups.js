import { defineStore } from "pinia";
import API from "@/api";
import { errorMessage } from "../utils";

export const useTodoGroupStore = defineStore({
  id: "todoGroups",
  state: () => ({
    groups: [],
    isLoaded: false,
    loading: false,
    error: "",
  }),
  getters: {
    getGroups: (state) => state.groups,
    getGroup: (state) => (id) => {
      return state.groups.find((group) => group.id === id);
    },
    getGroupByName: (state) => (name) => {
      return state.groups.find((group) => group.name === name);
    },
    getGroupItem: (state) => (groupId, id) => {
      const group = state.groups.find((group) => group.id === groupId);
      if (group) {
        return group.todos.find((item) => item.id === id);
      }

      return null;
    },
    getGroupItemsByName: (state) => (groupName) => {
      const group =
        state.groups?.find((group) => group.name === groupName) || {};
      if (group && group.todos) {
        return group.todos;
      }

      return [];
    },
    getActiveGroupItemsByName: (state) => (groupName) => {
      const group =
        state.groups?.find((group) => group.name === groupName) || {};
      if (group && group.todos) {
        return group.todos.filter((item) => !item.completed);
      }

      return [];
    },
    getCompletedGroupItemsByName: (state) => (groupName) => {
      const group =
        state.groups?.find((group) => group.name === groupName) || {};
      if (group && group.todos) {
        return group.todos.filter((item) => item.completed);
      }

      return [];
    },
    getGroupItems: (state) => (id) => {
      const group = state.groups.find((group) => group.id === id);
      if (!group) return [];

      return group.todos || [];
    },
    getGroupActiveItems: (state) => (id) => {
      const group = state.groups?.find((group) => group.id === id) || {};
      if (!group) return [];

      return group.todos?.filter((todo) => !todo.completed) || [];
    },
    getGroupCompletedItems: (state) => (id) => {
      const group = state.groups.find((group) => group.id === id);
      if (!group) return [];

      return group.todos?.filter((todo) => todo.completed) || [];
    },
    getGroupCompletedItemsCount: (state) => (id) => {
      const group = state.groups.find((group) => group.id === id);
      if (!group) return 0;

      return group.todos?.filter((todo) => todo.completed).length || 0;
    },
    getGroupActiveItemsCount: (state) => (id) => {
      const group = state.groups.find((group) => group.id === id);
      if (!group) return 0;

      return group.todos?.filter((todo) => !todo.completed).length || 0;
    },
    getAllActiveItems: (state) => {
      return state.groups.reduce((acc, group) => {
        return acc.concat(group.todos?.filter((todo) => !todo.completed) || []);
      }, []);
    },
    getAllCompletedItems: (state) => {
      return state.groups.reduce((acc, group) => {
        return acc.concat(group.todos?.filter((todo) => todo.completed) || []);
      }, []);
    },
    getAllGroupNames: (state) => {
      return state.groups.map((group) => group.name);
    },
  },
  actions: {
    async fetchGroups() {
      if (this.isLoaded) return;

      this.isLoaded = false;
      const groups = await API.getTodoGroups();
      this.groups = groups;
      this.isLoaded = true;
    },
    async addGroup(name) {
      try {
        const group = await API.addTodoGroup(name);
        this.groups.push(group);

        return group;
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async fetchGroupItems(groupId) {
      if (!this.isLoaded && !this.loading) {
        await this.fetchGroups();
      }

      this.loading = true;
      const groupIndex = this.groups.findIndex((g) => g.id === groupId);
      if (groupIndex === -1) {
        this.loading = false;
        return;
      }

      if (this.groups[groupIndex].todos) {
        this.loading = false;
        return;
      }

      if (!groupId) {
        this.loading = false;
        return;
      }

      const items = await API.getTodoGroupItems(groupId);
      this.loading = false;

      this.groups[groupIndex].todos = items;
    },
    async fetchGroupItem(groupId, itemId) {
      if (!groupId || !itemId) {
        this.loading = false;
        return;
      }

      if (!this.isLoaded && !this.loading) {
        await this.fetchGroups();
      }

      this.loading = true;
      const groupIndex = this.groups.findIndex((g) => g.id === groupId);
      if (groupIndex === -1) {
        this.loading = false;
        return;
      }

      await API.getTodoGroupItem(groupId, itemId);
      this.loading = false;
    },
    async addGroupItem(groupId, item) {
      try {
        const result = await API.addTodoGroupItem(groupId, item);
        if (result.id) {
          const groupIndex = this.groups.findIndex((g) => g.id === groupId);
          if (groupIndex === -1) {
            return;
          }

          this.groups[groupIndex].todos.push(result);
        }
        return result;
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async updateGroupItem(groupId, item) {
      try {
        const result = await API.updateTodoGroupItem(groupId, item.id, item);
        if (result.id) {
          const groupIndex = this.groups.findIndex((g) => g.id === groupId);
          if (groupIndex === -1) {
            return;
          }

          const itemIndex = this.groups[groupIndex].todos.findIndex(
            (i) => i.id === item.id
          );
          if (itemIndex === -1) {
            return;
          }

          this.groups[groupIndex].todos[itemIndex] = result;
        }
        return result;
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async updateItemCompleteStatus(groupId, itemId, completed) {
      try {
        const result = await this.updateGroupItem(groupId, {
          id: itemId,
          completed,
        });
        if (result.id) {
          const groupIndex = this.groups.findIndex((g) => g.id === groupId);
          if (groupIndex === -1) {
            return;
          }

          const itemIndex = this.groups[groupIndex].todos.findIndex(
            (i) => i.id === itemId
          );
          if (itemIndex === -1) {
            return;
          }

          this.groups[groupIndex].todos[itemIndex] = result;
        }
        return result;
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async deleteGroupItem(groupId, itemId) {
      try {
        await API.deleteTodoGroupItem(groupId, itemId);
        const groupIndex = this.groups.findIndex((g) => g.id === groupId);
        if (groupIndex === -1) {
          return;
        }

        const itemIndex = this.groups[groupIndex].todos.findIndex(
          (i) => i.id === itemId
        );
        if (itemIndex === -1) {
          return;
        }

        this.groups[groupIndex].todos.splice(itemIndex, 1);
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async updateGroup(groupId, group) {
      try {
        const result = await API.updateTodoGroup(groupId, group);
        if (result.id) {
          const groupIndex = this.groups.findIndex((g) => g.id === groupId);
          if (groupIndex === -1) {
            return;
          }

          this.groups[groupIndex] = {
            ...this.groups[groupIndex],
            ...result,
          };
        }
        return result;
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    async deleteGroup(groupId) {
      try {
        await API.deleteTodoGroup(groupId);
        const groupIndex = this.groups.findIndex((g) => g.id === groupId);
        if (groupIndex === -1) {
          return;
        }

        this.groups.splice(groupIndex, 1);
      } catch (error) {
        console.dir(error);
        this.error = errorMessage(error.response.data.message);
      }
    },
    resetState() {
      this.error = null;
      this.loading = false;
      this.groups = [];
      this.isLoaded = false;
    },
    resetError() {
      this.error = null;
    },
  },
});
