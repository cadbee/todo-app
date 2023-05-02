<template>
    <v-snackbar color="green" :value="visible" :timeout="timeout"  min-width="100px" top right>
        <v-icon class="mr-2">mdi-check</v-icon>
        {{ message }}
        <template v-slot:action>
            <ApolloMutation :mutation="require('../graphql/UndoLastChange.gql')">
                <template v-slot="{ mutate, isLoading }">
                    <v-btn :disabled="isLoading"
                           @click="onUndo(mutate)"
                           icon>
                        <v-icon>mdi-arrow-u-left-top</v-icon>
                    </v-btn>
                </template>
            </ApolloMutation>
            <v-btn icon @click="hideAlert()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    name: "SuccessAlert",
    computed: {
        ...mapGetters('alert', {message: 'alertMessage', visible: 'isVisible', timeout: 'timeoutValue'})
    },
    methods: {
        ...mapActions('alert', {hideAlert: 'hideAlert'}),
        onUndo(mutate){
            mutate();
            this.hideAlert();
        }
    }
}
</script>

<style scoped>

</style>
