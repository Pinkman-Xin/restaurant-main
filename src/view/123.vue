<template>
    <div class="pos">
        <div>
            <el-row>
                <el-col :span="7" class="pos-order" id="order-list">
    
                    <el-tabs>
                        <el-tab-pane label="点餐">
                            <el-table :data="tableData" border style="width: 100%">
    
                                <el-table-column prop="goodsName" label="商品"></el-table-column>
                                <el-table-column prop="count" label="量" width="50"></el-table-column>
                                <el-table-column prop="price" label="金额" width="70"></el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template scope="scope">
                                        <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                                        <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
    
                            <div class="totalDiv">
                                <small>数量：</small>
                                <strong>{{totalCount}}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
                                <small>总计：</small>
                                <strong>{{totalMoney}}</strong> 元
                            </div>
    
                            <div class="order-btn">
                                <el-button type="warning">挂单</el-button>
                                <el-button type="danger" @click="delAllGoods()">删除</el-button>
                                <el-button type="success" @click="checkout()"> 结账</el-button>
                            </div>
                        </el-tab-pane>
    
                        <el-tab-pane label="挂单">
                            挂单
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
                <!--商品展示-->
                
                <el-col :span="17">
                    <div class="often-goods">
                        <div class="title">常用商品</div>
                        <div class="often-goods-list">
    
                            <ul>
                                <li v-for="goods in oftenGoods" @click="addOrderList(goods)">
                                    <span>{{goods.goodsName}}</span>
                                    <span class="o-price">￥{{goods.price}}元</span>
                                </li>
    
                            </ul>
                        </div>
                    </div>
                    <div class="goods-type"> 
                        <el-tabs>
                            <el-tab-pane label="汉堡">
                                <ul class='cookList'>
    
                                    <li v-for="goods in type0Goods" @click="addOrderList(goods)">
                                        <span class="foodImg">
                                            <img :src="goods.goodsImg" width="100%">
                                        </span>
                                        <span class="foodName">{{goods.goodsName}}</span>
                                        <span class="foodPrice">￥{{goods.price}}元</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="小食">
                                <ul class='cookList'>
                                    <li v-for="goods in type1Goods" @click="addOrderList(goods)">
                                        <span class="foodImg">
                                            <img :src="goods.goodsImg" width="100%">
                                        </span>
                                        <span class="foodName">{{goods.goodsName}}</span>
                                        <span class="foodPrice">￥{{goods.price}}元</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="饮料">
                                <ul class='cookList'>
                                    <li v-for="goods in type2Goods" @click="addOrderList(goods)">
                                        <span class="foodImg">
                                            <img :src="goods.goodsImg" width="100%">
                                        </span>
                                        <span class="foodName">{{goods.goodsName}}</span>
                                        <span class="foodPrice">￥{{goods.price}}元</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="套餐">
                                <ul class='cookList'>
                                    <li v-for="goods in type3Goods" @click="addOrderList(goods)">
                                        <span class="foodImg">
                                            <img :src="goods.goodsImg" width="100%">
                                        </span>
                                        <span class="foodName">{{goods.goodsName}}</span>
                                        <span class="foodPrice">￥{{goods.price}}元</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
    
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Pos',
    mounted: function () {
        var orderHeight = document.body.clientHeight;
        document.getElementById("order-list").style.height = orderHeight + 'px';
    },
    created() {
        //读取常用商品列表
        axios.get('http://jspang.com/DemoApi/oftenGoods.php')
            .then(response => {
                //console.log(response);
                this.oftenGoods = response.data;
            })
            .catch(error => {
                console.log(error);
                alert('网络错误，不能访问');
            })
        //读取分类商品列表
        axios.get('http://jspang.com/DemoApi/typeGoods.php')
            .then(response => {
                //console.log(response);
                //this.oftenGoods=response.data;
                this.type0Goods = response.data[0];
                this.type1Goods = response.data[1];
                this.type2Goods = response.data[2];
                this.type3Goods = response.data[3];

            })
            .catch(error => {
                console.log(error);
                alert('网络错误，不能访问');
            })
    },
    data() {
        return {
            tableData: [], //订单列表的值
            oftenGoods: [],
            type0Goods: [],
            type1Goods: [],
            type2Goods: [],
            type3Goods: [],
            totalMoney: 0, //订单总价格
            totalCount: 0  //订单商品总数量

        }
    },
    methods: {
        //添加订单列表的方法
        addOrderList(goods) {
            //console.log(goods);
            this.totalCount = 0; //汇总数量清0
            this.totalMoney = 0;
            let isHave = false;
            //判断是否这个商品已经存在于订单列表
            for (let i = 0; i < this.tableData.length; i++) {
                console.log(this.tableData[i].goodsId);
                if (this.tableData[i].goodsId == goods.goodsId) {

                    isHave = true; //存在

                }
            }
            //根据isHave的值判断订单列表中是否已经有此商品
            if (isHave) {
                //存在就进行数量添加
                let arr = this.tableData.filter(o => o.goodsId == goods.goodsId);
                arr[0].count++;
                //console.log(arr);
            } else {
                //不存在就推入数组
                let newGoods = { goodsId: goods.goodsId, goodsName: goods.goodsName, price: goods.price, count: 1 };
                this.tableData.push(newGoods);

            }

            this.getAllMoney();
        },
        //删除单个商品
        delSingleGoods(goods) {
            console.log(goods);
            this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
            this.getAllMoney();

        },
        //删除所有商品
        delAllGoods() {
            this.tableData = [];
            this.totalCount = 0;
            this.totalMoney = 0;
        },
        //汇总数量和金额
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
        //结账方法模拟
        checkout() {
            if (this.totalCount!=0) {
                this.tableData = [];
                this.totalCount = 0;
                this.totalMoney = 0;
                this.$message({
                    message: '结账成功，感谢你又为店里出了一份力!',
                    type: 'success'
                });

            }else{
                this.$message.error('不能空结。老板了解你急切的心情！');

            }

        }


    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pos {
    font-size: 12px;
}

.pos-order {

    background-color: #F9FAFC;
    border-right: 1px solid #C0CCDA;
}

.order-btn {
    margin-top: 10px;
    text-align: center;
}

.title {
    height: 20px;
    border-bottom: 1px solid #D3DCE6;
    background-color: #F9FAFC;
    padding: 10px;
}



.goods-type {
    clear: both;
}

.o-price {
    color: #58B7FF;
}

.often-goods-list {
    border-bottom: 1px solid #C0CCDA;
    height: auto;
    overflow: hidden;
    padding-bottom: 10px;
    background-color: #F9FAFC;
}

.cookList li {
    list-style: none;
    width: 23%;
    border: 1px solid #E5E9F2;
    height: auot;
    overflow: hidden;
    background-color: #fff;
    padding: 2px;
    float: left;
    margin: 2px;
    cursor: pointer;
}

.cookList li span {

    display: block;
    float: left;
}

.foodImg {
    width: 40%;
}

.foodName {
    font-size: 18px;
    padding-left: 10px;
    color: brown;
}

.foodPrice {
    font-size: 16px;
    padding-left: 10px;
    padding-top: 10px;
}

.totalDiv {
    height: auot;
    overflow: hidden;
    text-align: right;
    font-size: 16px;
    background-color: #fff;
    border-bottom: 1px solid #E5E9F2;
    padding: 10px;
}
</style>
