<template>
    <div class="xk-image-upload">
        <el-row type="flex" justify="start">
            <el-col v-if="!clip">
                <el-upload :limit="uploadNumber" v-if="more" :action="uploadPath" list-type="picture-card"
                    :before-upload="beforeUpload" :data="uploadParam" :on-success="handleAvatarSuccess"
                    :on-error="handleError" :on-remove="handleRemove" :http-request="autoUpload"
                    :on-progress="uploadVideoProcess" :accept="accept" :file-list="fileList" multiple
                    :disabled="disabledPub">
                    <i class="el-icon-plus"></i>
                    <!--video/*-->
                    <slot></slot>
                    <!-- <el-progress type="circle" :percentage="uploadPercent"></el-progress> -->
                </el-upload>
                <el-upload :limit="uploadNumber" v-else class="avatar-uploader" :action="uploadPath"
                    :show-file-list="false" :data="uploadParam" :http-request="autoUpload" :auto-upload="true"
                    :on-success="handleAvatarSuccess" :on-error="handleError" :on-remove="handleRemove"
                    :on-progress="uploadVideoProcess" :accept="accept" :before-upload="beforeUpload"
                    :disabled="disabledPub">
                    <slot></slot>
                </el-upload>
            </el-col>
            <el-col v-else>
                <slot></slot>
                <el-upload :limit="uploadNumber" class="avatar-uploader uploader-cover" :auto-upload="false"
                    :show-file-list="false" :on-error="handleError" :on-change="beforeCoverUpload"
                    :disabled="disabledPub">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar-cover">
                    <i v-else class="el-icon-plus avatar-uploader-icon avatar-cover"></i>
                </el-upload>
                <el-dialog title="图片裁剪" :visible.sync="dialogTableVisible" width="1000px">
                    <upload-image :optionsConfig="optionsConfig" @on-success="uploadSuccess" v-if="dialogTableVisible">
                    </upload-image>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { getQiNiuToken, getUUid } from '../util/publicMehotds'
    import { uploadPath, previewPath } from '../util/publicParams.js'
    import UploadImage from './clipImage/clipImage.vue'

    export default {
        name: 'imageupload',
        components: {
            UploadImage
        },
        props: {
            accept: {     //上传图片还是视频
                type: String,
                default: 'image/*'
            },
            value: {
                type: [String | Array],
                default: []
            },
            disabledPub: {
                type: Boolean,
                default: false
            },
            more: {
                type: Boolean,
                default: false
            },
            checkFun: {
                type: Function,
                default: () => {
                    return true;
                }
            },
            clip: {
                type: Boolean,
                default: false
            },
            optionsConfig: {
                type: Object,
                default: {}
            },
            uploadType: {  //图片上传类型   0：任何类型   1：用户头像
                type: Number,
                default: 0
            },
            uploadNumber: {   //图片允许上传张数
                type: [String | Number],
                default: 8,
            },
            typeText:{
                default:"图片"
            }
        },
        data() {
            return {
                disabledInfo: false,
                uploadPath,
                uploadParam: {
                    token: "",
                },
                imageUrl: '',
                dialogTableVisible: false,
                fileList: [],
                isCheck: true,
                uploadPercent: 0
            }
        },
        watch: {
            fileList(arr) {
                if (this.uploadNumber <= arr.length && this.more) {
                    let uint='';
                    this.typeText=='图片' ?  uint='张' :  uint='个';
                    this.$message.error(this.typeText+"最多上传" + this.uploadNumber +uint);
                    this.disabledInfo = true;
                } else {
                    this.disabledInfo = false;
                }
            },
            value(val, old) {
                if (this.uploadNumber <= val.length && this.more) {
                    // this.$message.error("图片最多上传" + this.uploadNumber + "张");
                    this.disabledInfo = true;
                } else {
                    this.disabledInfo = false;
                }
                this.handleList(val);
            }
        },
        created() {
            this.handleList(this.value)
        },
        methods: {
            autoUpload(files) {
                let key;
                if (this.uploadType === 1) {   //上传用户头像指定上传目录
                    key = "avatar/" + getUUid();
                    this.uploadParam.key = key
                }
                this.uploadFiles(files.file, key ? key : getUUid(), files.file.name, files.file.type);
            },
            uploadFiles(file, key, fname, type) {
                let form = new FormData();
                form.append('file', file);
                form.append('token', this.uploadParam.token);
                form.append('key', key);
                form.append('fname', fname);

                axios.post(uploadPath, form, {
                    onUploadProgress: res => {
                        let obj = {
                            status: true,
                            percentage: (res.loaded * 100 / res.total).toFixed(2)
                        }
                        this.$emit("percentage", obj)
                    }
                })
                    .then(res => {
                        this.imageUrl = []
                        this.$emit("percentage", { status: false, url: previewPath + res.data.key });
                        if (this.fileList) {
                            this.fileList.forEach(item => {
                                this.imageUrl.push(item.url);
                            })
                        }
                        this.fileList = ""
                        this.more
                            ? this.imageUrl.push(previewPath + res.data.key + '?type=' + type)
                            : this.imageUrl = previewPath + res.data.key + '?type=' + type;
                        this.updateURL();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
            },
            // uploadVideoProcess(event, file, fileList) {
            //     let obj = {
            //         status: true,
            //         percentage: event.percent.toFixed(2)
            //     };
            //     this.$emit("percentage", obj)
            // },
            async beforeUpload(file) {
                if (this.disabledInfo) {
                    // this.$message.error("图片最多上传" + this.uploadNumber + "张");
                    this.fileList = this.fileList.splice(0, this.uploadNumber);
                    return false;
                }
                if (!this.checkFun(file)) {
                    this.isCheck = false;
                    return false;
                }

                //获取七牛token
                await getQiNiuToken().then(res => {
                    this.uploadParam.token = res;
                });
                //console.log(this.uploadParam);
                if (this.uploadType === 1) {   //上传用户头像指定上传目录
                    let key = "avatar/" + getUUid();
                    this.uploadParam.key = key
                }
            },
            // handleAvatarSuccess(response, file, fileList) {
            //     this.$emit("percentage", { status: false, url: previewPath + response.key });
            //     let newUrls = [];
            //     for (let i = 0, len = fileList.length; i < len; i++) {
            //         if (fileList[i].response) {
            //             newUrls[i] = previewPath + fileList[i].response.key + '?type=' + file.raw.type
            //         } else {
            //             newUrls[i] = fileList[i].url
            //         }
            //     }
            //     this.imageUrl = newUrls;
            //     this.more
            //         ? this.imageUrl = newUrls
            //         : this.imageUrl = previewPath + response.key + '?type=' + file.raw.type;
            //     this.updateURL();
            // },
            handleError(err, file, fileList) {
                //七牛token过期重新获取七牛token
                if (this.isCheck) {
                    getQiNiuToken();
                    this.$message.error("七牛token过期，请重新上传");
                }
            },
            handleRemove(file, fileList) {
                let newUrls = [];
                for (let i = 0, len = fileList.length; i < len; i++) {
                    if (fileList[i].response) {
                        newUrls[i] = previewPath + fileList[i].response.key
                    } else {
                        newUrls[i] = fileList[i].url
                    }
                }
                this.imageUrl = newUrls;
                this.updateURL();
            },
            //更新父节点的值
            updateURL() {
                this.$emit("input", this.imageUrl)
            },
            beforeCoverUpload(file) {
                let dataURL = window.URL.createObjectURL(file.raw);
                this.tmpUrl = dataURL
                this.optionsConfig.imgUrl = dataURL
                this.dialogTableVisible = true
            },
            uploadSuccess(options) {
                this.imageUrl = options.url;
                this.dialogTableVisible = false;
                this.updateURL()
            },
            handleList(val) {
                this.fileList = [];
                if (val !== null && typeof val === 'object' && val.length > 0) {
                    this.fileList = [];
                    for (let i = 0, len = val.length; i < len; i++) {
                        let obj = {
                            url: val[i]
                        }
                        this.fileList.push(obj)
                    }
                }
            }
            // beforeUploadVideo(file) {
            //     const isLt10M = file.size / 1024 / 1024  < 10;
            //     if(['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
            //         this.$message.error('请上传正确的视频格式');
            //         return false;
            //     }
            //     if(!isLt10M) {
            //         this.$message.error('上传视频大小不能超过10MB哦!');
            //         return false;
            //     }
            // }
        },
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        background: #fff;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 146px;
        height: 146px;
        line-height: 146px;
        text-align: center;
    }

    .avatar {
        width: 146px;
        height: 146px;
        display: block;
    }
</style>
