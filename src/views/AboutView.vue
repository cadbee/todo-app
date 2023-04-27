<template>
    <div class="about">
        <hello-world></hello-world>
    </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: 'AboutView',
    components: {HelloWorld},
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
