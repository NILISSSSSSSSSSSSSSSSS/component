

/**
 * ͼƬѹ����Ĭ��ͬ����ѹ��
 * @param {Object} path
 *   pc�˴����·������Ϊ���·�����������ƶ����ϱ��봫���·��������ͼƬ����ľ���·��
 * @param {Object} obj
 *   obj ���� �� width�� height�� quality(0-1)
 * @param {Object} callback
 *   �ص�������һ��������base64���ַ�������
 */
export function gipImg(path, obj){
    return new Promise((resolve,reject) => {
        let img = new Image();
        img.src = path;
        img.onload = function(){
            let that = this;
            // Ĭ�ϰ�����ѹ��
            let w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            let quality = 0.7;  // Ĭ��ͼƬ����Ϊ0.7
            //����canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // �������Խڵ�
            let anw = document.createAttribute("width");
            anw.nodeValue = w;
            let anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // ͼ������
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // qualityֵԽС�������Ƴ���ͼ��Խģ��
            let base64 = canvas.toDataURL('image/jpeg', quality );
            // �ص���������base64��ֵ
            resolve(base64);
        }
    });
}

export function dataURLtoBlob(dataurl) {//��base64ת��Ϊblob
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

//input ���� multiple ������Ժ����ʵ�ֶ�ͼ
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

