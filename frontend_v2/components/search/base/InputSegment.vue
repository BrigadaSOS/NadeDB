<script setup>
import { mdiTextSearch } from '@mdi/js'

let query = ref('')

const navigateSearchSentence = async () => {
    await navigateTo({
        path: '/search/sentence',
        query: {
            query: query.value,
        }
    })
}

const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'S') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>
<template>
    <!-- Form -->
    <form @submit.prevent="navigateSearchSentence">
        <div
            class="relative mt-2 z-20  flex space-x-3 p-2 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
            <div class="flex-[1_0_0%] ">
                <label for="hs-search-article-1" class="block text-sm text-gray-700 font-medium dark:text-white"><span
                        class="sr-only">Search anything!</span></label>
                <input autofocus v-model="query"
                    class=" dark:focus:ring-gray-500 dark:focus:border-gray-500 h-full px-4 block w-full border-transparent rounded-lg border-none focus:outline-none dark:bg-input-background dark:border-transparent dark:text-white/80 dark:placeholder-neutral-500"
                    placeholder="Search anything!" />
                <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-36">
                    <span
                        class="flex flex-wrap items-center text-center gap-x-1 text-base text-gray-400 dark:text-white">
                        <kbd
                            class="min-h-[30px] min-w-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-white border border-gray-200 font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 18v-6H5l7-7 7 7h-4v6H9z"></path>
                            </svg>
                        </kbd>
                        +
                        <kbd
                            class="min-h-[30px] min-w-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-white border border-gray-200 font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                            S
                        </kbd>
                    </span>
                    <!-- End KBD -->
                </div>

            </div>
            <div class="flex gap-2">
                <button
                    class="size-[46px] inline-flex justify-center items-center text-sm font-semibold rounded-lg  bg-button-primary-main text-white hover:bg-button-primary-hover disabled:opacity-50 disabled:pointer-events-none"
                    href="#">
                    <UiBaseIcon :path="mdiTextSearch" w="w-5 md:w-5" h="h-5 md:h-5" size="20" class="" />
                </button>

                <button
                    class="size-[46px] inline-flex justify-center items-center text-sm font-semibold rounded-lg  bg-button-primary-main text-white hover:bg-button-primary-hover disabled:opacity-50 disabled:pointer-events-none"
                    @click="navigateSearchSentence">
                    <svg class="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </button>
            </div>
        </div>
    </form>
    <!-- End Form -->
</template>