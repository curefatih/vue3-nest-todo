<template>
  <div class="groups">
    <p v-show="!groups.length">
      No to-do group found
    </p>
    <ul class="group-list">
      <li v-for="group in groups" :key="group.id">
        <div class="name">
          {{ group.name.substring(0, 2) }}
        </div>
        <div class="actions">
          <a @click="$emit('delete:group', group.id)">Del</a>
          <a @click="$emit('edit:group', group.id)">Edit</a>
          <router-link :to="'/todo/' + group.id + '/active'">See</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ButtonExt from './ButtonExt.vue';
export default {
  name: "ToDoGroups",
  props: {
    groups: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  components: { ButtonExt }
}
</script>

<style lang="scss" scoped>
.group-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  li {
    width: 90px;
    height: 110px;
    padding: 10px;
    border: 1px solid #1e272e;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 5px 0;
    border-radius: .2em;
    position: relative;

    .name {
      font-size: 2em;
      font-weight: bold;
      text-transform: uppercase;
    }

    .actions {
      position: absolute;
      height: 100%;
      width: 100%;
      flex-direction: column;
      display: none;
      justify-content: center;
      align-items: center;
      background-color: #1e272e;

      a {
        cursor: pointer;
        padding: 3px;
      }
    }

    &:hover {
      .actions {
        display: flex;
      }
    }
  }
}
</style>