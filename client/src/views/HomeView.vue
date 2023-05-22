<template>
    <v-container class="fill-height">
        <v-row
            align="center"
            justify="center"
        >
            <v-col class="text-center">
                <v-img
                    class="remove-bg"
                    src="../assets/nothing_here.gif"
                    alt="Nothing here image"
                    max-height="300px"
                    contain
                >
                    <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                            <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                            />
                        </v-row>
                    </template>
                </v-img>
                <h2 class="mb-3">There`s nothing here, yet.</h2>
                <v-btn
                    :color="buttonColor"
                    :to="{ name: 'projects', params: {projectName: 'Title'} }"
                    link
                >
                    Go to projects
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  computed: {
      buttonColor(){
          return this.$vuetify.theme.dark ? 'deep-purple darken-1' : 'deep-purple lighten-4';
      }
  }
}
</script>

<style scoped>
.remove-bg{
    mix-blend-mode: multiply;
}
</style>
