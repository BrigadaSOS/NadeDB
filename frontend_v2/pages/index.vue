<script setup>
import { mdiStarShootingOutline, mdiTextSearch, mdiSync, mdiDownload, mdiHistory, mdiCardMultiple } from '@mdi/js'

const apiSearch = useApiSearch();
const media = ref(null);

const fetchMedia = async () => {
    try {
        media.value = await apiSearch.getRecentMedia();
    } catch (error) {
        console.error('Error fetching media:', error);
    }
};

onMounted(() => {
    fetchMedia();
});
</script>

<template>
    <NuxtLayout>
        <div class="mx-auto">            
            <div class="relative text-white">
                <div class="py-2">
                    <div class="max-w-[88%] mx-auto">
                        <SearchBaseInputSegment/>
                        <div class=" py-5">
                            <div class="flex dark:text-white/80 gap-10  flex-col xl:flex-row justify-between">
                                <div class="flex-1 min-w-[30rem]">
                                    <div class="flex  rounded-lg flex-col first-letter:items-left">
                                        <div class="inline-flex">
                                            <h2
                                                class="text-3xl ml-2 mt-3 md:mt-0 underline underline-offset-8 decoration-4 decoration-header-background sm:mt-0 font-bold md:text-4xl md:leading-tight dark:text-white">
                                                Nadeshiko
                                            </h2>
                                            <h3
                                                class="inline-flex ml-2 rounded-full items-end text-base font-medium text-white/80">
                                                v1.0.0</h3>
                                        </div>

                                        <p class="ml-2 pt-5 text-lg">{{ $t('home.nadeDbDescription') }}</p>
                                        <ul class="list-disc ml-8 py-4 font-normal">
                                            <li class="mb-4">
                                                {{ $t('home.nadeDbDescriptionJpSearch') }}:
                                                <a class="underline text-blue-400/95 underline-offset-4"
                                                    href="search/sentences?query=彼女">彼女</a>
                                            </li>
                                            <li class="mb-4">
                                                {{ $t('home.nadeDbDescriptionOtherSearch') }}:
                                                <a class="underline text-blue-400/95 underline-offset-4"
                                                    href="search/sentences?query=school">School</a>,
                                                <a class="underline text-blue-400/95 underline-offset-4"
                                                    href="search/sentences?query=escuela">Escuela</a>
                                            </li>
                                            <li class="mb-4">
                                                Busqueda excluyente:
                                                <a class="underline text-blue-400/95 underline-offset-4"
                                                    href="search/sentences?query=卒業 -みんな">卒業 -みんな</a>
                                            </li>
                                            <li class="">
                                                Busqueda exacta:
                                                <a href='search/sentences?query="食べられない"'
                                                    class="underline text-blue-400/90 underline-offset-4">"食べられない"</a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="border-b pt-2 border-white/10" />

                                    <div class="my-4 flex font-medium">
                                        <div class="mr-4">
                                            <UiBaseIcon :path="mdiSync" w="w-12 md:w-12" h="h-12 md:h-12" size="30"
                                                class="rotate-90" />
                                        </div>
                                        <div class="">
                                            <p class="mb-2">Compatible con Anki</p>
                                            <span class="font-normal dark:text-white/60">Guarda cualquier oración en
                                                Anki incluyendo imagen, audio y múltiples idiomas.</span>
                                        </div>
                                    </div>

                                    <div class="mb-5 flex font-medium">
                                        <div class="mr-4">
                                            <UiBaseIcon :path="mdiDownload" w="w-12 md:w-12" h="h-12 md:h-12" size="30"
                                                class="" />
                                        </div>
                                        <div class="">
                                            <p class="mb-2">Descarga cualquier oración</p>
                                            <span class="font-normal dark:text-white/60">Descarga las oraciones en
                                                múltiples formatos como imágenes, audios y videos.</span>
                                        </div>
                                    </div>

                                    <div class="mb-5 flex font-medium">
                                        <div class="mr-4">
                                            <UiBaseIcon :path="mdiHistory" w="w-12 md:w-12" h="h-12 md:h-12" size="30"
                                                class="" />
                                        </div>
                                        <div class="">
                                            <p class="mb-2">Visualiza el contexto de lo que encuentres</p>
                                            <span class="font-normal dark:text-white/60">Mira lo que ocurrió antes o
                                                después de una oración.</span>
                                        </div>
                                    </div>

                                    <div class="mb-5 flex font-medium">
                                        <div class="mr-4">
                                            <UiBaseIcon :path="mdiCardMultiple" w="w-12 md:w-12" h="h-12 md:h-12"
                                                size="30" class="" />
                                        </div>
                                        <div class="">
                                            <p class="mb-2">Contenido variado</p>
                                            <span class="font-normal dark:text-white/60">Disfruta de diferentes generos,
                                                diferentes medios, diferentes voces.</span>
                                        </div>
                                    </div>

                                    <div class="mb-5 border-b border-white/10" />

                                    <div class="flex gap-4 text-center">
                                        <div class="md:w-2/4 sm:w-1/2 w-full">
                                            <div class="dark:bg-card-background px-4 py-4 rounded-lg">
                                                <h2 class="title-font font-medium text-3xl text-white">
                                                    +{{ Math.ceil(media?.stats?.full_total_segments / 100) * 100 || 0 }}
                                                </h2>
                                                <p class="leading-relaxed">
                                                    {{ $t('home.stats.sentenceCount') }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="md:w-2/4 sm:w-1/2 w-full">
                                            <div class="dark:bg-card-background px-4 py-4 rounded-lg">
                                                <h2 class="title-font font-medium text-3xl text-white">{{
                                            media?.stats?.full_total_animes || 0 }}</h2>
                                                <p class="leading-relaxed">
                                                    {{ $t('home.stats.mediaCount') }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-5 border-b border-white/10" />
                                </div>

                                <div class="flex-grow xl:max-w-[60rem]">
                                    <section class="w-full rounded-lg">
                                        <div class="tab-content md:mx-2 flex-grow w-full">
                                            <div class="inline-flex justify-between items-center w-full mb-4">
                                                <h1
                                                    class="text-2xl font-bold md:text-3xl md:leading-tight dark:text-white">
                                                    {{ $t('animeList.recentlyAddedTitle') }}
                                                </h1>
                                                <NuxtLink to="/search/media">
                                                    <button type="button"
                                                        class=" py-3 px-4 inline-flex justify-center rounded-lg items-center gap-4 transition-all   font-medium dark:hover:bg-button-primary-hover  align-middle text-base ">
                                                        {{ $t('animeList.seeAll') }}
                                                        <svg class="w-2.5 h-auto" width="17" height="16"
                                                            viewBox="0 0 17 16" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
                                                                fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                </NuxtLink>
                                            </div>

                                            <div
                                                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-3">
                                                <div v-if="media?.results.length > 0"
                                                    v-for="(media_info, index) in media.results"
                                                    class="w-full relative">
                                                    <Popper class="w-full" zIndex="50" arrow v-bind="$attrs" hover
                                                        openDelay="0" closeDelay="100">
                                                        <div
                                                            class="border-none pb-[145%] rounded-lg overflow-hidden relative bg-[rgba(255,255,255,0.1)] block">
                                                            <img class="w-full h-full object-cover absolute top-0 left-0"
                                                                :src="media_info.cover + '?width=460&height=652'" />
                                                            <!-- 
                                                                <span
                                                                class="absolute bottom-1 left-1 rounded-lg bg-[#3c1352] text-white font-bold text-xs px-2 py-1"
                                                                >
                                                                {{ media_info.airing_format }}
                                                                </span>
                                                                -->
                                                        </div>
                                                        <template #content>
                                                            <div
                                                                class="w-full backdrop-blur-sm bg-sgray2/90 flex flex-col max-w-[400px]">
                                                                <span
                                                                    class="mx-auto object-center mt-2 text-center px-2 text-lg font-bold text-gray-800 dark:text-white">{{
                                            media_info.english_name }}</span>
                                                                <div
                                                                    class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 min-w-[400px]">
                                                                    <div
                                                                        class="pb-[20%] overflow-hidden relative bg-[rgba(255,255,255,0.1)] block">
                                                                        <img class="object-cover absolute top-0 left-0"
                                                                            :src="media_info.banner" />
                                                                    </div>
                                                                    <div class="mt-3 break-words">
                                                                        <p>
                                                                            <span
                                                                                class="font-bold pt-3 first:pt-0 dark:text-white">{{
                                            t('animeList.romajiName') }}:</span>
                                                                            {{ media_info.romaji_name }}
                                                                        </p>
                                                                        <p>
                                                                            <span
                                                                                class="font-bold pt-3 first:pt-0 dark:text-white">{{
                                            t('animeList.japaneseName') }}:</span>
                                                                            {{ media_info.japanese_name }}
                                                                        </p>
                                                                        <p>
                                                                            <span
                                                                                class="font-bold pt-3 first:pt-0 dark:text-white">{{
                                            t('animeList.seasons') }}:</span>
                                                                            {{ media_info.num_seasons }}
                                                                        </p>
                                                                        <p>
                                                                            <span
                                                                                class="font-bold pt-3 first:pt-0 dark:text-white">{{
                                            t('animeList.episodes') }}:
                                                                            </span>
                                                                            {{ media_info.num_episodes }}
                                                                        </p>
                                                                        <p>
                                                                            <span
                                                                                class="font-bold pt-3 first:pt-0 dark:text-white break-words">{{
                                            $t('animeList.genres') }}:
                                                                            </span>
                                                                            {{ media_info.genres.toString() }}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </Popper>

                                                    <div
                                                        class="mt-2 text-center justify-center flex flex-col items-center">
                                                        <h3 class="text-sm text-center font-semibold line-clamp-2">{{
                                                            media_info.english_name }}</h3>
                                                    </div>
                                                    <div
                                                        class="text-center mt-1 mb-5 justify-center flex flex-col items-center">
                                                        <h3 class="text-sm text-center font-medium line-clamp-2">
                                                            {{ media_info.num_segments }} {{
                                                            $t('animeList.sentenceCount') }}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div v-else role="status" v-for="i in 10"
                                                    class="animate-pulse relative">
                                                    <div
                                                        class="w-full pb-[145%] rounded-lg items-center overflow-hidden relative bg-[rgba(255,255,255,0.1)] block">
                                                    </div>
                                                    <div
                                                        class="mt-2 text-center justify-center flex flex-col items-center">
                                                        <div
                                                            class="h-2.5 bg-gray-200 rounded-full dark:bg-sgray w-36 mt-2 mb-4">
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="text-center mt-1 mb-4 justify-center flex flex-col items-center">
                                                        <div
                                                            class="h-2.5 bg-gray-200 rounded-full dark:bg-sgray w-28 mb-4">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="pb-10">
                    <div class="rounded-lg mx-auto max-w-[88%] p-6 dark:text-white/80 dark:bg-card-background relative">
                        <section class="py-2">
                            <div class="flex mb-2 flex-col md:flex-row justify-top">
                                <div class="md:flex-1">
                                    <h2 class="text-2xl font-bold md:text-2xl mb-3 md:leading-tight dark:text-white">¿Te
                                        gusta Nadeshiko?
                                    </h2>
                                    <p class="text-md max-w-2xl text-gray-800 dark:text-gray-200">
                                        Si encuentras este sitio útil, puedes apoyar nuestro trabajo y su futuro
                                        desarrollo con una
                                        contribución en nuestro Github, una donación o compartiendo este sitio con otras
                                        personas.
                                    </p>
                                </div>
                                <div class="md:flex-1 mx-2 flex items-center justify-end space-x-4">
                                    <div class="mt-5 w-auto bg-white p-1 rounded-md">
                                        <a href="https://github.com/BrigadaSOS">
                                            <img class="h-10 object-contain" src="../assets/public/github.png"
                                                alt="GitHub" />
                                        </a>
                                    </div>
                                    <div class="mt-5 w-auto">
                                        <a href="https://patreon.com/BrigadaSOS">
                                            <img class="h-12 object-contain rounded-md"
                                                src="../assets/public/patreon.png" alt="Become a Patron" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>
