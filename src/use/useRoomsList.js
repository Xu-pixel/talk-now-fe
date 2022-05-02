import {ref} from 'vue'

export default function useRoomsList(){
    const roomsListIsOpen = ref(false)
    const openRoomsList = ()=>{
        roomsListIsOpen.value = !roomsListIsOpen.value
    }
    const resetRoomsList = ()=>{
        roomsListIsOpen.value = false
    }
    return {
        roomsListIsOpen,
        openRoomsList,
        resetRoomsList
    }
}