<template>
    <button
        :id="dropdownId"
        type="button"
        class="hs-dropdown-toggle py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:hover:bg-white/20 dark:text-neutral-400 dark:hover:text-neutral-300"
    >
        <slot></slot>
        <svg class="hs-dropdown-open:rotate-180  size-4" xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    </button>

</template>

<script setup>
defineProps({
    dropdownId: {
        type: String,
        required: true,
    }
});
</script>

<style>
.hs-dropdown-toggle svg {
    transition: transform 0.3s;
}

.hs-dropdown-open .hs-dropdown-toggle svg {
    transform: rotate(180deg);
}
</style>
