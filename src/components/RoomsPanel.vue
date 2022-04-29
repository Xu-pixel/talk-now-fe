<template>
    <div class="flex">
        <div v-for="room in rooms">
            <div @click="$emit('changeRoom', room)" class="cursor-pointer rounded-full flex justify-center mx-2 items-center p-2 h-10 w-10 transition-all duration-300"
                :class="curRoom === room ? ' bg-slate-700 border-2 border-white text-white' : ' bg-white border-2 text-black '">{{ room }}</div>
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