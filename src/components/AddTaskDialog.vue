<template>
    <v-layout>
    <v-dialog :value="opened"
              width="500"
              @click:outside="closeDialog"
              @keydown.esc="closeDialog"
    >
        <v-card>
            <v-card-title class="text-h5">
                Enter task name
            </v-card-title>
<!--            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>-->
            <v-card-text>
                <v-text-field
                  label="Task description"
                  :rules="rules"
                  v-model="newTask"
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
                <ApolloMutation :mutation="require('../graphql/AddTask.gql')"
                                :variables="{input: {name: newTask}}"
                                :update="onTaskAdded">
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
        <ConfirmAlert ref="confirmDialogue"
        >
        </ConfirmAlert>
    </v-dialog>
        <v-alert
          v-model="alert"
          type="success"
          dismissible
          transition="scale-transition"
        >
            Task added successfully!
        </v-alert>
    </v-layout>
</template>

<script>
import ConfirmAlert from "@/components/ConfirmAlert.vue";

export default {
    name: "AddTaskDialog",
    components: {ConfirmAlert},
    props: ['opened'],
    data(){
        return {
            alert: false,
            newTask: '',
            rules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        }
    },
    watch: {
        alert(new_val){
            if(new_val){
                setTimeout(()=>{this.alert=false},3000)
            }
        }
    },
    methods: {
        async onSubmit(mutate){
            const ok = await this.$refs.confirmDialogue.show({
                message: "Confirm Adding?"
            });
            if(ok){
                mutate();
                this.alert = true;
                this.$emit('update:opened', false);
            }
        },
        onTaskAdded(store, {data: {addMainTask}}){
            const query = {
                query: require("../graphql/MainTasks.gql"),
            }
            let data = store.readQuery(query);
            data.mainTasks.push(addMainTask);
            store.writeQuery({
                ...query,
                data,
            });
            this.newTask = '';
        },
        closeDialog(){
            this.$emit('update:opened', false);
        },
    }
}
</script>

<style scoped>

</style>
