<template>
  <div>
    <!-- 头部 -->
    <div style="display: flex; height: 60px; line-height: 60px; border-bottom: 1px solid #eee">
      <div style="width: 300px; display: flex; padding-left: 30px">
        <div style="width: 60px">
          <img src="../../assets/imgs/login.jpg" alt="" style="width: 50px; position: relative; top: 5px; right: 0">
        </div>
        <div style="font-size: 24px; color: #0099ff; font-style: italic">Olympic information</div>
      </div>
      <div style="flex: 1">
        <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/front/home" style="font-size: 21px">Home</el-menu-item>
          <el-menu-item index="/front/collection" style="font-size: 21px">my favorite</el-menu-item>
        </el-menu>
      </div>
      <div style="width: 200px">
        <div v-if="!user.username" style="text-align: right; padding-right: 30px">
          <el-button @click="$router.push('/login')">Login</el-button>
          <el-button @click="$router.push('/register')">register</el-button>
        </div>
        <div v-else>
          <el-dropdown style="width: 150px; cursor: pointer; text-align: right">
            <div style="display: inline-block">
              <img :src="user.avatarUrl" alt=""
                   style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
              <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link to="/front/password">modify password</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link to="/front/person">personal information</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link v-if="isAdmin" to="/articles">Background management page</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <span style="text-decoration: none" @click="logout">log out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div style="width: 1100px; margin: 0 auto">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "Front",
  data() {
    return {
      // 从 localStorage 获取用户信息
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    };
  },
  computed: {
    // 判断是否是管理员
    isAdmin() {
      return this.user.role === 'ROLE_ADMIN';
    }
  },
  methods: {
    logout() {
      // 清除用户信息并退出
      this.$store.commit("logout");
      this.$message.success("退出成功");
    },

    // 检查用户是否已登录
    checkLogin() {
      if (!this.user.username) {
        this.$message.warning("Please log in to perform this action.");
        this.$router.push('/login'); // 引导用户登录
        return false;
      }
      return true;
    },

    // 点赞按钮
    handleLike(articleId) {
      if (!this.checkLogin()) {
        return;
      }
      // 执行点赞操作
      this.$message.success("You liked the article.");
      // 这里可以调用 API 实现点赞
    },

    // 评论按钮
    handleComment(articleId) {
      if (!this.checkLogin()) {
        return;
      }
      // 执行评论操作
      this.$message.success("You can now comment on the article.");
      // 这里可以打开评论框，或者进行评论相关的操作
    }
  }
};
</script>

<style>
.item {
  display: inline-block;
  width: 100px;
  text-align: center;
  cursor: pointer;
}
.item a {
  color: #1E90FF;
}
.item:hover {
  background-color: LightPink;
}
</style>
