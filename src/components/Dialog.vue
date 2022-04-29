<template>
    <div  ref="postContainer">
        <div v-for="(post, i) in posts" class="flex px-2 md:w-2/3 w-11/12"
            :class="post.cardColor === bgColor && post.nickName === nickName ? ' justify-end' : 'justify-start'">
            <div class="my-2 p-2 flex flex-col rounded-b-xl"
                :class="post.cardColor === bgColor && post.nickName === nickName ? 'ml-4 items-end  rounded-l-xl' : 'mr-4 items-start rounded-r-xl'"
                :style="{ backgroundColor: post.cardColor }">
                <div class=" font-bold">{{ post.nickName }}</div>
                <div class="py-1"> {{ post.text }}</div>
                <div class="text-xs">{{ post.time }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { onUpdated,ref } from "vue";
export default {
    props: ['posts', 'bgColor', 'nickName'],
    setup(props) {
        onUpdated(() => {
            scrollButtom();
        });
        const postContainer = ref(null);
        const scrollButtom = () => {
            postContainer.value.scrollTop = postContainer.value.scrollHeight - postContainer.value.clientHeight;
        };

        return {
            postContainer
        }
    }
}
</script>