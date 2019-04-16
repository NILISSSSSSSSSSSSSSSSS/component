<template>
    <div class = 'xk-notification'>
        <audio src="//gc.xksquare.com/8515.mp3" id='notificationAudio' style="display:none"></audio>
    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";
import { getSession } from "@/util/publicMehotds.js";
import {Notification} from 'element-ui';
let NativeNotification = window.Notification ;//原生提示
let ElementNotification = Notification ;//饿了么提示
export default {
    name:'xkNotification',
    data () {
        return {
            shUser:getSession('sh-user') ? JSON.parse(getSession('sh-user')) : {},//个人信息
        };
    },
    props: {},
    components: {},
    computed: {
        ...mapState({
            updateMsg:state => state.trainingCenter.imIncludeSelfMsg
        })
    },
    created() {
        // console.log(this.shUser)
    },
    mounted() {},
    methods: {
        ...mapMutations({
            setAllUnReadNum:"messageCenter/setAllUnReadNum",
            setNewSystemMsg:"messageCenter/setNewSystemMsg",
        }),
        fnAudio(){
            document.querySelector("audio").play()
        },
        notificationInit(param){
            let updateMsg = param ;
            if (NativeNotification) {
                if (NativeNotification.permission == "granted") {
                    console.log('用户同意');
                    this.fnNativeNotification(updateMsg);
                } else if (NativeNotification.permission == "denied") {
                    console.log('用户拒绝');
                    this.fnElementNotification(updateMsg);
                } else {
                    NativeNotification.requestPermission().then(res => {
                        this.notificationInit(updateMsg);
                    })
                }
            } else {
                console.log('浏览器不支持Notification');
                this.fnElementNotification(updateMsg);
            }
            this.fnAudio();//播放声音
        },
        fnNativeNotification(updateMsg){
            //这里根据 updateMsg.lastMsg.content.type 做业务区分
            // let msg = JSON.parse(updateMsg.lastMsg.content);
            // if(msg.type < 10000){
            //     this.trainingCenterNotification(updateMsg,true);
            // }else{
            //     this.systemNotification(updateMsg,true);
            // }
            if(updateMsg.lastMsg.from.startsWith('system') && updateMsg.lastMsg.fromClientType == "Server"){
                this.systemNotification(updateMsg,true);
            }else{
                this.trainingCenterNotification(updateMsg,true);
            }
        },
        fnElementNotification(updateMsg){
            //这里根据 updateMsg.lastMsg.content.type 做业务区分
            // let msg = JSON.parse(updateMsg.lastMsg.content);
            // if(msg.type < 10000){
            //     this.trainingCenterNotification(updateMsg,false);
            // }else{
            //     this.systemNotification(updateMsg,false);
            // }
            if(updateMsg.lastMsg.from.startsWith('system') && updateMsg.lastMsg.fromClientType == "Server"){
                this.systemNotification(updateMsg,false);
            }else{
                this.trainingCenterNotification(updateMsg,false);
            }
        },
        trainingCenterNotification(updateMsg,isNative){
            console.log(updateMsg)
            let _this = this ;
            let content = JSON.parse(updateMsg.lastMsg.content);
            let tip = "";
            switch (content.type) {
                case 1001:
                    tip = content.data.msgContent;
                case 1002:
                    tip = content.data.msgContent;
                    break;
                case 1004:
                    tip = "[视频]";
                    break;
                case 4:
                    tip = "[禁言消息]";
                    break;
                case 1008:
                    tip = content.data.msgContent;
                    break;

                default:
                    break;
            }
            if(isNative){
                let notification = new NativeNotification(updateMsg.lastMsg.fromNick,{
                    body:tip,
                    icon:"//gc.xksquare.com/FgbxxWwWCxqHiTiD_2YBgfSlYmau"
                });
                notification.onclick = function() {
                    let objData = {
                        clickType:"native",
                        tid:updateMsg.to
                    }
                    _this.$emit("fnChooseId",objData)
                    notification.close();
                }
            }else{
                ElementNotification({
                    title:updateMsg.lastMsg.fromNick,
                    message:tip,
                    onClick:function(){
                        let objData = {
                            clickType:"element",
                            tid:updateMsg.to
                        }
                        _this.$emit("fnChooseId",objData)
                        this.close();//关闭当前饿了么通知
                    }
                })
            }
        },
        systemNotification(updateMsg,isNative){
            let msg = JSON.parse(updateMsg.lastMsg.content);
            let _this = this ;
            if(isNative){
                let notification = new NativeNotification("系统消息",{
                    body:msg.data.msgContent,
                    icon:"//gc.xksquare.com/userHeadImg.png"
                });
                notification.onclick = function() {
                    _this.$emit("systomPushClick",updateMsg)
                    notification.close();
                }
            }else{
                ElementNotification({
                    title:"系统消息",
                    message:msg.data.msgContent,
                    onClick:function(){
                        _this.$emit("systomPushClick",updateMsg)
                        this.close();//关闭当前饿了么通知
                    }
                })
            }
            this.setAllUnReadNum({addNum:1});
            this.setNewSystemMsg(updateMsg);
        }
    },
    watch: {
        updateMsg(res){
            console.log(res);
            if (res.lastMsg.from !== this.shUser.id) {   //不是本人才提示
                if(res.lastMsg.type !== "notification"){//非网易云信的提示
                    this.notificationInit(res);
                }
            }
        }
    }
}
</script>
<style scoped>
</style>
