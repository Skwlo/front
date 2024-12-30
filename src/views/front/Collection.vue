<template>
  <div>
    <el-card style="margin-top: 20px">
      <div style="margin: 10px 0">
        <el-input style="width: 200px" placeholder="please enter article title" suffix-icon="el-icon-search" v-model="title"></el-input>
        <el-button class="ml-5" type="primary" @click="load">search</el-button>
        <el-button type="warning" @click="reset">reset</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="文章">
          <template slot-scope="scope">
            <a style="color: #1a1a1a" @click="$router.push('/front/articlesDetail?id=' + scope.row.url)">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="Collection time"></el-table-column>

        <el-table-column fixed="right" label="operation" width="100">
          <template slot-scope="scope">
            <el-popconfirm
                class="ml-5"
                confirm-button-text="确定"
                cancel-button-text="我再想想"
                icon="el-icon-info"
                icon-color="red"
                title="您确定取消收藏吗？"
                @confirm="del(scope.row.id)"
            >
              <el-button type="danger" slot="reference">取消收藏 <i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>

            <!-- 操作按钮(如评论、点赞) -->
            <el-button type="primary" size="small" @click="handleComment(scope.row.id)">评论</el-button>
            <el-button type="success" size="small" @click="handleLike(scope.row.id)">点赞</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Collect",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      title: '',
      form: {},
      dialogFormVisible: false,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},  // 获取用户信息
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.request
          .get("/collect/page", {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              title: this.title,
            },
          })
          .then((res) => {
            this.tableData = res.data.records;
            this.total = res.data.total;
          });
    },

    // 取消收藏操作
    del(id) {
      this.request.delete("/collect/" + id).then((res) => {
        if (res.code === "200") {
          this.$message.success("取消收藏成功");
          this.load();
        } else {
          this.$message.error("取消收藏失败");
        }
      });
    },

    // 评论功能
    handleComment(articleId) {
      if (!this.user || !this.user.username) {
        this.$message.warning("Please login before commenting");
        return;
      }
      // 执行评论逻辑
      this.$message.success("评论功能正在开发中...");
    },

    // 点赞功能
    handleLike(articleId) {
      if (!this.user || !this.user.username) {
        this.$message.warning("Please log in first and then click Like");
        return;
      }
      // 执行点赞逻辑
      this.$message.success("点赞功能正在开发中...");
    },

    // 搜索重置
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
    },
  },
};
</script>

<style>
.headerBg {
  background: #afccee !important;
}
</style>
