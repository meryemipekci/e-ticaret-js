//html'den gelenler
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

//APİ islemleri
//html yuklenme ani
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});
const baseUrl = "https://api.escuelajs.co/api/v1";

// kategori bilgilerini alma
// 1-api-ye istek at
// 2-gelen veriyi işle
// 3-gelen veriyi kart seklinde ekrana basicak fonksiyonu calistir
// 4- cevap hatali olursa kullanıcıyı bilgilendir

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    .then((res) => res.json())
    .then((data) => {
      renderCategories(data.slice(1, 5));
    })

    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-card");
    categoryDiv.innerHTML = `
        <img src=${category.image} />
               
        <p>${category.name}</p>
        `;
    categoryList.appendChild(categoryDiv);
  });
}

// ------urunler için istek at

async function fetchProducts() {
  try {
    // ----istegi atar
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
  } catch (err) {
    // hata olursa yakalar
    console.log(err);
  }
}

//urunleri ekrana basar
function renderProducts(products) {
  //her bir urun icin kart html'i olustur ve diziye aktar
  const productsHTML = products
    .map(
      (product) => `
<div class="card">
<img src=${product.images[0]}/>
<h4>${product.title}</h4>
<h4>${product.category.name}</h4>
<div  class="action">
<p><span>${product.price} &#8378; </span></p>
<button onclick="addToBasket({id:${product.id},title:'${product.title}',price:${product.price},img: '${product.images[0]}',amount:1})">Sepete Ekle</button>
</div>
</div>
`
    )
    //dizi seklindeki veriyi virgulleri kaldirarak stringe donusturur
    .join(" ");
  console.log(products);
  //  urunler html listeye gonder
  productsArea.innerHTML = productsHTML;
}
//sepet degiskenleri
let basket = [];
let total = 0;

//!modal islemleri
basketBtn.addEventListener("click", () => {
  // sepeti acma
  modal.classList.add("active");
  // sepete urunleri listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

//! sepet işlemlemleri

//sepete ekleme islemi
function addToBasket(product) {
  // urun sepete daha once eklendimi?
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    // eleman sepette var >miktari arttttir
    found.amount++;
  } else {
    // eleman sepette yok> sepete ekle
    basket.push(product);
  }
}

// sepete elemanlari listeleme
function renderBasket() {
  const cardsHTML = basket
    .map(
      (product) => `
  <div class="item">
  <img src=${product.img}/>
  <h3 class="title">${product.title}</h3>
  <h4 class="price">${product.price} &#8378;</h4>
  <p>miktar: ${product.amount}</p>
  <img onClick="deleteItem(${product.id})" id="delete" src="image/trash.png" />
</div>
  `
    )
    .join(" ");
  // hazirladigimiz kartlari HTML'e gonderme
  basketList.innerHTML = cardsHTML;
  calculateTotal();
}

// sepet toplami ayarlama

function calculateTotal() {
  // toplam fiyati hesaplama
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  // urun miktari heaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);
  //miktari html gonderme
  totalCount.innerText = amount + " " + "urun";

  // toplam degeri html gonderme
  totalSpan.innerText = sum;
}

// seppetten urunu silme fonksiyonu
function deleteItem(deleteid) {
  basket = basket.filter((i) => i.id !== deleteid);

  // listeyi guncelle
  renderBasket();

  //toplami guncelle
  calculateTotal();
}
