<template>
  <div id="todoList">
    <h1>Todo List</h1>
    <todo-add v-on:add="addTodo"></todo-add>
    <ul class="todos">
      <li v-for="todo, index in todos" class="todo">
        <input
          type="checkbox"
          name=""
          value=""
          :checked="todo.isCompleted"
          @click="completed(index)"
        >
        <span
          :class="todo.isCompleted ? 'completed' : ''"
          @click="completed(index)"
        >
          <em>{{ index }}.</em>{{ todo.text }}
        </span>
      </li>
    </ul>
    <div>
      <p v-show="todos.length === 0">
        恭喜！所有的事情都已完成！
      </p>
      <p v-show="todos.length !== 0">
        共 <strong>{{ todos.length }}</strong> 个待办事项。{{ completedCounts }} 个已完成，{{ notCompletedCounts }} 个未完成。
      </p>
    </div>
  </div>
</template>
<script>
import TodoAdd from './TodoAdd.vue'
export default {
  name: 'TodoList',
  components: {
    TodoAdd
  },
  data: () => ({
    todos: [{
      text: '吃饭',
      isCompleted: false
    }, {
      text: '睡觉',
      isCompleted: false
    }]
  }),
  methods: {
    completed (index) {
      this.todos[index].isCompleted = !this.todos[index].isCompleted
    },
    addTodo (todo) {
      this.todos.push({
        text: todo,
        isCompleted: false
      })
    }
  },
  computed: {
    completedCounts () {
      return this.todos.filter(item => item.isCompleted).length
    },
    notCompletedCounts () {
      return this.todos.filter(item => !item.isCompleted).length
    }
  }
}
</script>
<style scoped>
#todoList {
  margin: 0 auto;
  max-width: 350px;
}
.todos li {
  list-style: none;
}
.todo {
  text-align: left;
  cursor: pointer;
}
.completed {
  text-decoration: line-through;
}
</style>
