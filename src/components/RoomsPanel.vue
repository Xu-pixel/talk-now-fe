<template>
    <div class="flex overflow-auto">
        <div v-for="room in rooms">
            <div @click="$emit('changeRoom', room)" class="capsule overflow-hidden cursor-pointer rounded-full flex justify-center mx-2 items-center p-2 h-10 w-10 transition-all duration-300"
                :class="curRoom === room ? ' bg-slate-700 border-2 border-slate-200 text-white w-auto' : ' bg-white border-2 text-black '">{{ curRoom === room ? (room || '大厅') : (room || '大厅').charAt(0)  }}</div>
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