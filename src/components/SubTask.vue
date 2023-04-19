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
                  <v-list-item
                          v-for="task in data.subTasks"
                          :key="task.id"
                          link
                  >
                      <v-list-item-title v-text="task.text"></v-list-item-title>

                  </v-list-item>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">No result :(</div>
          </template>
      </ApolloQuery>
</template>

<script>
// import gql from 'graphql-tag'

export default {
    name: "SubTask",
    props: {
        taskId: String
    },
    data() {
        return{

        }
    },
}
</script>

<style scoped>

</style>
