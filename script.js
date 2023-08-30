const valueInput = document.querySelector("#input-value")
const descriptionInput = document.querySelector("#input-description")
const typeInput = document.querySelector("#item-type-input")
const addItemBtn = document.querySelector("#add-item-btn")
const despesaList = document.querySelector(".despesa-list")
const receitaList = document.querySelector(".receita-list")
const totalReceita = document.querySelector("#total-receita")
const totalDespesa = document.querySelector("#total-despesa")
const restante = document.querySelector("#restante")

let itemsList = JSON.parse(localStorage.getItem("itemsList")) || []

// Preenche a lista com os itens do Local Storage ao carregar a página
if (localStorage.getItem("itemsList")) {
   updateItemList()
}
// calcula e atualizar os totais de despesa, receita e restante
function calTotal() {
   let calcDespesa = 0
   let calcReceita = 0

   for (let i = 0; i < itemsList.length; i++) {
      if (itemsList[i].type === "despesa") {
         calcDespesa += itemsList[i].value
      } else if (itemsList[i].type === "receita") {
         calcReceita += itemsList[i].value
      }
   }

   let calcRestante = calcReceita - calcDespesa

   totalDespesa.innerHTML = `R$ ${calcDespesa}`
   totalReceita.innerHTML = `R$ ${calcReceita}`
   restante.innerHTML = `R$ ${calcRestante}`
}
// salva um novo item na lista
function saveItem() {
   const value = Number(valueInput.value)
   const description = descriptionInput.value
   const type = typeInput.value

   if (!value || !description) {
      window.alert("Preencha todos os campos!")
      return
   }

   const item = {
      id: new Date().getTime(),
      value: value,
      description: description,
      type: type,
      isDone: false,
   }

   itemsList.push(item)
   localStorage.setItem("itemsList", JSON.stringify(itemsList))

   updateItemList()

   valueInput.value = ""
   descriptionInput.value = ""
}
// cria os items do Local Storage no DOM
function createItem(item) {
   const itemEl = document.createElement("div")
   itemEl.id = item.id
   itemEl.className = "item " + item.type + (item.isDone ? " done-item" : "")

   const itemElMarkup = `
      <div class="item-content">
         <input type="checkbox" class="checkbox" ${
            item.isDone ? "checked" : ""
         } data-action="check">
         <p>R$<span class="item-value">${item.value}</span> </p>
         <p class="item-description">${item.description}</p>
      </div>
      <img class="menu-btn" id="edit-btn"src="assets/edit-icon.png" data-action="edit">
      <img class="menu-btn remove" id="remove-btn" data-action="remove" src="assets/trash-icon.png">
   `
   itemEl.innerHTML = itemElMarkup

   if (item.type == "despesa") {
      despesaList.appendChild(itemEl)
   } else {
      receitaList.appendChild(itemEl)
   }
   sortItemsByValue()
}
// Função para ordenar os itens pelo valor
function sortItemsByValue() {
   itemsList.sort((a, b) => b.value - a.value)
}
// atualiza a lista de itens no DOM e recalcular totais
function updateItemList() {
   despesaList.innerHTML = ""
   receitaList.innerHTML = ""
   itemsList.forEach((item) => createItem(item))
   localStorage.setItem("itemsList", JSON.stringify(itemsList))

   calTotal()
}
// Função para editar um item
function editItem(itemId) {
   itemsList.forEach((item) => {
      if (item.id === itemId) {
         const itemElement = document.getElementById(itemId)
         const removeItemBtn = itemElement.querySelector("#remove-btn")
         const itemDescription = itemElement.querySelector(".item-description")

         // mostra o botão remove item e diminuir descrição ao clicar no edit
         if (removeItemBtn) {
            removeItemBtn.classList.toggle("show")
         }

         if (removeItemBtn.classList.contains("show")) {
            itemDescription.style.width = "47%"
         } else {
            itemDescription.style.width = "60%"
         }

         const editedItem = (valueInput.value = item.value)
         descriptionInput.value = item.description
         typeInput.value = item.type
      }
   })
}
// Função para lidar com ações de check, remoção e edição
function handleAction(itemId, action) {
   if (action === "check") {
      itemsList.forEach((item) => {
         if (item.id === itemId) {
            item.isDone = !item.isDone
         }
      })
   } else if (action === "remove") {
      itemsList = itemsList.filter((item) => item.id !== itemId)
   }
   updateItemList()
}

function handleListClick(event) {
   const target = event.target
   const parentEl = target.closest(".item")
   if (!parentEl) return

   const itemId = Number(parentEl.id)
   const action = target.dataset.action
   if (!action) return

   if (action === "edit") {
      editItem(itemId)
   } else {
      handleAction(itemId, action)
   }
}

addItemBtn.addEventListener("click", saveItem)
despesaList.addEventListener("click", handleListClick)
receitaList.addEventListener("click", handleListClick)
