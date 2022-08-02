<template>
  <div class="login">
    <div class="row">
      <InputExt type="email" placeholder="email" v-model="email" />
    </div>
    <div class="row">
      <InputExt type="password" placeholder="password" v-model="password" />
    </div>
    <div v-show="authStore.error">
      {{ authStore.error }}
    </div>
    <div class="row">
      <ButtonExt @click="handleLogin">Login</ButtonExt>
      or&nbsp;
      <a @click="show = true">register</a>
    </div>
    <Modal v-model="show" @confirm="register" @cancel="cancel">
      <template v-slot:title>Register</template>
      <RegisterForm :onChange="handleRegisterFormChange" :error="registerFormData.error" />
    </Modal>
  </div>
</template>

<script>
import InputExt from "@/components/InputExt.vue";
import ButtonExt from "../components/ButtonExt.vue";
import Modal from "../components/Modal.vue";
import RegisterForm from "../components/RegisterForm.vue";
import API from "@/api";
import { useAuthStore } from '../stores/auth';


export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore }
  },
  components: {
    InputExt,
    ButtonExt,
    Modal,
    RegisterForm
  },
  data: () => ({
    email: "",
    password: "",
    show: false,
    registerFormData: {
      user: {
        name: "",
        email: "",
        password: ""
      },
      error: ""
    }
  }),
  methods: {
    async register() {
      this.registerFormData.error = "";
      try {
        await API.register(
          this.registerFormData.user
        )
        this.show = false

      } catch (error) {
        this.registerFormData.error = error.response.data.message || "Something went wrong"
      }
    },
    handleRegisterFormChange(registerData) {
      this.registerFormData.user = {
        ...this.registerFormData.user,
        ...registerData
      }
    },
    async handleLogin() {
      this.authStore.login(this.email, this.password)
        .catch(err => {
          console.log("::", err);
        })
    },
    cancel(close) {
      close()
    }
  },

};
</script>


<style lang="scss" scoped>
.login {
  .row {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px;
  }
}
</style>