<template>
    <div class="xk-um">
        <div :id="editor" class="editor" :style="UEheight"></div>
        <image-upload v-if="isShow" :isShow.sync="isShow" v-model="picUrl" :more="false" v-show="hidden">
            <span style="display: none" id="uploadImg"></span>
        </image-upload>
    </div>
</template>

<script>

    // window.UMEDITOR_HOME_URL = process.env.NODE_ENV ==='development' ? '../../static/utf8-php/': '/manage/static/utf8-php/'
    // require('../../static/utf8-php/umeditor.config.js');
    // require('../../static/utf8-php/umeditor.min.js');

    import ImageUpload from './ImageUpload.vue';
    import '../../static/utf8-jsp/ueditor.config.js';
    import '../../static/utf8-jsp/ueditor.all.min.js';
    import '../../static/utf8-jsp/lang/zh-cn/zh-cn.js';
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
                picUrl: ''
            }
        },
        mounted() {
            this.ue = UE.getEditor(this.editor,{UEDITOR_HOME_URL:'static/utf8-jsp/'});
            this.getEditor(this.value);
        },
        methods: {
            // 保存
            submits() {
                this.uedata = UE.getEditor(this.editor).getContent();
                this.$emit('input', this.uedata)
            },

            removeClass(ele, cls){
                if (this.hasClass(ele, cls)) {
                    let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    ele.className = ele.className.replace(reg, ' ');
                }
            },
            hasClass(ele, cls){
                return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
            },
            addClass(ele, cls){
                if (!this.hasClass(ele, cls)) ele.className += " " + cls;
            },

            //写入
            getEditor() {
                let self = this;
                this.ue.ready(() => {
                    this.ue.setContent(this.value);
                    /*******************重写UEditor上传图片的方法***********************/
                    let dom = document.getElementsByClassName("edui-for-simpleupload")[0];
                    let firstChild = dom.firstChild;
                    this.ue.addListener('afterSelectionChange', () => {
                        this.removeClass(firstChild, "edui-state-disabled")
                    });
                    dom.setAttribute("onclick", '');
                    this.ue.addListener('blur', (editor) => {
                        this.submits();
                    });
                })
            },
            insertPic() {
                this.ue.execCommand(`inserthtml`, `<img src="${this.picUrl}" />`)
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
                    this.ue.setContent(val);
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
@import "../../static/utf8-jsp/themes/default/css/ueditor.min.css";
    .xk-um {
        line-height: 1.5;
        .edui-editor-body {
            padding: 5px 0;
        }
        .editor {
            position: relative;
            width: 100%;
        }

        .edui-default .edui-box {
            height: 20px;
        }
        .submitBtn {
            background-color: red;
            margin-top: 116px;
        }
    }

</style>
