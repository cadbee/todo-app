<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center">
            <v-col class="text-center">
                <v-img src="../assets/nothing_here.gif" alt="Nothing here image" max-height="300px" contain>
                    <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                            <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                            ></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
                <h2 class="mb-3">There`s nothing here, yet.</h2>
                <v-btn color="deep-purple lighten-5" :to="{ name: 'projects', params: {projectName: 'Title'} }" link>Go to projects</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  export default {
    name: 'HomeView',
  }
</script>
