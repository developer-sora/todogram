import { localRead } from "./util/helper.js";
import factoryMaker from "./factory.js";

export const App = {
  state: {
    todoList: [],
  },

  setState(nextState) {
    this.state = nextState;
  },

  target: {},

  init({ $target }) {
    if (localRead("todoList")) {
      this.setState({
        todoList: localRead("todoList"),
      });
    } else {
      this.setState({
        todoList: [],
      });
    }
    this.target = $target;
    this.components();
  },

  components() {
    const header = new factoryMaker({
      $target: this.target,
      component: "header",
    });
    header.render();

    const input = new factoryMaker({
      $target: this.target,
      component: "input",
      state: this.state,
      setTodoList: (title) => {
        const newTodoList = {
          title,
          completed: false,
          id: new Date().getTime(),
        };
        this.setState({
          todoList: [...this.state.todoList, newTodoList],
        });
        todoList.addTodo(newTodoList);
      },
    });
    input.render();

    const todoList = new factoryMaker({
      $target: this.target,
      component: "todoList",
      state: this.state,
    });
    todoList.render();
  },
};
