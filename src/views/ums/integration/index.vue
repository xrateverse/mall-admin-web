<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="用户名/手机号" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="integrationTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="当前积分" align="center">
          <template slot-scope="scope">{{scope.row.integration}}</template>
        </el-table-column>
        <el-table-column label="冻结积分" align="center">
          <template slot-scope="scope">{{scope.row.freezeIntegration}}</template>
        </el-table-column>
        <el-table-column label="套餐名称" align="center">
          <template slot-scope="scope">{{scope.row.memberLevelName || 'N/A'}}</template>
        </el-table-column>
        <el-table-column label="套餐到期时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.memberLevelExpireDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleAdd(scope.row)">增加
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleReduce(scope.row)">减少
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleGift(scope.row)">赠送
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleFreezeDetail(scope.row)">冻结详情
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleHistory(scope.row)">积分历史
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <!-- 增加积分对话框 -->
    <el-dialog
      title="增加积分"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="operateForm"
               :rules="operateRules"
               ref="addForm"
               label-width="120px" size="small">
        <el-form-item label="积分数量：" prop="amount">
          <el-input v-model.number="operateForm.amount" type="number" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="操作备注：" prop="operateNote">
          <el-input v-model="operateForm.operateNote"
                    type="textarea"
                    :rows="3"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 减少积分对话框 -->
    <el-dialog
      title="减少积分"
      :visible.sync="reduceDialogVisible"
      width="40%">
      <el-form :model="operateForm"
               :rules="operateRules"
               ref="reduceForm"
               label-width="120px" size="small">
        <el-form-item label="积分数量：" prop="amount">
          <el-input v-model.number="operateForm.amount" type="number" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="操作备注：" prop="operateNote">
          <el-input v-model="operateForm.operateNote"
                    type="textarea"
                    :rows="3"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reduceDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleReduceConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 赠送积分对话框 -->
    <el-dialog
      title="赠送积分"
      :visible.sync="giftDialogVisible"
      width="40%">
      <el-form :model="operateForm"
               :rules="operateRules"
               ref="giftForm"
               label-width="120px" size="small">
        <el-form-item label="积分数量：" prop="amount">
          <el-input v-model.number="operateForm.amount" type="number" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="操作备注：" prop="operateNote">
          <el-input v-model="operateForm.operateNote"
                    type="textarea"
                    :rows="3"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="giftDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleGiftConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 冻结详情对话框 -->
    <el-dialog
      title="冻结详情"
      :visible.sync="freezeDialogVisible"
      width="60%">
      <el-table :data="freezeList" v-loading="freezeLoading" border>
        <el-table-column label="冻结积分" align="center">
          <template slot-scope="scope">{{scope.row.freezeIntegration}}</template>
        </el-table-column>
        <el-table-column label="冻结时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="到期时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.expireTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">冻结中</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success">已扣减</el-tag>
            <el-tag v-else type="info">已释放</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="freezeDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 积分历史对话框 -->
    <el-dialog
      title="积分历史"
      :visible.sync="historyDialogVisible"
      width="70%">
      <el-table :data="historyList" v-loading="historyLoading" border>
        <el-table-column label="变动类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.changeType === 0" type="success">增加</el-tag>
            <el-tag v-else type="warning">减少</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变动积分" align="center">
          <template slot-scope="scope">{{scope.row.changeCount}}</template>
        </el-table-column>
        <el-table-column label="来源类型" align="center">
          <template slot-scope="scope">{{getSourceTypeLabel(scope.row.sourceType)}}</template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">{{scope.row.operateMan || '-'}}</template>
        </el-table-column>
        <el-table-column label="操作备注" align="center">
          <template slot-scope="scope">{{scope.row.operateNote}}</template>
        </el-table-column>
        <el-table-column label="变动时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleHistorySizeChange"
          @current-change="handleHistoryCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="historyQuery.pageNum"
          :page-size="historyQuery.pageSize"
          :page-sizes="[10,15,20]"
          :total="historyTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, addIntegration, reduceIntegration, giftIntegration, fetchFreezeList, fetchHistory} from '@/api/integration';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
  };
  const defaultOperateForm = {
    memberId: null,
    amount: null,
    operateNote: null
  };
  const defaultHistoryQuery = {
    pageNum: 1,
    pageSize: 10
  };
  export default {
    name: 'integrationList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        addDialogVisible: false,
        reduceDialogVisible: false,
        giftDialogVisible: false,
        freezeDialogVisible: false,
        historyDialogVisible: false,
        operateForm: Object.assign({}, defaultOperateForm),
        operateRules: {
          amount: [
            {required: true, message: '请输入积分数量', trigger: 'blur'},
            {type: 'number', message: '积分数量必须为数字', trigger: 'blur'},
            {validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error('积分数量必须大于0'));
              } else if (!Number.isInteger(value)) {
                callback(new Error('积分数量必须为整数'));
              } else {
                callback();
              }
            }, trigger: 'blur'}
          ],
          operateNote: [
            {required: true, message: '请输入操作备注', trigger: 'blur'}
          ]
        },
        freezeList: [],
        freezeLoading: false,
        historyList: [],
        historyTotal: null,
        historyLoading: false,
        historyQuery: Object.assign({}, defaultHistoryQuery),
        currentMemberId: null
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        }).catch(error => {
          this.listLoading = false;
          this.$message({
            type: 'error',
            message: '获取列表失败：' + (error.message || '未知错误')
          });
        });
      },
      handleAdd(row) {
        this.addDialogVisible = true;
        this.operateForm = Object.assign({}, defaultOperateForm);
        this.operateForm.memberId = row.id;
        this.$nextTick(() => {
          this.$refs.addForm && this.$refs.addForm.resetFields();
        });
      },
      handleAddConfirm() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            addIntegration({
              memberId: this.operateForm.memberId,
              integration: this.operateForm.amount,
              sourceType: 1,
              operateNote: this.operateForm.operateNote
            }).then(response => {
              this.$message({
                type: 'success',
                message: '增加积分成功!'
              });
              this.addDialogVisible = false;
              this.getList();
            }).catch(error => {
              this.$message({
                type: 'error',
                message: '增加积分失败：' + (error.message || '未知错误')
              });
            });
          }
        });
      },
      handleReduce(row) {
        this.reduceDialogVisible = true;
        this.operateForm = Object.assign({}, defaultOperateForm);
        this.operateForm.memberId = row.id;
        this.$nextTick(() => {
          this.$refs.reduceForm && this.$refs.reduceForm.resetFields();
        });
      },
      handleReduceConfirm() {
        this.$refs.reduceForm.validate((valid) => {
          if (valid) {
            reduceIntegration({
              memberId: this.operateForm.memberId,
              integration: this.operateForm.amount,
              sourceType: 1,
              operateNote: this.operateForm.operateNote
            }).then(response => {
              this.$message({
                type: 'success',
                message: '减少积分成功!'
              });
              this.reduceDialogVisible = false;
              this.getList();
            }).catch(error => {
              this.$message({
                type: 'error',
                message: '减少积分失败：' + (error.message || '未知错误')
              });
            });
          }
        });
      },
      handleGift(row) {
        this.giftDialogVisible = true;
        this.operateForm = Object.assign({}, defaultOperateForm);
        this.operateForm.memberId = row.id;
        this.$nextTick(() => {
          this.$refs.giftForm && this.$refs.giftForm.resetFields();
        });
      },
      handleGiftConfirm() {
        this.$refs.giftForm.validate((valid) => {
          if (valid) {
            giftIntegration({
              memberId: this.operateForm.memberId,
              integration: this.operateForm.amount,
              sourceType: 5,
              operateNote: this.operateForm.operateNote
            }).then(response => {
              this.$message({
                type: 'success',
                message: '赠送积分成功!'
              });
              this.giftDialogVisible = false;
              this.getList();
            }).catch(error => {
              this.$message({
                type: 'error',
                message: '赠送积分失败：' + (error.message || '未知错误')
              });
            });
          }
        });
      },
      handleFreezeDetail(row) {
        this.freezeDialogVisible = true;
        this.freezeLoading = true;
        fetchFreezeList(row.id).then(response => {
          this.freezeLoading = false;
          this.freezeList = response.data;
        }).catch(error => {
          this.freezeLoading = false;
          this.$message({
            type: 'error',
            message: '获取冻结详情失败：' + (error.message || '未知错误')
          });
        });
      },
      handleHistory(row) {
        this.historyDialogVisible = true;
        this.currentMemberId = row.id;
        this.historyQuery = Object.assign({}, defaultHistoryQuery);
        this.getHistoryList();
      },
      getHistoryList() {
        this.historyLoading = true;
        fetchHistory(this.currentMemberId, this.historyQuery).then(response => {
          this.historyLoading = false;
          this.historyList = response.data.list;
          this.historyTotal = response.data.total;
        }).catch(error => {
          this.historyLoading = false;
          this.$message({
            type: 'error',
            message: '获取积分历史失败：' + (error.message || '未知错误')
          });
        });
      },
      handleHistorySizeChange(val) {
        this.historyQuery.pageNum = 1;
        this.historyQuery.pageSize = val;
        this.getHistoryList();
      },
      handleHistoryCurrentChange(val) {
        this.historyQuery.pageNum = val;
        this.getHistoryList();
      },
      getSourceTypeLabel(sourceType) {
        const sourceTypeMap = {
          0: '购物',
          1: '管理员修改',
          5: '赠送',
          7: '订单支付',
          8: '订单取消',
          9: '冻结',
          10: '释放'
        };
        return sourceTypeMap[sourceType] || '未知来源';
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
