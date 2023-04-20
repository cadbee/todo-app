<template>
    <div class="task-list">
        <ApolloQuery :query="require('../graphql/MainTasks.gql')">
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>
                <v-card v-else-if="data"
                        class="mx-auto"
                        width="600"
                >
                    <v-row justify="center">
                        <v-expansion-panels>
                            <v-expansion-panel
                                v-for="task in data.mainTasks"
                                :key="task.id"
                            >
                                <v-expansion-panel-header>{{ task.name }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <SubTask :task-id="task.id"></SubTask>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </v-card>

                <!-- Result -->
<!--                    <v-card v-else-if="data"-->
<!--                            class="mx-auto"-->
<!--                            width="600"-->
<!--                    >-->
<!--                        <v-list>-->
<!--                            <v-list-group-->
<!--                                    prepend-icon="mdi-account-circle"-->
<!--                                    v-for="task in data.mainTasks"-->
<!--                                    :key="task.id"-->
<!--                            >-->
<!--                                <template v-slot:activator>-->
<!--                                    <v-list-item-action>-->
<!--                                        <v-checkbox :input-value="selectedItems"></v-checkbox>-->
<!--                                    </v-list-item-action>-->
<!--                                    <v-list-item-title>{{ task.name }}</v-list-item-title>-->
<!--                                </template>-->

<!--                                <SubTask :task-id="task.id"></SubTask>-->
<!--                            </v-list-group>-->
<!--                        </v-list>-->
<!--                    </v-card>-->
<!--                 No result -->
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
            selectedItems: [],
        }
    },
    components: {SubTask}
}
</script>

<style scoped>

</style>
