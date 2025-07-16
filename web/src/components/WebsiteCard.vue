<template>
  <div
    class="group relative block h-full bg-white dark:bg-gray-800 before:absolute before:inset-0 before:border-2 before:border-dashed before:border-gray-200 dark:before:border-gray-700 before:rounded-lg"
  >
    <div
      class="h-full rounded-lg border-2 border-transparent bg-white dark:bg-gray-800 p-4 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <img
            v-if="website.logo"
            :src="website.logo"
            alt="Logo"
            class="h-12 w-12 rounded-lg object-cover"
          />
          <div>
            <h2 class="font-bold text-gray-900 dark:text-white">
              {{ website.title }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ website.category.name }}
            </p>
          </div>
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {{ website.shortDesc }}
      </p>
      <div class="mt-4 flex flex-wrap gap-1">
        <div
          v-for="tag in website.tags"
          :key="tag._id"
          class="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          # {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 为 Props 提供更完整的类型定义
defineProps<{
  website: {
    _id: string;
    logo: string;
    title: string;
    category: { _id: string; name: string };
    shortDesc: string;
    longDesc?: string;
    url: string;
    tags: { _id: string; name: string }[];
    thumbnails: string[];
  };
}>();
</script>
