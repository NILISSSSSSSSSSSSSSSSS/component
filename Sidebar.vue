<template>
    <div class="sh-menu">
        <el-menu :collapse="collapse" :background-color="backColor" :text-color="textColor" mode="vertical"
                 :active-text-color="activeColor" :default-active="onRoutes" class="el-menu-vertical-demo"
                 unique-opened
                 router
        >
            <template v-for="(item,index) in items">
                <template v-if="item.subs">
                    <el-submenu v-if="showMenu(item)" :index="item.index" :key="item.index">
                        <!--{{item.icon}}-->
                        <template slot="title"><i class="icon-menu" :class="item.icon"></i> <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="(subItem,i) in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(menu,index) in subItem.subs" :key="index" :index="menu.index">
                                    {{menu.title}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item :class="className=== subItem.index+index+i? 'is-active is-actived': ''"
                                          @click="refresh(subItem.index,index,i, item.index)" v-else-if="subItem.show"
                                          :key="i"
                                          :index="subItem.index">
                                {{subItem.title}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        inject: ['reload'],
        props: {
            collapse: {
                type: Boolean,
                default: false
            },
            // routeItem: {
            //     type: Object,
            //     required: true
            // }
        },
        data() {
            return {
                isCollapse: false,
                oldIndex: "",
                backColor: "#002448 ",
                textColor: "#ffffff",
                activeColor: "#ffffff",
                className: sessionStorage.getItem('className') ? sessionStorage.getItem('className') : "",
                clickIndex: sessionStorage.getItem('subIndex') ? sessionStorage.getItem('subIndex') : '',
                items: require('../menu/index').default
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        methods: {
            showMenu(item) {
                return item.subs.some((value) => (value.show === true))
            },
            refresh(path, preIndex, index, subIndex) {
                this.className = path + preIndex + index;
                sessionStorage.setItem('className', this.className);
                sessionStorage.setItem('subIndex', subIndex);
                this.oldIndex = this.$route.path;
                if (this.oldIndex === "/" + path) {
                    this.reload();
                }
            }
        },
        mounted() {
            /* this.oldIndex = this.$route.path;
             if (this.$route.path === "/main") {
                 let path = "";
                 this.items.some((value => {
                     return value.subs.some(item => {
                         if (item.show) {
                             path = item.index;
                             return true;
                         }
                     })
                 }));
                 this.$router.push({path: path});
             }*/
        },
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        min-height: 400px;
        /*width: 100%;*/
    }
</style>
