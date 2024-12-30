<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="please enter名称" suffix-icon="el-icon-search" v-model="title"></el-input>
      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>

    <!-- add和delete in batches -->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">add <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="Do you make sure delete in batches these data？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">delete in batches <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="70" sortable></el-table-column>
      <el-table-column prop="title" label="article title" width="120"></el-table-column>
      <el-table-column prop="content" label="article content">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.content)" type="primary">View content</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="cover" width="150">
        <template slot-scope="scope"><el-image style="width: 100px; height: 100px" :src="scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image></template>
      </el-table-column>
      <el-table-column prop="username" label="Medal information"></el-table-column>
      <el-table-column prop="time" label="release time"></el-table-column>
      <el-table-column prop="category" label="Article classification"></el-table-column>
      <el-table-column prop="readCount" label="times of view"></el-table-column>
      <el-table-column prop="goodCount" label="number of Likes数"></el-table-column>

      <el-table-column label="operation" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">edit <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="Do you make sure to delete?？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">delete <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
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
          :total="total">
      </el-pagination>
    </div>

    <!-- add和edit的弹窗 -->
    <el-dialog title="信息" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal="false">
      <el-form label-width="120px" size="small" style="width: 90%;" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="title" label="article title：">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Medal information">
          <el-input v-model="form.username" autocomplete="off"></el-input> <!-- 默认显示登录的用户名，不可edit -->
        </el-form-item>

        <el-form-item label="category">
          <el-select clearable v-model="form.category" placeholder="Please select category" style="width: 100%">
            <el-option v-for="item in category" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="cover" label="cover：">
          <el-upload action="http://localhost:9090/file/upload" ref="img" :on-success="handleImgUploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item prop="content" label="article content：">
          <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 文章content -->
    <el-dialog title="文章信息" :visible.sync="viewDialogVis" width="60%">
      <el-card>
        <div>
          <mavon-editor
              class="md"
              :value="content"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="false"
              :ishljs="true"
          />
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Articles",
  data() {
    return {
      tableData: [],
      category: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      title: '',
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      username: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 获取登录的用户名
      rules: {
        title: [{required: true, message: 'please enter article title', trigger: 'blur'}]
      },
      content: '',
      viewDialogVis: false
    }
  },
  created() {
    this.load();
  },
  methods: {
    view(content) {
      this.content = content;
      this.viewDialogVis = true;
    },

    imgAdd(pos, $file) {
      let $vm = this.$refs.md;
      const formData = new FormData();
      formData.append('file', $file);
      axios({
        url: 'http://localhost:9090/file/upload',
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then((res) => {
        $vm.$img2Url(pos, res.data);
      });
    },

    load() {
      this.request.get("/articles/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.title,
        }
      }).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });

      this.request.get("/category").then(res => {
        this.category = res.data;
      });
    },

    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.request.post("/articles", this.form).then(res => {
            if (res.code === '200') {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.load();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
      this.$nextTick(() => {
        if (this.$refs.img) {
          this.$refs.img.clearFiles();
        }
      });
    },

    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        if (this.$refs.img) {
          this.$refs.img.clearFiles();
        }
      });
    },

    del(id) {
      this.request.delete("/articles/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("delete success");
          this.load();
        } else {
          this.$message.error("delete  failure");
        }
      });
    },

    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },

    delBatch() {
      if (!this.multipleSelection.length) {
        this.$message.error("Select the data you want to delete");
        return;
      }
      let ids = this.multipleSelection.map(v => v.id);
      this.request.post("/articles/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("delete in batches success");
          this.load();
        } else {
          this.$message.error("delete in batches failure");
        }
      });
    },

    reset() {
      this.title = '';
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

    handleFileUploadSuccess(res) {
      this.form.file = res;
    },

    handleImgUploadSuccess(res) {
      this.form.cover = res;
    }
  }
};
</script>

<style>
.headerBg {
  background: #ffe8b4 !important;
}
</style>
