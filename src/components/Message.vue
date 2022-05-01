<template>
<div class=" absolute transition-all duration-300 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-lg shadow-lg"
:class="isActive ? 'top-10 opacity-100':'top-0 opacity-0'">

    <p>{{joiningUser}} 加入房间</p>
</div>
</template>

<script>
import {ref,getCurrentInstance} from 'vue'
export default {
    props:['curRoom'],
    setup(props){
        const { proxy } = getCurrentInstance();
        const isActive = ref(false)
        const joiningUser = ref('')
        let timer = null
        proxy.$socket.on('otherJoinRoom',(nickName,roomId)=>{
            if(props.curRoom != roomId)return
            joiningUser.value = nickName
            isActive.value = true
            clearTimeout(timer)
            timer = setTimeout(()=>{
                isActive.value = false
            },2000) 
        })

        return {
            joiningUser,
            isActive,

        }
    }
}

</script>

<style>
</style>