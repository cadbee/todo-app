<template>
    <div class="task-list">
        <ApolloQuery :query="require('../graphql/MainTasks.gql')">
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                    <v-card
                            class="mx-auto"
                            width="600"
                    >
                        <v-list>
                            <v-list-group
                                    prepend-icon="mdi-account-circle"
                                    v-for="task in data.mainTasks"
                                    :key="task.id"
                            >
                                <template v-slot:activator>
                                    <v-list-item-title>{{ task.name }}</v-list-item-title>
                                </template>

                                <SubTask :task-id="task.id"></SubTask>
                            </v-list-group>
                        </v-list>
                    </v-card>
                </div>
                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
            </template>
        </ApolloQuery>
    </div>
</template>

<script>
import SubTask from "@/components/SubTask.vue";

export default {
    name: "TaskList",
    data() {
        return {
            selectedItem: null,
        }
    },
    components: {SubTask}
}
</script>

<style scoped>

</style>
