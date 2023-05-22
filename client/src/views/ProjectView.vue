<template>
    <v-container
        class="container"
        fluid
    >
        <div class="d-flex flex-row pl-2 mb-1">
            <h1>Title</h1>
            <v-spacer/>
            <v-icon>mdi-information</v-icon>
        </div>
        <v-row
            class="pl-2 mb-3"
            no-gutters
        >
            <v-btn
                class="pa-2 text-capitalize"
                text
                @click="isAddTaskDialogShown = !isAddTaskDialogShown"
            >
                <v-icon
                    left
                    color="red"
                >
                    mdi-plus
                </v-icon>
                Add task
            </v-btn>
            <AddTaskDialog :opened.sync="isAddTaskDialogShown"/>
        </v-row>
        <v-row
            class="mb-6 pl-2"
            no-gutters
        >
            <v-item-group
                mandatory
                v-model="filter"
            >
                <v-item
                    v-for="(filter, index) in filters"
                    v-slot="{ active, toggle }"
                    :value="filter"
                    :key="index"
                >
                    <v-btn
                        class="me-2 mb-1"
                        small
                        rounded
                        :color="active ? 'primary' : ''"
                        @click="toggle"
                    >
                        {{ filter }}
                    </v-btn>
                </v-item>
            </v-item-group>
        </v-row>
        <v-container
            class="pa-1"
            fluid
        >
            <TaskList :filter="filter"/>
        </v-container>
        <SuccessAlert/>
    </v-container>
</template>

<script>
import TaskList from "../components/TaskList.vue";
import AddTaskDialog from "../components/AddTaskDialog.vue";
import SuccessAlert from "../components/SuccessAlert.vue";

export default {
    name: "ProjectView",
    components: {SuccessAlert, AddTaskDialog, TaskList},
    data(){
        return {
            filters: ['All', 'Complete', 'Incomplete'],
            filter: '',
            isAddTaskDialogShown: false,
        }
    }
}
</script>

<style scoped>
.container{
    max-width: 1920px;
}
</style>
