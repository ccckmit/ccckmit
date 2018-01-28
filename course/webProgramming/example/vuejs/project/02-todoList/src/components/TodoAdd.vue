<template>
  <div id="addTodo">
    <input
      type="text"
      name=""
      class="input"
      value=""
      v-model="todo"
      @keyup.enter="addTodo"
    >
    <button
      type="button"
      name="button"
      @click="addTodo"
    >
        添加
    </button>
  </div>
</template>
<script>
export default {
  name: 'addTodo',
  data: () => ({
    todo: ''
  }),
  methods: {
    addTodo () {
      if (this.todo) {
        this.$emit('add', this.todo)
        this.todo = ''
      } else {
        alert('内容不能为空')
      }
    }
  }
}
</script>
<style scoped>
.input {
  min-width: 200px;
}
</style>
