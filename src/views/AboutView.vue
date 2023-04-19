<template>
    <div class="about">
        <TaskList/>
    </div>
</template>

<script>
import TaskList from "@/components/TaskList.vue";

export default {
    name: 'AboutView',
    components: {TaskList},
}
</script>

<style scoped>
.about{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
