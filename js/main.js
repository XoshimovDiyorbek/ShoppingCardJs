const productCards = document.querySelectorAll('.products .card')
const cartWrapper = document.querySelector('.cart-wrapper')
const total = document.querySelector('.total')
const orderBtn = document.querySelector('.order')
const modal = document.querySelector('.order-layer')
const closeBtn = document.querySelector('.close-modal')
const buyBtn = document.querySelector('.get')
const username = document.querySelector('.form input[type="text"]')
const phone = document.querySelector('.form input[type="number"]')

let totalPrice = 0

// Add to cart
productCards.forEach((card, idx) => {
    card.addEventListener('click', e => {
        addBtn = e.target
        if(!addBtn.classList.contains('btn-success')) return
        
        const clickedProduct = {
            id: idx,
            img: card.querySelector('img').src,
            name: card.querySelector('.name').textContent,
            price: card.querySelector('.price').textContent
        }
        setCartToLocaleStorage(clickedProduct)
        clearCart()
        drawCartItems()
    })
})

// Set to locale storage
function setCartToLocaleStorage(data = {}) {
    let cartData = []
    const storage = localStorage.getItem('cart')
    
    if(!storage) {
        localStorage.setItem('cart', JSON.stringify(cartData))
        return
    }
    
    const storageData = JSON.parse(storage)
    cartData = storageData
    
    cartData[data.id] = data
    localStorage.setItem('cart', JSON.stringify(cartData))
}

setCartToLocaleStorage()

// Draw Cart Items
function drawCartItems() {
    const storage = localStorage.getItem('cart')
    const storageData = JSON.parse(storage)
    if(storageData.length === 0) return
    
    storageData.forEach(data => {
        if(!data) return
        
        const cartItem = document.createElement('div')
        const image = document.createElement('img')
        const textWrapper = document.createElement('div')
        const name = document.createElement('div')
        const price = document.createElement('div')
        const removeBtn = document.createElement('button')
        
        cartItem.classList.add('card', 'cart-item')
        name.classList.add('name')
        price.classList.add('price')
        removeBtn.classList.add('btn', 'btn-danger')
      
        image.src = data.img
        name.textContent = data.name
        price.textContent = data.price
        removeBtn.textContent = 'Remove'
        removeBtn.setAttribute('data-id', data.id)
        
        textWrapper.append(name, price)
        cartItem.append(image, textWrapper, removeBtn)
        cartWrapper.append(cartItem)
    })
    getTotalPrice()
}
drawCartItems()

// Clear cart
function clearCart() {
    const cartItems = document.querySelectorAll('.cart-item')
    if(cartItems.length) {
        cartItems.forEach(item => item.remove())
    }
}

// Remove item from cart
cartWrapper.addEventListener('click', e => {
    removeBtn = e.target
    if(!removeBtn.classList.contains('btn-danger')) return
    const dataId = parseInt(removeBtn.getAttribute('data-id'))
    
    const storage = localStorage.getItem('cart')
    const storageData = JSON.parse(storage)
    
    delete storageData[dataId]
    
    localStorage.clear('cart')
    localStorage.setItem('cart', JSON.stringify(storageData))
    clearCart()
    drawCartItems()
})

// Get total price
function getTotalPrice() {
    totalPrice = 0
    
    const storage = localStorage.getItem('cart')
    if(!storage) return
    const storageData = JSON.parse(storage)
    storageData.forEach(item => {
        if(!item) return
        totalPrice += parseInt(item.price)
    })
    total.textContent = totalPrice + '$'
}
getTotalPrice()

// Open modal
orderBtn.addEventListener('click', () => {
    modal.classList.add('active')
})

// Close Modal
closeBtn.addEventListener('click', closeModal)

function closeModal() {
    modal.classList.remove('active')
}

// Send to telegram
buyBtn.addEventListener('click', async () => {
    if(username.value == '' || phone.value == '') return
    
    let msg = ""
    const token = "5289296568:AAEP2T_Wa6GD-ai53wD7UtRHbgXoNaC7pns"
    const chatId = "-696048636"
    
    const storage = JSON.parse(localStorage.getItem('cart'))
    if(!storage) return
    
    storage.forEach(item => {
        if(!item) return
        msg += `Продукт: %0A ${item.name} %0A`
        msg += `${item.price} %0A %0A`
    })
    
    msg += `Имя: ${username.value} %0A`
    msg += `Телефон: ${phone.value} %0A %0A`
    msg += `Общая сумма: ${totalPrice}`
    
    const url = 'https://api.telegram.org/bot'+ token +'/sendMessage?chat_id=' + chatId + '&parse_mode=html&text=' + msg
    
    buyBtn.classList.add('disabled')
    buyBtn.textContent = 'Отправляется'
    
    await fetch(url)
    alert('Ваша заявка принята')
    username.value = ''
    phone.value = ''
    closeModal()
    
    buyBtn.classList.remove('disabled')
    buyBtn.textContent = 'Заказать'
    
    localStorage.clear('cart')
    clearCart()
    drawCartItems()
    getTotalPrice()
})