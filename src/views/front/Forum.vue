<template>
  <div>
    <!-- 回到顶部按钮 -->
    <vueToTop type="4" size="50" right="45" bottom="45" color="#912CEE"></vueToTop>

    <div style="display: flex">
      <!-- 左侧内容区域 -->
      <div style="background-color: white; border-radius: 10px; width: 754px" class="container-height">
        <!-- 搜索框 -->
        <div style="margin: 10px 0">
          <el-input size="small" style="width: 300px" placeholder="Please enter article title"
                    suffix-icon="el-icon-search" v-model="title"></el-input>
          <el-button class="ml-5" type="primary" @click="load" size="small">Search</el-button>
          <el-button type="warning" @click="reset" size="small">Reset</el-button>
        </div>

        <!-- 文章列表 -->
        <div style="display: flex; padding: 10px" v-for="item in articleData" :key="item.id">
          <el-card style="width: 100%">
            <div>
              <!-- 顶部用户信息 -->
              <div style="display: flex">
                <div style="width: 80px">
                  <img style="width: 50px; height: 50px; border-radius: 50%" :src="item.userAvatar" alt="">
                </div>
                <div style="flex: 1; line-height: 25px">
                  <div style="font-weight: bold">{{ item.username }}</div>
                  <div style="font-size: 12px; color: #999">{{ item.time }}</div>
                </div>
                <div style="width: 60px">
                  <el-button>Follow</el-button>
                </div>
              </div>

              <!-- 文章内容 -->
              <div style="margin: 10px 0; font-size: 14px; line-height: 25px; text-align: justify"
                   class="content" @click="$router.push('/front/articlesDetail?id=' + item.id)">
                {{ item.title }}
              </div>

              <!-- 图片部分 -->
              <div style="margin: 10px 0;" @click="$router.push('/front/articlesDetail?id=' + item.id)">
                <el-row :gutter="10">
                  <el-col :span="10" style="margin: 10px 0">
                    <img style="width: 65%" :src="item.cover" alt="">
                  </el-col>
                </el-row>
              </div>

              <!-- 底部操作 -->
              <div style="margin: 10px 0; display: flex; line-height: 25px">
                <div style="width: 50%">
                  <el-tag type="primary">#{{ item.category }}</el-tag>
                  <el-tag type="primary" style="margin-left: 10px">#Topic</el-tag>
                </div>
                <div style="width: 50%; color: #999; font-size: 13px; text-align: right">
                  <i><img style="width: 20px" :src="icon[2]" alt=""></i> {{ item.readCount }}
                  <i style="margin-left: 10px"><img style="width: 20px" :src="icon[0]" alt=""></i>{{ item.goodCount }}
                  <i style="margin-left: 10px" @click="handleLike(item)"><img style="width: 20px" :src="icon[1]" alt=""></i>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <div style="padding: 10px 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pageNum" :page-sizes="[2, 5, 10, 20]" :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div style="background-color: white; border-radius: 10px; width: 300px; margin-top: 62px"
           class="container-height">
        <!-- 发帖按钮 -->
        <el-card>
          <el-button type="primary" round style="width: 100%" @click="handleAdd">Publish Article</el-button>
        </el-card>

        <!-- 点赞排行榜 -->
        <el-card style="width: 100%; margin-top: 5px">
          <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px">
            <div style="padding: 10px 0; border-bottom: 1px solid cornflowerblue; font-size: 20px"><b>Popular Posts</b></div>
            <div style="margin: 20px 0">
              <div style="padding: 10px; border-bottom: 1px dashed #ccc" v-for="item in tableDataGood"
                   :key="item.id">
                <a @click="$router.push('/front/articlesDetail?id=' + item.id)">{{ item.title }}</a>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Forum",
  data() {
    return {
      icon: [icon_good, icon_comment, icon_view, icon_top],
      articleData: [],
      title: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableDataGood: [],
      tableDataRead: [],
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.request.get("/articles/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.title,
        }
      }).then(res => {
        this.articleData = res.data.records;
        this.total = res.data.total;
      });

      this.request.get("/articles/good", {
        params: { pageNum: this.pageNum, pageSize: this.pageSize }
      }).then(res => {
        this.tableDataGood = res.data.records;
      });
    },

    handleLike(item) {
      if (!this.user || !this.user.id) {
        this.$message.warning("You need to log in to like.");
        return;
      }
      // Perform the like action
      // Add your like functionality here
    },

    handleAdd() {
      if (!this.user || !this.user.id) {
        this.$message.warning("You need to log in to publish an article.");
        return;
      }
      this.dialogFormVisible = true;
      this.form = {};
    },

    reset() {
      this.title = "";
      this.load();
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },

    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    }
  }
};
</script>

<style scoped>
.content {
  margin: 10px 0;
  line-height: 25px;
  text-align: justify;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
