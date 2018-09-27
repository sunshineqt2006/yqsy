<template>
    <table cellspacing="0"  cellpadding="0" border="0" v-moveable="{setXY}"  class="layer" :style="layerStyle">
      <!-- <tr>
        <th>玩家</th>
        <th>成绩</th>
        <th>排名</th>
      </tr> -->
      <tr v-for="(rank,index) in ranks" :key="index">
        <td valign="middle" align="left" width="30%">
          <img class="header" :src="rank.header">{{rank.nick}}
        </td>
        <td valign="middle" align="center" width="50%">{{rank.score}}</td>
        <td valign="middle" align="center" width="20%"><div class="rank-bg">{{index+1}}</div></td>
      </tr>
    </table>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  data () {
    return {
      ranks: [],
      isEnd: false
    }
  },
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.width = this.layer.size + 'px'
      return style
    }
  },
  watch: {
    'layer.maxRank' (val) {
      this.createDemoRanks()
    }
  },
  methods: {
    createDemoRanks () {
      this.ranks = []
      for (let i = 0; i < this.layer.maxRank; i++) {
        this.ranks.push({
          header: 'http://g.zrfilm.com/Application/Money/Public/images/head/7.gif',
          nick: '老王',
          score: '100米+5金币',
          rank: i + 1
        })
      }
    },
    pollRank () {
      this.inter = setInterval(async () => {
        let res = await this.$get('/event/game/gameStatus', {eventKey: this.eventKey, pageSize: this.layer.maxRank})
        this.ranks = res.data.list.map(e => {
          return {
            header: e.headImgUrl,
            score: e.scoreText,
            nick: e.nickName
          }
        })
        if (res.data.endTime) {
          this.inter && clearInterval(this.inter)
        }
      }, 2000)
    }
  },
  destroyed () {
    this.inter && clearInterval(this.inter)
    if (this.eventKey && !this.isEnd) { this.$post('/event/game/gameStatus', {eventKey: this.eventKey, status: 2}) }// 游戏结束
  },
  mounted () {
    this.eventKey && this.pollRank()
  },
  created () {
    if (!this.eventKey) { this.createDemoRanks() }
    this.$root.$on('leasttime', (least) => {
      if (this.eventKey && !this.isEnd && least <= 5) {
        this.$post('/event/game/gameStatus', {eventKey: this.eventKey, status: 2})
        this.isEnd = true
      }// 游戏结束
    })
  }
}
</script>

<style lang="less" scoped>
.layer {
  table-layout:fixed;
  th{
    font-size:14px;
  }
  tr{
    font-size:16px;
    height:38px;
  }
  td{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.header{
  height:30px;
  width:30px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right:5px;
}
.rank-bg{
  border:1px #333333 solid;
  height:26px;
  width:26px;
  border-radius: 50%;
  line-height:26px;
}
</style>
