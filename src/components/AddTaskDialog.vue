<template>
    <v-layout>
    <v-dialog :value="opened"
              width="500"
              @click:outside="closeDialog"
              @keydown.esc="closeDialog"
    >
        <v-card>
            <v-card-title class="text-h5">
                Enter task name
            </v-card-title>
<!--            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>-->
            <v-card-text>
                <v-text-field
                  label="Task description"
                  :rules="rules"
                  v-model="newTask"
                  hide-details="auto"
                  flat
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="text-capitalize"
                        color="green darken-1"
                        text
                        @click="closeDialog"
                >
                    Cancel
                </v-btn>
                <ApolloMutation :mutation="require('../graphql/AddTask.gql')"
                                :variables="{input: {name: newTask}}"
                                @done="newTask = ''"
                >
                    <template v-slot="{ mutate }">
                        <v-btn class="text-capitalize"
                          color="green darken-1"
                          text
                          @click="onSubmit(mutate)"
                        >
                            Submit
                        </v-btn>
                    </template>

                </ApolloMutation>
            </v-card-actions>
        </v-card>
        <ConfirmAlert ref="confirmDialogue"
        >
        </ConfirmAlert>
    </v-dialog>
    <v-snackbar color="green" v-model="alert" :timeout="100000" min-width="100px" top right>
        <v-icon class="mr-2">mdi-check</v-icon>
        Task added successfully!
        <template v-slot:action>
            <v-btn icon>
                <v-icon>mdi-arrow-u-left-top</v-icon>
            </v-btn>
            <v-btn icon @click="alert = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
    </v-layout>
</template>

<script>
import ConfirmAlert from "@/components/ConfirmAlert.vue";

export default {
    name: "AddTaskDialog",
    components: {ConfirmAlert},
    props: ['opened'],
    data(){
        return {
            alert: false,
            newTask: '',
            rules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        }
    },
    methods: {
        async onSubmit(mutate){
            const ok = await this.$refs.confirmDialogue.show({
                message: "Confirm Adding?"
            });
            if(ok){
                mutate();
                this.alert = true;
                this.$emit('update:opened', false);
            }
        },
        closeDialog(){
            this.$emit('update:opened', false);
        },
    }
}
</script>

<style scoped>

</style>
