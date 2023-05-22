<template>
    <ApolloQuery :query="require('../graphql/MainTasks.gql')">
        <ApolloSubscribeToMore
            :document="require('../graphql/MainTaskAdded.gql')"
            :update-query="onMainTaskAdded"
        />
        <ApolloSubscribeToMore
            :document="require('../graphql/MainTaskDeleted.gql')"
            :update-query="onMainTaskDeleted"
        />
        <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
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
            <v-card v-else-if="data"
                    class="mx-auto"
            >
                <v-card-actions>
                    <v-row>
                        <v-expansion-panels>
                            <v-expansion-panel
                                v-for="(task, index) in data.mainTasks"
                                :key="task.id"
                            >
                                <v-expansion-panel-header disable-icon-rotate>
                                    {{index+1}}. {{ task.name }}
                                    <template v-slot:actions >
                                        <v-speed-dial
                                            direction="left"
                                            :open-on-hover="true"
                                            transition="slide-x-transition"
                                        >
                                            <template v-slot:activator>
                                                <v-btn
                                                    :value="false"
                                                    @click.native.stop=""
                                                    color="blue darken-2"
                                                    dark
                                                    fab
                                                    icon
                                                    small
                                                >
                                                    <v-icon>
                                                        mdi-dots-horizontal
                                                    </v-icon>
                                                </v-btn>
                                            </template>

                                            <v-btn
                                                fab
                                                dark
                                                small
                                                color="green"
                                                @click.native.stop="openUpdateDialog(task)"
                                            >
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                            <ApolloMutation
                                                :mutation="require('../graphql/DeleteMainTask.gql')"
                                                :variables="{id: task.id}"
                                            >
                                                <template v-slot="{mutate}">
                                                    <v-btn
                                                        fab
                                                        dark
                                                        small
                                                        color="red"
                                                        @click.native.stop="onSubmit(mutate, 'Task deleted successfully!')"
                                                    >
                                                        <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </template>
                                            </ApolloMutation>
                                        </v-speed-dial>
                                    </template>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <SubTaskList
                                        :task-id="task.id"
                                        :filter-value="filter"
                                    />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </v-card-actions>

            </v-card>
            <v-sheet
                v-else
                :color="'grey'"
                class="pa-3 mx-auto"
            >
                <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                />
            </v-sheet>
        </template>
        <ConfirmAlert ref="confirmMainTaskAddDialogue"/>
        <UpdateDialog
            ref="updateDialogue"
            field-to-update="name"
            :mutation="require('../graphql/UpdateMainTask.gql')"
        />
    </ApolloQuery>
</template>

<script>
import SubTaskList from "./SubTaskList.vue";
import ConfirmAlert from "./ConfirmAlert.vue";

import { mapActions } from 'vuex';
import UpdateDialog from "@/components/UpdateDialog.vue";

export default {
    name: "TaskList",
    props: {
        filter: {
            type: String,
            required: false,
            default: 'All'
        }
    },
    methods: {
        ...mapActions('alert', {
            hideAlert: "hideAlert",
            showAlert: "showAlert"
        }),
        async onSubmit(mutate, alertMessage){
            await this.hideAlert();
            const isConfirmed = await this.$refs.confirmMainTaskAddDialogue.show({
                message: "Are you sure?"
            });
            if (isConfirmed){
                mutate();
                await this.showAlert({message: alertMessage});
            }
        },
        openUpdateDialog(task){
            this.$refs.updateDialogue.openDialog({
                taskId: task.id,
                initialValue: task.name,
            })
        },
        onMainTaskAdded(previousResult, {subscriptionData}){
            return {
                mainTasks: [...previousResult.mainTasks, subscriptionData.data.mainTaskAdded],
            }
        },
        onMainTaskDeleted(previousResult, {subscriptionData}){
            previousResult.mainTasks = previousResult.mainTasks.filter((mainTask) => {
                return mainTask.id !== subscriptionData.data.mainTaskDeleted.id;
            });
            return {
                mainTasks: [...previousResult.mainTasks],
            }
        },
    },
    components: {UpdateDialog, ConfirmAlert, SubTaskList}
}
</script>
