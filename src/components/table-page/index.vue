<template>
  <div class="table-page-box">
    <el-table  @selection-change="selectionChange" v-loading="loading" :data="tableDate" v-bind="$attrs" v-on="$listeners" header-row-class-name="default"  stripe border >
      <slot></slot>
    </el-table>
    <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" layout="sizes, prev, pager, next,total" :current-page="page.cur" :total="page.total" :page-sizes="[10, 20, 50, 100]"></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    fetch: {
      type: Function,
      default: Promise.resolve()
    },
    params: Object,
    initQuery: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tableDate: [],
      loading: false,
      page: {
        cur: 1,
        size: 10,
        total: 0
      },
      selection: []
    }
  },
  methods: {
    refresh (page = 0) {
      this.loading = true
      this.params.page = page
      this.params.pageSize = this.page.size
      this.fetch(this.params).then(
        ({ data }) => {
          this.loading = false
          this.tableDate = data.list
          this.sum = data.sum
          this.page.total = parseInt(data.page.total)
          this.page.cur = parseInt(data.page.cur)
        },
        ({ content }) => {
          this.loading = false
          this.tableDate = []
        }
      )
    },
    pageSizeChange (size) {
      this.page.size = size
      this.refresh()
    },
    pageCurrentChange (cur) {
      this.page.cur = cur
      this.refresh(cur)
    },
    selectionChange (val) {
      this.selection = val
      this.$emit('selection-change', val)
    },
    dbClick (row, event) {
      this.$emit('look', row)
    }
  },
  mounted () {
    if (this.initQuery) {
      this.refresh()
    }
  }
}
</script>
<style lang="less">
.table-page-box {
  .el-pagination {
    margin-top: 20px;
    padding: 0px;
    display: flex;
    align-items: center;
    .el-pagination__sizes {
      flex: 1;
    }
    .el-pagination__total {
      margin-right: 0px;
      margin-left: 10px;
    }
  }
}
</style>
