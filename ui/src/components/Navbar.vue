<template>
  <nav v-show="authStore.user" class="navbar">
    <div class="navbar-nav">
      <RouterLink to="/" class="nav-item nav-link">See All</RouterLink>
      <ButtonExt @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</ButtonExt>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import ButtonExt from './ButtonExt.vue';

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  components: { ButtonExt }
}
</script>

<style>
.navbar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e272e;
  padding: 20px;
}
</style>