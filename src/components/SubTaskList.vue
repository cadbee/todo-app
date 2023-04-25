<template>
    <ApolloQuery :query="require('../graphql/SubTasks.gql')"
                 :variables="{taskID: taskId}"
    >
        <ApolloSubscribeToMore :document="require('../graphql/SubTaskAdded.gql')"
                               :update-query="onSubTaskAdded"/>
        <ApolloSubscribeToMore :document="require('../graphql/SubTaskDeleted.gql')"
                               :update-query="onSubTaskDeletedTest"/>
        <template v-slot="{ result: { loading, error, data } }">
            <!--Loading-->
            <div v-if="loading" class="loading apollo">Loading...</div>
            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>
            <!-- Result -->
            <div v-else-if="data">
                <v-list class="pa-0"
                        flat
                >
                    <v-list-item-group
                            multiple
                    >
                        <v-list-item
                                v-for="task in filteredData(data.subTasks)"
                                :key="task.id"
                        >
                            <v-list-item-action>
                                <ApolloMutation :mutation="require('../graphql/UpdateSubTask.gql')"
                                                :variables="{input: {id: task.id, text: task.text, completed: !task.completed}}">
                                    <template v-slot="{ mutate, isLoading }">
                                        <v-checkbox
                                                :disabled="isLoading"
                                                v-model="task.completed"
                                                color="success"
                                                @click="mutate()"
                                                on-icon="mdi-radiobox-marked"
                                                off-icon="mdi-radiobox-blank"
                                        >

                                        </v-checkbox>
                                    </template>
                                </ApolloMutation>
                            </v-list-item-action>
                            <v-list-item-content :class="[completedSubTaskClass(task.completed)]">
                                <v-list-item-title>{{ task.text }}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon class="ma-1">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                  @click="openUpdateDialog(task)"
                                                  v-bind="attrs"
                                                  v-on="on"
                                                  icon
                                                >
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Update</span>
                                        </v-tooltip>
                                <ApolloMutation :mutation="require('../graphql/DeleteSubTask.gql')"
                                                :variables="{ id: task.id }"

                                >
                                    <template v-slot="{ mutate, isLoading }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                        :disabled="isLoading"
                                                        @click="onSubmit(mutate)"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon
                                                >
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Delete</span>
                                        </v-tooltip>
                                    </template>
                                </ApolloMutation>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list-item-group>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>
                            <v-text-field :color="disabledColor"
                                    label="Task description"
                                    v-model="newSubTask"
                                    hide-details="auto"
                                    flat
                            >
                                <template v-slot:append>
                                    <ApolloMutation :mutation="require('../graphql/AddSubTask.gql')"
                                                    :variables="{ input: {taskID: taskId, text: newSubTask} }"
                                                    @done="newSubTask = ''"
                                    >
                                        <template v-slot="{ mutate }">
                                                <v-icon @click="mutate()" :disabled="!inputValid" :color="disabledColor">mdi-plus</v-icon>
                                        </template>
                                    </ApolloMutation>
                                </template>
                            </v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <ConfirmAlert ref="confirmDeletingSubTaskAlert"></ConfirmAlert>
                <UpdateSubTaskDialog ref="updateSubTaskDialogue"></UpdateSubTaskDialog>
            </div>
        </template>
    </ApolloQuery>
</template>

<script>
// import gql from 'graphql-tag'
// import { useMutation } from '@vue/apollo-composable'

import UpdateSubTaskDialog from "@/components/UpdateSubTaskDialog.vue";
import ConfirmAlert from "@/components/ConfirmAlert.vue";

export default {
    name: "SubTask",
    components: {ConfirmAlert, UpdateSubTaskDialog},
    props: {
        taskId: String,
        filterValue: String
    },
    data() {
        return {
            newSubTask: '',
        }
    },
    methods: {
        async onSubmit(mutate){
            const ok = await this.$refs.confirmDeletingSubTaskAlert.show({
                message: "Are you sure?"
            });
            if(ok){
                mutate();
            }
        },
        onSubTaskDeleted(store, {data: {deleteSubTask}}) {
            const query = {
                query: require("../graphql/SubTasks.gql"),
                variables: {
                    taskID: this.taskId
                },
            }
            let data = store.readQuery(query);
            data.subTasks = data.subTasks.filter((subTask) => subTask.id !== deleteSubTask.id);
            store.writeQuery({
                ...query,
                data,
            })
        },
        filteredData(data){
            if(this.filterValue === 'All'){
                return data;
            } else if (this.filterValue === 'Complete'){
                return data.filter((task) => task.completed === true);
            } else{
                return data.filter((task)=> task.completed === false);
            }
        },
        openUpdateDialog(task) {
            this.$refs.updateSubTaskDialogue.openDialog({
                initialValue: task.text,
                subTaskId: task.id,
                completed: task.completed
            })
        },
        onSubTaskAdded(previousResult, {subscriptionData}){
            return {
                subTasks: [...previousResult.subTasks, subscriptionData.data.subTaskAdded],
            }
        },
        onSubTaskDeletedTest(previousResult, {subscriptionData}){
            previousResult.subTasks = previousResult.subTasks.filter((subTask) => subTask.id !== subscriptionData.data.subTaskDeleted.id);
            return {
                subTasks: [...previousResult.subTasks],
            }
        }
    },
    computed: {
        inputValid() {
            return !!this.newSubTask && this.newSubTask.length >= 3;
        },
        completedSubTaskClass: function () {
            return function (isChecked) {
                return isChecked ? 'text-decoration-line-through' : '';
            };
        },
        disabledColor(){
            return !this.inputValid ? 'grey' : 'green';
        }
    }
}
</script>

<style scoped>
.v-list-item{
    height: 48px;
}
</style>
