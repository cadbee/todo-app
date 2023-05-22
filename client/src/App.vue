<template>
    <v-app>
        <v-app-bar
            app
            clipped-left
        >
            <v-app-bar-nav-icon @click="onDrawerToggle"/>
            <v-app-bar-title>TODO App</v-app-bar-title>
            <v-spacer/>
            <v-switch
                v-model="$vuetify.theme.dark"
                inset
                prepend-icon="mdi-theme-light-dark"
                hide-details="true"
            />
        </v-app-bar>
        <AppDrawer :is-toggled.sync="drawerToggled"/>

        <v-main>
            <v-container
                class="fill-height align-content-start"
                fluid
            >
                <router-view/>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>

import AppDrawer from "./components/AppDrawer.vue";

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
/*Disable Scroll Bar in full-page desktop app*/
html {
    overflow-y: auto;
}

.v-alert {
    position: fixed !important;
    right: 10px;
    top: 4px;
    z-index: 999;
}
</style>
