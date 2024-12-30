<template>
  <div class="wrapper">
    <div style="flex: 1; padding: 30px; padding-top: 80px">
        <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>Welocme to login Olympic Sport</b></div>

      </div>
    <div style="width: 50%; margin: 100px auto; border-radius:10px; box-shadow: 0 0 10px -2px rgba(9,209,15,0.5);display: flex">
      <!--  display:flex ：flex布局          -->
      <div style="flex: 1">
        <img :src="imgUrl" alt=""style="width: 100%;height: 100%;">

      </div>

<!--      Login表单-->
      <div style="flex: 1;padding: 30px">

      <div style="margin:20px auto 25px; text-align: center; font-size: 28px;"><b> Login </b></div>

        <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username" style="margin-top: 25px">
          <el-input  placeholder="please enter account" size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 15px">
          <el-input placeholder="please enter password" size="medium" prefix-icon="el-icon-lock" show-password
                    v-model="user.password"></el-input>
        </el-form-item>


        <el-form-item style="margin: 30px 0; text-align: right">
          <el-button type="warning" size="medium" autocomplete="off" @click="$router.push('/register')" >back to register</el-button>
          <el-button type="primary" size="medium" autocomplete="off" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>



  </div>
</template>

<script>
import {setRoutes} from "@/router";
import imgUrl from "../assets/imgs/login.jpg";


export default {
  name: "Login",

  data() {
    return {
      user: {},
      //表单校验
      rules: {
        username: [
          {required: true, message: 'please enter用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'please enter password', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
      },
      imgUrl:imgUrl
    }
  },
  methods: {
    login() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {  // 表单校验合法
            this.request.post("/user/login", this.user).then(res => {
              if (res.code === '200') {
                localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
                localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
                // 动态设置当前用户的路由
                setRoutes()
                this.$message.success("Login success")

                if (res.data.role === 'ROLE_USER') {  //是用户的话，push到前台
                  this.$router.push("/front/home")
                } else {
                  this.$router.push("/articles")
                }
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

<style scoped>


.wrapper {
  height: 100vh;
  background: linear-gradient(to bottom right, #e3c5eb, #a9c1ed);
  overflow: hidden;
}
</style>
