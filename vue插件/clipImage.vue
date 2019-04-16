<template>
    <div class="clip-image">
        <div class="img-box">
            <img id="element_id" :src="optionsConfig.imgUrl" crossorigin="anonymous" alt="">
        </div>
        <!-- <div>
            <el-row>
                <el-col :span="5"><el-tag type="info">裁剪比例修改</el-tag></el-col>
                <el-col :span="8">宽：<el-input size="small" v-model="wide"></el-input></el-col>
                <el-col :span="8">高：<el-input size="small" v-model="high"></el-input></el-col>
                <el-col :span="3"><el-button type="primary" size="small" @click="updateAspectRatio">确定</el-button></el-col>
            </el-row>
        </div> -->
        <div class="config-btn">
            <el-button type="success" @click="privewImage();">预览</el-button>
            <el-button type="primary" @click="uploadImg">上传</el-button>
        </div>
        <el-dialog :visible.sync="showClipImage" append-to-body title="图片预览" width="600px">
            <div class="img-prview">
                <img :src="prviewImgUrl" alt="图片预览" id="test">
            </div>
        </el-dialog>
        <!-- 缓存裁剪图片 -->
        <canvas id="canvas3" style="display: none"></canvas>
    </div>
</template>
<script>
    import {getQiNiuToken} from '../../util/publicMehotds.js'
    import { uploadPath, previewPath } from '../../util/publicParams.js'
    export default {
        data() {
            return {
                imgData:null,
                showClipImage: false,
                prviewImgUrl: null,
                mustCut: null,
                wide: 1,
                high: 1,
                jCrop: ''
            }
        },
        methods: {
            privewImage() {
                if(this.imgData || !this.mustCut){
                    this.prviewImgUrl = this.cutPic();
                    this.showClipImage = true;
                }else{
                    this.$message({
                        message: '请在图中画出裁剪区域',
                        type: 'warning'
                    });
                }
            },
            cutPic() {
                let canvas1 = $(".jcrop-active canvas")[0];
                let ctx1 = canvas1.getContext("2d")
                if(!this.mustCut && !this.imgData) {
                    return canvas1.toDataURL("image/png");
                }
                let canvas = document.querySelector("#canvas3")
                let ctx = canvas.getContext("2d")
                //分辨率过高的图片，计算放大倍数
                let scaleMultiple = $("#element_id").width() / $(".jcrop-active canvas").width();
                let dataImg = ctx1.getImageData(this.imgData.x* scaleMultiple, this.imgData.y* scaleMultiple, this.imgData.w* scaleMultiple, this.imgData.h* scaleMultiple)
                canvas.width = this.imgData.w * scaleMultiple
                canvas.height = this.imgData.h * scaleMultiple
                ctx.putImageData(dataImg, 0, 0)
                
                return canvas.toDataURL("image/png");
            },
            async uploadImg() {
                if(this.imgData || !this.mustCut){
                    this.prviewImgUrl = this.cutPic();
                    let qiniu_token = await getQiNiuToken();
                    this.putb64(qiniu_token, res=> {
                        this.$emit('on-success', {
                            url: res,
                            anim: this.optionsConfig.anim
                        })
                    });
                }else{
                    this.$message({
                        message: '当前图片不符合标准，请裁剪图片并上传',
                        type: 'warning'
                    });
                }
            },
            async putb64(qiniu_token, call) {
                let pic = this.prviewImgUrl.split(',')[1];
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange=function(){
                    if (xhr.readyState==4) {
                        call(previewPath+JSON.parse(xhr.responseText).hash)
                    }
                }
                xhr.open("POST", uploadPath+"putb64/-1", true);
                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                xhr.setRequestHeader("Authorization", "UpToken "+qiniu_token);
                xhr.send(pic);
            },
            initJcrop() {
                let self = this;
                this.$nextTick(()=> {
                    $('#element_id').Jcrop({
                        allowSelect: true,
                        aspectRatio: self.optionsConfig.aspectRatio,
                        allowResize: true,
                        onChange: function(e){
                            if(parseInt(e.w) >0 ){
                                self.imgData = e;
                            }
                        },
                        onRelease: function() {
                            self.imgData = null;
                        }
                    }, function() {
                        self.jCrop = this;
                        //初始化，判断当前图片是否必须进行裁剪
                        self.mustCut = ($("#element_id").width() / $("#element_id").height()) / self.optionsConfig.aspectRatio != 1? true: false;
                    })
                })
            },
            //自定义修改比例
            // updateAspectRatio() {
            //     this.jCrop.destroy()
            //     this.initJcrop();
            // }
        },
        mounted() {
            this.initJcrop();
        },
        props: {
            optionsConfig: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .clip-image {
        width: 700px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
        align-items: center;
        .img-box{
            height: 400px;
            font-size: 0;
            overflow: auto;
        }
        .config-btn{
            text-align: center;
            margin-top: 20px;
        }
        .img-prview{
            text-align: center;
            font-size: 0;
            width: 560px;
        }
        .jcrop-active {
            max-width: 700px!important;
            height: auto!important;
        }
    }
</style>
<style>
    .clip-image .el-row .el-input {
        width: 50%;
    }
    .jcrop-active {
        max-width: 700px!important;
        height: auto!important;
    }
    .img-prview img{
        max-width: 560px!important;
    }
</style>

