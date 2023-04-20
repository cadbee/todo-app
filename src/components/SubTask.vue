<template>
    <ApolloQuery :query="require('../graphql/SubTasks.gql')"
                 :variables="{taskID: taskId}"
    >
        <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>

            <!-- Result -->
            <div v-else-if="data">
                <v-list flat>
                    <v-list-item-group
                            multiple
                    >
                        <v-list-item
                                v-for="task in data.subTasks"
                                :key="task.id"

                        >
                            <template v-slot:default="{  }">
                                <v-list-item-action>
                                    <ApolloMutation :mutation="require('../graphql/UpdateSubTask.gql')"
                                                    :variables="{input: {id: task.id, text: task.text, completed: !task.completed}}">
                                        <template v-slot="{ mutate, loading }">
                                            <v-checkbox
                                                :disabled="loading"
                                                v-model="task.completed"
                                                color="primary"
                                                v-mutate.attr="() => mutate()"
                                            ></v-checkbox>
<!--                                            v-mutate.attr="() => onSubTaskCompleted(task)"-->
                                        </template>
                                    </ApolloMutation>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title v-text="task.text"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </div>

            <!-- No result -->
            <!--              <div v-else class="no-result apollo">No result :(</div>-->
        </template>
    </ApolloQuery>
</template>

<script>
// import gql from 'graphql-tag'
// import { useMutation } from '@vue/apollo-composable'

export default {
    name: "SubTask",
    props: {
        taskId: String
    },
    data() {
        return {
            selected: []
        }
    },
    watch: {
        selected() {
            // console.log(this.selected[this.selected.length - 1]);
        }
    },
    methods: {
        onSubTaskCompleted(subTask) {
            // console.log(subTask);
            this.$apollo.mutate({
                // Query
                mutation: require("../graphql/UpdateSubTask.gql"),
                // Parameters
                variables: {
                    input: {
                        id: subTask.id,
                        text: subTask.text,
                        completed: !subTask.completed
                    },
                },
                // Update the cache with the result
                // The query will be updated with the optimistic response
                // and then with the real result of the mutation
                update: (store, { data: { updateSubTask } }) => {
                    const query = {
                        query: require('../graphql/SubTasks.gql'),
                        variables: {
                            taskID: this.taskId
                        },
                    };
                    // Read the query from cache
                    const data = store.readQuery(query);
                    console.log("SubTask: ",updateSubTask);
                    console.log("DATA:", data);
                    // Mutate cache result
                    data.subTasks.find((task)=>task.id === updateSubTask.id).completed = !updateSubTask.completed;
                    console.log("DATA AFTER: ", data);
                    // Write back to the cache
                    store.writeQuery({
                        ...query,
                        data,
                    });
                },
                // Optimistic UI
                // Will be treated as a 'fake' result as soon as the request is made
                // so that the UI can react quickly and the user be happy
                optimisticResponse: {
                    __typename: 'Mutation',
                    updateSubTask: {
                        __typename: 'SubTask',
                        id: subTask.id,
                        text: subTask.text,
                        completed: !subTask.completed
                    },
                },
            });
        }
    }
}
</script>

<style scoped>

</style>
