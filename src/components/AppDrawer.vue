<template>
    <v-navigation-drawer app
                         clipped
                         fixed
                         mobile-breakpoint="960"
                         :model-value="true"
                         :value="isToggled"
                          @input="onToggle">
        <v-list nav>
            <v-list-item
                    to="/"
                    link>
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
                    to="/about"
                    link>
                <v-list-item-icon>
                    <v-icon>mdi-information-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>About</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-group
                    :value="true"
                    no-action>
                <template v-slot:activator>
                    <v-list-item-icon>
                        <v-icon>mdi-sitemap</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Projects</v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item
                        class="pl-5"
                        :to="{name: 'projects', params: {projectName: 'Title'}}"
                        link>
                    <v-list-item-icon>
                        <v-icon color="green">mdi-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="'Title'"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                        <span>1/3</span>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "AppDrawer",
    props: ['isToggled'],
    methods:{
      onToggle(value){
          this.$emit('update:isToggled', value);
      }
    }
}
</script>

<style scoped>

</style>
