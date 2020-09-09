
const brainInfo = {
    selectName: 'test'
}

export function global (state = brainInfo, action) {
    switch (action.type) {
      case 'changeType':
        return {
          ...state,
          selectName:action.name
        }
      default:
        return state
    }
  }