<template>
  <span class="loader m-2"></span>
</template>

<style>

.loader {
  border: 6px solid #b8b8b8;
  border-top: 6px solid #838383;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
