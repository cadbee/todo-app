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
                        v-model="taskText"
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
                <ApolloMutation :mutation="require('../graphql/UpdateSubTask.gql')"
                                :variables="{input: {id: subTaskId, text: taskText, completed: completed}}"
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
        <ConfirmAlert ref="confirmSubTaskUpdateDialogue"/>
    </v-dialog>
</template>

<script>
import ConfirmAlert from "./ConfirmAlert.vue";

export default {
    name: "UpdateSubTaskDialog",
    components: {ConfirmAlert},
    data(){
        return {
            subTaskId: '',
            completed: undefined,
            opened: false,
            taskText: '',
            rules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        }
    },
    methods: {
        async onSubmit(mutate){
            const ok = await this.$refs.confirmSubTaskUpdateDialogue.show({
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
            this.taskText = opts.initialValue;
            this.subTaskId = opts.subTaskId;
            this.completed = opts.completed;
            this.opened = true;
        }
    }
}
</script>

<style scoped>

</style>
