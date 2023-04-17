<template>
    <div class="about">
        <h1>This is an about page</h1>
        <ApolloExample/>
    </div>
</template>

<script>
import ApolloExample from "@/components/ApolloExample.vue";

export default {
    name: 'AboutView',
    components: {ApolloExample},
    comments: {
        ApolloExample
    }
}
</script>
