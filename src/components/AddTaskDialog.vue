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
    </v-layout>
</template>

<script>
import ConfirmAlert from "@/components/ConfirmAlert.vue";
import { mapActions } from "vuex";

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
        ...mapActions('alert', {
            hideAlert: "hideAlert",
            showAlert: "showAlert"
        }),
        async onSubmit(mutate){
            await this.hideAlert();
            const ok = await this.$refs.confirmDialogue.show({
                message: "Confirm adding?"
            });
            if(ok){
                mutate();
                await this.showAlert({message: 'Task added successfully!'});
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
