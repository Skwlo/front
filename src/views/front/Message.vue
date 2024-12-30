<template>
  <div>
    <!-- 文章分类 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <div style="display: flex">
            <div style="color: dodgerblue; font-size: 20px; flex: 1">category</div>
            <div style="flex: 1; text-align: right">共 <span style="font-size: 20px; color: orange">{{ total }}</span> 条</div>
          </div>
          <div style="height: 1px; margin: 10px 0; background-color: #ccc"></div>
          <div style="display: flex; flex-direction: row">
            <div class="category" @click="select(item.name)" v-for="item in categorys" :class="{ categoryActive: item.name === index }">{{ item.name }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 博客列表 -->
    <el-card style="min-height: 800px; margin-top: 20px; position: relative">
      <div style="padding: 20px; border-bottom: 1px solid #ccc" v-for="item in blogs">
        <el-row>
          <el-col :span="18">
            <div style="font-size: 20px"><b style="cursor: pointer" @click="jump(item)">{{ item.title }}</b></div>
            <div style="padding: 20px 0; color: #888; margin-top: 20px">{{ item.description }}</div>
            <div style="color: #888; margin-top: 20px">
              <div>
                <span><i class="el-icon-user"></i> {{ item.username }}</span>
                <span style="margin-left: 20px"><i class="el-icon-date"></i> {{ item.time }}</span>
                <span style="margin-left: 20px"><i class="el-icon-reading"></i> {{ item.readCount }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="padding: 10px">
              <el-image :src="item.cover" style="width: 100px; height: 100px"></el-image>
            </div>
          </el-col>
        </el-row>
        <!-- 需要操作时显示的按钮（例如评论、点赞等） -->
        <el-button @click="handleLike(item)" size="small" type="primary">Like</el-button>
        <el-button @click="handleComment(item)" size="small" type="success">Comment</el-button>
      </div>

      <!-- 分页 -->
      <div style="height: 50px; line-height: 50px; text-align: center; margin-top: 10px;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            small
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {
      total: 0,
      pageNum: 1,  // 当前页码
      pageSize: 10, // 每页显示的条数
      blogs: [], // 博客列表数据
      categorys: [] // 分类数据
    };
  },
  methods: {
    // 检查用户是否已登录
    checkLogin() {
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      if (!user || !user.username) {
        this.$message.warning("Please log in to perform this action.");
        this.$router.push('/login'); // 引导用户登录
        return false;
      }
      return true;
    },

    // 点赞功能
    handleLike(item) {
      if (!this.checkLogin()) {
        return; // 如果未登录则不执行
      }
      this.$message.success("You liked the article.");
      // 这里可以调用点赞相关的 API
    },

    // 评论功能
    handleComment(item) {
      if (!this.checkLogin()) {
        return; // 如果未登录则不执行
      }
      this.$message.success("You can now comment on the article.");
      // 这里可以打开评论框，或跳转到评论页面等操作
    },

    // 选择分类
    select(category) {
      console.log("Selected category:", category);
      // 根据选择的分类更新展示内容
    },

    // 跳转到文章详情页
    jump(item) {
      console.log("Jump to article:", item);
      // 跳转到文章详情页
      this.$router.push({ path: `/article/${item.id}` });
    },

    // 分页处理
    handleSizeChange(size) {
      this.pageSize = size;
      this.loadBlogs();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.loadBlogs();
    },

    // 加载博客数据（模拟API调用）
    loadBlogs() {
      // 假设请求数据
      this.blogs = []; // 更新博客数据
      this.total = 100; // 假设总条数
    }
  },

  mounted() {
    // 初始化加载博客数据
    this.loadBlogs();
  }
};
</script>

<style scoped>
/* 自定义样式 */
.category {
  cursor: pointer;
  padding: 10px;
  margin-right: 10px;
}
.categoryActive {
  background-color: #f0f0f0;
}
</style>
