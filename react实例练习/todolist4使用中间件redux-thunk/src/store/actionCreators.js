import axios from 'axios'
import {
	CHANGE_INPUT_VALUE,
	ADD_TODO_ITEM,
	DELETE_TODO_ITEM,
	INIT_LIST_ACTION,
} from "./actionTypes";

// export const getInputChangeAction = (value)=> {
//     return {
//         type: CHANGE_INPUT_VALUE,
//         value
//     }
// }

//上面的简写
export const getInputChangeAction = (value) => ({
	type: CHANGE_INPUT_VALUE,
	value
})

export const getAddItemAction = () => ({
	type: ADD_TODO_ITEM
})

export const getDeleteItemAction = (index) => ({
	type: DELETE_TODO_ITEM,
	index
})

export const initListAction = (data) => ({
	type: INIT_LIST_ACTION,
	data
});

export const getTodoList = ()=>{
	return (dispatch)=>{
		axios.get('/api/list.json').then(res => {
			const data = res.data
			const action = initListAction(data)
			dispatch(action);
		})
	}
}


// redux-thunk 使得创建action是一个函数形式，函数能够接受dispatch方法