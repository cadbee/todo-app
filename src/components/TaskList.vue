<template>
    <ApolloQuery :query="require('../graphql/MainTasks.gql')">
        <ApolloSubscribeToMore :document="require('../graphql/MainTaskAdded.gql')"
                               :update-query="onMainTaskAdded"/>
        <ApolloSubscribeToMore :document="require('../graphql/MainTaskDeleted.gql')"
                               :update-query="onMainTaskDeleted"/>
        <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>
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
                                            <ApolloMutation :mutation="require('../graphql/DeleteMainTask.gql')"
                                                            :variables="{id: task.id}"
                                                            >
                                                <template v-slot="{mutate}">
                                                    <v-btn
                                                      fab
                                                      dark
                                                      small
                                                      color="red"
                                                      @click.native.stop="onSubmit(mutate)"
                                                    >
                                                        <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </template>
                                            </ApolloMutation>
                                        </v-speed-dial>
                                    </template>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <SubTaskList :task-id="task.id" :filter-value="filter"></SubTaskList>
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
                ></v-skeleton-loader>
            </v-sheet>
<!--                <div v-else class="no-result apollo">No result :(</div>-->
        </template>
        <ConfirmAlert ref="confirmMainTaskAddDialogue"
        >
        </ConfirmAlert>
        <UpdateTaskDialog ref="updateDialogue"></UpdateTaskDialog>
    </ApolloQuery>
</template>

<script>
import SubTaskList from "@/components/SubTaskList.vue";
import ConfirmAlert from "@/components/ConfirmAlert.vue";
import UpdateTaskDialog from "@/components/UpdateTaskDialog.vue";

import {mapActions} from 'vuex';

export default {
    name: "TaskList",
    props: {
        filter: String
    },
    data() {
        return {
            editDialog: true,
            selectedItems: [],
            prevQuery: null,
            prevData: null
        }
    },
    methods:{
        ...mapActions('alert', {
            hideAlert: "hideAlert",
            showAlert: "showAlert"
        }),
        async onSubmit(mutate){
            this.hideAlert();
            const ok = await this.$refs.confirmMainTaskAddDialogue.show({
                message: "Are you sure?"
            });
            if(ok){
                mutate();
                this.showAlert({message: 'Task deleted successfully!'});
            }
        },
        onTaskDelete(store, {data: {deleteMainTask}}){
            const query = {
                query: require("../graphql/MainTasks.gql"),
            }
            let data = store.readQuery(query);
            this.prevData = data;
            this.prevQuery = query;
            data.mainTasks = data.mainTasks.filter((mainTask) => mainTask.id !== deleteMainTask.id);
            store.writeQuery({
                ...query,
                data,
            });
            this.newTask = '';
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
            previousResult.mainTasks = previousResult.mainTasks.filter((mainTask) => mainTask.id !== subscriptionData.data.mainTaskDeleted.id);
            return {
                mainTasks: [...previousResult.mainTasks],
            }
        },
        undo(){

        }
    },
    components: {UpdateTaskDialog, ConfirmAlert, SubTaskList}
}
</script>

<style scoped>

</style>
