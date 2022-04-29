<template>
    <div class="h-screen w-full flex-col flex">
        <div class="bg-white w-full flex flex-col items-center h-40 z-10 flex-none">
            <div class="flex">
                <button class="btn" @click="changeNickName">修改昵称</button>
                <button class="btn" @click="logout">退出</button>
                <button class="btn" @click="reload">连接</button>
            </div>
            <p>当前昵称:{{ nickName }}</p>
            <p v-if="connected" style="color: green;">在线</p>
            <p v-else style="color: red;">离线</p>
            <p>socketId:{{ socketId }}</p>
        </div>
        <div class="w-full grow h-20 overflow-auto scroll-smooth flex flex-col items-center" ref="postContainer">
            <div v-for="(post, i) in posts" class="flex px-2 sm:w-2/3 w-11/12" :class="post.cardColor === bgColor && post.nickName === nickName ? ' justify-end':'justify-start'">
                <div class="my-2 p-2 flex flex-col rounded-b-xl"
                    :class="post.cardColor === bgColor && post.nickName === nickName ? 'ml-4 items-end  rounded-l-xl':'mr-4 items-start rounded-r-xl'"
                    :style="{ backgroundColor: post.cardColor }">
                    <div class=" font-bold">{{ post.nickName }}</div>
                    <div class="py-1"> {{ post.text }}</div>
                    <div class="text-xs">{{ post.time }}</div>
                </div>
            </div>
        </div>
        <div class="flex w-full bg-white h-16 flex-none">
            <input @focus="scrollButtom"
                @keyup.enter="sendPost"
                class=" w-5/6 outline-none rounded-md border-2 p-2 m-2 border-solid border-blue-500" type="text"
                v-model="inputBox">
            <button class="btn block p-auto w-1/6" @click="sendPost" 
                :disabled="inputBox.length == 0">发送</button>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onBeforeUpdate, onMounted, onUpdated, reactive, ref, toRefs, watch, watchEffect } from "vue"
import uniqolor from 'uniqolor';


export default {
    setup() {
        const { proxy } = getCurrentInstance()
        const profile = reactive({
            nickName: localStorage.getItem('nickName') || 'anonymity',
            talkId: localStorage.getItem('uuid'),
        })
        let bgColor = ref(uniqolor(profile.talkId, { format: 'hsl', saturation: [45,55], lightness: [93,98] }).color)
        const state = reactive({
            socketId: '',
            connected: false
        })
        const rooms = ref([])
        const posts = ref([])
        const inputBox = ref('')
        const postContainer = ref(null)


        const changeNickName = () => {
            const nickName = prompt('输入名字', profile.nickName)
            profile.nickName = nickName
        }

        console.log(proxy.$socket)
        proxy.$socket.on('message', message => console.log(message))
        proxy.$socket.on('connect', () => {
            state.connected = proxy.$socket.connected
            state.socketId = proxy.$socket.id
        })
        proxy.$socket.on('disconnect', () => {
            state.connected = proxy.$socket.connected
            state.socketId = proxy.$socket.id
        })

        //login
        proxy.$socket.emit('login', profile.talkId)
        proxy.$socket.on('login', (uuid, exist) => {
            if (exist) {
                console.log('已经登录')
            } else {
                profile.talkId = uuid
            }
        })

        //logout
        const logout = () => {
            proxy.$socket.emit('logout', profile.talkId)
            profile.talkId = ''
        }

        //post
        proxy.$socket.on('post', (cardColor, nickName, text, time) => {
            posts.value.push({
                cardColor: cardColor,
                nickName: nickName,
                text: text,
                time: time,
            })
        })

        //functions
        const sendPost = () => {
            posts.value.push({
                cardColor: bgColor.value,
                nickName: profile.nickName,
                text: inputBox.value,
                time: Date()
            })
            proxy.$socket.emit('post', bgColor.value, profile.nickName, inputBox.value, Date())
            inputBox.value = ''
            // postContainer.value.scrollTop = postContainer.value.scrollHeight - postContainer.value.clientHeight
            // console.log(postContainer.value.scrollTop)
        }

        const reload = () => {
            location.reload()
        }

        const scrollButtom = () => {
            postContainer.value.scrollTop = postContainer.value.scrollHeight - postContainer.value.clientHeight
        }


        //监视
        watch(
            () => profile.nickName,
            (nickName) => localStorage.setItem('nickName', nickName)
        )

        watch(
            () => profile.talkId,
            (talkId) => {
                localStorage.setItem('uuid', talkId)
                console.log(talkId)
            }
        )

        onUpdated(() => {
            scrollButtom()
        })


        watchEffect(() => {
            console.log(state.connected)
            console.log(state.socketId)

        })

        return {
            ...toRefs(profile),
            ...toRefs(state),
            changeNickName,
            logout,
            reload,
            sendPost,
            scrollButtom,
            inputBox,
            posts,
            postContainer,
            bgColor
        }
    }
}
</script>

<style>
.btn {
    @apply outline-none transition-all duration-300 active:bg-blue-700 rounded-md p-2 m-2 bg-blue-500 text-white disabled:bg-slate-100 disabled:text-black
}
</style>