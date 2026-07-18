<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</a>
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'contactbook' }" class="nav-link">
          Danh bạ <i class="fas fa-address-book"></i>
        </router-link>
      </li>
    </div>
    <div class="navbar-nav ml-auto">
      <li v-if="user" class="nav-item">
        <span class="navbar-text text-white mr-2">{{ user.username }}</span>
      </li>
      <li v-if="!user" class="nav-item">
        <router-link :to="{ name: 'login' }" class="nav-link"
          >Đăng nhập</router-link
        >
      </li>
      <li v-if="!user" class="nav-item">
        <router-link :to="{ name: 'register' }" class="nav-link"
          >Đăng ký</router-link
        >
      </li>
      <li v-if="user" class="nav-item">
        <a href="#" class="nav-link" @click.prevent="logout">Đăng xuất</a>
      </li>
    </div>
  </nav>
</template>

<script>
import authService from "@/services/auth.service";

export default {
  data() {
    return {
      user: authService.getUser(),
    };
  },
  methods: {
    logout() {
      authService.logout();
      this.user = null;
      this.$router.push({ name: "login" });
    },
  },
  watch: {
    $route() {
      this.user = authService.getUser();
    },
  },
};
</script>
