<template>
    <div>
      <button>Click me</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MyComponent',
    mounted() {
      this.$nextTick(() => {
        // código de Vue aquí
      });
    }
  }
  </script>
  
  <script>
  import $ from 'jquery';
  
  $(document).ready(function() {
    // código de jQuery aquí
  });
  </script>
  