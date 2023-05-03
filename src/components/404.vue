<template>
    <v-container fluid class="fill-height">
        <v-row>
            <v-col class="text-center">
                <v-img src="../assets/error-404.png" alt="image 404" max-height="400px" contain></v-img>
                <h2><b>404</b> Страница не найдена</h2>
                <p>посетите главную страницу <br> возможно вы найдёте её</p>
                <v-btn color="deep-purple lighten-5" :to="{ name: 'home' }" link>На главную</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "NotFound"
}
</script>

<style scoped>

</style>
