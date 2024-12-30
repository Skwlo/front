<template>
  <div>
    <!-- 只有登录用户才能看到轮播图 -->
    <el-carousel v-if="isLoggedIn" :interval="4000" type="card" height="360px" style="margin-top: 10px">
      <el-carousel-item v-for="(lun, index) in lun" :key="index">
        <a :href="lun.link">
          <el-image style="height: auto" :src="lun.img" fit="fill"></el-image>
        </a>
      </el-carousel-item>
    </el-carousel>

    <!-- content部分 -->
    <el-container>
      <el-header height="40px">
        <h2 style="background-color:#0099ff; margin: auto; text-align: center; font-size: 30px; color:white">
          countries informations
        </h2>
      </el-header>

      <el-container>
        <el-main>
          <!-- 显示国家总数 -->
          <div style="margin-bottom: 20px; font-size: 18px;">
            Total Countries: {{ total }}
          </div>

          <!-- 美食卡片展示 -->
          <el-row :gutter="10">
            <el-col :span="6" v-for="(articles, index) in articles" :key="index" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '2px'}">
                <div style="background-color: white; padding: 10px; cursor: pointer" @click="$router.push('/front/articlesDetail?id=' + articles.id)">
                  <img :src="articles.cover" alt="" style="width: 100%; height: 200px; overflow: hidden; border-radius: 10px">
                  <div style="padding: 14px;">
                    <span class="title">{{ articles.title }}</span>
                    <div style="font-size: 10px; margin-top: 10px">{{ articles.username }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 用户输入每页显示的数量 -->
          <div style="margin-top: 20px; text-align: center;">
            <el-input-number v-model="pageSize" :min="1" :max="100" label="Items per page" @change="handleSizeChange"></el-input-number>
          </div>

          <!-- 分页控制 -->
          <div style="text-align: center; margin-top: 20px;">
            <el-pagination
                background
                :current-page="pageNum"
                :page-size="pageSize"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="prev, pager, next, sizes, jumper"
                :page-sizes="[8, 16, 24, 32]"
            ></el-pagination>
          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  data() {
    return {
      lun: [],
      articles: [],
      pageNum: 1, // 当前页码
      pageSize: 8, // 默认每页显示8条
      total: 0, // 国家总数
      tableDataRead: [],
      tableDataGood: [],
      tableDataDate: [],
    };
  },

  computed: {
    // 判断用户是否已登录
    isLoggedIn() {
      return !!localStorage.getItem("user");  // 如果存在用户信息，表示已登录
    }
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      // 获取轮播图数据
      this.request.get("/lun").then((res) => {
        this.lun = res.data;
      });

      // 获取分页数据
      this.request.get("/articles/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        this.articles = res.data.records;
        this.total = res.data.total; // 获取国家总数
      });

      // 其他分页数据加载逻辑
      this.request.get("/articles/read", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        console.log(res);
        this.tableDataRead = res.data.records;
      });
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize; // 更新每页显示的条数
      this.pageNum = 1; // 每次修改每页条数时reset为第一页
      this.load(); // 重新加载数据
    },

    handleCurrentChange(pageNum) {
      this.pageNum = pageNum; // 更新当前页码
      this.load(); // 重新加载数据
    },

    // 打开评论模态框或组件
    openCommentModal() {
      if (!this.isLoggedIn) {
        this.$message.error("请先登录再进行评论！");
        return;
      }
      // 在这里打开评论弹框或执行评论相关逻辑
      this.$message.success("评论功能可以在此处实现");
    }
  },
};
</script>

<style scoped>
.el-card__body img {
  width: 100%;
}

.title:hover {
  color: #436EEE !important;
}
</style>
