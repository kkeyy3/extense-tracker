
let extenses = []
extenses = loadExtenses()

const categories = ["Еда", "Транспорт", "Развлечение", "Учёба", "Другое"]

function saveExtenses() {   localStorage.setItem("array", JSON.stringify(extenses)) }

function loadExtenses() {
    const saved = localStorage.getItem("array")
    if (saved === null) return []

    try {
        const newExtenses =  JSON.parse(saved)
        return Array.isArray(newExtenses) ? newExtenses : []
    } catch (error) {
        console.warn("Данные повреждены, не сможем их загрузить " +  error.message)
        return []
    }
}

function fillSelect(select, array) {
    for (const item of array) { select.add(new Option(item, item)) }
}


function createNewId() {
    if (extenses.length === 0) return 1
    const maxId = Math.max(...extenses.map(extense => extense.id))
    return maxId + 1
}


const app = document.querySelector(".app")


    const form = document.createElement("form")
    form.className = "form"

    const descriptionInput = document.createElement("input")
    descriptionInput.placeholder = "Введите описание расхода"
    descriptionInput.className = "description-input"
    descriptionInput.type = "text"
    descriptionInput.autocomplete = "off"

    const AmountInput = document.createElement("input")
    AmountInput.placeholder = "Введите сумму"
    AmountInput.className = "amount-input"
    AmountInput.type = "number"


    const categoriesSelect = document.createElement("select")
    categoriesSelect.className = "categories-select"
    fillSelect(categoriesSelect, categories)

    const sbmBtn = document.createElement("button") 
    sbmBtn.className = "submit-btn"
    sbmBtn.type = "submit"
    sbmBtn.textContent = "Добавить расход"
    

app.appendChild(form)
form.appendChild(descriptionInput)
form.appendChild(AmountInput)
form.appendChild(categoriesSelect)
form.appendChild(sbmBtn)


form.addEventListener("submit", (e) =>{
    e.preventDefault()
    addExtense()
})

function addExtense() {
    if (descriptionInput.value.trim() === "") return
    if (AmountInput.value <= 0) return

    const extense = {
        description: descriptionInput.value,
        amount: Number(AmountInput.value),
        category: categoriesSelect.value,
        id: createNewId(),
        date: Date.now()
    }

    descriptionInput.value = ""
    AmountInput.value = null

    extenses.push(extense)
    saveExtenses()
    render()
    message("вы добавили новый расход")
}

    const filterNSort = document.createElement("div")
    filterNSort.className = "filter-and-sort"

        const categoriesFilter = document.createElement("select")
        categoriesFilter.className = "categories-select-filter"
        categoriesFilter.add(new Option("Все категории", "Все категории"))
        fillSelect(categoriesFilter, categories)



        const summSort = document.createElement("select")
        summSort.className = "summ-sort"
        summSort.add(new Option("От нового к старому", "newest"))
        summSort.add(new Option("От старого к новому", "oldest"))
        summSort.add(new Option("От наименьшего к большему", "ascend"))
        summSort.add(new Option("От наибольшего к меньшему", "descend"))


        app.appendChild(filterNSort)
        filterNSort.appendChild(categoriesFilter)
        filterNSort.appendChild(summSort)


const cards = document.createElement("div")
cards.className = "cards"

app.appendChild(cards)

function render() {
    cards.innerHTML = ""
    const array =  filterAndSort()
    
    array.forEach(extense => {
        const extenseCard = document.createElement("div")
        extenseCard.className = "card"
        extenseCard.dataset.id = extense.id

        const cardDescription = document.createElement("h2")
        cardDescription.className = "description-card"
        cardDescription.textContent = extense.description

        const cardCategory = document.createElement("h3")
        cardCategory.className = "card-category"
        cardCategory.textContent = extense.category
        
        const cardSumm = document.createElement("h2")
        cardSumm.className = "card-summ"
        cardSumm.textContent = extense.amount + " рублей"

        const delBtn = document.createElement("button")
        delBtn.className = "delete-btn"
        delBtn.textContent = "удалить"






        cards.appendChild(extenseCard)
        extenseCard.appendChild(cardDescription)
        extenseCard.appendChild(cardCategory)
        extenseCard.appendChild(cardSumm)
        extenseCard.appendChild(delBtn)

    })

        const currentSum = document.createElement("h2")
            currentSum.className = "current-sum"
            let sum = 0
            array.forEach(extense => {
                sum+= Number(extense.amount)
            })
            currentSum.textContent = (sum !== 0) ? "Траты: " + sum + " рублей" : "Поменяйте категорию, либо добавьте расход"

            cards.appendChild(currentSum)

}
render()


function filterAndSort() {
    const currentCategory = categoriesFilter.value
    const currentSort = summSort.value

    const filtered = extenses.filter(extense => currentCategory === "Все категории" || currentCategory === extense.category)
    let sorted
    if (currentSort === "ascend") {  sorted = filtered.sort((a, b) => a.amount - b.amount )  }
    if (currentSort === "descend") { sorted = filtered.sort((a, b) => b.amount - a.amount )   }
    if (currentSort === "newest") {  sorted = filtered.sort((a, b) => b.date - a.date ) }
    if (currentSort === "oldest") {  sorted = filtered.sort((a, b) => a.date - b.date )  }
    return sorted
}

categoriesFilter.addEventListener("change", () => {render()})
summSort.addEventListener("change", () => {render()})


cards.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn")
    if (!deleteBtn) return

    const deletingCard = e.target.closest(".card")
    const deletingId = Number(deletingCard.dataset.id)

    const array = extenses.filter(extense => extense.id !== deletingId)
    extenses = array
    message("Вы удалили свой расход")
    saveExtenses()
    render()

})






function message(text) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = text

    app.appendChild(toast)

    setTimeout(() => {
        toast.remove()
    }, 3000)
}