<template>

    <div class="h-screen w-full flex-col flex relative">
        <Message :curRoom="curRoom"></Message>
        <div class="bg-white w-full flex justify-between items-center z-10 flex-none border-b-2">
            <div class="flex items-center">
                <div :class="connected ? ' bg-green-500' : 'bg-red-500'"
                    class="rounded-full transition-all duration-300 w-4 h-4 mx-2"></div>
                <p class=" font-bold mx-2">{{ nickName }}</p>
            </div>
            <div class="flex items-center justify-center">
                <div class="flex-none flex justify-center items-center mr-4"><svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" class="w-4 h-4">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                    </svg>
                    <div> &times; {{ counter.get(curRoom) }} </div>
                </div>
                <button class="btn" @click="changeNickName"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm2 2h6v6H6V7zm2 2v2h2V9H8zm-2 6h12v2H6v-2zm8-8h4v2h-4V7zm0 4h4v2h-4v-2z"
                            fill="rgba(255,255,255,1)" />
                    </svg></button>
                <button class="btn" @click="logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1H5zm13-6v-3h-7v-2h7V8l5 4-5 4z"
                            fill="rgba(255,255,255,1)" />
                    </svg></button>
                <button class="btn" @click="reload"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"
                            fill="rgba(255,255,255,1)" />
                    </svg></button>
                <button class="btn" @click="joinRoom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            d="M14 14.252V22H4a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"
                            fill="rgba(255,255,255,1)" />
                    </svg></button>
            </div>
            <!-- <p>socketId:{{ socketId }}</p> -->
        </div>
        <RoomsPanel :rooms="rooms" :curRoom="curRoom" class="flex-none p-2  mb-2"
            @change-room="(room) => curRoom = room"></RoomsPanel>
        <Dialog :nickName="nickName" :posts="posts.filter((v => v.roomId === curRoom))" :bgColor="bgColor"
            class="w-full grow h-20 overflow-auto scroll-smooth flex flex-col items-center"></Dialog>
        <div class="flex w-full bg-white h-16 flex-none">
            <input @focus="scrollButtom" @keyup.enter="sendPost"
                class=" w-5/6 outline-none rounded-md border-2 p-2 m-2 border-solid border-blue-100 focus:border-blue-500"
                type="text" v-model="inputBox"
                ref="postInput">
            <button class="btn block p-auto w-1/6" @click="sendPost" :disabled="inputBox.length == 0">发送</button>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs, watch, watchEffect } from "vue"
import uniqolor from 'uniqolor';
import Dialog from "./Dialog.vue";
import RoomsPanel from "./RoomsPanel.vue";
import Message from "./Message.vue";


export default {
    setup() {
        const { proxy } = getCurrentInstance();
        const profile = reactive({
            nickName: localStorage.getItem("nickName") || "anonymity",
            talkId: localStorage.getItem("uuid"),
        });
        let bgColor = ref(uniqolor(profile.talkId, { format: "hsl", saturation: [45, 55], lightness: [93, 98] }).color);
        const state = reactive({
            socketId: "",
            connected: false
        });
        const rooms = ref([]);
        let curRoom = ref('')
        const posts = ref([]);
        const inputBox = ref("");
        const postContainer = ref(null);
        const changeNickName = () => {
            const nickName = prompt("输入名字", profile.nickName);
            if (!nickName) return
            profile.nickName = nickName;
        };
        const counter = reactive(new Map())
        const postInput = ref(null)

        console.log(proxy.$socket);
        proxy.$socket.on("message", message => console.log(message));
        proxy.$socket.on("connect", () => {
            state.connected = proxy.$socket.connected;
            state.socketId = proxy.$socket.id;
        });
        proxy.$socket.on("disconnect", () => {
            state.connected = proxy.$socket.connected;
            state.socketId = proxy.$socket.id;
        });
        //login
        proxy.$socket.emit("login", profile.talkId);
        proxy.$socket.on("login", (uuid, exist) => {
            if (exist) {
                console.log("已经登录");
            }
            else {
                profile.talkId = uuid;
            }
        });
        //logout
        const logout = () => {
            proxy.$socket.emit("logout", profile.talkId);
            profile.talkId = "";
        };
        //post listener
        proxy.$socket.on("post", (roomId, cardColor, nickName, text, time) => {
            posts.value.push({
                roomId: roomId,
                cardColor: cardColor,
                nickName: nickName,
                text: text,
                time: time,
            });
        });

        //监听房间人数
        proxy.$socket.on('statistic', (cnt, roomId) => {
            counter.set(roomId, cnt)
        })
        //join room 
        //listener
        proxy.$socket.on('joinRoom', (status, roomId) => {
            if (status === 'success') rooms.value.push(roomId)
            curRoom.value = roomId
        })
        //加入大厅
        proxy.$socket.emit('joinRoom', profile.nickName, '');


        //functions
        //post
        const sendPost = () => {
            console.log('sendPost')
            posts.value.push({
                roomId: curRoom.value,
                cardColor: bgColor.value,
                nickName: profile.nickName,
                text: inputBox.value,
                time: Date()
            });
            proxy.$socket.emit("post", curRoom.value, bgColor.value, profile.nickName, inputBox.value, Date());
            inputBox.value = "";
            // postContainer.value.scrollTop = postContainer.value.scrollHeight - postContainer.value.clientHeight
            // console.log(postContainer.value.scrollTop)
            // console.log(posts.value)
            postInput.value.focus()
        };

        //join room 
        //加入房间按钮方法
        const joinRoom = () => {
            const roomId = prompt('房间号', curRoom.value || '大厅')
            if (roomId === '大厅') return
            if (roomId === '') return
            if (roomId === null) return
            if (rooms.value.indexOf(roomId) !== -1) {
                console.log('已经加入房间')
                return
            }
            proxy.$socket.emit('joinRoom', profile.nickName, roomId)
        }

        //刷新
        const reload = () => {
            location.reload();
        };

        //监视
        watch(() => profile.nickName, (nickName) => localStorage.setItem("nickName", nickName));
        watch(() => profile.talkId, (talkId) => {
            localStorage.setItem("uuid", talkId);
            console.log(talkId);
        });

        // watchEffect(() => {
        //     console.log(state.connected);
        //     console.log(state.socketId);
        // });

        return {
            ...toRefs(profile),
            ...toRefs(state),
            changeNickName,
            logout,
            reload,
            sendPost,
            inputBox,
            posts,
            postContainer,
            bgColor,
            curRoom,
            rooms,
            joinRoom,
            counter,
            postInput
        };
    },
    components: { Dialog, RoomsPanel, Message }
}
</script>

<style>
.btn {
    @apply outline-none transition-all duration-300 active:bg-blue-700 rounded-md p-2 m-2 bg-blue-500 text-white disabled:bg-slate-100 disabled:text-black
}
</style>