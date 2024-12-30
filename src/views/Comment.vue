<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="please enter comment content" suffix-icon="el-icon-search" v-model="content"></el-input>

      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">add <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="Do you make sure delete in batches these data?"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">delete in batches <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>

    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
      <el-table-column prop="content" label="content"></el-table-column>
      <el-table-column prop="userId" label="commentatorId"></el-table-column>
      <el-table-column prop="time" label="Comment time"></el-table-column>
      <el-table-column prop="pid" label="upId"></el-table-column>
      <el-table-column prop="originId" label="superior commentid"></el-table-column>
      <el-table-column prop="articlesId" label="The id of the associated article"></el-table-column>

      <el-table-column label="operation"  width="180" align="center">
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

<!--    edit评论-->
    <el-dialog title="评论信息" :visible.sync="dialogFormVisible" width="40%" :close-on-click-modal="false">
      <el-form label-width="140px" size="small" style="width: 85%;" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="content" label="content">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="userId" label="commentatorId">
          <el-input v-model="form.userId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="time" label="Comment time">
          <el-date-picker v-model="form.time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  disabled></el-date-picker>
        </el-form-item>
        <el-form-item prop="pid" label="upId">
          <el-input v-model="form.pid" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="originId" label="superior commentid">
          <el-input v-model="form.originId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="articlesId" label="The id of the associated article">
          <el-input v-model="form.articlesId" autocomplete="off" disabled></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      content: "",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      rules: {
        name: [
          { required: true, message: 'please enter名称', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.request.get("/comment/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          content: this.content,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.request.get("/comment", this.form).then(res => {
              if (res.code === '200') {
                this.$message.success("保存成功")
                this.dialogFormVisible = false
                this.load()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
      this.$nextTick(() => {
        if(this.$refs.img) {
           this.$refs.img.clearFiles();
         }
         if(this.$refs.file) {
          this.$refs.file.clearFiles();
         }
      })
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
       this.$nextTick(() => {
         if(this.$refs.img) {
           this.$refs.img.clearFiles();
         }
         if(this.$refs.file) {
          this.$refs.file.clearFiles();
         }
       })
    },
    del(id) {
      this.request.delete("/comment/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("delete success")
          this.load()
        } else {
          this.$message.error("delete  failure")
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    delBatch() {
      if (!this.multipleSelection.length) {
        this.$message.error("Select the data you want to delete")
        return
      }
      let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      this.request.post("/comment/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("delete in batches success")
          this.load()
        } else {
          this.$message.error("delete in batches失败")
        }
      })
    },
    reset() {
      this.name = ""
      this.load()
    },
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },
    handleFileUploadSuccess(res) {
      this.form.file = res
    },
    handleImgUploadSuccess(res) {
      this.form.img = res
    },

  }
}
</script>


<style>
.headerBg {
  background: #eee!important;
}
</style>
