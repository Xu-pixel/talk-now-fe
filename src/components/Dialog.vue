<template>
    <div ref="postContainer" class=" transition-all duration-300">
        <div v-for="(post, i) in posts" class="flex px-2 md:w-2/3 w-11/12"
            :class="post.cardColor === bgColor && post.nickName === nickName ? ' justify-end' : 'justify-start'">
            <div class="flex flex-col "
            :class="post.cardColor === bgColor && post.nickName === nickName ? 'items-end': 'items-start'">
                <div v-if="i === 0 || posts[i - 1].nickName !== post.nickName || post.cardColor !== posts[i].cardColor" class=" font-bold">{{ post.nickName }}</div>
                <div v-if="i === 0 || posts[i - 1].nickName !== post.nickName || post.cardColor !== posts[i].cardColor" class="text-xs">{{ dayjs(post.time).format('M-D H:mm:ss') }}</div>
                <div class="my-2 p-2 flex flex-col rounded-b-xl"
                    :class="post.cardColor === bgColor && post.nickName === nickName ? 'ml-4 items-end  rounded-l-xl' : 'mr-4 items-start rounded-r-xl'"
                    :style="{ backgroundColor: post.cardColor }">
                    <div class="py-1"> {{ post.text }}</div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onUpdated, ref } from "vue";
import dayjs from 'dayjs'
export default {
    props: ['posts', 'bgColor', 'nickName'],
    setup(props) {

        const spaceOfBuble = 5
        onUpdated(() => {
            scrollButtom();
        });
        const postContainer = ref(null);
        const scrollButtom = () => {
            postContainer.value.scrollTop = postContainer.value.scrollHeight - postContainer.value.clientHeight;
        };

        return {
            postContainer,
            dayjs,
            spaceOfBuble
        }
    }
}
</script>