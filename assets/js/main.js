$(document).ready(function(){

    const form = $('#todoForm')
    
    //FONCTION PERMETTANT DE SAUVEGARDER UN ARTICLE EN LOCAL
    function saveLocalData(data){

        if (typeof(localStorage) !== "undefined") {
            
            return localStorage.setItem("todos", JSON.stringify(data))
        }
    }
    //FONCTION PERMETTANT DE RECUPERER LES ARTICLES SAUVEGARDER EN LOCAL
    function getLocalData(){

        if (typeof(localStorage) !== "undefined") {
            
            return JSON.parse(localStorage.getItem("todos")) || []
        }else{
            return []
        }
    }

    //INITIALISATION DE LA LISTE DES ARTICLES ET LE SAUVEGARDE LOCAL
    let todos = getLocalData()

    /**
     * FONCTION QUI GERE LA LISTE DES ARTICLES ET LES ACTIONS A EFFECTUER
     * MODIFIER - SUPPRIMER - ACCOMPLIR
     */
    refreshTodo()
    function refreshTodo(){
        const todoList = $('#todoList')
        todoList.html('')
        todos.forEach(todo =>{

            const li = document.createElement('li')
            li.className = "todo-item"
            const span = document.createElement('span')
            const upDate = document.createElement('button')
            const deleteTodo = document.createElement('button')
            const accomplis = document.createElement('button')


            upDate.onclick = ()=>toggleUpdate(todo)
            if (todo.isUpdating) {
                const input = document.createElement('input')
                input.value = todo.name
                input.onchange = (event)=>changeUpadate(event, todo)
                upDate.className = 'btn btn-warning'
                upDate.innerText = "Sauvegarder"

                li.appendChild(input)
            }else{
                span.innerText = todo.name
                upDate.className = 'btn btn-primary'
                upDate.innerText = "Modifier" 
                li.append(span)

            }
            
            
            accomplis.onclick = ()=>toggleDone(todo)
            if (todo.isDone) {
                span.classList.add('done')
                accomplis.className = 'btn btn-done'
                accomplis.innerText = "Accomplis"
                accomplis.setAttribute('disabled', true)
                upDate.style.display = "none"
                deleteTodo.style.display = "none"
                li.classList.add('isDone')
  
            }else{
                accomplis.innerText = "Accomplir"
                accomplis.className = 'btn btn-success'

            }

            deleteTodo.onclick = ()=>handleDelete(todo)
            deleteTodo.className = 'btn btn-danger'
            deleteTodo.innerText = "Supprimer"

            li.append(upDate)
            li.append(accomplis)
            li.append(deleteTodo)
            todoList.append(li)
            
          
        })
    }
   
    /**
     * 
     * @param {Element} todo 
     * FONCTION PERMETTANT DE CHANGER LA VALEUR DE isUpdating EN TRUE
     */
    function toggleUpdate(todo){

        const index = todos.findIndex(t => t._id === todo._id)
        todos[index].isUpdating = !todo.isUpdating

        saveLocalData(todos)
        refreshTodo()
    }

    /**
     * 
     * @param {Event} event 
     * @param {Element} todo 
     * FONCTION PERMETTANT DE MODIFIER LE NOM D'UN ARTICLE
     */
    function changeUpadate(event, todo){
        const name = event.target.value.trim()

        if (name) {
            todo.name = name
            const index = todos.findIndex(t => t._id === todo._id)
            todos[index] = todo
        }

        saveLocalData(todos)

    }

        
    /**
     * 
     * @param {Element} todo 
     * FONCTION PERMETTANT DE CHANGER LA VALEUR DE isDone EN TRUE
     */
    function toggleDone(todo){
        const index = todos.findIndex(t => t._id === todo._id)
        todos[index].isDone = !todo.isDone

        saveLocalData(todos)
        refreshTodo()
    }

    /**
     * 
     * @param {id} param0 
     * FONCTION PERMETTANT DE SUPPRIMER UN ARTICLE
     */
    function handleDelete({_id}){
        todos = todos.filter(todo => todo._id !==_id)

        saveLocalData(todos)
        refreshTodo()
    }


    form.submit(function(event){

        event.preventDefault()
        const input = $('#todo')
        const todoName = input.val().trim()

        if (todoName) {
            const todo = {
                _id  : Math.round(Math.random()*858541),
                name : todoName,
                isUpdating : false,
                isDone : false,
                createdAt : new Date() 
            }

            todos.push(todo)
            saveLocalData(todos)
            refreshTodo()
        }

        input.val('')

    })


    /**
     * FILTARAGE DES TACHES
     */
    $('.tache-item').click(function(){

        $(this).addClass('active').siblings().removeClass('active')


        let filter = $(this).attr('data-filter')
        let children = $('.todo-item').siblings()

        if (filter == "all") {

            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                
               child.style.display = "flex"
            }

            form.show()


        }else if (filter =="accomplis") {
           
            
            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                
                if (child.className.includes('isDone') == true) {
                    
                  child.style.display = "flex"
                }else{
                    child.style.display = "none"
                }
            }

            form.hide()
          
        }else{

            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                
                if (child.className.includes('isDone') == false) {
                    
                  child.style.display = "flex"
                }else{
                  child.style.display = "none"
                }

            }

            form.hide()

        }

    })
    
})