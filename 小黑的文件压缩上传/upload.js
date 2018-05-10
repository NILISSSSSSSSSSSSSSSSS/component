

/**
 * 图片压缩，默认同比例压缩
 * @param {Object} path
 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
 * @param {Object} obj
 *   obj 对象 有 width， height， quality(0-1)
 * @param {Object} callback
 *   回调函数有一个参数，base64的字符串数据
 */
export function gipImg(path, obj){
    return new Promise((resolve,reject) => {
        let img = new Image();
        img.src = path;
        img.onload = function(){
            let that = this;
            // 默认按比例压缩
            let w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            let quality = 0.7;  // 默认图片质量为0.7
            //生成canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // 创建属性节点
            let anw = document.createAttribute("width");
            anw.nodeValue = w;
            let anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            let base64 = canvas.toDataURL('image/jpeg', quality );
            // 回调函数返回base64的值
            resolve(base64);
        }
    });
}

export function dataURLtoBlob(dataurl) {//将base64转换为blob
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function getImgUrl(filesInfo) {
    return window.URL.createObjectURL(filesInfo);
}

//input 加上 multiple 这个属性后就能实现多图
export function moreImgUpload(fileList,gipConfigObj) {
    return new Promise((resolve,reject) => {
        let arr = [];
        for( let i = 0;i<fileList.length;i++ ) {
            arr.push(gipImg(getImgUrl(fileList[i]),gipConfigObj));
        }
        Promise.all(arr)
            .then(res => {
                console.warn('----moreImgUpload----',res);
                let blobArr = [];
                for ( let j = 0;j<res.length;j++ ) {
                    blobArr.push(dataURLtoBlob(res[j]));
                    // console.warn('----base -> file ----',dataURLtoBlob(res[j]));
                }
                resolve({
                    blobArr:blobArr
                    ,showImgArr:res
                });
            })
            .catch(err => {
                console.error('----moreImgUpload----',err);
            });
    });
}

