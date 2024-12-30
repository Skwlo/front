<template>
  <div>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <div style="display: flex">
            <div style="color: dodgerblue; font-size: 20px; flex: 1">category</div>
            <div style="flex: 1; text-align: right">共 <span style="font-size: 20px; color: orange">{{ total }}</span> 条</div>
          </div>
          <!-- 分割线 -->
          <div style="height: 1px; margin: 10px 0; background-color: #ccc"></div>

          <!-- category 下拉~ -->
          <el-row :gutter="2">
            <el-col :span="3" v-for="item in category" :class="{ categoryActive: item.name === index }" style="margin-bottom: 5px">
              <div class="category">
                <el-button @click="select(item.name)" size="15px">{{ item.name }}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card style="min-height: 800px; margin-top: 20px; position: relative">
          <div style="padding: 20px; border-bottom: 1px solid #ccc" v-for="item in articles">
            <el-row>
              <el-col :span="18">
                <div style="font-size: 20px"><b style="cursor: pointer" @click="$router.push('/front/articlesDetail?id=' + item.id)">{{ item.title }}</b></div>
                <div style="padding: 20px 0; color: #888; margin-top: 20px"></div>
                <div style="color: #888; margin-top: 20px">
                  <div>
                    <span><i class="el-icon-user"></i> {{ item.username }}</span>
                    <span style="margin-left: 20px"><i class="el-icon-date"></i> {{ item.time }}</span>
                    <span style="margin-left: 20px"><i class="el-icon-reading"></i> {{ item.readCount }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div style="padding: 10px" @click="$router.push('/front/articlesDetail?id=' + item.id)">
                  <el-image :src="item.cover" style="width: 100px; height: 100px"></el-image>
                </div>
              </el-col>
            </el-row>
          </div>

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
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Caipu",
  data() {
    return {
      category: [],
      articles: [],
      index: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 获取登入人的username
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.request.get("/category").then(res => {
        this.category = res.data;
        if (!this.index) {
          this.index = res.data[0].name;
        }
        this.request
            .get("/articles/page?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize + "&category=" + this.index)
            .then(res => {
              this.articles = res.data.records;
              this.total = res.data.total;
            });
      });
    },

    select(category) {
      this.index = category;
      this.load();
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },

    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },

    // 处理评论功能
    handleComment(itemId) {
      if (!this.username || !this.username.username) {
        this.$message.warning("请先登录再进行评论");
        return;
      }
      // 调用评论相关的逻辑
    },

    // 处理点赞功能
    handlePraise(itemId) {
      if (!this.username || !this.username.username) {
        this.$message.warning("Please log in first and then click Like");
        return;
      }
      // 调用点赞相关的逻辑
    },
  },
};
</script>

<style scoped>
.categoryActive {
  background-color: #f0f0f0;
}
</style>
