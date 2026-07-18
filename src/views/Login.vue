<template>
  <div class="page">
    <h4>Đăng nhập</h4>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Tên đăng nhập</label>
        <input type="text" class="form-control" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Đăng nhập</button>
      <p v-if="message" class="mt-2 text-danger">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import authService from "@/services/auth.service";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const data = await authService.login({
          username: this.username,
          password: this.password,
        });
        authService.setTokenAndUser(data.token, data.user);
        this.$router.push({ name: "contactbook" });
      } catch (error) {
        this.message = error.response?.data?.message || "Đăng nhập thất bại";
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
