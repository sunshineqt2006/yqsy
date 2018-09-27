const directives = {
  cinemaFilter: {
    bind: (el, binding) => {
      console.log(binding)
    }
  }
}

export default {
  install (vue, options) {
    for (let key in directives) {
      vue.directive(key, directives[key])
    }
  }
}
