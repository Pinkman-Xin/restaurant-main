<template>
  <div class="pos" id="pos">
    <el-row>
      <el-col :span='7' class="pos-order" id="order-list">
        <el-tabs>
          <el-tab-pane  label="购物车">
            <el-table :data="tableData" border style="width:100%">
              <el-table-column prop="name" label="商品名称"></el-table-column>
              <el-table-column prop="count" label="数量" width="50"></el-table-column>
              <el-table-column label="金额" width="70">
                <template slot-scope="props">
                    <p>{{props.row.price*props.row.count}}元</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="delSingleGoods(scope.row,tableData)">删除</el-button>
                  <el-button type="text" size="small" @click="addOrderList(scope.row,tableData)">增加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="total-goods">
                <span><small>数量：</small>{{totalCount}}</span>
                <span><small>金额：</small>{{totalMoney}}元</span>
            </div>
            <div class="div-btn">
              <el-button type="warning" @click="pendingOrder()">生成订单</el-button>
              <el-button type="danger" @click="delAllGoods()">删除</el-button>
            </div>
          </el-tab-pane>

          <!-- 订单列表 -->
          <el-tab-pane label="订单">
            <el-table :data="orders" border style="width:100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table
                :data="props.row.items"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="菜品"
                  >
                </el-table-column>
                <el-table-column
                    prop="count"
                    label="数量"
                   >
                </el-table-column>
                </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="_id" label="订单编号"></el-table-column>
              <el-table-column prop="count" label="数量" width="50"></el-table-column>
              <el-table-column label="金额" width="70">
                <template slot-scope="props">
                    <p>{{props.row.money}}元</p>
                </template>
              </el-table-column>
            </el-table>
            <div class="total-goods">
                <span><small>订单数量：</small>{{gettotalNum()}}</span>|
                <span><small>订单总金额：</small>{{gettotalMoney()}}元</span>
            </div>
            <div class="div-btn">
              <el-button type="success" @click="checkout()">结账</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>


      <el-col :span='15'>
          <div class="often-goods">
            <div class="title">菜单列表</div>
            <div class="often-goods-list">
              <ul>
                <li v-for="goods in oftenGoods" @click="addOrderList(goods,tableData)">
                  <span>{{goods.goodsName}}</span>
                  <span class="o-price">￥{{goods.price}}元</span>
                </li>
              </ul>
            </div>
          </div>


          <div class="goods-type">
            <el-tabs>
              <el-tab-pane label="主食">
                <ul class='cookList'>
                    <li v-for="goods in type0Goods" @click="addOrderList(goods,tableData)">
                        <span class="foodImg"><img :src="goods.icon"></span>
                        <span class="foodName">{{goods.name}}</span>
                        <span class="foodPrice">￥{{goods.price}}元</span>
                    </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="甜点">
                <ul class='cookList'>
                    <li v-for="goods in type1Goods" @click="addOrderList(goods,tableData)">
                        <span class="foodImg"><img :src="goods.icon" width="100%"></span>
                        <span class="foodName">{{goods.name}}</span>
                        <span class="foodPrice">￥{{goods.price}}元</span>
                    </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="饮品">
                <ul class='cookList'>
                    <li v-for="goods in type2Goods" @click="addOrderList(goods,tableData)">
                        <span class="foodImg"><img :src="goods.icon" width="100%"></span>
                        <span class="foodName">{{goods.name}}</span>
                        <span class="foodPrice">￥{{goods.price}}元</span>
                    </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'pos',
  data () {
    return {
      orders:[],
      items:[],
      tableData: [],
      oftenGoods:[],
      type0Goods:[],
      type1Goods:[],
      type2Goods:[],
      type3Goods:[],
      totalCount: 0,
      totalMoney: 0,
      pendingBox:{
       state:0,
       paystate:0
      }
    }
  },
  methods: {
    //获取菜品
    async fetch(){
            const res = await this.$http.get('rest/items')
            this.items = res.data
            this.items.forEach(item => {
              if (item.parent.name == '主食') {
                this.type0Goods.push(item)
              }
              if (item.parent.name == '甜点') {
                this.type1Goods.push(item)
              }
              if (item.parent.name == '饮品') {
                this.type2Goods.push(item)
              }
            });

        },
        //添加菜品到购物车
    addOrderList(goods) {
            // this.totalCount = 0; //汇总数量清0
            // this.totalMoney = 0;
            let isHave = false;
            //判断是否这个商品已经存在于订单列表
            for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i]._id == goods._id) {
                    isHave = true; //存在
                }
            }
            //根据isHave的值判断订单列表中是否已经有此商品
            if (isHave) {
                //存在就进行数量添加
                let arr = this.tableData.filter(o => o._id == goods._id);
                console.log(arr);
                arr[0].count++;
            } else {
                //不存在就推入数组
                let newGoods = { _id: goods._id, name: goods.name, price: goods.price, count: 1 };
                this.tableData.push(newGoods);
            }
            console.log(this.tableData);
            this.getAllMoney();
        },
        //获取总价
        getAllMoney() {
            this.totalCount = 0;
            this.totalMoney = 0;
            if (this.tableData) {
                this.tableData.forEach((element) => {
                    this.totalCount += element.count;
                    this.totalMoney = this.totalMoney + (element.price * element.count);
                });
            }
        },
        //删除单个商品
        delSingleGoods(goods) {
           let isHave = false;
            //判断是否这个商品已经存在于订单列表
            for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i]._id == goods._id) {
                    isHave = true; //存在
                }
            }
            //根据isHave的值判断订单列表中是否已经有此商品
            if (isHave) {
              console.log(111);
                //存在就进行数量添加
                let arr = this.tableData.filter(o => o._id == goods._id);
                console.log(arr);
                arr[0].count--;
                if (arr[0].count == 0) {
                  this.tableData = this.tableData.filter(o => o.count !== 0);
                }
            } else {
                //不存在就推入数组
                let newGoods = { _id: goods._id, name: goods.name, price: goods.price, count: 1 };
                this.tableData.push(newGoods);
            }
            console.log(this.tableData);
            this.getAllMoney();
        },
        //提交订单
        async pendingOrder(){
          this.pendingBox.count = this.totalCount
          this.pendingBox.money = this.totalMoney
          this.pendingBox.username = localStorage.username
          this.pendingBox.items = this.tableData
          let res = await this.$http.post('rest/orders',this.pendingBox)
          this.$message({
              type:'success',
              message:'保存成功'
          })
          this.tableData = [],
          this.totalCount =0
          this.totalMoney =0
          let respons = await this.$http.get('myorder')
          this.orders = respons.data
        },
        gettotalNum(){
          let num = this.orders.length
          return num
        },
        gettotalMoney(){
          let money = 0
          if (this.orders.length ==0) {
            return
          }else{
          this.orders.forEach(item=>{
            money = money+item.money
          })
          }
          return money
        },
        async checkout() {
          this.orders.forEach(item=>{
            item.state =1
            item.paystate =1;
            (async ()=>{
              await this.$http.put(`rest/orders/${item._id}`,item)
            })()
          })
            if (this.orders.length!=0) {
                this.$message({
                    message: '结账成功，感谢你又为店里出了一份力!',
                    type: 'success'
                });
                this.orders = []
            }else{
                this.$message.error('不能空结。老板了解你急切的心情！');
            }
        },
  },
  created() {
    this.fetch()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul li {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.pos{
  min-width: 1400px;
}
.pos-order{
}
.div-btn{
  margin-top: 10px;
}
.title{
      height: 20px;
      border-bottom:1px solid #D3DCE6;
      background-color: #F9FAFC;
      padding:10px;
  }
  .often-goods-list ul li{
    list-style: none;
    float:left;
    border:1px solid #E5E9F2;
    padding:10px;
    margin:5px;
    background-color:#fff;
    cursor: pointer;
  }
  .o-price{
    color:#58B7FF; 
  }

  .goods-type{
    clear: both;
  }
.cookList li{
      list-style: none;
      width:200px;
      height: 200px;
      border:1px solid black;
      height: auto;
      overflow: hidden;
      background-color:#fff;
      padding: 2px;
      float:left;
      margin: 2px;
      cursor: pointer;
}
.cookList li span{
  display: block;
  float:left;
}
.total-goods{
  background-color:#fff;
  border-bottom:1px solid #E5E9F2;
  padding: 10px;
}
.foodImg{
    width: 100px;
    height: 100px;
    overflow: hidden;
}
.foodImg img{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.foodName{
    width: 118px;
    font-size: 18px;
    padding-left:;
    color:brown;

}
.foodPrice{
    font-size: 16px;
    padding-left:35%;
    padding-top:10px;
}
</style>
