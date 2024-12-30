<template>
  <div class="wrapper">
    <div style="flex: 1; padding: 30px; padding-top: 80px">
        <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>Welcome to register Olympic Sport System</b></div>

      </div>
    <div style="width: 50%; margin: 100px auto; border-radius:10px; box-shadow: 0 0 10px -2px rgba(9,209,15,0.5);display: flex">
      <!--  display:flex ：flex布局          -->
      <div style="flex: 1">
        <img :src="imgUrl" alt=""style="width: 100%;height: 100%;">
      </div>

      <!--     register表单-->
      <div style="flex: 1;padding: 30px">

        <div style="margin:10px auto 25px; text-align: center; font-size: 28px;"><b>register</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input placeholder="please enter account" size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="please enter password" size="medium" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input placeholder="please confirm password" size="medium" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item style="margin: 5px 0; text-align: right">
          <el-button type="primary" size="small"  autocomplete="off" @click="register">register</el-button>
          <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/login')">Back to login</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>

  import imgUrl from "../assets/imgs/login.jpg";

export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: 'please enter用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'please enter password', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'please enter password', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      },
      imgUrl:imgUrl
}
  },
  methods: {
    register() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          if (this.user.password !== this.user.confirmPassword) {
            this.$message.error("两次输入的 password不一致")
            return false
          }
          this.request.post("/user/register", this.user).then(res => {
            if(res.code === '200') {
              this.$message.success("register成功")
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style>
  .wrapper {
    height: 100vh;
    background: linear-gradient(to bottom right, #e3c5eb, #a9c1ed);
    overflow: hidden;
  }
</style>
