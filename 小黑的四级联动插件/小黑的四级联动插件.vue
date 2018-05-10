

<template>
  <div>
    <template v-for="(val, key, index) in cityObj">
      <el-select v-model="cityObj[key].value"  @change="changeCity(key,cityObj[key].value)" placeholder="请选择">
        <el-option
          v-for="(item,index) in cityObj[key].arr"
          :key="item.name"
          :label="item.name"
          :value="index"
        >
        </el-option>
      </el-select>
    </template>
  </div>
</template>

<script>
  import dataJson from '../assets/region/data.json'

  export default {
    data() {
      return {
        cityObj:{
          province:{
            arr: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]
            ,value:''
          }
          ,city:{
            arr:[{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]
            ,value:''
          }
          ,county:{
            arr:[{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]
            ,value:''
          }
          ,street:{
            arr:[{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]
            ,value:''
          }
        }

        ,indexTypeObj: {
          province:0
          ,city:0
          ,county:0
          ,street:0
        }
      }
    }

    ,created() {
      this.getProvinceData();
    }

    ,methods: {
      changeCity(type,index) {
        this.indexTypeObj[type] = index;
        let methodObj = this.returnMap(type);
        this.upProvinceArr(methodObj.needUp);
        for ( let i = 0;i<methodObj.forArr.length;i++ ) {
          this[this.returnMap(methodObj.forArr[i]).method](this.indexTypeObj[type]);
        }
        let lastResultObj = this.judgeAllSelected();
        console.error('----',lastResultObj);  // $emit 给父组件
      }

      ,upProvinceArr(needUp) {
        let indexTypeObj = this.indexTypeObj;
        let cityObj = this.cityObj;
        for ( let key in indexTypeObj ) {
          if ( needUp[key] ) {
            indexTypeObj[key] = 0;
            cityObj[key].value = "";
          }
        }
        this.indexTypeObj = indexTypeObj;
        this.cityObj = cityObj;
      }

      ,returnMap(type) {
        let map = new Map([
          ['province',{
              method:'getProvinceData'
              ,forArr:['city','county','street']
              ,needUp:{city:true,county:true,street:true}
            }
          ]
          ,['city',{
              method:'getCityData'
              ,forArr:['county','street']
              ,needUp:{county:true,street:true}
            }
          ]
          ,['county',{
              method:'getCountyData'
              ,forArr:['street']
              ,needUp:{street:true}
            }
          ]
          ,['street',{
              method:'getStreetData'
              ,forArr:[]
              ,needUp:{}
            }
          ]
        ]);

        return map.get(type);
      }

      ,judgeAllSelected() {
        const needJudgeArr = ['province','city','county','street'];
        let [str,boolean] = ['',true];
        for ( let i = 0;i<needJudgeArr.length;i++ ) {
          str = str + this.cityObj[needJudgeArr[i]].value;
          if ( !this.cityObj[needJudgeArr[i]] || this.cityObj[needJudgeArr[i]].value === "" ) {
            boolean = false;
            break;
          }
        }
        return {
          boolean:boolean
          ,lastAllCityStr:str
        }
      }

      ,getProvinceData() {
        let province = [];
        for ( let i = 0;i<dataJson.length;i++ ) {
          province.push({code:dataJson[i].code,name:dataJson[i].name});
        }
        this.cityObj['province'].arr = province;
      }

      ,getCityData(index) {
        let city = [];
        let dataArr = dataJson[this.indexTypeObj['province']].childs;
        for ( let i = 0;i<dataArr.length;i++ ) {
          city.push({code:dataArr[i].code,name:dataArr[i].name});
        }
        this.cityObj['city'].arr = city;
      }

      ,getCountyData(index) {
        let city = [];
        let dataArr = dataJson[this.indexTypeObj['province']].childs[this.indexTypeObj['city']].childs;
        for ( let i = 0;i<dataArr.length;i++ ) {
          city.push({code:dataArr[i].code,name:dataArr[i].name});
        }
        this.cityObj['county'].arr = city;
      }

      ,getStreetData(index) {
        let city = [];
        let dataArr = dataJson[this.indexTypeObj['province']].childs[this.indexTypeObj['city']].childs[this.indexTypeObj['county']].childs;
        for ( let i = 0;i<dataArr.length;i++ ) {
          city.push({code:dataArr[i].code,name:dataArr[i].name});
        }
        this.cityObj['street'].arr = city;
      }
    }
  }
</script>
