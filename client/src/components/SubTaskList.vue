<template>
    <ApolloQuery
        :query="require('../graphql/SubTasks.gql')"
        :variables="{taskID: taskId}"
        :prefetch="true"
    >
        <ApolloSubscribeToMore
            :document="require('../graphql/SubTaskAdded.gql')"
            :update-query="onSubTaskAdded"
        />
        <ApolloSubscribeToMore
            :document="require('../graphql/SubTaskDeleted.gql')"
            :update-query="onSubTaskDeleted"
        />
        <template v-slot="{ result: { loading, error, data } }">
            <!--Loading-->
            <div
                class="loading apollo"
                v-if="loading"
            >
                Loading...
            </div>
            <!-- Error -->
            <div
                class="error apollo"
                v-else-if="error"
            >
                An error occurred
            </div>
            <!-- Result -->
            <div v-else-if="data">
                <v-list
                    class="pa-0"
                    flat
                >
                    <v-list-item-group
                        multiple
                    >
                        <transition-group
                            name="custom-classes-transition"
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                            :duration="{enter: 500, leave: 500}"
                            appear
                        >
                        <v-list-item
                            v-for="task in filteredData(data.subTasks)"
                            :key="task.id"
                        >
                            <v-list-item-action>
                                <ApolloMutation
                                    :mutation="require('../graphql/UpdateSubTask.gql')"
                                    :variables="{input: {id: task.id, text: task.text, completed: !task.completed}}"
                                >
                                    <template v-slot="{ mutate, isLoading }">
                                        <v-checkbox
                                            :disabled="isLoading"
                                            v-model="task.completed"
                                            color="success"
                                            @click="mutate()"
                                            on-icon="mdi-radiobox-marked"
                                            off-icon="mdi-radiobox-blank"
                                        />
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
                                <ApolloMutation
                                    :mutation="require('../graphql/DeleteSubTask.gql')"
                                    :variables="{ id: task.id }"
                                >
                                    <template v-slot="{ mutate, isLoading }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    :disabled="isLoading"
                                                    @click="onSubmit(mutate, 'SubTask deleted successfully!')"
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
                        </transition-group>
                    </v-list-item-group>
                    <v-divider/>
                    <transition
                        name="custom-classes-transition"
                        enter-active-class="animated fadeIn"
                        appear
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-text-field
                                    :color="inputStateColor"
                                    label="Task description"
                                    v-model="newSubTask"
                                    hide-details="auto"
                                    flat
                                >
                                    <template v-slot:append>
                                        <ApolloMutation
                                            :mutation="require('../graphql/AddSubTask.gql')"
                                            :variables="{ input: {taskID: taskId, text: newSubTask} }"
                                            @done="newSubTask = ''"
                                        >
                                            <template v-slot="{ mutate }">
                                                    <v-icon
                                                        @click="onSubmit(mutate, 'SubTask added successfully!')"
                                                        :disabled="!isInputValid"
                                                        :color="inputStateColor"
                                                    >
                                                        mdi-plus
                                                    </v-icon>
                                            </template>
                                        </ApolloMutation>
                                    </template>
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </transition>
                </v-list>
                <ConfirmAlert ref="confirmDeletingSubTaskAlert"/>
                <UpdateDialog
                    ref="updateSubTaskDialogue"
                    field-to-update="text"
                    :mutation="require('../graphql/UpdateSubTaskText.gql')"
                />
            </div>
        </template>
    </ApolloQuery>
</template>

<script>
import ConfirmAlert from "./ConfirmAlert.vue";
import UpdateDialog from "@/components/UpdateDialog.vue";

import { mapActions } from "vuex";
export default {
    name: "SubTask",
    components: {UpdateDialog, ConfirmAlert},
    props: {
        taskId: {
            type: String,
            required: true
        },
        filterValue: {
            type: String,
            required: false,
            default: 'All'
        }
    },
    data() {
        return {
            newSubTask: '',
        }
    },
    methods: {
        ...mapActions('alert', {
            hideAlert: "hideAlert",
            showAlert: "showAlert"
        }),
        async onSubmit(mutate, alertMessage){
            await this.hideAlert();
            const isConfirmed = await this.$refs.confirmDeletingSubTaskAlert.show({
                message: "Are you sure?"
            });
            if (isConfirmed){
                mutate();
                await this.showAlert({message: alertMessage});
            }
        },
        filteredData(data){
            if (this.filterValue === 'All'){
                return data;
            } else if (this.filterValue === 'Complete'){
                return data.filter((task) => task.completed === true);
            } else {
                return data.filter((task)=> task.completed === false);
            }
        },
        openUpdateDialog(task) {
            this.$refs.updateSubTaskDialogue.openDialog({
                initialValue: task.text,
                taskId: task.id,
                completed: task.completed
            })
        },
        onSubTaskAdded(previousResult, {subscriptionData}){
            if (subscriptionData.data.subTaskAdded.taskID === this.taskId){
                return {
                    subTasks: [...previousResult.subTasks, subscriptionData.data.subTaskAdded],
                }
            } else {
                return {
                    subTasks: [...previousResult.subTasks]
                }
            }

        },
        onSubTaskDeleted(previousResult, {subscriptionData}){
            previousResult.subTasks = previousResult.subTasks.filter((subTask) => {
                return subTask.id !== subscriptionData.data.subTaskDeleted.id;
            });
            return {
                subTasks: [...previousResult.subTasks],
            }
        }
    },
    computed: {
        isInputValid() {
            return !!this.newSubTask && this.newSubTask.length >= 3;
        },
        completedSubTaskClass: function () {
            return function (isChecked) {
                return isChecked ? 'text-decoration-line-through' : '';
            };
        },
        inputStateColor(){
            return !this.isInputValid ? 'grey' : 'green';
        }
    }
}
</script>

<style scoped>
.v-list-item{
    height: 48px;
}
</style>
