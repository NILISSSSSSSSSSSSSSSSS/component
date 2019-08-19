<template>
    <div class="xk-um" :id="randomId">
        <div :id="editor" class="editor" :style="UEheight"></div>
        <image-upload v-if="isShow" :isShow.sync="isShow" v-model="picUrl" :more="false" :accept="accept">
            <span style="display: none" :id="uploadImg"></span>
        </image-upload>
    </div>
</template>

<script>
    
    window.UMEDITOR_HOME_URL = process.env.NODE_ENV ==='development' ? '../../static/utf8-php/': '/manage/static/utf8-php/'
    require('../../static/utf8-php/umeditor.config.js');
    require('../../static/utf8-php/umeditor.min.js');
    import ImageUpload from './ImageUpload.vue';

    export default {
        name: "UE",
        props: {
            value: {
                default: ""
            },
            UEheight: {
                type: String,
                default: "height:400px"
            }
        },
        components: {
            ImageUpload,
        },
        data() {
            return {
                ue: '',
                editor: 'editor' + parseInt(Math.random() * 100),
                uedata: '',
                dialogVisible: false,
                isShow: true,
                picUrl: '',
                // 修复同时存在两个富文本编辑器时出现的问题
                randomId: 'randomId' + Math.random().toString(32).substring(2),
                uploadImg: 'uploadImg' + Math.random().toString(32).substring(2),
                accept: 'image/*'
            }
        },
        mounted() {
            this.ue = UM.getEditor(this.editor);
            this.getEditor();
        },
        methods: {
            // 保存
            submits() {
                this.uedata = UM.getEditor(this.editor).getContent();
                console.log(this.uedata);
                this.$emit('input', this.uedata)
            },
            //写入
            getEditor() {
                let self = this;
                this.ue.ready(() => {
                    this.ue.setContent(''+(this.value===null?'':this.value));
                    /*******************重写UEditor上传图片的方法***********************/
                    let dom = document.getElementById(this.randomId).getElementsByClassName("edui-btn-image")[0];
                    dom.addEventListener("click", () => {
                        self.accept = "image/*";
                        let timer = setTimeout(()=>{
                            clearTimeout(timer);
                            $("#"+ self.uploadImg).click();
                        }, 10)
                    });
                    /*********************重写视频上传****************************** */
                    let videoDom = document.getElementById(this.randomId).getElementsByClassName("edui-btn-video")[0];
                    videoDom.addEventListener("click", () => {
                        self.accept = "video/*";
                        let timer = setTimeout(()=>{
                            clearTimeout(timer);
                            $("#"+ self.uploadImg).click();
                        }, 10)
                    });
                    this.ue.addListener('blur', (editor) => {
                        this.submits();
                    });
                })
            },
            insertPic() {
                if(this.picUrl.indexOf('video')=== -1) {
                    this.ue.execCommand(`inserthtml`, `<img style="vertical-align:top;outline-width:0;max-width:100%" src="${this.picUrl}" />`);
                }else{
                    this.ue.execCommand(`inserthtml`, `<p><video controls webkit-playsinline='true' playsinline='true' poster="${this.picUrl+'&vframe/jpg/offset/2'}" style="width: 100%;height: auto;vertical-align:top;outline-width:0" src="${this.picUrl}"></video><br/>&nbsp;</p>`);
                }
                this.ue.focus();
                this.dialogVisible = false;
            }
        },
        // 销毁editor
        destroyed() {
            this.ue.destroy();
        },
        watch: {
            value(val, old) {
                this.ue.ready(() => {
                    this.ue.setContent(''+(val===null?'':val));
                    this.ue.focus(true);
                });
            },
            picUrl(val, newVal) {
                if (val !== newVal) {
                    this.insertPic();
                }
            }
        }
    }

</script>

<style lang="scss">
@import "../../static/utf8-php/themes/default/css/umeditor.min.css";
    .xk-um {
        line-height: 1.5;
        .edui-editor-body {
            padding: 5px 0;
        }
        .editor {
            position: relative;
            width: 100%;
            /* height: 400px; */
        }

        .edui-default .edui-box {
            height: 20px;
        }
        /* .edui-dialog-container {
            display: none;
        } */

        .submitBtn {
            background-color: red;
            margin-top: 116px;
        }
        img {
            max-width: 100%;
        }
    }
    
</style>
