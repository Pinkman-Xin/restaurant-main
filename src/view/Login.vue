<template>
    <div>
        <el-card header="请先登录" class="login-card">
            <el-form @submit.native.prevent="login">
                <el-form-item label="用户名">
                    <el-input v-model="model.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="model.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width:100%" type="primary" native-type="submit">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button style="width:100%" type="primary" @click="jump">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
 data() {
     return {
         model:{}
     }
 },
 methods: {
     jump(){
         this.$router.push('./register')
     },
     async login(){
         const res = await this.$http.post('login',this.model)
         localStorage.token = res.data.token
         localStorage.username = res.data.username
         this.$router.push('/pos')
         this.$message({
             type:'success',
             message:'登录成功'
         })
     }
 },
}
</script>

<style>
.login-card{
    width: 35rem;
    margin: 10rem auto;
}
</style>