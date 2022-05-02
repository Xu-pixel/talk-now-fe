<template>
    <div class="flex flex-col overflow-hidden bg-blue-100 rounded-lg shadow-xl w-20">
        <div v-for="room in rooms">
            <div @click="$emit('changeRoom', room)" class="overflow-hidden cursor-pointer p-2 h-10 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 truncate w-full"
                :class="curRoom === room ? ' bg-blue-500 border-blue-100 text-white' : ' bg-white border-blue-500 text-black'">{{ room || '大厅'  }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['rooms', 'curRoom'],
}
</script>