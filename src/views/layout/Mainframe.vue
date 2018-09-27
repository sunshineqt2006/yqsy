<template>
    <section class="app-container">
        <transition name="fade-in-linear" mode="out-in">
            <router-view :key="$route.fullPath"></router-view>
        </transition>
    </section>
</template>

<script>
    export default {
      name: 'mainframe'
    }
</script>

<style lang='less'>

.app-container{
    height: 100%;
    width: 100%;
   // padding: 30px;
   background-color: #eef0f0;
}
</style>

