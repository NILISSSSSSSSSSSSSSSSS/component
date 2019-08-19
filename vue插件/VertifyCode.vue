<template>
    <div>
        <el-button :size="$size" type="primary" @click="getCode()" :disabled="vertifyBox.isDisabled" ref="code">
            {{ getCodeButton }}
        </el-button>
    </div>
</template>
<script>
    import {
        regex
    } from '../util/publicParams';
    export default {
        props: {
            vertifyBox: {
                phone: "",
                bizType: "",
                shopId: "",
                isDisabled: false,//时候能点击
                closeVertify: false,//用于外面的弹框关闭后关闭验证码，代替方法：组件外面用v-if="弹框dialogo"写法，v-if可以重新渲染验证码组件，如果为false就会自动调用 destroyed方法
            },
        },
        watch: {
            vertifyBox(val) {
                if (val.closeVertify) {
                    this._countOver();
                }
            }
        },
        data() {
            return {
                //验证码相关
                disabled: true,
                getCodeButton: "发送验证码",
            }
        },
         destroyed() {
            this._countOver();
          },
        methods: {
            destroyed() {
                this._countOver();
            },
            // 验证码相关
            getCode() {
                console.log(this.vertifyBox.phone)
                if (this.vertifyBox.phone == "" || this.vertifyBox.phone == undefined) {
                    this.$message.error("请输入手机号");
                    return;
                }
                if (!regex.phone.test(Number(this.vertifyBox.phone))) {
                    this.$message.error("手机号格式错误");
                    return;
                }
                if (this.vertifyBox.bizType === "BIND_SHOP" && this.vertifyBox.shopId === "") {
                    this.$message.error("缺少店铺id");
                    return;
                }
                let data = {
                    phone: this.vertifyBox.phone,
                    bizType: this.vertifyBox.bizType
                };
                //如果是绑定和解绑
                this.vertifyBox.bizType === "BIND_SHOP" || this.vertifyBox.bizType === "UNBIND_SHOP" ? data.shopId = this.vertifyBox.shopId : "";
                console.log(data)
                this.$http.post(this.$api.sendAuthMessage, data, true)
                    .then((res) => {
                        this.$message.success("验证码发送成功");
                        this._countDown();

                    }).catch((res) => {
                        this.$message.error(res.message);
                        this._countOver();
                    });

            },
            _countDown(second = 60) {
                window.timmer = setInterval(() => {
                    this.vertifyBox.isDisabled = true;
                    second = second - 1;
                    this.getCodeButton = `重新获取(${second})`;
                    if (second < 1) {
                        this._countOver();
                    }
                }, 1000);
            },
            _countOver() {
                this.vertifyBox.isDisabled = false;
                this.getCodeButton = "获取验证码";
                clearInterval(window.timmer);
            },
        }
    }
</script>
<style>

</style>
