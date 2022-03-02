const todoForm = document.querySelector("#todo-form"); //todoForm 불러오기
const todo = todoForm.querySelector("input"); //todo 입력된 값 불러오기
const todoList = document.querySelector("#todo-list"); //todolist 불러오기

let todoThings = []; 
const TODO_STORAGE = "todo_storage"
const HIDDEN_CLASSNAME = "hidden";
DONE_CLASSNAME = "done";

function handleToDo(event) {
    event.preventDefault();          //기본 수행되는 새로고침 막기

    const newTodo = todo.value;      //입력 받은 값 저장하기
    todo.value="";                   //입력 후 입력란 다시 비우기
    //삭제 시 비교확인을 위해 각 todo에 id 할당
    const newTodoObj = {
        text : newTodo,
        id : Date.now(),             //id는 1000분의 1초까지 제공하는 시간함수
    }                   

    todoThings.push(newTodoObj);     //배열에 넣기
    addToDo(newTodoObj);             //리스트에 올리기
    saveTodo();                      //기억공간에 저장
}

function addToDo(newTodoObj) {
    //list 추가
    const li = document.createElement("li");     //html에 추가 위해서 li생성
    li.id = newTodoObj.id;                       //각 li의 아이디를 newTodoObj의 id로 설정 (삭제 시 비교확인을 위해)
    todoList.appendChild(li);                    //todoList에 li 추가

    //할일 완료 버튼
    const checkButton = document.createElement("button");
    checkButton.innerText = "☑";
    checkButton.id = "checkButton";
    checkButton.addEventListener("click", doneToDo);
    li.appendChild(checkButton);

    //list 내용
    const span = document.createElement("span"); //text 입력할 span 생성
    span.innerText =newTodoObj.text;
    li.appendChild(span);                        //li에 span 추가

    const button = document.createElement("span");

    //수정 form 생성하기
    const editForm = document.createElement("form");
    const editInput = document.createElement("input");   //입력란
    editInput.type = "text";
    editForm.appendChild(editInput);
    li.appendChild(editForm);
    editForm.classList.add(HIDDEN_CLASSNAME);             //수정 form 감춰놓기
    
    //수정 버튼
    const editButton = document.createElement("button");
    editButton.innerText = "수정";
    editButton.addEventListener("click", editToDo);
    button.appendChild(editButton);

    //삭제 버튼
    const deleteButton = document.createElement("button");  //삭제 button 생성
    deleteButton.innerText = "삭제";
    deleteButton.addEventListener("click", deleteToDo);
    button.appendChild(deleteButton);

    li.appendChild(button);
}

function deleteToDo(button) {
    const li = button.target.closest("li"); //상위 요소중 가장 가까운 li
    li.remove();                            //일단 리스트에서 없애고
    todoThings = todoThings.filter((item) => item.id !== parseInt(li.id)); //배열 중 해당 리스트의 아이디와 일치하지 않는 item만 살려서 다시 배열 업데이트
    saveTodo(); //기억공간 배열 다시 저장

    if(todoList.childElementCount !== 8){
        todo.placeholder = "해야 할 일을 입력해주세요!";
        todoForm.querySelector("input").disabled = false;
        todoForm.querySelector("button").disabled = false;
    }
}

function doneToDo(button) {
    const li = button.target.parentElement;
    const text = li.querySelector("span");
    text.classList.add(DONE_CLASSNAME);
}

function editToDo(button) {
    //
    const li = button.target.closest("li");
    const span = li.querySelector("span");
    const buttonSpan = li.querySelector("span:last-child");
    const editForm = li.querySelector("form");
    const editInput = li.querySelector("input");
    const oldText = span.innerText;
    span.classList.add(HIDDEN_CLASSNAME);

    //수정, 삭제 버튼 숨기기
    const editButton = buttonSpan.querySelector("button"); 
    editButton.classList.add(HIDDEN_CLASSNAME);
    const deleteButton = buttonSpan.querySelector("button:last-child"); 
    deleteButton.classList.add(HIDDEN_CLASSNAME);

    editInput.placeholder = oldText;                     //수정 form 보이게 하기
    editForm.classList.remove(HIDDEN_CLASSNAME);
    
    const endButton = document.createElement("button");  //완료 버튼
    endButton.innerText = "완료";
    const cancelButton = document.createElement("button"); //수정 취소 버튼
    cancelButton.innerText = "취소";

    buttonSpan.appendChild(cancelButton);
    buttonSpan.appendChild(endButton);
       
    endButton.addEventListener("click", changeTodo);
    editForm.addEventListener("submit", changeTodo);
    cancelButton.addEventListener("click", cancelEdit);
}

function changeTodo(event) {
    event.preventDefault();
    const li = event.target.closest("li");

    const span = li.querySelector("span");
    const buttonSpan = li.querySelector("span:last-child");
    const editInput = li.querySelector("input");

    span.innerText = editInput.value;               //list 수정된 내용으로 바꾸기
    span.classList.remove(HIDDEN_CLASSNAME);
    
    const editForm = li.querySelector("form");      //수정 form 다시 감추기
    editForm.classList.add(HIDDEN_CLASSNAME);
    const cancelButton = buttonSpan.querySelector("button:last-child");
    cancelButton.remove();
    const endButton = buttonSpan.querySelector("button:last-child");
    endButton.remove();
    
    //수정, 삭제 버튼 다시 보이게하기
    const editButton = buttonSpan.querySelector("button");
    editButton.classList.remove(HIDDEN_CLASSNAME);
    const deleteButton = buttonSpan.querySelector("button:last-child");
    deleteButton.classList.remove(HIDDEN_CLASSNAME);
    
    //해당 li의 id와 똑같은 id를 찾아서 index값 얻어낸 후 text값 수정하기
    let index = todoThings.findIndex(item => item.id === parseInt(li.id));
    todoThings[index].text = editInput.value;
      
    saveTodo();
}

function cancelEdit(event) {
    const li = event.target.closest("li");
    const span = li.querySelector("span");
    const buttonSpan = li.querySelector("span:last-child");
    
    span.classList.remove(HIDDEN_CLASSNAME);        //내용 다시 보이게 하기

    const editForm = li.querySelector("form");      //수정 form 다시 감추기
    editForm.classList.add(HIDDEN_CLASSNAME);
    const cancelButton = buttonSpan.querySelector("button:last-child");
    cancelButton.remove();
    const endButton = buttonSpan.querySelector("button:last-child");
    endButton.remove();
    
    //수정, 삭제 버튼 다시 보이게하기
    const editButton = buttonSpan.querySelector("button");
    editButton.classList.remove(HIDDEN_CLASSNAME);
    const deleteButton = buttonSpan.querySelector("button:last-child");
    deleteButton.classList.remove(HIDDEN_CLASSNAME);
}

//todolist들 기억하기
function saveTodo() {
    localStorage.setItem(TODO_STORAGE, JSON.stringify(todoThings));
}

const savedTodos = localStorage.getItem(TODO_STORAGE);

if(savedTodos){ //저장된 todo들이 있다면
    const todoArray = JSON.parse(savedTodos); //string -> array로 다시 변환
    todoThings = todoArray; // 배열에 다시 넣어주고
    todoArray.forEach((item) => addToDo(item)); //각 element에 addToDo 적용
}

//main
todoForm.addEventListener("submit", handleToDo);








