<template>
    <div class="flex overflow-auto bg-blue-100">
        <div v-for="room in rooms">
            <div @click="$emit('changeRoom', room)" class="capsule overflow-hidden cursor-pointer rounded-full flex justify-center mx-2 items-center p-2 h-10 w-10 transition-all duration-300"
                :class="curRoom === room ? ' bg-blue-500 border-2 border-blue-100 text-white w-auto' : ' bg-white border-blue-500 text-black border-2'">{{ curRoom === room ? (room || '大厅') : (room || '大厅').charAt(0)  }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['rooms', 'curRoom'],
    setup(props) {
        
    }
}


</script>

<style scoped>
.capsule{
    min-width: 40px;
}
</style>