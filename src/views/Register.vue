<template>
  <div class="page">
    <h4>Đăng ký</h4>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Tên đăng nhập</label>
        <input type="text" class="form-control" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" class="form-control" v-model="email" required />
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
      <button type="submit" class="btn btn-primary">Đăng ký</button>
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
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async handleRegister() {
      try {
        const data = await authService.register({
          username: this.username,
          email: this.email,
          password: this.password,
        });
        authService.setTokenAndUser(data.token, data.user);
        this.$router.push({ name: "contactbook" });
      } catch (error) {
        this.message = error.response?.data?.message || "Đăng ký thất bại";
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
