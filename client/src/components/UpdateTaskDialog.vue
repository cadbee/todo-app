<template>
    <v-dialog v-model="opened"
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
                        v-model="taskName"
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
                <ApolloMutation :mutation="require('../graphql/UpdateMainTask.gql')"
                                :variables="{input: {id: taskId, name: taskName}}"
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
        <ConfirmAlert ref="confirmUpdateDialogue"/>
    </v-dialog>
</template>

<script>
import ConfirmAlert from "./ConfirmAlert.vue";

export default {
    name: "UpdateTaskDialog",
    components: {ConfirmAlert},
    data(){
        return {
            taskId: '',
            opened: false,
            taskName: '',
            rules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        }
    },
    methods: {
        async onSubmit(mutate){
            const ok = await this.$refs.confirmUpdateDialogue.show({
                message: "Confirm update?"
            });
            if(ok){
                mutate();
                this.closeDialog();
            }
        },
        closeDialog(){
            this.opened = false;
        },
        openDialog(opts={}){
            this.taskName = opts.initialValue;
            this.taskId = opts.taskId;
            this.opened = true;
        }
    }
}
</script>

<style scoped>

</style>
