<template>
    <v-app>
        <v-app-bar app clipped-left color="white" >
            <v-app-bar-nav-icon @click="onDrawerToggle"></v-app-bar-nav-icon>
            <v-app-bar-title>TODO App</v-app-bar-title>
        </v-app-bar>
        <AppDrawer :is-toggled.sync="drawerToggled"></AppDrawer>
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>

                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>

<!--        <v-footer app>-->
<!--            &lt;!&ndash; &ndash;&gt;-->
<!--        </v-footer>-->
    </v-app>
</template>

<script>

import AppDrawer from "@/components/AppDrawer.vue";

export default {
    name: 'App',
    components: {AppDrawer},
    data: () => ({
        drawerToggled: true,
    }),
    methods: {
        onDrawerToggle(){
            this.drawerToggled = !this.drawerToggled;
        }
    }
};
</script>

<style>
.v-alert {
    position: fixed !important;
    right: 10px;
    top: 4px;
    z-index: 999;
}
</style>
